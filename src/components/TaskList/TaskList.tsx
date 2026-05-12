import { useState, useEffect } from 'react';
import { CheckCircle2, Plus, Trash2, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TaskList.css';

export const TaskList = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string; done: boolean }[]>(() => {
    const saved = localStorage.getItem('matcha_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('matcha_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setTasks([{ id: Date.now(), text: input, done: false }, ...tasks]);
      setInput('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="tasks-container">
      {/* Formulário de Adição */}
      <form onSubmit={addTask} className="task-form">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Plantar uma nova tarefa..."
          className="task-input"
        />
        <button type="submit" className="add-task-btn">
          <Plus size={22} />
        </button>
      </form>

      {/* Lista de Tarefas */}
      <div className="tasks-list-wrapper">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="task-card"
            >
              <button 
                onClick={() => toggleTask(task.id)} 
                className="task-checkbox"
                style={{ color: task.done ? '#C1D7AE' : '#E0E0E0' }}
              >
                <CheckCircle2 size={22} />
              </button>
              
              <span className="task-text" style={{ 
                textDecoration: task.done ? 'line-through' : 'none',
                color: task.done ? '#BDBDBD' : '#4F4F4F'
              }}>
                {task.text}
              </span>

              <button 
                onClick={() => deleteTask(task.id)} 
                className="delete-task-btn"
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Estado Vazio */}
        {tasks.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.5 }} 
            style={{ textAlign: 'center', marginTop: '40px' }}
          >
            <Leaf size={40} style={{ color: '#C1D7AE', margin: '0 auto 10px' }} />
            <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#8DA37E' }}>
              O teu jardim está limpo. <br/> Adiciona algo para florescer! 🌿
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};