const { defineConfig } = require('@vue/cli-service')
const rewritePath = '^' + process.env.VUE_APP_API_BASE_URL

module.exports = defineConfig({
    transpileDependencies: true,
    devServer:{
        proxy: {
            [process.env.VUE_APP_API_BASE_URL]: {
                target: process.env.VUE_APP_BACKEND_URL,
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    [rewritePath]: '' 
                }
            }
        }
    }
})
