$ErrorActionPreference = "Stop"

$Root = "D:\QuiConvert"
$Source = "$Root\qc-dev"
$BuildRoot = "$Root\build"
$Build = "$BuildRoot\qc-dev"
$Dist = "$Root\dist"
$Zip = "$Dist\qc-dev.zip"

if (Test-Path $Build) {
    Remove-Item $Build -Recurse -Force
}

if (Test-Path $Zip) {
    Remove-Item $Zip -Force
}

New-Item -ItemType Directory -Force -Path $Build | Out-Null

Copy-Item "$Source\*" $Build -Recurse -Force

Compress-Archive `
    -Path $Build `
    -DestinationPath $Zip `
    -Force

Write-Host ""
Write-Host "QC DEV BUILD COMPLETE"
Write-Host $Zip