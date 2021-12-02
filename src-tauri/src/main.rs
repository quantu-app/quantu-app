#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use tauri_utils::config::{AppUrl, WindowUrl};

#[tokio::main]
async fn main() {
  let port = port_scanner::request_open_port().unwrap_or(0);
  println!("Port: {}", port);
  let envs = HashMap::from([("PORT".to_string(), port.to_string())]);
  let (mut rx, _child) = tauri::api::process::Command::new_sidecar("app")
    .expect("Failed to create `Quant[U] Server` binary command")
    .envs(envs)
    .spawn()
    .expect("Failed to spawn Quant[U] Server");

  while let Some(event) = rx.recv().await {
    if let tauri::api::process::CommandEvent::Stdout(line) = event {
      if line.starts_with(&format!("Listening on 0.0.0.0:{}", port)) {
        break;
      }
    }
  }

  let mut context = tauri::generate_context!("tauri.conf.json");
  let mut config = context.config_mut();

  let app_url = AppUrl::Url(WindowUrl::External(
    url::Url::parse(&format!("http://0.0.0.0:{}", port))
      .expect("Failed to create Url for Quant[U] Server"),
  ));
  config.build.dev_path = app_url.clone();
  config.build.dist_dir = app_url;

  tauri::Builder::default()
    .run(context)
    .expect("Error while starting Quant[U] application");
}
