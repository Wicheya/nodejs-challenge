
import Hapi from "@hapi/hapi"
import { getServerConfig, registerView } from "../config/server-config.js";
import RootHandler from "../api/root/root.js"
import Part1Handler from "../api/part1/handlers.js"
import Part1Validator from "../api/part1/validators.js"
import Part2Handler from "../api/part2/handlers.js"
import { APP_CONST } from "../config/constants.js"


const server = Hapi.server(getServerConfig());
let hasViewRegistered = false

server.route({
  method: 'GET',
  path: '/',
  handler: RootHandler.get
});

server.route({
  method: 'GET',
  path: '/' + APP_CONST.PART_1_API_PATH,
  handler: Part1Handler.get,
});

server.route({
  method: 'POST',
  path: '/' + APP_CONST.PART_1_API_PATH,
  handler: Part1Handler.post,
  options: {
      validate:{
          payload: Part1Validator.post.payload,
      }
  }
});

server.route({
  method: 'GET',
  path: '/' + APP_CONST.PART_2_API_PATH,
  handler: Part2Handler.get,
});


export async function init(){
    if(!hasViewRegistered){
      await registerView(server)
      hasViewRegistered = true
    } 
    await server.initialize();
    return server;
};

export async function start(){
    if(!hasViewRegistered){
      await registerView(server)
      hasViewRegistered = true
    } 
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});