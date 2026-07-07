$ErrorActionPreference = "Stop"

$PluginDir = "frontend-plugin"
$Version = "7.0.0-dev"
$OutputDir = "dist"
$Output = "$OutputDir/quiconvert-tools-$Version.zip"

if (!(Test-Path $PluginDir)) {
    throw "Plugin folder not found: $PluginDir"
}

if (!(Test-Path "$PluginDir/quiconvert-plugin.php")) {
    throw "Main plugin file not found: $PluginDir/quiconvert-plugin.php"
}

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

if (Test-Path $Output) {
    Remove-Item $Output -Force
}

Compress-Archive -Path "$PluginDir" -DestinationPath $Output -Force

Write-Host "Built $Output"

