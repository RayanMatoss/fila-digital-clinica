
import React, { useState, useEffect } from 'react';
import { useTickets } from '../context/TicketContext';
import { Video } from '../types';

const VideoPlayer: React.FC = () => {
  const { videos } = useTickets();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (videos.length === 0) return;

    // Rotate to next video every few minutes
    const interval = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, 5 * 60 * 1000); // Change video every 5 minutes

    return () => clearInterval(interval);
  }, [videos.length]);

  if (videos.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <div className="text-gray-400 text-xl">Nenhum vídeo disponível</div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div className="w-full h-full">
      <iframe
        className="w-full h-full"
        src={`${currentVideo.url}?autoplay=${playing ? 1 : 0}&mute=0`}
        title={currentVideo.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
