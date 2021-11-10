#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashMap;
use tauri_utils::config::{AppUrl, WindowUrl};

fn main() {
  let port = port_scanner::request_open_port().unwrap_or(0);
  let envs = HashMap::from([("PORT".to_string(), port.to_string())]);
  let (_rx, _child) = tauri::api::process::Command::new_sidecar("app")
    .expect("Failed to create `Quant[U] Server` binary command")
    .envs(envs)
    .spawn()
    .expect("Failed to spawn Quant[U] Server");

  let mut context = tauri::generate_context!("tauri.conf.json");
  let mut config = context.config_mut();

  config.build.dist_dir = AppUrl::Url(WindowUrl::External(
    url::Url::parse(&format!("http://localhost:{}", port))
      .expect("Failed to create Url for Quant[U] Server"),
  ));

  tauri::Builder::default()
    .run(context)
    .expect("Error while starting Quant[U] application");
}
