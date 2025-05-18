import React, { useState, useEffect } from 'react';
import TicketDisplay from '@/components/TicketDisplay';
import VideoPlayer from '@/components/VideoPlayer';
import { TicketProvider } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GooeyText } from '@/components/ui/gooey-text-morphing';

const WEATHER_API_KEY = 'SUA_API_KEY_AQUI'; // Substitua pela sua chave da OpenWeatherMap
const WEATHER_CITY = 'Salvador';
const WEATHER_LANG = 'pt_br';
const WEATHER_UNITS = 'metric';

const DisplayPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [localName, setLocalName] = useState('');
  
  // Atualiza o horário a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Busca o clima ao carregar
  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CITY}&appid=${WEATHER_API_KEY}&units=${WEATHER_UNITS}&lang=${WEATHER_LANG}`)
      .then(res => res.json())
      .then(data => setWeather(data));
    const savedLocal = localStorage.getItem('localName') || '';
    setLocalName(savedLocal);
  }, []);
  
  const formattedTime = currentTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const formattedDate = currentTime.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <TicketProvider>
      <div className="min-h-screen flex flex-col bg-primary-light">
        {/* Header bar */}
        <header className="bg-primary-dark text-primary-light p-2 flex items-center border-b border-primary-dark">
          <div className="flex-1 flex items-center gap-4">
            <span className="text-3xl font-extrabold whitespace-nowrap text-primary-light">
              Sistema de chamadas
            </span>
          </div>
          <div className="flex flex-row items-center gap-6 min-w-[400px] justify-end">
            {weather && weather.main ? (
              <span className="text-base font-medium whitespace-nowrap">
                {Math.round(weather.main.temp)}°C, {weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
              </span>
            ) : (
              <span className="text-base font-medium whitespace-nowrap">--°C, --</span>
            )}
            <span className="text-3xl font-bold">{formattedTime}</span>
            <span className="text-xs text-right leading-tight">
              {localName && <>{localName}<br/></>}{formattedDate}
            </span>
          </div>
        </header>
        
        {/* Main content area with two columns */}
        <div className="flex flex-1">
          {/* Left column - Video player (larger) */}
          <div className="flex-grow w-3/4 relative flex items-center justify-center p-0">
            <div className="w-full h-full border border-primary-dark/30 bg-white flex items-center justify-center" style={{borderWidth: '1px'}}>
              <VideoPlayer />
            </div>
          </div>
          
          {/* Right column - Ticket display (sidebar) */}
          <div className="w-[260px] min-w-[200px] border-l border-primary-dark flex flex-col justify-stretch p-0">
            <TicketDisplay />
          </div>
        </div>
        
        {/* Footer bar */}
        <footer className="bg-primary-medium border-t border-primary-dark p-2 flex justify-between items-center z-20">
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-primary-light"
            onClick={() => navigate('/')}
          >
            Voltar
          </Button>
          
          <div className="text-primary-dark text-sm">
            Sistema de Gerenciamento de Filas
          </div>
        </footer>
      </div>
    </TicketProvider>
  );
};

export default DisplayPage;
