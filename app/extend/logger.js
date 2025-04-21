const log4js = require("log4js");

/**
 * 日志工具
 * how to call
 * app.logger.info('test')
 * app.logger.error('test')
 * @param {} app
 * @returns
 */

module.exports = (app) => {
  let logger;

  if (app.env.isLocal()) {
    //console.log 即可
    logger = console;
  } else {
    //log 落盘
    log4js.configure({
      appenders: {
        console: { type: "console" },
        // 日志文件切分
        dateFile: {
          type: "dateFile",
          filename: "logs/application.log",
          pattern: ".yyyy-MM-dd",
        },
      },
      categories: {
        default: { appenders: ["console", "dateFile"], level: "trace" },
      },
    });

    logger = log4js.getLogger();
  }

  return logger;
};
