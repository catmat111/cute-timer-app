import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, X, CheckCircle, History as HistoryIcon, Coffee, Leaf, Clock } from 'lucide-react';
import './Timer.css';

const bellAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
bellAudio.volume = 0.4;

const presets = [
  { label: '5m', value: 5, icon: <Leaf size={14} /> },
  { label: '15m', value: 15, icon: <Coffee size={14} /> },
  { label: '25m', value: 25, icon: <Clock size={14} /> },
  { label: '60m', value: 60, icon: <Sparkles size={14} /> },
];

export const TimerComponent = () => {
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(25);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [history, setHistory] = useState<{ id: number; time: string; date: string }[]>([]);

  const formatTime = useCallback((s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const playBell = () => {
    bellAudio.currentTime = 0;
    bellAudio.play().catch(() => {});
  };

  const playTick = () => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, context.currentTime);
    gain.gain.setValueAtTime(0.02, context.currentTime);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.05);
  };

  const unlockAudio = () => {
    bellAudio.play().then(() => { bellAudio.pause(); bellAudio.currentTime = 0; }).catch(() => {});
  };

  const handleSave = () => {
    unlockAudio();
    const newS = tempMinutes * 60;
    setInitialSeconds(newS);
    setSeconds(newS);
    setIsActive(false);
    setIsConfiguring(false);
  };

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => {
          const next = s - 1;
          if (next <= 3 && next > 0) playTick();
          return next;
        });
      }, 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      playBell();
      setShowFinishedModal(true);
      setHistory(prev => [{
        id: Date.now(),
        time: formatTime(initialSeconds),
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 5));
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, initialSeconds, formatTime]);

  // Lógica de Cores Dinâmicas
  const isLast5Min = seconds <= 300 && seconds > 3;
  const isLast3Sec = seconds <= 3 && seconds > 0;
  
  const timerColor = isLast3Sec ? '#FF4D6D' : isLast5Min ? '#FFD1DC' : '#C1D7AE';
  const textColor = isLast3Sec ? '#FF4D6D' : '#333';

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / initialSeconds) * circumference;

  return (
    <div className="timer-container">
      <div className="timer-svg-wrapper">
        <svg width="220" height="220" className="timer-svg">
          <circle cx="110" cy="110" r={radius} stroke="#E8F5E9" strokeWidth="12" fill="white" />
          <motion.circle 
            cx="110" cy="110" r={radius} 
            stroke={timerColor} 
            strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            animate={{ 
              strokeDashoffset: circumference - progress,
              opacity: isLast3Sec ? [1, 0.5, 1] : 1 
            }}
            transition={{ 
              strokeDashoffset: { duration: 1, ease: "linear" },
              opacity: { repeat: Infinity, duration: 0.5 }
            }}
            strokeLinecap="round"
          />
        </svg>

        <motion.div 
          className="timer-text" 
          style={{ color: textColor }}
          animate={isLast3Sec ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {formatTime(seconds)}
        </motion.div>

        <button className="config-btn" onClick={() => setIsConfiguring(true)}>
          <Sparkles size={18} />
        </button>
      </div>

      <div className="controls-wrapper">
        <button 
          className="btn-main" 
          style={{ backgroundColor: isActive ? '#FF8B94' : '#C1D7AE' }} 
          onClick={() => { unlockAudio(); setIsActive(!isActive); }}
        >
          {isActive ? <Pause size={30}/> : <Play size={30} style={{ marginLeft: '5px' }}/>}
        </button>
        <button className="btn-main btn-reset" onClick={() => {setIsActive(false); setSeconds(initialSeconds)}}>
          <RotateCcw size={28} />
        </button>
      </div>

      <div className="history-section">
        <div className="history-title"><HistoryIcon size={14} /> RECENTES</div>
        {history.map(item => (
          <div key={item.id} className="history-item">
            <span style={{ fontWeight: 'bold', color: '#8DA37E' }}>{item.time} concluído</span>
            <span style={{ color: '#AAA' }}>{item.date}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isConfiguring && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setIsConfiguring(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="config-modal-v2">
              <div className="modal-header">
                <span className="modal-tag">CONFIGURAR FOCO</span>
                <X size={20} onClick={() => setIsConfiguring(false)} style={{ cursor: 'pointer' }} />
              </div>
              <div className="time-display-large">
                <span className="number" style={{ color: '#FF8B94' }}>{tempMinutes}</span>
                <span className="unit">min</span>
              </div>
              <div className="slider-wrapper">
                <input type="range" min="1" max="120" value={tempMinutes} onChange={(e) => setTempMinutes(Number(e.target.value))} className="custom-slider" />
              </div>
              <div className="presets-grid">
                {presets.map((p) => (
                  <button key={p.value} className={`preset-pill ${tempMinutes === p.value ? 'active' : ''}`} onClick={() => setTempMinutes(p.value)}>
                    {p.icon} {p.label}
                  </button>
                ))}
              </div>
              <button className="save-btn-v2" onClick={handleSave}>COMEÇAR AGORA</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFinishedModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={() => setShowFinishedModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="finished-modal">
              <CheckCircle size={40} color="#FF8B94" />
              <h3 style={{ margin: 0 }}>Hora do chá! ✨</h3>
              <p style={{ fontSize: '12px', color: '#777', margin: 0 }}>Completaste o teu ciclo de foco.</p>
              <button className="save-btn-v2" style={{ backgroundColor: '#FFD1DC', color: '#D64550' }} onClick={() => { setShowFinishedModal(false); setSeconds(initialSeconds); }}>
                Novo Timer 🌸
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};