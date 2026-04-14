<?php
header('Content-Type: application/json');
header('Cache-Control: no-store');

$root = __DIR__ . DIRECTORY_SEPARATOR . 'assets' . DIRECTORY_SEPARATOR . 'images' . DIRECTORY_SEPARATOR . 'gallery';
$exts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
$images = [];

if (is_dir($root)) {
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $file) {
        if (!$file->isFile()) continue;
        $ext = strtolower($file->getExtension());
        if (!in_array($ext, $exts, true)) continue;
        $rel = 'assets/images/gallery/' . str_replace(DIRECTORY_SEPARATOR, '/', substr($file->getPathname(), strlen($root) + 1));
        $images[] = $rel;
    }
}

shuffle($images);
echo json_encode($images);
