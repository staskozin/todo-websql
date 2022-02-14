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

  resizeTextarea(element) {
    element.style.height = "24px";
    element.style.height = (element.scrollHeight) + "px";
  }

  handleTextChange(id, element) {
    this.resizeTextarea(element)
    this.edit(id, element.value)
  }

  render() {
    if (this.tasks.length === 0) {
      this.container.innerHTML = 'Список дел пуст'
    } else {
      this.container.innerHTML = ''
      this.tasks.forEach((task) => {
        const taskElem = document.createElement('div')
        taskElem.classList.add('task')
        const label = `<label><input type="checkbox" onchange="tasks.toggleIsCompleted(${task.task_id})" ${task.is_completed ? 'checked' : ''}><textarea spellcheck="false" oninput="tasks.handleTextChange(${task.task_id}, this)">${task.task_text}</textarea></label>`
        const buttons = `<div class="buttons"><button class="button"><img src="img/trash.svg" alt="" onclick=tasks.remove(${task.task_id})></button></div>`
        taskElem.innerHTML = label + buttons
        this.container.appendChild(taskElem)
      })
    }
    for (const textarea of document.getElementsByTagName('textarea')) {
      tasks.resizeTextarea(textarea)
    }
  }
}
