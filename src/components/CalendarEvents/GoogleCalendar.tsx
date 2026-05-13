import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, Trash2, Info } from 'lucide-react';

export const GoogleCalendar = () => {
  const [calendarUrl, setCalendarUrl] = useState(localStorage.getItem('user_calendar_url') || "");
  const [tempUrl, setTempUrl] = useState("");

  const handleSave = () => {
    if (tempUrl.trim().includes("calendar.google.com/calendar/embed")) {
      localStorage.setItem('user_calendar_url', tempUrl.trim());
      setCalendarUrl(tempUrl.trim());
    } else {
      alert("Ups! Esse não parece ser um link de incorporação válido. 🍵");
    }
  };

  if (!calendarUrl) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '15px', fontFamily: 'Quicksand' }}>
        <div style={{ backgroundColor: 'rgba(193, 215, 174, 0.15)', padding: '20px', borderRadius: '28px', border: '2px dashed #C1D7AE' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8DA37E', margin: '0 0 15px 0' }}>
            <Settings size={18} /> Configuração
          </h3>
          
          <div style={{ fontSize: '11px', color: '#777', lineHeight: '1.5', marginBottom: '15px' }}>
            <p>1. No Google Calendar (PC), vai a <b>Definições</b>.</p>
            <p>2. No menu lateral, em <b>"Definições dos meus calendários"</b>, clica no primeiro que queres mostrar.</p>
            <p>3. Em <b>Integrar calendário</b>, clica no botão <b>Personalizar</b>.</p>
            <p style={{ color: '#8DA37E', fontWeight: 'bold' }}>4. No menu à esquerda, marca todos os calendários que queres sobrepor (Exames, Aulas, etc).</p>
            <p>5. Copia o link que aparece no topo (em "Código de incorporação").</p>
          </div>

          <input 
            type="text" value={tempUrl} onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Cola o link personalizado aqui..."
            style={{ width: '100%', padding: '12px', borderRadius: '15px', border: '2px solid #E8F5E9', marginBottom: '10px' }}
          />
          
          <button onClick={handleSave} style={{ width: '100%', backgroundColor: '#C1D7AE', color: 'white', border: 'none', padding: '12px', borderRadius: '15px', fontWeight: '800', cursor: 'pointer' }}>
            <Check size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }}/> Guardar Calendário Unificado
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <iframe 
        src={calendarUrl}
        style={{ border: '3px solid #F0F4EF', borderRadius: '25px', width: '100%', height: '500px', backgroundColor: 'white' }} 
        frameBorder="0" scrolling="no"
      ></iframe>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
        <button 
          onClick={() => { localStorage.removeItem('user_calendar_url'); setCalendarUrl(""); }}
          style={{ background: 'none', border: 'none', color: '#FFB7B2', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '700' }}
        >
          <Trash2 size={14} /> Resetar Link
        </button>
        <div title="Para adicionar mais calendários, deves usar o botão Personalizar nas definições do Google Calendar e gerar um novo link." style={{ color: '#8DA37E', cursor: 'help' }}>
          <Info size={14} />
        </div>
      </div>
    </motion.div>
  );
};