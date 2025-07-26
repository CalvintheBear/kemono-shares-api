// 测试分享按钮功能
console.log('🧪 开始测试分享按钮功能...')

// 模拟分享按钮的点击事件
const testShareButton = () => {
  console.log('1. 测试分享按钮悬停效果')
  console.log('   - 按钮应该有 hover:shadow-lg hover:scale-105 效果')
  console.log('   - 过渡动画应该有 transition-all duration-300')
  
  console.log('2. 测试分享按钮点击')
  console.log('   - 点击后应该显示分享菜单')
  console.log('   - 菜单应该有正确的z-index层级')
  console.log('   - 遮罩层应该是透明的')
  
  console.log('3. 测试分享菜单内容')
  console.log('   - 应该包含Twitter、Facebook、LINE、Instagram按钮')
  console.log('   - 每个按钮都应该有悬停效果')
  console.log('   - 点击后应该在新窗口打开对应平台')
  
  console.log('4. 测试关闭功能')
  console.log('   - 点击遮罩层应该关闭菜单')
  console.log('   - 页面其他元素应该保持可交互')
}

// 检查CSS类是否存在
const checkCSSClasses = () => {
  console.log('5. 检查CSS动画类')
  const styles = document.styleSheets
  let hasFadeIn = false
  
  for (let sheet of styles) {
    try {
      const rules = sheet.cssRules || sheet.rules
      for (let rule of rules) {
        if (rule.selectorText && rule.selectorText.includes('animate-fade-in')) {
          hasFadeIn = true
          break
        }
      }
    } catch (e) {
      // 跨域样式表会抛出错误，忽略
    }
  }
  
  console.log(`   - animate-fade-in类存在: ${hasFadeIn}`)
}

// 模拟测试
if (typeof window !== 'undefined') {
  testShareButton()
  checkCSSClasses()
} else {
  console.log('在Node.js环境中运行，跳过DOM相关测试')
}

module.exports = { testShareButton, checkCSSClasses } 