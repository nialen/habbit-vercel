const fs = require('fs');

function setupEnvironment() {
  const envType = process.argv[2] || 'development';
  
  console.log('🚀 星航成长营 StarVoyage - 环境配置设置');
  console.log('=======================================');
  console.log(`设置环境: ${envType}`);
  console.log('');

  // 检查环境类型
  if (envType !== 'development' && envType !== 'production') {
    console.error('❌ 错误: 环境类型必须是 "development" 或 "production"');
    console.error('用法: node setup-env.js [development|production]');
    process.exit(1);
  }

  const envFile = `.env.${envType}`;
  const envExample = `.env.${envType}.example`;

  // 检查模板文件是否存在
  if (!fs.existsSync(envExample)) {
    console.error(`❌ 错误: 模板文件 ${envExample} 不存在`);
    console.error('请先运行: npm run create-env-templates');
    process.exit(1);
  }

  try {
    // 复制模板文件
    console.log('📁 复制环境配置模板...');
    const content = fs.readFileSync(envExample, 'utf8');
    fs.writeFileSync(envFile, content, 'utf8');

    console.log(`✅ 环境文件 ${envFile} 已创建`);
    console.log('');

    // 提示用户编辑配置
    console.log('📝 下一步操作:');
    console.log(`1. 编辑 ${envFile} 文件`);
    console.log('2. 填入正确的配置值:');
    if (envType === 'development') {
      console.log('   - 开发环境 Supabase 配置');
      console.log('   - 测试数据库连接信息');
      console.log('   - 开发环境 API 密钥');
    } else {
      console.log('   - 生产环境 Supabase 配置');
      console.log('   - 正式数据库连接信息');
      console.log('   - 生产环境 API 密钥');
    }
    console.log('3. 运行: npm run dev (开发环境) 或 npm run build:prod (生产环境)');
    console.log('');

    console.log('🔍 配置验证: npm run check-env');
    console.log('🎉 环境配置设置完成！');
  } catch (error) {
    console.error('❌ 设置环境时出错:', error.message);
    process.exit(1);
  }
}

setupEnvironment();
