const { readData, writeData } = require('./storage.js')

const getAllTodos = async () => {
  return await readData()
}

const getTodoById = async (id) => {
  const todos = await readData()
  return todos.find((todo) => todo.id === id)
}

const createTodo = async (newTodo) => {
  const todos = await readData()
  newTodo.id = Date.now()
  todos.push(newTodo)
  await writeData(todos)
  return newTodo
}

const updateTodo = async (id, updatedTodo) => {
  const todos = await readData()
  const index = todos.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    todos[index] = { id, ...updatedTodo }
    await writeData(todos)
    return todos[index]
  }
  return null
}

const deleteTodo = async (id) => {
  const todos = await readData()
  const newTodos = todos.filter((todo) => todo.id !== id)
  if (newTodos.length !== todos.length) {
    await writeData(newTodos)
    return true
  }
  return false
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo
}