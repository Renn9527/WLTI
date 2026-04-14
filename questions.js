// 题目数据
const questions = [
    {
        id: 1,
        title: "你会给自己取什么样的网名？",
        dimension: ["W"],
        options: [
            { text: "A. 简单好记的真名或昵称（如：渣精、老肥）", scores: { W: 1 } },
            { text: "B. 有点意境的独特风格（如：超绝蕾，老板娘）", scores: { W: 2 } },
            { text: "C. 完全抽象让人摸不着头脑（如：碳眠无郎、熟食国光、超威法子头）", scores: { W: 3 } }
        ]
    },
    {
        id: 2,
        title: "小学时期的你会做什么？",
        dimension: ["L", "W"],
        options: [
            { text: "A. 好好学习天天向上，网恋是什么", scores: { L: 1, W: 1 } },
            { text: "B. 偷偷玩QQ空间，加几个网友聊聊天", scores: { L: 2, W: 2 } },
            { text: 'C. 网恋！还要取个霸气的网名叫"上官子怡"', scores: { L: 3, W: 3 } }
        ]
    },
    {
        id: 3,
        title: '直播间有粉丝天天发"想变成小狗被你玩"，你会？',
        dimension: ["I"],
        options: [
            { text: "A. 直接无视或拉黑，不想搭理", scores: { I: 1 } },
            { text: 'B. 礼貌回应："谢谢支持哈"', scores: { I: 2 } },
            { text: 'C. 反撩回去："那就给我叫两声听听"', scores: { I: 3 } }
        ]
    },
    {
        id: 4,
        title: '粉丝说"能不能提一个小小要求"，你会？',
        dimension: ["I", "L"],
        options: [
            { text: "A. 严肃警告：滚", scores: { I: 1, L: 1 } },
            { text: "B. 尴尬笑笑：兄弟你清醒一点", scores: { I: 2, L: 2 } },
            { text: "C. 调侃回应：婉拒了哈", scores: { I: 3, L: 3 } }
        ]
    },
    {
        id: 5,
        title: "18岁考驾照，科目二考了5次都没过，你会？",
        dimension: ["T"],
        options: [
            { text: "A. 冷静分析问题，继续苦练基本功", scores: { T: 1 } },
            { text: "B. 有点急但还能稳住，再报名继续考", scores: { T: 2 } },
            { text: "C. 心态爆炸！为什么我就是过不了！（但还是会继续考）", scores: { T: 3 } }
        ]
    },
    {
        id: 6,
        title: "喝醉酒直播，被问电脑配置，你会回答？",
        dimension: ["T", "W"],
        options: [
            { text: "A. 认真查看配置后详细回答", scores: { T: 1, W: 1 } },
            { text: "B. 大概说说CPU、显卡型号", scores: { T: 2, W: 2 } },
            { text: 'C. "两个内存条！"（完全抽象回答）', scores: { T: 3, W: 3 } }
        ]
    },
    {
        id: 7,
        title: "CS直播炼金，不小心把珍贵的雷击皮肤炼了，你会？",
        dimension: ["T"],
        options: [
            { text: "A. 冷静接受，反正游戏而已", scores: { T: 1 } },
            { text: "B. 懊恼一会儿，但很快调整心态", scores: { T: 2 } },
            { text: 'C. 当场破防！"啊啊啊我的雷击！"', scores: { T: 3 } }
        ]
    },
    {
        id: 8,
        title: "打只狼和鬼刑部鏖战无数次，你的状态是？",
        dimension: ["Q"],
        options: [
            { text: "A. 冷静分析BOSS招式，职业选手心态", scores: { Q: 1 } },
            { text: "B. 有点急但还在坚持，偶尔吐槽", scores: { Q: 2 } },
            { text: 'C. 边打边跳边叫："啊啊啊！又死了！"', scores: { Q: 3 } }
        ]
    },
    {
        id: 9,
        title: "半夜想吃东西，你会？",
        dimension: ["T", "Q"],
        options: [
            { text: "A. 忍住！为了健康不吃", scores: { T: 1, Q: 1 } },
            { text: "B. 吃点肉干", scores: { T: 2, Q: 2 } },
            { text: "C. 先来两个销魂大鸡腿开开胃", scores: { T: 3, Q: 3 } }
        ]
    },
    {
        id: 10,
        title: "CS皮肤刚出新品最高价2400块，你会？",
        dimension: ["T"],
        options: [
            { text: "A. 等降价再买，理性消费", scores: { T: 1 } },
            { text: "B. 观望几天看看行情", scores: { T: 2 } },
            { text: "C. 冲！我是理财大师！（结果现在只值400块）", scores: { T: 3 } }
        ]
    },
    {
        id: 11,
        title: "你喜欢的职业选手Niko，你会怎么称呼？",
        dimension: ["L"],
        options: [
            { text: 'A. 就叫名字或"Niko选手"', scores: { L: 1 } },
            { text: 'B. "我喜欢的选手"、"我偶像"', scores: { L: 2 } },
            { text: 'C. 直接叫"老公"！', scores: { L: 3 } }
        ]
    },
    {
        id: 12,
        title: "直播时粉丝刷礼物，你会？",
        dimension: ["I", "L"],
        options: [
            { text: 'A. 简单感谢："谢谢老板"', scores: { I: 1, L: 1 } },
            { text: "B. 真诚感谢并互动几句", scores: { I: 2, L: 2 } },
            { text: 'C. "说谢谢了吗？"', scores: { I: 3, L: 3 } }
        ]
    },
    {
        id: 13,
        title: "你的日常说话风格是？",
        dimension: ["W"],
        options: [
            { text: "A. 正常直球，有什么说什么", scores: { W: 1 } },
            { text: "B. 偶尔整点梗和抽象发言", scores: { W: 2 } },
            { text: "C. 抽象乐子人，经常让人摸不着头脑", scores: { W: 3 } }
        ]
    },
    {
        id: 14,
        title: "游戏里犯了低级失误，你会？",
        dimension: ["Q", "T"],
        options: [
            { text: "A. 冷静复盘，下次注意", scores: { Q: 1, T: 1 } },
            { text: "B. 小小懊恼一下继续", scores: { Q: 2, T: 2 } },
            { text: 'C. "啊啊啊我怎么这么菜！"（抓狂）', scores: { Q: 3, T: 3 } }
        ]
    },
    {
        id: 15,
        title: "你的社交媒体账号名会是？",
        dimension: ["W", "Q"],
        options: [
            { text: "A. 真名或职业相关的正经名字", scores: { W: 1, Q: 1 } },
            { text: "B. 有点个性但能看懂的名字", scores: { W: 2, Q: 2 } },
            { text: "C. b1u1d、作用哥这种让人完全看不懂的", scores: { W: 3, Q: 3 } }
        ]
    },
    {
        id: 16,
        title: "遇到很大压力时，你会？",
        dimension: ["T", "Q"],
        options: [
            { text: "A. 冷静分析，制定计划解决", scores: { T: 1, Q: 1 } },
            { text: "B. 找朋友倾诉，寻求支持", scores: { T: 2, Q: 2 } },
            { text: "C. 情绪化反应，可能会冲动做决定", scores: { T: 3, Q: 3 } }
        ]
    },
    {
        id: 17,
        title: "面对粉丝的调侃和玩笑，你的底线是？",
        dimension: ["I"],
        options: [
            { text: "A. 保持距离，不太接梗", scores: { I: 1 } },
            { text: "B. 适度互动，把握分寸", scores: { I: 2 } },
            { text: "C. 来者不拒，反撩回去，气氛组担当", scores: { I: 3 } }
        ]
    },
    {
        id: 18,
        title: "你会在直播中展现可爱的一面吗？",
        dimension: ["L", "Q"],
        options: [
            { text: "A. 不会，保持职业和冷静形象", scores: { L: 1, Q: 1 } },
            { text: "B. 偶尔会，看心情和氛围", scores: { L: 2, Q: 2 } },
            { text: "C. 经常！各种可爱反应和撒娇", scores: { L: 3, Q: 3 } }
        ]
    },
    {
        id: 19,
        title: "学习新游戏或新技能时，你的态度是？",
        dimension: ["T"],
        options: [
            { text: "A. 系统学习，稳扎稳打", scores: { T: 1 } },
            { text: "B. 边学边玩，正常进度", scores: { T: 2 } },
            { text: "C. 直接上手！不行再说！（容易急躁）", scores: { T: 3 } }
        ]
    },
    {
        id: 20,
        title: "你的直播内容会是什么风格？",
        dimension: ["W", "I"],
        options: [
            { text: "A. 专注游戏技术，少聊天", scores: { W: 1, I: 1 } },
            { text: "B. 游戏和聊天结合，正常互动", scores: { W: 2, I: 2 } },
            { text: "C. 整活为主，抽象发言，和粉丝疯狂互动", scores: { W: 3, I: 3 } }
        ]
    },
    {
        id: 21,
        title: "你在镜头前的情绪表达是？",
        dimension: ["Q", "L"],
        options: [
            { text: "A. 克制冷静，职业主播范儿", scores: { Q: 1, L: 1 } },
            { text: "B. 自然真实，该笑笑该急急", scores: { Q: 2, L: 2 } },
            { text: "C. 情绪丰富，像小动物一样生动", scores: { Q: 3, L: 3 } }
        ]
    },
    {
        id: 22,
        title: "有人在直播间批评你，你会？",
        dimension: ["T", "I"],
        options: [
            { text: "A. 不理会，继续做自己的", scores: { T: 1, I: 1 } },
            { text: "B. 理性回应，解释一下", scores: { T: 2, I: 2 } },
            { text: "C. 可能会怼回去或情绪化回应", scores: { T: 3, I: 3 } }
        ]
    },
    {
        id: 23,
        title: "你的生活方式是？",
        dimension: ["W", "T"],
        options: [
            { text: "A. 规律作息，健康生活", scores: { W: 1, T: 1 } },
            { text: "B. 比较随性，但不太出格", scores: { W: 2, T: 2 } },
            { text: "C. 想到什么做什么，半夜出去喝酒喝到胃胀气都行", scores: { W: 3, T: 3 } }
        ]
    },
    {
        id: 24,
        title: "在团队游戏中，你的角色是？",
        dimension: ["I", "Q"],
        options: [
            { text: "A. 冷静指挥，战术核心", scores: { I: 1, Q: 1 } },
            { text: "B. 正常队友，配合团队", scores: { I: 2, Q: 2 } },
            { text: "C. 气氛组，边打边和队友互动整活", scores: { I: 3, Q: 3 } }
        ]
    },
    {
        id: 25,
        title: "你觉得自己最像王蕾的哪一面？",
        dimension: ["W", "L", "T", "I", "Q"],
        options: [
            { text: "A. 职业主播的专业和冷静", scores: { W: 1, L: 1, T: 1, I: 1, Q: 1 } },
            { text: "B. 真实自然的性格", scores: { W: 2, L: 2, T: 2, I: 2, Q: 2 } },
            { text: "C. 可爱抽象的反差萌", scores: { W: 3, L: 3, T: 3, I: 3, Q: 3 } }
        ]
    }
];
