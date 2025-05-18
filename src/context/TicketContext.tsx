import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Ticket, Room, Video } from "../types";

interface TicketContextProps {
  tickets: Ticket[];
  rooms: Room[];
  videos: Video[];
  addTicket: (roomId: string) => Ticket;
  callNextTicket: (roomId: string) => Ticket | null;
  completeTicket: (ticketId: string) => void;
  getRoomTickets: (roomId: string, status?: 'waiting' | 'called' | 'completed') => Ticket[];
  updateRoom: (roomId: string, data: Partial<Room>) => void;
  addRoom: (room: Omit<Room, 'id' | 'currentTicket' | 'ticketHistory'>) => Room;
  addVideo: (video: Omit<Video, 'id'>) => Video;
  removeVideo: (videoId: string) => void;
}

const TicketContext = createContext<TicketContextProps | null>(null);

// Sample data for initial setup
const sampleRooms: Room[] = [
  {
    id: "1",
    name: "Consultório Médico",
    description: "Consultas gerais",
    prefix: "CM",
    currentTicket: null,
    ticketHistory: []
  },
  {
    id: "2",
    name: "Sala de Exames",
    description: "Exames laboratoriais",
    prefix: "EX",
    currentTicket: null,
    ticketHistory: []
  },
  {
    id: "3",
    name: "Psicologia",
    description: "Atendimento psicológico",
    prefix: "PS",
    currentTicket: null,
    ticketHistory: []
  },
];

const sampleVideos: Video[] = [
  {
    id: "1",
    title: "Dicas de Saúde",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 120
  },
  {
    id: "2",
    title: "Exercícios para o Dia a Dia",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: 180
  }
];

export const TicketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<Room[]>(sampleRooms);
  const [videos, setVideos] = useState<Video[]>(sampleVideos);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('tickets');
    const savedRooms = localStorage.getItem('rooms');
    const savedVideos = localStorage.getItem('videos');
    
    if (savedTickets) setTickets(JSON.parse(savedTickets));
    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedVideos) setVideos(JSON.parse(savedVideos));

    // Adiciona listener para sincronização entre janelas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tickets' && e.newValue) {
        setTickets(JSON.parse(e.newValue));
      }
      if (e.key === 'rooms' && e.newValue) {
        setRooms(JSON.parse(e.newValue));
      }
      if (e.key === 'videos' && e.newValue) {
        setVideos(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem('tickets', JSON.stringify(tickets));
      localStorage.setItem('rooms', JSON.stringify(rooms));
      localStorage.setItem('videos', JSON.stringify(videos));
    };

    // Usa requestAnimationFrame para evitar múltiplas atualizações simultâneas
    requestAnimationFrame(saveData);
  }, [tickets, rooms, videos]);

  const generateTicketNumber = (prefix: string) => {
    const randomNum = Math.floor(100 + Math.random() * 900); // Generate number between 100-999
    return `${prefix}${randomNum}`;
  };

  const addTicket = (roomId: string): Ticket => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) throw new Error("Room not found");
    
    const newTicket: Ticket = {
      id: Date.now().toString(),
      number: generateTicketNumber(room.prefix),
      roomId,
      status: 'waiting',
      createdAt: new Date(),
    };
    
    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  };

  const callNextTicket = (roomId: string): Ticket | null => {
    // Find the next waiting ticket for this room
    const nextTicket = tickets.find(t => t.roomId === roomId && t.status === 'waiting');
    if (!nextTicket) return null;
    
    // Update the ticket status
    const updatedTicket = { 
      ...nextTicket, 
      status: 'called' as const, 
      calledAt: new Date() 
    };
    
    setTickets(prev => 
      prev.map(t => t.id === nextTicket.id ? updatedTicket : t)
    );
    
    // Update the room with this ticket and history
    setRooms(prev => 
      prev.map(room => {
        if (room.id === roomId) {
          const newHistory = [
            room.currentTicket, 
            ...room.ticketHistory
          ].filter(Boolean) as string[];
          
          return {
            ...room,
            currentTicket: nextTicket.number,
            ticketHistory: newHistory.slice(0, 4) // Keep only last 4 tickets
          };
        }
        return room;
      })
    );
    
    return updatedTicket;
  };

  const completeTicket = (ticketId: string): void => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    
    setTickets(prev => 
      prev.map(t => 
        t.id === ticketId 
          ? { ...t, status: 'completed', completedAt: new Date() } 
          : t
      )
    );
  };

  const getRoomTickets = (
    roomId: string, 
    status?: 'waiting' | 'called' | 'completed'
  ): Ticket[] => {
    return tickets.filter(
      t => t.roomId === roomId && (!status || t.status === status)
    );
  };

  const updateRoom = (roomId: string, data: Partial<Room>): void => {
    setRooms(prev => 
      prev.map(room => 
        room.id === roomId 
          ? { ...room, ...data } 
          : room
      )
    );
  };

  const addRoom = (room: Omit<Room, 'id' | 'currentTicket' | 'ticketHistory'>): Room => {
    const newRoom: Room = {
      id: Date.now().toString(),
      ...room,
      currentTicket: null,
      ticketHistory: []
    };
    
    setRooms(prev => [...prev, newRoom]);
    return newRoom;
  };

  const addVideo = (video: Omit<Video, 'id'>): Video => {
    const newVideo: Video = {
      id: Date.now().toString(),
      ...video
    };
    
    setVideos(prev => [...prev, newVideo]);
    return newVideo;
  };

  const removeVideo = (videoId: string): void => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  return (
    <TicketContext.Provider value={{
      tickets,
      rooms,
      videos,
      addTicket,
      callNextTicket,
      completeTicket,
      getRoomTickets,
      updateRoom,
      addRoom,
      addVideo,
      removeVideo
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};