#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, 'Vercel');
const requiredFiles = [
    'app.js',
    'index.html',
    'preview.html',
    'preview.js',
    'questions.js',
    'quiz-variants.js',
    'results.js',
    'style.css',
    'vercel.json',
    'README.md'
];
const expectedImageCount = 20;

main();

function main() {
    assert(fs.existsSync(targetDir), 'Vercel 目录不存在，请先运行导出脚本。');
    validateRequiredFiles();
    validateScriptsCompile();
    validateHtmlRefs();
    validateImages();
    validateVercelConfig();
    console.log('Vercel export validation passed.');
}

function validateRequiredFiles() {
    requiredFiles.forEach(file => {
        assert(fs.existsSync(path.join(targetDir, file)), `Vercel/${file} 不存在。`);
    });
}

function validateScriptsCompile() {
    ['questions.js', 'quiz-variants.js', 'results.js', 'app.js', 'preview.js'].forEach(file => {
        const source = fs.readFileSync(path.join(targetDir, file), 'utf8');
        new vm.Script(source, { filename: file });
    });
}

function validateHtmlRefs() {
    const indexHtml = fs.readFileSync(path.join(targetDir, 'index.html'), 'utf8');
    const previewHtml = fs.readFileSync(path.join(targetDir, 'preview.html'), 'utf8');

    assert(indexHtml.includes('href="style.css"'), 'Vercel/index.html 未引用 style.css。');
    assert(indexHtml.includes('src="questions.js"'), 'Vercel/index.html 未引用 questions.js。');
    assert(indexHtml.includes('src="quiz-variants.js"'), 'Vercel/index.html 未引用 quiz-variants.js。');
    assert(indexHtml.includes('src="results.js"'), 'Vercel/index.html 未引用 results.js。');
    assert(indexHtml.includes('src="app.js"'), 'Vercel/index.html 未引用 app.js。');

    assert(previewHtml.includes('href="style.css"'), 'Vercel/preview.html 未引用 style.css。');
    assert(previewHtml.includes('src="quiz-variants.js"'), 'Vercel/preview.html 未引用 quiz-variants.js。');
    assert(previewHtml.includes('src="results.js"'), 'Vercel/preview.html 未引用 results.js。');
    assert(previewHtml.includes('src="preview.js"'), 'Vercel/preview.html 未引用 preview.js。');
}

function validateImages() {
    const photoDir = path.join(targetDir, 'photo');
    assert(fs.existsSync(photoDir), 'Vercel/photo 目录不存在。');

    const jpgFiles = fs.readdirSync(photoDir, { withFileTypes: true })
        .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.jpg');

    assert(
        jpgFiles.length === expectedImageCount,
        `Vercel/photo 中的 JPG 数量应为 ${expectedImageCount}，当前为 ${jpgFiles.length}。`
    );
}

function validateVercelConfig() {
    const configPath = path.join(targetDir, 'vercel.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    assert(config.$schema, 'Vercel/vercel.json 缺少 $schema。');
    assert(config.cleanUrls === true, 'Vercel/vercel.json 应启用 cleanUrls。');
    assert(Array.isArray(config.headers), 'Vercel/vercel.json 应包含 headers 配置。');
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
