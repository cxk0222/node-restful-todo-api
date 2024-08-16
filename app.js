const http = require('http')
const fs = require('node:fs/promises')
const path = require('path')

// 文件路径
const DATA_FILE_PATH = path.join(__dirname, 'data', 'todos.json')

console.log('DATA_FILE_PATH', DATA_FILE_PATH)

const readData = async () => {
  let data
  try {
    data = await fs.readFile(DATA_FILE_PATH, { encoding: 'utf8' })
  } catch (error) {
    return error
  } finally {
    return data
  }
}
const writeData = async (data) => {
  try {
    const toString = JSON.stringify(data, null, 2)
    await fs.writeFile(DATA_FILE_PATH, toString)
  } catch (error) {
    return error
  }
}
