module.exports = {
  plugins: {
    'postcss-preset-env': {
      // 自定义选项
      stage: 3, // 使用第3阶段的特性
      features: {
        'nesting-rules': true, // 启用嵌套规则
      },
      autoprefixer: {
        // 自动添加浏览器前缀的配置
        flexbox: 'no-2009', // 不使用旧版本的flexbox
        grid: true, // 启用对网格布局的前缀
      },
    },
    // 如果需要单独配置 autoprefixer，可以取消下面的注释
    // autoprefixer: {
    //   grid: true,
    //   flexbox: 'no-2009'
    // }
  },
} 