#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { spawnSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const expectedBaseQuestionCount = 25;
const expectedVariantExclusions = {
    full25: [],
    lite20: [20, 21, 22, 24, 25],
    quick15: [13, 14, 16, 17, 18, 20, 21, 22, 24, 25]
};
const requiredElementIds = [
    'quiz-variants',
    'variant-caption',
    'question-count',
    'estimated-minutes',
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
const expectedImageCount = 20;
const expectedImageSize = '1200x1200';
const archetypeLoadFloor = 0.03;
const archetypeLoadCeiling = 0.085;

main();

function main() {
    compileScripts([
        'questions.js',
        'quiz-variants.js',
        'results.js',
        'app.js',
        'preview.js',
        'scripts/generate-quiz-variants.js'
    ]);
    validateHtmlIntegration();
    validatePreviewPage();
    validateRuntimeData();
    validateResultImages();
    console.log('Validation passed.');
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
    const expectedScriptOrder = ['questions.js', 'quiz-variants.js', 'results.js', 'app.js'];
    const idSet = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));

    assert(
        JSON.stringify(scriptOrder.slice(-4)) === JSON.stringify(expectedScriptOrder),
        `index.html 的脚本加载顺序应为 ${expectedScriptOrder.join(' -> ')}。`
    );

    requiredElementIds.forEach(id => {
        assert(idSet.has(id), `index.html 缺少 app.js 依赖的元素 id="${id}"。`);
    });
}

function validatePreviewPage() {
    const html = fs.readFileSync(path.join(rootDir, 'preview.html'), 'utf8');
    const scriptOrder = [...html.matchAll(/<script\s+src="([^"]+)"/g)].map(match => match[1]);
    const expectedScriptOrder = ['quiz-variants.js', 'results.js', 'preview.js'];
    const idSet = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));

    assert(
        JSON.stringify(scriptOrder.slice(-3)) === JSON.stringify(expectedScriptOrder),
        `preview.html 的脚本加载顺序应为 ${expectedScriptOrder.join(' -> ')}。`
    );

    previewRequiredElementIds.forEach(id => {
        assert(idSet.has(id), `preview.html 缺少预览页依赖的元素 id="${id}"。`);
    });
}

function validateRuntimeData() {
    const questionsSource = fs.readFileSync(path.join(rootDir, 'questions.js'), 'utf8');
    const quizVariantsSource = fs.readFileSync(path.join(rootDir, 'quiz-variants.js'), 'utf8');
    const resultsSource = fs.readFileSync(path.join(rootDir, 'results.js'), 'utf8');
    const runtimeSource = [
        questionsSource,
        quizVariantsSource,
        resultsSource,
        'globalThis.__exports = { questions, quizVariants, personalityTypes, calculatePersonalityType, getBalancedVariantData, getDimensionLevel };'
    ].join('\n');
    const context = { console };

    context.globalThis = context;
    vm.createContext(context);
    new vm.Script(runtimeSource, { filename: 'runtime-validation.js' }).runInContext(context);

    const {
        questions,
        quizVariants,
        personalityTypes,
        calculatePersonalityType,
        getBalancedVariantData,
        getDimensionLevel
    } = context.__exports;

    assert(Array.isArray(questions), 'questions.js 没有导出有效题库。');
    assert(questions.length === expectedBaseQuestionCount, `题库题数应为 ${expectedBaseQuestionCount}，当前为 ${questions.length}。`);
    assert(Object.keys(personalityTypes).length === 20, `人格原型数量应为 20，当前为 ${Object.keys(personalityTypes).length}。`);

    Object.entries(expectedVariantExclusions).forEach(([variantId, excludedIds]) => {
        const variant = quizVariants[variantId];
        const expectedQuestionIds = questions
            .filter(question => !excludedIds.includes(question.id))
            .map(question => question.id);
        const expectedDimensionCounts = buildDimensionCounts(questions, expectedQuestionIds);
        const expectedThresholds = buildThresholds(expectedDimensionCounts);
        const expectedCodeWeights = buildCodeWeights(questions, expectedQuestionIds, expectedThresholds);
        const { loads } = getBalancedVariantData(variantId);
        const sortedLoads = Object.values(loads).sort((left, right) => left - right);

        assert(variant, `缺少测试版本 ${variantId}。`);
        assert(
            JSON.stringify(variant.questionIds) === JSON.stringify(expectedQuestionIds),
            `${variantId} 的题目列表与预期不一致。`
        );
        assert(
            JSON.stringify(variant.dimensionCounts) === JSON.stringify(expectedDimensionCounts),
            `${variantId} 的维度题数与题库统计不一致。`
        );
        assert(
            JSON.stringify(variant.thresholds) === JSON.stringify(expectedThresholds),
            `${variantId} 的分档阈值与重新计算结果不一致，请重新运行生成脚本。`
        );
        assert(
            JSON.stringify(variant.codeWeights) === JSON.stringify(expectedCodeWeights),
            `${variantId} 的类型权重与题库不一致，请重新运行生成脚本。`
        );

        assert(sortedLoads[0] >= archetypeLoadFloor, `${variantId} 的最小原型占比过低：${(sortedLoads[0] * 100).toFixed(2)}%。`);
        assert(sortedLoads[sortedLoads.length - 1] <= archetypeLoadCeiling, `${variantId} 的最大原型占比过高：${(sortedLoads[sortedLoads.length - 1] * 100).toFixed(2)}%。`);

        Object.keys(personalityTypes).forEach(typeCode => {
            const scores = buildScoresForType(typeCode, variant.dimensionCounts, variant.thresholds);
            const result = calculatePersonalityType(scores, variantId);

            assert(result.exactMatch === true, `${variantId} 中的原型 ${typeCode} 未能精确命中。`);
            assert(result.typeCode === typeCode, `${variantId} 中的原型 ${typeCode} 返回了错误的代码 ${result.typeCode}。`);
        });

        const mixedTypeCode = 'LLLLH';
        if (!personalityTypes[mixedTypeCode]) {
            const mixedScores = buildScoresForType(mixedTypeCode, variant.dimensionCounts, variant.thresholds);
            const mixedResult = calculatePersonalityType(mixedScores, variantId);

            assert(mixedResult.exactMatch === false, `${variantId} 中的混合型结果应标记为非精确匹配。`);
            assert(mixedResult.matchedTypeCode, `${variantId} 中的混合型结果应包含参考原型代码。`);
            assert(mixedResult.imageName, `${variantId} 中的混合型结果应包含参考图片名。`);
        }
    });
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

function buildDimensionCounts(questionBank, questionIds) {
    const idSet = new Set(questionIds);
    const counts = { W: 0, L: 0, T: 0, I: 0, Q: 0 };

    questionBank.forEach(question => {
        if (!idSet.has(question.id)) {
            return;
        }

        question.dimension.forEach(code => {
            counts[code] += 1;
        });
    });

    return counts;
}

function buildThresholds(dimensionCounts) {
    const thresholds = {};

    Object.entries(dimensionCounts).forEach(([code, questionCount]) => {
        let states = new Map([[0, 1]]);

        for (let index = 0; index < questionCount; index += 1) {
            const next = new Map();

            states.forEach((count, sum) => {
                [1, 2, 3].forEach(score => {
                    const nextSum = sum + score;
                    next.set(nextSum, (next.get(nextSum) || 0) + count);
                });
            });

            states = next;
        }

        const totalOutcomes = 3 ** questionCount;
        let cumulativeProbability = 0;
        let low = questionCount;
        let mid = questionCount * 2;

        [...states.entries()]
            .sort((left, right) => left[0] - right[0])
            .forEach(([sum, count]) => {
                cumulativeProbability += count / totalOutcomes;

                if (low === questionCount && cumulativeProbability >= 1 / 3) {
                    low = sum;
                }

                if (mid === questionCount * 2 && cumulativeProbability >= 2 / 3) {
                    mid = sum;
                }
            });

        thresholds[code] = { low, mid };
    });

    return thresholds;
}

function buildCodeWeights(questionBank, questionIds, thresholds) {
    const idSet = new Set(questionIds);
    const dimensionOrder = ['W', 'L', 'T', 'I', 'Q'];
    let states = new Map([[JSON.stringify({ W: 0, L: 0, T: 0, I: 0, Q: 0 }), 1]]);

    questionBank.forEach(question => {
        if (!idSet.has(question.id)) {
            return;
        }

        const next = new Map();

        states.forEach((count, key) => {
            const baseScores = JSON.parse(key);

            question.options.forEach(option => {
                const nextScores = { ...baseScores };

                Object.entries(option.scores).forEach(([dimension, value]) => {
                    nextScores[dimension] += value;
                });

                const nextKey = JSON.stringify(nextScores);
                next.set(nextKey, (next.get(nextKey) || 0) + count);
            });
        });

        states = next;
    });

    const totalOutcomes = 3 ** questionIds.length;
    const weights = {};

    states.forEach((count, key) => {
        const scores = JSON.parse(key);
        const typeCode = dimensionOrder.map(code => {
            const { low, mid } = thresholds[code];

            if (scores[code] <= low) {
                return 'L';
            }

            if (scores[code] <= mid) {
                return 'M';
            }

            return 'H';
        }).join('');

        weights[typeCode] = Number(((weights[typeCode] || 0) + count / totalOutcomes).toFixed(12));
    });

    return Object.fromEntries(Object.entries(weights).sort((left, right) => left[0].localeCompare(right[0], 'en')));
}

function buildScoresForType(typeCode, dimensionCounts, thresholds) {
    const scores = {};

    Object.entries(dimensionCounts).forEach(([code, questionCount], index) => {
        const level = typeCode[index];
        const { low, mid } = thresholds[code];

        if (level === 'L') {
            scores[code] = low;
        } else if (level === 'M') {
            scores[code] = Math.min(mid, low + 1);
        } else {
            scores[code] = Math.min(questionCount * 3, mid + 1);
        }
    });

    return scores;
}

function spawnSyncChecked(command, args) {
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
