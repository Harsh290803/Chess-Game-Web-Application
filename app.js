const gameBoard = document.querySelector("#gameboard");
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
infoDisplay.textContent = "White to move";
let gameOver = false;

function createBoard() {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((i + j) % 2 ? "whiteSquare" : "blackSquare");
      square.setAttribute("square-id", 63 - i * 8 - j);
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
let startPosId = 0,
  endPosId = 0;

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

function dragStart(e) {
  draggedPiece = e.target;
  startPosId = Number(e.target.parentNode.getAttribute("square-id"));
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  e.stopPropagation();
  if (!gameOver) {
    endPosId = Number(
      e.target.getAttribute("square-id") ||
        e.target.parentNode.getAttribute("square-id")
    );

    const currentPlayerPiece = turn === "White" ? "whitePiece" : "blackPiece";
    const correctPlayerMove =
      draggedPiece.firstChild.classList.contains(currentPlayerPiece);
    const pieceCaptured = e.target.classList.contains("piece");

    if (correctPlayerMove) {
      if (
        !checkIfValidMove(e.target) ||
        (pieceCaptured && !checkForOpponentPiece(e.target))
      ) {
        console.log("Invalid Move!");
        return;
      }
      if (pieceCaptured) {
        e.target.parentNode.append(draggedPiece);
        e.target.remove();
      } else {
        e.target.append(draggedPiece);
      }
      console.log("Valid Move!");
      if (checkForWin()) {
        gameOver = true;
        return;
      }
      reverseIds();
      nextTurn();
    }
  }
}

// Chess Rules
function checkIfValidMove(target) {
  // A piece has to move somewhere
  if (startPosId == endPosId) return false;

  const piece = draggedPiece.id;
  console.log(piece, "moves from", startPosId, "to", endPosId);
  switch (piece) {
    // Pawn
    case "pawn":
      // If pawn is at the start row, it can move two squares ahead
      const startRow = [8, 9, 10, 11, 12, 13, 14, 15];
      if (startRow.includes(startPosId)) {
        if (
          endPosId == startPosId + 2 * size &&
          !checkForOpponentPiece(target)
        ) {
          return true;
        }
      }
      // A pawn can always move one square ahead if there's not an opponent piece there
      if (endPosId == startPosId + size && !checkForOpponentPiece(target)) {
        return true;
      }
      // A pawn can capture opponent's piece by moving one square in the diagonal direction
      if (
        (endPosId == startPosId + size - 1 ||
          endPosId == startPosId + size + 1) &&
        checkForOpponentPiece(target)
      ) {
        return true;
      }
      break;
    // Knight
    case "knight":
      // Knight moves two squares in one direction and one square in the perpendicular direction (it is not blocked by other pieces)
      if (
        [size - 2, size + 2, 2 * size - 1, 2 * size + 1].includes(
          Math.abs(endPosId - startPosId)
        )
      ) {
        return true;
      }
      break;
    // Bishop
    case "bishop":
      // Bishop can move any number of vacant squares diagonally
      if ((endPosId - startPosId) % (size - 1) == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size - 1; id < endPosId; id += size - 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size + 1; id > endPosId; id -= size - 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      } else if ((endPosId - startPosId) % (size + 1) == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size + 1; id < endPosId; id += size + 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size - 1; id > endPosId; id -= size + 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      }
      break;
    // Rook
    case "rook":
      if ((endPosId - startPosId) % size == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size; id < endPosId; id += size) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size; id > endPosId; id -= size) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      } else if (
        endPosId >= Math.floor(startPosId / 8) * 8 &&
        endPosId < Math.floor(startPosId / 8) * 8 + 8
      ) {
        if (endPosId > startPosId) {
          for (let id = startPosId + 1; id < endPosId; id++) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - 1; id > endPosId; id--) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      }
      break;
    // Queen
    case "queen":
      // Queen = Bishop + Rook
      if ((endPosId - startPosId) % (size - 1) == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size - 1; id < endPosId; id += size - 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size + 1; id > endPosId; id -= size - 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      } else if ((endPosId - startPosId) % (size + 1) == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size + 1; id < endPosId; id += size + 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size - 1; id > endPosId; id -= size + 1) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      } else if ((endPosId - startPosId) % size == 0) {
        if (endPosId > startPosId) {
          for (let id = startPosId + size; id < endPosId; id += size) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - size; id > endPosId; id -= size) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      } else if (
        endPosId >= Math.floor(startPosId / 8) * 8 &&
        endPosId < Math.floor(startPosId / 8) * 8 + 8
      ) {
        if (endPosId > startPosId) {
          for (let id = startPosId + 1; id < endPosId; id++) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        } else {
          for (let id = startPosId - 1; id > endPosId; id--) {
            if (document.querySelector(`[square-id="${id}"]`).firstChild) {
              return false;
            }
          }
          return true;
        }
      }
      break;
    // King
    case "king":
      if (
        [1, size, size - 1, size + 1].includes(Math.abs(endPosId - startPosId))
      ) {
        return true;
      }
      break;
  }
}

// Check if there's an opponent piece at a given target element
function checkForOpponentPiece(target) {
  const opponentPiece = turn === "White" ? "blackPiece" : "whitePiece";
  return target.firstChild?.classList.contains(opponentPiece);
}

// Find out whose turn is next
function nextTurn() {
  turn = turn === "White" ? "Black" : "White";
  infoDisplay.textContent = `${turn} to move`;
}

// Reverse the square-id's of the board after each move for the chess rules to work
function reverseIds() {
  allSquares.forEach((square) => {
    const id = square.getAttribute("square-id");
    square.setAttribute("square-id", 63 - id);
  });
}

function checkForWin() {
  const kings = document.querySelectorAll("#king");
  console.log(kings.length);
  if (kings.length == 1) {
    let winner = kings[0].firstChild.classList.contains("whitePiece")
      ? "White"
      : "Black";
    infoDisplay.innerHTML = `${winner} wins!`;
    return true;
  }
  return false;
}
