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
    // 1. 碳眠无郎 HHHHH
    HHHHH: {
        name: '碳眠无郎',
        description: '简直是王蕾本蕾！',
        traits: ['抽象乐子人', '高糖可爱多', '冲动带节奏', '说谢谢了吗', '纸张仓鼠'],
        quote: '「欢迎来到抖音CS女主播碳眠无郎的直播间！」'
    },
    // 2. 可爱小猫 LHLMH
    LHLMH: {
        name: '可爱小猫',
        description: '你是一只可爱的小猫咪。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「喵喵 喵喵喵喵~」'
    },
    // 3. 王老急 LLHML
    LLHML: {
        name: '王老急',
        description: '你是急性子代表，遇事容易冲动。职业酷姐的外表下藏着一颗容易炸毛的心。',
        traits: ['正常直球', '不处', '冲动带节奏', '正常互动', '职业酷姐'],
        quote: '「啊啊啊啊啊啊啊啊！」'
    },
    // 4. 高冷枪女 LLLLL
    LLLLL: {
        name: '高冷枪女',
        description: '你是纯粹的职业选手气质，克制、专注、冷酷而优雅。',
        traits: ['正常直球', '不处', '无所谓我会出手', '沉默是金', '职业酷姐'],
        quote: '「无所谓，我会出手」'
    },
    // 5. 恩师王蕾 MMMHM
    MMMHM: {
        name: '恩师王蕾',
        description: '你像一位温柔的老师，既能教学又能整活，粉丝都想叫你一声"恩师"。',
        traits: ['偶尔抽象', '中性', '正常水平', '说谢谢了吗', '中和小猫'],
        quote: '「我这道具你就学吧」'
    },
    // 6. 训犬师 MLHHM
    MLHHM: {
        name: '训犬师',
        description: '你是直播间训犬师。',
        traits: ['偶尔抽象', '不处', '冲动带节奏', '说谢谢了吗', '中和小猫'],
        quote: '「跪下！」'
    },
    // 7. 语言尖刀 HLMHL
    HLMHL: {
        name: '语言尖刀',
        description: '你的话就像尖刀，抽象但犀利。',
        traits: ['抽象乐子人', '不处', '正常水平', '说谢谢了吗', '职业酷姐'],
        quote: '「婉拒了哈」'
    },
    // 8. 打区糕手 LMHLM
    LMHLM: {
        name: '打区糕手',
        description: '你喜欢在CS里放鞭炮和购买高价烧火棍。',
        traits: ['正常直球', '中性', '冲动带节奏', '沉默是金', '中和小猫'],
        quote: '「新年快乐！」'
    },
    // 9. 正中大飞柱 HMHMM
    HMHMM: {
        name: '正中大飞柱',
        description: '你是超级无敌大吃货，是赛尔号一直苦苦追寻的无尽能源。',
        traits: ['抽象乐子人', '中性', '冲动带节奏', '正常互动', '中和小猫'],
        quote: '「我要不要再点个夜宵！」'
    },
    // 10. 老二次元 HMLMH
    HMLMH: {
        name: '老二次元',
        description: '你是从小看番的老二次元，追番漫展一个不落。',
        traits: ['抽象乐子人', '中性', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「上官子怡在此」'
    },
    // 11. 妈妈 LHLMM
    LHLMM: {
        name: '妈妈',
        description: '你就像直播间的妈妈。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '正常互动', '中和小猫'],
        quote: '「叫我什么？」'
    },
    // 12. 慈善家 LMHLL
    LMHLL: {
        name: '慈善家',
        description: '你经常冲动消费，促进经济发展，你不是浪费钱，你是大善。',
        traits: ['正常直球', '中性', '冲动带节奏', '沉默是金', '职业酷姐'],
        quote: '「谁还没听过2400略磨反冲精英的故事」'
    },
    // 13. 科二刺客 LLHLL
    LLHLL: {
        name: '科二刺客',
        description: '科目二是你的噩梦，五次机会完全不够用。',
        traits: ['正常直球', '不处', '冲动带节奏', '沉默是金', '职业酷姐'],
        quote: '「不学车了！」'
    },
    // 14. 纸张仓鼠 LHLLH
    LHLLH: {
        name: '纸张仓鼠',
        description: '你是纯粹的可爱担当，会撒娇但不抽象不冲动。',
        traits: ['正常直球', '高糖可爱多', '无所谓我会出手', '沉默是金', '纸张仓鼠'],
        quote: '「可爱就完事了」'
    },
    // 15. 炼金术士 MLHML
    MLHML: {
        name: '炼金术士',
        description: '你可能会在直播时不小心把雷击皮肤炼了，然后当场破防，堪称炼金事故专业户。',
        traits: ['偶尔抽象', '不处', '冲动带节奏', '正常互动', '职业酷姐'],
        quote: '「啊啊啊我的雷击！」'
    },
    // 16. 上官子怡 HMMLM
    HMMLM: {
        name: '上官子怡',
        description: '你可能小学就开始网恋，取名"上官子怡"，是个有故事的人。',
        traits: ['抽象乐子人', '中性', '正常水平', '沉默是金', '中和小猫'],
        quote: '「谁不想要一段甜甜的恋爱呢」'
    },
    // 17. 邪恶小猫 HHMHH
    HHMHH: {
        name: '邪恶小猫',
        description: '你是可爱和邪恶的结合体，就像一只会咬人的小猫，可爱但危险。',
        traits: ['抽象乐子人', '高糖可爱多', '正常水平', '说谢谢了吗', '纸张仓鼠'],
        quote: '「嘿嘿嘿~」'
    },
    // 18. 大糖王朝 HHLMH
    HHLMH: {
        name: '大糖王朝',
        description: '你糖完了，需要大量胰岛素。',
        traits: ['抽象乐子人', '高糖可爱多', '无所谓我会出手', '正常互动', '纸张仓鼠'],
        quote: '「嘿嘿嘿嘿嘿」'
    },
    // 19. 大主播 MMMHH
    MMMHH: {
        name: '大主播',
        description: '你就是标准的大主播，你无敌了。',
        traits: ['偶尔抽象', '中性', '正常水平', '说谢谢了吗', '纸张仓鼠'],
        quote: '「这就是大主播」'
    },
    // 20. 我是丈育 HLMLL
    HLMLL: {
        name: '我是丈育',
        description: '你有一种小脑发育不完全，大脑完全不发育的美感。',
        traits: ['抽象乐子人', '不处', '正常水平', '沉默是金', '职业酷姐'],
        quote: '「七七三十六，五七二十九」'
    }
};

let cachedDimensionQuestionCounts = null;
let hasValidatedQuestionBank = false;

validatePersonalityTypes(personalityTypes);

// 根据分数计算人格类型
function calculatePersonalityType(scores) {
    const dimensions = getDimensionLevels(scores);
    const typeCode = buildTypeCode(dimensions);
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

    return buildCompositeResult(typeCode, scores);
}

// 根据分数确定等级 (L/M/H)
function getLevel(score, questionCount) {
    const minScore = questionCount;
    const maxScore = questionCount * 3;
    const range = maxScore - minScore;

    if (score <= minScore + range * 0.33) return 'L';
    if (score <= minScore + range * 0.66) return 'M';
    return 'H';
}

function getDimensionLevels(scores) {
    const dimensions = {};
    const dimensionQuestionCounts = getDimensionQuestionCounts();

    dimensionOrder.forEach(code => {
        dimensions[code] = getLevel(scores[code], dimensionQuestionCounts[code]);
    });

    return dimensions;
}

function buildTypeCode(dimensions) {
    return dimensionOrder.map(code => dimensions[code]).join('');
}

function buildCompositeResult(typeCode, scores) {
    const closest = findClosestType(scores, typeCode);
    const traits = dimensionOrder.map((code, index) => getDimensionTrait(code, typeCode[index]));
    const description = [
        `你是一个很有自己节奏的混合型选手：${dimensionOrder.map((code, index) => formatDimensionSummary(code, typeCode[index])).join('，')}。`,
        `放到现有20种原型里，你最接近【${closest.personality.name}】。`
    ].join('');

    return {
        name: `${closest.personality.name}·混合型`,
        description,
        traits,
        quote: '',
        typeCode,
        matchedTypeCode: closest.code,
        exactMatch: false,
        matchNote: `你的五维组合是 ${typeCode}，当前题库没有完全对应的固定原型，因此展示最接近的参考原型 ${closest.personality.name}（${closest.code}）。`,
        imageName: closest.personality.name
    };
}

function findClosestType(scores, typeCode) {
    const averageProfile = getAverageProfile(scores);
    const candidates = Object.entries(personalityTypes).map(([candidateCode, personality]) => {
        const exactDimensions = dimensionOrder.reduce((count, code, index) => {
            return count + Number(typeCode[index] === candidateCode[index]);
        }, 0);

        const distance = dimensionOrder.reduce((total, code, index) => {
            const diff = averageProfile[code] - levelValues[candidateCode[index]];
            return total + diff * diff;
        }, 0);

        return {
            code: candidateCode,
            personality,
            distance,
            exactDimensions,
            codeDistance: dimensionOrder.length - exactDimensions
        };
    });

    candidates.sort((left, right) => {
        return left.distance - right.distance ||
            right.exactDimensions - left.exactDimensions ||
            left.codeDistance - right.codeDistance ||
            left.code.localeCompare(right.code, 'en');
    });

    return candidates[0];
}

function getAverageProfile(scores) {
    const averageProfile = {};
    const dimensionQuestionCounts = getDimensionQuestionCounts();

    dimensionOrder.forEach(code => {
        averageProfile[code] = scores[code] / dimensionQuestionCounts[code];
    });

    return averageProfile;
}

function buildDimensionQuestionCounts(questionList) {
    if (!Array.isArray(questionList)) {
        throw new Error('questions.js 未正确加载，无法统计维度题数。');
    }

    const counts = { W: 0, L: 0, T: 0, I: 0, Q: 0 };

    questionList.forEach((question, questionIndex) => {
        if (!Array.isArray(question.dimension) || question.dimension.length === 0) {
            throw new Error(`第 ${questionIndex + 1} 题缺少维度定义。`);
        }

        question.dimension.forEach(code => {
            if (!dimensionOrder.includes(code)) {
                throw new Error(`第 ${questionIndex + 1} 题使用了未知维度 ${code}。`);
            }
            counts[code] += 1;
        });
    });

    return counts;
}

function getQuestionBank() {
    if (typeof questions === 'undefined' || !Array.isArray(questions)) {
        throw new Error('questions.js 未正确加载，无法读取题库。');
    }

    return questions;
}

function ensureQuestionBankValidated() {
    if (!hasValidatedQuestionBank) {
        validateQuestionBank(getQuestionBank());
        hasValidatedQuestionBank = true;
    }
}

function getDimensionQuestionCounts() {
    ensureQuestionBankValidated();

    if (!cachedDimensionQuestionCounts) {
        cachedDimensionQuestionCounts = buildDimensionQuestionCounts(getQuestionBank());
    }

    return cachedDimensionQuestionCounts;
}

function validateQuestionBank(questionList) {
    questionList.forEach((question, questionIndex) => {
        if (!Array.isArray(question.options) || question.options.length !== 3) {
            throw new Error(`第 ${questionIndex + 1} 题的选项数量不正确。`);
        }

        const expectedDimensions = [...question.dimension].sort().join(',');

        question.options.forEach((option, optionIndex) => {
            const scoreKeys = Object.keys(option.scores || {}).sort().join(',');
            if (scoreKeys !== expectedDimensions) {
                throw new Error(`第 ${questionIndex + 1} 题第 ${optionIndex + 1} 个选项的计分维度与题目定义不一致。`);
            }

            Object.values(option.scores).forEach(score => {
                if (![1, 2, 3].includes(score)) {
                    throw new Error(`第 ${questionIndex + 1} 题第 ${optionIndex + 1} 个选项存在非法分值 ${score}。`);
                }
            });
        });
    });
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

// 获取维度中文名称
function getDimensionName(code) {
    return dimensionDetails[code].name;
}

// 获取维度等级中文
function getLevelName(level) {
    return levelNames[level];
}
