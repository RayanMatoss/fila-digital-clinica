
import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const RoomManager: React.FC = () => {
  const { rooms, addRoom, updateRoom } = useTickets();
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    prefix: ''
  });
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    prefix: ''
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoom.name || !newRoom.prefix) {
      toast.error('Nome e prefixo são obrigatórios');
      return;
    }
    
    addRoom(newRoom);
    setNewRoom({ name: '', description: '', prefix: '' });
    toast.success('Sala adicionada com sucesso');
  };

  const startEditing = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    setEditingRoom(roomId);
    setEditForm({
      name: room.name,
      description: room.description,
      prefix: room.prefix
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;
    
    updateRoom(editingRoom, editForm);
    setEditingRoom(null);
    toast.success('Sala atualizada com sucesso');
  };

  return (
    <div className="space-y-8">
      {/* Form to add a new room */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Adicionar Nova Sala</h3>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-room-name">Nome da Sala</Label>
            <Input
              id="new-room-name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="Ex: Consultório Médico"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-room-description">Descrição</Label>
            <Input
              id="new-room-description"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              placeholder="Ex: Consultas gerais"
            />
          </div>

          <div>
            <Label htmlFor="new-room-prefix">Prefixo da Senha</Label>
            <Input
              id="new-room-prefix"
              value={newRoom.prefix}
              onChange={(e) => setNewRoom({ ...newRoom, prefix: e.target.value.toUpperCase() })}
              placeholder="Ex: CM"
              required
              maxLength={3}
              className="uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usado para gerar senhas únicas (ex: CM001, EX002)
            </p>
          </div>

          <Button type="submit" className="bg-clinic-blue hover:bg-clinic-darkBlue">
            Adicionar Sala
          </Button>
        </form>
      </div>

      {/* List of existing rooms */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Salas Existentes</h3>
        <div className="grid gap-4">
          {rooms.map(room => (
            <Card key={room.id}>
              <CardContent className="p-4">
                {editingRoom === room.id ? (
                  // Edit form for this room
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor={`edit-room-name-${room.id}`}>Nome da Sala</Label>
                      <Input
                        id={`edit-room-name-${room.id}`}
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`edit-room-description-${room.id}`}>Descrição</Label>
                      <Input
                        id={`edit-room-description-${room.id}`}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`edit-room-prefix-${room.id}`}>Prefixo</Label>
                      <Input
                        id={`edit-room-prefix-${room.id}`}
                        value={editForm.prefix}
                        onChange={(e) => setEditForm({ ...editForm, prefix: e.target.value.toUpperCase() })}
                        required
                        maxLength={3}
                        className="uppercase"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="bg-clinic-blue hover:bg-clinic-darkBlue">
                        Salvar
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setEditingRoom(null)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Display room information
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">
                          {room.name} <span className="text-sm font-normal text-gray-500">({room.prefix})</span>
                        </h4>
                        <p className="text-gray-600 text-sm">{room.description}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEditing(room.id)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {rooms.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            Nenhuma sala cadastrada
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomManager;
