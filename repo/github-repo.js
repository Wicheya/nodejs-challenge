import axios from "axios"
import { APP_CONST } from "../config/constants.js"


/**
 * Repository class for accessing github search api
 *
 * @export
 * @class GithubRepo
 */
export class GithubRepo{
  async searchRepositories({query, page} = {}){
    const response = await this.getSearchResponse({query, page})
    response.paginationInfo = this.extractPaginationInfoFromRequestHeader(response.headers.link)
    return response
  }

  getSearchResponse({query = "nodejs", page = 1}){
    return axios.get(APP_CONST.GITHUB_SEARCH_REPO_API , {
      headers: {
        Accept: "application/vnd.github.v3+json"
      },
      params: {
        q: query,
        per_page: 10,
        page,
      }
    })  
  }


  /**
   * Github search api provide pagination info in request's header, "link" field.
   * 
   * The method extract the query params in each link then append it to "/part2" string
   * 
   *
   * @param {*} linkString "
   *  <https://api.github.com/search/repositories?q=nodejs&page=1>; rel="prev",
   *  <https://api.github.com/search/repositories?q=nodejs&page=2>; rel="next"
   * "
   * @return {*} result {
        first: '/part2?page=1',
        prev: '/part2?page=1',
        next: '/part2?page=3',
        last: '/part2?page=99'
      } // each element will be used in <a href="element"> of part2 html file.
   * @memberof GithubRepo
   */
  extractPaginationInfoFromRequestHeader(linkString){
    const links = linkString.split(",")
    const result = {}
    links.forEach(link => {
      const [url , rel] = link.split(";")
      const urlRegex = new RegExp("<(.*)>" , "g")
      const relRegex = new RegExp('rel="(.*)"' , "g")
  
      const urlExec = urlRegex.exec(url)
      const relExec = relRegex.exec(rel)
      if(urlExec === null) throw new Error("Unable to parse url :" , url)
      if(relExec === null) throw new Error("Unable to parse rel :" , rel)
  
      result[relExec[1]] = "/part2" + new URL(urlExec[1]).search
    });
    
    return result
  }
}