This is minesweeper but with a twist —— you can only do logically valid moves and you are not allowed to guess randomly. When a number matches the number of neighboring hidden tiles, you can left click the **numbers** to reveal hidden tiles, and right click the **numbers** to flag the hidden tiles.

You can also left click or right click the hidden tiles to enter **PROOF MODE**. If you right click a hidden tile, you place a hypothetical blue flag, and you goal is to arrive at a contradiction by doing deduction based on the blue flag, so that it is proven safe to reveal the blue flag tile. To make a contradiction and end PROOF MODE, press the number that violate the rules of minesweeper. It can the number whose number of available neighboring hidden tiles is less than the number itself, or the number with there are too many flags around it. 

Similarly, you can left click a hidden tile to create a hypothetical empty space, and you can arrive at a contradiction based on that.

Pressing middle mouse button on a number will place green flags if there are unflagged neighboring hidden tiles such that they make fractional frags. Green flags can help you reveal nearby tiles that also have all of those green flags as neighbors. If you want to remove the green flags, just press middle mouse button again.

**Credits**

The code is based on _The Minesweeper game in 100 lines of JavaScript_:
https://slicker.me/javascript/mine/minesweeper.htm
