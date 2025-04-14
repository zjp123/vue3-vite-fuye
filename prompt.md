# 项目提示库 (Prompt Library)

这个文件用于收集和管理项目中使用的所有提示信息。请将所有新的提示添加到相应的分类下。

## Vue3+Vite+TS项目改造为Electron桌面应用

### 1. 项目分析

在开始改造前，我们需要分析当前项目的结构和依赖：

- 项目使用Vue3.5.13、Vite6.2.1和TypeScript5.8.0
- 使用Pinia进行状态管理
- 使用Vue Router进行路由管理
- 使用Element Plus作为UI组件库
- 使用ESLint和Prettier进行代码规范
- 使用Stylelint进行样式规范
- 使用Less作为CSS预处理器

### 2. 安装Electron相关依赖

```bash
# 安装Electron核心依赖
pnpm add electron electron-builder -D

# 安装Electron与Vite集成的插件
pnpm add vite-plugin-electron -D

# 安装用于开发环境的依赖
pnpm add concurrently wait-on -D

# 安装Electron类型定义
pnpm add @types/electron -D
```

### 3. 创建Electron主进程文件

在项目根目录创建electron目录，用于存放Electron相关文件：

```
electron/
  ├── main.ts        # 主进程入口文件
  ├── preload.ts     # 预加载脚本
  └── electron-env.d.ts  # Electron类型定义
```

#### 3.1 创建主进程入口文件 (electron/main.ts)

```typescript
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

// 禁用Windows 7的GPU加速
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// 设置Windows 10+通知的应用程序名称
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 单例应用锁定
if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// 删除electron安全警告
// 此警告仅用于开发目的，可以忽略
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

let win: BrowserWindow | null = null
// 这里可以使用预加载脚本
const preload = join(__dirname, '../preload/index.js')
// 🚧 使用'builtin'可以使用nodejs api在渲染进程中
// 🚧 在生产环境中，应该禁用预加载脚本
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Vue3 Vite Electron App',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    width: 1024,
    height: 768,
    webPreferences: {
      preload,
      // 🚧 启用nodejs api在渲染进程中
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // 打开开发者工具
    win.webContents.openDevTools()
  }

  // 使用浏览器打开外部链接
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // 如果用户尝试打开另一个实例，则聚焦到myWindow
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// 新的IPC处理程序
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})
```

#### 3.2 创建预加载脚本 (electron/preload.ts)

```typescript
import { contextBridge, ipcRenderer } from 'electron'

// --------- 暴露一些API给渲染进程 ---------
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    ...ipcRenderer,
    on: ipcRenderer.on.bind(ipcRenderer),
    once: ipcRenderer.once.bind(ipcRenderer),
    removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
  },
})
```

#### 3.3 创建Electron类型定义 (electron/electron-env.d.ts)

```typescript
/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VITE_DEV_SERVER_URL: string
    VITE_APP_VERSION: string
  }
}

interface Window {
  electron: {
    ipcRenderer: Electron.IpcRenderer
  }
}
```

### 4. 修改Vite配置

更新vite.config.ts文件，添加Electron插件支持：

```typescript
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

// 在plugins数组中添加
plugins: [
  // 其他插件...
  electron([
    {
      // 主进程入口文件
      entry: 'electron/main.ts',
      vite: {
        build: {
          outDir: 'dist-electron/main',
        },
      },
    },
    {
      entry: 'electron/preload.ts',
      vite: {
        build: {
          outDir: 'dist-electron/preload',
        },
      },
    },
  ]),
  renderer(),
]
```

### 5. 更新package.json

修改package.json文件，添加Electron相关脚本：

```json
{
  "scripts": {
    // 其他脚本...
    "dev:electron": "vite --mode development",
    "build:electron": "vue-tsc --build && vite build && electron-builder",
    "preview:electron": "electron-builder install-app-deps && electron ."
  },
  "main": "dist-electron/main/main.js",
  "build": {
    "appId": "com.vue3-vite-ts-fuye.app",
    "productName": "Vue3 Vite Electron App",
    "asar": true,
    "copyright": "Copyright © 2023",
    "directories": {
      "output": "release/${version}"
    },
    "files": ["dist-electron", "dist"],
    "mac": {
      "artifactName": "${productName}_${version}.${ext}",
      "target": ["dmg"]
    },
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ],
      "artifactName": "${productName}_${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "perMachine": false,
      "allowToChangeInstallationDirectory": true,
      "deleteAppDataOnUninstall": false
    },
    "publish": [
      {
        "provider": "generic",
        "url": "http://your-update-server.com"
      }
    ]
  }
}
```

### 6. 创建Vue与Electron通信接口

在src目录下创建electron目录，用于存放与Electron通信的接口：

```typescript
// src/electron/index.ts

// 检查是否在Electron环境中运行
export const isElectron = () => {
  return window.navigator.userAgent.includes('Electron')
}

// 获取Electron IPC渲染器
export const getIpcRenderer = () => {
  if (isElectron()) {
    return window.electron.ipcRenderer
  }
  return null
}

// 发送消息到主进程
export const sendToMain = (channel: string, ...args: any[]) => {
  const ipcRenderer = getIpcRenderer()
  if (ipcRenderer) {
    ipcRenderer.send(channel, ...args)
  } else {
    console.warn('IPC Renderer not available')
  }
}

// 从主进程接收消息
export const receiveFromMain = (channel: string, listener: (...args: any[]) => void) => {
  const ipcRenderer = getIpcRenderer()
  if (ipcRenderer) {
    ipcRenderer.on(channel, (event, ...args) => listener(...args))
    return () => {
      ipcRenderer.removeListener(channel, listener)
    }
  }
  return () => {}
}
```

### 7. 添加Electron特定功能

#### 7.1 创建系统托盘

```typescript
// electron/tray.ts
import { app, Menu, Tray, BrowserWindow } from 'electron'
import { join } from 'path'

let tray: Tray | null = null

export function createTray(win: BrowserWindow) {
  const icon = join(__dirname, '../../public/favicon.ico')
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: '显示应用', click: () => win.show() },
    { label: '退出', click: () => app.quit() },
  ])

  tray.setToolTip('Vue3 Vite Electron App')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show()
  })

  return tray
}
```

#### 7.2 创建应用菜单

```typescript
// electron/menu.ts
import { app, Menu, BrowserWindow, shell } from 'electron'

export function createMenu(win: BrowserWindow) {
  const template = [
    {
      label: '文件',
      submenu: [{ role: 'quit', label: '退出' }],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
      ],
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '重新加载' },
        { role: 'forceReload', label: '强制重新加载' },
        { role: 'toggleDevTools', label: '开发者工具' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
      ],
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click: async () => {
            await shell.openExternal('https://github.com/your-repo')
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template as any)
  Menu.setApplicationMenu(menu)
}
```

### 8. 更新主进程文件，集成托盘和菜单

```typescript
// 在electron/main.ts中导入
import { createTray } from './tray'
import { createMenu } from './menu'

// 在createWindow函数中添加
async function createWindow() {
  // 现有代码...

  // 创建系统托盘
  createTray(win)

  // 创建应用菜单
  createMenu(win)
}
```

### 9. 配置自动更新

```typescript
// electron/updater.ts
import { autoUpdater } from 'electron-updater'
import { app, BrowserWindow, dialog } from 'electron'

export function setupAutoUpdater(win: BrowserWindow) {
  // 配置更新服务器URL
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'http://your-update-server.com',
  })

  // 检查更新
  autoUpdater.checkForUpdates()

  // 设置自动下载
  autoUpdater.autoDownload = true

  // 有可用更新
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: '应用更新',
      message: '有新版本可用，正在下载...',
      buttons: ['确定'],
    })
  })

  // 更新下载完成
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '安装更新',
        message: '更新已下载，应用将重启并安装',
        buttons: ['立即重启'],
      })
      .then(() => {
        autoUpdater.quitAndInstall()
      })
  })

  // 更新错误
  autoUpdater.on('error', (err) => {
    dialog.showErrorBox('更新失败', err.toString())
  })
}
```

### 10. 打包和发布

```bash
# 打包应用
pnpm run build:electron

# 生成的安装包将位于release目录下
```

### 11. 注意事项

1. 在开发过程中，需要注意Electron的安全性问题，避免使用不安全的配置
2. 在生产环境中，应该禁用nodeIntegration和启用contextIsolation
3. 使用签名证书对应用进行签名，提高用户信任度
4. 考虑使用electron-store等库来存储本地配置
5. 考虑添加崩溃报告功能，收集用户反馈

### 12. 调试技巧

1. 使用`win.webContents.openDevTools()`打开开发者工具
2. 在主进程中使用`console.log`进行调试，日志会输出到终端
3. 使用VS Code的Electron调试配置
4. 使用electron-debug包添加更多调试功能

### 13. 性能优化

1. 使用asar打包应用，提高启动速度
2. 减少不必要的依赖，减小应用体积
3. 使用懒加载和代码分割，提高渲染进程性能
4. 避免在主进程中进行耗时操作，可能会导致应用卡顿
