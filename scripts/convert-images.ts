// // 需要安装: npm install -D sharp glob fs-extra
// import sharp from 'sharp';
// import glob from 'glob';
// import path from 'path';
// import fs from 'fs-extra';

// // 定义输入和输出目录
// const inputDir = 'src/assets';
// const outputDir = 'public/images';
// const sizes = [320, 640, 960, 1280, 1920]; // 定义响应式图片尺寸

// // 确保输出目录存在
// async function ensureOutputDirs() {
//   await fs.ensureDir(outputDir);
//   for (const size of sizes) {
//     await fs.ensureDir(path.join(outputDir, size.toString()));
//   }
//   await fs.ensureDir(path.join(outputDir, 'webp'));
// }

// // 处理图片
// async function processImages() {
//   const images = glob.sync(`${inputDir}/**/*.{jpg,jpeg,png}`);
  
//   for (const imagePath of images) {
//     const filename = path.basename(imagePath);
//     const image = sharp(imagePath);
//     const metadata = await image.metadata();
    
//     // 转换为WebP
//     await image
//       .webp({ quality: 80 })
//       .toFile(path.join(outputDir, 'webp', filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')));
    
//     // 创建响应式尺寸
//     for (const size of sizes) {
//       if (!metadata.width || metadata.width > size) {
//         await image
//           .resize(size)
//           .toFile(path.join(outputDir, size.toString(), filename));
        
//         // 同时生成相应尺寸的WebP
//         await image
//           .resize(size)
//           .webp({ quality: 80 })
//           .toFile(path.join(outputDir, size.toString(), filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')));
//       }
//     }
//   }
// }

// // 执行转换
// async function run() {
//   try {
//     await ensureOutputDirs();
//     await processImages();
//     console.log('图片处理完成!');
//   } catch (error) {
//     console.error('图片处理出错:', error);
//   }
// }

// run(); 