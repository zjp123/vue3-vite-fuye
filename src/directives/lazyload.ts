import type { App, Directive } from 'vue'

export const lazyLoad: Directive = {
  mounted(el, binding) {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el as HTMLImageElement
          const src = binding.value
          img.src = src
          observer.unobserve(el)

          img.addEventListener('load', () => {
            el.classList.add('loaded')
          })

          img.addEventListener('error', () => {
            // 图片加载失败时的处理
            el.classList.add('error')
          })
        }
      })
    }, options)

    observer.observe(el)
  }
}

export function registerLazyLoad(app: App) {
  app.directive('lazy', lazyLoad)
} 