const observers = []

export default Object.freeze({
  subscribe(fn) { observers.push(fn) },
  notify(data) { observers.forEach(fn => fn(data)) },
})

