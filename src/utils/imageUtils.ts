/**
 * 检查浏览器是否支持WebP格式
 */
export const checkWebpSupport = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webp = new Image();
    webp.onload = webp.onerror = function() {
      resolve(webp.height === 1);
    };
    webp.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });
};

/**
 * 预加载图片
 */
export const preloadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * 批量预加载图片
 */
export const preloadImages = (sources: string[]): Promise<HTMLImageElement[]> => {
  return Promise.all(sources.map(preloadImage));
};

/**
 * 获取响应式图片源集
 */
export const getResponsiveImageSrcset = (
  basePath: string,
  filename: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return widths
    .map(width => `${basePath}/${width}/${filename} ${width}w`)
    .join(', ');
}; 