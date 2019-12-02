import cytoscape from 'cytoscape';
import { mainCy } from './processing';

// Cytoscape related
export function generateCytoscape(element: HTMLElement) {
  return cytoscape({
    container: element, // container to render in

    style: [
      // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          content: 'data(id)'
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
}

export function addNode(
  cy: cytoscape.Core,
  id: string,
  position?: { x: number; y: number }
) {
  cy.add({
    group: 'nodes',
    data: {
      id
    },
    position
  });
}

export function addEdge(
  cy: cytoscape.Core,
  id: string,
  sourceId: string,
  targetId: string,
  weight: number
) {
  // If already an edge exists like this
  const edge = cy.getElementById(id) as cytoscape.EdgeSingular;
  if (edge.isEdge()) {
    // Replace if weight is lower
    if (edge.data('weight') > weight) {
      edge.data('weight', weight);
    }
  } else {
    // Add a new edge
    const edge = cy.add({
      group: 'edges',
      data: {
        id,
        weight,
        source: sourceId,
        target: targetId
      }
    });
    edge.style('width', edge.data('weight'));
  }
}

// Input related
export function computeNode(input: string) {
  // Id
  const id = parseInt(input).toString();
  input = input.replace(id, '').trim();
  // x
  const x = parseFloat(input);
  input = input.replace(x.toString(), '').trim();
  // y
  const y = parseFloat(input);
  input = input.replace(y.toString(), '').trim();
  // Scaling
  const nodesCount = mainCy.nodes().length;
  const scale = 1000 + (nodesCount - 10) * nodesCount;
  // nodesCount >= 10 && nodesCount < 40 ? 1000 : nodesCount < 70 ? 1500 : 2000;
  // Add Node
  addNode(mainCy, id, { x: x * scale, y: y * scale });
}

export function computeEdge(input: string) {
  // Talking about this node
  const nodeId = parseInt(input).toString();
  input = input.replace(nodeId, '').trim();
  // For each edge
  while (!isNaN(parseInt(input))) {
    // Edge leads here
    const edgeId = parseInt(input).toString();
    input = input.replace(edgeId, '').trim();
    // Fuzool left number
    input = removeFloatFromString(input);
    // Actual value - weight of edge
    const weight = parseFloat(input);
    input = removeFloatFromString(input);
    // Fuzool right number
    input = removeFloatFromString(input);
    // Push to edges
    addEdge(mainCy, `${nodeId}-${edgeId}`, nodeId, edgeId, weight / 10000000);
  }
}

export const removeFloatFromString = (input: string) => {
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
