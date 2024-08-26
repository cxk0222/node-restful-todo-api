const { writeData } = require('./storage.js')

const initialData = [
  {
    id: 1,
    title: 'Learn Node.js',
    completed: false
  },
  {
    id: 2,
    title: 'Build a Todo List API',
    completed: false
  },
  {
    id: 3,
    title: 'Write seed data script',
    completed: true
  }
]

const main = async () => {
  await writeData(initialData)
}

main()