
# deploy-auto.ps1 adapté pour projet spécifique

Write-Host "Starting automated deployment..." -ForegroundColor Green

# Demander le message de commit
$message = Read-Host "Message de commit"

# Si l'utilisateur n'écrit rien, message par défaut avec timestamp
if ([string]::IsNullOrWhiteSpace($message)) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $message = "Auto-deploy $timestamp"
    Write-Host "Message par défaut utilisé: $message" -ForegroundColor Yellow
}

# Push to Google Apps Script
Write-Host "Pushing to Google Apps Script..." -ForegroundColor Yellow
clasp push
if ($LASTEXITCODE -ne 0) {
    Write-Host "clasp push failed!" -ForegroundColor Red
    exit 1
}

# Git add all changes
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .

# Git commit with custom message
Write-Host "Committing changes: $message" -ForegroundColor Yellow
git commit -m $message
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing new to commit" -ForegroundColor Blue
}

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

# Deploy to Google Apps Script with specific deployment ID
Write-Host "Deploying to Google Apps Script..." -ForegroundColor Yellow
clasp deploy -i AKfycbzm4fmWu41vXRFJLnJQSWXNlGxxDwhue73q0rDVjV1xsk-rl47vE1kq0tLep1Q2nz3D

if ($LASTEXITCODE -eq 0) {
    Write-Host "Everything deployed successfully!" -ForegroundColor Green
    Write-Host "Commit message was: $message" -ForegroundColor Cyan
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
}
