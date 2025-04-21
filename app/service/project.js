module.exports = (app) => {
    const BaseService = require('./base')(app);
    return class ProjectService extends BaseService {
        /**
         * 获取项目列表
         * @param {object} ctx 上下文
         * @returns 
         */
        async getList(ctx){
            return [{
                id: 1,
                name: '项目1',
                description: '项目1描述',
                createTime: '2023-01-01 00:00:00',
                updateTime: '2023-01-01 00:00:00'
            }, {
                id: 2,
                name: '项目2',
                description: '项目2描述',
                createTime: '2023-01-01 00:00:00',
                updateTime: '2023-01-01 00:00:00'
            }]
        }
    }
}   