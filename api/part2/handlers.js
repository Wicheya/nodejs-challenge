import { GithubRepo } from "../../repo/github-repo.js"


export class GetHandler{
  constructor(repo){
    this.searchRepo = repo
  }

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