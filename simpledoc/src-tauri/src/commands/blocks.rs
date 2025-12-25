use crate::models::{Block, Document};
use crate::services::StorageService;
use log::{error, info};
use std::sync::Arc;
use tokio::sync::Mutex;

/// Add a block to a document
#[tauri::command]
pub async fn add_block(
    document_id: String,
    block: Block,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!("Command: add_block called for document {}", document_id);

    let storage = storage.lock().await;

    // Load document
    let mut document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Validate block
    block.validate().map_err(|e| {
        error!("Block validation failed: {}", e);
        e
    })?;

    // Add block
    document.add_block(block);

    // Save document
    storage.save_document(&document).await.map_err(|e| {
        error!("Failed to save document: {}", e);
        String::from(e)
    })?;

    Ok(document)
}

/// Update a block in a document
#[tauri::command]
pub async fn update_block(
    document_id: String,
    block: Block,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!(
        "Command: update_block called for document {} block {}",
        document_id, block.id
    );

    let storage = storage.lock().await;

    // Load document
    let mut document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Validate block
    block.validate().map_err(|e| {
        error!("Block validation failed: {}", e);
        e
    })?;

    // Update block
    document.update_block(block).map_err(|e| {
        error!("Failed to update block: {}", e);
        e
    })?;

    // Save document
    storage.save_document(&document).await.map_err(|e| {
        error!("Failed to save document: {}", e);
        String::from(e)
    })?;

    Ok(document)
}

/// Delete a block from a document
#[tauri::command]
pub async fn delete_block(
    document_id: String,
    block_id: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!(
        "Command: delete_block called for document {} block {}",
        document_id, block_id
    );

    let storage = storage.lock().await;

    // Load document
    let mut document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Remove block
    document
        .remove_block(&block_id)
        .ok_or_else(|| format!("Block {} not found", block_id))?;

    // Save document
    storage.save_document(&document).await.map_err(|e| {
        error!("Failed to save document: {}", e);
        String::from(e)
    })?;

    Ok(document)
}

/// Reorder blocks in a document
#[tauri::command]
pub async fn reorder_blocks(
    document_id: String,
    block_ids: Vec<String>,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!("Command: reorder_blocks called for document {}", document_id);

    let storage = storage.lock().await;

    // Load document
    let mut document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Update z-index based on order
    for (index, block_id) in block_ids.iter().enumerate() {
        if let Some(block) = document.blocks.iter_mut().find(|b| &b.id == block_id) {
            block.z_index = index as i32;
        }
    }

    // Sort blocks
    document.reorder_blocks();

    // Save document
    storage.save_document(&document).await.map_err(|e| {
        error!("Failed to save document: {}", e);
        String::from(e)
    })?;

    Ok(document)
}

/// Update multiple blocks at once (bulk operation)
#[tauri::command]
pub async fn update_blocks_bulk(
    document_id: String,
    blocks: Vec<Block>,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Document, String> {
    info!(
        "Command: update_blocks_bulk called for document {} with {} blocks",
        document_id,
        blocks.len()
    );

    let storage = storage.lock().await;

    // Load document
    let mut document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Update all blocks
    for block in blocks {
        block.validate().map_err(|e| {
            error!("Block validation failed: {}", e);
            e
        })?;

        document.update_block(block).map_err(|e| {
            error!("Failed to update block: {}", e);
            e
        })?;
    }

    // Save document
    storage.save_document(&document).await.map_err(|e| {
        error!("Failed to save document: {}", e);
        String::from(e)
    })?;

    Ok(document)
}

/// Get a single block from a document
#[tauri::command]
pub async fn get_block(
    document_id: String,
    block_id: String,
    storage: tauri::State<'_, Arc<Mutex<StorageService>>>,
) -> Result<Block, String> {
    info!(
        "Command: get_block called for document {} block {}",
        document_id, block_id
    );

    let storage = storage.lock().await;

    // Load document
    let document = storage.load_document(&document_id).await.map_err(|e| {
        error!("Failed to load document: {}", e);
        e.to_string()
    })?;

    // Find block
    document
        .get_block(&block_id)
        .cloned()
        .ok_or_else(|| format!("Block {} not found", block_id))
}

