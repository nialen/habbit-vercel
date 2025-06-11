#!/usr/bin/env node

/**
 * Vercel环境变量检查脚本
 * 帮助诊断本地和生产环境的配置差异
 */

// 加载环境变量
const fs = require('fs')
const path = require('path')

// 根据NODE_ENV加载对应的.env文件
const nodeEnv = process.env.NODE_ENV || 'development'
const envFile = `.env.${nodeEnv}`

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        // 只设置还没有设置的环境变量
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    }
  })
  
  console.log(`📁 已加载环境配置文件: ${envFile}`)
} else {
  console.log(`⚠️  环境配置文件不存在: ${envFile}`)
}

console.log('🔍 检查Vercel环境变量配置...\n');

// 关键环境变量列表
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_APP_MODE',
  'NEXT_PUBLIC_APP_ENV',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_ENABLE_ANALYTICS',
  'NEXT_PUBLIC_PLAUSIBLE_DOMAIN',
  'NEXT_PUBLIC_ENABLE_DEBUG',
  'SUPABASE_SERVICE_ROLE_KEY',
  'HABIT_WORDS_KEY'
];

console.log('📊 当前环境变量状态:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '❌ 未设置'}`);
console.log(`Platform: ${process.env.VERCEL ? '🔥 Vercel' : '💻 Local'}\n`);

console.log('🔑 必需的环境变量:');
let missingRequired = 0;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // 隐藏敏感信息，只显示前几位和长度
    const maskedValue = value.length > 10 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)} (${value.length} chars)`
      : `${value} (${value.length} chars)`;
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`  ❌ ${varName}: 未设置`);
    missingRequired++;
  }
});

console.log('\n🔧 可选的环境变量:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    const maskedValue = value.length > 10 
      ? `${value.substring(0, 8)}...${value.substring(value.length - 4)} (${value.length} chars)`
      : `${value} (${value.length} chars)`;
    console.log(`  ✅ ${varName}: ${maskedValue}`);
  } else {
    console.log(`  ⚪ ${varName}: 未设置`);
  }
});

// 应用模式检查
console.log('\n🎯 应用配置分析:');
const appMode = process.env.NEXT_PUBLIC_APP_MODE || 'demo';
const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'development';
console.log(`  应用模式: ${appMode} ${appMode === 'demo' ? '(演示模式)' : '(完整模式)'}`);
console.log(`  应用环境: ${appEnv}`);

// Supabase配置检查
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  const isValidUrl = supabaseUrl.includes('.supabase.co') && !supabaseUrl.includes('[YOUR');
  const isValidKey = supabaseKey.length > 100 && !supabaseKey.includes('[YOUR');
  
  console.log(`  Supabase配置: ${isValidUrl && isValidKey ? '✅ 有效' : '❌ 无效'}`);
  
  if (!isValidUrl) {
    console.log(`    ⚠️  URL格式可能不正确: ${supabaseUrl}`);
  }
  if (!isValidKey) {
    console.log(`    ⚠️  Key格式可能不正确 (长度: ${supabaseKey.length})`);
  }
} else {
  console.log(`  Supabase配置: ❌ 缺少必要配置`);
}

// 总结和建议
console.log('\n📋 诊断总结:');
if (missingRequired > 0) {
  console.log(`❌ 发现 ${missingRequired} 个缺失的必需环境变量`);
  console.log('💡 建议检查Vercel项目设置中的Environment Variables');
} else {
  console.log('✅ 所有必需的环境变量都已配置');
}

if (process.env.VERCEL) {
  console.log('\n🔥 Vercel特定检查:');
  console.log(`  部署环境: ${process.env.VERCEL_ENV || '未知'}`);
  console.log(`  项目: ${process.env.VERCEL_PROJECT_NAME || '未知'}`);
  console.log(`  Git分支: ${process.env.VERCEL_GIT_COMMIT_REF || '未知'}`);
}

console.log('\n🛠️  如果本地和Vercel表现不同，请检查:');
console.log('1. Vercel项目设置 → Environment Variables');
console.log('2. 确保生产环境使用正确的NEXT_PUBLIC_APP_MODE');
console.log('3. 检查NEXT_PUBLIC_APP_URL是否指向正确的域名');
console.log('4. 确认Supabase URL和Key对应正确的项目环境'); 