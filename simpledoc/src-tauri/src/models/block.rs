use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Types of blocks available in the editor
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum BlockType {
    Text,
    Image,
    Table,
    Spacer,
}

/// Position of a block on the canvas (in pixels from top-left)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub x: f64,
    pub y: f64,
}

/// Size of a block (in pixels)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Size {
    pub width: f64,
    pub height: f64,
}

/// Content for text blocks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextBlockContent {
    pub text: String,
    #[serde(rename = "fontSize")]
    pub font_size: f64,
    #[serde(rename = "fontFamily")]
    pub font_family: String,
    #[serde(rename = "fontWeight")]
    pub font_weight: u16,
    pub color: String,
    pub alignment: TextAlignment,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TextAlignment {
    Left,
    Center,
    Right,
    Justify,
}

/// Content for image blocks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ImageBlockContent {
    /// Path to file or base64 encoded image
    pub src: String,
    pub alt: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fit: Option<ImageFit>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ImageFit {
    Cover,
    Contain,
    Fill,
    None,
}

/// Content for table blocks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TableBlockContent {
    pub rows: Vec<TableRow>,
    #[serde(rename = "columnWidths")]
    pub column_widths: Vec<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TableRow {
    pub cells: Vec<TableCell>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TableCell {
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub styles: Option<CellStyles>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CellStyles {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bold: Option<bool>,
}

/// Union type for block content
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum BlockContent {
    Text(TextBlockContent),
    Image(ImageBlockContent),
    Table(TableBlockContent),
    Spacer,
}

/// Styles that can be applied to blocks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockStyles {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub background: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub border: Option<BorderStyle>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub padding: Option<Padding>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub shadow: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub opacity: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BorderStyle {
    pub width: f64,
    pub color: String,
    pub style: String, // solid, dashed, dotted
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Padding {
    pub top: f64,
    pub right: f64,
    pub bottom: f64,
    pub left: f64,
}

/// Main block structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    pub id: String,
    #[serde(rename = "type")]
    pub block_type: BlockType,
    pub position: Position,
    pub size: Size,
    pub content: BlockContent,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub styles: Option<BlockStyles>,
    #[serde(rename = "zIndex")]
    pub z_index: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub locked: Option<bool>,
}

impl Block {
    /// Create a new block with default values
    pub fn new(block_type: BlockType, position: Position, size: Size) -> Self {
        let content = match block_type {
            BlockType::Text => BlockContent::Text(TextBlockContent {
                text: String::new(),
                font_size: 16.0,
                font_family: "Inter".to_string(),
                font_weight: 400,
                color: "#000000".to_string(),
                alignment: TextAlignment::Left,
            }),
            BlockType::Image => BlockContent::Image(ImageBlockContent {
                src: String::new(),
                alt: String::new(),
                fit: Some(ImageFit::Contain),
            }),
            BlockType::Table => BlockContent::Table(TableBlockContent {
                rows: vec![],
                column_widths: vec![],
            }),
            BlockType::Spacer => BlockContent::Spacer,
        };

        Self {
            id: Uuid::new_v4().to_string(),
            block_type,
            position,
            size,
            content,
            styles: None,
            z_index: 0,
            locked: None,
        }
    }

    /// Validate block data
    pub fn validate(&self) -> Result<(), String> {
        if self.size.width <= 0.0 || self.size.height <= 0.0 {
            return Err("Block size must be positive".to_string());
        }

        if self.position.x < 0.0 || self.position.y < 0.0 {
            return Err("Block position must be non-negative".to_string());
        }

        Ok(())
    }
}

