
export interface Ticket {
  id: string;
  number: string;
  roomId: string;
  status: 'waiting' | 'called' | 'completed';
  createdAt: Date;
  calledAt?: Date;
  completedAt?: Date;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  prefix: string; // Prefix used for ticket numbers, e.g., "C" for Consultation
  currentTicket: string | null;
  ticketHistory: string[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
}
