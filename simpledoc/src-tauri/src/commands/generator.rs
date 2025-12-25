use crate::models::Block;
use crate::services::{PythonService, StorageService};
use log::{error, info};
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;

/// Response for PDF generation
#[derive(serde::Serialize, serde::Deserialize)]
pub struct GeneratePdfResponse {
    pub pdf_path: String,
    pub success: bool,
    pub message: String,
}

/// Generate PDF from a document
#[tauri::command]
pub async fn generate_pdf(
    document_id: String,
    output_path: Option<String>,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
    python: tauri::State<'_, Arc<Mutex<PythonService>>>,
) -> Result<GeneratePdfResponse, String> {
    info!("Command: generate_pdf called for document {}", document_id);

    let storage = storage.lock().await;

    // Load document
    let document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Determine output path
    let output_path = if let Some(path) = output_path {
        PathBuf::from(path)
    } else {
        // Default to Documents/SimpleDoc/exports/
        let export_dir = dirs::home_dir()
            .expect("Failed to get home directory")
            .join("Documents")
            .join("SimpleDoc")
            .join("exports");

        // Create directory if it doesn't exist
        if !export_dir.exists() {
            std::fs::create_dir_all(&export_dir).map_err(|e| {
                error!("Failed to create export directory: {}", e);
                e.to_string()
            })?;
        }

        let filename = format!("{}.pdf", document.metadata.title.replace(' ', "_"));
        export_dir.join(filename)
    };

    info!("PDF will be generated at: {:?}", output_path);

    // Get page dimensions
    let page = document.pages.first().ok_or("Document has no pages")?;
    let (width_mm, height_mm) = page.size.dimensions_mm();

    // Generate PDF using Python
    let python = python.lock().await;
    let pdf_path = python
        .generate_pdf(&document.blocks, &output_path, width_mm, height_mm)
        .await
        .map_err(|e| {
            error!("PDF generation failed: {}", e);
            e.to_string()
        })?;

    info!("PDF generated successfully at: {:?}", pdf_path);

    Ok(GeneratePdfResponse {
        pdf_path: pdf_path.to_string_lossy().to_string(),
        success: true,
        message: "PDF generated successfully".to_string(),
    })
}

/// Generate PDF from blocks (without loading from document)
#[tauri::command]
pub async fn generate_pdf_from_blocks(
    blocks: Vec<Block>,
    output_path: String,
    page_width_mm: f64,
    page_height_mm: f64,
    python: tauri::State<'_, Arc<Mutex<PythonService>>>,
) -> Result<GeneratePdfResponse, String> {
    info!(
        "Command: generate_pdf_from_blocks called with {} blocks",
        blocks.len()
    );

    let output_path = PathBuf::from(output_path);

    // Generate PDF using Python
    let python = python.lock().await;
    let pdf_path = python
        .generate_pdf(&blocks, &output_path, page_width_mm, page_height_mm)
        .await
        .map_err(|e| {
            error!("PDF generation failed: {}", e);
            e.to_string()
        })?;

    info!("PDF generated successfully at: {:?}", pdf_path);

    Ok(GeneratePdfResponse {
        pdf_path: pdf_path.to_string_lossy().to_string(),
        success: true,
        message: "PDF generated successfully".to_string(),
    })
}

/// Check if Python is available
#[tauri::command]
pub async fn check_python(
    python: tauri::State<'_, Arc<Mutex<PythonService>>>,
) -> Result<String, String> {
    info!("Command: check_python called");

    let python = python.lock().await;
    python.check_python().await.map_err(|e| {
        error!("Python check failed: {}", e);
        e.to_string()
    })
}

/// Open the generated PDF file
#[tauri::command]
pub async fn open_pdf(pdf_path: String) -> Result<(), String> {
    info!("Command: open_pdf called for {}", pdf_path);

    let path = PathBuf::from(pdf_path);
    if !path.exists() {
        return Err("PDF file not found".to_string());
    }

    // Open with default system viewer
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("cmd")
            .args(&["/C", "start", "", path.to_str().unwrap()])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    info!("PDF opened successfully");
    Ok(())
}

