use thiserror::Error;

/// Custom error type for the application
#[derive(Error, Debug)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("Document not found: {0}")]
    DocumentNotFound(String),

    #[error("Block not found: {0}")]
    BlockNotFound(String),

    #[error("Invalid data: {0}")]
    InvalidData(String),

    #[error("Python execution error: {0}")]
    PythonError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Unknown error: {0}")]
    Unknown(String),
}

/// Result type alias for the application
pub type Result<T> = std::result::Result<T, AppError>;

impl AppError {
    /// Convert error to user-friendly string for frontend
    pub fn to_user_message(&self) -> String {
        match self {
            AppError::DocumentNotFound(id) => format!("Document '{}' not found", id),
            AppError::BlockNotFound(id) => format!("Block '{}' not found", id),
            AppError::InvalidData(msg) => format!("Invalid data: {}", msg),
            AppError::PythonError(msg) => format!("PDF generation failed: {}", msg),
            AppError::ValidationError(msg) => format!("Validation error: {}", msg),
            _ => "An unexpected error occurred".to_string(),
        }
    }
}

/// Convert AppError to String for Tauri command results
impl From<AppError> for String {
    fn from(error: AppError) -> Self {
        error.to_user_message()
    }
}

