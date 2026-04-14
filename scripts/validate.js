#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');
const dimensionOrder = ['W', 'L', 'T', 'I', 'Q'];
const expectedQuestionCount = 25;
const expectedDimensionCounts = { W: 8, L: 7, T: 11, I: 8, Q: 9 };
const requiredElementIds = [
    'question-count',
    'progress-fill',
    'current-question',
    'total-questions',
    'question-title',
    'options',
    'prev-btn',
    'next-btn',
    'result-type',
    'result-image',
    'result-code',
    'result-dimensions',
    'result-description',
    'result-traits'
];
const expectedImageCount = 20;
const expectedImageSize = '1200x1200';
const previewRequiredElementIds = [
    'preview-controls',
    'preview-stage',
    'result-image',
    'result-type',
    'result-code',
    'result-dimensions',
    'result-description',
    'result-traits'
];

main();

function main() {
    compileScripts(['questions.js', 'results.js', 'app.js', 'preview.js']);
    validateHtmlIntegration();
    validatePreviewPage();
    validateRuntimeData();
    validateResultImages();
    console.log('Validation passed.');
}

function validatePreviewPage() {
    const html = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf8');
    const scriptOrder = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match => match[1]);
    const expectedScriptOrder = ['results.js', 'preview.js'];
    const idSet = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));

    assert(
        JSON.stringify(scriptOrder.slice(-2)) === JSON.stringify(expectedScriptOrder),
        `preview.html 的脚本加载顺序应为 ${expectedScriptOrder.join(' -> ')}。`
    );

    previewRequiredElementIds.forEach(id => {
        assert(idSet.has(id), `preview.html 缺少预览页依赖的元素 id="${id}"。`);
    });
}

function compileScripts(files) {
    files.forEach(file => {
        const filePath = path.join(rootDir, file);
        const source = fs.readFileSync(filePath, 'utf8');
        new vm.Script(source, { filename: file });
    });
}

function validateHtmlIntegration() {
    const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    const scriptOrder = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match => match[1]);
    const expectedScriptOrder = ['questions.js', 'results.js', 'app.js'];
    const idSet = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));

    assert(
        JSON.stringify(scriptOrder.slice(-3)) === JSON.stringify(expectedScriptOrder),
        `index.html 的脚本加载顺序应为 ${expectedScriptOrder.join(' -> ')}。`
    );

    requiredElementIds.forEach(id => {
        assert(idSet.has(id), `index.html 缺少 app.js 依赖的元素 id="${id}"。`);
    });
}

function validateRuntimeData() {
    const questionsSource = fs.readFileSync(path.join(rootDir, 'questions.js'), 'utf8');
    const resultsSource = fs.readFileSync(path.join(rootDir, 'results.js'), 'utf8');
    const runtimeSource = [
        questionsSource,
        resultsSource,
        'globalThis.__exports = { questions, personalityTypes, calculatePersonalityType, getDimensionQuestionCounts };'
    ].join('\n');
    const context = { console };

    context.globalThis = context;
    vm.createContext(context);
    new vm.Script(runtimeSource, { filename: 'runtime-validation.js' }).runInContext(context);

    const { questions, personalityTypes, calculatePersonalityType, getDimensionQuestionCounts } = context.__exports;
    const dimensionCounts = getDimensionQuestionCounts();

    assert(Array.isArray(questions), 'questions.js 没有导出有效题库。');
    assert(questions.length === expectedQuestionCount, `题库题数应为 ${expectedQuestionCount}，当前为 ${questions.length}。`);
    assert(Object.keys(personalityTypes).length === 20, `人格原型数量应为 20，当前为 ${Object.keys(personalityTypes).length}。`);

    Object.entries(expectedDimensionCounts).forEach(([code, count]) => {
        assert(
            dimensionCounts[code] === count,
            `维度 ${code} 的题目数应为 ${count}，当前为 ${dimensionCounts[code]}。`
        );
    });

    Object.keys(personalityTypes).forEach(typeCode => {
        const result = calculatePersonalityType(buildScoresForType(typeCode, dimensionCounts));
        assert(result.exactMatch === true, `原型 ${typeCode} 未能精确命中。`);
        assert(result.typeCode === typeCode, `原型 ${typeCode} 返回了错误的代码 ${result.typeCode}。`);
    });

    const mixedTypeCode = 'LLLLH';
    assert(!personalityTypes[mixedTypeCode], `${mixedTypeCode} 不应是固定原型，测试数据需要更新。`);
    const mixedResult = calculatePersonalityType(buildScoresForType(mixedTypeCode, dimensionCounts));
    assert(mixedResult.exactMatch === false, '混合型结果应标记为非精确匹配。');
    assert(mixedResult.matchedTypeCode, '混合型结果应包含参考原型代码。');
    assert(mixedResult.imageName, '混合型结果应包含参考图片名。');
}

function validateResultImages() {
    const assetsDir = path.join(rootDir, 'photo');
    const jpgFiles = fs.readdirSync(assetsDir, { withFileTypes: true })
        .filter(entry => entry.isFile() && path.extname(entry.name).toLowerCase() === '.jpg')
        .map(entry => entry.name);

    assert(jpgFiles.length === expectedImageCount, `photo 目录中的 JPG 数量应为 ${expectedImageCount}，当前为 ${jpgFiles.length}。`);

    jpgFiles.forEach(file => {
        const probe = spawnSyncChecked('ffprobe', [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'csv=p=0:s=x',
            path.join(assetsDir, file)
        ]);

        assert(
            probe === expectedImageSize,
            `图片 ${file} 的尺寸应为 ${expectedImageSize}，当前为 ${probe}。`
        );
    });
}

function buildScoresForType(typeCode, dimensionCounts) {
    const scores = {};

    dimensionOrder.forEach((code, index) => {
        scores[code] = pickScoreForLevel(typeCode[index], dimensionCounts[code]);
    });

    return scores;
}

function pickScoreForLevel(level, questionCount) {
    for (let score = questionCount; score <= questionCount * 3; score++) {
        if (classifyLevel(score, questionCount) === level) {
            return score;
        }
    }

    throw new Error(`无法为 ${level} 档位找到代表分值。`);
}

function classifyLevel(score, questionCount) {
    const minScore = questionCount;
    const maxScore = questionCount * 3;
    const range = maxScore - minScore;

    if (score <= minScore + range * 0.33) return 'L';
    if (score <= minScore + range * 0.66) return 'M';
    return 'H';
}

function spawnSyncChecked(command, args) {
    const { spawnSync } = require('child_process');
    const result = spawnSync(command, args, {
        cwd: rootDir,
        encoding: 'utf8'
    });

    if (result.status !== 0) {
        throw new Error(result.stderr || `${command} 执行失败。`);
    }

    return result.stdout.trim();
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}
