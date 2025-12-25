use crate::models::{Document, DocumentListItem};
use crate::services::StorageService;
use log::{error, info};
use std::sync::Arc;
use tokio::sync::Mutex;

/// Save a document to disk
#[tauri::command]
pub async fn save_document(
    document: Document,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<String, String> {
    info!("Command: save_document called for {}", document.id);

    let storage = storage.lock().await;
    storage
        .save_document(&document)
        .await
        .map(|_| document.id.clone())
        .map_err(|e| {
            error!("Failed to save document: {}", e);
            String::from(e)
        })
}

/// Load a document from disk
#[tauri::command]
pub async fn load_document(
    document_id: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!("Command: load_document called for {}", document_id);

    let storage = storage.lock().await;
    storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        String::from(e)
    })
}

/// List all documents
#[tauri::command]
pub async fn list_documents(
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Vec<DocumentListItem>, String> {
    info!("Command: list_documents called");

    let storage = storage.lock().await;
    storage.list_documents().await.map_err(|e| {
        error!("Failed to list documents: {}", e);
        String::from(e)
    })
}

/// Delete a document
#[tauri::command]
pub async fn delete_document(
    document_id: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<(), String> {
    info!("Command: delete_document called for {}", document_id);

    let storage = storage.lock().await;
    storage.delete_document(&document_id).await.map_err(|e| {
        error!("Failed to delete document: {}", e);
        String::from(e)
    })
}

/// Create a new empty document
#[tauri::command]
pub async fn create_document(
    title: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!("Command: create_document called with title: {}", title);

    let document = Document::new(title);

    let storage = storage.lock().await;
    storage
        .save_document(&document)
        .await
        .map(|_| document)
        .map_err(|e| {
            error!("Failed to create document: {}", e);
            String::from(e)
        })
}

/// Export a document to a file
#[tauri::command]
pub async fn export_document(
    document_id: String,
    export_path: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<(), String> {
    info!(
        "Command: export_document called for {} to {}",
        document_id, export_path
    );

    let storage = storage.lock().await;
    storage
        .export_document(&document_id, &std::path::PathBuf::from(export_path))
        .await
        .map_err(|e| {
            error!("Failed to export document: {}", e);
            String::from(e)
        })
}

/// Import a document from a file
#[tauri::command]
pub async fn import_document(
    import_path: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!("Command: import_document called from {}", import_path);

    let storage = storage.lock().await;
    storage
        .import_document(&std::path::PathBuf::from(import_path))
        .await
        .map_err(|e| {
            error!("Failed to import document: {}", e);
            String::from(e)
        })
}

/// Check if a document exists
#[tauri::command]
pub async fn document_exists(
    document_id: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<bool, String> {
    let storage = storage.lock().await;
    Ok(storage.document_exists(&document_id))
}

