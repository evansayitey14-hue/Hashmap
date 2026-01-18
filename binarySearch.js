class NodeTree {
  constructor(value, key = null) {
    this.value = value
    if (key) {
      this.key = key
    }
    this.left = null
    this.right = null
    this.parent = null
    this.numChild = 1
    this.height = 1
  }

  static prettyPrint (node, prefix = '', isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      NodeTree.prettyPrint(node.right, `${prefix}${isLeft ? '│     ' : '      '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└──── ' : '┌──── '}${node.value}`);
    if (node.left !== null) {
      NodeTree.prettyPrint(node.left, `${prefix}${isLeft ? '      ' : '│     '}`, true);
    }
  }
}

class BSTree {
  constructor(array, orderFn = null, equalFn = null) {
    this.nodeTree = BSTree.constructTreeFromArray(array, orderFn)
    this.orderFn = orderFn ?? ((a, b) => (a > b))
    this.equalFn = equalFn ?? ((a, b) => (a == b))
  }

  static constructTreeFromArray(array, orderFn = null) {
    let sorted;
    if (orderFn) {
      sorted = array.sort(orderFn)
    } else {
      sorted = array.sort()
    }

    return BSTree.constructBST(sorted, 0, sorted.length - 1);
  }

  static constructBST(sortedArray, left, right) {
    if (left === right) {
      return new NodeTree(sortedArray[left])
    }
    const middleIdx = Math.ceil((right - left + 1) / 2) + left - 1
    const middleElem = sortedArray[middleIdx]

    const middleNode = new NodeTree(middleElem)
    if (left <= middleIdx - 1) {
      middleNode.left = BSTree.constructBST(sortedArray, left, middleIdx - 1)
      middleNode.left.parent = {
        node: middleNode,
        direction: "left"
      }
      middleNode.numChild += middleNode.left.numChild
      middleNode.height = Math.max(middleNode.height, 1 + middleNode.left.height)
    }
    if (middleIdx + 1 <= right) {
      middleNode.right = BSTree.constructBST(sortedArray, middleIdx + 1, right)
      middleNode.right.parent = {
        node: middleNode,
        direction: "right"
      }
      middleNode.numChild += middleNode.right.numChild
      middleNode.height = Math.max(middleNode.height, 1 + middleNode.right.height)
    }

    return middleNode
  }

  static updateSizeBubble(node) {
    node.numChild = 1 + (node?.left?.numChild ?? 0) + (node?.right?.numChild ?? 0)
    node.height = 1 + Math.max(node?.left?.height ?? 0, node?.right?.height ?? 0)
    if (node?.parent) {
      BSTree.updateSizeBubble(node.parent.node)
    }
  }

  biggestValue(node) {
    if (node.right) {
      return this.biggestValue(node.right)
    } else {
      return node
    }
  }

  lowestValue(node) {
    if (node.left) {
      return this.lowestValue(node.left)
    } else {
      return node
    }
  }

  predecessor(node) {
    return this.biggestValue(node.left)
  }

  successor(node) {
    return this.lowestValue(node.right)
  }

  insert(value, node = this.nodeTree) {
    if (this.orderFn(value, node.value)) {
      if (node.right) {
        this.insert(value, node.right)
        node.height = (node.left) ? Math.max(node.left.height + 1, node.right.height + 1) : node.right.height + 1
        node.numChild += 1
      } else {
        node.right = new NodeTree(value)
        node.height = (node.left) ? node.height : (node.height + 1)
        node.right.parent = {
          node: node,
          direction: "right"
        }
        node.numChild += 1
      }
    } else {
      if (node.left) {
        this.insert(value, node.left)
        node.height = (node.right) ? Math.max(node.left.height + 1, node.right.height + 1) : node.left.height + 1
        node.numChild += 1
      } else {
        node.left = new NodeTree(value)
        node.height = (node.right) ? node.height : (node.height + 1)
        node.left.parent = {
          node: node,
          direction: "left"
        }
        node.numChild += 1
      }
    }
  }

  delete(value, node = this.nodeTree) {
    if (this.equalFn(value, node.value)) {
      if (node.left && node.right) {
        let nodeToDelete
        if (node.left.height > node.right.height) {
          nodeToDelete = this.predecessor(node)
        } else {
          nodeToDelete = this.successor(node)
        }
        [node.value, nodeToDelete.value] = [nodeToDelete.value, node.value]
        this.delete(nodeToDelete.value, nodeToDelete)
      } else if (node.left || node.right) {
        const nodeMove = node.left || node.right
        const nodeParentDirection = node.parent.direction
        node.parent.node[node.parent.direction] = nodeMove
        nodeMove.parent = node.parent
        BSTree.updateSizeBubble(node)
      } else {
        node.parent.node[node.parent.direction] = null
        BSTree.updateSizeBubble(node)
      }
    } else {
      if (this.orderFn(value, node.value)) {
        if (node.right) {
          this.delete(value, node.right)
        }
      } else {
        if (node.left) {
          this.delete(value, node.left)
        }
      }
    }
  }

  find(value, node = this.nodeTree) {
    if (this.equalFn(value, node.value)) {
      return node
    } else {
      if (this.orderFn(value, node.value)) {
        return this.find(value, node.right)
      } else {
        return this.find(value, node.left)
      }
    }
  }

  levelOrderForEach(callback) {
    const queue = [this.nodeTree]

    while (queue.length !== 0) {
      if (queue[0]?.left) {
        queue.push(queue[0].left)
      }
      if (queue[0]?.right) {
        queue.push(queue[0].right)
      }
      callback(queue[0])
      queue.shift()
    }
  }

  inOrderForEach(callback, node = this.nodeTree) {
    if (node?.left) {
      this.inOrderForEach(callback, node.left)
    }
    callback(node)
    if (node?.right) {
      this.inOrderForEach(callback, node.right)
    }
  }

  preOrderForEach(callback, node = this.nodeTree) {
    callback(node)
    if (node?.left) {
      this.preOrderForEach(callback, node.left)
    }
    if (node?.right) {
      this.preOrderForEach(callback, node.right)
    }
  }

  postOrderForEach(callback, node = this.nodeTree) {
    if (node?.left) {
      this.postOrderForEach(callback, node.left)
    }
    if (node?.right) {
      this.postOrderForEach(callback, node.right)
    }
    callback(node)
  }

  height(value) {
    return (this.find(value)?.height) ?? null
  }

  depth(value) {
    const height = this.height(value)
    if (height) {
      return this.nodeTree.height - height + 1
    }
  }

  isBalanced(node = this.nodeTree) {
    const control = {
      breakFunction: false,
      result: true
    }

    function calculateBalance(myNode) {
      if (control.breakFunction) {
        return;
      }

      const difference = Math.abs(
        (myNode?.left?.height ?? 0) - (myNode?.right?.height ?? 0)
      )

      if (difference > 1) {
        control.result = false;
        control.breakFunction = true
      }
    }

    this.postOrderForEach(calculateBalance, node)
    return control.result
  }

  static recalculateStats(node) {
    node.numChild = 1 + (node?.left?.numChild ?? 0) + (node?.right?.numChild ?? 0)
    node.height = 1 + Math.max(node?.left?.height ?? 0, node?.right?.height ?? 0)
  }

  rebalance() {
    const control = {
      array: []
    }

    function addSorted(node) {
      control.array.push(node.value)
    }

    this.inOrderForEach(addSorted)

    this.nodeTree = BSTree.constructBST(control.array, 0, control.array.length - 1)
  }
}

const newTree = new BSTree([25, 50, 75], (a, b) => (a >= b), (a, b) => (a == b))

for (let i = 0; i < 100; i++) {
  newTree.insert(
    Math.floor(Math.random()*1000)
  )
}

console.log(newTree.isBalanced())
NodeTree.prettyPrint(newTree.nodeTree)
newTree.rebalance()
NodeTree.prettyPrint(newTree.nodeTree)

let controlArrays = {
  pre: [],
  in: [],
  post: []
}

function outputTraversal(traversal) {
  return (node) => {
    controlArrays[traversal].push(node.value)
  }
}
newTree.preOrderForEach(outputTraversal('pre'))
newTree.inOrderForEach(outputTraversal('in'))
newTree.postOrderForEach(outputTraversal('post'))
console.log(controlArrays.pre)
console.log(controlArrays.in)
console.log(controlArrays.post)

for (let i = 0; i < 100; i++) {
  newTree.insert(
    Math.floor(Math.random()*1000)
  )
}

console.log(newTree.isBalanced())
NodeTree.prettyPrint(newTree.nodeTree)
newTree.rebalance()
NodeTree.prettyPrint(newTree.nodeTree)

controlArrays = {
  pre: [],
  in: [],
  post: []
}

newTree.preOrderForEach(outputTraversal('pre'))
newTree.inOrderForEach(outputTraversal('in'))
newTree.postOrderForEach(outputTraversal('post'))
console.log(controlArrays.pre)
console.log(controlArrays.in)
console.log(controlArrays.post)
