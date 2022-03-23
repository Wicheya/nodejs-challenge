import axios from "axios"
import { APP_CONST } from "../config/constants.js"


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