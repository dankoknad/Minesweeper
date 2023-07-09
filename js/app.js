import Minesw from './minesw.js'
import Observable from "./observable.js"
import Render from './render.js'

const { createTable, handleClick, toggleFlag } = Minesw
const { renderTable } = Render

let rows = 8, cols = 12, mines = 20

const tableEl = document.getElementById('table')
const newGameBtnEl = document.getElementById('newGame')
const table = createTable(rows, cols, mines)

function createNewGame() {
  const isConfirmed = confirm('Wanna play a new game?')

  if(isConfirmed) {
    Observable.notify(createTable(rows, cols, mines))
  }
}

newGameBtnEl.addEventListener('click', createNewGame)
Observable.subscribe(renderTable)
Observable.notify(table)

tableEl.addEventListener('click', handleClick, false)
tableEl.addEventListener('contextmenu', toggleFlag, false);

