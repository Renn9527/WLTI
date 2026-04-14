#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, 'Vercel');
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
const vercelConfig = {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    cleanUrls: true,
    trailingSlash: false,
    headers: [
        {
            source: '/photo/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable'
                }
            ]
        },
        {
            source: '/(.*)',
            headers: [
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff'
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin'
                }
            ]
        }
    ]
};
const readmeContent = [
    '# WLTI for Vercel',
    '',
    'This folder is a deployment-ready static snapshot for Vercel.',
    '',
    '## Deploy settings',
    '',
    '- Framework Preset: `Other`',
    '- Root Directory: `Vercel`',
    '- Build Command: leave empty',
    '- Output Directory: leave empty',
    '',
    '## Included files',
    '',
    '- Main quiz page: `index.html`',
    '- Result preview page: `preview.html`',
    '- Static assets: `photo/*.jpg`',
    '- Vercel config: `vercel.json`',
    '',
    'If the root project changes, re-run `node scripts/export-vercel.js` from the repository root to refresh this folder.'
].join('\n');

main();

function main() {
    ensureDirectory(targetDir);
    copySiteFiles();
    copyResultImages();
    writeVercelConfig();
    writeReadme();
    console.log(`Vercel export updated at ${targetDir}`);
}

function copySiteFiles() {
    sourceFiles.forEach(file => {
        const sourcePath = path.join(rootDir, file);
        const targetPath = path.join(targetDir, file);
        fs.copyFileSync(sourcePath, targetPath);
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

function writeVercelConfig() {
    const configPath = path.join(targetDir, 'vercel.json');
    fs.writeFileSync(configPath, `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
}

function writeReadme() {
    const readmePath = path.join(targetDir, 'README.md');
    fs.writeFileSync(readmePath, `${readmeContent}\n`, 'utf8');
}

function ensureDirectory(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}
