const assert = require("assert");
const supertest = require("supertest");
const md5 = require("md5");
const elpisCore = require("../../elpis-core");

const signKey = "adsefdrgfhjvgcxfbds34er5thy";
const st = Date.now();

describe("测试project相关接口", function () {
  this.timeout(60000);
  let request;

  it("启动服务", async () => {
    const app = await elpisCore.start();
    request = supertest(app.listen());
  });

  it("GET /api/project/model_list", async () => {
    let tmpRequest = request.get("/api/project/model_list");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === true);
    const resData = res.body.data;
    assert(resData.length > 0);

    for(let i = 0; i < resData.length; i++){
        const item = resData[i]
        assert(item.model)
        assert(item.model.key)
        assert(item.model.name)
        assert(item.project)
        Object.values(item.project).forEach(proj => {
            assert(proj.key)
            assert(proj.name)
        })    
    }
  });
});
