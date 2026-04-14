// 全局状态
let currentQuestion = 0;
let currentVariantId = typeof defaultQuizVariantId === 'string' ? defaultQuizVariantId : 'full25';
let answers = [];
let scores = createEmptyScores();
const AUTO_ADVANCE_DELAY = 300;
const PRELOAD_WINDOW_SIZE = 6;
let autoAdvanceTimer = null;
const preloadedResultImages = new Set();
const questionListCache = new Map();

function createEmptyScores() {
    return { W: 0, L: 0, T: 0, I: 0, Q: 0 };
}

function getAllQuestions() {
    if (typeof questions === 'undefined' || !Array.isArray(questions)) {
        throw new Error('questions.js 未正确加载，无法开始测试。');
    }

    return questions;
}

function getCurrentVariant() {
    if (typeof getQuizVariantConfig !== 'function') {
        throw new Error('quiz-variants.js 未正确加载，无法读取测试版本配置。');
    }

    return getQuizVariantConfig(currentVariantId);
}

function getQuestionList(variantId = currentVariantId) {
    if (questionListCache.has(variantId)) {
        return questionListCache.get(variantId);
    }

    const variant = getQuizVariantConfig(variantId);
    const order = new Map(variant.questionIds.map((id, index) => [id, index]));
    const questionBank = getAllQuestions()
        .filter(question => order.has(question.id))
        .sort((left, right) => order.get(left.id) - order.get(right.id));

    questionListCache.set(variantId, questionBank);
    return questionBank;
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
}

function clearAutoAdvanceTimer() {
    if (autoAdvanceTimer !== null) {
        window.clearTimeout(autoAdvanceTimer);
        autoAdvanceTimer = null;
    }
}

function setResultImage(resultImage, imageName, altText) {
    resultImage.onerror = () => {
        resultImage.style.display = 'none';
    };
    resultImage.onload = () => {
        resultImage.style.display = 'block';
    };
    resultImage.style.display = 'block';
    resultImage.alt = altText;
    resultImage.src = `photo/${imageName}.jpg`;
}

function preloadResultImage(imageName) {
    if (!imageName || preloadedResultImages.has(imageName)) {
        return;
    }

    const img = new Image();
    img.src = `photo/${imageName}.jpg`;
    preloadedResultImages.add(imageName);
}

function renderVariantOptions() {
    const variantContainer = document.getElementById('quiz-variants');

    if (!variantContainer) {
        return;
    }

    variantContainer.innerHTML = '';

    Object.values(quizVariants).forEach(variant => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'variant-card';
        button.dataset.variantId = variant.id;
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', String(variant.id === currentVariantId));
        button.addEventListener('click', () => selectVariant(variant.id));

        const label = document.createElement('span');
        label.className = 'variant-card-label';
        label.textContent = variant.label;

        const meta = document.createElement('span');
        meta.className = 'variant-card-meta';
        meta.textContent = `${variant.questionCount} 题 · 约 ${variant.estimatedMinutes} 分钟`;

        button.appendChild(label);
        button.appendChild(meta);
        variantContainer.appendChild(button);
    });

    updateVariantSelectionState();
}

function updateVariantSelectionState() {
    document.querySelectorAll('.variant-card').forEach(button => {
        const isActive = button.dataset.variantId === currentVariantId;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-checked', String(isActive));
    });
}

function updateVariantSummary() {
    const variant = getCurrentVariant();
    const questionCount = String(variant.questionCount);

    document.getElementById('question-count').textContent = questionCount;
    document.getElementById('total-questions').textContent = questionCount;
    document.getElementById('estimated-minutes').textContent = String(variant.estimatedMinutes);
    document.getElementById('variant-caption').textContent = `${variant.shortLabel}：${variant.description}`;
    document.querySelector('.progress-bar').setAttribute('aria-valuemax', questionCount);
    updateVariantSelectionState();
}

function selectVariant(variantId) {
    currentVariantId = variantId;
    currentQuestion = 0;
    answers = [];
    scores = createEmptyScores();
    clearAutoAdvanceTimer();
    updateVariantSummary();
}

function buildEstimatedScores() {
    const estimatedScores = createEmptyScores();
    const questionBank = getQuestionList();

    questionBank.forEach((question, questionIndex) => {
        if (answers[questionIndex] !== undefined) {
            const selectedOption = question.options[answers[questionIndex]];

            Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
                estimatedScores[dimension] += score;
            });

            return;
        }

        question.dimension.forEach(dimension => {
            estimatedScores[dimension] += 2;
        });
    });

    return estimatedScores;
}

function maybePreloadLikelyResult() {
    const questionBank = getQuestionList();
    const preloadStartQuestionIndex = Math.max(questionBank.length - PRELOAD_WINDOW_SIZE, 0);

    if (currentQuestion < preloadStartQuestionIndex) {
        return;
    }

    const likelyPersonality = calculatePersonalityType(buildEstimatedScores(), currentVariantId);
    preloadResultImage(likelyPersonality.imageName);
}

function scheduleAutoAdvance(optionIndex) {
    const questionIndex = currentQuestion;
    const questionBank = getQuestionList();

    clearAutoAdvanceTimer();
    autoAdvanceTimer = window.setTimeout(() => {
        autoAdvanceTimer = null;

        if (currentQuestion !== questionIndex || answers[questionIndex] !== optionIndex) {
            return;
        }

        if (questionIndex < questionBank.length - 1) {
            currentQuestion += 1;
            loadQuestion();
            return;
        }

        calculateResults();
    }, AUTO_ADVANCE_DELAY);
}

function startTest() {
    clearAutoAdvanceTimer();
    currentQuestion = 0;
    answers = [];
    scores = createEmptyScores();
    showPage('test-page');
    loadQuestion();
}

function loadQuestion() {
    clearAutoAdvanceTimer();

    const questionBank = getQuestionList();
    const question = questionBank[currentQuestion];
    const progress = ((currentQuestion + 1) / questionBank.length) * 100;
    const progressBar = document.querySelector('.progress-bar');
    const optionsContainer = document.getElementById('options');

    document.getElementById('progress-fill').style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', String(currentQuestion + 1));
    progressBar.setAttribute('aria-valuetext', `第 ${currentQuestion + 1} 题，共 ${questionBank.length} 题`);
    document.getElementById('current-question').textContent = String(currentQuestion + 1);
    document.getElementById('question-title').textContent = question.title;

    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionId = `question-${question.id}-option-${index}`;
        const optionLabel = document.createElement('label');
        optionLabel.className = 'option';
        optionLabel.setAttribute('for', optionId);

        const optionInput = document.createElement('input');
        optionInput.className = 'option-input';
        optionInput.type = 'radio';
        optionInput.name = `question-${question.id}`;
        optionInput.id = optionId;
        optionInput.value = String(index);
        optionInput.checked = answers[currentQuestion] === index;
        optionInput.addEventListener('change', () => selectOption(index));

        const optionText = document.createElement('span');
        optionText.className = 'option-text';
        optionText.textContent = option.text;

        if (answers[currentQuestion] === index) {
            optionLabel.classList.add('selected');
        }

        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(optionText);
        optionsContainer.appendChild(optionLabel);
    });

    updateButtons();
    maybePreloadLikelyResult();
}

function selectOption(optionIndex) {
    answers[currentQuestion] = optionIndex;

    document.querySelectorAll('.option').forEach((option, index) => {
        const input = option.querySelector('.option-input');
        const isSelected = index === optionIndex;

        option.classList.toggle('selected', isSelected);

        if (input) {
            input.checked = isSelected;
        }
    });

    updateButtons();
    maybePreloadLikelyResult();
    scheduleAutoAdvance(optionIndex);
}

function updateButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const questionBank = getQuestionList();
    const hasAnswer = answers[currentQuestion] !== undefined;

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = !hasAnswer;
    nextBtn.textContent = currentQuestion === questionBank.length - 1 ? '查看结果' : '下一题';
}

function prevQuestion() {
    clearAutoAdvanceTimer();

    if (currentQuestion > 0) {
        currentQuestion -= 1;
        loadQuestion();
    }
}

function nextQuestion() {
    const questionBank = getQuestionList();

    clearAutoAdvanceTimer();

    if (answers[currentQuestion] === undefined) {
        return;
    }

    if (currentQuestion < questionBank.length - 1) {
        currentQuestion += 1;
        loadQuestion();
        return;
    }

    calculateResults();
}

function calculateResults() {
    const questionBank = getQuestionList();

    clearAutoAdvanceTimer();

    for (let index = 0; index < questionBank.length; index += 1) {
        if (answers[index] === undefined) {
            alert(`第 ${index + 1} 题还未回答，请完成后再查看结果！`);
            currentQuestion = index;
            loadQuestion();
            return;
        }
    }

    scores = createEmptyScores();

    answers.forEach((answerIndex, questionIndex) => {
        const question = questionBank[questionIndex];
        const selectedOption = question.options[answerIndex];

        Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
            scores[dimension] += score;
        });
    });

    showResults(calculatePersonalityType(scores, currentVariantId));
}

function showResults(personality) {
    const resultImage = document.getElementById('result-image');
    const dimensionsContainer = document.getElementById('result-dimensions');
    const descriptionContainer = document.getElementById('result-description');
    const traitsContainer = document.getElementById('result-traits');
    const variant = getCurrentVariant();

    document.getElementById('result-type').textContent = personality.name;
    document.getElementById('result-code').textContent = personality.exactMatch
        ? `五维代码：${personality.typeCode} · ${variant.shortLabel}`
        : `五维代码：${personality.typeCode} · ${variant.shortLabel} · 参考原型：${personality.matchedTypeCode}`;
    setResultImage(resultImage, personality.imageName, `${personality.name} 结果配图`);

    dimensionsContainer.innerHTML = '';

    dimensionOrder.forEach(code => {
        const dimensionDiv = document.createElement('div');
        dimensionDiv.className = 'dimension';

        const dimensionLabel = document.createElement('div');
        dimensionLabel.className = 'dimension-label';
        dimensionLabel.textContent = getDimensionName(code);

        const dimensionValue = document.createElement('div');
        dimensionValue.className = 'dimension-value';
        dimensionValue.textContent = getLevelName(getDimensionLevel(scores[code], code, currentVariantId));

        dimensionDiv.appendChild(dimensionLabel);
        dimensionDiv.appendChild(dimensionValue);
        dimensionsContainer.appendChild(dimensionDiv);
    });

    descriptionContainer.innerHTML = '';

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = '人格描述';
    descriptionContainer.appendChild(descriptionTitle);

    const descriptionText = document.createElement('p');
    descriptionText.textContent = personality.description;
    descriptionContainer.appendChild(descriptionText);

    if (personality.matchNote) {
        const matchNote = document.createElement('p');
        matchNote.className = 'result-note';
        matchNote.textContent = personality.matchNote;
        descriptionContainer.appendChild(matchNote);
    }

    if (personality.quote) {
        const quoteText = document.createElement('p');
        quoteText.className = 'result-quote';
        quoteText.textContent = personality.quote;
        descriptionContainer.appendChild(quoteText);
    }

    traitsContainer.innerHTML = '';
    personality.traits.forEach(trait => {
        const traitTag = document.createElement('span');
        traitTag.className = 'trait-tag';
        traitTag.textContent = trait;
        traitsContainer.appendChild(traitTag);
    });

    showPage('result-page');
}

function shareResult() {
    const resultType = document.getElementById('result-type').textContent;
    const shareText = `我在WLTI测试中是【${resultType}】！快来测测你是哪种王蕾！`;

    if (navigator.share) {
        navigator.share({
            title: 'WLTI测试结果',
            text: shareText,
            url: window.location.href
        }).catch(error => {
            console.log('分享失败:', error);
            copyToClipboard(shareText);
        });
        return;
    }

    copyToClipboard(shareText);
}

function copyToClipboard(text) {
    const fullText = `${text}\n${window.location.href}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText)
            .then(() => {
                alert('结果已复制到剪贴板！');
            })
            .catch(error => {
                console.error('复制失败:', error);
                fallbackCopyToClipboard(fullText);
            });
        return;
    }

    fallbackCopyToClipboard(fullText);
}

function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        alert('结果已复制到剪贴板！');
    } catch (error) {
        console.error('复制失败:', error);
        alert(`复制失败，请手动复制：\n${text}`);
    }

    document.body.removeChild(textarea);
}

function restartTest() {
    clearAutoAdvanceTimer();
    answers = [];
    scores = createEmptyScores();
    currentQuestion = 0;
    showPage('start-page');
    updateVariantSummary();
}

document.addEventListener('DOMContentLoaded', () => {
    renderVariantOptions();
    updateVariantSummary();
    showPage('start-page');
});
