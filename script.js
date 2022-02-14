window.onload = async () => {
  db = new DB('todo', '0.1', 'ToDo list', 2 * 1024 * 1024)
  await db.query('CREATE TABLE IF NOT EXISTS task (task_id INTEGER PRIMARY KEY, task_text TEXT NOT NULL DEFAULT "", is_completed INTEGER NOT NULL DEFAULT 0)')
  await db.query('DELETE FROM task WHERE task_text = ""')

  tasks = new Tasks('tasks')
  await tasks.update()

  for (const textarea of document.getElementsByTagName('textarea')) {
    tasks.resizeTextarea(textarea)
  }

  document.getElementById('task-input').focus()
}

document.getElementById('task-form').addEventListener('submit', async (e) => {
  e.preventDefault()
  const input = document.getElementById('task-input')
  if (input.value !== '') {
    await tasks.add(input.value)
    input.value = ''
  }
})
