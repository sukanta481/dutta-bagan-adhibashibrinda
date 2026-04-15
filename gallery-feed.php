<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

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

if ($root !== null) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if (!$file->isFile()) continue;
        $ext = strtolower($file->getExtension());
        if (!in_array($ext, $exts, true)) continue;
        $rel = $rootUrl . str_replace(DIRECTORY_SEPARATOR, '/', substr($file->getPathname(), strlen($root) + 1));
        $images[] = $rel;
    }
}

shuffle($images);
echo json_encode($images);
