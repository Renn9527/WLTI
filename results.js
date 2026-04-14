// 人格类型数据 - 按照设定集.md的顺序和代码
const dimensionOrder = ['W', 'L', 'T', 'I', 'Q'];
const levelValues = { L: 1, M: 2, H: 3 };
const levelNames = { L: '低', M: '中', H: '高' };
const dimensionDetails = {
    W: {
        name: '抽象度',
        traitLabels: { L: '正常直球', M: '偶尔抽象', H: '抽象乐子人' }
    },
    L: {
        name: '撒娇度',
        traitLabels: { L: '不处', M: '中性', H: '高糖可爱多' }
    },
    T: {
        name: '冲动度',
        traitLabels: { L: '无所谓我会出手', M: '正常水平', H: '冲动带节奏' }
    },
    I: {
        name: '反撩度',
        traitLabels: { L: '沉默是金', M: '正常互动', H: '说谢谢了吗' }
    },
    Q: {
        name: '气质度',
        traitLabels: { L: '职业酷姐', M: '中和小猫', H: '纸张仓鼠' }
    }
};

const personalityTypes = {
    HHHHH: {
        name: '碳眠无郎',
        description: '简直是王蕾本蕾！',
        traits: ['抽象乐子人', '高糖可爱多', '冲动带节奏', '说谢谢了吗', '纸张仓鼠'],
        quote: '「欢迎来到抖音CS女主播碳眠无郎的直播间！」'
    },
    LHLMH: {
        name: '可爱小猫',
        description: '你是一只可爱的小猫咪。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「喵喵 喵喵喵喵~」'
    },
    LLHML: {
        name: '王老急',
        description: '你是急性子代表，遇事容易冲动。职业酷姐的外表下藏着一颗容易炸毛的心。',
        traits: ['正常直球', '不处', '冲动带节奏', '正常互动', '职业酷姐'],
        quote: '「啊啊啊啊啊啊啊啊！」'
    },
    LLLLL: {
        name: '高冷枪女',
        description: '你是纯粹的职业选手气质，克制、专注、冷酷而优雅。',
        traits: ['正常直球', '不处', '无所谓我会出手', '沉默是金', '职业酷姐'],
        quote: '「无所谓，我会出手」'
    },
    MMMHM: {
        name: '恩师王蕾',
        description: '你像一位温柔的老师，既能教学又能整活，粉丝都想叫你一声"恩师"。',
        traits: ['偶尔抽象', '中性', '正常水平', '说谢谢了吗', '中和小猫'],
        quote: '「我这道具你就学吧」'
    },
    MLHHM: {
        name: '训犬师',
        description: '你是直播间训犬师。',
        traits: ['偶尔抽象', '不处', '冲动带节奏', '说谢谢了吗', '中和小猫'],
        quote: '「跪下！」'
    },
    HLMHL: {
        name: '语言尖刀',
        description: '你的话就像尖刀，抽象但犀利。',
        traits: ['抽象乐子人', '不处', '正常水平', '说谢谢了吗', '职业酷姐'],
        quote: '「婉拒了哈」'
    },
    LMHLM: {
        name: '打区糕手',
        description: '你喜欢在CS里放鞭炮和购买高价烧火棍。',
        traits: ['正常直球', '中性', '冲动带节奏', '沉默是金', '中和小猫'],
        quote: '「新年快乐！」'
    },
    HMHMM: {
        name: '正中大飞柱',
        description: '你是超级无敌大吃货，是赛尔号一直苦苦追寻的无尽能源。',
        traits: ['抽象乐子人', '中性', '冲动带节奏', '正常互动', '中和小猫'],
        quote: '「我要不要再点个夜宵！」'
    },
    HMLMH: {
        name: '老二次元',
        description: '你是从小看番的老二次元，追番漫展一个不落。',
        traits: ['抽象乐子人', '中性', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「上官子怡在此」'
    },
    LHLMM: {
        name: '妈妈',
        description: '你就像直播间的妈妈。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '正常互动', '中和小猫'],
        quote: '「叫我什么？」'
    },
    LMHLL: {
        name: '慈善家',
        description: '你经常冲动消费，促进经济发展，你不是浪费钱，你是大善。',
        traits: ['正常直球', '中性', '冲动带节奏', '沉默是金', '职业酷姐'],
        quote: '「谁还没听过2400略磨反冲精英的故事」'
    },
    LLHLL: {
        name: '科二刺客',
        description: '科目二是你的噩梦，五次机会完全不够用。',
        traits: ['正常直球', '不处', '冲动带节奏', '沉默是金', '职业酷姐'],
        quote: '「不学车了！」'
    },
    LHLLH: {
        name: '纸张仓鼠',
        description: '你是纯粹的可爱担当，会撒娇但不抽象不冲动。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '沉默是金', '纸张仓鼠'],
        quote: '「可爱就完事了」'
    },
    MLHML: {
        name: '炼金术士',
        description: '你可能会在直播时不小心把雷击皮肤炼了，然后当场破防，堪称炼金事故专业户。',
        traits: ['偶尔抽象', '不处', '冲动带节奏', '正常互动', '职业酷姐'],
        quote: '「啊啊啊我的雷击！」'
    },
    HMMLM: {
        name: '上官子怡',
        description: '你可能小学就开始网恋，取名"上官子怡"，是个有故事的人。',
        traits: ['抽象乐子人', '中性', '正常水平', '沉默是金', '中和小猫'],
        quote: '「谁不想要一段甜甜的恋爱呢」'
    },
    HHMHH: {
        name: '邪恶小猫',
        description: '你是可爱和邪恶的结合体，就像一只会咬人的小猫，可爱但危险。',
        traits: ['抽象乐子人', '高糖可爱多', '正常水平', '说谢谢了吗', '纸张仓鼠'],
        quote: '「嘿嘿嘿~」'
    },
    HHLMH: {
        name: '大糖王朝',
        description: '你糖完了，需要大量胰岛素。',
        traits: ['抽象乐子人', '高糖可爱多', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「嘿嘿嘿嘿嘿」'
    },
    MMMHH: {
        name: '大主播',
        description: '你就是标准的大主播，你无敌了。',
        traits: ['偶尔抽象', '中性', '正常水平', '说谢谢了吗', '纸张仓鼠'],
        quote: '「这就是大主播」'
    },
    HLMLL: {
        name: '我是丈育',
        description: '你有一种小脑发育不完全，大脑完全不发育的美感。',
        traits: ['抽象乐子人', '不处', '正常水平', '沉默是金', '职业酷姐'],
        quote: '「七七三十六，五七二十九」'
    }
};

const balancedVariantCache = new Map();

validatePersonalityTypes(personalityTypes);

function calculatePersonalityType(scores, variantId = defaultQuizVariantId) {
    const typeCode = buildTypeCode(getDimensionLevels(scores, variantId));
    const exactMatch = personalityTypes[typeCode];

    if (exactMatch) {
        return {
            ...exactMatch,
            typeCode,
            matchedTypeCode: typeCode,
            exactMatch: true,
            matchNote: '你的五维组合与设定集中的人格原型完全匹配。',
            imageName: exactMatch.name
        };
    }

    return buildCompositeResult(typeCode, variantId);
}

function getDimensionLevels(scores, variantId = defaultQuizVariantId) {
    const dimensions = {};

    dimensionOrder.forEach(code => {
        dimensions[code] = getDimensionLevel(scores[code], code, variantId);
    });

    return dimensions;
}

function buildTypeCode(dimensions) {
    return dimensionOrder.map(code => dimensions[code]).join('');
}

function buildCompositeResult(typeCode, variantId = defaultQuizVariantId) {
    const variant = getVariantConfigOrThrow(variantId);
    const matchedTypeCode = getBalancedReferenceTypeCode(typeCode, variantId);
    const matchedPersonality = personalityTypes[matchedTypeCode];
    const traits = dimensionOrder.map((code, index) => getDimensionTrait(code, typeCode[index]));
    const description = [
        `你是一个很有自己节奏的混合型选手：${dimensionOrder.map((code, index) => formatDimensionSummary(code, typeCode[index])).join('，')}。`,
        `放到当前 ${variant.shortLabel} 的结果池里，你最接近【${matchedPersonality.name}】。`
    ].join('');

    return {
        name: `${matchedPersonality.name}·混合型`,
        description,
        traits,
        quote: '',
        typeCode,
        matchedTypeCode,
        exactMatch: false,
        matchNote: `你的五维组合是 ${typeCode}。当前使用 ${variant.shortLabel}，未命中固定原型的组合会归入最接近且分布更均匀的参考原型 ${matchedPersonality.name}（${matchedTypeCode}）。`,
        imageName: matchedPersonality.name
    };
}

function getBalancedReferenceTypeCode(typeCode, variantId = defaultQuizVariantId) {
    const { assignments } = getBalancedVariantData(variantId);

    return assignments[typeCode] || findNearestTypeCode(typeCode);
}

function getBalancedVariantData(variantId = defaultQuizVariantId) {
    if (balancedVariantCache.has(variantId)) {
        return balancedVariantCache.get(variantId);
    }

    const variant = getVariantConfigOrThrow(variantId);
    const archetypeCodes = Object.keys(personalityTypes);
    const targetLoad = 1 / archetypeCodes.length;
    const assignments = {};
    const loads = new Map(archetypeCodes.map(code => [code, variant.codeWeights[code] || 0]));
    const movableCodes = Object.entries(variant.codeWeights)
        .filter(([code]) => !personalityTypes[code])
        .sort((left, right) => right[1] - left[1]);

    archetypeCodes.forEach(code => {
        assignments[code] = code;
    });

    movableCodes.forEach(([code, weight]) => {
        let bestCandidate = archetypeCodes[0];
        let bestScore = Number.POSITIVE_INFINITY;

        archetypeCodes.forEach(candidate => {
            const projectedLoad = loads.get(candidate) + weight;
            const score = Math.pow(projectedLoad - targetLoad, 2) * 1000 +
                getTypeCodeDistance(code, candidate) * weight * 2 +
                projectedLoad * 0.05;

            if (score < bestScore || (score === bestScore && candidate.localeCompare(bestCandidate, 'en') < 0)) {
                bestCandidate = candidate;
                bestScore = score;
            }
        });

        assignments[code] = bestCandidate;
        loads.set(bestCandidate, loads.get(bestCandidate) + weight);
    });

    optimizeBalancedAssignments(assignments, loads, movableCodes, archetypeCodes, targetLoad);

    const data = {
        assignments,
        loads: Object.fromEntries(loads)
    };

    balancedVariantCache.set(variantId, data);
    return data;
}

function optimizeBalancedAssignments(assignments, loads, movableCodes, archetypeCodes, targetLoad) {
    let improved = true;
    let iteration = 0;
    const sortedCodes = [...movableCodes].sort((left, right) => right[1] - left[1]);

    while (improved && iteration < 20) {
        improved = false;
        iteration += 1;

        sortedCodes.forEach(([code, weight]) => {
            const currentTargetCode = assignments[code];
            const currentDistance = getTypeCodeDistance(code, currentTargetCode);
            const currentObjective = getLoadObjective(loads, targetLoad);
            let bestCandidate = null;
            let bestObjective = currentObjective;

            archetypeCodes.forEach(candidate => {
                if (candidate === currentTargetCode) {
                    return;
                }

                const nextLoads = new Map(loads);
                nextLoads.set(currentTargetCode, nextLoads.get(currentTargetCode) - weight);
                nextLoads.set(candidate, nextLoads.get(candidate) + weight);

                const nextObjective = getLoadObjective(nextLoads, targetLoad) +
                    (getTypeCodeDistance(code, candidate) - currentDistance) * weight * 0.02;

                if (nextObjective + 1e-12 < bestObjective) {
                    bestCandidate = candidate;
                    bestObjective = nextObjective;
                }
            });

            if (!bestCandidate) {
                return;
            }

            loads.set(currentTargetCode, loads.get(currentTargetCode) - weight);
            loads.set(bestCandidate, loads.get(bestCandidate) + weight);
            assignments[code] = bestCandidate;
            improved = true;
        });
    }
}

function getLoadObjective(loads, targetLoad) {
    let objective = 0;

    loads.forEach(load => {
        objective += Math.pow(load - targetLoad, 2);
    });

    return objective;
}

function getTypeCodeDistance(leftCode, rightCode) {
    return dimensionOrder.reduce((total, code, index) => {
        const difference = levelValues[leftCode[index]] - levelValues[rightCode[index]];
        return total + difference * difference;
    }, 0);
}

function findNearestTypeCode(typeCode) {
    const candidates = Object.keys(personalityTypes).map(candidateCode => ({
        code: candidateCode,
        distance: getTypeCodeDistance(typeCode, candidateCode),
        exactDimensions: dimensionOrder.reduce((count, code, index) => count + Number(typeCode[index] === candidateCode[index]), 0)
    }));

    candidates.sort((left, right) => {
        return left.distance - right.distance ||
            right.exactDimensions - left.exactDimensions ||
            left.code.localeCompare(right.code, 'en');
    });

    return candidates[0].code;
}

function getVariantConfigOrThrow(variantId = defaultQuizVariantId) {
    if (typeof getQuizVariantConfig !== 'function') {
        throw new Error('quiz-variants.js 未正确加载，无法读取版本配置。');
    }

    return getQuizVariantConfig(variantId);
}

function getDimensionQuestionCounts(variantId = defaultQuizVariantId) {
    return getVariantConfigOrThrow(variantId).dimensionCounts;
}

function getDimensionThresholds(variantId = defaultQuizVariantId) {
    return getVariantConfigOrThrow(variantId).thresholds;
}

function getDimensionLevel(score, code, variantId = defaultQuizVariantId) {
    const { low, mid } = getDimensionThresholds(variantId)[code];

    if (score <= low) {
        return 'L';
    }

    if (score <= mid) {
        return 'M';
    }

    return 'H';
}

function validatePersonalityTypes(typeMap) {
    Object.entries(typeMap).forEach(([typeCode, personality]) => {
        if (!/^[LMH]{5}$/.test(typeCode)) {
            throw new Error(`人格类型代码 ${typeCode} 不合法。`);
        }

        if (!personality.name || !personality.description || !Array.isArray(personality.traits)) {
            throw new Error(`人格类型 ${typeCode} 的数据不完整。`);
        }
    });
}

function formatDimensionSummary(code, level) {
    const trait = getDimensionTrait(code, level);

    switch (code) {
        case 'W':
            return `抽象度偏${trait}`;
        case 'L':
            return `撒娇度更接近${trait}`;
        case 'T':
            return `冲动度属于${trait}`;
        case 'I':
            return `反撩度是${trait}`;
        case 'Q':
            return `气质上偏${trait}`;
        default:
            return `${getDimensionName(code)}是${trait}`;
    }
}

function getDimensionTrait(code, level) {
    return dimensionDetails[code].traitLabels[level];
}

function getDimensionName(code) {
    return dimensionDetails[code].name;
}

function getLevelName(level) {
    return levelNames[level];
}
