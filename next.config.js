const createNextIntlPlugin = require('next-intl/plugin')
const path = require('path')

// @tailwindcss/node builds its enhanced-resolve modules list as:
//   ["node_modules", ...NODE_PATH ? [NODE_PATH] : []]
// The "node_modules" walk-up finds the parent workspace's tailwindcss v3 (no index.css) first.
// Adding the project-local node_modules as an absolute path via NODE_PATH ensures v4 is found
// when the v3 lookup fails.
const projectNodeModules = path.resolve(__dirname, 'node_modules')
if (!process.env.NODE_PATH || !process.env.NODE_PATH.includes(projectNodeModules)) {
  process.env.NODE_PATH = [projectNodeModules, process.env.NODE_PATH].filter(Boolean).join(path.delimiter)
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  webpack: (config) => {
    // Force resolve tailwindcss from project-local node_modules
    // (prevents parent /Projects/node_modules tailwindcss v3 from being picked up)
    config.resolve.alias['tailwindcss'] = path.resolve(__dirname, 'node_modules/tailwindcss')
    return config
  }
}

module.exports = withNextIntl(nextConfig)
