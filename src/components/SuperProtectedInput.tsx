import React, { useRef, useEffect, useCallback, forwardRef, useImperativeHandle, useState } from 'react'

export interface SuperProtectedInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit?: (value: string) => void
  onDebouncedChange?: (value: string) => void // 防抖更新，用于按钮状态判断
  placeholder?: string
  className?: string
  rows?: number
  disabled?: boolean
  autoFocus?: boolean
  debounceDelay?: number // 防抖延迟时间，默认300ms
}

export interface SuperProtectedInputRef {
  focus: () => void
  blur: () => void
  getValue: () => string
  setValue: (value: string) => void
}

const SuperProtectedInput = forwardRef<SuperProtectedInputRef, SuperProtectedInputProps>(
  ({
    value,
    onChange,
    onSubmit,
    onDebouncedChange,
    placeholder = '',
    className = '',
    rows = 4,
    disabled = false,
    autoFocus = false,
    debounceDelay = 300
  }, ref) => {
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const valueRef = useRef(value) // 内容存储
    const selectionRef = useRef({ start: 0, end: 0 }) // 光标位置存储
    const isComposingRef = useRef(false) // 防止输入法冲突
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null) // 防抖定时器

    // 更新内部值引用
    useEffect(() => {
      valueRef.current = value
    }, [value])

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus()
      },
      blur: () => {
        inputRef.current?.blur()
      },
      getValue: () => valueRef.current,
      setValue: (newValue: string) => {
        if (inputRef.current) {
          valueRef.current = newValue
          inputRef.current.value = newValue
        }
      }
    }), [])

    // 恢复光标位置
    const restoreSelection = useCallback(() => {
      const el = inputRef.current
      if (!el) return

      // 防止在输入法输入过程中恢复光标
      if (isComposingRef.current) return

      const { start, end } = selectionRef.current
      if (start !== null && end !== null) {
        try {
          el.setSelectionRange(start, end)
        } catch (error) {
          // 忽略选择范围设置错误
        }
      }
    }, [])

    // 保存光标位置
    const saveSelection = useCallback(() => {
      const el = inputRef.current
      if (!el) return

      selectionRef.current = {
        start: el.selectionStart,
        end: el.selectionEnd
      }
    }, [])

    // 防抖更新state（用于按钮状态判断）
    const debouncedStateUpdate = useCallback((newValue: string) => {
      if (onDebouncedChange) {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          onDebouncedChange(newValue)
        }, debounceDelay)
      }
    }, [onDebouncedChange, debounceDelay])

    // 处理输入变化
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      valueRef.current = newValue // 实时保存到ref

      // 保存当前光标位置
      saveSelection()

      // 实时触发onChange，但不传递给父组件state
      // 这样可以支持实时验证等功能
      onChange(newValue)

      // 防抖更新state，用于按钮状态判断
      debouncedStateUpdate(newValue)
    }, [onChange, saveSelection, debouncedStateUpdate])

    // 处理键盘事件
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
        e.preventDefault()
        onSubmit(valueRef.current)
      }
    }, [onSubmit])

    // 处理输入法开始
    const handleCompositionStart = useCallback(() => {
      isComposingRef.current = true
    }, [])

    // 处理输入法结束
    const handleCompositionEnd = useCallback(() => {
      isComposingRef.current = false
      // 输入法结束后恢复光标位置
      setTimeout(restoreSelection, 0)
    }, [restoreSelection])

    // 处理焦点获得
    const handleFocus = useCallback(() => {
      // 聚焦时恢复光标位置
      setTimeout(restoreSelection, 0)
    }, [restoreSelection])

    // 处理点击事件
    const handleClick = useCallback(() => {
      // 点击后保存光标位置
      setTimeout(saveSelection, 0)
    }, [saveSelection])

    // 处理选择事件
    const handleSelect = useCallback(() => {
      saveSelection()
    }, [saveSelection])

    // 每次重渲染后恢复光标位置
    useEffect(() => {
      restoreSelection()
    })

    // 自动聚焦
    useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus()
      }
    }, [autoFocus])

    // 清理定时器
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    }, [])

    return (
      <textarea
        ref={inputRef}
        defaultValue={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onFocus={handleFocus}
        onClick={handleClick}
        onSelect={handleSelect}
        placeholder={placeholder}
        className={className}
        rows={rows}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    )
  }
)

SuperProtectedInput.displayName = 'SuperProtectedInput'

export default SuperProtectedInput
