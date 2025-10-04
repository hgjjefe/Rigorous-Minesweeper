const rows = 15;
const columns = 15;
let mines, remaining, revealed;
let status = document.getElementById('status');
let diplay = document.getElementById('display');
diplay.style = `position:absolute; top:150px; left:50px; height:${rows*30}px; width:${columns*30}px; border: 2px solid black; background-color: lightgrey`;
status.addEventListener('click', init)

let MINE = -1;   // Constant to represent a mine in the board array
 
let board = new Array(rows);
let tile = new Array(rows);
for (let i = 0; i < board.length; i++) {
  board[i] = new Array(columns);
  tile[i] = new Array(columns)
}
 
init();
 // Returns the value of the board at (row, column) or undefined if out of range
function check(row, column) {
  if (column >= 0 && row >= 0 && column < columns && row < rows)
    return board[row][column];
}
// Helper to strip off the extension and path from a file name
function getSpriteName(tile) {
  return tile.src.split('/').pop().split('.')[0];
}
 // Initialize the board
function init() {
  mines = 20;
  remaining = mines;
  revealed = 0;
  status.innerHTML = 'Click on the tiles to reveal them';
  for (let row = 0; row < rows; row++)
    for (let column = 0; column < columns; column++) {
      let index = row * columns + column;
      tile[row][column] = document.createElement('img');
      tile[row][column].draggable = false;
      tile[row][column].src = './images/hidden.png';
      tile[row][column].style = `position:absolute;height:30px; width: 30px; top: ${row*30}px; left: ${column*30}px;`;
      tile[row][column].addEventListener('mousedown', click);
      tile[row][column].id = index;
      display.appendChild(tile[row][column]);
      board[row][column] = 0;
    }
  // Randomly generate mines
  let placed = 0;
  while (placed < mines) {
    let column = Math.floor(Math.random() * columns);
    let row = Math.floor(Math.random() * rows);
 
    if (board[row][column] != MINE) {   // -1 = mine
      board[row][column] = MINE;
      placed++;
    }
  } 
 // 
  for (let column = 0; column < columns; column++)
    for (let row = 0; row < rows; row++) {
      if (check(row, column) != MINE) {
        board[row][column] =
          ((check(row + 1, column) == MINE) | 0) +
          ((check(row + 1, column - 1) == MINE) | 0) +
          ((check(row + 1, column + 1) == MINE) | 0) +
          ((check(row - 1, column) == MINE) | 0) +
          ((check(row - 1, column - 1) == MINE) | 0) +
          ((check(row - 1, column + 1) == MINE) | 0) +
          ((check(row, column - 1) == MINE) | 0) +
          ((check(row, column + 1) == MINE) | 0);
      }
    }
}
 
function click(event) {
  console.log(event);
  let source = event.target;
  let id = source.id;
  let row = Math.floor(id / columns);
  let column = id % columns;
  // right click
  if (event.which == 3) {
    switch (getSpriteName(tile[row][column])) {  // Get the file name without extension (so smart!)
      case 'hidden':
        tile[row][column].src = './images/flag.png';
        console.log(remaining);
        remaining--;
        break;
      case 'flag':
        tile[row][column].src = './images/hidden.png';
        remaining++;
        break;
    }
    event.preventDefault();
  }
  status.innerHTML = 'Mines remaining: ' + remaining;
 // Left click
  if (event.which == 1 && getSpriteName(tile[row][column]) != 'flag') {
    if (board[row][column] == MINE) {   // Clicked on a mine
      for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
          if (board[row][column] == MINE) {   // Clicked on a mine
            tile[row][column].src = './images/mine.png';
          }
          if (board[row][column] != MINE && getSpriteName(tile[row][column]) == 'flag') {
            tile[row][column].src = './images/misplaced.png';
          }
        }
    tile[row][column].src = './images/red_mine.png';
    status.innerHTML = 'GAME OVER<br><br>Click here to restart';
    } else
    if (getSpriteName(tile[row][column])   == 'hidden') reveal(row, column);
  }
 
  if (revealed == rows * columns - mines)
    status.innerHTML = 'YOU WIN!<br><br>Click here to restart';
}
 // Reveal the tile if it is not a mine
function reveal(row, column) {
  if (column < 0 || row < 0 || column >= columns || row >= rows) return; // Out of bounds
  if (getSpriteName(tile[row][column]) != 'hidden') return; // Already revealed or flagged
  tile[row][column].src = './images/' + board[row][column] + '.png';
  if (board[row][column] != MINE && getSpriteName(tile[row][column]) == 'hidden')
    revealed++;
 // If the tile is a 0, recursively reveal its neighbors
  if (board[row][column] == 0) {
    reveal(row, column - 1);
    reveal(row, +column + 1);
    reveal(+row + 1, column);
    reveal(row - 1, column);
    reveal(row - 1, column - 1);
    reveal(+row + 1, column - 1);
    reveal(+row + 1, +column + 1);
    reveal(row - 1, +column + 1);
  }
}