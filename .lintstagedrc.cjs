module.exports = {
  "*.{js,jsx,ts,tsx,vue}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,less,vue}": [
    "stylelint --fix"
  ],
  "*.{md,json}": [
    "prettier --write"
  ]
}; 