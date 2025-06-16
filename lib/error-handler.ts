// 全局错误处理器
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return

  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason
    
    // 如果是存储相关的错误，静默处理
    if (isStorageError(error)) {
      console.warn('Storage error caught and suppressed:', error)
      event.preventDefault()
      return
    }
    
    // 其他错误正常处理
    console.error('Unhandled promise rejection:', error)
  })

  // 捕获全局 JavaScript 错误
  window.addEventListener('error', (event) => {
    const error = event.error
    
    // 如果是存储相关的错误，静默处理
    if (isStorageError(error)) {
      console.warn('Storage error caught and suppressed:', error)
      event.preventDefault()
      return
    }
    
    // 其他错误正常处理
    console.error('Global error:', error)
  })
}

// 检查是否是存储相关的错误
function isStorageError(error: any): boolean {
  if (!error) return false
  
  const errorMessage = error.message || error.toString()
  const errorStack = error.stack || ''
  
  // 检查常见的存储错误特征
  const storageErrorPatterns = [
    'Cannot read properties of undefined (reading \'length\')',
    'localStorage is not defined',
    'sessionStorage is not defined',
    'getItem',
    'setItem',
    'removeItem',
    'storage quota',
    'QuotaExceededError'
  ]
  
  return storageErrorPatterns.some(pattern => 
    errorMessage.includes(pattern) || errorStack.includes(pattern)
  )
}
