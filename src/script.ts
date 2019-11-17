import cytoscape from 'cytoscape';

let cy = cytoscape({
  container: document.getElementById('cy'), // container to render in

  style: [
    // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        label: 'data(id)'
      }
    },

    {
      selector: 'edge',
      style: {
        width: 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle'
      }
    }
  ]
});

function handleFileSelect(evt) {
  let files = evt.target.files as FileList; // FileList object
  let file = files[0];
  if (file) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (theFile => {
      return function(e) {
        main(e.target.result);
      };
    })(file);
    reader.readAsBinaryString(file);
  }
}

document.getElementById('input').addEventListener('change', handleFileSelect);

class Coordinates {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class Node {
  coordinates: Coordinates;
  // Each edge leads to another node and has a weight and id (index)
  edges: Array<[Node, number, number]>;

  constructor(coordinates: Coordinates) {
    this.coordinates = coordinates;
    this.edges = [];
  }

  addEdge(index: number, weight: number) {
    const referencedNode = nodes[index];
    this.edges.push([referencedNode, weight, index]);
  }
}

// Data needed
let nodesCount: number,
  nodes: Array<Node> = [],
  startNode: Node;

let main = (text: string) => {
  // Remove netsim
  text = text.replace('NETSIM', '');
  // Trim sides
  text = text.trim();
  takeInputs(text);
  // TODO: Ensure empty
  showGraph();
};

let takeInputs = (input: string) => {
  // Input count
  nodesCount = parseInt(input);
  input = input.replace(nodesCount.toString(), '').trim();
  let numbersArray = input.split('\n');
  // Ensure no empty values
  numbersArray = numbersArray.filter(numbers => numbers.trim() !== '');
  numbersArray.forEach((numbers, index) => {
    // Input nodes
    if (index < nodesCount) {
      // Id
      const id = parseInt(numbers);
      numbers = numbers.replace(id.toString(), '').trim();
      // x
      const x = parseFloat(numbers);
      numbers = numbers.replace(x.toString(), '').trim();
      // y
      const y = parseFloat(numbers);
      numbers = numbers.replace(y.toString(), '').trim();
      // Push to array
      nodes.push(new Node(new Coordinates(x, y)));
    } // VarY sMarT CheCk
    else if (numbers.length > 3) {
      // Edges
      // Talking about this node
      const nodeIndex = parseInt(numbers);
      numbers = numbers.replace(nodeIndex.toString(), '').trim();
      // For each edge
      while (!isNaN(parseInt(numbers))) {
        // Edge leads here
        const edgeIndex = parseInt(numbers);
        numbers = numbers.replace(edgeIndex.toString(), '').trim();
        // Fuzool left number
        numbers = removeFloatFromString(numbers);
        // Actual value - weight of edge
        const weight = parseFloat(numbers);
        numbers = removeFloatFromString(numbers);
        // Fuzool right number
        numbers = removeFloatFromString(numbers);
        // Push to edges
        nodes[nodeIndex].addEdge(edgeIndex, weight);
      }
    } else {
      // Start from here
      startNode = nodes[parseInt(numbers)];
    }
  });
  // Ensure only shortest edge
  nodes.forEach(node => {
    for (let i = 0; i < node.edges.length - 1; i++) {
      let match = false;
      node.edges.slice(i + 1).forEach(edge => {
        edge[2];
      });
    }
  });
};

const removeFloatFromString = (input: string) => {
  // Remove float number
  input = input.replace(parseFloat(input).toString(), '');
  // If any decimals left or zeros
  if (input[0] === '.' || input[0] === '0') {
    // Remove the dot/zero
    input = input.slice(1);
    // Keep removing the digits -- while is a number
    while (!isNaN(parseInt(input[0]))) {
      input = input.slice(1);
    }
  }
  return input.trim();
};

const showGraph = () => {
  // Nodes
  nodes.forEach((node, index) => {
    cy.add({
      group: 'nodes',
      data: {
        id: index.toString()
      },
      position: {
        x: node.coordinates.x * 1000,
        y: node.coordinates.y * 1000
      }
    });
  });
  // Edges
  nodes.forEach((node, i) => {
    console.log(node, node.edges);
    // node.edges.forEach((edge, j) => {
    //   cy.add({
    //     group: 'edges',
    //     data: {
    //       id: `${i}-${j}`,
    //       source: `${i}`,
    //       target: `${j}`
    //     }
    //   });
    // });
  });
};
