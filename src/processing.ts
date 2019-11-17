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
let startNode: cytoscape.Collection;

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
export function computeKruskal() {}

export function computeDijkstra() {
  const answer = cy
    .elements()
    .dijkstra({
      root: startNode,
      weight: edge => {
        return edge.data('weight');
      },
      directed: true
    })
    .distanceTo(cy.getElementById('3'));
  console.log(answer);
}
