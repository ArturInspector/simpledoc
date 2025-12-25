use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::models::block::Block;

/// Page size presets
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "UPPERCASE")]
pub enum PageSize {
    A4,
    A3,
    A5,
    Letter,
    Legal,
    Custom { width: f64, height: f64 },
}

impl PageSize {
    /// Get page dimensions in millimeters
    pub fn dimensions_mm(&self) -> (f64, f64) {
        match self {
            PageSize::A4 => (210.0, 297.0),
            PageSize::A3 => (297.0, 420.0),
            PageSize::A5 => (148.0, 210.0),
            PageSize::Letter => (215.9, 279.4),
            PageSize::Legal => (215.9, 355.6),
            PageSize::Custom { width, height } => (*width, *height),
        }
    }

    /// Get page dimensions in pixels (assuming 96 DPI)
    pub fn dimensions_px(&self) -> (f64, f64) {
        let (width_mm, height_mm) = self.dimensions_mm();
        let px_per_mm = 96.0 / 25.4; // 96 DPI to pixels per mm
        (width_mm * px_per_mm, height_mm * px_per_mm)
    }
}

/// Page orientation
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum PageOrientation {
    Portrait,
    Landscape,
}

/// Margins for a page (in millimeters)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageMargins {
    pub top: f64,
    pub right: f64,
    pub bottom: f64,
    pub left: f64,
}

impl Default for PageMargins {
    fn default() -> Self {
        Self {
            top: 20.0,
            right: 20.0,
            bottom: 20.0,
            left: 20.0,
        }
    }
}

/// Page configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Page {
    pub id: String,
    pub size: PageSize,
    pub orientation: PageOrientation,
    pub margins: PageMargins,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background: Option<String>,
}

impl Default for Page {
    fn default() -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            size: PageSize::A4,
            orientation: PageOrientation::Portrait,
            margins: PageMargins::default(),
            background: None,
        }
    }
}

/// Document metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentMetadata {
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
}

impl Default for DocumentMetadata {
    fn default() -> Self {
        let now = Utc::now();
        Self {
            title: "Untitled Document".to_string(),
            description: None,
            author: None,
            tags: None,
            created_at: now,
            updated_at: now,
        }
    }
}

/// Main document structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Document {
    pub id: String,
    pub metadata: DocumentMetadata,
    pub pages: Vec<Page>,
    pub blocks: Vec<Block>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
}

impl Document {
    /// Create a new empty document
    pub fn new(title: String) -> Self {
        let mut metadata = DocumentMetadata::default();
        metadata.title = title;

        Self {
            id: Uuid::new_v4().to_string(),
            metadata,
            pages: vec![Page::default()],
            blocks: vec![],
            version: Some("1.0.0".to_string()),
        }
    }

    /// Update the document's modified timestamp
    pub fn touch(&mut self) {
        self.metadata.updated_at = Utc::now();
    }

    /// Add a block to the document
    pub fn add_block(&mut self, block: Block) {
        self.blocks.push(block);
        self.touch();
    }

    /// Remove a block by ID
    pub fn remove_block(&mut self, block_id: &str) -> Option<Block> {
        if let Some(index) = self.blocks.iter().position(|b| b.id == block_id) {
            self.touch();
            Some(self.blocks.remove(index))
        } else {
            None
        }
    }

    /// Update a block
    pub fn update_block(&mut self, block: Block) -> Result<(), String> {
        if let Some(existing) = self.blocks.iter_mut().find(|b| b.id == block.id) {
            *existing = block;
            self.touch();
            Ok(())
        } else {
            Err(format!("Block with id {} not found", block.id))
        }
    }

    /// Get a block by ID
    pub fn get_block(&self, block_id: &str) -> Option<&Block> {
        self.blocks.iter().find(|b| b.id == block_id)
    }

    /// Reorder blocks by z-index
    pub fn reorder_blocks(&mut self) {
        self.blocks.sort_by_key(|b| b.z_index);
        self.touch();
    }

    /// Validate document structure
    pub fn validate(&self) -> Result<(), String> {
        if self.pages.is_empty() {
            return Err("Document must have at least one page".to_string());
        }

        for block in &self.blocks {
            block.validate()?;
        }

        Ok(())
    }
}

/// Document list item (for listing documents without full content)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentListItem {
    pub id: String,
    pub title: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: DateTime<Utc>,
    #[serde(rename = "updatedAt")]
    pub updated_at: DateTime<Utc>,
    #[serde(rename = "blockCount")]
    pub block_count: usize,
    #[serde(rename = "pageCount")]
    pub page_count: usize,
}

impl From<&Document> for DocumentListItem {
    fn from(doc: &Document) -> Self {
        Self {
            id: doc.id.clone(),
            title: doc.metadata.title.clone(),
            description: doc.metadata.description.clone(),
            created_at: doc.metadata.created_at,
            updated_at: doc.metadata.updated_at,
            block_count: doc.blocks.len(),
            page_count: doc.pages.len(),
        }
    }
}

