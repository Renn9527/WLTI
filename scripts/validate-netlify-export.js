#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const targetDir = path.join(rootDir, 'Netlify');
const requiredFiles = [
    'app.js',
    'index.html',
    'preview.html',
    'preview.js',
    'questions.js',
    'quiz-variants.js',
    'results.js',
    'style.css',
    'README.md',
    '_headers'
];
const expectedImageCount = 20;

main();

function main() {
    assert(fs.existsSync(targetDir), 'Netlify 目录不存在，请先运行导出脚本。');
    validateRequiredFiles();
    validateScriptsCompile();
    validateHtmlRefs();
    validateImages();
    validateHeaders();
    console.log('Netlify export validation passed.');
}

function validateRequiredFiles() {
    requiredFiles.forEach(file => {
        assert(fs.existsSync(path.join(targetDir, file)), `Netlify/${file} 不存在。`);
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

    assert(indexHtml.includes('href="style.css"'), 'Netlify/index.html 未引用 style.css。');
    assert(indexHtml.includes('src="questions.js"'), 'Netlify/index.html 未引用 questions.js。');
    assert(indexHtml.includes('src="quiz-variants.js"'), 'Netlify/index.html 未引用 quiz-variants.js。');
    assert(indexHtml.includes('src="results.js"'), 'Netlify/index.html 未引用 results.js。');
    assert(indexHtml.includes('src="app.js"'), 'Netlify/index.html 未引用 app.js。');

    assert(previewHtml.includes('href="style.css"'), 'Netlify/preview.html 未引用 style.css。');
    assert(previewHtml.includes('src="quiz-variants.js"'), 'Netlify/preview.html 未引用 quiz-variants.js。');
    assert(previewHtml.includes('src="results.js"'), 'Netlify/preview.html 未引用 results.js。');
    assert(previewHtml.includes('src="preview.js"'), 'Netlify/preview.html 未引用 preview.js。');
}

function validateImages() {
    const photoDir = path.join(targetDir, 'photo');
    assert(fs.existsSync(photoDir), 'Netlify/photo 目录不存在。');

    const jpgFiles = fs.readdirSync(photoDir, { withFileTypes: true })
        .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.jpg');

    assert(
        jpgFiles.length === expectedImageCount,
        `Netlify/photo 中的 JPG 数量应为 ${expectedImageCount}，当前为 ${jpgFiles.length}。`
    );
}

function validateHeaders() {
    const headers = fs.readFileSync(path.join(targetDir, '_headers'), 'utf8');

    assert(headers.includes('/photo/*'), 'Netlify/_headers 缺少图片缓存规则。');
    assert(headers.includes('Cache-Control: public, max-age=31536000, immutable'), 'Netlify/_headers 缺少图片缓存头。');
    assert(headers.includes('X-Content-Type-Options: nosniff'), 'Netlify/_headers 缺少基础安全头。');
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
