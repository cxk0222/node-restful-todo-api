const fs = require('node:fs/promises')
const path = require('path')

const DATA_DIR_PATH = path.join(__dirname, 'data')
const DATA_FILE_PATH = path.join(__dirname, 'data', 'todos.json')

const ensureDirExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true })
    } else {
      throw error
    }
  }
}

const readData = async () => {
  try {
    let data = await fs.readFile(DATA_FILE_PATH, { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
    return []
  }
}

const writeData = async (data) => {
  try {
    const toString = JSON.stringify(data, null, 2)
    await ensureDirExists(DATA_DIR_PATH)
    await fs.writeFile(DATA_FILE_PATH, toString)
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  readData,
  writeData
}