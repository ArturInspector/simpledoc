use crate::models::{Block, BlockContent, BlockType, Document};

/// Service for validating data structures
pub struct Validator;

impl Validator {
    /// Validate a block
    pub fn validate_block(block: &Block) -> Result<(), String> {
        // Validate dimensions
        if block.size.width <= 0.0 || block.size.height <= 0.0 {
            return Err("Block dimensions must be positive".to_string());
        }

        // Validate position
        if block.position.x < 0.0 || block.position.y < 0.0 {
            return Err("Block position must be non-negative".to_string());
        }

        // Validate z-index
        if block.z_index < 0 {
            return Err("Block z-index must be non-negative".to_string());
        }

        // Validate content matches type
        Self::validate_block_content(&block.block_type, &block.content)?;

        Ok(())
    }

    /// Validate block content matches the block type
    fn validate_block_content(block_type: &BlockType, content: &BlockContent) -> Result<(), String> {
        match (block_type, content) {
            (BlockType::Text, BlockContent::Text(text_content)) => {
                if text_content.font_size <= 0.0 {
                    return Err("Font size must be positive".to_string());
                }
                if text_content.font_family.is_empty() {
                    return Err("Font family cannot be empty".to_string());
                }
                if !Self::is_valid_color(&text_content.color) {
                    return Err(format!("Invalid color: {}", text_content.color));
                }
            }
            (BlockType::Image, BlockContent::Image(image_content)) => {
                if image_content.src.is_empty() {
                    return Err("Image source cannot be empty".to_string());
                }
            }
            (BlockType::Table, BlockContent::Table(table_content)) => {
                if table_content.rows.is_empty() {
                    return Err("Table must have at least one row".to_string());
                }
                
                // Validate all rows have the same number of cells
                let expected_cells = table_content.rows[0].cells.len();
                for (i, row) in table_content.rows.iter().enumerate() {
                    if row.cells.len() != expected_cells {
                        return Err(format!(
                            "Row {} has {} cells, expected {}",
                            i,
                            row.cells.len(),
                            expected_cells
                        ));
                    }
                }

                // Validate column widths
                if !table_content.column_widths.is_empty()
                    && table_content.column_widths.len() != expected_cells
                {
                    return Err("Column widths count must match cell count".to_string());
                }
            }
            (BlockType::Spacer, BlockContent::Spacer) => {
                // Spacer is always valid
            }
            _ => {
                return Err(format!(
                    "Block type {:?} does not match content type",
                    block_type
                ));
            }
        }

        Ok(())
    }

    /// Validate a color string (supports hex, rgb, rgba)
    fn is_valid_color(color: &str) -> bool {
        if color.starts_with('#') {
            // Hex color: #RGB, #RRGGBB, #RRGGBBAA
            let hex = &color[1..];
            matches!(hex.len(), 3 | 6 | 8) && hex.chars().all(|c| c.is_ascii_hexdigit())
        } else if color.starts_with("rgb(") || color.starts_with("rgba(") {
            // RGB/RGBA color (basic check)
            color.ends_with(')')
        } else {
            // Named colors (basic support)
            matches!(
                color.to_lowercase().as_str(),
                "black" | "white" | "red" | "green" | "blue" | "yellow" | "gray" | "transparent"
            )
        }
    }

    /// Validate a document
    pub fn validate_document(document: &Document) -> Result<(), String> {
        // Validate pages
        if document.pages.is_empty() {
            return Err("Document must have at least one page".to_string());
        }

        // Validate all blocks
        for block in &document.blocks {
            Self::validate_block(block)?;
        }

        // Validate metadata
        if document.metadata.title.trim().is_empty() {
            return Err("Document title cannot be empty".to_string());
        }

        Ok(())
    }

    /// Validate page bounds (check if block fits within page)
    pub fn validate_block_in_page_bounds(
        block: &Block,
        page_width: f64,
        page_height: f64,
    ) -> Result<(), String> {
        let right = block.position.x + block.size.width;
        let bottom = block.position.y + block.size.height;

        if right > page_width {
            return Err(format!(
                "Block extends beyond page width ({} > {})",
                right, page_width
            ));
        }

        if bottom > page_height {
            return Err(format!(
                "Block extends beyond page height ({} > {})",
                bottom, page_height
            ));
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::{Position, Size, TextAlignment, TextBlockContent};

    #[test]
    fn test_valid_colors() {
        assert!(Validator::is_valid_color("#000000"));
        assert!(Validator::is_valid_color("#fff"));
        assert!(Validator::is_valid_color("#12345678"));
        assert!(Validator::is_valid_color("rgb(255, 0, 0)"));
        assert!(Validator::is_valid_color("rgba(255, 0, 0, 0.5)"));
        assert!(Validator::is_valid_color("black"));
    }

    #[test]
    fn test_invalid_colors() {
        assert!(!Validator::is_valid_color("#gggggg"));
        assert!(!Validator::is_valid_color("invalid"));
        assert!(!Validator::is_valid_color("#12"));
    }

    #[test]
    fn test_validate_block() {
        let block = Block::new(
            BlockType::Text,
            Position { x: 0.0, y: 0.0 },
            Size {
                width: 100.0,
                height: 50.0,
            },
        );

        assert!(Validator::validate_block(&block).is_ok());
    }

    #[test]
    fn test_validate_block_negative_size() {
        let mut block = Block::new(
            BlockType::Text,
            Position { x: 0.0, y: 0.0 },
            Size {
                width: -100.0,
                height: 50.0,
            },
        );

        assert!(Validator::validate_block(&block).is_err());
    }
}

