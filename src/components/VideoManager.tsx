
import React, { useState } from 'react';
import { useTickets } from '../context/TicketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const VideoManager: React.FC = () => {
  const { videos, addVideo, removeVideo } = useTickets();
  const [newVideo, setNewVideo] = useState({
    title: '',
    url: '',
    duration: 0
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple URL validation
    if (!newVideo.title || !newVideo.url) {
      toast.error('Título e URL são obrigatórios');
      return;
    }
    
    // Convert YouTube watch URLs to embed URLs if needed
    let videoUrl = newVideo.url;
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URLSearchParams(new URL(videoUrl).search).get('v');
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    const videoData = {
      ...newVideo,
      url: videoUrl,
      duration: newVideo.duration || 0
    };
    
    addVideo(videoData);
    setNewVideo({ title: '', url: '', duration: 0 });
    toast.success('Vídeo adicionado com sucesso');
  };

  const handleRemoveVideo = (videoId: string) => {
    removeVideo(videoId);
    toast.success('Vídeo removido');
  };

  return (
    <div className="space-y-8">
      {/* Form to add a new video */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Adicionar Novo Vídeo</h3>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <Label htmlFor="new-video-title">Título do Vídeo</Label>
            <Input
              id="new-video-title"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              placeholder="Ex: Dicas de Saúde"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-video-url">URL do Vídeo</Label>
            <Input
              id="new-video-url"
              value={newVideo.url}
              onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Para YouTube, use URLs de incorporação (embed) ou URLs normais de vídeo
            </p>
          </div>

          <div>
            <Label htmlFor="new-video-duration">Duração (segundos)</Label>
            <Input
              id="new-video-duration"
              type="number"
              value={newVideo.duration || ''}
              onChange={(e) => setNewVideo({ ...newVideo, duration: parseInt(e.target.value) || 0 })}
              placeholder="Ex: 120"
            />
          </div>

          <Button type="submit" className="bg-clinic-blue hover:bg-clinic-darkBlue">
            Adicionar Vídeo
          </Button>
        </form>
      </div>

      {/* List of existing videos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vídeos Cadastrados</h3>
        <div className="grid gap-4">
          {videos.map(video => (
            <Card key={video.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{video.title}</h4>
                    <p className="text-gray-500 text-sm truncate max-w-xs">{video.url}</p>
                    {video.duration > 0 && (
                      <p className="text-gray-500 text-sm">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveVideo(video.id)}
                  >
                    Remover
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            Nenhum vídeo cadastrado
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoManager;
