import { useState, useMemo, useRef, useEffect } from 'react';

import iconSala from '../../assets/sala.svg';
import iconPesquisa from '../../assets/pesquisa.svg';
import iconSeta from '../../assets/seta.svg';
import iconX from '../../assets/x.svg';
import imgSala from '../../assets/sala.png';

const initialSalas = [
  {
    id: 1,
    nome: 'Sala 30',
    capacidade: 30,
    maquinas: [
      { nome: 'Desktops', qtd: 30 },
      { nome: 'Projetor', qtd: 1 },
      { nome: 'Televisão', qtd: 1 }
    ],
    tecnologias: ['Excel', 'MySQL', 'Node', 'Java', 'Python', 'Photoshop', 'Word', 'Visual Studio Code', 'Git'],
    imagem: imgSala
  },
  {
    id: 2,
    nome: 'Sala 31',
    capacidade: 40,
    maquinas: [
      { nome: 'Desktops', qtd: 40 },
      { nome: 'Projetor', qtd: 1 }
    ],
    tecnologias: ['Excel', 'Word', 'PowerPoint'],
    imagem: imgSala
  },
  {
    id: 3,
    nome: 'Sala 32',
    capacidade: 20,
    maquinas: [
      { nome: 'Notebooks', qtd: 20 },
      { nome: 'Televisão', qtd: 2 }
    ],
    tecnologias: ['Android Studio', 'Java', 'Git'],
    imagem: imgSala
  }
];

const styles = `
  .lista-salas-container {
    padding: 2rem 4rem;
    background-color: #FAFAFA;
    min-height: 100vh;
    font-family: 'Inter', sans-serif;
  }

  .toast-mensagem {
    position: fixed; top: 20px; right: 20px; padding: 16px 24px;
    border-radius: 8px; color: white; font-weight: 600;
    z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out forwards;
  }
  .toast-mensagem.sucesso { background-color: #005C6D; }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .header-salas { margin-bottom: 2rem; }
  .header-title-wrapper { display: flex; align-items: center; gap: 20px; }
  .icon-header { width: 84px; height: auto; }
  .title-salas { font-family: 'Roboto Slab', serif; font-weight: 700; font-size: 64px; color: #005C6D; margin: 0; }
  .header-line { margin-top: 10px; height: 20px; background: #B20000; border-radius: 10px; width: 355px; position: relative; }
  .header-line::after {
    content: ''; position: absolute; left: calc(100% - 5px); top: 8px;
    width: 412px; height: 4px; background-color: #B20000;
  }

  .search-container { display: flex; margin: 2rem 0; max-width: 765px; height: 69px; }
  .search-input {
    flex: 1; border: 1px solid #818181; border-right: none;
    border-radius: 34px 0 0 34px; padding: 0 24px; font-size: 18px; color: #333; outline: none;
  }
  .search-button {
    width: 97px; background: #FFFFFF; border: 1px solid #818181;
    border-radius: 0 34px 34px 0; cursor: pointer; display: flex; align-items: center; justify-content: center;
  }

  .filters-container { display: flex; gap: 1rem; margin-bottom: 3rem; }
  .filter-box {
    background: #FFFFFF; border: 1px solid #757575; border-radius: 8px;
    height: 46px; display: flex; align-items: center; padding: 0 16px; cursor: pointer; min-width: 200px; position: relative;
  }
  .dropdown-menu {
    position: absolute; top: calc(100% + 4px); left: 0; background: white; 
    border: 1px solid #757575; border-radius: 8px; padding: 8px; z-index: 10; min-width: 100%;
  }
  .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 8px; cursor: pointer; font-size: 14px; }

  .salas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 2.5rem; }
  .sala-card { background: #FFFFFF; border: 4px solid #757575; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; }
  .sala-imagem { width: 100%; height: 181px; object-fit: cover; border-bottom: 4px solid #757575; }
  .sala-info { padding: 1.5rem 2rem; display: flex; flex-direction: column; flex: 1; }
  .sala-nome-card { font-family: 'Roboto Slab', serif; font-weight: 500; font-size: 40px; color: #005C6D; margin: 0 0 1rem 0; border-left: 4px solid #005C6D; padding-left: 1rem; }
  
  .info-label { font-weight: 500; font-size: 20px; color: #757575; margin-bottom: 8px; display: block; }
  .pills-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1.5rem; }
  .pill-red { background: #B20000; color: #FFFFFF; border-radius: 20px; padding: 4px 12px; font-size: 14px; }
  .pill-gray { background: #757575; color: #FFFFFF; border-radius: 20px; padding: 6px 14px; font-size: 13px; }
  
  .btn-editar { margin-top: auto; background: #005C6D; color: #FFFFFF; border: none; border-radius: 20px; padding: 12px 0; font-size: 18px; font-weight: 600; cursor: pointer; }

  /* Modal de Edição */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
  .modal-content { background: #FFFFFF; border-radius: 20px; width: 100%; max-width: 700px; padding: 32px; position: relative; }
  .btn-close { position: absolute; top: 24px; right: 24px; background: none; border: none; cursor: pointer; }
  .modal-title { font-family: 'Roboto Slab', serif; font-size: 32px; color: #005C6D; margin-bottom: 24px; border-left: 4px solid #005C6D; padding-left: 12px; }
  
  .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-weight: 700; color: #3B3D41; }
  .form-group input, .form-group select { padding: 12px; border: 2px solid #D5D7D9; border-radius: 12px; outline: none; }
  
  .pill-editable { display: flex; align-items: center; gap: 8px; }
  .btn-remove-pill { background: none; border: none; color: white; cursor: pointer; font-weight: bold; padding: 0 4px; }
  
  /* Botão de Adicionar (Círculo cinza do Figma) */
  .btn-circle-add {
    width: 28px; height: 28px; border-radius: 50%; border: 2px solid #757575;
    background: none; color: #757575; font-size: 18px; font-weight: bold;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
  }

  .modal-footer { display: flex; gap: 16px; margin-top: 24px; }
  .btn-save { flex: 1; padding: 14px; background: #B20000; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }
  .btn-cancel { flex: 1; padding: 14px; background: white; border: 1px solid #D5D7D9; border-radius: 12px; cursor: pointer; }
`;

export default function ListaSalasTecnico() {
  const [salas, setSalas] = useState(initialSalas);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [salaEditando, setSalaEditando] = useState<any>(null);

  const salasFiltradas = useMemo(() => {
    let resultado = [...salas];
    if (busca.trim() !== '') {
      resultado = resultado.filter(sala => 
        sala.nome.toLowerCase().includes(busca.toLowerCase()) ||
        sala.tecnologias.some(tec => tec.toLowerCase().includes(busca.toLowerCase()))
      );
    }
    return resultado;
  }, [busca, salas]);

  const abrirEdicao = (sala: any) => {
    setSalaEditando(JSON.parse(JSON.stringify(sala)));
    setModalEdicaoAberto(true);
  };

  const salvarEdicao = () => {
    setSalas(prev => prev.map(s => s.id === salaEditando.id ? salaEditando : s));
    setMensagem('Informações da sala atualizadas com sucesso!');
    setModalEdicaoAberto(false);
    setTimeout(() => setMensagem(null), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="lista-salas-container">
        
        {mensagem && <div className="toast-mensagem sucesso">{mensagem}</div>}

        <header className="header-salas">
          <div className="header-title-wrapper">
            <img src={iconSala} alt="Ícone Salas" className="icon-header" />
            <h1 className="title-salas">Salas</h1>
          </div>
          <div className="header-line"></div>
        </header>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Pesquise uma sala ou tecnologia..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="search-input"
          />
          <button className="search-button"><img src={iconPesquisa} alt="Buscar" /></button>
        </div>

        <div className="salas-grid">
          {salasFiltradas.map(sala => (
            <div key={sala.id} className="sala-card">
              <img src={sala.imagem} alt={sala.nome} className="sala-imagem" />
              <div className="sala-info">
                <h2 className="sala-nome-card">{sala.nome}</h2>
                
                <span className="info-label">Capacidade: <span className="pill-red" style={{display: 'inline-block', marginLeft: '8px'}}>{sala.capacidade} alunos</span></span>
                
                <span className="info-label">Máquinas:</span>
                <div className="pills-container">
                  {sala.maquinas.map((maq, i) => (
                    <span key={i} className="pill-red">{maq.nome}</span>
                  ))}
                </div>

                <span className="info-label">Tecnologias:</span>
                <div className="pills-container">
                  {sala.tecnologias.slice(0, 3).map((tec, i) => (
                    <span key={i} className="pill-red">{tec}</span>
                  ))}
                  {sala.tecnologias.length > 3 && <span className="pill-red">+ Mais</span>}
                </div>

                <button className="btn-editar" onClick={() => abrirEdicao(sala)}>
                  Editar sala
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalEdicaoAberto && salaEditando && (
          <div className="modal-overlay" onClick={() => setModalEdicaoAberto(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn-close" onClick={() => setModalEdicaoAberto(false)}>
                <img src={iconX} alt="Fechar" />
              </button>
              
              <h2 className="modal-title">Editar {salaEditando.nome}</h2>

              <div className="form-group">
                <label>Capacidade da sala:</label>
                <div className="pill-red" style={{width: 'fit-content'}}>{salaEditando.capacidade} alunos</div>
              </div>

              <div className="form-group">
                <label>Máquinas:</label>
                <div className="pills-container">
                  {salaEditando.maquinas.map((m: any, i: number) => (
                    <span key={i} className="pill-gray pill-editable">{m.nome}: {m.qtd}</span>
                  ))}
                  <button className="btn-circle-add">+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Tecnologias:</label>
                <div className="pills-container">
                  {salaEditando.tecnologias.map((tec: string, i: number) => (
                    <span key={i} className="pill-gray pill-editable">{tec} <img src={iconX} width="10" style={{filter: 'brightness(0) invert(1)'}}/></span>
                  ))}
                  <button className="btn-circle-add">+</button>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalEdicaoAberto(false)}>Cancelar</button>
                <button className="btn-save" onClick={salvarEdicao}>Confirmar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}