/** Code for autograder. DO NOT REMOVE */
try {
  Node = require("./Node.js");
} catch (error) {}
/***************************************/

/** Class representing a Tree. */
class Tree {
  /**
   * Creates a Tree Object
   * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
   * @param {json[]} json - array of json objects with name and parent fields
   */
  constructor(json) {
    this.nodes = [];
    this.root = null;
    json.forEach(jsonData => {
      let curNode = new Node(jsonData.name, jsonData.parent);
      if (jsonData.parent == "root") { // doesn't work if no node with parent "root" exists
        this.root = curNode;
      }
      this.nodes.push(curNode);
    })

    if (this.root == null) {
      throw "No root node found";
    }
  }

  /**
   * Assign other required attributes for the nodes.
   */
  buildTree () {   
    // note: in this function you will assign positions and levels by making calls to assignPosition() and assignLevel()

    // Set rootnode's level to 0
    this.root.parentNode = null; 
    this.root.level = 0; 
    this.curMaxPosition = 0;

    // for each node, fill its children
    // for each of those children, set their parentNode to parent
    this.nodes.forEach(parent => {
      this.nodes.filter(node => 
          node.parentName == parent.name
        ).forEach(child => {
          parent.addChild(child)
          child.parentNode = parent
        })
    });

    this.assignLevel(this.root, 0)
    this.assignPosition(this.root, 0)

    console.log(this.root)
  }

  /**
   * Recursive function that assign levels to each node
   */
  assignLevel (node, level) {
    node.level = level
    node.children.forEach(child => {
      this.assignLevel(child, level + 1)
    })
  }

  /**
   * Recursive function that assign positions to each node
   */
  assignPosition (node, position) {
    node.position = position // assign node's position
    this.curMaxPosition = Math.max(this.curMaxPosition, position) // update current Max position // current max set default to 0

    let curChildPosition = position // assign first child position to same position
    
    node.children.forEach((child) => {
      this.assignPosition(child, curChildPosition) // assign next child position to next available position. 
      curChildPosition = Math.max(this.curMaxPosition+1, curChildPosition+1) // either 1 or curMaxPosition+1
    })
  }

  /**
   * Function that renders the tree
   */
  renderTree () {
    //for each node: draw circle, and then draw lines to each of its children
    console.log("rendering tree")

    let scaleFactor = 110
    let padding = 50
    let svg = d3.select("body")
      .append('svg')
      .attr("width", 1200)
      .attr("height", 1200)

    this.nodes.forEach(node => {
      node.children.forEach(child => { // for every child
        svg.append("line")
        .attr("x1", node.level*scaleFactor + padding)
        .attr("y1", node.position*scaleFactor + padding)
        .attr("x2", child.level*scaleFactor + padding)
        .attr("y2", child.position*scaleFactor + padding)

      })
    })
    this.nodes.forEach(node => {
      let g = svg.append("g").attr("class", "nodeGroup")
      g.append("circle")
          .attr('cx', node.level*scaleFactor + padding)
          .attr('cy', node.position*scaleFactor + padding)
          .attr('r', 40)
      g.append("text")
          .attr("class", "label")
          .attr('x', node.level*scaleFactor + padding)
          .attr('y', node.position*scaleFactor + padding)
          .text(node.name);
    })
  }

}

/** Code for autograder. DO NOT REMOVE */
try {
  module.exports = Tree;
} catch(error) {}
/***************************************/