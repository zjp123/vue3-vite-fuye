module.exports = {
  root: true,
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-vue',
    'stylelint-config-recommended-less'
  ],
  plugins: ['stylelint-order', '@stylistic/stylelint-plugin'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less'
    }
  ],
  rules: {
    // 缩进 2 个空格
    '@stylistic/indentation': 2,
    // 在规则之前要求空行
    // '@stylistic/rule-empty-line-before': [
    //   'always',
    //   {
    //     except: ['first-nested'],
    //     ignore: ['after-comment']
    //   }
    // ],
    // // 要求或禁止在声明块中使用空行
    // '@stylistic/declaration-empty-line-before': [
    //   'always',
    //   {
    //     except: ['first-nested'],
    //     ignore: ['after-comment', 'after-declaration']
    //   }
    // ],
    // 属性顺序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'flex',
      'flex-direction',
      'flex-wrap',
      'flex-grow',
      'flex-shrink',
      'flex-basis',
      'justify-content',
      'align-items',
      'align-content',
      'gap',
      'overflow',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'border',
      'border-radius',
      'background',
      'color',
      'font',
      'font-size',
      'font-weight',
      'line-height',
      'text-align',
      'text-decoration',
      'transform',
      'transition',
      'animation'
    ],
    // 颜色值使用小写
    // 'color-function-notation': 'legacy',
    // 'alpha-value-notation': 'number',
    // 'color-hex-case': 'lower',
    // 允许空来源
    'no-empty-source': null,
    // 允许未知单位
    'unit-no-unknown': null,
    // 允许使用 id 选择器
    'selector-id-pattern': null,
    // 允许使用浏览器前缀
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    // 禁止使用 !important
    'declaration-no-important': null,
    // 允许 Vue scoped 属性
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global', 'slotted', 'v-deep']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
      }
    ],
    // 在 less 嵌套中允许空行
    'no-descending-specificity': null,
    // 允许在 calc 函数中使用未转义的换行符
    'function-calc-no-unspaced-operator': null,
    // 允许 Less 变量不使用横线格式
    'custom-property-pattern': null,
    // 允许使用 at-rule
    'at-rule-no-unknown': null,
    "no-duplicate-selectors": null
  }
} 