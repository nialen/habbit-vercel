// 安全的浏览器存储包装器，支持服务器端渲染

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from localStorage: ${error}`);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error writing to localStorage: ${error}`);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage: ${error}`);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.clear();
    } catch (error) {
      console.warn(`Error clearing localStorage: ${error}`);
    }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return null;
    }
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn(`Error reading from sessionStorage: ${error}`);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return;
    }
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Error writing to sessionStorage: ${error}`);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return;
    }
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from sessionStorage: ${error}`);
    }
  },
  
  clear: (): void => {
    if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
      return;
    }
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn(`Error clearing sessionStorage: ${error}`);
    }
  }
}; 