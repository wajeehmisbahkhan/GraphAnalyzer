import {
  process,
  computeKruskal,
  computeDijkstra,
  computeBellmanFord,
  computeFloydWarshall,
  mainCy,
  startNode,
  computeClusteringCoefficient
} from './processing';
import { addNode, generateCytoscape, addEdge } from './helper-functions';

const algorithms = [
  'prims',
  'kruskal',
  'dijkstra',
  'bellmanFord',
  'floydWarshall',
  'clusteringCoefficient'
];

// Input
document.getElementById('input').addEventListener('change', handleFileSelect);
// Output
const modalTitle = document.getElementsByClassName('modal-title')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];

// Buttons
algorithms.forEach(algo => {
  document.getElementById(algo).addEventListener('click', handleButtonClick);
});
// File selection
function handleFileSelect(evt) {
  let files = evt.target.files as FileList; // FileList object
  let file = files[0];
  if (file) {
    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (theFile => {
      return function(e) {
        // If nodes and edges exist
        if (mainCy.nodes().length > 0) {
          mainCy.nodes('*').remove();
          mainCy.edges('*').remove();
        }
        // Pass on to processing
        process(e.target.result);
      };
    })(file);
    reader.readAsBinaryString(file);
  }
}

// Button clicked
function handleButtonClick(e: MouseEvent) {
  // Should have nodes
  if (mainCy.nodes().length === 0) return;
  // Set title
  modalTitle.innerHTML = (e.target as HTMLElement).innerText;
  // Clear screen since new computation needed
  modalBody.innerHTML = '';
  const id = e.target['id'];
  if (id === 'kruskal' || id === 'prims') {
    generateCytoscapeElement(computeKruskal());
  } else if (id === 'dijkstra') {
    dijkstraOutput(computeDijkstra());
  } else if (id === 'bellmanFord') {
    dijkstraOutput(computeBellmanFord());
  } else if (id === 'floydWarshall') {
    floydOutput(computeFloydWarshall());
  } else if (id === 'clusteringCoefficient') {
    clusteringCoefficientOutput(computeClusteringCoefficient());
  }
}

function dijkstraOutput(result: {
  startNodeId: string;
  distances: {
    destinationNodeId: string;
    distance: number;
  }[];
}) {
  const startNodeId = result.startNodeId;
  modalBody.innerHTML = `Start Node ID: ${startNodeId}<br />
  Distance To Destination Node<br />`;
  result.distances.forEach(distanceResult => {
    const destinationNodeId = distanceResult.destinationNodeId;
    const distance = distanceResult.distance;
    modalBody.innerHTML += `${destinationNodeId}: ${distance}<br />`;
  });
}

function floydOutput(result: cytoscape.SearchFloydWarshallResult) {
  modalBody.innerHTML = `Start Node ID: ${startNode.id()}<br />
  Distance To Destination Node<br />`;
  mainCy.nodes().forEach(destinationNode => {
    if (startNode.id() !== destinationNode.id()) {
      // Distance
      const distanceDiv = modalBody.appendChild(document.createElement('div'));
      distanceDiv.innerHTML = `${destinationNode.id()}: ${result.distance(
        startNode,
        destinationNode
      )}<br />`;
      // Path
      generateCytoscapeElement(result.path(startNode, destinationNode));
    }
  });
}

function generateCytoscapeElement(collection: cytoscape.CollectionReturnValue) {
  const cytoElement = document.createElement('div');
  cytoElement.classList.add(...['cy', 'modal-cy']);
  modalBody.appendChild(cytoElement);
  // Cytoscape needed to show output
  const modalCy = generateCytoscape(cytoElement);
  collection.nodes().forEach(node => {
    addNode(modalCy, node.id(), node.position());
  });
  collection.edges().forEach(edge => {
    addEdge(
      modalCy,
      edge.id(),
      edge.source().id(),
      edge.target().id(),
      edge.width()
    );
  });
}

function clusteringCoefficientOutput(cc: number) {
  modalBody.innerHTML = `
  Start Node ID: ${startNode.id()}<br />
  Clustering Coefficient: ${cc}`;
}
