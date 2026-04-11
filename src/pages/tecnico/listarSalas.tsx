<<<<<<< HEAD
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
=======
import React, { useState, useMemo, useRef, useEffect } from 'react';

import iconSala from '../../assets/sala.svg';
import iconPesquisa from '../../assets/pesquisa.svg';
import iconSeta from '../../assets/seta.svg';
import iconX from '../../assets/x.svg';
import imgSala from '../../assets/sala.png';
import imgSala2 from '../../assets/sala2.png';
import imgSala3 from '../../assets/sala3.png';
import imgSala4 from '../../assets/sala4.png';
import imgSala5 from '../../assets/sala5.png';
import imgSala6 from '../../assets/sala6.png';
import imgSala7 from '../../assets/sala7.png';
import imgSala8 from '../../assets/sala8.png';
import imgSala9 from '../../assets/sala9.png';

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
    imagem: imgSala,
    fotos: [imgSala, imgSala4, imgSala5]
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
    imagem: imgSala2,
    fotos: [imgSala2, imgSala6, imgSala7]
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
    imagem: imgSala3,
    fotos: [imgSala3, imgSala8, imgSala9]
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

  /* Modal de Edição principal e sub-modais */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
  .sub-modal-overlay { z-index: 1001; background: rgba(0, 0, 0, 0.6); }
  .modal-content { background: #FFFFFF; border-radius: 20px; width: 100%; max-width: 700px; padding: 32px; position: relative; max-height: 90vh; overflow-y: auto; }
  .sub-modal-content { max-width: 400px; }
  .btn-close { position: absolute; top: 24px; right: 24px; background: none; border: none; cursor: pointer; }
  .modal-title { font-family: 'Roboto Slab', serif; font-size: 32px; color: #005C6D; margin-bottom: 24px; border-left: 4px solid #005C6D; padding-left: 12px; }
  
  .form-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-weight: 700; color: #3B3D41; }
  .form-group input, .form-group select { padding: 12px; border: 2px solid #D5D7D9; border-radius: 12px; outline: none; font-family: 'Inter', sans-serif; }
  
  .pill-editable { display: flex; align-items: center; gap: 4px; padding-right: 6px; }
  .pill-action-group { display: flex; gap: 4px; margin-left: 8px; border-left: 1px solid rgba(255,255,255,0.3); padding-left: 6px; }
  .btn-icon-pill { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; opacity: 0.8; font-size: 12px; }
  .btn-icon-pill:hover { opacity: 1; }
  
  /* Botão de Adicionar circular */
  .btn-circle-add {
    width: 32px; height: 32px; border-radius: 50%; border: 2px dashed #757575;
    background: #FAFAFA; color: #757575; font-size: 20px; font-weight: bold;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: 0.2s;
  }
  .btn-circle-add:hover { border-color: #005C6D; color: #005C6D; }

  /* Fotos Grid no Modal de Edição */
  .fotos-edit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; margin-top: 8px; }
  .foto-edit-wrapper { position: relative; border-radius: 8px; overflow: hidden; height: 90px; border: 2px solid #D5D7D9; }
  .foto-edit-img { width: 100%; height: 100%; object-fit: cover; }
  .btn-delete-foto { position: absolute; top: 4px; right: 4px; background: #B20000; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; font-weight: bold; }
  .btn-add-foto-label { border: 2px dashed #757575; background: #FAFAFA; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 90px; cursor: pointer; color: #757575; font-weight: 600; font-size: 24px; transition: 0.2s; }
  .btn-add-foto-label:hover { border-color: #005C6D; color: #005C6D; }

  .modal-footer { display: flex; gap: 16px; margin-top: 24px; }
  .btn-save { flex: 1; padding: 14px; background: #B20000; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }
  .btn-cancel { flex: 1; padding: 14px; background: white; border: 1px solid #D5D7D9; border-radius: 12px; cursor: pointer; font-weight: 600; }

  /* Responsividade */
  @media (max-width: 768px) {
    .lista-salas-container { padding: 1rem; }
    .title-salas { font-size: 48px; }
    .header-line::after { display: none; }
    .salas-grid { grid-template-columns: 1fr; }
    .search-container { flex-direction: column; height: auto; border-radius: 12px; overflow: hidden; border: 1px solid #818181; }
    .search-input { border: none; border-radius: 0; padding: 16px; width: 100%; box-sizing: border-box; }
    .search-button { width: 100%; height: 50px; border: none; border-top: 1px solid #818181; border-radius: 0; }
    .modal-footer { flex-direction: column; }
    .fotos-edit-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
  }
`;

export default function ListaSalasTecnico() {
  const [salas, setSalas] = useState(initialSalas);
  const [busca, setBusca] = useState('');
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [salaEditando, setSalaEditando] = useState<any>(null);

  // Estados para os Sub-Modais
  const [modalTecnologiaAberto, setModalTecnologiaAberto] = useState(false);
  const [novaTecnologiaNome, setNovaTecnologiaNome] = useState('');

  const [modalMaquinaAberto, setModalMaquinaAberto] = useState(false);
  const [maquinaForm, setMaquinaForm] = useState({ nome: 'Desktop', qtd: 1 });
  const [editandoMaquinaNome, setEditandoMaquinaNome] = useState<string | null>(null);

  // Estado para o Sub-Modal de Confirmação de Exclusão de Foto
  const [modalExcluirFotoAberto, setModalExcluirFotoAberto] = useState(false);
  const [fotoIndexParaExcluir, setFotoIndexParaExcluir] = useState<number | null>(null);

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

  // ---- FUNÇÕES DE FOTOS ----
  const handleAddFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const urlTemp = URL.createObjectURL(file);
      setSalaEditando({ ...salaEditando, fotos: [...salaEditando.fotos, urlTemp] });
    }
    e.target.value = '';
  };

  const solicitarRemocaoFoto = (index: number) => {
    setFotoIndexParaExcluir(index);
    setModalExcluirFotoAberto(true);
  };

  const confirmarRemocaoFoto = () => {
    if (fotoIndexParaExcluir !== null) {
      const novasFotos = [...salaEditando.fotos];
      novasFotos.splice(fotoIndexParaExcluir, 1);
      setSalaEditando({ ...salaEditando, fotos: novasFotos });
    }
    setModalExcluirFotoAberto(false);
    setFotoIndexParaExcluir(null);
  };

  // ---- FUNÇÕES DE TECNOLOGIAS ----
  const removerTecnologia = (tec: string) => {
    setSalaEditando({
      ...salaEditando,
      tecnologias: salaEditando.tecnologias.filter((t: string) => t !== tec)
    });
  };

  const salvarNovaTecnologia = () => {
    if (novaTecnologiaNome.trim() !== '' && !salaEditando.tecnologias.includes(novaTecnologiaNome)) {
      setSalaEditando({
        ...salaEditando,
        tecnologias: [...salaEditando.tecnologias, novaTecnologiaNome.trim()]
      });
    }
    setModalTecnologiaAberto(false);
    setNovaTecnologiaNome('');
  };

  // ---- FUNÇÕES DE MÁQUINAS ----
  const removerMaquina = (nomeMaquina: string) => {
    setSalaEditando({
      ...salaEditando,
      maquinas: salaEditando.maquinas.filter((m: any) => m.nome !== nomeMaquina)
    });
  };

  const abrirModalAdicionarMaquina = () => {
    setEditandoMaquinaNome(null);
    setMaquinaForm({ nome: 'Desktop', qtd: 1 });
    setModalMaquinaAberto(true);
  };

  const abrirModalEditarMaquina = (maquina: any) => {
    setEditandoMaquinaNome(maquina.nome);
    setMaquinaForm({ nome: maquina.nome, qtd: maquina.qtd });
    setModalMaquinaAberto(true);
  };

  const salvarMaquina = () => {
    let novasMaquinas = [...salaEditando.maquinas];

    if (editandoMaquinaNome) {
      novasMaquinas = novasMaquinas.map(m => 
        m.nome === editandoMaquinaNome ? { ...maquinaForm, qtd: Number(maquinaForm.qtd) } : m
      );
    } else {
      const existente = novasMaquinas.find(m => m.nome === maquinaForm.nome);
      if (existente) {
        existente.qtd += Number(maquinaForm.qtd);
      } else {
        novasMaquinas.push({ nome: maquinaForm.nome, qtd: Number(maquinaForm.qtd) });
      }
    }

    setSalaEditando({ ...salaEditando, maquinas: novasMaquinas });
    setModalMaquinaAberto(false);
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

        {/* MODAL PRINCIPAL: Editar Sala */}
        {modalEdicaoAberto && salaEditando && (
          <div className="modal-overlay" onClick={() => setModalEdicaoAberto(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="btn-close" onClick={() => setModalEdicaoAberto(false)}>
                <img src={iconX} alt="Fechar" />
              </button>
              
              <h2 className="modal-title">Editar {salaEditando.nome}</h2>

              {/* FOTOS */}
              <div className="form-group">
                <label>Fotos da Sala:</label>
                <div className="fotos-edit-grid">
                  {salaEditando.fotos.map((foto: string, i: number) => (
                    <div key={i} className="foto-edit-wrapper">
                      <img src={foto} alt="Sala" className="foto-edit-img" />
                      <button className="btn-delete-foto" onClick={() => solicitarRemocaoFoto(i)}>✕</button>
                    </div>
                  ))}
                  <label className="btn-add-foto-label">
                    +
                    <input type="file" accept="image/*" style={{display: 'none'}} onChange={handleAddFoto} />
                  </label>
                </div>
              </div>

              <div className="form-group" style={{marginTop: '24px'}}>
                <label>Capacidade da sala:</label>
                <div className="pill-red" style={{width: 'fit-content'}}>{salaEditando.capacidade} alunos</div>
              </div>

              <div className="form-group">
                <label>Máquinas:</label>
                <div className="pills-container">
                  {salaEditando.maquinas.map((m: any, i: number) => (
                    <span key={i} className="pill-gray pill-editable">
                      {m.nome}: {m.qtd}
                      <div className="pill-action-group">
                        <button className="btn-icon-pill" title="Editar" onClick={() => abrirModalEditarMaquina(m)}>✎</button>
                        <button className="btn-icon-pill" title="Remover" onClick={() => removerMaquina(m.nome)}>✕</button>
                      </div>
                    </span>
                  ))}
                  <button className="btn-circle-add" onClick={abrirModalAdicionarMaquina}>+</button>
                </div>
              </div>

              <div className="form-group">
                <label>Tecnologias:</label>
                <div className="pills-container">
                  {salaEditando.tecnologias.map((tec: string, i: number) => (
                    <span key={i} className="pill-gray pill-editable">
                      {tec} 
                      <div className="pill-action-group">
                        <button className="btn-icon-pill" onClick={() => removerTecnologia(tec)}>
                          <img src={iconX} width="10" style={{filter: 'brightness(0) invert(1)'}} alt="Remover"/>
                        </button>
                      </div>
                    </span>
                  ))}
                  <button className="btn-circle-add" onClick={() => setModalTecnologiaAberto(true)}>+</button>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalEdicaoAberto(false)}>Cancelar</button>
                <button className="btn-save" onClick={salvarEdicao}>Confirmar Edições</button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL: Adicionar/Editar Máquina */}
        {modalMaquinaAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalMaquinaAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px'}}>
                {editandoMaquinaNome ? 'Editar Máquina' : 'Adicionar Máquina'}
              </h2>
              
              <div className="form-group">
                <label>Tipo de Máquina:</label>
                <select 
                  value={maquinaForm.nome} 
                  onChange={e => setMaquinaForm({...maquinaForm, nome: e.target.value})}
                  disabled={!!editandoMaquinaNome}
                >
                  <option value="Desktop">Desktop</option>
                  <option value="Notebook">Notebook</option>
                  <option value="Projetor">Projetor</option>
                  <option value="Televisão">Televisão</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Quantidade:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={maquinaForm.qtd} 
                  onChange={e => setMaquinaForm({...maquinaForm, qtd: Number(e.target.value)})}
                />
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalMaquinaAberto(false)}>Cancelar</button>
                <button className="btn-save" onClick={salvarMaquina}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL: Adicionar Tecnologia */}
        {modalTecnologiaAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalTecnologiaAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px'}}>Nova Tecnologia</h2>
              
              <div className="form-group">
                <label>Nome da tecnologia/software:</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Ex: Visual Studio 2022"
                  value={novaTecnologiaNome} 
                  onChange={e => setNovaTecnologiaNome(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && salvarNovaTecnologia()}
                />
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalTecnologiaAberto(false)}>Cancelar</button>
                <button className="btn-save" onClick={salvarNovaTecnologia}>Adicionar</button>
              </div>
            </div>
          </div>
        )}

        {/* SUB-MODAL: Confirmar Exclusão de Foto */}
        {modalExcluirFotoAberto && (
          <div className="modal-overlay sub-modal-overlay" onClick={() => setModalExcluirFotoAberto(false)}>
            <div className="modal-content sub-modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{fontSize: '24px', borderLeftColor: '#B20000', color: '#B20000'}}>Excluir Foto</h2>
              
              <p style={{color: '#3B3D41', fontSize: '16px', fontWeight: '500', marginBottom: '24px'}}>
                Tem certeza que deseja excluir esta foto da sala?
              </p>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModalExcluirFotoAberto(false)}>Cancelar</button>
                <button className="btn-save" onClick={confirmarRemocaoFoto}>Excluir</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
>>>>>>> 1e409f06be5f65fd2f90d53147bcc980f17cde08
}