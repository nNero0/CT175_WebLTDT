// Tự động add danh sách đỉnh kề và ấn nút add để tạo đồ thị
const filePath = "Testing.txt";
fetch(filePath)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.text();
  })
  .then((data) => {
    document.getElementById("graph-data").textContent = data;
    document;
  })
  .catch((error) => {
    console.error("Error reading the file:", error);
  });



let VerList = {};
let EdgeList = {};

let GraphData;

let Mark = new Array(100).fill(0);

let Vertices = [];

let VerMatrix = [];
let WeightMatrix = [];

let Ver_Edge = [];

let PrevGraphData = "";

let DiffGraphData = "";

let isDirected = true;

let rdnclr = getRandomColor();

const addBtn = document.getElementById("ADDNEW");
addBtn.addEventListener("click", () => {
  GraphData = document.getElementById("graph-data").value.split(/[\n\s]+/);
  if (PrevGraphData === "") {
    PrevGraphData = GraphData;
  }
  if (PrevGraphData != "") {
    DiffGraphData = GraphData.slice(
      PrevGraphData.length - 1,
      GraphData.length - 1
    );
    PrevGraphData = GraphData;
  }
  console.log(GraphData);
  CountVertices();
  VerMatrix = initMatrix();

  AddEdgeToMatrix();

  addNewDirectedNode();

  console.log(Vertices);
});

const addWeightedBtn = document.getElementById("ADDNEWWEIGHTED");
addWeightedBtn.addEventListener("click", () => {
  GraphData = document.getElementById("graph-data").value.split(/[\n\s]+/);
  if (PrevGraphData === "") {
    PrevGraphData = GraphData;
  }
  if (PrevGraphData != "") {
    DiffGraphData = GraphData.slice(
      PrevGraphData.length - 1,
      GraphData.length - 1
    );
    PrevGraphData = GraphData;
  }
  console.log(GraphData);
  CountVertices();
  VerMatrix = initMatrix();
  WeightMatrix = initMatrix();
  AddWeightedEdgeToMatrix();

  addNewWeightedNode();

  console.log(
    "Nodes:",
    cy.nodes().map((n) => n.id())
  );
  console.log(
    "Edges:",
    cy
      .edges()
      .map(
        (e) =>
          `${e.source().id()} -> ${e.target().id()} (weight: ${e.data(
            "weight"
          )})`
      )
  );

  cy.edges().forEach((edge) => {
    if (isNaN(edge.data("weight"))) {
      console.error(
        `Edge ${edge.id()} has an invalid weight:`,
        edge.data("weight")
      );
    }
  });
});

function addNewWeightedNode() {
  // []: Defines a character class.
  // \r: Matches a carriage return.
  // \n: Matches a newline (line feed).
  // \s: Matches any whitespace character (spaces, tabs, newlines).
  // +: Matches one or more of the preceding elements.
  cy.remove('*');
  let first;
  let sec;
  let temp;
  let w;

  for (let i = 1; i < VerMatrix.length; i++) {
    for (let j = 1; j < VerMatrix.length; j++) {
      if (VerMatrix[i][j] > 0) {
        temp = VerMatrix[i][j];
        for (let t = 0; t < temp; t++) {
          first = i;
          sec = j;
          w = WeightMatrix[i][j];

          if (!NodeExist(cy, first)) {
            cy.add({
              data: { id: first },
            });
          }
          if (!NodeExist(cy, sec)) {
            cy.add({
              data: { id: sec },
            });
          }
          Ver_Edge[first]++;
          cy.add({
            data: {
              id: `edge${first}-${Ver_Edge[first]}`,
              source: first,
              target: sec,
              weight: parseInt(w),
            },
            classes: isDirected ? "directed" : "",
          });
          cy.style()
            .selector("edge")
            .style({
              label: "data(weight)", // Display the weight as a label
              "text-margin-y": 10, // Adjust label position
              "text-rotation": "none", // Rotate label with edge
            })
            .update();

          cy.style()
            .selector("node")
            .style({
              "text-margin-y": 25,
              "border-width": 4,
              "border-style": "solid",
              "background-opacity": 0,
            })
            .update();
        }
      }
    }
  }
  cy.layout({
    name: "circle",
  }).run();
}

function CountVertices() {
  for (let i = 0; i < GraphData.length; i++) {
    let char = GraphData[i];
    if (char === " " || char === "") continue;
    if (Vertices.indexOf(char) === -1) {
      Vertices.push(char);
    }
  }
  if (Ver_Edge.length === 0) {
    Ver_Edge = Array(Vertices.length + 1).fill(0);
  } else {
    Ver_Edge.push(0);
  }
}

function initMatrix() {
  return Array.from({ length: Vertices.length + 1 }, () =>
    Array(Vertices.length + 1).fill(0)
  );
}


function AddEdgeToMatrix() {
  let row;
  let col;
  if (DiffGraphData != "") {
    for (let i = 0; i < DiffGraphData.length - 1; i++) {
      row = DiffGraphData[i];
      col = DiffGraphData[i + 1];
      VerMatrix[row][col] += 1;
      i++;
    }
  } else {
    for (let i = 0; i < GraphData.length - 1; i++) {
      row = GraphData[i];
      col = GraphData[i + 1];
      VerMatrix[row][col] += 1;
      i++;
    }
  }
}

function AddWeightedEdgeToMatrix() {
  let row;
  let col;
  if (DiffGraphData != "") {
    for (let i = 0; i < DiffGraphData.length - 1; i++) {
      row = DiffGraphData[i];
      col = DiffGraphData[i + 1];
      WeightMatrix[row][col] = DiffGraphData[i + 2];
      VerMatrix[row][col] += 1;
      i += 2;
    }
  } else {
    for (let i = 0; i < GraphData.length - 1; i++) {
      row = GraphData[i];
      col = GraphData[i + 1];
      WeightMatrix[row][col] = GraphData[i + 2];
      VerMatrix[row][col] += 1;
      i += 2;
    }
  }
}

var cy = cytoscape({
  container: document.getElementById("graph"),
  elements: [],

  style: [
    {
      selector: "node",
      style: {
        "background-color": "gray",
        label: "data(id)",
      },
    },
    {
      selector: "edge",
      style: {
        "curve-style": "bezier",
        "target-arrow-shape": isDirected ? "triangle" : "none",
      },
    },
    {
      selector: ".highlighted",
      style: {
        "background-color": `${rdnclr}`,
        "line-color": "#61bffc",
        "target-arrow-color": "#61bffc",
        "transition-property":
          "background-color, line-color, target-arrow-color",
        "transition-duration": "0.5s",
        "background-opacity": 1,
      },
    },
  ],
  layout: {
    name: "circle",
  },

  zoomingEnabled: false,
});

const textareas = document.getElementsByTagName("textarea");
for (let i = 0; i < textareas.length; i++) {
  textareas[i].addEventListener("focus", () => {
    setTimeout(() => {
      textareas[i].setSelectionRange(0, 0);
    }, 0);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
} // Example: random number between 1 and 9

function addNewDirectedNode() {
  // []: Defines a character class.
  // \r: Matches a carriage return.
  // \n: Matches a newline (line feed).
  // \s: Matches any whitespace character (spaces, tabs, newlines).
  // +: Matches one or more of the preceding elements.
  cy.remove('*');
  let first;
  let sec;
  let temp;
  let PosX;
  let PosY;

  for (let i = 1; i < VerMatrix.length; i++) {
    for (let j = 1; j < VerMatrix.length; j++) {
      if (VerMatrix[i][j] > 0) {
        temp = VerMatrix[i][j];
        for (let t = 0; t < temp; t++) {
          first = i;
          sec = j;
          if (!NodeExist(cy, first)) {
            PosX = getRandomInt(0, 200);
            PosY = getRandomInt(0, 200);
            cy.add({
              data: { id: first },
              position: { x: PosX, y: PosY },
            });
          }
          if (!NodeExist(cy, sec)) {
            PosX = getRandomInt(0, 200);
            PosY = getRandomInt(0, 200);
            cy.add({
              data: { id: sec },
              // position: { x: PosX, y: PosY },
            });
          }
          Ver_Edge[first]++;
          cy.add({
            data: {
              id: `edge${first}-${Ver_Edge[first]}`,
              source: first,
              target: sec,
            },
            classes: isDirected ? "directed" : "",
          });
          cy.style()
            .selector("node")
            .style({
              "text-margin-y": 25,
              "border-width": 4,
              "border-style": "solid",
              "background-opacity": 0,
            })
            .update();
        }
      }
    }
  }
  cy.layout({
    name: "circle",
  }).run();
}

function NodeExist(graph, id) {
  for (const node of graph.nodes()) {
    if (node.id() === id) {
      return true;
    }
  }
  return false;
}

function toggleDirected() {
  isDirected = !isDirected;

  cy.edges().forEach((edge) => {
    edge.style("target-arrow-shape", isDirected ? "triangle" : "none");
  });
}

function CountNodes() {
  GraphData = document.getElementById("graph-data").value.split(/[\n\s]+/);
  let NodeArea = document.getElementById("node_cnt");
  let cnt = 0;
  cnt = Vertices.length;
  NodeArea.innerHTML = cnt;
}

const toggleBtn = document.getElementById("SwitchDirectedUndirected");
toggleBtn.addEventListener("click", () => {
  toggleDirected();
});

function checkMark() {
  for (let i in Vertices) {
    if (Mark[i] != 1) {
    }
  }
}

// Initialize a 2D array with dimensions 100x100
let PathToColor = new Array(50);

// Fill the array with sub-arrays
for (let i = 0; i < PathToColor.length; i++) {
  PathToColor[i] = new Array().fill(0);
}

// function BFS(start) {

//   console.log(isDirected);
//   var bfs = cy.elements().bfs({
//     roots: `#${start}`, // starting from node with ID '#e'
//     visit: function (v, e, u, i, depth) {
//       if (Mark[v.id()] === 0) {
//         console.log("Visited node " + v.id());
//         Mark[v.id()] = 1;
//         PathToColor[start].push(v.id());
//       }
//     },
//     directed: isDirected,
//   });
//   console.log(bfs.path);
//   var x = 0;
//   var highlightNextEle = function(){
//     setTimeout(()=>{},1000);
//     if( x < bfs.path.length ){
//       bfs.path[x].addClass('highlighted');

//       x++;
//       setTimeout(highlightNextEle, 1000);
//     }
//   };
//   highlightNextEle();

// }
// document.getElementById("BFS").addEventListener("click", () => {

//   for (let i in Vertices) {
//     if (Mark[i] != 1) {
//       setTimeout(BFS(i),1000);

//     }
//   }
//   //AddColor();
// });

function BFS(start, callback) {
  const res = document.getElementById("result");
  var bfs = cy.elements().bfs({
    roots: `#${start}`, // starting from node with ID '#e'
    visit: function (v, e, u, i, depth) {
      if (Mark[v.id()] === 0) {
        console.log("Visited node " + v.id());
        const p = document.createElement("p");
        p.textContent = `Visited node ${v.id()}`; 
        res.appendChild(p);
 

        Mark[v.id()] = 1;
      }
    },
    directed: isDirected,
  });

  var x = 0;
  var highlightNextEle = function () {
    if (x < bfs.path.length) {
      setTimeout(() => {
        bfs.path[x].addClass("highlighted");
        x++;
        highlightNextEle();
      }, 1000);
    } else if (callback) {
      // Call the callback function after finishing the BFS
      callback();
    }
  };
  highlightNextEle();
}


document.getElementById("BFS").addEventListener("click", () => {
  let unmarkedVertices = Object.keys(Vertices).filter((i) => Mark[i] != 1);
  //  ARray
  let processNext = () => {
    if (unmarkedVertices.length > 0) {
      let vertex = unmarkedVertices.shift();
      BFS(vertex, processNext);
    }
  };
  processNext();
});

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function DFS(start, callback) { 
  const res = document.getElementById("result");

  var dfs = cy.elements().dfs({
    roots: `#${start}`, // starting from node with ID '#e'
    visit: function (v, e, u, i, depth) {
      if (Mark[v.id()] === 0) {
        console.log("Visited node " + v.id());
        const p = document.createElement("p");
        p.textContent = `Visited node ${v.id()}`; 
        res.appendChild(p);
 


        Mark[v.id()] = 1;
        PathToColor[start].push(v.id());
      }
    },
    directed: isDirected,
  });

  var x = 0;
  var highlightNextEle = function () {
    if (x < dfs.path.length) {
      setTimeout(() => {
        dfs.path[x].addClass("highlighted");
        x++;
        highlightNextEle();
      }, 1000);
    } else if (callback) {
      // Call the callback function after finishing the BFS
      callback();
    }
  };
  highlightNextEle();
}

document.getElementById("DFS").addEventListener("click", () => {
  let unmarkedVertices = Object.keys(Vertices).filter((i) => Mark[i] != 1);
  //  ARray
  let processNext = () => {
    if (unmarkedVertices.length > 0) {
      let vertex = unmarkedVertices.shift();
      DFS(vertex, processNext);
    }
  };
  processNext();
});

function TarjanSCC(callback) {
  var tsc = cy.elements().tarjanStronglyConnected();
  let componentIndex = 0; 
  function highlightNextComponent() {
    if (componentIndex < tsc.components.length) {
      let component = tsc.components[componentIndex];
      let elementIndex = 0;
      function highlightNextElement() {
        if (elementIndex < component.length) {
          setTimeout(() => {
            rdnclr = getRandomColor();
            component[elementIndex].addClass("highlighted");
            console.log(elementIndex);
            elementIndex++;
            highlightNextElement();
          }, 1000);
        } else {
       
          setTimeout(() => {
            componentIndex++;
            highlightNextComponent();
          }, 2000);
        }
      }

      highlightNextElement();
    } else if (callback) {
  
      callback();
    }
  }

 
  highlightNextComponent();
  const res = document.getElementById("result");
  console.log("Strongly Connected Components:");
  tsc.components.forEach((component, index) => {
    console.log(`Component ${index + 1}:`);
    const p = document.createElement("p");
    p.textContent=`Component ${index + 1}:`;
    res.appendChild(p);

    component.filter(ele => ele.isNode()).forEach(node => {
      
      console.log(` - Node: ${node.id()}`); 
      const p = document.createElement("p");
      p.textContent=` - Node: ${node.id()}`;
      res.appendChild(p);// Print each node in the component
    });
  });
}

document.getElementById("TarjanSCC").addEventListener("click", () => {

  Object.keys(Vertices).forEach((v) => (Mark[v] = 0));


  TarjanSCC(() => {
    console.log("Tarjan SCC visualization complete");
  });
});


document.getElementById("DIJKSTRA").addEventListener("click", () => {
  var startNodeId = document.getElementById("DijkstraStart").value;
  var endNodeId = document.getElementById("DijkstraEnd").value;

  var startNode = cy.$(`#${startNodeId}`);
  var endNode = cy.$(`#${endNodeId}`);
  console.log( startNode.id());
  console.log(endNode.id());
  if (startNode.length === 0 || endNode.length === 0) {
    console.error("Start or end node not found in the graph!");
    return;
  }
  var weightFunction = function (edge) {
    return edge.data("weight");
  };
  var options = {
    directed: isDirected,
  };
  const dijkstra = cy.elements().dijkstra(startNode, (edge) => {
    return edge.data('weight');
  }, isDirected);

  var path = dijkstra.pathTo(endNode);
  var distance = dijkstra.distanceTo(endNode);

  if (path.length === 0) {
    console.log("No path found from", startNodeId, "to", endNodeId);
    return;
  }

  console.log("Shortest path:", path.map(ele => ele.id()));
  console.log("Distance:", distance);

  // Highlight the path
  highlightPath(path);

  
const res = document.getElementById("result");
res.textContent= `Khoảng cách từ ${startNodeId} đến ${endNodeId} = ${distance}`;
const p= document.createElement("p");
p.textContent="Con đường đã đi là"; 
res.appendChild(p);
for( let i =0 ; i < path.length ; i++){
  const p = document.createElement("p");
  p.textContent=path[i].id();
  res.appendChild(p);
i++;
};
});


function highlightPath(path) {
  let index = 0;
  function highlightNext() {
    if (index < path.length) {
      path[index].addClass("highlighted");
      index++;
      setTimeout(highlightNext, 1000); // Delay between highlights
    }
  }
  highlightNext();
}

// const TypingInterval = 2000;
// let TypingTimer;
// const GraphText = document.getElementById("graph-data");
// GraphText.addEventListener("input",()=>{
//   clearTimeout(TypingTimer);
//   setTimeout( DoneTyping(), TypingInterval);

// });
