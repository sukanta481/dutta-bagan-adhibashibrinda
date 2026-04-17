<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

$year = isset($_GET['year']) ? preg_replace('/[^0-9]/', '', $_GET['year']) : null;

$base = __DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'images';
$root = null;
$rootUrl = null;
foreach (['Gallery', 'gallery'] as $candidate) {
    if (is_dir($base . DIRECTORY_SEPARATOR . $candidate)) {
        $root = $base . DIRECTORY_SEPARATOR . $candidate;
        $rootUrl = 'assets/images/' . $candidate . '/';
        break;
    }
}
$exts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$images = [];

function collectYear($yearDir, $yearName, $rootUrl, $exts) {
    $out = [];
    if (!is_dir($yearDir)) return $out;
    $dir = new DirectoryIterator($yearDir);
    foreach ($dir as $file) {
        if ($file->isDot() || !$file->isFile()) continue;
        $ext = strtolower($file->getExtension());
        if (!in_array($ext, $exts, true)) continue;
        $fname = $file->getFilename();
        $full = $rootUrl . $yearName . '/' . $fname;
        $thumbName = preg_replace('/\.[^.]+$/', '.webp', $fname);
        $thumbPath = $yearDir . DIRECTORY_SEPARATOR . 'thumbs' . DIRECTORY_SEPARATOR . $thumbName;
        $thumbUrl = is_file($thumbPath)
            ? $rootUrl . $yearName . '/thumbs/' . rawurlencode($thumbName)
            : $full;
        $out[] = ['thumb' => $thumbUrl, 'full' => $full];
    }
    return $out;
}

if ($root !== null) {
    if ($year !== null && is_dir($root . DIRECTORY_SEPARATOR . $year)) {
        $images = collectYear($root . DIRECTORY_SEPARATOR . $year, $year, $rootUrl, $exts);
    } else {
        $years = new DirectoryIterator($root);
        foreach ($years as $yearEntry) {
            if ($yearEntry->isDot() || !$yearEntry->isDir()) continue;
            $yearName = $yearEntry->getFilename();
            $images = array_merge(
                $images,
                collectYear($yearEntry->getPathname(), $yearName, $rootUrl, $exts)
            );
        }
    }
}

shuffle($images);
echo json_encode($images);
