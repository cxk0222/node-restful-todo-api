const { getAllTodos, getTodoById, createTodo, updateTodo, deleteTodo } = require('./controller.js')
const { parseRequestBody } = require('./utils.js')

const handleNotFound = (res, msg) => {
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: msg }))
}

const handleGetTodos = async (res) => {
  const todos = await getAllTodos()
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(todos))
}

const handleCreateTodo = async (req, res) => {
  const newTodo = await parseRequestBody(req)
  const createdTodo = await createTodo(newTodo)
  res.writeHead(201, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(createdTodo))
}

const handleGetTodoById = async (req, res) => {
  const id = parseInt(req.url.split('/')[2])
  const todo = await getTodoById(id)
  if (todo) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(todo))
  } else {
    handleNotFound(res, 'Todo not found')
  }
}

const handleUpdateTodo = async (req, res) => {
  const id = parseInt(req.url.split('/')[2])
  const updatedTodo = await parseRequestBody(req)
  const todo = await updateTodo(id, updatedTodo)
  if (todo) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(todo))
  } else {
    handleNotFound(res, 'Todo not found')
  }
}

const handleDeleteTodo = async (req, res) => {
  const id = parseInt(req.url.split('/')[2])
  const success = await deleteTodo(id)
  if (success) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Todo deleted' }))
  } else {
    handleNotFound(res, 'Todo not found')
  }
}

const router = async (req, res) => {
  const { method, url } = req

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')

  if (method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  if (method === 'GET' && url === '/todos') {
    handleGetTodos(res)
  } else if (method === 'POST' && url === '/todos') {
    handleCreateTodo(req, res)
  } else if (method === 'GET' && url.match(/\/todos\/\d+/)) {
    handleGetTodoById(req, res)
  } else if (method === 'PUT' && url.match(/\/todos\/\d+/)) {
    handleUpdateTodo(req, res)
  } else if (method === 'DELETE' && url.match(/\/todos\/\d+/)) {
    handleDeleteTodo(req, res)
  } else {
    handleNotFound(res, 'Route not found')
  }
}

module.exports = router