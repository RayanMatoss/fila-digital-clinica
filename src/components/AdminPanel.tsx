
import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoomManager from './RoomManager';
import TicketManager from './TicketManager';
import VideoManager from './VideoManager';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tickets');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-clinic-blue mb-6">Painel Administrativo</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="tickets">Senhas</TabsTrigger>
          <TabsTrigger value="rooms">Salas</TabsTrigger>
          <TabsTrigger value="videos">Vídeos</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <TicketManager />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomManager />
        </TabsContent>

        <TabsContent value="videos">
          <VideoManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
