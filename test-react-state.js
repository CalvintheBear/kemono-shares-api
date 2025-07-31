// 测试React状态更新行为
console.log('🔍 测试React状态更新行为...')

// 模拟React的状态更新机制
class MockReactState {
  constructor(initialValue) {
    this.value = initialValue
    this.listeners = []
  }

  setValue(newValue) {
    console.log('🔄 状态更新:', this.value, '->', newValue)
    this.value = newValue
    // 模拟React的异步更新
    setTimeout(() => {
      this.listeners.forEach(listener => listener(newValue))
    }, 0)
  }

  getValue() {
    return this.value
  }

  subscribe(listener) {
    this.listeners.push(listener)
  }
}

// 创建模拟状态
const generationProgress = new MockReactState(null)
const generationStatusText = new MockReactState('')

// 订阅状态变化
generationProgress.subscribe((newValue) => {
  console.log('📊 generationProgress 状态变化:', newValue)
})

generationStatusText.subscribe((newValue) => {
  console.log('📝 generationStatusText 状态变化:', newValue)
})

// 测试状态更新
console.log('\n🧪 测试状态更新:')
console.log('初始状态 - generationProgress:', generationProgress.getValue())

// 模拟重置按钮点击
console.log('\n🧪 模拟重置按钮点击:')
generationProgress.setValue(0)
generationStatusText.setValue('リセット完了')

// 检查状态
setTimeout(() => {
  console.log('重置后状态 - generationProgress:', generationProgress.getValue())
  console.log('重置后状态 - generationStatusText:', generationStatusText.getValue())
  
  // 测试渲染条件
  const shouldRender = generationProgress.getValue() !== null && generationProgress.getValue() >= 0
  console.log('渲染条件检查:', shouldRender)
  
  console.log('\n✅ 测试完成')
}, 10) 