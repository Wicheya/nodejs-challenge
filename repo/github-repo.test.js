import { jest } from '@jest/globals';
import { APP_CONST } from '../config/constants.js';
import { SearchResponseFactory } from "../test-utils/part2-search-response.factory.js";
import { GithubRepo } from "./github-repo.js";



describe("Github repo class" , () => {
  let githubRepo
  let mockSearchRespFac
  
  beforeAll(() => {
    mockSearchRespFac = new SearchResponseFactory()
    jest.useFakeTimers("modern").setSystemTime(new Date('2020-01-01'));
  })

  beforeEach(() => {
    githubRepo = new GithubRepo()
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("search for nodejs repositories succeeded" ,async () => {
    const expectedResult = {
      ...mockSearchRespFac.getSearchResponse(),
      paginationInfo : {
        first: '/part2?page=1',
        prev: '/part2?page=1',
        next: '/part2?page=3',
        last: '/part2?page=99'
      }
    } 
    jest.spyOn(githubRepo, "getSearchResponse").mockResolvedValue(mockSearchRespFac.getSearchResponse())
    
    const response = await githubRepo.searchRepositories()

    expect(response).toEqual(expectedResult)
  })

  test("extract pagination info from request header on first page succeeded ", () => {
    const expectedResult = {
      next: '/part2?page=2',
      last: '/part2?page=99'
    }
    
    const result = githubRepo.extractPaginationInfoFromRequestHeader(
      mockSearchRespFac.getRequestHeaderLink({
        first: null,
        prev: null,
        next: APP_CONST.GITHUB_SEARCH_REPO_API + "?page=2"
      })
    )

    expect(result).toEqual(expectedResult)
  })

  test("extract pagination info from request header succeeded", () => {
    const expectedResult = {
      first: '/part2?page=1',
      prev: '/part2?page=1',
      next: '/part2?page=3',
      last: '/part2?page=99'
    }
    
    const result = githubRepo.extractPaginationInfoFromRequestHeader(
      mockSearchRespFac.getRequestHeaderLink()
    )

    expect(result).toEqual(expectedResult)
  })

})


