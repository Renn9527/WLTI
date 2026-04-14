// 全局状态
let currentQuestion = 0;
let answers = [];
let scores = {
    W: 0,  // 抽象度
    L: 0,  // 撒娇度
    T: 0,  // 冲动度
    I: 0,  // 反撩度
    Q: 0   // 气质度
};
const AUTO_ADVANCE_DELAY = 300;
let autoAdvanceTimer = null;
const preloadedResultImages = new Set();

function getQuestionList() {
    if (typeof questions === 'undefined' || !Array.isArray(questions)) {
        throw new Error('questions.js 未正确加载，无法开始测试。');
    }

    return questions;
}

// 页面切换
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

function buildEstimatedScores() {
    const estimatedScores = { W: 0, L: 0, T: 0, I: 0, Q: 0 };
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
    const preloadStartQuestionIndex = Math.max(getQuestionList().length - 6, 0);

    if (currentQuestion < preloadStartQuestionIndex) {
        return;
    }

    const likelyPersonality = calculatePersonalityType(buildEstimatedScores());
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
            currentQuestion++;
            loadQuestion();
            return;
        }

        calculateResults();
    }, AUTO_ADVANCE_DELAY);
}

// 开始测试
function startTest() {
    clearAutoAdvanceTimer();
    currentQuestion = 0;
    answers = [];
    scores = { W: 0, L: 0, T: 0, I: 0, Q: 0 };
    showPage('test-page');
    loadQuestion();
}

// 加载题目
function loadQuestion() {
    clearAutoAdvanceTimer();
    const questionBank = getQuestionList();
    const question = questionBank[currentQuestion];
    
    // 更新进度条
    const progress = ((currentQuestion + 1) / questionBank.length) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    const progressBar = document.querySelector('.progress-bar');
    progressBar.setAttribute('aria-valuenow', String(currentQuestion + 1));
    progressBar.setAttribute('aria-valuetext', `第 ${currentQuestion + 1} 题，共 ${questionBank.length} 题`);
    
    // 更新题号
    document.getElementById('current-question').textContent = currentQuestion + 1;
    
    // 更新题目
    document.getElementById('question-title').textContent = question.title;
    
    // 更新选项
    const optionsContainer = document.getElementById('options');
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
        
        // 如果已经选择过，显示选中状态
        if (answers[currentQuestion] === index) {
            optionLabel.classList.add('selected');
        }
        
        optionLabel.appendChild(optionInput);
        optionLabel.appendChild(optionText);
        optionsContainer.appendChild(optionLabel);
    });
    
    // 更新按钮状态
    updateButtons();
    maybePreloadLikelyResult();
}

// 选择选项
function selectOption(optionIndex) {
    answers[currentQuestion] = optionIndex;
    
    // 更新选中状态
    document.querySelectorAll('.option').forEach((opt, idx) => {
        const input = opt.querySelector('.option-input');
        const isSelected = idx === optionIndex;

        opt.classList.toggle('selected', isSelected);
        if (input) {
            input.checked = isSelected;
        }
    });
    
    // 更新按钮状态
    updateButtons();
    maybePreloadLikelyResult();
    scheduleAutoAdvance(optionIndex);
}

// 更新按钮状态
function updateButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const questionBank = getQuestionList();
    
    // 上一题按钮
    prevBtn.disabled = currentQuestion === 0;
    
    // 下一题按钮
    const hasAnswer = answers[currentQuestion] !== undefined;
    nextBtn.disabled = !hasAnswer;
    
    // 最后一题时改变按钮文字
    if (currentQuestion === questionBank.length - 1) {
        nextBtn.textContent = '查看结果';
    } else {
        nextBtn.textContent = '下一题';
    }
}

// 上一题
function prevQuestion() {
    clearAutoAdvanceTimer();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

// 下一题
function nextQuestion() {
    const questionBank = getQuestionList();
    clearAutoAdvanceTimer();

    if (answers[currentQuestion] === undefined) {
        return;
    }
    
    if (currentQuestion < questionBank.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        // 完成测试，计算结果
        calculateResults();
    }
}

// 计算结果
function calculateResults() {
    const questionBank = getQuestionList();
    clearAutoAdvanceTimer();

    // 验证是否所有题目都已回答
    if (answers.length !== questionBank.length) {
        alert('请完成所有题目后再查看结果！');
        return;
    }
    
    // 检查是否有未回答的题目
    for (let i = 0; i < questionBank.length; i++) {
        if (answers[i] === undefined) {
            alert(`第 ${i + 1} 题还未回答，请完成后再查看结果！`);
            currentQuestion = i;
            loadQuestion();
            return;
        }
    }
    
    // 重置分数
    scores = { W: 0, L: 0, T: 0, I: 0, Q: 0 };
    
    // 累加每道题的分数
    answers.forEach((answerIndex, questionIndex) => {
        const question = questionBank[questionIndex];
        const selectedOption = question.options[answerIndex];
        
        // 累加各维度分数
        for (const [dimension, score] of Object.entries(selectedOption.scores)) {
            scores[dimension] += score;
        }
    });
    
    // 获取人格类型
    const personality = calculatePersonalityType(scores);
    
    // 显示结果
    showResults(personality);
}

// 显示结果
function showResults(personality) {
    // 人格类型名称
    const resultImage = document.getElementById('result-image');
    document.getElementById('result-type').textContent = personality.name;
    document.getElementById('result-code').textContent = personality.exactMatch
        ? `五维代码：${personality.typeCode}`
        : `五维代码：${personality.typeCode} · 参考原型：${personality.matchedTypeCode}`;
    setResultImage(resultImage, personality.imageName, `${personality.name} 结果配图`);
    
    const dimensionQuestionCounts = getDimensionQuestionCounts();

    // 五维数据
    const dimensionsContainer = document.getElementById('result-dimensions');
    dimensionsContainer.innerHTML = '';

    dimensionOrder.forEach(code => {
        const level = getLevel(scores[code], dimensionQuestionCounts[code]);
        const dimensionDiv = document.createElement('div');
        dimensionDiv.className = 'dimension';
        const dimensionLabel = document.createElement('div');
        dimensionLabel.className = 'dimension-label';
        dimensionLabel.textContent = getDimensionName(code);

        const dimensionValue = document.createElement('div');
        dimensionValue.className = 'dimension-value';
        dimensionValue.textContent = getLevelName(level);

        dimensionDiv.appendChild(dimensionLabel);
        dimensionDiv.appendChild(dimensionValue);
        dimensionsContainer.appendChild(dimensionDiv);
    });
    
    // 描述
    const descriptionContainer = document.getElementById('result-description');
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
    
    // 特质标签
    const traitsContainer = document.getElementById('result-traits');
    traitsContainer.innerHTML = '';
    personality.traits.forEach(trait => {
        const traitTag = document.createElement('span');
        traitTag.className = 'trait-tag';
        traitTag.textContent = trait;
        traitsContainer.appendChild(traitTag);
    });
    
    // 显示结果页面
    showPage('result-page');
}

// 分享结果
function shareResult() {
    const resultType = document.getElementById('result-type').textContent;
    const shareText = `我在WLTI测试中是【${resultType}】！快来测测你是哪种王蕾！`;
    
    // 尝试使用 Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'WLTI测试结果',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('分享失败:', err);
            copyToClipboard(shareText);
        });
    } else {
        // 降级方案：复制到剪贴板
        copyToClipboard(shareText);
    }
}

// 复制到剪贴板
function copyToClipboard(text) {
    const fullText = text + '\n' + window.location.href;
    
    // 优先使用现代 Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText)
            .then(() => {
                alert('结果已复制到剪贴板！');
            })
            .catch(err => {
                console.error('复制失败:', err);
                // 降级到传统方法
                fallbackCopyToClipboard(fullText);
            });
    } else {
        // 降级到传统方法
        fallbackCopyToClipboard(fullText);
    }
}

// 传统复制方法（降级方案）
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
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制：\n' + text);
    }
    
    document.body.removeChild(textarea);
}

// 重新测试
function restartTest() {
    clearAutoAdvanceTimer();
    showPage('start-page');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    const questionCount = String(getQuestionList().length);
    document.getElementById('question-count').textContent = questionCount;
    document.getElementById('total-questions').textContent = questionCount;
    document.querySelector('.progress-bar').setAttribute('aria-valuemax', questionCount);
    showPage('start-page');
});
