import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 使用兼容模式扩展Next.js配置
  ...compat.extends("next"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // 基本规则
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "react/display-name": "off",
      
      // Next.js 特定规则
      "@next/next/no-img-element": "off", // 允许使用img标签（OptimizedImage组件需要）
      "@next/next/no-html-link-for-pages": "off",
      
      // 其他规则
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn"
    }
  }
];

export default eslintConfig;
