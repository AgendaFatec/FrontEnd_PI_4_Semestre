import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoSvg from '../assets/logo.svg';
import xSvg from '../assets/xBranco.svg';
import dataSvg from '../assets/calendario.svg';
import salaSvg from '../assets/salaBranco.svg';
import reservaSvg from '../assets/reserva.svg';
import chamadosTiSvg from '../assets/chamadosti.svg';
import fatecSvg from '../assets/fatecitaquera.svg';
import criacaoSvg from '../assets/criação.svg';
import usuarioSvg from '../assets/usuario.svg';

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
  nomeUsuario: string;
  usuarioEmail: string;
  onFechar: () => void;
  isOpen: boolean;
}

export default function Sidebar({ tipoUsuario, nomeUsuario, usuarioEmail, onFechar, isOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const menuAtual = menusPorUsuario[tipoUsuario];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div
      className={`
        fixed inset-y-0 left-0 z-50 w-[280px]
        bg-[#B20000] text-white flex flex-col
        py-6
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <button
        onClick={onFechar}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition z-50"
      >
        <img src={xSvg} alt="Fechar menu" className="w-4 h-4" />
      </button>

      <div className="flex flex-col">
        <div className="flex justify-center mb-8 px-6">
          <img src={logoSvg} alt="Logo Sala Fácil" className="w-32 h-auto" />
        </div>

        <nav className="flex flex-col">
          {menuAtual.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.nome}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) onFechar();
                }}
                className={`
                  flex items-center gap-5 px-10 py-3
                  transition-all
                  ${isActive
                    ? 'bg-black/20 border-r-[6px] border-white font-semibold'
                    : 'hover:bg-white/10 font-medium'
                  }
                `}
              >
                <img src={item.icone} alt="" className="w-5 h-5" />
                <span className="text-[16px] tracking-wide">
                  {item.nome}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-10 flex flex-col gap-3 mt-auto">
        <div className="w-full h-[1px] bg-white/20"></div>

        <div className="flex items-center mt-1">
          <img src={fatecSvg} alt="Fatec Itaquera" className="h-6 w-auto" />
        </div>

<div className="flex items-center gap-4">
          
          {/* FOTO ATUALIZADA */}
          <img src={usuarioSvg} alt="Foto do usuário" className="w-10 h-10 shrink-0" />

          {/* NOME E EMAIL ATUALIZADOS */}
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-sm capitalize truncate">
              {nomeUsuario}
            </span>
            <span className="text-[11px] text-white/80 truncate">
              {usuarioEmail}
            </span>
          </div>
          
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 rounded-lg font-semibold hover:bg-white/10 transition w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>

          <span className="text-[15px]">Sair</span>
        </button>
      </div>
    </div>
  );
}