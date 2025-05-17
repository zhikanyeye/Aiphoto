// 背景壁纸切换功能 - 优化版
document.addEventListener('DOMContentLoaded', function() {
    // 手机设备壁纸列表
    const mobileWallpapers = [
        'https://img.lansq.xyz/file/ZhseFwM4.png',
        'https://img.lansq.xyz/file/5HVCs0YQ.png',
        'https://img.lansq.xyz/file/0FcT7Jdr.png',
        'https://img.lansq.xyz/file/rjgv2LfR.jpg',
        'https://img.lansq.xyz/file/XmweO4U8.jpg',
        'https://img.lansq.xyz/file/PVScO4o7.jpg',
        'https://img.lansq.xyz/file/Y5bnBkeW.png',
        'https://img.lansq.xyz/file/D7senj8B.png',
        'https://img.lansq.xyz/file/kqMPnBfQ.png'
    ];

    // 桌面设备壁纸列表
    const desktopWallpapers = [
        'https://img.lansq.xyz/file/covers/ejFWhIc4.png',
        'https://img.lansq.xyz/file/covers/UFYHPGnS.png',
        'https://img.lansq.xyz/file/covers/UBK1GCop.png',
        'https://img.lansq.xyz/file/covers/6naeo8RP.png',
        'https://img.lansq.xyz/file/covers/cY9NvrdF.png',
        'https://img.lansq.xyz/file/covers/uECpEkGD.png',
        'https://img.lansq.xyz/file/covers/23Rb3yGe.jpg',
        'https://img.lansq.xyz/file/covers/NjtorIGe.jpg',
        'https://img.lansq.xyz/file/covers/ASJNEvQY.png',
        'https://img.lansq.xyz/file/covers/0ty2ARS2.jpeg',
        'https://img.lansq.xyz/file/covers/xOtzZs3I.jpg',
        'https://img.lansq.xyz/file/h8VNeAFA.png',
        'https://img.lansq.xyz/file/uBN68PlF.png',
        'https://img.lansq.xyz/file/a02teLLs.png'
    ];

    // 图片加载状态跟踪
    const imageLoadStatus = {
        preloaded: new Set(), // 已预加载的图片URL
        loading: new Set(),   // 正在加载的图片URL
        loaded: new Set(),    // 已加载完成的图片URL
        failed: new Set()     // 加载失败的图片URL
    };

    // 预加载优先级队列
    let preloadQueue = [];
    let isPreloading = false;

    // 智能预加载函数 - 优先加载当前和下一个可能的壁纸
    function smartPreloadImages(imageArray, currentIndex) {
        // 清空当前队列
        preloadQueue = [];
        
        if (!imageArray || imageArray.length === 0) return;
        
        // 首先添加当前索引的图片（如果尚未加载）
        if (currentIndex >= 0 && currentIndex < imageArray.length) {
            const currentImage = imageArray[currentIndex];
            if (!imageLoadStatus.loaded.has(currentImage) && 
                !imageLoadStatus.loading.has(currentImage)) {
                preloadQueue.push(currentImage);
            }
        }
        
        // 然后添加可能的下一张图片（随机选择2-3张）
        const possibleNextIndices = [];
        const numToPreload = Math.min(3, imageArray.length - 1);
        
        while (possibleNextIndices.length < numToPreload) {
            const randomIndex = Math.floor(Math.random() * imageArray.length);
            if (randomIndex !== currentIndex && !possibleNextIndices.includes(randomIndex)) {
                possibleNextIndices.push(randomIndex);
                const imageUrl = imageArray[randomIndex];
                if (!imageLoadStatus.loaded.has(imageUrl) && 
                    !imageLoadStatus.loading.has(imageUrl) &&
                    !preloadQueue.includes(imageUrl)) {
                    preloadQueue.push(imageUrl);
                }
            }
        }
        
        // 最后添加其余图片（低优先级）
        for (let i = 0; i < imageArray.length; i++) {
            if (i !== currentIndex && !possibleNextIndices.includes(i)) {
                const imageUrl = imageArray[i];
                if (!imageLoadStatus.loaded.has(imageUrl) && 
                    !imageLoadStatus.loading.has(imageUrl) &&
                    !preloadQueue.includes(imageUrl)) {
                    preloadQueue.push(imageUrl);
                }
            }
        }
        
        // 开始预加载队列
        processPreloadQueue();
    }

    // 处理预加载队列
    function processPreloadQueue() {
        if (isPreloading || preloadQueue.length === 0) return;
        
        isPreloading = true;
        const imageUrl = preloadQueue.shift();
        
        if (imageLoadStatus.loaded.has(imageUrl) || imageLoadStatus.loading.has(imageUrl)) {
            // 已加载或正在加载，跳过
            isPreloading = false;
            processPreloadQueue();
            return;
        }
        
        // 标记为正在加载
        imageLoadStatus.loading.add(imageUrl);
        
            const img = new Image();
        
        img.onload = function() {
            // 标记为已加载成功
            imageLoadStatus.loaded.add(imageUrl);
            imageLoadStatus.loading.delete(imageUrl);
            imageLoadStatus.preloaded.add(imageUrl);
            
            // 继续处理队列中的下一个
            isPreloading = false;
            setTimeout(processPreloadQueue, 10); // 小延迟避免浏览器过载
        };
        
        img.onerror = function() {
            // 标记为加载失败
            imageLoadStatus.failed.add(imageUrl);
            imageLoadStatus.loading.delete(imageUrl);
            console.error('壁纸加载失败:', imageUrl);
            
            // 继续处理队列中的下一个
            isPreloading = false;
            setTimeout(processPreloadQueue, 10);
        };
        
        // 设置加载超时
        const timeout = setTimeout(() => {
            if (imageLoadStatus.loading.has(imageUrl)) {
                img.src = ''; // 取消加载
                imageLoadStatus.failed.add(imageUrl);
                imageLoadStatus.loading.delete(imageUrl);
                console.warn('壁纸加载超时:', imageUrl);
                
                isPreloading = false;
                setTimeout(processPreloadQueue, 10);
            }
        }, 15000); // 15秒超时
        
        // 开始加载图片
            img.src = imageUrl;
        
        // 设置图片加载优先级（如果浏览器支持）
        if ('fetchPriority' in img) {
            img.fetchPriority = 'high';
        }
        
        // 使用 Fetch API 预热连接
        try {
            fetch(imageUrl, { method: 'HEAD', mode: 'no-cors', priority: 'high' })
                .catch(() => {}); // 忽略错误，这只是预热
        } catch (e) {}
    }

    // 创建背景壁纸容器
    function createWallpaperContainer() {
        // 创建两个背景层，用于交替切换
        const container = document.createElement('div');
        container.id = 'wallpaper-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
        `;

        // 创建两个背景层
        for (let i = 0; i < 2; i++) {
            const bgLayer = document.createElement('div');
            bgLayer.className = 'wallpaper-layer';
            bgLayer.id = `wallpaper-layer-${i}`;
            bgLayer.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                transition: opacity 1.5s ease, filter 1.5s ease;
                opacity: ${i === 0 ? '1' : '0'};
                will-change: opacity, filter;
                transform: translateZ(0);
            `;
            container.appendChild(bgLayer);
        }

        // 添加到body
        document.body.prepend(container);

        return container;
    }

    // 检测设备类型
    function isMobileDevice() {
        return (window.innerWidth <= 768) || 
               (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    }

    // 设置背景图片的最优方式
    function setOptimizedBackground(element, imageUrl) {
        // 检查图片是否已加载
        if (imageLoadStatus.loaded.has(imageUrl)) {
            // 直接设置背景
            element.style.backgroundImage = `url('${imageUrl}')`;
            return true;
        } 
        
        // 如果图片加载失败，使用备用图片
        if (imageLoadStatus.failed.has(imageUrl)) {
            const backupImage = isMobileDevice() ? 
                mobileWallpapers[0] : desktopWallpapers[0];
            if (imageUrl !== backupImage) {
                element.style.backgroundImage = `url('${backupImage}')`;
            }
            return false;
        }
        
        // 图片尚未加载，开始加载
        if (!imageLoadStatus.loading.has(imageUrl)) {
            const img = new Image();
            imageLoadStatus.loading.add(imageUrl);
            
            // 使用低质量图片作为占位符（如果有）
            element.style.backgroundImage = element.style.backgroundImage || 
                `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E')`;
            
            img.onload = function() {
                imageLoadStatus.loaded.add(imageUrl);
                imageLoadStatus.loading.delete(imageUrl);
                element.style.backgroundImage = `url('${imageUrl}')`;
            };
            
            img.onerror = function() {
                imageLoadStatus.failed.add(imageUrl);
                imageLoadStatus.loading.delete(imageUrl);
                console.error('壁纸加载失败:', imageUrl);
                
                // 使用第一张图片作为备用
                const backupImage = isMobileDevice() ? 
                    mobileWallpapers[0] : desktopWallpapers[0];
                if (imageUrl !== backupImage) {
                    setOptimizedBackground(element, backupImage);
                }
            };
            
            // 设置加载优先级
            if ('fetchPriority' in img) {
                img.fetchPriority = 'high';
            }
            
            img.src = imageUrl;
        }
        
        return false;
    }

    // 初始化壁纸
    function initWallpaper() {
        const wallpaperContainer = createWallpaperContainer();
        const wallpaperLayers = wallpaperContainer.querySelectorAll('.wallpaper-layer');
        
        // 根据设备类型选择壁纸集合
        const wallpapers = isMobileDevice() ? mobileWallpapers : desktopWallpapers;
        
        // 预热DNS和连接
        if (window.navigator && window.navigator.connection) {
            try {
                // 预热图片域名
                const imgDomain = 'img.lansq.xyz';
                const dnsPreconnect = document.createElement('link');
                dnsPreconnect.rel = 'preconnect';
                dnsPreconnect.href = `https://${imgDomain}`;
                document.head.appendChild(dnsPreconnect);
                
                // DNS预取
                const dnsPrefetch = document.createElement('link');
                dnsPrefetch.rel = 'dns-prefetch';
                dnsPrefetch.href = `https://${imgDomain}`;
                document.head.appendChild(dnsPrefetch);
            } catch (e) {}
        }
        
        let currentLayerIndex = 0;
        let currentWallpaperIndex = 0;

        if (wallpapers.length > 0) {
            currentWallpaperIndex = Math.floor(Math.random() * wallpapers.length);
            
            // 设置初始壁纸
            setOptimizedBackground(wallpaperLayers[0], wallpapers[currentWallpaperIndex]);
            
            // 开始智能预加载
            smartPreloadImages(wallpapers, currentWallpaperIndex);
        } else {
            console.warn('No wallpapers available to set initial background.');
        }
        
        // 确保壁纸铺满屏幕
        ensureFullCoverage(wallpaperLayers[0]);
        
        // 壁纸切换函数
        function changeWallpaper() {
            // 获取下一个随机壁纸索引，并确保与当前不同
            if (!wallpapers || wallpapers.length === 0) {
                return;
            }
            
            if (wallpapers.length === 1) {
                currentWallpaperIndex = 0; 
            } else {
                // 优先选择已预加载的图片
                const preloadedIndices = wallpapers
                    .map((url, index) => ({ url, index }))
                    .filter(item => imageLoadStatus.preloaded.has(item.url) && item.index !== currentWallpaperIndex)
                    .map(item => item.index);
                
                if (preloadedIndices.length > 0) {
                    // 从预加载的图片中随机选择
                    currentWallpaperIndex = preloadedIndices[Math.floor(Math.random() * preloadedIndices.length)];
                } else {
                    // 如果没有预加载的图片，则随机选择
                let newWallpaperIndex;
                do {
                    newWallpaperIndex = Math.floor(Math.random() * wallpapers.length);
                } while (newWallpaperIndex === currentWallpaperIndex);
                currentWallpaperIndex = newWallpaperIndex;
                }
            }
            
            // 获取当前显示层和下一显示层
            const currentLayer = wallpaperLayers[currentLayerIndex];
            const nextLayerIndex = (currentLayerIndex + 1) % 2;
            const nextLayer = wallpaperLayers[nextLayerIndex];
            
            // 设置下一层的背景
            const imageUrl = wallpapers[currentWallpaperIndex];
            const imageLoaded = setOptimizedBackground(nextLayer, imageUrl);
            
            // 确保壁纸铺满屏幕
            ensureFullCoverage(nextLayer);
            
            // 如果图片已加载，直接执行切换动画
            if (imageLoaded) {
                performTransition();
            } else {
                // 否则等待图片加载完成后再切换
                const checkInterval = setInterval(() => {
                    if (imageLoadStatus.loaded.has(imageUrl)) {
                        clearInterval(checkInterval);
                        performTransition();
                    } else if (imageLoadStatus.failed.has(imageUrl)) {
                        clearInterval(checkInterval);
                        // 选择另一张图片
                        changeWallpaper();
                    }
                }, 100);
                
                // 设置超时，防止无限等待
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!imageLoadStatus.loaded.has(imageUrl)) {
                        // 如果超时仍未加载，尝试另一张图片
                        changeWallpaper();
                    }
                }, 5000);
            }
            
            // 执行过渡动画
            function performTransition() {
            // 添加模糊玻璃切换动画
            currentLayer.style.filter = 'blur(15px)';
            nextLayer.style.filter = 'blur(0px)';
            
            // 切换透明度
            nextLayer.style.opacity = '1';
            currentLayer.style.opacity = '0';
            
            // 更新当前层索引
            currentLayerIndex = nextLayerIndex;
                
                // 开始预加载下一批图片
                smartPreloadImages(wallpapers, currentWallpaperIndex);
            }
        }
        
        // 确保壁纸铺满屏幕的函数
        function ensureFullCoverage(layer) {
            // 设置背景尺寸为cover，确保铺满
            layer.style.backgroundSize = 'cover';
            
            // 针对移动设备做额外优化
            if (isMobileDevice()) {
                // 在移动设备上，有些图片可能需要调整位置以更好地展示
                const bgImage = layer.style.backgroundImage;
                if (bgImage) {
                    const imgUrl = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    
                    if (imageLoadStatus.loaded.has(imgUrl)) {
                        // 如果图片已加载，直接调整位置
                        adjustBackgroundPosition();
                    } else {
                        // 否则等待图片加载完成
                const img = new Image();
                        img.onload = adjustBackgroundPosition;
                        img.src = imgUrl;
                    }
                    
                    function adjustBackgroundPosition() {
                        const imgRatio = img.width / img.height;
                        const screenRatio = window.innerWidth / window.innerHeight;
                    
                    if (imgRatio > screenRatio) {
                        // 图片更宽，居中显示
                        layer.style.backgroundPosition = 'center center';
                    } else {
                        // 图片更高，可能需要调整到顶部
                        layer.style.backgroundPosition = 'center top';
                    }
                    }
                }
            } else {
                // 桌面设备默认居中
                layer.style.backgroundPosition = 'center center';
            }
            
            // 添加额外的样式确保完全覆盖
            layer.style.backgroundAttachment = 'fixed'; // 固定背景，防止滚动
        }
        
        // 设置定时器，每30秒切换一次壁纸
        setInterval(changeWallpaper, 30000);
        
        // 监听窗口大小变化，重新检测设备类型并更新壁纸
        let resizeTimeout;
        window.addEventListener('resize', function() {
            // 使用防抖处理resize事件
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
            const newWallpapers = isMobileDevice() ? mobileWallpapers : desktopWallpapers;
            
            // 如果壁纸集合发生变化，立即更新当前显示的壁纸
            if (wallpapers !== newWallpapers) {
                // 更新壁纸集合引用
                wallpapers.length = 0;
                newWallpapers.forEach(wp => wallpapers.push(wp));
                
                // 重置索引并立即更改壁纸
                currentWallpaperIndex = 0;
                    setOptimizedBackground(wallpaperLayers[currentLayerIndex], wallpapers[0]);
                wallpaperLayers[currentLayerIndex].style.filter = 'blur(0px)';
                wallpaperLayers[currentLayerIndex].style.opacity = '1';
                
                // 确保壁纸铺满屏幕
                ensureFullCoverage(wallpaperLayers[currentLayerIndex]);
                
                const otherLayerIndex = (currentLayerIndex + 1) % 2;
                wallpaperLayers[otherLayerIndex].style.opacity = '0';
                    
                    // 开始智能预加载
                    smartPreloadImages(wallpapers, 0);
            }
            
            // 每次调整窗口大小时，重新确保壁纸铺满屏幕
            ensureFullCoverage(wallpaperLayers[currentLayerIndex]);
            }, 200);
        });
        
        // 当页面变为可见时，检查是否需要更新壁纸
        document.addEventListener('visibilitychange', function() {
            if (!document.hidden) {
                // 页面变为可见时，确保壁纸正确显示
                ensureFullCoverage(wallpaperLayers[currentLayerIndex]);
                
                // 如果已经很久没有切换壁纸，立即切换一次
                const lastChangeTime = wallpaperContainer.dataset.lastChange || 0;
                const now = Date.now();
                if (now - lastChangeTime > 60000) { // 如果超过1分钟
                    changeWallpaper();
                    wallpaperContainer.dataset.lastChange = now;
                }
            }
        });
        
        // 记录初始化时间
        wallpaperContainer.dataset.lastChange = Date.now();
    }

    // 启动壁纸功能
    initWallpaper();
});