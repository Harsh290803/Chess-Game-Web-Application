const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");

const size = 8;
const startBoard = [
  [rook, knight, bishop, king, queen, bishop, knight, rook],
  [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn],
  [rook, knight, bishop, king, queen, bishop, knight, rook],
];

let turn = "White";
playerDisplay.textContent = "White";

function createBoard() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((i + j) % 2 ? "whiteSquare" : "blackSquare");
      square.setAttribute("square-id", i * 8 + j);
      square.innerHTML = startBoard[i][j];
      if (square.firstChild) {
        square.firstChild.setAttribute("draggable", true);
      }
      gameBoard.append(square);
      if (i <= 1) {
        square.firstChild.firstChild.classList.add("blackPiece");
      } else if (i >= 6) {
        square.firstChild.firstChild.classList.add("whitePiece");
      }
    }
  }
}

createBoard();

const allSquares = document.querySelectorAll(".square");
let draggedPiece = "";
let startPosId = 0;

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

function dragStart(e) {
  draggedPiece = e.target;
  startPosId = e.target.parentNode.getAttribute("square-id");
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  const taken = e.target.classList.contains("piece");

  if (taken) {
    e.target.parentNode.append(draggedPiece);
    e.target.remove();
  } else {
    e.target.append(draggedPiece);
  }
  nextTurn();
}

function nextTurn() {
  turn = turn === "White" ? "Black" : "White";
  playerDisplay.textContent = turn;
}

function flipBoard() {
  // Function to flip the board
}
