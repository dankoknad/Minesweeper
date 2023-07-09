const tableEl = document.getElementById('table')

function renderTable(table) {
  tableEl.replaceChildren()

  for(let row = 0; row < table.length; row++) {
    const rowEl = document.createElement('div')
    rowEl.classList.add('row')

    for(let col = 0; col < table[row].length; col ++) {
      const cellEll = document.createElement('div')
      const { oppened, flag, haveMine, minesTouching, highlighted } = table[row][col]
      cellEll.classList.add("cell")
      if(!flag && !oppened) { cellEll.classList.add('hidden') }
      cellEll.dataset.location = `${row},${col}`

      if(haveMine && !flag) {
        cellEll.innerHTML = '💣'
        if(highlighted) {
          cellEll.classList.add('highlighted')
        }
      } else if(flag) {
        cellEll.innerHTML = '⛳️'
      } else {
        cellEll.innerHTML = minesTouching
      }
      rowEl.appendChild(cellEll)
    }

    tableEl.appendChild(rowEl)
  }
}

export default { renderTable }

