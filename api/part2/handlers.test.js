import { jest } from '@jest/globals';
import { APP_CONST } from "../../config/constants.js";
import { init } from "../../lib/server.js";
import { GithubRepo } from "../../repo/github-repo.js";
import { SearchResponseFactory } from "../../test-utils/part2-search-response.factory.js";


describe('Test part2 api handler', () => {
  let server;
  const mockSearchRespFac = new SearchResponseFactory()

  beforeEach(async () => {
      server = await init();
  });

  afterEach(async () => {
      await server.stop();
  });

  test('invoke succeeded', async () => {
      jest.spyOn(GithubRepo.prototype , "searchRepositories").mockResolvedValue(mockSearchRespFac.getSearchResponse())

      const res = await server.inject({
        method: 'get',
        url: '/' + APP_CONST.PART_2_API_PATH
      });

      expect(res.statusCode).toBe(200);
  });

  test('invoke failed, github api rate limit exceeded', async () => {
      jest.spyOn(GithubRepo.prototype , "searchRepositories").mockRejectedValue({
        response: {
          statusText: "rate limit exceeded",
          status: 403
        }
      })

      const res = await server.inject({
        method: 'get',
        url: '/' + APP_CONST.PART_2_API_PATH
      });

      expect(res.statusCode).toBe(403);
      expect(res.result).toEqual({
        error: "rate limit exceeded , Please wait 1 minute before making a new request"
      })
  });

});