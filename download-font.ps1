# Quick Font Download & Setup

Write-Host "Property237 - Font Setup" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

# Option 1: Download Satoshi (Free, similar to Craftwork Grotesk)
Write-Host "Downloading Satoshi font (free alternative to Craftwork Grotesk)..." -ForegroundColor Green

$fontDir = "frontend\public\fonts\satoshi"
$zipFile = "satoshi.zip"
$downloadUrl = "https://api.fontshare.com/v2/fonts/download/satoshi"

# Create directory
New-Item -ItemType Directory -Force -Path $fontDir | Out-Null

# Download font
Write-Host "Downloading from FontShare..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile

# Extract
Write-Host "Extracting font files..." -ForegroundColor Yellow
Expand-Archive -Path $zipFile -DestinationPath $fontDir -Force

# Cleanup
Remove-Item $zipFile

Write-Host ""
Write-Host "✅ Font downloaded successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Font files are in: $fontDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check CRAFTWORK_GROTESK_SETUP.md for setup instructions"
Write-Host "2. Update frontend/src/app/layout.tsx (see guide)"
Write-Host "3. Run: cd frontend && npm run dev"
Write-Host ""

# Alternative: Download Craftwork Grotesk manually
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Want the actual Craftwork Grotesk?" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Download from:" -ForegroundColor Yellow
Write-Host "- https://www.fontshare.com/fonts/cabinet-grotesk (Free alternative)"
Write-Host "- https://fonts.adobe.com/fonts/craftwork-grotesk (Adobe Fonts)"
Write-Host "- https://www.myfonts.com/fonts/atipo/craftwork-grotesk/ (Purchase)"
Write-Host ""
Write-Host "Then place .woff2 files in: frontend\public\fonts\craftwork-grotesk\" -ForegroundColor Yellow
Write-Host ""
