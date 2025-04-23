import { ElMessage } from "element-plus";
import md5 from "md5";

/**
 *  前端封装的 curl 方法
 */
const curl = ({
  url, //请求地址
  method = "post", //请求方法
  headers = {}, //请求头
  query = {}, // url query
  data = {}, // body data
  responseType = "json", //response data type
  timeout = 60000, //timeout
  errorMessage = "网络异常",
}) => {
  //接口签名处理（让接口具有时效性）
  const signKey = "adsefdrgfhjvgcxfbds34er5thy";
  const st = Date.now();

  //构造请求参数
  const ajaxSetting = {
    url, //请求地址
    method, //请求方法
    params: query,
    data, // body data
    responseType, //response data type
    timeout, //timeout
    headers: {
      ...headers,
      s_t: st,
      s_sign: md5(`${signKey}_${st}`),
    },
  };

  return axios.request(ajaxSetting)
    .then((response) => {
      const resData = response.data || {};
      const { success, code, message } = resData;
      if (!success) {
        if (code === 442) {
          ElMessage.error("请求参数异常");
        } else if (code === 445) {
          ElMessage.error("请求非法");
        } else if (code === 50000) {
          ElMessage.error(message);
        }

        console.error(message);

        return Promise.resolve({ success, code, message });
      }

      const { data, metaData } = resData;
      return Promise.resolve({ success, data, metaData });
    })
    .catch((error) => {
      const { message } = error;
      if (message.test(/timeout/)) {
        return Promise.resolve({
          message: "Request Timeout",
          code: 504,
        });
      }
      return Promise.resolve(error);
    });
};

export default curl;
