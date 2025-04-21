const superagent = require('superagent');

module.exports = (app) => class BaseService {
    /**
     * service基类
     * @param {object} ctx 上下文
     * 统一收拢 service 的一些公共方法
     */
    constructor(ctx) {
        this.app = app;
        this.config = app.config;
        this.curl = superagent;
    }
}