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

document.addEventListener('DOMContentLoaded', function() {
    const inspirationList = document.getElementById('inspirationList');
    inspirations.forEach(inspiration => {
        const div = document.createElement('div');
        div.className = 'inspiration-item p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300';
        div.onclick = () => useInspiration(inspiration);
        div.textContent = inspiration.split('|')[0].trim();
        div.title = inspiration.split('|')[1].trim();
        inspirationList.appendChild(div);
    });

    document.getElementById('prompt').value = '宇宙飞行员在月球上种竹子';
    
    // 检查API密钥是否已配置
    checkApiKeyStatus();
});

function toggleTag(element) {
    element.classList.toggle('active');
}

function getSelectedTags(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} .quality-tag.active`))
        .map(tag => tag.getAttribute('data-en'));
}

async function generateImage() {
    const basePrompt = document.getElementById('prompt').value;
    if (!basePrompt) {
        alert('请输入描述文字！');
        return;
    }

    const generateBtn = document.getElementById('generateBtn');
    generateBtn.disabled = true;
    generateBtn.textContent = '🎨 生成中...';

    const qualityTags = getSelectedTags('qualityTags');
    let englishPrompt = basePrompt;
    const apiStatusMessage = document.getElementById('apiStatusMessage');
    apiStatusMessage.textContent = ''; // 清空之前的消息

    // 尝试从灵感库中匹配英文提示词
    const matchedInspiration = inspirations.find(insp => 
        insp.split('|')[0].trim().includes(basePrompt) || 
        insp.includes(basePrompt)
    );

    if (matchedInspiration) {
        englishPrompt = matchedInspiration.split('|')[1].trim();
        apiStatusMessage.textContent = '提示词已从灵感库匹配。';
    } else {
        // 如果灵感库中没有匹配项，调用小牛翻译API
        apiStatusMessage.textContent = '正在翻译提示词...';
        try {
            // 调用小牛翻译API
            const translatedText = await translateWithNiutrans(basePrompt);
            if (translatedText !== basePrompt) {
                englishPrompt = translatedText;
                apiStatusMessage.textContent = '提示词翻译成功！';
            } else {
                apiStatusMessage.textContent = '翻译未配置或失败，将使用原始提示词。';
            }
        } catch (error) {
            console.error('调用翻译API时出错:', error);
            apiStatusMessage.textContent = '翻译API调用出错，将使用原始提示词。';
        }
    }
    
    // 短暂显示状态后清除
    setTimeout(() => {
        if (apiStatusMessage.textContent.includes('翻译') || apiStatusMessage.textContent.includes('匹配')) {
            apiStatusMessage.textContent = '';
        }
    }, 3000);

    let fullPrompt = `${englishPrompt}, ${qualityTags.join(', ')}, highly detailed`;

    const [width, height] = document.getElementById('aspectRatio').value.split(':');
    const count = parseInt(document.getElementById('generateCount').value);
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    try {
        for (let i = 0; i < count; i++) {
            const seed = Date.now() + Math.floor(Math.random() * 1000000);
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?seed=${seed}&width=${width}&height=${height}&nologo=true`;
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'preview';
            
            const img = document.createElement('img');
            img.className = 'w-full h-full object-contain opacity-0 transition-opacity duration-500';
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.textContent = '📥 下载图片';
            downloadBtn.onclick = () => downloadImage(url, i + 1);

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
            previewDiv.appendChild(loadingDiv);
            previewContainer.appendChild(previewDiv);

            img.onload = () => {
                loadingDiv.remove();
                img.style.opacity = '1';
            };

            img.onerror = () => {
                loadingDiv.innerHTML = `
                    <div class="text-red-500 p-2 text-center">
                        <p class="font-semibold">图片加载失败</p>
                        <p class="text-xs">请检查网络或稍后重试</p>
                    </div>
                `;
                previewDiv.classList.add('border-red-500', 'bg-red-50'); // 添加错误提示样式
                // Optionally, update a general status message as well
                const apiStatusMessage = document.getElementById('apiStatusMessage');
                if(apiStatusMessage) apiStatusMessage.textContent = '部分图片生成失败，请检查。';
                // Clear general status message after a delay if it was set by this error
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

async function downloadImage(url, index) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `ai-art-${Date.now()}-${index}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
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
    if (event.ctrlKey && event.key === 'Enter') {
        generateImage();
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('light');
    const btn = document.querySelector('button');
    const isDark = document.documentElement.classList.contains('dark');
    btn.textContent = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
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
        }, 2000);
    } else {
        document.getElementById('apiKeyStatus').textContent = '❌ 请输入有效的API密钥';
    }
}

// 添加清除API密钥的函数
function clearApiKey() {
    localStorage.removeItem('niutransApiKey');
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
    }
}

// 检查API密钥状态并在界面显示
function checkApiKeyStatus() {
    const apiKey = localStorage.getItem('niutransApiKey');
    const statusContainer = document.createElement('div');
    statusContainer.className = 'fixed bottom-4 right-4 p-3 rounded-lg bg-gray-800 text-white text-sm z-50 opacity-80';
    
    if (apiKey) {
        statusContainer.textContent = '✅ 翻译API已配置';
        statusContainer.classList.add('bg-green-700');
    } else {
        statusContainer.textContent = '⚠️ 翻译API未配置，将使用原始提示词';
        statusContainer.classList.add('bg-yellow-700');
    }
    
    // 点击状态图标打开设置面板
    statusContainer.style.cursor = 'pointer';
    statusContainer.onclick = toggleApiSettings;
    
    document.body.appendChild(statusContainer);
    
    // 3秒后自动淡出
    setTimeout(() => {
        statusContainer.style.transition = 'opacity 1s ease';
        statusContainer.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(statusContainer);
        }, 1000);
    }, 3000);
}