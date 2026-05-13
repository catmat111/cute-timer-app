import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Sparkles, Flower, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './CalendarEvents.css';

// Interface para os eventos
interface CalendarEvent {
  id: string;
  date: string; // ISO string
  text: string;
}

export function CalendarEvents() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('matcha_events');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteInput, setNoteInput] = useState('');

  // Persistência
  useEffect(() => {
    localStorage.setItem('matcha_events', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (!noteInput.trim()) return;
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate.toISOString(),
      text: noteInput
    };
    setEvents([...events, newEvent]);
    setNoteInput('');
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Filtra eventos do dia selecionado
  const dayEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = isSameDay(day, selectedDate);
        const hasEvent = events.some(e => isSameDay(new Date(e.date), cloneDay));

        days.push(
          <div
            key={day.toString()}
            className="day-cell"
            style={{
              backgroundColor: isSelected ? '#FFD1DC' : 'transparent',
              color: isSelected ? '#D64550' : !isSameMonth(day, monthStart) ? '#DDD' : '#555',
            }}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
            {hasEvent && <div className="day-has-event" />}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="days-grid" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>{rows}</div>;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="calendar-card">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="nav-btn"><ChevronLeft size={20}/></button>
        <div className="month-title"><Flower size={18} /> {format(currentMonth, 'MMMM yyyy', { locale: pt })}</div>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="nav-btn"><ChevronRight size={20}/></button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '10px' }}>
        {['D','S','T','Q','Q','S','S'].map((d, i) => <div key={i} className="weekday-label">{d}</div>)}
      </div>

      {renderCells()}
      
      <div className="notes-area">
        <h3 style={{ fontSize: '11px', fontWeight: '800', color: '#8DA37E', display: 'flex', alignItems: 'center', gap: '6px', margin: '0' }}>
          <Sparkles size={14} style={{ color: '#FF8B94' }} /> AGENDA DE {format(selectedDate, 'dd/MM')}
        </h3>

        {/* Lista de Eventos do Dia */}
        <div style={{ margin: '10px 0' }}>
          {dayEvents.length > 0 ? dayEvents.map(e => (
            <div key={e.id} className="event-item">
              <span>{e.text}</span>
              <Trash2 size={12} onClick={() => deleteEvent(e.id)} style={{ cursor: 'pointer', color: '#FFB7B2' }} />
            </div>
          )) : (
            <p style={{ fontSize: '10px', color: '#AAA', fontStyle: 'italic' }}>Nada planeado... 🍵</p>
          )}
        </div>

        {/* Input para Novo Evento */}
        <div className="event-input-wrapper">
          <input 
            className="event-input" 
            placeholder="Nova nota..." 
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addEvent()}
          />
          <button onClick={addEvent} style={{ background: '#C1D7AE', color: 'white', border: 'none', borderRadius: '10px', padding: '0 10px', cursor: 'pointer' }}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}