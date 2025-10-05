
let rows = 15;
let columns = 15;
let mines = 20;
let layout = `x...*..*..**
.......***..
......*.....
....*.*..*..
.*.*........
....**..*..*
.......*.**.
........*...
.**.*..*...*
**..........
........*..*
...**......*`;
let use_layout = true;  // Set to false to use random layout
layout = layout.split('\n').map(line => line.trim());

let remaining_mines, hidden_numbers;
let status = document.getElementById('status');
let debug = document.getElementById('debug');
let diplay = document.getElementById('display');
diplay.style = `position:absolute; top:150px; left:50px; height:${rows*30}px; width:${columns*30}px; border: 2px solid black; background-color: lightgrey`;
status.addEventListener('click', init)

let MINE = -1;   // Constant to represent a mine in the board array
let NUMBERS = [null, '1', '2', '3', '4', '5', '6', '7', '8'];
let first_clicked = false;
let proof_mode = false;
 
let board = new Array(rows);  // Integer array to represent the board
let tile = new Array(rows);   // Image array to represent the tiles
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
// Helper to set the image of a tile
function setTile(row, column, sprite) {
  tile[row][column].src = './images/' + sprite + '.png';
}
// Get the valid neighbors of a tile
function getNeighbors(row, column) {
  let neighbors = [];
  for (let r = row - 1; r <= row + 1; r++)
    for (let c = column - 1; c <= column + 1; c++)
      if (r >= 0 && r < rows && c >= 0 && c < columns && (r != row || c != column))
        neighbors.push([r, c]);
  return neighbors;

}

function exitProofMode(contradiction = false) {
  proof_mode = false;
  for (let row = 0; row < rows; row++){
    for (let column = 0; column < columns; column++){
      if (getSpriteName(tile[row][column]) == 'blue_flag'){
        if (contradiction)
          reveal(row, column);  // Reveal the blue flag tile if contradiction found
        else
          setTile(row, column, 'hidden');
      }else if (getSpriteName(tile[row][column]) == 'yellow_flag')
        setTile(row, column, 'hidden');
      else if (getSpriteName(tile[row][column]) == 'mist')
        setTile(row, column, 'hidden');
    }
  }
}


 // Initialize the board
function init(event) {
  console.log('use_layout: ' + use_layout);
  first_clicked = false;
  hidden_numbers = 0;
  debug.innerHTML = '';
  remaining_mines = mines;
  status.innerHTML = 'Click on the tiles to reveal them';
  if (use_layout){   // Adjust rows and columns based on layout
    rows = layout.length;
    columns = layout[0].length;
    diplay.style = `position:absolute; top:150px; left:50px; height:${rows*30}px; width:${columns*30}px; border: 2px solid black; background-color: lightgrey`;
  }
  // Initialize tiles
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
  if (!use_layout) {
    let placed = 0;
    while (placed < mines) {
      let column = Math.floor(Math.random() * columns);
      let row = Math.floor(Math.random() * rows);
  
      if (board[row][column] != MINE) {   
        board[row][column] = MINE;
        placed++;
      }
    } 
  }else {  // Use predefined layout
    mines = 0;  // Reset mine count
    for (let row = 0; row < rows; row++){
      for (let column = 0; column < columns; column++){
        if (layout[row][column] != undefined && layout[row][column] == '*'){
          board[row][column] = MINE;
          mines += 1;  // Increment mine count for the initial mine
        }else if (layout[row][column] != undefined && layout[row][column] == 'x'){
          setTile(row, column, 'safe');
        }
      }
    }
  }
  
 // Generate numbers
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
        if (board[row][column] > 0)
          hidden_numbers++;
      }
    }
  // Generate first click position
  if (!use_layout){
    let first_click_row = Math.floor(Math.random() * rows);
    let first_click_column = Math.floor(Math.random() * columns);
    // Ensure first click is not a mine and reveal it
    while (check(first_click_row, first_click_column) != 0) {
      first_click_row = Math.floor(Math.random() * rows);
      first_click_column = Math.floor(Math.random() * columns);
    }
    setTile(first_click_row, first_click_column, 'safe');
  }
}
 
function click(event) {
  let source = event.target;
  let id = source.id;
  let row = Math.floor(id / columns);
  let column = id % columns;
  if (event.which == 1 && getSpriteName(tile[row][column])   == 'safe') {
    reveal(row, column);   
    first_clicked = true;  // First safe tile clicked
    status.innerHTML = 'Mines remaining: ' + remaining_mines + ', Hidden numbers: ' + hidden_numbers;
    return;
  }
  if (!first_clicked) return;  // Ignore all clicks until the first safe tile is clicked
  // ======= RIGHT CLICK (Normal mode) =======
  if (event.which == 3 && !proof_mode) {
    // right click on numbers
    if (NUMBERS.includes(getSpriteName(tile[row][column])) ) {  // Get the file name without extension (so smart!)
      let number = parseInt(getSpriteName(tile[row][column]));
      // Count the number of hidden tiles around the number
      let hidden = 0;
      let flags = 0;
      for (let [i, j] of getNeighbors(row, column)) {
        if (getSpriteName(tile[i][j]) == 'hidden') hidden++;
        if (getSpriteName(tile[i][j]) == 'flag') flags++;
      }
      // If hidden + flags = number, flag all hidden tiles
      if (hidden + flags == number) {
        for (let [i, j] of getNeighbors(row, column)){
          if (getSpriteName(tile[i][j]) == 'hidden'){
            setTile(i, j, 'flag');
            remaining_mines -= 1;
          }
        }
      }
      debug.innerHTML = "Number:" + number + ', Hiddens: ' + hidden + ', Flags: ' + flags;
    } else if (getSpriteName(tile[row][column]) == 'hidden' && proof_mode == false) { // right click on hidden tiles
      setTile(row, column, 'blue_flag');   // Hypothetical flag
      proof_mode = true;   // Enter proof mode
    } 
    event.preventDefault();
  }
  // ======= RIGHT CLICK (proof mode) =======
  else if (event.which == 3 && proof_mode) {
    if (getSpriteName(tile[row][column]) == 'blue_flag') { // right click on hypothetical flags -> exit proof mode
      exitProofMode();
    }else if (NUMBERS.includes(getSpriteName(tile[row][column])) ){ // right click on numbers
      let number = parseInt(getSpriteName(tile[row][column]));
      // Count the number of hidden tiles around the number
      let hidden = 0;
      let flags = 0;
      for (let [i, j] of getNeighbors(row, column)) {
        if (getSpriteName(tile[i][j]) == 'hidden') hidden++;
        if (getSpriteName(tile[i][j]) == 'flag' || getSpriteName(tile[i][j]) == 'blue_flag') flags++;
      }
      // If hidden + flags = number, flag all hidden tiles
      if (hidden + flags == number) {
        for (let [i, j] of getNeighbors(row, column)){
          if (getSpriteName(tile[i][j]) == 'hidden'){
            setTile(i, j, 'yellow_flag');    // Flag used in proof mode
            remaining_mines -= 1;
          }
        }
      }
    }
    event.preventDefault();
  }
 // ======== LEFT CLICK (Normal mode) =========
  if (event.which == 1 && !proof_mode && getSpriteName(tile[row][column]) != 'flag') {
    // left click on numbers
    if (NUMBERS.includes(getSpriteName(tile[row][column])) ) { // left click on numbers
      let number = parseInt(getSpriteName(tile[row][column]));
      // Count the number of flags around the number
      let flags = 0;
      for (let [i, j] of getNeighbors(row, column)) {
        if (getSpriteName(tile[i][j]) == 'flag') flags++;
      }
      // If flags == number, reveal all neighboring hidden tiles
      if (flags == number) {
        for (let [i, j] of getNeighbors(row, column))
          if (getSpriteName(tile[i][j]) == 'hidden') reveal(i, j);
      }
    }
  }
  
// ======== LEFT CLICK (proof mode) =========
if (event.which == 1 && proof_mode) {
  // left click on numbers
    if (NUMBERS.includes(getSpriteName(tile[row][column])) ) { // left click on numbers
      let number = parseInt(getSpriteName(tile[row][column]));
      // Count the number of flags and blue flags around the number
      let flags = 0;
      let blue_flags = 0;
      let yellow_flags = 0;
      let hiddens = 0;
      for (let [i, j] of getNeighbors(row, column)) {
        if (getSpriteName(tile[i][j]) == 'flag') flags++;
        if (getSpriteName(tile[i][j]) == 'blue_flag') blue_flags++;
        if (getSpriteName(tile[i][j]) == 'yellow_flag') yellow_flags++;
        if (getSpriteName(tile[i][j]) == 'hidden') hiddens++;
      }
      // If flags + blue_flags == number, turn all neighboring hidden tiles into mist (denote unknown numbers)
      if (flags + blue_flags + yellow_flags == number) {
        for (let [i, j] of getNeighbors(row, column))
          if (getSpriteName(tile[i][j]) == 'hidden') setTile(i, j, 'mist');
      }else if (flags + blue_flags + hiddens + yellow_flags < number){ // Contradiction found
        exitProofMode(contradiction = true);
      }
    }
    
}

  status.innerHTML = 'Mines remaining: ' + remaining_mines + ', Hidden numbers: ' + hidden_numbers;
  // Win
  if (hidden_numbers == 0){
    status.innerHTML = 'YOU WIN!<br><br>Click here to restart';
    // Flag all unflagged mines
    for (let row = 0; row < rows; row++){
      for (let column = 0; column < columns; column++){
        if (board[row][column] == MINE && getSpriteName(tile[row][column]) != 'flag'){
          setTile(row, column, 'flag');
        }
      }
    }
  }
  console.log('mode: ' + (proof_mode ? 'proof' : 'normal'));
}
 // Reveal the tile if it is not a mine
function reveal(row, column) {
  if (column < 0 || row < 0 || column >= columns || row >= rows) return; // Out of bounds
  if (NUMBERS.includes(getSpriteName(tile[row][column])) || getSpriteName(tile[row][column]) == '0' ) return; // Already revealed or flagged
  // Reveal the tile
  setTile(row, column, board[row][column] );
  if (board[row][column] != 0){
    hidden_numbers--;
  } 
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