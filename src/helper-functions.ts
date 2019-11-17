import { cy } from './processing';

// Cytoscape related
function addNode(id: string, x: number, y: number) {
  cy.add({
    group: 'nodes',
    data: {
      id
    },
    position: {
      x: x * 1000, // For scaling well
      y: y * 1000
    }
  });
}

function addEdge(
  id: string,
  sourceId: string,
  targetId: string,
  weight: number
) {
  // If already an edge exists like this
  const edge = getEdge(id);
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
    // TODO: Remove label
    edge.style('label', edge.data('weight'));
    edge.style('width', edge.data('weight'));
  }
}

function getEdge(id: string) {
  return cy.getElementById(id) as cytoscape.EdgeSingular;
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
  // Add Node
  addNode(id, x, y);
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
    addEdge(`${nodeId}-${edgeId}`, nodeId, edgeId, weight / 10000000);
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
