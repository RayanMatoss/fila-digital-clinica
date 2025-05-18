import React, { useState, useEffect } from 'react';
import TicketDisplay from '@/components/TicketDisplay';
import VideoPlayer from '@/components/VideoPlayer';
import { TicketProvider } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const WEATHER_API_KEY = 'SUA_API_KEY_AQUI'; // Substitua pela sua chave da OpenWeatherMap
const WEATHER_CITY = 'Salvador';
const WEATHER_LANG = 'pt_br';
const WEATHER_UNITS = 'metric';

const DisplayPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  
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
      <div className="min-h-screen flex flex-col bg-clinic-grey">
        {/* Header bar */}
        <header className="bg-clinic-blue text-white p-4 flex justify-between items-center z-20">
          <div className="text-xl font-semibold">Sistema de Chamada</div>
          <div className="flex flex-col items-end gap-2 min-w-[260px]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded px-3 py-1 min-w-[120px] min-h-[56px]">
                {weather && weather.main ? (
                  <>
                    {weather.weather && weather.weather[0] && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                        className="w-10 h-10"
                      />
                    )}
                    <div className="flex flex-col text-right">
                      <span className="text-lg font-bold">{Math.round(weather.main.temp)}°C</span>
                      <span className="text-xs capitalize">{weather.weather[0].description}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col text-right w-full animate-pulse">
                    <span className="text-lg font-bold text-gray-200">--°C</span>
                    <span className="text-xs text-gray-200">Carregando clima...</span>
                  </div>
                )}
              </div>
              <div className="text-5xl font-bold leading-tight">{formattedTime}</div>
            </div>
            <div className="text-2xl capitalize font-medium">{formattedDate}</div>
          </div>
        </header>
        
        {/* Main content area with two columns */}
        <div className="flex flex-1">
          {/* Left column - Video player (larger) */}
          <div className="flex-grow w-3/4 relative">
            <VideoPlayer />
          </div>
          
          {/* Right column - Ticket display (sidebar) */}
          <div className="w-1/4 min-w-[300px] border-l border-gray-300 bg-white bg-opacity-90 overflow-auto p-4">
            <TicketDisplay />
          </div>
        </div>
        
        {/* Footer bar */}
        <footer className="bg-white border-t p-4 flex justify-between items-center z-20">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/')}
          >
            Voltar
          </Button>
          
          <div className="text-gray-500 text-sm">
            Sistema de Gerenciamento de Filas
          </div>
        </footer>
      </div>
    </TicketProvider>
  );
};

export default DisplayPage;
