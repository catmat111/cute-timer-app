import { motion } from 'framer-motion';

export const GoogleCalendar = () => {
  // Substitui pelo link que encontrares em "Código de incorporação"
  // O link DEVE conter a palavra "/embed" e não "/u/0"
  const googleCalendarUrl = "https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FLisbon&showPrint=0&showCalendars=0&showTitle=0&showTz=0&src=MmU1NzYxM2Q1YWE5ODZlNGIyNGI5Y2I5YmE5OTVlZGJhOTk3YWUxMDgxZmJlNGI4MmVhNTZkZGJhNTc2NTU2YkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23ed201d";
    return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}
    >
      <iframe 
  src={googleCalendarUrl}
  style={{ 
    border: 'none', 
    borderRadius: '20px', 
    width: '100%', 
    height: '100%', // Usa a altura total disponível
    minHeight: '500px',
    backgroundColor: 'transparent'
  }} 
  frameBorder="0" 
  scrolling="no"
></iframe>
      
      <p style={{ fontSize: '10px', color: '#8DA37E', textAlign: 'center', fontStyle: 'italic', marginTop: '5px' }}>
        Sincronizado com a tua conta Google ☁️
      </p>
    </motion.div>
  );
};