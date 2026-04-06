import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

// interface UserData {
//   email: string;
//   perfil: 'docente' | 'coordenador' | 'tecnico';
// }

export default function LayoutBase() {
  const [sidebarAberta, setSidebarAberta] = useState(true);
  
  const [perfilTeste, setPerfilTeste] = useState<'docente' | 'coordenador' | 'tecnico'>('docente');
  const emailLogado = 'professor@cps.sp.gov.br';

  /* PREPARAÇÃO PARA INTEGRAÇÃO:
    useEffect(() => {
      const buscarDadosUsuario = async () => {
        try {
          const response = await api.get('/auth/me');
          // setPerfilTeste(response.data.perfil);
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      };
      buscarDadosUsuario();
    }, []);
  */

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden relative">
      
      <div className="fixed top-2 right-2 z-[60] flex gap-2 opacity-30 hover:opacity-100 transition-opacity p-2 bg-white/80 rounded-lg shadow-sm border border-gray-200">
        <span className="text-[10px] font-bold text-gray-500 self-center mr-1 uppercase">Dev Switch:</span>
        <button 
          onClick={() => setPerfilTeste('docente')} 
          className={`px-2 py-1 text-xs rounded font-bold transition-colors ${perfilTeste === 'docente' ? 'bg-[#B20000] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Docente
        </button>
        <button 
          onClick={() => setPerfilTeste('coordenador')} 
          className={`px-2 py-1 text-xs rounded font-bold transition-colors ${perfilTeste === 'coordenador' ? 'bg-[#B20000] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Coord
        </button>
        <button 
          onClick={() => setPerfilTeste('tecnico')} 
          className={`px-2 py-1 text-xs rounded font-bold transition-colors ${perfilTeste === 'tecnico' ? 'bg-[#B20000] text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Técnico
        </button>
      </div>

      {sidebarAberta && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      <Sidebar 
        tipoUsuario={perfilTeste} 
        usuarioEmail={emailLogado} 
        onFechar={() => setSidebarAberta(false)} 
        isOpen={sidebarAberta}
      />
      
      <main className={`flex-1 h-full overflow-y-auto relative transition-all duration-300 ${
        sidebarAberta ? 'md:ml-[280px]' : 'ml-0'
      }`}>
        
        {!sidebarAberta && (
          <button 
            onClick={() => setSidebarAberta(true)}
            className="absolute top-6 left-6 z-30 p-2 bg-[#B20000] text-white rounded-lg shadow-md hover:bg-red-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        )}

        <Outlet />
      </main>
    </div>
  );
}