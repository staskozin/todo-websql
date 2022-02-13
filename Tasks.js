class Tasks {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
  }

  async update() {
    this.tasks = (await db.query('SELECT * FROM task')).rows
      .map(t => ({ ...t, is_completed: Boolean(t.is_completed) }))
    this.render()
  }

  async add(text) {
    await db.query('INSERT INTO task (task_text) VALUES (?)', [text])
    this.update()
  }

  async edit(id, text, is_completed) {
    if (is_completed === undefined) {
      await db.query('UPDATE task SET task_text = ? WHERE task_id = ?', [text, id])
    } else {
      await db.query('UPDATE task SET task_text = ?, is_completed = ? WHERE task_id = ?', [text, Number(is_completed), id])
    }
    this.update()
  }

  async remove(id) {
    await db.query('DELETE FROM task WHERE task_id = ?', [id])
    this.update()
  }

  async toggleIsCompleted(id) {
    const task = this.tasks.find(t => t.task_id === id)
    task.is_completed = !task.is_completed
    await db.query('UPDATE task SET is_completed = ? WHERE task_id = ?', [Number(task.is_completed), id])
    this.render()
  }

  render() {
    this.container.innerHTML = ''
    this.tasks.forEach((task) => {
      const taskElem = document.createElement('p')
      taskElem.innerText = `${task.task_text} — ${task.is_completed}`
      taskElem.setAttribute('onclick', `tasks.remove(${task.task_id})`)
      this.container.appendChild(taskElem)
    })
  }
}
