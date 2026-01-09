import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// Usamos una función para poder acceder al 'mode' y usar 'loadEnv'
export default defineConfig(({ mode }) => {
  // Carga variables de entorno (incluida VITE_API_URL de Netlify)
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          // CAMBIO CLAVE: Usamos 'env' en lugar de 'import.meta.env'
          target: env.VITE_API_URL || "http://localhost:5000",
          changeOrigin: true,
        },
      },
    },
  }
})