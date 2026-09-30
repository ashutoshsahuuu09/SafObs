/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safobs: {
          bg: "#0B0F17",
          card: "#111827",
          cardHover: "#1F2937",
          border: "#1E293B",
          accent: "#FF6B00",     // Industrial Safety Orange
          amber: "#F59E0B",      // Hazard Warning
          critical: "#EF4444",   // Critical Incident Red
          success: "#10B981",    // Verified Green
          cyan: "#06B6D4",       // AI Perception Cyan
          textPrimary: "#F8FAFC",
          textMuted: "#94A3B8"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-orange': '0 0 20px -5px rgba(255, 107, 0, 0.3)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.3)',
        'glow-critical': '0 0 25px -5px rgba(239, 68, 68, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
