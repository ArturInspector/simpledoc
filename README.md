# SimpleDoc

Professional-grade document generation and commercial proposal platform. Built for power users who demand precision, speed, and flexibility in document workflows.

## Vision

SimpleDoc is a visual document generation platform inspired by modern video editing tools like CapCut, but designed for business documents and commercial proposals. It combines the precision of template-based generation with the flexibility of dynamic content manipulation.

## Core Philosophy

- **Speed First**: Documents generated in seconds, not minutes
- **Template Power**: Reusable, dynamic templates with intelligent placeholders
- **Content Sections**: Modular content blocks that can be mixed and matched
- **Company Libraries**: Centralized template storage for team consistency
- **Zero Learning Curve**: Intuitive UI that feels natural from day one

## What Makes SimpleDoc Different

Traditional document generators are rigid and slow. SimpleDoc treats document creation like video editing:
- **Timeline-based editing**: See your document structure at a glance
- **Content libraries**: Pre-built sections ready to drop in
- **Smart placeholders**: Context-aware fields that adapt to your data
- **Dynamic templates**: Templates that change based on content type
- **Version control**: Track every change, revert anytime

## Architecture

Built on a rock-solid foundation:
- **Frontend**: Svelte + TailwindCSS (fast, modern, responsive)
- **Backend**: Rust + Tauri (secure, cross-platform, lightweight)
- **Document Engine**: Python (python-docx, reportlab, jinja2)
- **Data Layer**: SQLite (local-first, fast queries)

## Current Status

Active development. Core features implemented:
- Basic template system
- Document generation (.docx, PDF)
- UI framework and layout
- Python integration

## Roadmap

**Phase 1: Foundation** (Current)
- Template management system
- Basic placeholder support
- Document preview
- File operations

**Phase 2: Power Features**
- Content section library
- Dynamic template switching
- Advanced placeholder types (calculations, conditionals)
- Batch generation

**Phase 3: Enterprise**
- Company template libraries
- Team collaboration
- Template marketplace
- API access

## Getting Started

### Requirements

- Rust 1.70+
- Node.js 18+
- Python 3.9+
- Platform-specific dependencies: [Tauri Prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites)

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd desktopapp

# Install frontend dependencies
cd simpledoc
npm install

# Install Python dependencies
cd ../python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run development server
cd ../simpledoc
npm run tauri dev
```

### Production Build

```bash
cd simpledoc
npm run tauri build
```

Binaries will be in `src-tauri/target/release/bundle/`

## Project Structure

```
desktopapp/
├── simpledoc/              # Main application
│   ├── src/                # Svelte frontend
│   ├── src-tauri/          # Rust backend
│   └── static/             # Static assets
├── python/                 # Document generation engine
│   └── document_generator/ # Core generation modules
└── docs/                   # Documentation
```

## Development

### Frontend Development

```bash
cd simpledoc
npm run dev              # Run Vite dev server
npm run build            # Build for production
npm run check            # Type checking
```

### Backend Development

```bash
cd simpledoc/src-tauri
cargo build              # Build Rust backend
cargo test               # Run tests
cargo clippy             # Lint code
```

### Python Development

```bash
cd python
source venv/bin/activate
python -m pytest         # Run tests
python -m black .        # Format code
```

## Contributing

This project follows standard development practices:
- Feature branches for new work
- Conventional commits (feat, fix, docs, refactor, test, chore)
- Code review required
- Tests required for new features

## Technical Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture overview
- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Development roadmap
- [QUICK_START.md](./QUICK_START.md) - Setup guide

## License

MIT

## Support

For issues and feature requests, open an issue on GitHub.

