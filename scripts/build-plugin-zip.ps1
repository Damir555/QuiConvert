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
$Zip = Join-Path $Dist "quiconvert-react-tools.zip"
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

$Tar = Get-Command "tar.exe" -ErrorAction Stop

# Windows Compress-Archive stores backslashes in ZIP entry names. Some Linux
# hosts treat those as literal filename characters instead of directory
# separators. bsdtar writes portable forward-slash paths.
& $Tar.Source -a -c -f $Zip -C $BuildRoot "quiconvert-react-tools"

if ($LASTEXITCODE -ne 0) {
    throw "Could not create WordPress plugin ZIP."
}

$Entries = @(& $Tar.Source -tf $Zip)

if ($LASTEXITCODE -ne 0) {
    throw "Could not inspect WordPress plugin ZIP."
}

if ($Entries | Where-Object { $_ -match '\\' }) {
    throw "Plugin ZIP contains non-portable backslash paths."
}

$RequiredEntries = @(
    "quiconvert-react-tools/quiconvert-plugin.php",
    "quiconvert-react-tools/includes/class-react-loader.php",
    "quiconvert-react-tools/includes/class-seo-tool-pages.php",
    "quiconvert-react-tools/includes/class-seo-category-pages.php",
    "quiconvert-react-tools/includes/class-seo-blog-index.php",
    "quiconvert-react-tools/includes/class-seo-blog-article.php",
    "quiconvert-react-tools/react-build/.vite/manifest.json"
)

foreach ($RequiredEntry in $RequiredEntries) {
    if ($Entries -notcontains $RequiredEntry) {
        throw "Plugin ZIP is missing required entry: $RequiredEntry"
    }
}

Write-Host "Built WordPress plugin package:"
Write-Host $Zip
