const assert = require("assert");
const supertest = require("supertest");
const md5 = require("md5");
const elpisCore = require("../../elpis-core");

const signKey = "adsefdrgfhjvgcxfbds34er5thy";
const st = Date.now();

describe("测试project相关接口", function () {
  this.timeout(60000);
  let modelList;
  const projectList = [];
  let request;

  it("启动服务", async () => {
    const app = await elpisCore.start();
    modelList = require("../../model/index")(app);
    modelList.forEach((item) => {
      const { project } = item;
      for (const key in project) {
        projectList.push(project[key]);
      }
    });
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

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      assert(item.model);
      assert(item.model.key);
      assert(item.model.name);
      assert(item.project);
      Object.values(item.project).forEach((proj) => {
        assert(proj.key);
        assert(proj.name);
      });
    }
  });

  it("GET /api/project/list without projKey", async () => {
    let tmpRequest = request.get("/api/project/list");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === true);
    const resBody = res.body.data;
    const allProjectList = modelList.reduce((prev, cur) => {
      return [...prev, ...Object.values(cur.project)];
    }, []);
    assert(resBody.length === allProjectList.length);
  });

  it("GET /api/project/list with projKey", async () => {
    const proj = projectList[Math.floor(Math.random() * projectList.length)];
    const { modelKey, key: projectKey } = proj;
    let tmpRequest = request.get("/api/project/list");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest.query({
      proj_key: projectKey,
    });
    assert(res.body.success === true);
    const resData = res.body.data;

    assert(
      projectList.filter((item) => item.modelKey === modelKey).length ===
        resData.length
    );

    for (let i = 0; i < resData.length; i++) {
      const item = resData[i];
      assert(item.modelKey);
      assert(item.key);
      assert(item.name);
      assert(item.desc !== undefined);
      assert(item.homePage !== undefined);
    }
  });

  it("GET /api/project/getProject without proj_key", async () => {
    let tmpRequest = request.get("/api/project/getProject");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest;
    assert(res.body.success === false);
    const resBody = res.body;
    assert(resBody.code === 442);
    assert(resBody.message.indexOf(`参数校验失败:`) > -1);
  });

  it("GET /api/project/getProject with proj_key", async () => {
    const proj = projectList[Math.floor(Math.random() * projectList.length)];
    const { key: projectKey } = proj;
    let tmpRequest = request.get("/api/project/getProject");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest.query({
      proj_key: projectKey,
    });
    assert(res.body.success === true);
    const resData = res.body.data;
    assert(resData.key === projectKey);
    assert(resData.modelKey);
    assert(resData.name);
    assert(resData.desc !== undefined);
    assert(resData.homePage !== undefined);

    for (let menu of resData.menu) {
      checkMenu(menu);
    }

    //递归校验menu
    function checkMenu(menu) {
      assert(menu.key);
      assert(menu.name);
      assert(menu.menuType);
      if (menu.menuType === "group") {
        assert(menu.subMenu !== undefined);
        for (let childMenu of menu.subMenu) {
          checkMenu(childMenu);
        }
      } else if (menu.menuType === "module") {
        checkModule(menu);
      }
    }

    //校验module
    function checkModule(menu) {
      const { moduleType } = menu;
      assert(moduleType);
      if (moduleType === "sider") {
        const { siderConfig } = menu;
        assert(siderConfig !== undefined);
        assert(siderConfig.menu !== undefined);
        siderConfig.menu.forEach((item) => {
          checkMenu(item);
        });
      } else if (moduleType === "iframe") {
        assert(menu.iframeConfig !== undefined);
        assert(menu.iframeConfig.path !== undefined);
      } else if (moduleType === "custom") {
        assert(menu.customConfig !== undefined);
        assert(menu.customConfig.path !== undefined);
      } else if (moduleType === "schema") {
        assert(menu.schemaConfig !== undefined);
        assert(menu.schemaConfig.api !== undefined);
        assert(menu.schemaConfig.schema !== undefined);
      }
    }
  });

  it("GET /api/project/getProject fail", async () => {
    let tmpRequest = request.get("/api/project/getProject");
    tmpRequest = tmpRequest.set("s_t", st);
    tmpRequest = tmpRequest.set("s_sign", md5(`${signKey}_${st}`));
    const res = await tmpRequest.query({
      proj_key: "xxxxxx",
    });
    console.log(res.body)
    assert(res.body.success === false);
    const resBody = res.body;
    console.log(resBody)
    assert(resBody.code === 50000);
    assert(resBody.message.indexOf("proj_key not found") > -1);
  });
});
