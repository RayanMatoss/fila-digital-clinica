import React, { useState, useEffect } from 'react';
import { useTickets } from '../context/TicketContext';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface TicketDisplayProps {
  roomId?: string;
}

const TicketDisplay: React.FC<TicketDisplayProps> = ({ roomId }) => {
  const { rooms } = useTickets();
  const [animatingTickets, setAnimatingTickets] = useState<Record<string, boolean>>({});
  
  // If roomId is provided, show only that room, otherwise show all rooms
  const displayRooms = roomId 
    ? rooms.filter(room => room.id === roomId)
    : rooms;

  // Monitor changes to current tickets and trigger animations
  useEffect(() => {
    const newAnimatingState: Record<string, boolean> = {};
    
    displayRooms.forEach(room => {
      if (room.currentTicket) {
        newAnimatingState[room.id] = true;
      }
    });
    
    // Set animating state for new tickets
    setAnimatingTickets(prev => ({...prev, ...newAnimatingState}));
    
    // After animation completes, set animating to false
    const timer = setTimeout(() => {
      const resetState: Record<string, boolean> = {};
      Object.keys(newAnimatingState).forEach(key => {
        resetState[key] = false;
      });
      
      setAnimatingTickets(prev => ({...prev, ...resetState}));
    }, 5000); // 5 seconds animation duration
    
    return () => clearTimeout(timer);
  }, [displayRooms.map(room => room.currentTicket).join(',')]);

  return (
    <div className="flex flex-col w-full">
      {/* <h2 className="text-xl font-bold text-center text-clinic-blue mb-0">Senhas</h2> */}
      {displayRooms.map(room => (
        <Card key={room.id} className={cn(
          "overflow-hidden transition-all duration-500 w-full bg-white border border-gray-300 rounded-lg my-2 p-0 flex flex-col items-center justify-center",
          animatingTickets[room.id] ? "ring-2 ring-clinic-blue" : ""
        )}>
          <CardContent className="flex flex-col items-center justify-center p-3">
            {/* Tipo de atendimento */}
            <div className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-widest">
              {room.name}
            </div>
            {/* Senha */}
            <div className="text-4xl font-extrabold text-orange-600 mb-1" style={{letterSpacing: '2px'}}>
              {room.currentTicket || '---'}
            </div>
            {/* Nome da sala */}
            <div className="text-base font-bold text-gray-700 mt-1 uppercase tracking-wide">
              {room.name}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketDisplay;
