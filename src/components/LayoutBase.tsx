import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import xSvg from '../assets/x.svg';
import dataSvg from '../assets/data.svg';
import salaSvg from '../assets/sala.svg';
import reservaSvg from '../assets/reserva.svg';
import chamadosTiSvg from '../assets/chamadosti.svg';
import fatecSvg from '../assets/fatecitaquera.svg';
import criacaoSvg from '../assets/criação.svg';

const menusPorUsuario = {
  docente: [
    { nome: 'Calendário', path: '/calendario', icone: dataSvg },
    { nome: 'Salas', path: '/listar-salas-docentes', icone: salaSvg },
    { nome: 'Minhas Reservas', path: '/minhas-reservas', icone: reservaSvg },
    { nome: 'Chamados de TI', path: '/chamados', icone: chamadosTiSvg },
  ],
  coordenador: [
    { nome: 'Reservas Solicitadas', path: '/reservas-solicitadas', icone: reservaSvg },
    { nome: 'Calendário de reservas', path: '/calendario-geral', icone: dataSvg },
    { nome: 'Criação de Usuário', path: '/criar-usuario', icone: criacaoSvg },
    { nome: 'Frequência de Salas', path: '/frequencia', icone: salaSvg },
  ],
  tecnico: [
    { nome: 'Salas', path: '/listar-salas-tecnico', icone: salaSvg },
    { nome: 'Chamados T.I.', path: '/chamados-ti', icone: chamadosTiSvg },
  ]
};

interface SidebarProps {
  tipoUsuario: 'docente' | 'coordenador' | 'tecnico';
  usuarioEmail: string;
  onFechar: () => void;
  isOpen: boolean; 
}

export default function Sidebar({ tipoUsuario, usuarioEmail, onFechar, isOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuAtual = menusPorUsuario[tipoUsuario];

  const handleLogout = () => {
    /* PREPARAÇÃO PARA INTEGRAÇÃO:
      localStorage.removeItem('token');
      api.defaults.headers.common['Authorization'] = undefined;
    */
    navigate('/login');
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-50 w-[280px] bg-[#B20000] text-white flex flex-col justify-between py-6 
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      
      <button 
        onClick={onFechar}
        className="absolute top-4 right-4 p-2 hover:bg-black/10 rounded-full transition-colors"
      >
        <img src={xSvg} alt="Fechar menu" className="w-4 h-4" />
      </button>

      <div className="flex flex-col px-6 mt-4">
        <div className="flex justify-center mb-10">
          <img src={logoSvg} alt="Logo Sala Fácil" className="w-32 h-auto" />
        </div>

        <nav className="flex flex-col gap-2">
          {menuAtual.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.nome}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) onFechar(); }} 
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-black/20 font-bold' : 'hover:bg-black/10 font-medium'
                }`}
              >
                {item.icone ? (
                  <img src={item.icone} alt={`Ícone ${item.nome}`} className="w-5 h-5" />
                ) : (
                  <div className="w-5 h-5 bg-white/20 rounded-sm"></div>
                )}
                {item.nome}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6 flex flex-col gap-4">
        <div className="w-full h-[1px] bg-white/30"></div>
        <div className="flex items-center mt-1">
          <img src={fatecSvg} alt="Logo Fatec Itaquera" className="h-6 w-auto" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-bold">
              {usuarioEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm capitalize">{tipoUsuario}</span>
            <span className="text-xs text-white/80">{usuarioEmail}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 mt-2 text-white/90 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="font-bold text-sm">Sair</span>
        </button>
      </div>
    </div>
  );
}