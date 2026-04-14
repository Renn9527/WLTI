#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, 'Netlify');
const sourceFiles = [
    'app.js',
    'index.html',
    'preview.html',
    'preview.js',
    'questions.js',
    'quiz-variants.js',
    'results.js',
    'style.css'
];
const imageDirName = 'photo';
const headersContent = [
    '/photo/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin'
].join('\n');
const readmeContent = [
    '# WLTI for Netlify Drop',
    '',
    'This folder is a deployment-ready static snapshot for Netlify Drop.',
    '',
    '## Deploy',
    '',
    '1. Open `https://app.netlify.com/drop`.',
    '2. Drag the entire `Netlify` folder into the dropzone.',
    '3. Wait for Netlify to generate a `*.netlify.app` URL.',
    '',
    '## Included files',
    '',
    '- Main quiz page: `index.html`',
    '- Result preview page: `preview.html`',
    '- Static assets: `photo/*.jpg`',
    '- Netlify headers: `_headers`',
    '',
    'If the root project changes, re-run `node scripts/export-netlify.js` from the repository root to refresh this folder.'
].join('\n');

main();

function main() {
    ensureDirectory(targetDir);
    copySiteFiles();
    copyResultImages();
    writeHeaders();
    writeReadme();
    console.log(`Netlify export updated at ${targetDir}`);
}

function copySiteFiles() {
    sourceFiles.forEach(file => {
        fs.copyFileSync(
            path.join(rootDir, file),
            path.join(targetDir, file)
        );
    });
}

function copyResultImages() {
    const sourcePhotoDir = path.join(rootDir, imageDirName);
    const targetPhotoDir = path.join(targetDir, imageDirName);
    const entries = fs.readdirSync(sourcePhotoDir, { withFileTypes: true });

    ensureDirectory(targetPhotoDir);

    fs.readdirSync(targetPhotoDir, { withFileTypes: true }).forEach(entry => {
        if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.jpg') {
            fs.unlinkSync(path.join(targetPhotoDir, entry.name));
        }
    });

    entries.forEach(entry => {
        if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.jpg') {
            return;
        }

        fs.copyFileSync(
            path.join(sourcePhotoDir, entry.name),
            path.join(targetPhotoDir, entry.name)
        );
    });
}

function writeHeaders() {
    fs.writeFileSync(path.join(targetDir, '_headers'), `${headersContent}\n`, 'utf8');
}

function writeReadme() {
    fs.writeFileSync(path.join(targetDir, 'README.md'), `${readmeContent}\n`, 'utf8');
}

function ensureDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}
