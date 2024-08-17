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
    data = JSON.parse(data)
  } catch (error) {
    return error
  } finally {
    return data || []
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
  } else {
    res.writeHead(404)
    res.end('Not Found')
  }
})

server.listen(3000, () => {
  console.log('server is running at 3000')
})