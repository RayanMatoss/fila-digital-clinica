import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import { TicketProvider } from '@/context/TicketContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <TicketProvider>
      <div className="min-h-screen flex flex-col bg-clinic-grey">
        {/* Header bar */}
        <header className="bg-clinic-blue text-white p-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-xl font-semibold">Administração do Sistema de Chamadas</h1>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="text-gray-500 border-white bg-white hover:text-clinic-blue hover:bg-white"
                onClick={() => window.open('/display', 'painel_exibicao', 'width=1024,height=768')}
              >
                Abrir Painel em Nova Janela
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-500 border-white bg-white hover:text-clinic-blue hover:bg-white"
                onClick={() => navigate('/display')}
              >
                Ver Painel
              </Button>
              <Button 
                variant="outline" 
                className="text-gray-500 border-white bg-white hover:text-clinic-blue hover:bg-white"
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
        <footer className="bg-white border-t p-4">
          <div className="max-w-5xl mx-auto text-center text-gray-500 text-sm">
            Sistema de Gerenciamento de Filas &copy; {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </TicketProvider>
  );
};

export default AdminPage;
