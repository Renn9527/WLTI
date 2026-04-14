function createPreviewPersonality(typeCode, personality) {
    return {
        ...personality,
        typeCode,
        matchedTypeCode: typeCode,
        exactMatch: true,
        imageName: personality.name,
        matchNote: '这是固定原型结果卡片预览，用来检查图片、文案和布局是否稳定。'
    };
}

function setPreviewResultImage(resultImage, imageName, altText) {
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

function renderPreviewResult(personality) {
    const resultImage = document.getElementById('result-image');
    const dimensionsContainer = document.getElementById('result-dimensions');
    const descriptionContainer = document.getElementById('result-description');
    const traitsContainer = document.getElementById('result-traits');

    document.getElementById('result-type').textContent = personality.name;
    document.getElementById('result-code').textContent = `五维代码：${personality.typeCode}`;

    setPreviewResultImage(resultImage, personality.imageName, `${personality.name} 结果配图`);

    dimensionsContainer.innerHTML = '';
    dimensionOrder.forEach((code, index) => {
        const dimensionDiv = document.createElement('div');
        dimensionDiv.className = 'dimension';

        const dimensionLabel = document.createElement('div');
        dimensionLabel.className = 'dimension-label';
        dimensionLabel.textContent = getDimensionName(code);

        const dimensionValue = document.createElement('div');
        dimensionValue.className = 'dimension-value';
        dimensionValue.textContent = getLevelName(personality.typeCode[index]);

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

    const matchNote = document.createElement('p');
    matchNote.className = 'result-note';
    matchNote.textContent = personality.matchNote;
    descriptionContainer.appendChild(matchNote);

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
}

function updateSelectedControl(activeCode) {
    document.querySelectorAll('.preview-chip').forEach(button => {
        button.classList.toggle('is-active', button.dataset.typeCode === activeCode);
    });
}

function buildPreviewControls() {
    const controls = document.getElementById('preview-controls');
    const entries = Object.entries(personalityTypes);

    entries.forEach(([typeCode, personality]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'preview-chip';
        button.dataset.typeCode = typeCode;
        button.textContent = personality.name;
        button.addEventListener('click', () => {
            renderPreviewResult(createPreviewPersonality(typeCode, personality));
            updateSelectedControl(typeCode);
        });
        controls.appendChild(button);
    });

    if (entries.length > 0) {
        const [firstCode, firstPersonality] = entries[0];
        renderPreviewResult(createPreviewPersonality(firstCode, firstPersonality));
        updateSelectedControl(firstCode);
    }
}

function buildViewportToggle() {
    const previewStage = document.getElementById('preview-stage');

    document.querySelectorAll('.preview-toggle').forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.dataset.previewMode;
            previewStage.dataset.previewMode = mode;

            document.querySelectorAll('.preview-toggle').forEach(toggle => {
                toggle.classList.toggle('is-active', toggle === button);
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    buildPreviewControls();
    buildViewportToggle();
});
