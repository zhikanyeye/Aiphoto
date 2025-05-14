// 背景壁纸切换功能
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

    // 预加载所有壁纸图片
    function preloadImages(imageArray) {
        imageArray.forEach(imageUrl => {
            const img = new Image();
            img.src = imageUrl;
        });
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

    // 初始化壁纸
    function initWallpaper() {
        const wallpaperContainer = createWallpaperContainer();
        const wallpaperLayers = wallpaperContainer.querySelectorAll('.wallpaper-layer');
        
        // 根据设备类型选择壁纸集合
        const wallpapers = isMobileDevice() ? mobileWallpapers : desktopWallpapers;
        
        // 预加载所有图片
        preloadImages(wallpapers);
        
        let currentLayerIndex = 0;
        let currentWallpaperIndex = 0; // Will be updated below

        // 根据设备类型选择壁纸集合
        // const wallpapers = isMobileDevice() ? mobileWallpapers : desktopWallpapers; // Already defined above in this scope

        if (wallpapers.length > 0) {
            currentWallpaperIndex = Math.floor(Math.random() * wallpapers.length); // Random initial index
            // 设置初始壁纸
            wallpaperLayers[0].style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
        } else {
            // 如果没有壁纸，可以设置一个默认背景或留空
            console.warn('No wallpapers available to set initial background.');
        }
        
        // 确保壁纸铺满屏幕
        ensureFullCoverage(wallpaperLayers[0]);
        
        // 壁纸切换函数
        function changeWallpaper() {
            // 获取下一个随机壁纸索引，并确保与当前不同
            if (!wallpapers || wallpapers.length === 0) {
                // No wallpapers, do nothing
                return;
            }
            if (wallpapers.length === 1) {
                // Only one wallpaper, no need to change or can't change to a different one
                currentWallpaperIndex = 0; 
            } else {
                let newWallpaperIndex;
                do {
                    newWallpaperIndex = Math.floor(Math.random() * wallpapers.length);
                } while (newWallpaperIndex === currentWallpaperIndex);
                currentWallpaperIndex = newWallpaperIndex;
            }
            
            // 获取当前显示层和下一显示层
            const currentLayer = wallpaperLayers[currentLayerIndex];
            const nextLayerIndex = (currentLayerIndex + 1) % 2;
            const nextLayer = wallpaperLayers[nextLayerIndex];
            
            // 设置下一层的背景
            nextLayer.style.backgroundImage = `url('${wallpapers[currentWallpaperIndex]}')`;
            
            // 确保壁纸铺满屏幕
            ensureFullCoverage(nextLayer);
            
            // 添加模糊玻璃切换动画
            currentLayer.style.filter = 'blur(15px)';
            nextLayer.style.filter = 'blur(0px)';
            
            // 切换透明度
            nextLayer.style.opacity = '1';
            currentLayer.style.opacity = '0';
            
            // 更新当前层索引
            currentLayerIndex = nextLayerIndex;
        }
        
        // 确保壁纸铺满屏幕的函数
        function ensureFullCoverage(layer) {
            // 设置背景尺寸为cover，确保铺满
            layer.style.backgroundSize = 'cover';
            
            // 针对移动设备做额外优化
            if (isMobileDevice()) {
                // 在移动设备上，有些图片可能需要调整位置以更好地展示
                const img = new Image();
                img.onload = function() {
                    // 如果图片比例与屏幕比例不匹配，调整背景位置
                    const imgRatio = this.width / this.height;
                    const screenRatio = window.innerWidth / window.innerHeight;
                    
                    if (imgRatio > screenRatio) {
                        // 图片更宽，居中显示
                        layer.style.backgroundPosition = 'center center';
                    } else {
                        // 图片更高，可能需要调整到顶部
                        layer.style.backgroundPosition = 'center top';
                    }
                };
                img.src = layer.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
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
        window.addEventListener('resize', function() {
            const newWallpapers = isMobileDevice() ? mobileWallpapers : desktopWallpapers;
            
            // 如果壁纸集合发生变化，立即更新当前显示的壁纸
            if (wallpapers !== newWallpapers) {
                // 更新壁纸集合引用
                wallpapers.length = 0;
                newWallpapers.forEach(wp => wallpapers.push(wp));
                
                // 重置索引并立即更改壁纸
                currentWallpaperIndex = 0;
                wallpaperLayers[currentLayerIndex].style.backgroundImage = `url('${wallpapers[0]}')`;
                wallpaperLayers[currentLayerIndex].style.filter = 'blur(0px)';
                wallpaperLayers[currentLayerIndex].style.opacity = '1';
                
                // 确保壁纸铺满屏幕
                ensureFullCoverage(wallpaperLayers[currentLayerIndex]);
                
                const otherLayerIndex = (currentLayerIndex + 1) % 2;
                wallpaperLayers[otherLayerIndex].style.opacity = '0';
            }
            
            // 每次调整窗口大小时，重新确保壁纸铺满屏幕
            ensureFullCoverage(wallpaperLayers[currentLayerIndex]);
        });
    }

    // 启动壁纸功能
    initWallpaper();
});