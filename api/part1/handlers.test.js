import { APP_CONST } from "../../config/constants.js";
import { init } from "../../lib/server.js";

describe("Test part1 api handler", () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe("invoke POST failed, payload invalid", () => {
    test("empty payload", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
      });

      expect(res.statusCode).toBe(400);
      expect(res.result).toContainKey("validation");
    });

    test("Invalid node schema", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: {
          0: [
            {
              invalidKey1: "key1",
              invalidKey2: "key2",
            },
          ],
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.result).toContainKey("validation");
    });

    test("Unfullfilled node required key", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: {
          0: [{ title: "House", level: 0, children: [], parent_id: null }],
        },
      });

      expect(res.statusCode).toBe(400);
      expect(res.result).toContainKey("validation");
    });
  });

  describe("invoke POST succeed", () => {
    const requestPayload = {
      0: [{ id: 10, title: "House", level: 0, children: [], parent_id: null }],
      1: [
        { id: 12, title: "Red Roof", level: 1, children: [], parent_id: 10 },
        { id: 18, title: "Blue Roof", level: 1, children: [], parent_id: 10 },
        { id: 13, title: "Wall", level: 1, children: [], parent_id: 10 },
      ],
      2: [
        { id: 17, title: "Blue Window", level: 2, children: [], parent_id: 12 },
        { id: 16, title: "Door", level: 2, children: [], parent_id: 13 },
        { id: 15, title: "Red Window", level: 2, children: [], parent_id: 12 },
      ],
    };

    const expectedResult = [
      {
        id: 10,
        title: "House",
        level: 0,
        children: [
          {
            id: 12,
            title: "Red Roof",
            level: 1,
            children: [
              {
                id: 17,
                title: "Blue Window",
                level: 2,
                children: [],
                parent_id: 12,
              },
              {
                id: 15,
                title: "Red Window",
                level: 2,
                children: [],
                parent_id: 12,
              },
            ],
            parent_id: 10,
          },
          { id: 18, title: "Blue Roof", level: 1, children: [], parent_id: 10 },
          {
            id: 13,
            title: "Wall",
            level: 1,
            children: [
              { id: 16, title: "Door", level: 2, children: [], parent_id: 13 },
            ],
            parent_id: 10,
          },
        ],
        parent_id: null,
      },
    ];

    test("root node content", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: requestPayload,
      });
      const actualResult = JSON.parse(res.payload);

      expect(actualResult).toBeArrayOfSize(expectedResult.length);
      expect(actualResult[0]).toContainAllEntries([
        ["id", 10],
        ["title", "House"],
        ["level", 0],
        ["children", expect.any(Array)],
        ["parent_id", null],
      ]);
    });

    test("children level 1", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: requestPayload,
      });
      const actualResult = JSON.parse(res.payload);

      expect(actualResult[0].children).toBeArrayOfSize(
        expectedResult[0].children.length
      );
      expect(actualResult[0].children).toIncludeAllPartialMembers([
        { id: 12 },
        { id: 13 },
        { id: 18 },
      ]);
    });

    test("children level 2", async () => {
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: requestPayload,
      });
      const actualResult = JSON.parse(res.payload);

      expect(actualResult[0].children[0].children).toBeArrayOfSize(
        expectedResult[0].children[0].children.length
      );
      expect(actualResult[0].children[0].children).toIncludeAllPartialMembers([
        { id: 17 },
        { id: 15 },
      ]);
    });

    test("Multiple root node", async () => {
      const requestPayload = {
        0: [
          { id: 100, title: "House", level: 0, children: [], parent_id: null },
          {
            id: 200,
            title: "Red Roof",
            level: 0,
            children: [],
            parent_id: null,
          },
          {
            id: 300,
            title: "Red Roof",
            level: 0,
            children: [],
            parent_id: null,
          },
        ],
        1: [
          { id: 12, title: "Red Roof", level: 1, children: [], parent_id: 100 },
          {
            id: 18,
            title: "Blue Roof",
            level: 1,
            children: [],
            parent_id: 100,
          },
          { id: 13, title: "Wall", level: 1, children: [], parent_id: 200 },
          { id: 22, title: "Wall", level: 1, children: [], parent_id: 200 },
        ],
      };

      const expectedResult = [
        {
          id: 100,
          title: "House",
          level: 0,
          children: [
            {
              id: 12,
              title: "Red Roof",
              level: 1,
              children: [],
              parent_id: 100,
            },
            {
              id: 18,
              title: "Blue Roof",
              level: 1,
              children: [],
              parent_id: 100,
            },
          ],
          parent_id: null,
        },
        {
          id: 200,
          title: "Red Roof",
          level: 0,
          children: [
            { id: 13, title: "Wall", level: 1, children: [], parent_id: 200 },
            { id: 22, title: "Wall", level: 1, children: [], parent_id: 200 },
          ],
          parent_id: null,
        },
        {
          id: 300,
          title: "Red Roof",
          level: 0,
          children: [],
          parent_id: null,
        },
      ];
      const res = await server.inject({
        method: "post",
        url: "/" + APP_CONST.PART_1_API_PATH,
        payload: requestPayload,
      });
      const actualResult = JSON.parse(res.payload);

      expect(actualResult).toBeArrayOfSize(expectedResult.length);
      expect(actualResult).toIncludeAllPartialMembers([
        { id: 100 },
        { id: 200 },
        { id: 300 },
      ]);
    });
  });
});
