// Modules
mod commands;
mod models;
mod services;
mod utils;

// Re-exports
use commands::{blocks, document, generator};
use services::{PythonService, StorageService};
use utils::init_logger;

use std::sync::Arc;
use tokio::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logger
    init_logger();
    log::info!("SimpleDoc application starting...");

    // Initialize services
    let storage_dir = StorageService::default_storage_dir();
    let storage_service = StorageService::new(storage_dir)
        .expect("Failed to initialize storage service");
    
    let scripts_dir = PythonService::default_scripts_dir();
    let python_service = PythonService::new(None, scripts_dir)
        .expect("Failed to initialize Python service");

    log::info!("Services initialized successfully");

    // Wrap services in Arc<Mutex<>> for thread-safe sharing
    let storage_state = Arc::new(Mutex::new(storage_service));
    let python_state = Arc::new(Mutex::new(python_service));

    // Build Tauri app
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(storage_state)
        .manage(python_state)
        .invoke_handler(tauri::generate_handler![
            // Document commands
            document::save_document,
            document::load_document,
            document::list_documents,
            document::delete_document,
            document::create_document,
            document::export_document,
            document::import_document,
            document::document_exists,
            // Block commands
            blocks::add_block,
            blocks::update_block,
            blocks::delete_block,
            blocks::reorder_blocks,
            blocks::update_blocks_bulk,
            blocks::get_block,
            // Generator commands
            generator::generate_pdf,
            generator::generate_pdf_from_blocks,
            generator::check_python,
            generator::open_pdf,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
