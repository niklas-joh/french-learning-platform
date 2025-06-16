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

# --- 4. Start Server ---
Write-Host "Starting server in a new window..."
Set-Location -Path "$scriptDir\server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# --- 5. Start Client ---
Write-Host "Starting client in a new window..."
Set-Location -Path "$scriptDir\client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

# --- 6. Open in Browser ---
Write-Host "Waiting for servers to start..."
Start-Sleep -Seconds 10 # Adjust this delay if servers take longer to start
Write-Host "Opening http://localhost:5173 in your default browser."
Start-Process "http://localhost:5173"

Write-Host "--------------------------------------------------------------------" -ForegroundColor Green
Write-Host "Server and Client are starting in separate PowerShell windows." -ForegroundColor Green
Write-Host "You can monitor their logs in those windows." -ForegroundColor Green
Write-Host "The application should open in your browser shortly." -ForegroundColor Green
Write-Host "--------------------------------------------------------------------" -ForegroundColor Green
