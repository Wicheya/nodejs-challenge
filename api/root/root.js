import { APP_CONST } from "../../config/constants.js"

async function get(request, h){
  return h.view("index", {
    apiPath: {
      part1: "/" + APP_CONST.PART_1_API_PATH,
      part2: "/" + APP_CONST.PART_2_API_PATH,
    }
  })
}

export default {
  get
}