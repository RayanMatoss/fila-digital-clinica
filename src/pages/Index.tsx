import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-light p-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-primary-dark mb-8">Sistema de Chamada de Atendimento</h1>
        
        <div className="grid gap-6">
          <Button 
            className="h-16 text-xl bg-primary-dark text-primary-light hover:bg-primary-medium transition-colors"
            onClick={() => navigate('/display')}
          >
            Painel de Exibição
          </Button>
          
          <Button 
            className="h-16 text-xl bg-primary-dark text-primary-light hover:bg-primary-medium transition-colors"
            onClick={() => navigate('/admin')}
          >
            Administração
          </Button>
        </div>
        
        <p className="mt-8 text-primary-medium">
          Sistema de gerenciamento de filas e chamada de senhas para clínicas e hospitais
        </p>
      </div>
    </div>
  );
};

export default Index;
