param(
  [string]$AlbumDirectory = (Join-Path $PSScriptRoot '..\assets\albums\weekend-walks'),
  [int[]]$Widths = @(480, 960, 1600),
  [int]$Quality = 76
)

$ErrorActionPreference = 'Stop'
$resolvedAlbum = (Resolve-Path -LiteralPath $AlbumDirectory).Path
$ffmpegCommand = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpegCommand) {
  throw 'ffmpeg was not found. Install ffmpeg or add its bin folder to PATH.'
}

$sourceImages = Get-ChildItem -LiteralPath $resolvedAlbum -File |
  Where-Object {
    $_.Extension -in @('.jpg', '.jpeg', '.png') -and
    $_.BaseName -notmatch '-(480|960|1600)$'
  } |
  Sort-Object Name

if (-not $sourceImages) {
  throw "No JPG or PNG source images were found in $resolvedAlbum"
}

foreach ($source in $sourceImages) {
  foreach ($width in $Widths) {
    $output = Join-Path $resolvedAlbum ("{0}-{1}.webp" -f $source.BaseName, $width)
    & $ffmpegCommand.Source `
      -hide_banner `
      -loglevel error `
      -y `
      -i $source.FullName `
      -vf "scale='min($width,iw)':-2:flags=lanczos" `
      -c:v libwebp `
      -quality $Quality `
      -compression_level 6 `
      $output

    if ($LASTEXITCODE -ne 0) {
      throw "Failed to optimize $($source.Name) at $width pixels."
    }
    Write-Host "Created $output"
  }
}
