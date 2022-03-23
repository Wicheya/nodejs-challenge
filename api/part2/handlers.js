import { GithubRepo } from "../../repo/github-repo.js"


export class GetHandler{
  constructor(repo){
    this.searchRepo = repo
  }

  /**
   * act as request handler of GET /part2 api
   * receive page from request's query params
   * delegate actual work of calling search repositories api to <searchRepo>
   * 
   * if api called result as error 403, rate limit exceed. (10 requests / min for unauth request)
   * return error response 403
   * 
   *
   * @param {*} request
   * @param {*} h
   * @return {*} html page, displaying search result of repositories in table.
   * @memberof GetHandler
   */
  async handle(request, h){
    let searchResponse
    
    try {
      searchResponse = await this.searchRepo.searchRepositories({page: request.query.page})
    } catch (error) {

      const errorDescription = `${error.response?.statusText}` || "Unable to process request"
      const helperMessage = error.response?.status === 403 ? "Please wait 1 minute before making a new request" : ""
  
      return h.response({
        error : `${errorDescription} , ${helperMessage}`
      }).code(error.response?.status || 500)
    }


    return h.view("part2", {
      searchResults: searchResponse.data.items,
      paginationInfo: {
        ...searchResponse.paginationInfo
      }
    })
  }
}

const getHandlerInstance = new GetHandler(new GithubRepo())

export default {
  get: getHandlerInstance.handle.bind(getHandlerInstance)
}