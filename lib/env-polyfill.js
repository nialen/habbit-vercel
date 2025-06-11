// Environment polyfill for server-side rendering
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  // 在服务器端模拟浏览器全局对象
  global.self = global
  global.window = global
  global.document = {}
  global.navigator = {}
  global.location = {}
} 