//logic

export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER: "number",
    MARKED: "marked",
}



export function createBoard(boardsize, numberofmine) {
    const board = []
    const minePositions = getMinePositions(boardsize, numberofmine)
    // console.log(minePositions);


    for (let x = 0; x < boardsize; x++) {
        const row = []
        for (let y = 0; y < boardsize; y++) {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionmatch.bind(null, { x, y })),
                get status() {
                    return this.element.dataset.status

                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
        //    console.log(row);
    }
    return board
}



export function markTile(tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
        return
    }
    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
    }
}

//revealTile
export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }

    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearByTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if (mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))
    } else {
        tile.element.textContent = mines.length
    }


}

//win ro lose
export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return (
                tile.status = TILE_STATUSES.NUMBER ||
                (tile.mine &&
                    (
                        tile.status === TILE_STATUSES.HIDDEN ||
                        tile.status === TILE_STATUSES.MARKED
                    )

                )

            )

        })
    })
}
export function checklose(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}


function getMinePositions(boardsize, numberofmine) {
    const positions = []

    while (positions.length < numberofmine) {
        const position = {
            x: randamNumber(boardsize),
            y: randamNumber(boardsize)
        }
        if (!positions.some(p => positionmatch(p, position))) {
            positions.push(position)
        }
    }
    return positions
}

function positionmatch(a, b) {
    return a.x === b.x && a.y === b.y
}




function randamNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearByTiles(board, { x, y }) {
    const tiles = []
    for (let xOffSet = -1; xOffSet <= 1; xOffSet++) {
        for (let yOffSet = -1; yOffSet <= 1; yOffSet++) {
            const tile = board[x + xOffSet]?.[x + yOffSet]
            if (tile) tiles.push(tile)
        }
    }


    return tiles
}