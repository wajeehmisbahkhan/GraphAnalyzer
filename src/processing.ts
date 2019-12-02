import {
  computeNode,
  computeEdge,
  generateCytoscape
} from './helper-functions';

// Init cy
export const mainCy = generateCytoscape(document.getElementById('cy'));

// Needed globally for algorithms such as dijkstra
export let startNode: cytoscape.NodeSingular;

export function process(input: string) {
  // Remove netsim
  input = input.replace('NETSIM', '');
  // Trim sides
  input = input.trim();
  // Input count
  const nodesCount = parseInt(input);
  input = input.replace(nodesCount.toString(), '').trim();
  let numbersArray = input.split('\n');
  // Ensure no empty values
  numbersArray = numbersArray.filter(numbers => numbers.trim() !== '');
  numbersArray.forEach((numbers, index) => {
    // Input nodes
    if (index < nodesCount) {
      computeNode(numbers);
    } // VarY sMarT CheCk
    else if (numbers.length > 3) {
      // Input edges
      computeEdge(numbers);
    } else {
      // Start from here
      const startNodeId = parseInt(numbers).toString();
      startNode = mainCy.getElementById(startNodeId);
    }
  });
}

// Algorithm Computations
export function computeKruskal() {
  let then = new Date();
  mainCy.elements().kruskal(edge => edge[0].data('weight'));
  let now = new Date();
  console.log(now - then);
  return mainCy.elements().kruskal(edge => edge[0].data('weight'));
}

export function computeDijkstra() {
  const distances: Array<{
    destinationNodeId: string;
    distance: number;
  }> = [];
  let then = new Date();
  mainCy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      const distance = mainCy
        .elements()
        .dijkstra({
          root: startNode,
          weight: edge => {
            return edge[0].data('weight');
          },
          directed: false
        })
        .distanceTo(destinationNode);
      distances.push({
        destinationNodeId: destinationNode.id(),
        distance
      });
    }
  });
  let now = new Date();
  console.log(now - then);
  return {
    startNodeId: startNode.id(),
    distances
  };
}

export function computeBellmanFord() {
  const distances: Array<{
    destinationNodeId: string;
    distance: number;
  }> = [];
  let then = new Date();
  mainCy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      const distance = mainCy
        .elements()
        .bellmanFord({
          root: startNode,
          weight: edge => {
            return edge[0].data('weight');
          },
          directed: false
        })
        .distanceTo(destinationNode);
      distances.push({
        destinationNodeId: destinationNode.id(),
        distance
      });
    }
  });
  let now = new Date();
  console.log(now - then);
  return {
    startNodeId: startNode.id(),
    distances
  };
}

export function computeFloydWarshall() {
  let then = new Date();
  const result = mainCy.elements().floydWarshall({
    weight: edge => {
      return edge[0].data('weight');
    },
    directed: false
  });
  let now = new Date();
  console.log(now - then);
  return result;
}

export function computeClusteringCoefficient() {
  return mainCy.elements().closenessCentrality({
    root: startNode
  });
}
