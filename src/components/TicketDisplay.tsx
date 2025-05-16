
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
    <div className="flex flex-col space-y-4 w-full">
      <h2 className="text-xl font-bold text-center text-clinic-blue mb-2">Senhas</h2>
      
      {displayRooms.map(room => (
        <Card key={room.id} className={cn(
          "overflow-hidden transition-all duration-500",
          animatingTickets[room.id] ? "ring-2 ring-clinic-blue" : ""
        )}>
          <CardHeader className="bg-clinic-blue text-white p-2 text-center">
            <h3 className="font-semibold text-sm">{room.name}</h3>
          </CardHeader>
          
          <CardContent className="p-3">
            {/* Current ticket display */}
            {room.currentTicket ? (
              <div className="flex flex-col items-center justify-center">
                <div className="text-gray-600 text-sm font-medium">SENHA ATUAL</div>
                <div className={cn(
                  "text-clinic-blue font-bold transition-all duration-1000",
                  animatingTickets[room.id] 
                    ? "text-5xl animate-pulse-scale" 
                    : "text-4xl"
                )}>
                  {room.currentTicket}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-16 text-gray-400 text-sm">
                Aguardando chamada...
              </div>
            )}
            
            {/* Ticket history */}
            {room.ticketHistory.length > 0 && (
              <div className="mt-2">
                <div className="text-gray-500 text-xs mb-1">ÚLTIMAS CHAMADAS</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {room.ticketHistory.map((ticketNumber, index) => (
                    <div 
                      key={`${room.id}-${ticketNumber}-${index}`}
                      className="px-2 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-600"
                    >
                      {ticketNumber}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TicketDisplay;
