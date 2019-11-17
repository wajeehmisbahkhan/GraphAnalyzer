import cytoscape from 'cytoscape';
import { computeNode, computeEdge } from './helper-functions';

// Init cy
export const cy = cytoscape({
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

// Needed globally for algorithms such as dijkstra
let startNode: cytoscape.Singular;

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
      startNode = cy.getElementById(startNodeId);
    }
  });
}

// Algorithm Computations
export function computeKruskal() {
  console.log(cy.elements().kruskal(edge => edge[0].data('weight')));
}

export function computeDijkstra() {
  cy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      const distance = cy
        .elements()
        .dijkstra({
          root: startNode,
          weight: edge => {
            return edge[0].data('weight');
          },
          directed: false
        })
        .distanceTo(destinationNode);
      console.log(`${startNode.id()}-${destinationNode.id()}: ${distance}`);
    }
  });
}

export function computeBellmanFord() {
  cy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      const distance = cy
        .elements()
        .bellmanFord({
          root: startNode,
          weight: edge => {
            return edge[0].data('weight');
          },
          directed: false
        })
        .distanceTo(destinationNode);
      console.log(`${startNode.id()}-${destinationNode.id()}: ${distance}`);
    }
  });
}

export function computeFloydWarshall() {
  const result = cy.elements().floydWarshall({
    weight: edge => {
      return edge[0].data('weight');
    },
    directed: false
  });
  cy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      console.log(`Shortest path: ${result.path(startNode, destinationNode)}`);
      console.log(
        `Shortest distance: ${result.distance(startNode, destinationNode)}`
      );
    }
  });
}
