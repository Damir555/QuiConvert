$PluginDir = "frontend-plugin"
$Version = "5.1.3"
$Output = "dist/quiconvert-plugin-$Version.zip"

New-Item -ItemType Directory -Force -Path "dist" | Out-Null

if (Test-Path $Output) {
    Remove-Item $Output
}

Compress-Archive -Path "$PluginDir/*" -DestinationPath $Output

Write-Host "Built $Output"
