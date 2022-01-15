//display/UI
import { TILE_STATUSES,createBoard ,markTile ,revealTile,checkWin,checklose  } from './minesweeper.js'
const BOARD_SIZE = 10 
const NUMBRE_OF_TILE = 3
const board = createBoard(BOARD_SIZE,NUMBRE_OF_TILE);

const boardElement = document.querySelector(".board")
const mineLeftText = document.querySelector("[data_mines_count]")
const messageText = document.querySelector(".subtext")

// console.log(board);

board.forEach(row => {
    row.forEach( tile => {
        // console.log(tile);
        boardElement.append(tile.element)
        tile.element.addEventListener("click",() => {
            revealTile(board,tile)
            checkGameEnd()

        })
        tile.element.addEventListener("contextmenu",e => {
            e.preventDefault()
            markTile(tile)
            listMinesLeft()
        })
    })
    
})

boardElement.style.setProperty("--size",BOARD_SIZE)
mineLeftText.textContent = NUMBRE_OF_TILE

function listMinesLeft() {
    const markedTilesCount = board.reduce((count,row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    },0)
   mineLeftText.textContent = NUMBRE_OF_TILE - markedTilesCount
}


function checkGameEnd() {
    const win = checkWin(board)
    const lose = checklose(board)
    
    if (win || lose) {
        boardElement.addEventListener("click", stopProp, {capture : true} )
        boardElement.addEventListener("contextmenu", stopProp, {capture : true} )
    }
    if (win) {
        messageText.textContent = "YOU WIN"
    }
    if (lose) {
        messageText.textContent = "YOU LOSE"
        board.forEach(row => {
            row.forEach(tile =>{
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile( board,tile)
            })
        })
    
    
    }

    function stopProp(e) {
        e.stopImmediatePropagation()
    }
}



/* populate a board with tiles/miles.
  - left click oon tile
     -revels tile
  -right click on tile
      -marks tiles
  -click for wine or lose*/
