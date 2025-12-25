use crate::models::{AppError, Document, DocumentListItem, Result};
use log::{debug, error, info};
use std::fs;
use std::path::{Path, PathBuf};
use tokio::io::{AsyncReadExt, AsyncWriteExt};

/// Service for document storage operations
pub struct StorageService {
    storage_dir: PathBuf,
}

impl StorageService {
    /// Create a new storage service with the given directory
    pub fn new(storage_dir: PathBuf) -> Result<Self> {
        // Ensure storage directory exists
        if !storage_dir.exists() {
            fs::create_dir_all(&storage_dir)?;
            info!("Created storage directory: {:?}", storage_dir);
        }

        Ok(Self { storage_dir })
    }

    /// Get the default storage directory (in user's documents folder)
    pub fn default_storage_dir() -> PathBuf {
        let home = dirs::home_dir().expect("Failed to get home directory");
        home.join("Documents").join("SimpleDoc")
    }

    /// Get the path to a document file
    fn get_document_path(&self, document_id: &str) -> PathBuf {
        self.storage_dir.join(format!("{}.json", document_id))
    }

    /// Save a document to disk (atomic write: temp file + rename)
    pub async fn save_document(&self, document: &Document) -> Result<()> {
        document.validate().map_err(|e| AppError::ValidationError(e))?;

        let path = self.get_document_path(&document.id);
        let temp_path = path.with_extension("json.tmp");

        debug!("Saving document {} to {:?}", document.id, path);

        // Serialize to JSON
        let json = serde_json::to_string_pretty(&document)?;

        // Write to temporary file
        let mut file = tokio::fs::File::create(&temp_path).await?;
        file.write_all(json.as_bytes()).await?;
        file.sync_all().await?;
        drop(file);

        // Atomic rename
        tokio::fs::rename(&temp_path, &path).await?;

        info!("Document {} saved successfully", document.id);
        Ok(())
    }

    /// Load a document from disk
    pub async fn load_document(&self, document_id: &str) -> Result<Document> {
        let path = self.get_document_path(document_id);

        if !path.exists() {
            return Err(AppError::DocumentNotFound(document_id.to_string()));
        }

        debug!("Loading document {} from {:?}", document_id, path);

        let mut file = tokio::fs::File::open(&path).await?;
        let mut contents = String::new();
        file.read_to_string(&mut contents).await?;

        let document: Document = serde_json::from_str(&contents)?;

        info!("Document {} loaded successfully", document_id);
        Ok(document)
    }

    /// List all documents (returns lightweight list items)
    pub async fn list_documents(&self) -> Result<Vec<DocumentListItem>> {
        debug!("Listing documents in {:?}", self.storage_dir);

        let mut documents = Vec::new();

        let mut entries = tokio::fs::read_dir(&self.storage_dir).await?;
        
        while let Some(entry) = entries.next_entry().await? {
            let path = entry.path();
            
            // Only process .json files (not .tmp)
            if path.extension().and_then(|s| s.to_str()) == Some("json") {
                match self.load_document_metadata(&path).await {
                    Ok(item) => documents.push(item),
                    Err(e) => {
                        error!("Failed to load document metadata from {:?}: {}", path, e);
                        continue;
                    }
                }
            }
        }

        // Sort by updated_at (newest first)
        documents.sort_by(|a, b| b.updated_at.cmp(&a.updated_at));

        info!("Found {} documents", documents.len());
        Ok(documents)
    }

    /// Load just the metadata of a document (faster than loading full document)
    async fn load_document_metadata(&self, path: &Path) -> Result<DocumentListItem> {
        let mut file = tokio::fs::File::open(path).await?;
        let mut contents = String::new();
        file.read_to_string(&mut contents).await?;

        let document: Document = serde_json::from_str(&contents)?;
        Ok(DocumentListItem::from(&document))
    }

    /// Delete a document
    pub async fn delete_document(&self, document_id: &str) -> Result<()> {
        let path = self.get_document_path(document_id);

        if !path.exists() {
            return Err(AppError::DocumentNotFound(document_id.to_string()));
        }

        debug!("Deleting document {} at {:?}", document_id, path);
        tokio::fs::remove_file(&path).await?;

        info!("Document {} deleted successfully", document_id);
        Ok(())
    }

    /// Check if a document exists
    pub fn document_exists(&self, document_id: &str) -> bool {
        self.get_document_path(document_id).exists()
    }

    /// Export a document to a specific path
    pub async fn export_document(&self, document_id: &str, export_path: &Path) -> Result<()> {
        let document = self.load_document(document_id).await?;
        let json = serde_json::to_string_pretty(&document)?;

        let mut file = tokio::fs::File::create(export_path).await?;
        file.write_all(json.as_bytes()).await?;
        file.sync_all().await?;

        info!("Document {} exported to {:?}", document_id, export_path);
        Ok(())
    }

    /// Import a document from a file
    pub async fn import_document(&self, import_path: &Path) -> Result<Document> {
        let mut file = tokio::fs::File::open(import_path).await?;
        let mut contents = String::new();
        file.read_to_string(&mut contents).await?;

        let mut document: Document = serde_json::from_str(&contents)?;
        
        // Generate new ID to avoid conflicts
        document.id = uuid::Uuid::new_v4().to_string();
        document.touch();

        // Save the imported document
        self.save_document(&document).await?;

        info!("Document imported from {:?} with new ID {}", import_path, document.id);
        Ok(document)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[tokio::test]
    async fn test_save_and_load_document() {
        let temp_dir = TempDir::new().unwrap();
        let storage = StorageService::new(temp_dir.path().to_path_buf()).unwrap();

        let doc = Document::new("Test Document".to_string());
        let doc_id = doc.id.clone();

        // Save
        storage.save_document(&doc).await.unwrap();
        assert!(storage.document_exists(&doc_id));

        // Load
        let loaded = storage.load_document(&doc_id).await.unwrap();
        assert_eq!(loaded.id, doc_id);
        assert_eq!(loaded.metadata.title, "Test Document");
    }

    #[tokio::test]
    async fn test_delete_document() {
        let temp_dir = TempDir::new().unwrap();
        let storage = StorageService::new(temp_dir.path().to_path_buf()).unwrap();

        let doc = Document::new("Test Document".to_string());
        let doc_id = doc.id.clone();

        storage.save_document(&doc).await.unwrap();
        assert!(storage.document_exists(&doc_id));

        storage.delete_document(&doc_id).await.unwrap();
        assert!(!storage.document_exists(&doc_id));
    }
}

