/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/store/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/types/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/config/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/i18n/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/middleware.ts",
    "./src/worker.js",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-quicksand)', 'Quicksand', 'sans-serif'],
        comic: ['var(--font-comic-neue)', 'Comic Neue', 'cursive'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'content-background': 'var(--content-background)',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'fade-in-down': 'fade-in-down 0.5s ease-out',
        'fade-in-left': 'fade-in-left 0.5s ease-out',
        'fade-in-right': 'fade-in-right 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in-up': 'slide-in-up 0.5s ease-out',
        'slide-in-down': 'slide-in-down 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-custom': 'pulse-custom 2s infinite',
        'glow-pulse': 'glow-pulse 2s infinite',
        'scale-bounce': 'scale-bounce 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'rainbow': 'rainbow 3s linear infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-in-down': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-custom': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 105, 180, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 105, 180, 0.8)' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'sparkle': {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '0.8' },
        },
        'rainbow': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    // 动态生成的类名
    'bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
    'text-red-500', 'text-green-500', 'text-blue-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500',
    'border-red-500', 'border-green-500', 'border-blue-500', 'border-yellow-500', 'border-purple-500', 'border-pink-500',
    'hover:bg-red-600', 'hover:bg-green-600', 'hover:bg-blue-600', 'hover:bg-yellow-600', 'hover:bg-purple-600', 'hover:bg-pink-600',
    'hover:text-red-600', 'hover:text-green-600', 'hover:text-blue-600', 'hover:text-yellow-600', 'hover:text-purple-600', 'hover:text-pink-600',
    'focus:ring-red-500', 'focus:ring-green-500', 'focus:ring-blue-500', 'focus:ring-yellow-500', 'focus:ring-purple-500', 'focus:ring-pink-500',
    // 动画类名
    'animate-fade-in-up', 'animate-fade-in-down', 'animate-fade-in-left', 'animate-fade-in-right', 'animate-fade-in',
    'animate-slide-in-up', 'animate-slide-in-down', 'animate-scale-in', 'animate-pulse-custom', 'animate-glow-pulse',
    'animate-scale-bounce', 'animate-float', 'animate-sparkle', 'animate-rainbow',
    // 延迟类名
    'animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400', 'animate-delay-500',
    'animate-delay-600', 'animate-delay-700', 'animate-delay-800', 'animate-delay-900', 'animate-delay-1000',
    // 响应式类名
    'sm:block', 'sm:hidden', 'md:block', 'md:hidden', 'lg:block', 'lg:hidden', 'xl:block', 'xl:hidden',
    'sm:flex', 'sm:grid', 'md:flex', 'md:grid', 'lg:flex', 'lg:grid', 'xl:flex', 'xl:grid',
    // 工具类名
    'text-center', 'text-left', 'text-right', 'justify-center', 'justify-start', 'justify-end',
    'items-center', 'items-start', 'items-end', 'self-center', 'self-start', 'self-end',
  ],
} 