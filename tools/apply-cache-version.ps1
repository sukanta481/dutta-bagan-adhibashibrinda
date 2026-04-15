$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$versionFile = Join-Path $root 'cache-version.txt'

if (-not (Test-Path $versionFile)) {
  throw "Missing cache-version.txt at $versionFile"
}

$version = (Get-Content -Raw -Path $versionFile).Trim()
if ([string]::IsNullOrWhiteSpace($version)) {
  throw 'cache-version.txt is empty'
}

Write-Host "Applying cache version: $version"

# Update local CSS/JS references in all top-level HTML pages.
Get-ChildItem -Path $root -Filter '*.html' | ForEach-Object {
  $path = $_.FullName
  $content = Get-Content -Raw -Path $path

  $updated = [regex]::Replace(
    $content,
    'assets/(css/main\.css|js/[A-Za-z0-9._-]+\.js)(\?v=[^"''\s>]*)?',
    { param($m) "assets/$($m.Groups[1].Value)?v=$version" }
  )

  if ($updated -ne $content) {
    Set-Content -Path $path -Value $updated -NoNewline
    Write-Host "Updated: $($_.Name)"
  }
}

# Keep layout loader partial-fetch version aligned.
$layoutLoader = Join-Path $root 'assets\js\layout-loader.js'
if (Test-Path $layoutLoader) {
  $layoutContent = Get-Content -Raw -Path $layoutLoader
  $layoutUpdated = [regex]::Replace(
    $layoutContent,
    "const\s+LAYOUT_VERSION\s*=\s*'[^']*';",
    "const LAYOUT_VERSION = '$version';"
  )

  if ($layoutUpdated -ne $layoutContent) {
    Set-Content -Path $layoutLoader -Value $layoutUpdated -NoNewline
    Write-Host 'Updated: assets/js/layout-loader.js'
  }
}

Write-Host 'Cache version apply complete.'
