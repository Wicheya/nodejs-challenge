function get(request, h){
  return h.view("part1")
}

function post(request, h){
  const allNode = createNode(request.payload)
  composeNodeTree(allNode)

  return getRootNodes(allNode)
}

function createNode(data){
  const allNode = {}

  for(let key in data){
    for(let node of data[key]){
        allNode[node.id] = new _Node(node.id, node.title, node.level, node.children, node.parent_id)
    }
  }

  return allNode
}

function composeNodeTree(nodes){
  for(let node_id in nodes){
    const node = nodes[node_id]
    if(!node.isRoot()) nodes[node.parent_id].addChild(node)
  }
}

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