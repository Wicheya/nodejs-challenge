function get(request, h){
  return h.view("part1")
}

/**
 *
 *
 * @param {*} request
 * @param {*} h
 * @return {*} rootNodes // node tree has already been composed by <composeNodeTree>
 */
function post(request, h){
  const allNode = createNode(request.payload)
  composeNodeTree(allNode)

  return getRootNodes(allNode)
}

/**
 * iterate through <data> then create dictionary object of _Node class
 *
 * @param {*} data {
 *    "0" : [ { id , title , level , chilren , parent_id }, ... ] ,
 *    "1" : [ { id , title , level , chilren , parent_id }, ... ] ,
 * }
 * @return {*} allNode {
 *    "10" : _Node,
 *    "11" : _Node
 * }
 */
function createNode(data){
  const allNode = {}

  for(let key in data){
    for(let node of data[key]){
        allNode[node.id] = new _Node(node.id, node.title, node.level, node.children, node.parent_id)
    }
  }

  return allNode
}

/**
 * iterate through <nodes> then add child to its parent _Node according to field _Node.parent_id
 *
 * @param {*} nodes {
 *    "10" : _Node,
 *    "11" : _Node
 * }
 * !impure function
 */
function composeNodeTree(nodes){
  for(let node_id in nodes){
    const node = nodes[node_id]
    if(!node.isRoot()) nodes[node.parent_id].addChild(node)
  }
}

/**
 *  iterate through <nodes> then add only root node to <rootNodes> array
 *
 * @param {*} nodes {
 *    "10" : _Node,
 *    "11" : _Node
 * }
 * @return {*} rootNodes [
 *    _Node , _Node , ...
 * ]
 */
function getRootNodes(nodes){
  const rootNodes = []
  for(let node_id in nodes){
    const node = nodes[node_id]
    if(node.isRoot()) rootNodes.push(node)
  }

  return rootNodes
}

export class _Node{
  constructor(id, title, level, children, parent_id){
    this.id = id
    this.title = title
    this.level = level
    this.children = children
    this.parent_id = parent_id
  }

  addChild(node){
    this.children.push(node)
  }

  isRoot(){
    return this.parent_id === null
  }
}


export default {
  get, post,
}