const webpack = require('webpack');
const webpackProdConfig = require('./config/webpack.prod');

console.log('\n 构建中... \n')

webpack(webpackProdConfig, (err, stats) => {
    if (err) {
        console.error(err);
        return;
    }
    // 打印构建结果
    process.stdout.write(`${stats.toString({
        colors: true,// in console show color info
        chunks: false, //no show each code chunk info
        chunkModules: true, //show each module in code chunk module info
        children: false, //no show child compilation info
        modules: false, //no show each module package info
    })}\n`);
    console.log('\n 构建完成 \n');
    // 打印构建时间
    console.log(`构建时间: ${stats.endTime - stats.startTime}ms`);
});