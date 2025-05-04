module.exports = {
  "/api/proj/product/list": {
    get: {
      query: {
        type: "object",
        properties: {
          size: {
            type: "string",
          },
          page: {
            type: "string",
          },
        },
        required: ["page", "size"],
      },
    },
  },
  "/api/proj/product": {
    delete: {
      body: {
        type: "object",
        properties: {
          product_id: {
            type: "number",
          },
        },
      },
      required: ["product_id"],
    },
  },
};
