# This script automates the setup and launch of the French Learning Platform MVP.

# Set script to exit on any error
$ErrorActionPreference = "Stop"

# Get the script's directory
$scriptDir = $PSScriptRoot

# --- 1. Install Server Dependencies ---
Write-Host "Installing server dependencies..."
Set-Location -Path "$scriptDir\server"
npm install

# --- 2. Install Client Dependencies ---
Write-Host "Installing client dependencies..."
Set-Location -Path "$scriptDir\client"
npm install

# --- 3. Initialize Database ---
Write-Host "Initializing database..."
Set-Location -Path $scriptDir
# Ensure ts-node is available
if (-not (Get-Command ts-node -ErrorAction SilentlyContinue)) {
    Write-Host "ts-node not found, installing it globally..."
    npm install -g ts-node
}
npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/init-db.ts

# --- 4. Run Application ---
Write-Host "Starting backend and frontend servers in new windows..."

# Start Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$scriptDir\server'; npm run dev"

# Start Client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -Path '$scriptDir\client'; npm run dev"

# --- 5. Open Application in Browser ---
Write-Host "Opening application in the default browser..."
Start-Sleep -Seconds 5 # Wait a few seconds for the dev server to be ready
Start-Process "http://localhost:5173"

Write-Host "Setup complete. The application is starting."
