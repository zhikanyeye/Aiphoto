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
        // 如果灵感库中没有匹配项，则调用AI翻译API
        apiStatusMessage.textContent = '正在翻译提示词...';
        try {
            const translateUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(basePrompt)}?translate_only=true`;
            const translateResponse = await fetch(translateUrl);
            if (!translateResponse.ok) {
                console.error('翻译API请求失败:', translateResponse.status, translateResponse.statusText);
                apiStatusMessage.textContent = `翻译失败 (${translateResponse.status})，将尝试使用原始提示词。`;
                // 翻译失败，尝试使用原始中文提示词（API可能支持部分中文）
            } else {
                const translateData = await translateResponse.json();
                if (translateData && translateData.prompt) {
                    englishPrompt = translateData.prompt; 
                    apiStatusMessage.textContent = '提示词翻译成功！';
                } else {
                    console.error('翻译API响应格式不正确:', translateData);
                    apiStatusMessage.textContent = '翻译API响应异常，将尝试使用原始提示词。';
                }
            }
        } catch (error) {
            console.error('调用翻译API时出错:', error);
            apiStatusMessage.textContent = '翻译API调用出错，将尝试使用原始提示词。';
        }
    }

    // 短暂显示翻译状态后清除
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

async function testTranslateAPI() {
    const testPrompt = "你好世界"; // 预设的中文提示词
    const resultElement = document.getElementById('translateTestResult');
    resultElement.textContent = '正在测试翻译API...';

    try {
        const translateUrl = `https://text.pollinations.ai/prompt/${encodeURIComponent(testPrompt)}?translate_only=true`;
        const translateResponse = await fetch(translateUrl);

        if (!translateResponse.ok) {
            console.error('翻译API请求失败:', translateResponse.status, translateResponse.statusText);
            resultElement.textContent = `翻译API测试失败: ${translateResponse.status} ${translateResponse.statusText}`;
            return;
        }

        const translateData = await translateResponse.json();
        if (translateData && translateData.prompt) {
            resultElement.textContent = `翻译成功: "${testPrompt}" -> "${translateData.prompt}"`;
        } else {
            console.error('翻译API响应格式不正确:', translateData);
            resultElement.textContent = '翻译API响应格式不正确。';
        }
    } catch (error) {
        console.error('调用翻译API时出错:', error);
        resultElement.textContent = '调用翻译API时出错，请检查控制台获取更多信息。';
    }
}