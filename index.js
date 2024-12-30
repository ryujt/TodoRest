const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
app.use(express.json())
const PORT = 3000
const DATA_FILE = path.join(__dirname, 'todos.jsonl')
function readTodos() {
  if (!fs.existsSync(DATA_FILE)) {
    return []
  }
  const data = fs.readFileSync(DATA_FILE, 'utf8').trim()
  if (!data) {
    return []
  }
  return data.split('\n').map(line => JSON.parse(line))
}
function writeTodos(todos) {
  const data = todos.map(todo => JSON.stringify(todo)).join('\n')
  fs.writeFileSync(DATA_FILE, data)
}
app.get('/todo', (req, res) => {
  const todos = readTodos()
  res.json(todos)
})
app.post('/todo', (req, res) => {
  const todos = readTodos()
  const newTodo = {
    id: Date.now().toString(),
    title: req.body.title || '',
    description: req.body.description || '',
    completed: false
  }
  todos.push(newTodo)
  writeTodos(todos)
  res.json(newTodo)
})
app.get('/todo/:id', (req, res) => {
  const todos = readTodos()
  const todo = todos.find(t => t.id === req.params.id)
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  res.json(todo)
})
app.put('/todo/:id', (req, res) => {
  const todos = readTodos()
  const index = todos.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  todos[index].title = req.body.title || todos[index].title
  todos[index].description = req.body.description || todos[index].description
  writeTodos(todos)
  res.json(todos[index])
})
app.patch('/todo/:id', (req, res) => {
  const todos = readTodos()
  const index = todos.findIndex(t => t.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  todos[index].completed = true
  writeTodos(todos)
  res.json(todos[index])
})
app.delete('/todo/:id', (req, res) => {
  const todos = readTodos()
  const newTodos = todos.filter(t => t.id !== req.params.id)
  if (newTodos.length === todos.length) {
    return res.status(404).json({ error: 'Todo not found' })
  }
  writeTodos(newTodos)
  res.json({ success: true })
})
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
