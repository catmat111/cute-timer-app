import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles, X, CheckCircle, History as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Timer.css';

export const TimerComponent = () => {
  const [initialSeconds, setInitialSeconds] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [tempMinutes, setTempMinutes] = useState(25);
  const [showFinishedModal, setShowFinishedModal] = useState(false);
  const [history, setHistory] = useState<{ id: number; time: string; date: string }[]>([]);

  const playBell = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const playTick = () => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, context.currentTime);
    gain.gain.setValueAtTime(0.05, context.currentTime);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.05);
  };

  const handleSave = () => {
    const newS = tempMinutes * 60;
    setInitialSeconds(newS);
    setSeconds(newS);
    setIsActive(false);
    setIsConfiguring(false);
};

// Função para detetar a tecla Enter
const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSave();
    }
    if (e.key === 'Escape') {
        setIsConfiguring(false);
    }
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
  }, [isActive, seconds]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / initialSeconds) * circumference;
  const isLastMinute = seconds <= 60 && seconds > 3;
  const isLastSeconds = seconds <= 3 && seconds > 0;

  return (
    <div className="timer-container">
      <div className="timer-svg-wrapper">
        <svg width="220" height="220" className="timer-svg">
          <circle cx="110" cy="110" r={radius} stroke="#E8F5E9" strokeWidth="12" fill="white" />
          <motion.circle 
            cx="110" cy="110" r={radius} 
            stroke={isLastSeconds ? '#FF4D6D' : isLastMinute ? '#FFD1DC' : '#C1D7AE'} 
            strokeWidth="12" fill="transparent"
            strokeDasharray={circumference}
            animate={{ 
              strokeDashoffset: circumference - progress,
              opacity: isLastMinute || isLastSeconds ? [1, 0.4, 1] : 1
            }}
            transition={{ strokeDashoffset: { duration: 1, ease: "linear" }, opacity: { repeat: Infinity, duration: 0.8 } }}
            strokeLinecap="round"
          />
        </svg>

        <div className="timer-text" style={{ color: isLastSeconds ? '#FF4D6D' : '#333' }}>
          {formatTime(seconds)}
        </div>

        <button className="config-btn" onClick={() => setIsConfiguring(!isConfiguring)}>
          <Sparkles size={18} />
        </button>

        <AnimatePresence>
            {isConfiguring && (
                <div className="modal-overlay" onClick={() => setIsConfiguring(false)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="config-modal"
                        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
                    >
                        <div className="flex justify-between w-full items-center mb-2">
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FF8B94', letterSpacing: '1px' }}>
                                MINUTOS
                            </span>
                            <X 
                                size={18} 
                                onClick={() => setIsConfiguring(false)} 
                                className="cursor-pointer text-[#FF8B94]" 
                            />
                        </div>

                        <input 
                            autoFocus // Foca automaticamente ao abrir
                            type="number" 
                            className="config-input" 
                            value={tempMinutes} 
                            onChange={(e) => setTempMinutes(Math.max(1, Number(e.target.value)))}
                            onKeyDown={handleKeyDown} // Atalho de teclado
                        />

                        <button 
                            className="w-full bg-[#FFD1DC] text-[#D64550] border-none py-3 rounded-2xl font-bold cursor-pointer hover:bg-[#ffc5d3] transition-colors"
                            onClick={handleSave}
                        >
                            SALVAR (ENTER)
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </div>

      <div className="controls-wrapper">
        <button 
          className="btn-main" 
          style={{ backgroundColor: isActive ? '#FF8B94' : '#C1D7AE' }}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <Pause size={30}/> : <Play size={30} style={{ marginLeft: '5px' }}/>}
        </button>

        <button className="btn-main btn-reset" onClick={() => {setIsActive(false); setSeconds(initialSeconds)}}>
          <RotateCcw size={28} />
        </button>
      </div>

      <div className="history-section">
        <div className="history-title"><HistoryIcon size={14} /> RECENTES</div>
        <div className="flex flex-col gap-2">
          {history.map(item => (
            <div key={item.id} className="history-item">
              <span className="font-bold text-[#8DA37E]">{item.time} concluído</span>
              <span className="text-[#AAA]">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showFinishedModal && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} className="finished-modal">
            <div className="text-[#FF8B94] mb-2"><CheckCircle size={40} className="mx-auto" /></div>
            <h3 className="m-0 text-[#333]">Hora do chá! ✨</h3>
            <p className="text-[12px] text-[#777] mb-4">Completaste o teu ciclo de foco.</p>
            <button className="w-full bg-[#FFD1DC] text-[#D64550] border-none p-3 rounded-xl font-bold cursor-pointer" onClick={() => { setShowFinishedModal(false); setSeconds(initialSeconds); }}>
              Novo Timer 🌸
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};