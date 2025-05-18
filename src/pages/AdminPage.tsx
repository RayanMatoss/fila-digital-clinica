import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import { TicketProvider } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TicketProvider>
      <div className="min-h-screen flex flex-col bg-primary-light">
        {/* Header bar */}
        <header className="bg-primary-dark text-primary-light p-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl font-semibold">Administração do Sistema de Chamadas</h1>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="text-primary-dark border-primary-dark bg-primary-light hover:bg-primary-dark hover:text-primary-light"
                onClick={() => window.open('/display', 'painel_exibicao', 'width=1024,height=768')}
              >
                Abrir Painel em Nova Janela
              </Button>
              <Button 
                variant="outline" 
                className="text-primary-dark border-primary-dark bg-primary-light hover:bg-primary-dark hover:text-primary-light"
                onClick={() => navigate('/display')}
              >
                Ver Painel
              </Button>
              <Button 
                variant="outline" 
                className="text-primary-dark border-primary-dark bg-primary-light hover:bg-primary-dark hover:text-primary-light"
                onClick={() => navigate('/')}
              >
                Início
              </Button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <AdminPanel />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-primary-medium border-t border-primary-dark p-4">
          <div className="max-w-5xl mx-auto text-center text-primary-dark text-sm">
            Sistema de Gerenciamento de Filas &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </TicketProvider>
  );
};

export default AdminPage;
