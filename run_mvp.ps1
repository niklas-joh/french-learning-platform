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

# --- 4. Manual Startup Instructions ---
Write-Host "--------------------------------------------------" -ForegroundColor Green
Write-Host "Setup complete. Please start the servers manually." -ForegroundColor Green
Write-Host "--------------------------------------------------" -ForegroundColor Green
Write-Host ""
Write-Host "Open a NEW PowerShell terminal and run:" -ForegroundColor Yellow
Write-Host "cd '$scriptDir\server'"
Write-Host "npm run dev"
Write-Host ""
Write-Host "Open ANOTHER new PowerShell terminal and run:" -ForegroundColor Yellow
Write-Host "cd '$scriptDir\client'"
Write-Host "npm run dev"
Write-Host ""
Write-Host "After the servers start, open your browser to http://localhost:5173"
Write-Host "If you see any errors, please copy and paste the full output from both terminals."
