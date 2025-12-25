use env_logger::{Builder, Target};
use log::LevelFilter;
use std::io::Write;

/// Initialize the application logger with appropriate settings
/// 
/// In development: logs to stdout with DEBUG level
/// In production: logs to stdout with INFO level
pub fn init_logger() {
    let mut builder = Builder::new();
    
    builder
        .target(Target::Stdout)
        .format(|buf, record| {
            writeln!(
                buf,
                "[{} {} {}:{}] {}",
                chrono::Local::now().format("%Y-%m-%d %H:%M:%S"),
                record.level(),
                record.file().unwrap_or("unknown"),
                record.line().unwrap_or(0),
                record.args()
            )
        });

    // Set log level based on build configuration
    #[cfg(debug_assertions)]
    builder.filter_level(LevelFilter::Debug);
    
    #[cfg(not(debug_assertions))]
    builder.filter_level(LevelFilter::Info);

    // Initialize the logger
    builder.init();
    
    log::info!("Logger initialized successfully");
}

