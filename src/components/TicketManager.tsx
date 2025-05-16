
import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const TicketManager: React.FC = () => {
  const { rooms, tickets, addTicket, callNextTicket, completeTicket, getRoomTickets } = useTickets();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || '');

  const handleAddTicket = () => {
    if (!selectedRoomId) return;
    
    try {
      const newTicket = addTicket(selectedRoomId);
      toast.success(`Nova senha gerada: ${newTicket.number}`);
    } catch (error) {
      toast.error('Erro ao gerar senha');
    }
  };

  const handleCallNext = () => {
    if (!selectedRoomId) return;
    
    const calledTicket = callNextTicket(selectedRoomId);
    if (calledTicket) {
      toast.success(`Senha chamada: ${calledTicket.number}`);
    } else {
      toast.info('Não há senhas aguardando');
    }
  };

  const handleCompleteTicket = (ticketId: string) => {
    completeTicket(ticketId);
    toast.success('Atendimento finalizado');
  };

  // Get tickets for the selected room
  const waitingTickets = selectedRoomId ? getRoomTickets(selectedRoomId, 'waiting') : [];
  const calledTickets = selectedRoomId ? getRoomTickets(selectedRoomId, 'called') : [];

  // Find the currently selected room
  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  return (
    <div className="space-y-6">
      {/* Room Selection */}
      <div className="space-y-2">
        <label htmlFor="room-select" className="text-sm font-medium">
          Selecione uma sala
        </label>
        <Select
          value={selectedRoomId}
          onValueChange={setSelectedRoomId}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma sala" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          onClick={handleAddTicket}
          className="bg-clinic-blue hover:bg-clinic-darkBlue"
          disabled={!selectedRoomId}
        >
          Gerar Nova Senha
        </Button>
        <Button
          onClick={handleCallNext}
          className="bg-clinic-blue hover:bg-clinic-darkBlue"
          disabled={!selectedRoomId || waitingTickets.length === 0}
        >
          Chamar Próxima Senha
        </Button>
      </div>
      
      {selectedRoom && (
        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-lg mb-3">{selectedRoom.name}</h3>
          
          {/* Current ticket display */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-1">SENHA ATUAL</h4>
            <div className="text-xl font-bold text-clinic-blue">
              {selectedRoom.currentTicket || '---'}
            </div>
          </div>
          
          {/* Waiting tickets */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Senhas Aguardando ({waitingTickets.length})</h4>
            {waitingTickets.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {waitingTickets.map(ticket => (
                  <Card key={ticket.id} className="p-3 flex items-center justify-between">
                    <span>{ticket.number}</span>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Não há senhas aguardando</p>
            )}
          </div>
          
          {/* Called tickets */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Senhas Chamadas ({calledTickets.length})</h4>
            {calledTickets.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {calledTickets.map(ticket => (
                  <Card key={ticket.id} className="p-3 flex items-center justify-between">
                    <span>{ticket.number}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleCompleteTicket(ticket.id)}
                    >
                      Finalizar
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Não há senhas chamadas</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;
