import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filter, setFilter] = useState('All'); 

  // --- NEW STATE: Hold the external API data ---
  const [joke, setJoke] = useState(null);

  useEffect(() => {
    fetch('https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  // --- NEW FUNCTION: Call the External API ---
  const fetchJoke = () => {
    // Notice this URL is pointing to a completely different server on the internet!
    fetch('https://official-joke-api.appspot.com/random_joke')
      .then(response => response.json())
      .then(data => setJoke(data))
      .catch(error => console.error("Error fetching joke:", error));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return; 

    const newTask = { title: newTitle, description: newDescription, isCompleted: false };

    fetch('https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
    .then(res => res.json())
    .then(createdTask => {
      setTasks([...tasks, createdTask]);
      setNewTitle('');
      setNewDescription('');
    });
  };

  const handleToggleComplete = (task) => {
    const updatedTask = { ...task, isCompleted: !task.isCompleted };
    fetch(`https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(() => setTasks(tasks.map(t => t.id === task.id ? updatedTask : t)));
  };

  const handleDelete = (id) => {
    fetch(`https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks/${id}`, { method: 'DELETE' })
    .then(() => setTasks(tasks.filter(t => t.id !== id)));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const handleSaveEdit = (task) => {
    const updatedTask = { ...task, title: editTitle, description: editDescription };
    fetch(`https://taskmasterapi20260329100455-cxc3hxfabtatbzhr.southeastasia-01.azurewebsites.net/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    })
    .then(() => {
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
      setEditingId(null); 
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Pending') return !task.isCompleted;
    if (filter === 'Completed') return task.isCompleted;
    return true; 
  });

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>TaskMaster <span className="badge">Pro</span></h1>
          <p>Manage your workload efficiently.</p>
        </header>

        {/* --- NEW UI: The External API Widget --- */}
        <div className="joke-widget">
          <button onClick={fetchJoke} className="btn-secondary">
            🎭 Need a quick laugh?
          </button>
          
          {/* If we have a joke saved in state, show it on the screen */}
          {joke && (
            <div className="joke-box">
              <p className="joke-setup">{joke.setup}</p>
              <p className="joke-punchline">{joke.punchline}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleAddTask} className="task-form">
          <div className="input-group">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required 
            />
            <input 
              type="text" 
              placeholder="Details (Optional)" 
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn-primary">Add Task</button>
        </form>

        <div className="filter-tabs">
          <button className={`tab ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          <button className={`tab ${filter === 'Pending' ? 'active' : ''}`} onClick={() => setFilter('Pending')}>Pending</button>
          <button className={`tab ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>Completed</button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? <p className="empty-state">No tasks found in this view.</p> : null}
          
          {filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.isCompleted ? 'completed' : ''}`}>
              {editingId === task.id ? (
                <div className="edit-mode">
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="edit-input" />
                  <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="edit-input" />
                  <div className="edit-actions">
                    <button onClick={() => handleSaveEdit(task)} className="btn-save">💾 Save</button>
                    <button onClick={() => setEditingId(null)} className="btn-cancel">❌ Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="task-content">
                    <h3 className="task-title">{task.title}</h3>
                    {task.description && <p className="task-desc">{task.description}</p>}
                  </div>
                  <div className="task-actions">
                    <button onClick={() => handleToggleComplete(task)} className={`btn-icon ${task.isCompleted ? 'undo' : 'done'}`} title={task.isCompleted ? "Mark Pending" : "Mark Complete"}>
                      {task.isCompleted ? '↩️' : '✅'}
                    </button>
                    {!task.isCompleted && (
                      <button onClick={() => startEditing(task)} className="btn-icon edit" title="Edit Task">✏️</button>
                    )}
                    <button onClick={() => handleDelete(task.id)} className="btn-icon delete" title="Delete Task">🗑️</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App