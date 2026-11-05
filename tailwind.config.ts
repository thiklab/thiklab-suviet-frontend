import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: "#FAF7F2",  // Màu giấy dó ấm
          100: "#F3EDE2", // Khung nền thẻ
          200: "#E6DCB8",
          300: "#D4C5A9",
          800: "#362E2B", // Chữ phụ/viền mờ
          900: "#1E1917", // Chữ mực đen tiêu chuẩn
        },
        crimson: {
          DEFAULT: "#8F1D1D", // Đỏ son ấn triện
          deep: "#6D1414",
          light: "#FDF2F2",
        },
        bronze: {
          DEFAULT: "#966A38", // Màu đồng cổ thau
          dark: "#6F4B23",
          light: "#F7F3EE",
        },
      },
      fontFamily: {
        serif: ["var(--font-be-vietnam)", "system-ui", "-apple-system", "sans-serif"],
        sans: ["var(--font-be-vietnam)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-be-vietnam)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        editorial: "0 2px 20px -2px rgba(30, 25, 23, 0.05), 0 1px 4px -1px rgba(30, 25, 23, 0.03)",
        popover: "0 10px 30px -5px rgba(30, 25, 23, 0.12), 0 0 1px 1px rgba(30, 25, 23, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;

