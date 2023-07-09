import Observable from "./observable.js"

const offsets = [
  [-1,-1], [-1,0], [-1,1],
  [0,-1], [0,1],
  [1,-1], [1,0], [1,1]
]

let tableRef
let isWin
let isGameOver
let oppenedCount
let flagsCount 

function updateTableRef(table) { tableRef = table }
Observable.subscribe(updateTableRef)

function setStatus(table) {
  const flatTable = table.flat()
  const missingFlags = flatTable.filter(el => el.haveMine && !el.oppened && !el.flag) 
  isWin = flatTable.every(el => (el.haveMine && !el.oppened) || (!el.haveMine && el.oppened))
  isGameOver = flatTable.some(el => el.haveMine && el.oppened)
  oppenedCount = flatTable.reduce((acc, el) => acc += Number(el.oppened), 0)
  flagsCount = flatTable.reduce((acc, el) => acc += Number(el.flag), 0)

  if(isWin && missingFlags.length) {
    const updatedTable = table.map((r, rI) => r.map((el, cI) => {
      const { haveMine, oppened, flag } = table[rI][cI]
      if(haveMine && !oppened && !flag) {
        return { ...el, flag: true }
      } else { return el }
    }))

    setTimeout(() => Observable.notify(updatedTable), 0)
  }
  console.log({ isWin, isGameOver, oppenedCount, flagsCount })
}

Observable.subscribe(setStatus)

function genMinesLocations(rows, cols, mines) {
  const minesLocations = {}
  while(Object.keys(minesLocations).length < mines) {
    const rowInx = Math.floor(Math.random() * rows)
    const colInx = Math.floor(Math.random() * cols)
    const key = [rowInx, colInx].toString()
    if(!minesLocations[key]) {
      minesLocations[key] = true
    }
  }
  return minesLocations
}

function createTable(rows = 6, cols = 8, minesTotal = 10) {
  const table = []
  const minesLocations = genMinesLocations(rows, cols, minesTotal)

  for(let i = 0; i < rows; i++) {
    const row = []
    for(let j = 0; j < cols; j++) {
      const haveMine = minesLocations[[i,j].toString()] || false
      row.push({
        minesTouching: null,
        flag: false,
        haveMine,
        oppened: false,
      })
    }
    table.push(row)
  }

  for(let i = 0; i < table.length; i++) {
    for(let j = 0; j < table[i].length; j++) {
      if(!table[i][j].haveMine) {
        let count = 0

        for(let arrInx = 0; arrInx < offsets.length; arrInx++) {
          const [r, c] = offsets[arrInx]
          const elExists = (table[i + r] && table[i + r][j + c]) || false
          if(elExists && table[i + r][j + c].haveMine) {
            count++
          }
        }

        table[i][j].minesTouching = count
      }
    }
  }

  return table
}

function traverse(row, col, t) {
  if(t[row][col].haveMine) {
    return t.reduce((acc, r, rI) => {
      r.forEach((_, cI) => acc.push([rI, cI]))
      return acc
    }, []);
  }

  if(t[row][col].minesTouching == 0) {
    const q = [[row,col]]
    const visited = {[[row, col].toString()]: true}
    const toBeRevealed = {}

    while(q.length) {
      const current = q[q.length - 1]

      offsets.forEach(([oRI, oCI]) => {
        const rI = current[0] + oRI
        const cI = current[1] + oCI
        const elExists = (t[rI] && t[rI][cI]) || false
        const key = [rI,cI].toString()

        if(
          elExists &&
          elExists.minesTouching == 0 &&
          !visited[key]
        ) {
          q.unshift([rI,cI])
          visited[key] = true
        }
      })

      q.pop()
    }

    Object.keys(visited).forEach(key => {
      const [r, c] = key.split(',').map(Number)
      toBeRevealed[key] = true
      offsets.forEach(([oRI, oCI]) => {
        const rI = r + oRI
        const cI = c + oCI
        const elExists = (t[rI] && t[rI][cI]) || false
        const key = [rI,cI].toString()
        if(elExists) {
          toBeRevealed[key] = true
        }
      })
    })

    return Object.keys(toBeRevealed).map(el => el.split(',').map(Number))
  }

  return [[row, col]]
}

function handleClick(e) {
  const [row, col] = e.target.dataset.location.split(',').map(Number)
  const { oppened, flag, haveMine } = tableRef[row][col]

  if(oppened || isWin || isGameOver) { return }
  
  const toOpen = traverse(row, col, tableRef)
  const updatedTable = [ ...tableRef ]

  toOpen.forEach(([r, c]) => updatedTable[r][c].oppened = true)

  if(flag) {
    updatedTable[row][col].flag = false
  }
  if(haveMine) {
    updatedTable[row][col].highlighted = true
  }

  Observable.notify(updatedTable)
}

function toggleFlag(e) {
  e.preventDefault()
  const [row, col] = e.target.dataset.location.split(',').map(Number)
  const { flag, oppened } = tableRef[row][col]
  
  if(oppened || isWin || isGameOver) { return }
  
  const updatedTable = tableRef.map(
    (r, rI) => 
      r.map((el, cI) =>
        (rI === row && cI === col)
          ? {...el, flag: !flag}
          : el
    ))

  Observable.notify(updatedTable)
}

export default { createTable, handleClick, toggleFlag }

