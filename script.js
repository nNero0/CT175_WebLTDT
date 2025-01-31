let VerList = {};
let EdgeList={};


let GraphData;

let Vertices=[];

let VerMatrix=[];

let Ver_Edge=[];

let PrevGraphData="";

let DiffGraphData="";

let isDirected = true;



const addBtn = document.getElementById("ADDNEW");
addBtn.addEventListener('click', ()=>{
  GraphData = document.getElementById("graph-data").value.split(/[\n\s]+/);
  if( PrevGraphData ===""){
    PrevGraphData = GraphData;
  }
  if ( PrevGraphData!="" ){
    DiffGraphData = GraphData.slice( PrevGraphData.length-1,GraphData.length-1);
    PrevGraphData=GraphData;
  }
  console.log(GraphData);
  CountVertices();
  VerMatrix=initMatrix();
  console.log(Vertices);
  AddEdgeToMatrix();
  console.log(VerMatrix);
  addNewDirectedNode();
})
function CountVertices() {
    for (let  i=0; i < GraphData.length;i++) {
      let char=GraphData[i];
      if ( char ===" " || char ==="" ) continue;
        if (Vertices.indexOf(char) === -1) {
            Vertices.push(char);
        }
    }
    if (Ver_Edge.length===0){
      Ver_Edge= Array(Vertices.length+1).fill(0);
    }
    else{
      Ver_Edge.push(0);
    }

}


function initMatrix() {

  return Array.from({ length: Vertices.length+1  }, () => Array(Vertices.length +1).fill(0));
}

function ChangeCharToNum(){
  
}



function AddEdgeToMatrix(){
  let row;
  let col;
  if(DiffGraphData!=""){
    for (let i = 0; i < DiffGraphData.length-1; i++) {
      row= DiffGraphData[i];
      col = DiffGraphData[i+1];
      VerMatrix[row][col]+=1;
      i++;
    }
  }
else{
  for (let i = 0; i < GraphData.length-1; i++) {
    row= GraphData[i];
    col = GraphData[i+1];
    VerMatrix[row][col]+=1;
    i++;
  }
}

  console.log(Vertices);
}


var cy = cytoscape({
  container: document.getElementById("graph"),
  elements: [
  ],

  style: [
    {
      selector: "node",
      style: {
        "background-color": "red",
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
  ],
  layout: {
    name: "grid",
  },

  zoomingEnabled: false,
});

// for (var i = 0; i < 10; i++) {
//     cy.add({
//         data: { id: 'node' + i }
//         }
//     );
//     var source = 'node' + i;
//     cy.add({
//         data: {
//             id: 'edge' + i,
//             source: source,
//             target: (i % 2 == 0 ? 'A' : 'B')
//         }
//     });
// }

cy.layout({
  name: "circle",
}).run();

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
  let first;
  let sec;
  let temp;
  let PosX;
  let PosY;

  for(let i =1;i< VerMatrix.length;i++ ){
    for(let j =1;j< VerMatrix.length;j++){
      if( VerMatrix[i][j]>0){
        temp = VerMatrix[i][j];
        for(let t= 0; t<temp;t++){
          first = i;
          sec = j;
          if (!NodeExist(cy, first)) {
            PosX= getRandomInt(0,200);
            PosY = getRandomInt(0,200);
            cy.add({
              data: { id: first },
              position: {x : PosX,y : PosY},
            });
          }
          if (!NodeExist(cy, sec)) {
            PosX= getRandomInt(0,200);
            PosY = getRandomInt(0,200);
            cy.add({
              data: { id: sec },
              position: {x : PosX,y : PosY},
            });
      
          }
          Ver_Edge[first]++;
          cy.add({
            data: {
              id: `edge${first}-${Ver_Edge[first]}`,
              source: first,
              target: sec,
            },
            classes : isDirected ? 'directed' :''
          });

      } 
  

      }
    }
  }
}

function NodeExist(graph, id) {
  for (const node of graph.nodes()) {
    if (node.id() === id) {
      return true;
    }
  }
  return false;
}

function toggleDirected(){
  isDirected = !isDirected;
  console.log("run");
  cy.edges().forEach(edge => {
    edge.style(
      "target-arrow-shape" , isDirected ? "triangle" : "none"
    );
    
  });
}


const toggleBtn = document.getElementById( "SwitchDirectedUndirected");
toggleBtn.addEventListener('click',()=>{  toggleDirected()} );



// const TypingInterval = 2000;
// let TypingTimer;
// const GraphText = document.getElementById("graph-data");
// GraphText.addEventListener("input",()=>{
//   clearTimeout(TypingTimer);
//   setTimeout( DoneTyping(), TypingInterval);

// });
