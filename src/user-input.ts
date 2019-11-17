import {
  process,
  computeKruskal,
  computeDijkstra,
  computeBellmanFord,
  computeFloydWarshall
} from './processing';

const algorithms = ['kruskal', 'dijkstra', 'bellmanFord', 'floydWarshall'];

// File
document.getElementById('input').addEventListener('change', handleFileSelect);

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
        // Pass on to processing
        process(e.target.result);
      };
    })(file);
    reader.readAsBinaryString(file);
  }
}

// Button clicked
function handleButtonClick(e: MouseEvent) {
  const id = e.target['id'];
  if (id === 'kruskal') {
    computeKruskal();
  } else if (id === 'dijkstra') {
    computeDijkstra();
  } else if (id === 'bellmanFord') {
    computeBellmanFord();
  } else if (id === 'floydWarshall') {
    computeFloydWarshall();
  }
}
