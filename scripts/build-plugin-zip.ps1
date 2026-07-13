$ErrorActionPreference = "Stop"

$Root = "D:\QuiConvert"
$Source = "$Root\frontend-plugin"
$Build = "$Root\build\quiconvert-tools-dev"
$Dist = "$Root\dist"
$Zip = "$Dist\quiconvert-tools-dev.zip"

if (Test-Path "$Root\build") {
    Remove-Item "$Root\build" -Recurse -Force
}

if (!(Test-Path $Dist)) {
    New-Item -ItemType Directory -Path $Dist | Out-Null
}

if (Test-Path $Zip) {
    Remove-Item $Zip -Force
}

New-Item -ItemType Directory -Path $Build | Out-Null

Copy-Item "$Source\*" $Build -Recurse -Force

Compress-Archive -Path $Build -DestinationPath $Zip -Force

Write-Host "Built:"
Write-Host $Zip

