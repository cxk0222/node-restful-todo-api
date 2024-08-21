const http = require('http')
const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('./controller.js')
const { parseRequestBody } = require('./utils.js')

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
    const todos = await getAllTodos()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(todos))
  } else if (method === 'POST' && url === '/todos') {
    const newTodo = await parseRequestBody(req)
    const createdTodo = await createTodo(newTodo)
    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(createdTodo))
  } else if (method === 'GET' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const todo = await getTodoById(id)
    if (todo) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(todo))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo not found' }))
    }
  } else if (method === 'PUT' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const upldatedTodo = await parseRequestBody(req)
    const todo = await updateTodo(id, upldatedTodo)
    if (todo) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(todo))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ message: 'Todo not found' }))
    }
  } else if (method === 'DELETE' && url.match(/\/todos\/\d+/)) {
    const id = parseInt(url.split('/')[2])
    const success = await deleteTodo(id)
    if (success) {
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