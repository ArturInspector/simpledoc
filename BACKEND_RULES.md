# Backend Development Rules (Rust)

## Architecture Principles

**Tauri command structure:**
- Place commands in `src-tauri/src/commands.rs` or separate modules
- Use `#[tauri::command]` attribute for all frontend-callable functions
- Return `Result<T, String>` for error handling
- Keep commands focused and single-purpose

**Module organization:**
- Separate concerns: commands.rs, models.rs, python.rs, storage.rs
- Use mod.rs for module declarations
- Keep main.rs minimal (only Tauri setup)

## Error Handling

**Rust best practices:**
- Use `Result<T, E>` for all fallible operations
- Convert errors to user-friendly messages before returning to frontend
- Use `anyhow` or `thiserror` for error types
- Never panic in production code, use proper error propagation
- Log errors with appropriate levels (error!, warn!, info!)

## Type Safety

**Strong typing:**
- Define all data structures in models.rs
- Use serde for serialization (Serialize, Deserialize)
- Validate input data before processing
- Use Option<T> for nullable values, not null checks

## Performance

**Optimization guidelines:**
- Use references (&str, &[T]) instead of owned values when possible
- Prefer Vec<T> over Vec<Box<T>> when size allows
- Use async/await for I/O operations (file system, Python subprocess)
- Cache expensive computations when appropriate
- Use Arc<T> for shared immutable data across threads

## Python Integration

**Subprocess approach:**
- Use std::process::Command for Python script execution
- Validate Python path and script existence before execution
- Set timeouts for long-running Python operations
- Parse JSON responses from Python scripts
- Handle Python errors gracefully with clear error messages

## File System Operations

**Safe file handling:**
- Use Tauri's fs API when possible for security
- Validate file paths to prevent directory traversal
- Check file existence before operations
- Use atomic writes for critical data (write to temp, then rename)
- Handle file permissions and errors explicitly

## Code Quality

**Rust conventions:**
- Follow rustfmt formatting (run cargo fmt)
- Use clippy lints (run cargo clippy -- -W clippy::all)
- Write doc comments for public functions
- Use meaningful variable and function names
- Keep functions under 50 lines when possible
- Extract complex logic into helper functions

## Testing

**Test coverage:**
- Write unit tests for business logic
- Use #[cfg(test)] for test modules
- Test error cases, not just happy paths
- Mock external dependencies (file system, Python) in tests

