param(
    [string]$ApiBase = "https://quiconvert-backend.onrender.com/api/pdf"
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$ReactSource = Join-Path $Root "frontend-react"
$PluginSource = Join-Path $Root "frontend-plugin"
$BuildRoot = Join-Path $Root "build"
$PackageRoot = Join-Path $BuildRoot "quiconvert-react-tools"
$ReactBuild = Join-Path $PackageRoot "react-build"
$Dist = Join-Path $Root "dist"
$Zip = Join-Path $Dist "quiconvert-react-tools-r15.zip"
$PreviousApiBase = $env:VITE_PDF_API_BASE

try {
    $env:VITE_PDF_API_BASE = $ApiBase.TrimEnd("/")

    Push-Location $ReactSource
    try {
        npm run lint
        npm run build
    }
    finally {
        Pop-Location
    }
}
finally {
    $env:VITE_PDF_API_BASE = $PreviousApiBase
}

$Manifest = Join-Path $ReactSource "dist\.vite\manifest.json"

if (!(Test-Path $Manifest -PathType Leaf)) {
    throw "Vite manifest was not created: $Manifest"
}

if (Test-Path $PackageRoot) {
    Remove-Item $PackageRoot -Recurse -Force
}

if (!(Test-Path $Dist)) {
    New-Item -ItemType Directory -Path $Dist | Out-Null
}

if (Test-Path $Zip) {
    Remove-Item $Zip -Force
}

New-Item -ItemType Directory -Path $PackageRoot | Out-Null
Copy-Item (Join-Path $PluginSource "*") $PackageRoot -Recurse -Force

$BackupFile = Join-Path $PackageRoot "quiconvert-plugin-full-backup.php"
if (Test-Path $BackupFile) {
    Remove-Item $BackupFile -Force
}

New-Item -ItemType Directory -Path $ReactBuild | Out-Null
Copy-Item (Join-Path $ReactSource "dist\*") $ReactBuild -Recurse -Force

Compress-Archive -Path $PackageRoot -DestinationPath $Zip -Force

Write-Host "Built WordPress plugin package:"
Write-Host $Zip
