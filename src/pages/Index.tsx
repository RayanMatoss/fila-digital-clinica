
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-clinic-grey p-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-clinic-blue mb-8">Sistema de Chamada de Atendimento</h1>
        
        <div className="grid gap-6">
          <Button 
            className="h-16 text-xl bg-clinic-blue hover:bg-clinic-darkBlue"
            onClick={() => navigate('/display')}
          >
            Painel de Exibição
          </Button>
          
          <Button 
            variant="outline" 
            className="h-16 text-xl border-clinic-blue text-clinic-blue hover:bg-clinic-blue hover:text-white"
            onClick={() => navigate('/admin')}
          >
            Administração
          </Button>
        </div>
        
        <p className="mt-8 text-gray-500">
          Sistema de gerenciamento de filas e chamada de senhas para clínicas e hospitais
        </p>
      </div>
    </div>
  );
};

export default Index;
