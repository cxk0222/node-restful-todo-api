const http = require('http')
const { readData, writeData } = require('./storage.js')

// 处理请求数据
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', err => {
      reject(err)
    })
  })
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (method === 'GET' && url === '/todos') {
    const todos = await readData()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(todos))
  } else if (method === 'POST' && url === '/todos') {
    const newTodo = await parseRequestBody(req)
    const todos = await readData()
    newTodo.id = Date.now()
    todos.push(newTodo)
    await writeData(todos)
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(newTodo))
  } else if (method === 'GET' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const todos = await readData()
    const todo = todos.find(todo => todo.id === id)
    if (todo) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(todo))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo not found' }))
    }
  } else if (method === 'PUT' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const todos = await readData()
    const upldatedTodo = await parseRequestBody(req)
    const index = todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos[index] = { ...todos[index], ...upldatedTodo }
      await writeData(todos)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(todos[index]))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo not found' }))
    }
  } else if (method === 'DELETE' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const todos = await readData()
    const newTodos = todos.filter(todo => todo.id !== id)
    if (newTodos.length !== todos.length) {
      await writeData(newTodos)
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo deleted' }))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo not found' }))
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Route not found' }))
  }
})

server.listen(3000, () => {
  console.log('server is running at 3000')
})