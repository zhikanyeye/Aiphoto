// 防止调试的代码
(function() {
    // 检测开发者工具
    function detectDevTools() {
        const widthThreshold = window.outerWidth - window.innerWidth > 200;
        const heightThreshold = window.outerHeight - window.innerHeight > 200;
        
        if (widthThreshold || heightThreshold) {
            console.warn('检测到开发者工具已打开，部分功能可能受限');
            return true;
        }
        return false;
    }
    
    setInterval(detectDevTools, 3000);
    
    const isBot = navigator.userAgent.toLowerCase().indexOf('bot') > -1 ||
                  navigator.userAgent.toLowerCase().indexOf('spider') > -1 ||
                  navigator.userAgent.toLowerCase().indexOf('crawl') > -1;
    
    if (isBot) {
        const debug = function() {
            debugger;
        };
        
        const debugLoop = function() {
            try {
                if (isDevToolsOpen()) {
                    debug();
                }
            } catch (e) {}
            setTimeout(debugLoop, 300);
        };
        
        function isDevToolsOpen() {
            const start = performance.now();
            for (let i = 0; i < 300; i++) {
                console.log(i);
                console.clear();
            }
            const end = performance.now();
            return (end - start) > 200;
        }
        
        setTimeout(debugLoop, 2000);
    }
})();

const inspirations = [
    '🐼 宇宙飞行员在月球上种竹子 | astronaut planting bamboo on the moon',
    '🎨 水彩画风格的彩虹独角兽 | watercolor style rainbow unicorn',
    '🌟 未来城市中的飞行汽车 | flying cars in futuristic city',
    '🎸 霓虹灯下的街头艺人 | street performer under neon lights',
    '🌺 樱花树下打太极的熊猫 | panda doing tai chi under cherry blossoms',
    '🎠 童话世界的旋转木马 | carousel in fairy tale world',
    '🌈 云端上的城堡 | castle in the clouds',
    '🎮 赛博朋克风格的机器人 | cyberpunk style robot'
];

// 添加一个提示词优化库 - 包含不同风格和详细描述
const promptEnhancements = {
    styles: [
        { name: '油画风格', en: 'oil painting style', desc: '经典油画效果，细腻的笔触和丰富的色彩层次' },
        { name: '水彩画风格', en: 'watercolor style', desc: '轻盈透明的水彩效果，柔和的色彩过渡' },
        { name: '素描风格', en: 'sketch style', desc: '黑白或单色的线条绘画，强调结构和线条' },
        { name: '赛博朋克', en: 'cyberpunk style', desc: '霓虹灯、未来科技与颓废元素的结合' },
        { name: '梦幻仙境', en: 'fantasy dreamland', desc: '超现实且充满魔幻色彩的梦幻场景' },
        { name: '极简主义', en: 'minimalist style', desc: '简洁、留白、关注核心元素的设计风格' },
        { name: '像素艺术', en: 'pixel art style', desc: '复古游戏风格的像素化图像' },
        { name: '未来主义', en: 'futuristic style', desc: '科技感十足，展示未来世界的设计风格' },
        { name: '复古怀旧', en: 'retro vintage style', desc: '带有年代感的复古效果，如80年代风格' }
    ],
    details: [
        { name: '高细节', en: 'highly detailed', desc: '增加图像的精细程度和细节丰富度' },
        { name: '柔和光线', en: 'soft lighting', desc: '创造温暖、柔和的光线效果' },
        { name: '鲜艳色彩', en: 'vivid colors', desc: '增强色彩的饱和度和鲜艳程度' },
        { name: '电影感', en: 'cinematic', desc: '如电影场景般的构图和氛围' },
        { name: '写实风格', en: 'photorealistic', desc: '接近照片级别的真实感' },
        { name: '梦幻光效', en: 'dreamy lighting', desc: '梦幻般的光线效果，如光晕或光束' },
        { name: '广角视图', en: 'wide angle view', desc: '广阔的视野，展示更多场景元素' },
        { name: '特写视图', en: 'close-up view', desc: '近距离展示主体，突出细节' },
        { name: '对比强烈', en: 'high contrast', desc: '强化明暗对比，创造戏剧性效果' }
    ],
    subjects: [
        { name: '人物肖像', en: 'portrait of a person', desc: '突出展示人物面部和特征' },
        { name: '风景', en: 'landscape', desc: '自然或城市风光场景' },
        { name: '动物', en: 'animal', desc: '各种动物为主体的图像' },
        { name: '静物', en: 'still life', desc: '静态物品的艺术展示' },
        { name: '抽象', en: 'abstract', desc: '非具象的艺术表达' },
        { name: '科幻', en: 'sci-fi', desc: '科学幻想主题' },
        { name: '奇幻', en: 'fantasy', desc: '魔法和奇幻元素' }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const inspirationList = document.getElementById('inspirationList');
    inspirations.forEach(inspiration => {
        const div = document.createElement('div');
        div.className = 'inspiration-item p-3 rounded-lg text-sm text-gray-600';
        div.onclick = () => useInspiration(inspiration);
        div.textContent = inspiration.split('|')[0].trim();
        div.title = inspiration.split('|')[1].trim();
        inspirationList.appendChild(div);
    });

    document.getElementById('prompt').value = '宇宙飞行员在月球上种竹子';
    
    // 检查API密钥是否已配置
    checkApiKeyStatus();
    
    // 初始化API设置按钮状态
    initializeApiButtonState();
    
    // 设置网站标题点击事件
    setupTitleClickHandler();
    
    // 添加提示文字渐隐效果
    const promptHint = document.getElementById('promptHint');
    const promptTextarea = document.getElementById('prompt');
    
    // 强制添加键盘事件监听器 - 确保Enter键被正确处理
    promptTextarea.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            generateImage();
        }
    });
    
    // 初始显示提示
    promptHint.style.opacity = '1';
    
    // 立即应用渐隐样式
    promptHint.style.transition = 'opacity 0.3s ease';
    
    // 5秒后开始渐隐
    setTimeout(() => {
        promptHint.style.opacity = '0.7';
    }, 5000);
    
    // 光标移入输入框时隐藏提示
    promptTextarea.addEventListener('focus', () => {
        promptHint.style.opacity = '0';
    });
    
    // 光标移出输入框且内容为空时显示提示
    promptTextarea.addEventListener('blur', () => {
        if (promptTextarea.value.trim() === '') {
            promptHint.style.opacity = '0.7';
        }
    });
    
    // 鼠标悬停在输入框上时隐藏提示
    promptTextarea.addEventListener('mouseover', () => {
        promptHint.style.opacity = '0';
    });
    
    // 鼠标离开输入框且内容为空时显示提示
    promptTextarea.addEventListener('mouseout', () => {
        if (promptTextarea.value.trim() === '' && document.activeElement !== promptTextarea) {
            promptHint.style.opacity = '0.7';
        }
    });
    
    // 输入内容时隐藏提示
    promptTextarea.addEventListener('input', () => {
        if (promptTextarea.value.trim() !== '') {
            promptHint.style.opacity = '0';
        } else if (document.activeElement !== promptTextarea) {
            promptHint.style.opacity = '0.7';
        }
    });
    
    // 添加提示词优化器
    addPromptEnhancer();
    
    // 添加清空按钮
    addClearPromptButton();
    
    // 添加公告弹窗
    const announcement = document.createElement('div');
    announcement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 md:p-6 rounded-lg shadow-2xl z-50 max-w-md w-[90%] md:w-full mx-auto animate-fade-in';
    announcement.innerHTML = `
        <div class="text-center">
            <h3 class="text-lg md:text-xl font-bold mb-3 md:mb-4">✨ 特别鸣谢 ✨</h3>
            <p class="mb-3 md:mb-4 text-sm md:text-base">感谢 <a href="https://pollinations.ai" target="_blank" class="underline hover:text-pink-200">Pollinations.ai</a> 提供的优质图片生成服务</p>
            <p class="mb-3 md:mb-4 text-sm md:text-base">本站由 <a href="https://github.com/zhikanyeye" target="_blank" class="underline hover:text-pink-200">@zhikanyeye</a> 维护</p>
            <button onclick="this.parentElement.parentElement.remove()" class="bg-white text-purple-600 px-4 md:px-6 py-1 md:py-2 rounded-full hover:bg-pink-100 transition-colors text-sm md:text-base">
                知道了
            </button>
        </div>
    `;
    
    // 添加动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
    
    // 添加弹窗到页面
    document.body.appendChild(announcement);
    
    // 5秒后自动关闭
    setTimeout(() => {
        if (announcement.parentElement) {
            announcement.style.transition = 'opacity 0.5s ease-out';
            announcement.style.opacity = '0';
            setTimeout(() => announcement.remove(), 500);
        }
    }, 5000);
    
    // 创建图片预览功能
    createImagePreview();
    
    // 初始化时调整一次布局
    adjustLayoutForMobile();
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustLayoutForMobile);
    
    // // 设置简单的渐变背景 (已被随机背景替换)
    // document.body.style.background = 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)';
    
    // 初始化参数提示工具提示
    setTimeout(initializeTooltips, 100);

});

function toggleTag(element) {
    element.classList.toggle('active');
}

function getSelectedTags(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .quality-tag.active`))
        .map(tag => tag.getAttribute('data-en'));
}

// 分析中文提示词并给出智能优化建议
function analyzePrompt(text) {
    // 基本分析结果对象
    const analysis = {
        hasStyleInfo: false,
        hasDetailInfo: false,
        suggestedStyles: [],
        suggestedDetails: [],
        suggestedTemplates: []
    };
    
    // 检测是否已包含风格信息
    promptEnhancements.styles.forEach(style => {
        if (text.includes(style.name)) {
            analysis.hasStyleInfo = true;
        }
    });
    
    // 检测是否已包含细节信息
    promptEnhancements.details.forEach(detail => {
        if (text.includes(detail.name)) {
            analysis.hasDetailInfo = true;
        }
    });
    
    // 智能推荐风格（基于内容匹配而非随机）
    if (!analysis.hasStyleInfo) {
        // 根据主题类别推荐风格
        const category = predictSubjectCategory(text);
        
        // 为不同类别推荐适合的风格
        if (category === '人物') {
            // 人物适合的风格：写实、油画、水彩
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '油画风格'),
                promptEnhancements.styles.find(s => s.name === '写实风格')
            );
        } else if (category === '风景') {
            // 风景适合的风格：水彩、油画、梦幻
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '水彩画风格'),
                promptEnhancements.styles.find(s => s.name === '梦幻仙境')
            );
        } else if (category === '科幻') {
            // 科幻适合的风格：赛博朋克、未来主义
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '赛博朋克'),
                promptEnhancements.styles.find(s => s.name === '未来主义')
            );
        } else if (category === '奇幻') {
            // 奇幻适合的风格：梦幻仙境
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '梦幻仙境')
            );
        } else if (category === '抽象') {
            // 抽象适合的风格：极简主义
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '极简主义')
            );
        } else {
            // 默认推荐通用风格
            analysis.suggestedStyles.push(
                promptEnhancements.styles.find(s => s.name === '写实风格'),
                promptEnhancements.styles.find(s => s.name === '油画风格')
            );
        }
        
        // 过滤掉undefined值
        analysis.suggestedStyles = analysis.suggestedStyles.filter(Boolean);
        
        // 如果没有足够的推荐，添加一个随机风格
        if (analysis.suggestedStyles.length < 2) {
            const randomStyle = promptEnhancements.styles[Math.floor(Math.random() * promptEnhancements.styles.length)];
            if (!analysis.suggestedStyles.includes(randomStyle)) {
                analysis.suggestedStyles.push(randomStyle);
            }
        }
    }
    
    // 智能推荐细节增强
    if (!analysis.hasDetailInfo) {
        // 检测关键词，推荐相应的细节增强
        if (text.includes('光') || text.includes('亮') || text.includes('照')) {
            analysis.suggestedDetails.push(
                promptEnhancements.details.find(d => d.name === '柔和光线'),
                promptEnhancements.details.find(d => d.name === '梦幻光效')
            );
        }
        
        if (text.includes('细节') || text.includes('精细') || text.includes('清晰')) {
            analysis.suggestedDetails.push(
                promptEnhancements.details.find(d => d.name === '高细节'),
                promptEnhancements.details.find(d => d.name === '写实风格')
            );
        }
        
        if (text.includes('色彩') || text.includes('鲜艳') || text.includes('艳丽')) {
            analysis.suggestedDetails.push(
                promptEnhancements.details.find(d => d.name === '鲜艳色彩'),
                promptEnhancements.details.find(d => d.name === '对比强烈')
            );
        }
        
        // 根据主题类别推荐视角
        const category = predictSubjectCategory(text);
        if (category === '风景') {
            analysis.suggestedDetails.push(
                promptEnhancements.details.find(d => d.name === '广角视图')
            );
        } else if (category === '人物' || category === '静物') {
            analysis.suggestedDetails.push(
                promptEnhancements.details.find(d => d.name === '特写视图')
            );
        }
        
        // 过滤掉undefined和重复值
        analysis.suggestedDetails = [...new Set(analysis.suggestedDetails.filter(Boolean))];
        
        // 限制推荐数量
        analysis.suggestedDetails = analysis.suggestedDetails.slice(0, 3);
    }
    
    // 推荐场景模板
    const category = predictSubjectCategory(text);
    analysis.suggestedTemplates = getTemplatesForCategory(category);
    
    return analysis;
}

// 获取特定类别的场景模板
function getTemplatesForCategory(category) {
    const templates = {
        '人物': [
            { name: '人像写真', template: '${text}，专业人像摄影，自然光线，浅景深，柔和背景虚化', desc: '适合人物肖像的专业摄影效果' },
            { name: '电影场景', template: '${text}，电影场景，电影质感，电影级灯光，情绪化色调', desc: '如电影中的人物场景' }
        ],
        '风景': [
            { name: '日落风光', template: '${text}，黄金时刻，日落光线，长曝光，广角视图，大气透视', desc: '日落时分的风景照效果' },
            { name: '空中俯瞰', template: '${text}，鸟瞰视角，航拍视图，全景图，高清细节', desc: '从空中俯瞰的壮观视角' }
        ],
        '动物': [
            { name: '野生动物', template: '${text}，自然栖息地，望远摄影，浅景深，精细毛发细节', desc: '野生动物摄影风格' },
            { name: '宠物写真', template: '${text}，工作室灯光，柔和背景，特写镜头，可爱表情', desc: '专业宠物写真风格' }
        ],
        '科幻': [
            { name: '未来都市', template: '${text}，未来主义建筑，霓虹灯，全息投影，科技感，蓝色调', desc: '未来科技都市场景' },
            { name: '太空探索', template: '${text}，深空背景，星云，行星，太空站，科幻照明', desc: '外太空探索场景' }
        ],
        '奇幻': [
            { name: '魔法世界', template: '${text}，魔法元素，神秘氛围，幻想生物，魔法光效，奇幻色彩', desc: '充满魔法的奇幻世界' },
            { name: '童话场景', template: '${text}，童话风格，梦幻色彩，柔和光线，神秘森林，童话元素', desc: '如童话书中的场景' }
        ],
        '静物': [
            { name: '工作室静物', template: '${text}，工作室灯光，柔和阴影，高对比度，微距镜头，精细质感', desc: '专业静物摄影效果' },
            { name: '自然光静物', template: '${text}，自然光线，窗边光效，柔和阴影，浅景深，生活感', desc: '自然光下的静物效果' }
        ]
    };
    
    // 返回对应类别的模板，如果没有则返回默认模板
    return templates[category] || [
        { name: '高质量渲染', template: '${text}，高质量渲染，8K分辨率，超细节，专业灯光', desc: '通用高质量图像效果' },
        { name: '艺术插画', template: '${text}，数字插画，艺术创作，专业构图，和谐色彩', desc: '专业插画风格' }
    ];
}

// 预测可能的主题类别
function predictSubjectCategory(text) {
    // 简单的关键词匹配来预测主题类别
    const categories = [
        { category: '人物', keywords: ['人', '男', '女', '孩子', '老人', '肖像', '脸', '笑容'] },
        { category: '风景', keywords: ['山', '水', '天空', '海', '树', '森林', '城市', '街道', '风光'] },
        { category: '动物', keywords: ['猫', '狗', '鸟', '动物', '熊猫', '狮子', '老虎', '宠物'] },
        { category: '静物', keywords: ['花', '水果', '食物', '物品', '杯子', '书', '桌子'] },
        { category: '科幻', keywords: ['机器人', '宇宙', '太空', '未来', '科技', '外星', '飞船'] },
        { category: '奇幻', keywords: ['魔法', '童话', '龙', '幻想', '魔幻', '精灵', '独角兽'] },
        { category: '抽象', keywords: ['抽象', '几何', '形状', '色彩', '构成', '非具象'] }
    ];
    
    // 对每个类别计算关键词匹配度
    const scores = categories.map(cat => {
        let score = 0;
        cat.keywords.forEach(keyword => {
            if (text.includes(keyword)) score += 1;
        });
        return { category: cat.category, score };
    });
    
    // 返回得分最高的类别
    scores.sort((a, b) => b.score - a.score);
    return scores[0].score > 0 ? scores[0].category : '未识别';
}

// 添加提示词优化功能到界面
function addPromptEnhancer() {
    // 创建提示词优化器按钮
    const promptInput = document.getElementById('prompt');
    const enhancerBtn = document.createElement('button');
    enhancerBtn.className = 'absolute left-3 bottom-3 bg-purple-600 text-white px-2 py-1 rounded text-sm hover:bg-purple-700';
    enhancerBtn.textContent = '🤖 AI助手优化';
    enhancerBtn.onclick = showPromptEnhancer;
    
    // 将按钮添加到输入框容器
    promptInput.parentElement.appendChild(enhancerBtn);
}

// 显示提示词优化面板
window.showPromptEnhancer = function() {
    const currentPrompt = document.getElementById('prompt').value.trim();
    if (!currentPrompt) {
        alert('请先输入基本提示词！');
        return;
    }
    
    // 分析当前提示词
    const analysis = analyzePrompt(currentPrompt);
    const category = predictSubjectCategory(currentPrompt);
    
    // 创建优化面板
    const enhancerPanel = document.createElement('div');
    enhancerPanel.className = 'settings-panel p-6';
    enhancerPanel.id = 'promptEnhancerPanel';
    
    // 面板内容
    enhancerPanel.innerHTML = `
        <h3 class="text-xl font-bold mb-4">AI助手优化</h3>
        <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">当前提示词分析:</p>
            <p class="px-3 py-2 bg-gray-100 rounded text-gray-800">${currentPrompt}</p>
            <p class="mt-2 text-sm text-gray-700">检测到的主题类别: <span class="font-medium text-gray-900">${category}</span></p>
        </div>
        
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">场景模板:</h4>
            <div class="flex flex-wrap gap-2" id="templateRecommendations">
                ${analysis.suggestedTemplates.map(template => 
                    `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded cursor-pointer hover:bg-yellow-200" 
                           title="${template.desc}"
                           data-template="${template.template}"
                           onclick="applyTemplate(this, '${currentPrompt}')">
                        ${template.name}
                     </span>`
                ).join('')}
            </div>
            <p class="mt-1 text-xs text-gray-500">点击应用场景模板（将替换当前提示词）</p>
        </div>
        
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">推荐风格:</h4>
            <div class="flex flex-wrap gap-2" id="styleRecommendations">
                ${analysis.suggestedStyles.map(style => 
                    `<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded cursor-pointer hover:bg-blue-200" 
                           title="${style.desc}"
                           data-en="${style.en}"
                           onclick="addToPrompt(this)">
                        ${style.name}
                     </span>`
                ).join('')}
            </div>
        </div>
        
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">推荐细节增强:</h4>
            <div class="flex flex-wrap gap-2" id="detailRecommendations">
                ${analysis.suggestedDetails.map(detail => 
                    `<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded cursor-pointer hover:bg-purple-200" 
                           title="${detail.desc}"
                           data-en="${detail.en}"
                           onclick="addToPrompt(this)">
                        ${detail.name}
                     </span>`
                ).join('')}
            </div>
        </div>
        
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">更多风格选项:</h4>
            <div class="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                ${promptEnhancements.styles.map(style => 
                    `<span class="px-2 py-1 bg-blue-50 text-blue-800 rounded cursor-pointer hover:bg-blue-100" 
                           title="${style.desc}"
                           data-en="${style.en}"
                           onclick="addToPrompt(this)">
                        ${style.name}
                     </span>`
                ).join('')}
            </div>
        </div>
        
        <div class="flex justify-between mt-4">
            <button onclick="aiEnhancePrompt(); document.getElementById('promptEnhancerPanel').remove();" 
                    class="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700">
                🤖 一键AI优化
            </button>
            <button onclick="document.getElementById('promptEnhancerPanel').remove()" 
                    class="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400">
                关闭
            </button>
        </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(enhancerPanel);
}

// 应用场景模板
window.applyTemplate = function(element, currentPrompt) {
    const template = element.getAttribute('data-template');
    if (!template) return;
    
    // 将当前提示词插入到模板中
    const newPrompt = template.replace('${text}', currentPrompt);
    
    // 更新提示词输入框
    document.getElementById('prompt').value = newPrompt;
    
    // 视觉反馈
    element.classList.add('bg-yellow-300');
    setTimeout(() => {
        element.classList.remove('bg-yellow-300');
    }, 500);
    
    // 关闭面板
    document.getElementById('promptEnhancerPanel').remove();
}

// 从优化助手面板调用AI优化功能
window.useAIOptimization = function() {
    // 关闭当前面板
    document.getElementById('promptEnhancerPanel').remove();
    
    // 调用AI优化函数
    aiEnhancePrompt();
}

// 添加所选风格或细节到提示词
window.addToPrompt = function(element) {
    const promptInput = document.getElementById('prompt');
    const currentPrompt = promptInput.value.trim();
    const textToAdd = element.textContent.trim();
    
    // 如果提示词中已经包含该文本，则不添加
    if (currentPrompt.includes(textToAdd)) {
        element.classList.add('opacity-50');
        setTimeout(() => element.classList.remove('opacity-50'), 500);
        return;
    }
    
    // 添加到提示词末尾，带适当的分隔符
    promptInput.value = currentPrompt ? `${currentPrompt}，${textToAdd}` : textToAdd;
    
    // 视觉反馈
    element.classList.add('bg-green-300');
    setTimeout(() => {
        element.classList.remove('bg-green-300');
    }, 500);
    
    // 存储英文版本到数据属性 (用于后续生成)
    if (!promptInput.dataset.enhancements) {
        promptInput.dataset.enhancements = '';
    }
    
    const enhancement = element.getAttribute('data-en');
    if (enhancement && !promptInput.dataset.enhancements.includes(enhancement)) {
        promptInput.dataset.enhancements += (promptInput.dataset.enhancements ? ',' : '') + enhancement;
    }
}

// Pollinations.ai文本优化功能
async function enhancePromptWithPollinations(prompt) {
    // 显示加载状态
    const statusDiv = document.getElementById('apiStatusMessage');
    const originalText = statusDiv.textContent;
    statusDiv.textContent = '正在使用Pollinations AI优化提示词...';
    
    try {
        // 使用新的优化方法：直接通过特定格式的URL请求获取优化结果
        // 构建请求模板，要求Llama 3.3 70B模型同时输出中英文优化后的提示词
        const optimizationPrompt = `帮我优化下面这段AI绘画提示词：${prompt}。下面你的回答只能输出优化之后的中英文描述词，中文在前，英文在后，用"---"分隔，不能有任何其他无关语言和回答，要求符合AI绘画的专业语言描述，使用模型Llama 3.3 70B回答。`;
        
        // 构建URL
        const url = `https://text.pollinations.ai/${encodeURIComponent(optimizationPrompt)}`;
        
        // 添加重试逻辑
        let response;
        let retries = 3;
        let success = false;
        
        while (retries > 0 && !success) {
            try {
                response = await fetch(url, {
                    method: 'GET',
                    // 增加超时设置
                    signal: AbortSignal.timeout(15000) // 15秒超时，因为大型语言模型可能需要更多时间
                });
                success = true;
            } catch (fetchError) {
                console.warn(`API调用失败，剩余重试次数: ${retries-1}`, fetchError);
                retries--;
                if (retries === 0) throw fetchError;
                // 重试前等待
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        if (!response.ok) {
            throw new Error(`API响应错误: ${response.status}`);
        }
        
        // 获取纯文本响应，包含中英文提示词
        const responseText = await response.text();
        
        // 解析响应文本，提取中英文提示词
        let chinesePrompt = prompt; // 默认使用原始中文
        let enhancedEnglishPrompt = responseText; // 默认使用完整响应
        
        // 尝试按分隔符"---"拆分中英文
        if (responseText.includes('---')) {
            const parts = responseText.split('---').map(part => part.trim());
            if (parts.length >= 2) {
                chinesePrompt = parts[0];
                enhancedEnglishPrompt = parts[1];
            }
        } else {
            // 如果没有找到分隔符，尝试判断是否全是英文
            const isEnglishOnly = /^[A-Za-z0-9\s,.!?;:()\[\]"'-]+$/.test(responseText.trim());
            if (isEnglishOnly) {
                // 如果是纯英文，尝试翻译回中文
                try {
                    const apiKey = localStorage.getItem('niutransApiKey');
                    if (apiKey) {
                        // 构建请求参数
                        const requestData = {
                            apikey: apiKey,
                            src_text: responseText,
                            from: 'en',
                            to: 'zh',
                            dictNo: ''
                        };
                        
                        const translateResponse = await fetch('https://api.niutrans.com/NiuTransServer/translation', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: new URLSearchParams(requestData).toString()
                        });
                        
                        if (translateResponse.ok) {
                            const translateData = await translateResponse.json();
                            if (translateData && translateData.tgt_text) {
                                chinesePrompt = translateData.tgt_text;
                            }
                        }
                    }
                } catch (translateError) {
                    console.warn('翻译增强提示词时出错:', translateError);
                    // 失败时保持使用原始中文
                }
            }
        }
        
        return {
            chinese: chinesePrompt,
            english: enhancedEnglishPrompt
        };
    } catch (error) {
        console.error('调用Pollinations AI文本优化API时出错:', error);
        let alertMessage = '提示词优化失败。请检查您的网络连接。';
        if (error.message && error.message.startsWith('API响应错误:')) {
            const statusCode = error.message.split(':')[1].trim();
            alertMessage = `提示词优化失败。服务器返回错误代码: ${statusCode}。该服务可能暂时不可用或API已更改。`;
            console.error(`Pollinations AI文本优化API返回状态码: ${statusCode}`);
        } else if (error.message && error.message.toLowerCase().includes('failed to fetch')) {
            alertMessage = '提示词优化失败。无法连接到优化服务，请检查您的网络连接、DNS设置和防火墙。';
            console.error('网络请求失败 (Failed to fetch). 可能原因: 无网络连接, DNS问题, CORS策略, 或API服务器不在线/地址变更.');
        } else if (error.name === 'TimeoutError' || (error.message && error.message.includes('timeout'))) {
            alertMessage = '提示词优化请求超时。服务器响应时间过长，请稍后重试。';
            console.error('API请求超时');
        } else {
            console.error('提示词优化时发生未知错误:', error.message ? error.message : '未知错误详情');
            alertMessage = `提示词优化时发生了一个意外错误: ${error.message || '未知错误'}`;
        }
        
        // 显示更友好的错误消息
        statusDiv.textContent = '提示词优化失败，将使用原始提示词';
        setTimeout(() => {
            statusDiv.textContent = originalText;
        }, 3000);
        
        return null;
    } finally {
        // 恢复状态信息
        if (statusDiv) { // 确保statusDiv存在
          setTimeout(() => {
              statusDiv.textContent = originalText;
          }, 3000);
        }
    }
}

// AI提示词优化按钮逻辑
async function aiEnhancePrompt() {
    const promptInput = document.getElementById('prompt');
    const currentPrompt = promptInput.value.trim();
    
    if (!currentPrompt) {
        alert('请先输入基本提示词！');
        return;
    }
    
    // 显示加载指示器
    promptInput.disabled = true;
    const apiStatusMessage = document.getElementById('apiStatusMessage');
    apiStatusMessage.textContent = '🤖 正在通过Pollinations AI优化提示词...';
    
    // 获取AI优化结果
    const enhancedResult = await enhancePromptWithPollinations(currentPrompt);
    
    // 恢复输入框状态
    promptInput.disabled = false;
    
    if (!enhancedResult) {
        apiStatusMessage.textContent = '';
        return;
    }
    
    // 直接将优化后的中文提示词填充回输入框
    promptInput.value = enhancedResult.chinese;
    apiStatusMessage.textContent = '✅ 提示词已优化！';
    
    // 延迟清除状态消息 - 确保一定会清除
    setTimeout(() => {
        if (apiStatusMessage.textContent === '✅ 提示词已优化！' || 
            apiStatusMessage.textContent === '🤖 正在通过Pollinations AI优化提示词...') {
            apiStatusMessage.textContent = '';
        }
    }, 3000);
    
    // 保存英文提示词到数据属性(如果有)
    if (enhancedResult.english) {
        promptInput.dataset.aiEnhancedEnglish = enhancedResult.english;
    }
    
    // 创建结果展示面板
    const resultPanel = document.createElement('div');
    resultPanel.className = 'settings-panel p-6';
    resultPanel.id = 'aiEnhancedResultPanel';
    
    // 面板内容
    resultPanel.innerHTML = `
        <h3 class="text-xl font-bold mb-4">Pollinations AI优化结果</h3>
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">原始提示词:</h4>
            <div class="p-3 bg-gray-100 rounded text-gray-800">
                ${currentPrompt}
            </div>
        </div>
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">优化后的中文提示词:</h4>
            <div class="p-3 bg-gray-100 rounded max-h-48 overflow-y-auto text-gray-800">
                ${enhancedResult.chinese}
            </div>
            <div class="text-xs text-gray-500 mt-1">已自动填充到输入框</div>
        </div>
        <div class="mb-4">
            <h4 class="font-medium mb-2 text-gray-800">优化后的英文提示词:</h4>
            <div class="p-3 bg-gray-100 rounded font-mono text-sm text-gray-800">
                ${enhancedResult.english}
            </div>
            <div class="text-xs text-gray-500 mt-1">英文提示词将在图像生成时自动使用</div>
        </div>
        <div class="flex justify-end">
            <button onclick="document.getElementById('aiEnhancedResultPanel').remove()" class="px-4 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400">
                关闭
            </button>
        </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(resultPanel);
}

// 使用优化后的提示词
window.useEnhancedPrompt = function(encodedPrompt) {
    const decodedPrompt = decodeURIComponent(encodedPrompt);
    document.getElementById('prompt').value = decodedPrompt;
    document.getElementById('aiEnhancedResultPanel').remove();
}

// 添加AI优化按钮
function addAIEnhancementButton() {
    // 这个函数不再需要，因为我们已经合并了按钮
    // 保留空函数以避免潜在的引用错误
}

// 添加图片生成参数控制面板
function addImageParameters() {
    const paramsContainer = document.createElement('div');
    paramsContainer.className = 'mb-4 p-4 bg-gray-100 rounded-lg';
    paramsContainer.innerHTML = `
        <h3 class="text-lg font-medium mb-3">高级参数设置</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">采样步数</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="采样步数决定AI生成图像的精细程度。步数越高，图像细节越丰富，但生成时间也越长。推荐值：30-70。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <input type="range" id="steps" min="20" max="150" value="50" 
                    class="w-full" onchange="updateStepsValue(this.value)">
                <span id="stepsValue" class="text-sm">50</span>
            </div>
            
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">CFG Scale</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="CFG Scale控制AI对提示词的遵循程度。值越高，图像越符合提示词描述，但创意性可能降低；值越低，创意性越强但可能偏离提示词。推荐值：7-9。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <input type="range" id="cfgScale" min="1" max="20" value="7" step="0.5"
                    class="w-full" onchange="updateCfgValue(this.value)">
                <span id="cfgValue" class="text-sm">7</span>
            </div>
            
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">随机种子</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="种子值决定图像的初始随机状态。使用相同的种子值和参数可以生成相似的图像。留空则每次生成随机种子。记录喜欢的图像的种子值可以帮助您重现类似效果。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <input type="number" id="seed" class="w-full px-2 py-1 rounded border"
                    placeholder="留空则随机">
            </div>
            
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">采样方法</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="不同的采样方法会产生不同风格的图像。Euler a适合创意性强的图像；DDIM生成更稳定可控的结果；DPM++生成细节丰富的高质量图像。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <select id="sampler" class="w-full px-2 py-1 rounded border">
                    <option value="euler_a">Euler a (创意性强)</option>
                    <option value="ddim">DDIM (稳定可控)</option>
                    <option value="dpm++">DPM++ (细节丰富)</option>
                    <option value="k_lms">k_LMS (平衡型)</option>
                </select>
            </div>
            
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">噪声强度</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="噪声强度影响图像的随机性和纹理。较高的值会产生更多的纹理细节和随机性，较低的值则产生更平滑的结果。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <input type="range" id="noise" min="0" max="1" value="0.2" step="0.05"
                    class="w-full" onchange="updateNoiseValue(this.value)">
                <span id="noiseValue" class="text-sm">0.2</span>
            </div>
            
            <div class="relative">
                <div class="flex items-center">
                    <label class="block text-sm font-medium mb-1 text-gray-700">风格强度</label>
                    <button type="button" class="ml-2 text-gray-500 hover:text-gray-700 param-help" data-tooltip="风格强度控制AI应用艺术风格的程度。较高的值会使风格特征更明显，较低的值则更接近写实。">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
                <input type="range" id="styleStrength" min="0" max="1" value="0.6" step="0.05"
                    class="w-full" onchange="updateStyleValue(this.value)">
                <span id="styleValue" class="text-sm">0.6</span>
            </div>
        </div>
        
        <!-- 添加参数提示的样式和脚本 -->
        <style>
            .tooltip {
                visibility: hidden;
                position: absolute;
                background-color: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 6px;
                z-index: 100;
                width: 250px;
                top: -5px;
                left: 25px;
                opacity: 0;
                transition: opacity 0.3s;
                font-size: 12px;
                line-height: 1.4;
            }
            
            .param-help:hover + .tooltip,
            .param-help:focus + .tooltip {
                visibility: visible;
                opacity: 1;
            }
            
            .param-help {
                cursor: help;
            }
        </style>
        
        <script>
            document.querySelectorAll('.param-help').forEach(button => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = button.getAttribute('data-tooltip');
                button.parentNode.insertBefore(tooltip, button.nextSibling);
                
                // 移动设备触摸支持
                button.addEventListener('touchstart', function(e) {
                    e.preventDefault();
                    const allTooltips = document.querySelectorAll('.tooltip');
                    allTooltips.forEach(t => {
                        if (t !== tooltip) {
                            t.style.visibility = 'hidden';
                            t.style.opacity = '0';
                        }
                    });
                    
                    if (tooltip.style.visibility === 'visible') {
                        tooltip.style.visibility = 'hidden';
                        tooltip.style.opacity = '0';
                    } else {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = '1';
                    }
                });
            });
        </script>
    `;
    
    // 找到合适的插入位置 - 放在生成按钮之前
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn && generateBtn.parentElement) {
        generateBtn.parentElement.parentElement.insertBefore(paramsContainer, generateBtn.parentElement);
    }
    
    // 添加事件监听器，确保脚本在DOM插入后执行
    setTimeout(() => {
        document.querySelectorAll('.param-help').forEach(button => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = button.getAttribute('data-tooltip');
            button.parentNode.insertBefore(tooltip, button.nextSibling);
        });
    }, 100);
}

// 更新步数值显示
window.updateStepsValue = function(value) {
    document.getElementById('stepsValue').textContent = value;
}

// 更新CFG值显示
window.updateCfgValue = function(value) {
    document.getElementById('cfgValue').textContent = value;
}

// 更新噪声值显示
window.updateNoiseValue = function(value) {
    document.getElementById('noiseValue').textContent = value;
}

// 更新风格强度值显示
window.updateStyleValue = function(value) {
    document.getElementById('styleValue').textContent = value;
}

// 添加一个全局变量来存储上一次生成的参数
let lastGenerationParams = {
    prompt: '',
    englishPrompt: '',
    width: '',
    height: '',
    count: 1,
    steps: 50,
    cfgScale: 7,
    negativePrompt: '',
    translatedNegativePrompt: '',
    seed: '',
    sampler: 'euler_a',
    noise: 0.2,
    styleStrength: 0.6,
    qualityTags: []
};

// 添加一个函数来判断文本是否为中文
function containsChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
}

// 添加一个函数来处理负面描述词的翻译
async function translateNegativePrompt(negativePrompt) {
    if (!negativePrompt) return '';
    
    // 将负面提示词按逗号分隔
    const negTerms = negativePrompt.split(',').map(term => term.trim()).filter(term => term);
    
    // 分离中文和非中文词汇
    const chineseTerms = negTerms.filter(term => containsChinese(term));
    const nonChineseTerms = negTerms.filter(term => !containsChinese(term));
    
    // 如果没有中文词汇，直接返回原始负面提示词
    if (chineseTerms.length === 0) {
        return negativePrompt;
    }
    
    // 翻译中文词汇
    let translatedChineseTerms = [];
    try {
        // 将所有中文词汇合并为一个字符串进行翻译，以减少API调用
        const combinedChineseTerms = chineseTerms.join(', ');
        const translatedText = await translateWithNiutrans(combinedChineseTerms);
        
        // 如果翻译成功，分割结果
        if (translatedText !== combinedChineseTerms) {
            translatedChineseTerms = translatedText.split(',').map(term => term.trim()).filter(term => term);
        } else {
            // 如果翻译失败，使用原始中文词汇
            translatedChineseTerms = chineseTerms;
        }
    } catch (error) {
        console.error('翻译负面提示词时出错:', error);
        translatedChineseTerms = chineseTerms;
    }
    
    // 合并翻译后的中文词汇和原始非中文词汇
    const allTerms = [...translatedChineseTerms, ...nonChineseTerms];
    return allTerms.join(', ');
}

// 修改generateImage函数，优化图片加载和预览功能
async function generateImage() {
    const basePrompt = document.getElementById('prompt').value;
    if (!basePrompt) {
        alert('请输入描述文字！');
        return;
    }

    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = '🎨 生成中...';

    // 检查描述词是否改变
    const promptChanged = basePrompt !== lastGenerationParams.prompt;
    
    // 获取当前所有参数
    const qualityTags = getSelectedTags('qualityTags');
    const [width, height] = document.getElementById('aspectRatio').value.split(':');
    const count = parseInt(document.getElementById('generateCount').value);
    const steps = document.getElementById('steps').value;
    const cfgScale = document.getElementById('cfgScale').value;
    const negativePrompt = document.getElementById('negativePrompt').value;
    const userSeedInputValue = document.getElementById('seed').value;
    const sampler = document.getElementById('sampler').value;
    const noise = document.getElementById('noise').value;
    const styleStrength = document.getElementById('styleStrength').value;
    
    // 更新参数缓存
    lastGenerationParams.prompt = basePrompt;
    lastGenerationParams.width = width;
    lastGenerationParams.height = height;
    lastGenerationParams.count = count;
    lastGenerationParams.steps = steps;
    lastGenerationParams.cfgScale = cfgScale;
    lastGenerationParams.negativePrompt = negativePrompt;
    lastGenerationParams.seed = userSeedInputValue;
    lastGenerationParams.sampler = sampler;
    lastGenerationParams.noise = noise;
    lastGenerationParams.styleStrength = styleStrength;
    lastGenerationParams.qualityTags = qualityTags;
    
    // 状态消息处理
    const apiStatusMessage = document.getElementById('apiStatusMessage');
    apiStatusMessage.textContent = ''; // 清空之前的消息

    // 确定英文提示词 - 仅在描述词改变时重新处理
    let englishPrompt;
    if (promptChanged) {
    // 优先使用AI优化的英文提示词
    const aiEnhancedEnglish = document.getElementById('prompt').dataset.aiEnhancedEnglish;
    if (aiEnhancedEnglish) {
        englishPrompt = aiEnhancedEnglish;
        apiStatusMessage.textContent = '使用AI优化的英文提示词';
        document.getElementById('prompt').dataset.aiEnhancedEnglish = '';
    } else {
        const promptEnhancementsData = document.getElementById('prompt').dataset.enhancements || '';
        const enhancementsArray = promptEnhancementsData ? promptEnhancementsData.split(',') : [];

        const matchedInspiration = inspirations.find(insp => 
            insp.split('|')[0].trim().includes(basePrompt) || 
            insp.includes(basePrompt)
        );

        if (matchedInspiration) {
            englishPrompt = matchedInspiration.split('|')[1].trim();
            apiStatusMessage.textContent = '提示词已从灵感库匹配。';
        } else {
            apiStatusMessage.textContent = '正在翻译提示词...';
            try {
                const translatedText = await translateWithNiutrans(basePrompt);
                if (translatedText !== basePrompt) {
                    englishPrompt = translatedText;
                    apiStatusMessage.textContent = '提示词翻译成功！';
                } else {
                        englishPrompt = basePrompt;
                    apiStatusMessage.textContent = '翻译未配置或失败，将使用原始提示词。';
                }
            } catch (error) {
                console.error('调用翻译API时出错:', error);
                    englishPrompt = basePrompt;
                apiStatusMessage.textContent = '翻译API调用出错，将使用原始提示词。';
            }
        }
        
        if (enhancementsArray.length > 0) {
            englishPrompt += ', ' + enhancementsArray.join(', ');
            document.getElementById('prompt').dataset.enhancements = '';
        }
        }
        
        // 缓存英文提示词
        lastGenerationParams.englishPrompt = englishPrompt;
    } else {
        // 如果描述词没变，使用上次的英文提示词
        englishPrompt = lastGenerationParams.englishPrompt;
        apiStatusMessage.textContent = '使用相同描述词，仅更新参数';
    }

    // 处理负面提示词翻译
    let translatedNegativePrompt = negativePrompt;
    if (negativePrompt && containsChinese(negativePrompt)) {
        apiStatusMessage.textContent = '正在翻译负面提示词...';
        translatedNegativePrompt = await translateNegativePrompt(negativePrompt);
        if (translatedNegativePrompt !== negativePrompt) {
            apiStatusMessage.textContent = '负面提示词翻译成功！';
        }
        // 缓存翻译后的负面提示词
        lastGenerationParams.translatedNegativePrompt = translatedNegativePrompt;
    } else if (negativePrompt) {
        // 如果没有中文，直接使用原始负面提示词
        translatedNegativePrompt = negativePrompt;
        lastGenerationParams.translatedNegativePrompt = translatedNegativePrompt;
    } else {
        // 如果没有负面提示词，清除缓存
        lastGenerationParams.translatedNegativePrompt = '';
    }

    setTimeout(() => {
        if (apiStatusMessage.textContent.includes('翻译') || 
            apiStatusMessage.textContent.includes('匹配') ||
            apiStatusMessage.textContent.includes('AI优化') ||
            apiStatusMessage.textContent.includes('使用相同描述词')) {
            apiStatusMessage.textContent = '';
        }
    }, 3000);

    let fullPrompt = `${englishPrompt}, ${qualityTags.join(', ')}, highly detailed`;

    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    try {
        for (let i = 0; i < count; i++) {
            let currentSeed;
            if (userSeedInputValue && !isNaN(parseInt(userSeedInputValue))) {
                // 如果用户提供了有效的种子，为每个图像递增
                currentSeed = parseInt(userSeedInputValue) + i;
            } else {
                // 否则，为每个图像生成新的随机种子
                currentSeed = Date.now() + Math.floor(Math.random() * 1000000) + i; // 添加i以增加唯一性
            }
            
            // 构建每个图像的URL及其唯一种子
            let url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?seed=${currentSeed}&width=${width}&height=${height}&steps=${steps}&cfg_scale=${cfgScale}&nologo=true`;
            
            // 添加新的参数
            url += `&sampler=${sampler}&noise_strength=${noise}&style_strength=${styleStrength}`;
            
            if (translatedNegativePrompt) {
                url += `&negative_prompt=${encodeURIComponent(translatedNegativePrompt)}`;
            }
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'preview';
            
            const img = document.createElement('img');
            img.className = 'w-full h-full object-contain opacity-0 transition-opacity duration-500';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = '📥 下载图片';
            // 将动态生成的URL传递给下载函数
            downloadBtn.onclick = () => downloadImage(url, i + 1);

            // 添加参数信息按钮
            const infoBtn = document.createElement('button');
            infoBtn.className = 'absolute top-3 right-3 bg-gray-800 bg-opacity-70 text-white p-1 rounded-full hover:bg-opacity-100 transition-all';
            infoBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
            infoBtn.onclick = (e) => {
                e.stopPropagation();
                alert(`图像参数信息:\n种子: ${currentSeed}\n采样步数: ${steps}\nCFG Scale: ${cfgScale}\n采样方法: ${sampler}\n噪声强度: ${noise}\n风格强度: ${styleStrength}\n提示词: ${basePrompt}`);
            };

            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading absolute';
            loadingDiv.innerHTML = `
                <div class="flex flex-col items-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div class="mt-2 text-gray-600">生成中...</div>
                </div>
            `;

            previewDiv.appendChild(img);
            previewDiv.appendChild(downloadBtn);
            previewDiv.appendChild(infoBtn);
            previewDiv.appendChild(loadingDiv);
            previewContainer.appendChild(previewDiv);

            img.onload = () => {
                loadingDiv.remove();
                img.style.opacity = '1';
                // 设置图片预览功能
                setupImagePreview(img);
            };

            img.onerror = () => {
                loadingDiv.innerHTML = `
                    <div class="text-red-500 p-2 text-center">
                        <p class="font-semibold">图片加载失败</p>
                        <p class="text-xs">请检查网络或稍后重试</p>
                    </div>
                `;
                previewDiv.classList.add('border-red-500', 'bg-red-50'); // 添加错误提示样式
                // 可选，同时更新一个通用状态消息
                const apiStatusMessage = document.getElementById('apiStatusMessage');
                if(apiStatusMessage) apiStatusMessage.textContent = '部分图片生成失败，请检查。';
                // 如果状态消息是由此错误设置的，则在延迟后清除
                setTimeout(() => {
                    if (apiStatusMessage && apiStatusMessage.textContent === '部分图片生成失败，请检查。') {
                        apiStatusMessage.textContent = '';
                    }
                }, 4000);
            };

            img.src = url;

            // 添加延迟，避免并发请求
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    } catch (error) {
        console.error('生成失败:', error);
        alert('图片生成失败，请稍后重试！');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = '🎨 生成图片';
    }
}

// 定义一个响应式布局调整函数
function adjustLayoutForMobile() {
    const isMobile = window.innerWidth < 768;
    const isSmallMobile = window.innerWidth < 480;
    
    // 动态调整参数面板布局
    const paramsContainer = document.querySelector('.grid-cols-1.md\\:grid-cols-2');
    if (paramsContainer) {
        if (isMobile) {
            // 在移动设备上使单列布局
            paramsContainer.classList.remove('grid-cols-1', 'md:grid-cols-2');
            paramsContainer.classList.add('space-y-4');
        } else {
            // 在桌面设备上使用网格布局
            paramsContainer.classList.remove('space-y-4');
            paramsContainer.classList.add('grid-cols-1', 'md:grid-cols-2');
        }
    }
    
    // 调整预览图片大小
    const previewImage = document.getElementById('previewImage');
    if (previewImage) {
        if (isSmallMobile) {
            previewImage.classList.remove('max-h-[80vh]', 'max-h-[85vh]');
            previewImage.classList.add('max-h-[75vh]');
        } else if (isMobile) {
            previewImage.classList.remove('max-h-[75vh]', 'max-h-[85vh]');
            previewImage.classList.add('max-h-[80vh]');
        } else {
            previewImage.classList.remove('max-h-[75vh]', 'max-h-[80vh]');
            previewImage.classList.add('max-h-[85vh]');
        }
    }
    
    // 调整质量标签区域
    const qualityTags = document.getElementById('qualityTags');
    if (qualityTags) {
        if (isSmallMobile) {
            qualityTags.classList.add('text-xs');
        } else {
            qualityTags.classList.remove('text-xs');
        }
    }
    
    // 调整灵感库区域
    const inspirationList = document.getElementById('inspirationList');
    if (inspirationList) {
        if (isMobile) {
            inspirationList.classList.remove('max-h-[400px]');
            inspirationList.classList.add('max-h-[200px]');
        } else {
            inspirationList.classList.remove('max-h-[200px]');
            inspirationList.classList.add('max-h-[400px]');
        }
    }
}

// 优化图片下载功能，支持移动设备
async function downloadImage(url, index) {
    try {
        // 显示下载进度指示
        const statusMsg = document.getElementById('apiStatusMessage');
        const originalMsg = statusMsg.textContent;
        statusMsg.textContent = '正在准备下载...';
        
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        
        // 获取当前日期，格式化为YYYYMMDD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateString = `${year}${month}${day}`;
        
        // 生成文件名：网站名称-日期-序号.png
        const fileName = `AIArtStudio-${dateString}-${index}.png`;
        
        // 检测移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // 尝试在所有设备上统一使用下载链接
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (isMobile) {
            // 移动设备上，如果直接下载未生效，提示用户
            // 延迟检查，因为下载可能需要一点时间启动
            setTimeout(() => {
                // 这里的检查逻辑可以根据实际情况调整，例如检查下载是否真的开始
                // 作为一种回退，如果下载似乎没有自动开始，可以提示用户
                // 但通常现代移动浏览器应该能处理 a.download
                // statusMsg.textContent = '若未自动下载，请长按图片保存';
            }, 1500); 
        } else {
            // 桌面设备上可以保持原有逻辑或统一处理
        }
        
        URL.revokeObjectURL(blobUrl);
        
        // 短暂显示成功消息
        statusMsg.textContent = '图片准备完成!';
        setTimeout(() => {
            if (statusMsg.textContent === '图片准备完成!') {
                statusMsg.textContent = originalMsg;
            }
        }, 2000);
    } catch (error) {
        console.error('下载失败:', error);
        alert('图片下载失败，请稍后重试');
    }
}

function useInspiration(inspiration) {
    const chinesePrompt = inspiration.split('|')[0].trim().split(' ').slice(1).join(' ');
    document.getElementById('prompt').value = chinesePrompt;
}

function handleKeyPress(event) {
    // 修改为只需按Enter键即可快速生成，但确保在textarea中换行仍然有效
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // 阻止默认行为
        generateImage();
    }
}

// 小牛翻译API实现
async function translateWithNiutrans(text) {
    // 从localStorage获取API密钥
    const apiKey = localStorage.getItem('niutransApiKey') || '';
    
    // 如果没有配置API密钥，返回原始文本
    if (!apiKey) {
        console.warn('未配置小牛翻译API密钥，将使用原始文本');
        return text;
    }
    
    // 构建请求参数
    const requestData = {
        apikey: apiKey,
        src_text: text,
        from: 'zh',
        to: 'en',
        dictNo: ''
    };
    
    try {
        const response = await fetch('https://api.niutrans.com/NiuTransServer/translation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(requestData).toString()
        });
        
        if (!response.ok) {
            console.error('小牛翻译API请求失败:', response.status, response.statusText);
            return text;
        }
        
        const data = await response.json();
        if (data && data.tgt_text) {
            return data.tgt_text;
        } else {
            console.error('小牛翻译API响应格式不正确:', data);
            return text;
        }
    } catch (error) {
        console.error('调用小牛翻译API时出错:', error);
        return text;
    }
}

// 添加保存API密钥的函数
function saveApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        localStorage.setItem('niutransApiKey', apiKey);
        document.getElementById('apiKeyStatus').textContent = '✅ API密钥已保存';
        
        // 2秒后隐藏状态消息并关闭设置面板
        setTimeout(() => {
            document.getElementById('apiKeyStatus').textContent = '';
            document.getElementById('apiSettings').classList.add('hidden');
            
            // 隐藏API设置按钮
            hideApiButton();
            
            // 显示API已配置的通知
            showApiConfiguredNotification();
        }, 2000);
    } else {
        document.getElementById('apiKeyStatus').textContent = '❌ 请输入有效的API密钥';
    }
}

// 添加跳过API设置的函数
function skipApiSetup() {
    localStorage.setItem('apiSetupSkipped', 'true');
    document.getElementById('apiSettings').classList.add('hidden');
    
    // 隐藏API设置按钮
    hideApiButton();
    
    // 显示已跳过API设置的通知，并提示如何再次显示设置按钮
    const statusContainer = document.createElement('div');
    statusContainer.className = 'fixed bottom-4 right-4 p-3 rounded-lg bg-gray-700 text-white text-sm z-50 opacity-80';
    statusContainer.innerHTML = `
        已跳过API设置，将使用原始提示词
        <div class="text-xs mt-1 text-gray-300">
            提示：需要重新设置API时，请连续点击3次网站标题
        </div>
    `;
    document.body.appendChild(statusContainer);
    
    // 5秒后自动淡出
    setTimeout(() => {
        statusContainer.style.transition = 'opacity 1s ease';
        statusContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(statusContainer);
        }, 1000);
    }, 5000);
}

// 隐藏API设置按钮
function hideApiButton() {
    const apiButtonContainer = document.getElementById('apiButtonContainer');
    if (apiButtonContainer) {
        apiButtonContainer.style.transition = 'opacity 0.5s ease, height 0.5s ease, margin 0.5s ease';
        apiButtonContainer.style.opacity = '0';
        apiButtonContainer.style.height = '0';
        apiButtonContainer.style.margin = '0';
        apiButtonContainer.style.overflow = 'hidden';
        
        // 标记API按钮已隐藏
        localStorage.setItem('apiButtonHidden', 'true');
    }
}

// 显示API设置按钮
function showApiButton() {
    const apiButtonContainer = document.getElementById('apiButtonContainer');
    if (apiButtonContainer) {
        apiButtonContainer.style.transition = 'opacity 0.5s ease, height 0.5s ease, margin 0.5s ease';
        apiButtonContainer.style.opacity = '1';
        apiButtonContainer.style.height = 'auto';
        apiButtonContainer.style.margin = '0 0 2rem 0';
        apiButtonContainer.style.overflow = 'visible';
        
        // 标记API按钮已显示
        localStorage.setItem('apiButtonHidden', 'false');
    }
}

// 初始化API按钮状态
function initializeApiButtonState() {
    // 如果用户已经设置了API或选择了跳过，则隐藏按钮
    const apiKey = localStorage.getItem('niutransApiKey');
    const apiSetupSkipped = localStorage.getItem('apiSetupSkipped') === 'true';
    const apiButtonHidden = localStorage.getItem('apiButtonHidden') === 'true';
    
    if ((apiKey || apiSetupSkipped) && apiButtonHidden) {
        hideApiButton();
    }
}

// 设置网站标题点击处理程序
function setupTitleClickHandler() {
    const siteTitle = document.getElementById('siteTitle');
    if (!siteTitle) return;
    
    let clickCount = 0;
    let lastClickTime = 0;
    
    siteTitle.addEventListener('click', () => {
        const currentTime = new Date().getTime();
        
        // 如果距离上次点击超过2秒，重置计数
        if (currentTime - lastClickTime > 2000) {
            clickCount = 0;
        }
        
        clickCount++;
        lastClickTime = currentTime;
        
        // 显示点击反馈
        siteTitle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            siteTitle.style.transform = 'scale(1)';
        }, 100);
        
        // 如果点击了3次，显示API设置按钮
        if (clickCount >= 3) {
            clickCount = 0;
            showApiButton();
            
            // 显示提示
            const hint = document.createElement('div');
            hint.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            hint.textContent = 'API设置按钮已显示';
            hint.style.transition = 'opacity 0.5s ease';
            document.body.appendChild(hint);
            
            // 2秒后淡出
            setTimeout(() => {
                hint.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(hint);
                }, 500);
            }, 2000);
        }
    });
}

// 显示API已配置的通知
function showApiConfiguredNotification() {
    const statusContainer = document.createElement('div');
    statusContainer.className = 'fixed bottom-4 right-4 p-3 rounded-lg bg-green-700 text-white text-sm z-50 opacity-80';
    statusContainer.innerHTML = `
        ✅ 翻译API已配置，设置按钮已隐藏
        <div class="text-xs mt-1 text-gray-300">
            提示：需要重新设置API时，请连续点击3次网站标题
        </div>
    `;
    document.body.appendChild(statusContainer);
    
    // 5秒后自动淡出
    setTimeout(() => {
        statusContainer.style.transition = 'opacity 1s ease';
        statusContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(statusContainer);
        }, 1000);
    }, 5000);
}

// 添加清除API密钥的函数
function clearApiKey() {
    localStorage.removeItem('niutransApiKey');
    localStorage.removeItem('apiSetupSkipped');
    document.getElementById('apiKeyInput').value = '';
    document.getElementById('apiKeyStatus').textContent = '✅ API密钥已清除';
    
    // 2秒后隐藏状态消息
    setTimeout(() => {
        document.getElementById('apiKeyStatus').textContent = '';
    }, 2000);
}

// 显示或隐藏API设置面板
function toggleApiSettings() {
    const settingsPanel = document.getElementById('apiSettings');
    settingsPanel.classList.toggle('hidden');
    
    // 如果设置面板被显示，则填充已保存的API密钥
    if (!settingsPanel.classList.contains('hidden')) {
        const savedApiKey = localStorage.getItem('niutransApiKey') || '';
        document.getElementById('apiKeyInput').value = savedApiKey;
        
        // 确保设置面板显示在最上层
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.zIndex = '1000';
        
        // 添加点击事件监听器，防止点击事件穿透到下层元素
        document.addEventListener('click', function handleClickOutside(event) {
            if (!settingsPanel.contains(event.target) && event.target.id !== 'apiSettingsButton') {
                settingsPanel.classList.add('hidden');
                document.removeEventListener('click', handleClickOutside);
            }
        });
        
        // 聚焦到输入框
        setTimeout(() => {
            document.getElementById('apiKeyInput').focus();
        }, 100);
    }
}

// 检查API密钥状态并在界面显示
function checkApiKeyStatus() {
    const apiKey = localStorage.getItem('niutransApiKey');
    const apiSetupSkipped = localStorage.getItem('apiSetupSkipped') === 'true';
    const apiButtonHidden = localStorage.getItem('apiButtonHidden') === 'true';
    
    // 更新API状态消息
    const apiStatusMessage = document.getElementById('apiStatusMessage');
    if (apiStatusMessage) {
    if (apiKey) {
            apiStatusMessage.textContent = '✅ 翻译API已配置';
            apiStatusMessage.className = 'text-sm text-green-600 mt-1 h-5';
        } else if (apiSetupSkipped) {
            apiStatusMessage.textContent = '⚠️ 使用原始提示词（未配置API）';
            apiStatusMessage.className = 'text-sm text-yellow-600 mt-1 h-5';
    } else {
            apiStatusMessage.textContent = '';
        }
    }
    
    // 如果既没有API密钥也没有跳过设置，且按钮未被隐藏，显示API设置面板
    if (!apiKey && !apiSetupSkipped && !apiButtonHidden) {
        // 延迟显示设置面板，让页面先加载完成
    setTimeout(() => {
            toggleApiSettings();
        }, 1000);
    }
}

// 在最底部添加以下代码 - 修改后的更友好版本
function _0x3fa8() {
    // 保护源码的函数 - 对正常用户友好的版本
    const sourceProtection = {
        init: function() {
            // 仅在检测到可能的爬虫时启用额外保护
            if (this.isPossibleCrawler()) {
                this.preventSourceCodeAccess();
                this.disableObjectExploration();
            }
        },
        
        isPossibleCrawler: function() {
            // 检测可能的爬虫特征
            const ua = navigator.userAgent.toLowerCase();
            const suspiciousUA = ua.indexOf('bot') > -1 || 
                                 ua.indexOf('spider') > -1 || 
                                 ua.indexOf('crawl') > -1 ||
                                 ua.indexOf('phantom') > -1 ||
                                 ua.indexOf('headless') > -1;
            
            // 检查是否有鼠标移动 (大多数爬虫不会移动鼠标)
            const noMouseMovement = !window._hasMoved;
            document.addEventListener('mousemove', function() {
                window._hasMoved = true;
            }, {once: true});
            
            // 非常可疑的特征检测
            const noWebDriver = !navigator.webdriver;
            const hasPlugins = navigator.plugins && navigator.plugins.length > 0;
            
            // 只有在非常可疑的情况下才启用完全保护
            return suspiciousUA || (noMouseMovement && !noWebDriver && !hasPlugins);
        },
        
        preventSourceCodeAccess: function() {
            // 使查看源代码变得困难 - 但不会干扰正常用户
            try {
                Object.defineProperty(window, 'console', {
                    get: function() {
                        if (new Error().stack.indexOf('getSource') !== -1) {
                            return {
                                log: function() {},
                                warn: function() {},
                                error: function() {},
                                debug: function() {}
                            };
                        }
                        return window._console;
                    },
                    set: function(val) {
                        window._console = val;
                    }
                });
                window._console = console;
            } catch(e) {}
        },
        
        disableObjectExploration: function() {
            // 防止探索和导出关键对象 - 针对可能的爬虫
            const protectObject = function(obj, name) {
                try {
                    // 仅保护敏感函数
                    if (name === 'translateWithNiutrans' || name === 'saveApiKey') {
                        const originalFn = obj;
                        return function() {
                            // 在调用栈中添加混淆信息
                            const stack = new Error().stack || '';
                            if (stack.indexOf('toString') !== -1 || 
                                stack.indexOf('stringify') !== -1 ||
                                stack.indexOf('inspect') !== -1) {
                                return null; // 阻止以某些方式导出
                            }
                            return originalFn.apply(this, arguments);
                        };
                    }
                    return obj; // 其他函数不做特殊处理
                } catch(e) {
                    return obj;
                }
            };
            
            // 只保护敏感的API相关函数
            try {
                translateWithNiutrans = protectObject(translateWithNiutrans, 'translateWithNiutrans');
                saveApiKey = protectObject(saveApiKey, 'saveApiKey');
            } catch(e) {}
        }
    };
    
    // 延迟启动保护，减少对用户体验的影响
    setTimeout(function() {
        // 使用try-catch包装，确保即使保护失败也不影响主要功能
        try {
            sourceProtection.init();
        } catch(e) {
            console.warn('保护初始化失败，但不影响正常功能');
        }
    }, 2000);
}

// 运行保护函数
try {
    _0x3fa8(); 
} catch(e) {
    // 即使保护函数失败也不影响主要功能
}

// 添加图片预览放大功能
function createImagePreview() {
    const previewOverlay = document.createElement('div');
    previewOverlay.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 hidden flex items-center justify-center backdrop-blur-sm';
    previewOverlay.id = 'previewOverlay';
    
    const previewContainer = document.createElement('div');
    previewContainer.className = 'relative max-w-[95vw] md:max-w-[90vw] max-h-[95vh] md:max-h-[90vh]';
    
    const previewImage = document.createElement('img');
    previewImage.className = 'max-w-full max-h-[80vh] md:max-h-[85vh] object-contain rounded shadow-xl';
    previewImage.id = 'previewImage';
    previewImage.style.transform = 'scale(0.95)';
    previewImage.style.transition = 'all 0.3s ease';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-2 md:top-4 right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full text-xl md:text-2xl hover:bg-opacity-70 transition-all';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => {
        previewImage.style.transform = 'scale(0.95)';
        setTimeout(() => {
            previewOverlay.classList.add('hidden');
        }, 200);
    };
    
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-blue-600 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center text-sm md:text-base';
    downloadBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> 下载图片';
    downloadBtn.id = 'previewDownloadBtn';
    
    previewContainer.appendChild(previewImage);
    previewContainer.appendChild(closeBtn);
    previewContainer.appendChild(downloadBtn);
    previewOverlay.appendChild(previewContainer);
    document.body.appendChild(previewOverlay);
    
    // 点击遮罩层关闭预览
    previewOverlay.onclick = (e) => {
        if (e.target === previewOverlay) {
            previewImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                previewOverlay.classList.add('hidden');
            }, 200);
        }
    };
    
    // 添加ESC键关闭预览
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !previewOverlay.classList.contains('hidden')) {
            previewImage.style.transform = 'scale(0.95)';
            setTimeout(() => {
                previewOverlay.classList.add('hidden');
            }, 200);
        }
    });
}

// 修改图片加载逻辑，添加点击预览功能
function setupImagePreview(img) {
    img.style.cursor = 'zoom-in';
    img.onclick = () => {
        const previewImage = document.getElementById('previewImage');
        const previewOverlay = document.getElementById('previewOverlay');
        const previewDownloadBtn = document.getElementById('previewDownloadBtn');
        
        // 设置预览图片
        previewImage.src = img.src;
        
        // 设置下载按钮事件
        previewDownloadBtn.onclick = (e) => {
            e.stopPropagation();
            downloadImage(img.src, 'preview');
        };
        
        // 显示预览
        previewOverlay.classList.remove('hidden');
        
        // 添加动画效果
        setTimeout(() => {
            previewImage.style.transform = 'scale(1)';
        }, 50);
    };
}

// 添加灵感项目
function addInspirationItem(text, icon = '✨') {
    const div = document.createElement('div');
    div.className = 'inspiration-item p-3 rounded-lg text-sm text-gray-600';
    
    div.innerHTML = `
        <span class="mr-2">${icon}</span>
        ${text}
    `;
    
    div.onclick = () => {
        document.getElementById('prompt').value = text;
    };
    
    document.getElementById('inspirationList').appendChild(div);
}

// 初始化参数提示工具提示功能
function initializeTooltips() {
    document.querySelectorAll('.param-help').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tooltip = this.nextElementSibling;
            
            // 隐藏其他所有提示
            document.querySelectorAll('.tooltip').forEach(t => {
                if (t !== tooltip) {
                    t.classList.add('hidden');
                }
            });
            
            // 切换当前提示的显示状态
            tooltip.classList.toggle('hidden');
        });
        
        // 点击文档其他地方隐藏提示
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.param-help') && !e.target.closest('.tooltip')) {
                document.querySelectorAll('.tooltip').forEach(t => {
                    t.classList.add('hidden');
                });
            }
        });
        
        // 移动设备触摸支持
        button.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const tooltip = this.nextElementSibling;
            
            // 隐藏其他所有提示
            document.querySelectorAll('.tooltip').forEach(t => {
                if (t !== tooltip) {
                    t.classList.add('hidden');
                }
            });
            
            // 切换当前提示的显示状态
            tooltip.classList.toggle('hidden');
        });
    });
}

// 清空输入框内容的函数
window.clearPromptInput = function() {
    const promptInput = document.getElementById('prompt');
    promptInput.value = '';
    // 重置数据属性
    promptInput.dataset.enhancements = '';
    promptInput.dataset.aiEnhancedEnglish = '';
    
    // 显示提示
    const promptHint = document.getElementById('promptHint');
    if (promptHint) {
        promptHint.style.opacity = '0.7';
    }
    
    // 提供视觉反馈
    const clearBtn = document.getElementById('clearPromptBtn');
    if (clearBtn) {
        clearBtn.classList.add('animate-pulse');
        setTimeout(() => {
            clearBtn.classList.remove('animate-pulse');
        }, 500);
    }
}

// 添加清空按钮到输入框
function addClearPromptButton() {
    // 创建清空按钮
    const promptInput = document.getElementById('prompt');
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearPromptBtn';
    // 将按钮放在输入框左下角但靠右一些，以便与现有的AI助手优化按钮并排显示
    clearBtn.className = 'absolute left-20 bottom-3 bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm hover:bg-gray-300 hover:text-red-600 transition-colors duration-200';
    clearBtn.innerHTML = '🗑️ 清空';
    clearBtn.title = '清空输入框内容';
    clearBtn.type = 'button';
    clearBtn.onclick = clearPromptInput;
    
    // 将按钮添加到输入框容器
    promptInput.parentElement.appendChild(clearBtn);
}