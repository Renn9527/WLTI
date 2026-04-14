#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'photo');
const sourceDir = path.join(assetsDir, '_source');
const outputWidth = 1200;
const outputHeight = 1200;
const outputBackground = '0xFFF5F7';
const supportedExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);

main();

function main() {
    ensureDirectory(assetsDir);
    ensureDirectory(sourceDir);

    const sourceFiles = prepareSourceFiles();
    if (sourceFiles.length === 0) {
        throw new Error('没有找到可处理的结果图片。');
    }

    sourceFiles.forEach(sourceFile => {
        const outputPath = path.join(assetsDir, `${path.parse(sourceFile).name}.jpg`);
        convertToStandardJpg(sourceFile, outputPath);
    });

    verifyOutputs();
    console.log(`Standardized ${sourceFiles.length} images to ${outputWidth}x${outputHeight} JPG.`);
}

function prepareSourceFiles() {
    let sourceFiles = listSupportedImages(sourceDir);

    if (sourceFiles.length === 0) {
        const rootFiles = listSupportedImages(assetsDir);

        rootFiles.forEach(file => {
            const targetPath = path.join(sourceDir, path.basename(file));
            if (!fs.existsSync(targetPath)) {
                fs.renameSync(file, targetPath);
            }
        });

        sourceFiles = listSupportedImages(sourceDir);
    }

    return sourceFiles;
}

function listSupportedImages(directory) {
    return fs.readdirSync(directory, { withFileTypes: true })
        .filter(entry => entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase()))
        .map(entry => path.join(directory, entry.name))
        .sort((left, right) => path.basename(left, path.extname(left)).localeCompare(path.basename(right, path.extname(right)), 'zh-CN'));
}

function convertToStandardJpg(inputPath, outputPath) {
    const filter = [
        `scale=${outputWidth}:${outputHeight}:force_original_aspect_ratio=decrease:flags=lanczos`,
        `pad=${outputWidth}:${outputHeight}:(ow-iw)/2:(oh-ih)/2:${outputBackground}`,
        'setsar=1'
    ].join(',');

    const result = spawnSync('ffmpeg', [
        '-y',
        '-i', inputPath,
        '-vf', filter,
        '-frames:v', '1',
        '-q:v', '2',
        outputPath
    ], {
        cwd: rootDir,
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error(`转换图片失败: ${path.basename(inputPath)}\n${result.stderr}`);
    }
}

function verifyOutputs() {
    const outputFiles = listSupportedImages(assetsDir).filter(file => path.extname(file).toLowerCase() === '.jpg');

    outputFiles.forEach(file => {
        const probe = spawnSync('ffprobe', [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'csv=p=0:s=x',
            file
        ], {
            cwd: rootDir,
            encoding: 'utf8'
        });

        if (probe.status !== 0) {
            throw new Error(`读取图片尺寸失败: ${path.basename(file)}\n${probe.stderr}`);
        }

        const size = probe.stdout.trim();
        if (size !== `${outputWidth}x${outputHeight}`) {
            throw new Error(`图片尺寸不符合预期: ${path.basename(file)} => ${size}`);
        }
    });
}

function ensureDirectory(directory) {
    fs.mkdirSync(directory, { recursive: true });
}
