use crate::models::{AppError, Block, Result};
use log::{debug, error, info};
use std::path::PathBuf;
use std::process::Stdio;
use tokio::process::Command;
use tokio::time::{timeout, Duration};

/// Service for Python script execution
pub struct PythonService {
    python_path: PathBuf,
    scripts_dir: PathBuf,
}

impl PythonService {
    /// Create a new Python service
    pub fn new(python_path: Option<PathBuf>, scripts_dir: PathBuf) -> Result<Self> {
        let python_path = python_path.unwrap_or_else(|| {
            // Try to find Python in PATH
            #[cfg(target_os = "windows")]
            let default_python = PathBuf::from("python");
            #[cfg(not(target_os = "windows"))]
            let default_python = PathBuf::from("python3");

            default_python
        });

        if !scripts_dir.exists() {
            return Err(AppError::PythonError(format!(
                "Scripts directory does not exist: {:?}",
                scripts_dir
            )));
        }

        Ok(Self {
            python_path,
            scripts_dir,
        })
    }

    /// Get the default scripts directory
    pub fn default_scripts_dir() -> PathBuf {
        // Assuming scripts are in the project root/python directory
        PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("Failed to get parent directory")
            .parent()
            .expect("Failed to get project root")
            .join("python")
    }

    /// Execute a Python script with arguments
    /// 
    /// # Arguments
    /// * `script_name` - Name of the Python script (e.g., "pdf_generator.py")
    /// * `args` - Arguments to pass to the script
    /// * `timeout_secs` - Timeout in seconds (default: 60)
    pub async fn execute_script(
        &self,
        script_name: &str,
        args: &[String],
        timeout_secs: u64,
    ) -> Result<String> {
        let script_path = self.scripts_dir.join(script_name);

        if !script_path.exists() {
            return Err(AppError::PythonError(format!(
                "Script not found: {:?}",
                script_path
            )));
        }

        debug!(
            "Executing Python script: {:?} with args: {:?}",
            script_path, args
        );

        let child = Command::new(&self.python_path)
            .arg(&script_path)
            .args(args)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| {
                AppError::PythonError(format!("Failed to spawn Python process: {}", e))
            })?;

        // Wait for completion with timeout
        let result = timeout(
            Duration::from_secs(timeout_secs),
            async {
                let output = child.wait_with_output().await?;
                Ok::<_, std::io::Error>(output)
            }
        )
        .await;

        match result {
            Ok(Ok(output)) => {
                let stdout = String::from_utf8_lossy(&output.stdout).to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).to_string();

                if output.status.success() {
                    debug!("Python script completed successfully");
                    Ok(stdout.trim().to_string())
                } else {
                    error!("Python script failed: {}", stderr);
                    Err(AppError::PythonError(format!(
                        "Script execution failed: {}",
                        stderr
                    )))
                }
            }
            Ok(Err(e)) => Err(AppError::PythonError(format!(
                "Failed to execute script: {}",
                e
            ))),
            Err(_) => {
                Err(AppError::PythonError(format!(
                    "Script execution timed out after {} seconds",
                    timeout_secs
                )))
            }
        }
    }

    /// Execute a Python script with JSON input/output
    /// 
    /// This is useful for passing complex data structures
    pub async fn execute_script_json<T: serde::Serialize, R: serde::de::DeserializeOwned>(
        &self,
        script_name: &str,
        input_data: &T,
        timeout_secs: u64,
    ) -> Result<R> {
        // Serialize input to JSON
        let input_json = serde_json::to_string(input_data)
            .map_err(|e| AppError::Serialization(e))?;

        // Execute script with JSON as argument
        let output = self
            .execute_script(script_name, &[input_json], timeout_secs)
            .await?;

        // Parse output as JSON
        serde_json::from_str(&output).map_err(|e| {
            AppError::PythonError(format!("Failed to parse Python output as JSON: {}", e))
        })
    }

    /// Generate PDF from blocks using Python
    pub async fn generate_pdf(
        &self,
        blocks: &[Block],
        output_path: &PathBuf,
        page_width_mm: f64,
        page_height_mm: f64,
    ) -> Result<PathBuf> {
        info!("Generating PDF with {} blocks", blocks.len());

        // Prepare data for Python script
        let data = serde_json::json!({
            "blocks": blocks,
            "output_path": output_path.to_string_lossy(),
            "page_width_mm": page_width_mm,
            "page_height_mm": page_height_mm,
        });

        // Execute PDF generation script
        let result: serde_json::Value = self
            .execute_script_json("document_generator/pdf_generator.py", &data, 120)
            .await?;

        // Extract output path from result
        if let Some(pdf_path) = result.get("pdf_path").and_then(|v| v.as_str()) {
            let path = PathBuf::from(pdf_path);
            if path.exists() {
                info!("PDF generated successfully: {:?}", path);
                Ok(path)
            } else {
                Err(AppError::PythonError(
                    "PDF was not created at expected path".to_string(),
                ))
            }
        } else {
            Err(AppError::PythonError(
                "Invalid response from PDF generator".to_string(),
            ))
        }
    }

    /// Check if Python is available and working
    pub async fn check_python(&self) -> Result<String> {
        let output = Command::new(&self.python_path)
            .arg("--version")
            .output()
            .await
            .map_err(|e| {
                AppError::PythonError(format!("Python not found or not executable: {}", e))
            })?;

        let version = String::from_utf8_lossy(&output.stdout).to_string();
        Ok(version.trim().to_string())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_check_python() {
        let service = PythonService::new(None, PathBuf::from(".")).unwrap();
        let result = service.check_python().await;
        
        // This test will fail if Python is not installed, which is expected
        if result.is_ok() {
            println!("Python version: {}", result.unwrap());
        }
    }
}

