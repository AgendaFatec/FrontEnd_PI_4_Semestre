import { useState, useMemo, useEffect } from "react";
import iconVerify from "../../assets/verify_FATEC.png";
import iconX from "../../assets/x.svg";
import iconData from "../../assets/data.svg";
import iconHorario from "../../assets/horario.svg";
// import { api } from "../../services/api"; // Descomente quando for integrar

type StatusReserva = "Aprovada" | "Pendente" | "Rejeitada";

type Reserva = {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: StatusReserva;
  motivo: string;
};

const mockReservas: Reserva[] = [
  {
    id: 1,
    sala: "Sala 30",
    data: "23/02/2026",
    horario: "11:10 às 13:00",
    status: "Pendente",
    motivo: "Reserva solicitada para a realização de uma aula de Desenvolvimento Web II na sala 30",
  },
  {
    id: 2,
    sala: "Sala 31",
    data: "24/02/2026",
    horario: "09:20 às 11:00",
    status: "Pendente",
    motivo: "Reposição de aula prática de Redes de Computadores.",
  },
  {
    id: 3,
    sala: "Sala 30",
    data: "20/02/2026",
    horario: "07:30 às 09:10",
    status: "Aprovada",
    motivo: "Aula padrão da grade curricular.",
  },
];

const styles = `
  * { box-sizing: border-box; }

  .reservas-coord-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
  }

  .header-salas { margin-bottom: 24px; }
  .header-content { display: flex; align-items: center; gap: 14px; }
  .header-icon { width: 52px; height: 52px; object-fit: contain; }
  .title-salas {
    margin: 0; font-family: 'Roboto Slab', serif; font-size: 56px; font-weight: 700; color: #005c6d; line-height: 1;
  }
  .header-line-wrap { margin-top: 14px; display: flex; align-items: center; }
  .header-line-main { width: 175px; height: 16px; border-radius: 999px; background: #b20000; }
  .header-line-tail { width: 200px; height: 3px; background: #b20000; margin-left: -6px; border-radius: 999px; }

  .filters-wrapper {
    display: flex; align-items: center; gap: 16px;
    background: #FFFFFF; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 12px 20px; width: fit-content; margin-bottom: 36px;
  }
  .filter-label { font-size: 15px; font-weight: 500; color: #757575; }
  .filter-btn-group { display: flex; gap: 12px; }
  .filter-pill-btn {
    padding: 6px 18px; border-radius: 999px; font-size: 13px; font-weight: 600;
    cursor: pointer; background: #FFFFFF; transition: all 0.2s;
  }
  .filter-pill-btn.aprovada { border: 1px solid #00C853; color: #00C853; }
  .filter-pill-btn.aprovada.active { background: #00C853; color: #FFFFFF; }
  
  .filter-pill-btn.pendente { border: 1px solid #FBC02D; color: #FBC02D; }
  .filter-pill-btn.pendente.active { background: #FBC02D; color: #FFFFFF; }
  
  .filter-pill-btn.rejeitada { border: 1px solid #B20000; color: #B20000; }
  .filter-pill-btn.rejeitada.active { background: #B20000; color: #FFFFFF; }

  .section-title {
    font-size: 18px; font-weight: 700; color: #757575; margin-bottom: 16px; margin-top: 32px;
  }
  .reservas-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 320px)); gap: 20px;
  }

  .reserva-card {
    background: #ffffff; border: 2px solid #D5D7D9; border-radius: 12px;
    padding: 20px; display: flex; flex-direction: column;
  }
  .reserva-subtitle { margin: 0 0 6px; font-size: 13px; color: #757575; font-weight: 500; }
  .sala-nome-card {
    margin: 0 0 12px; padding-left: 10px; border-left: 3px solid #005c6d;
    font-family: 'Roboto Slab', serif; font-size: 24px; font-weight: 700; color: #005c6d;
  }
  .card-info-line {
    display: flex; align-items: center; gap: 8px; margin-bottom: 10px; font-size: 14px;
  }
  .text-label { font-weight: 600; color: #757575; }
  
  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
  }
  .pill-date, .pill-hour { background: #757575; color: #ffffff; }
  .pill-aprovada { background: #00C853; color: #ffffff; }
  .pill-pendente { background: #FBC02D; color: #ffffff; }
  .pill-rejeitada { background: #B20000; color: #ffffff; }

  .btn-revisar {
    margin-top: 16px; height: 36px; background: #005c6d; color: #ffffff;
    border: none; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; width: 100%; transition: background 0.2s;
  }
  .btn-revisar:hover { background: #004552; }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5);
    display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
  }
  .modal-content {
    background: #ffffff; border-radius: 12px; width: 100%; max-width: 520px;
    padding: 24px; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  }
  .modal-close {
    position: absolute; top: 16px; right: 16px; background: transparent; border: none; cursor: pointer; opacity: 0.6;
  }
  .modal-close:hover { opacity: 1; }
  .modal-header-line { border-left: 3px solid #005C6D; padding-left: 12px; margin-bottom: 24px; }
  .modal-title { font-family: 'Roboto Slab', serif; font-size: 28px; font-weight: 700; color: #005c6d; margin: 0; }
  
  .form-group { margin-bottom: 16px; }
  .modal-label { font-size: 13px; font-weight: 700; color: #3B3D41; margin-bottom: 6px; display: block; }
  
  .input-styled {
    width: 100%; height: 42px; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 0 12px; font-family: 'Inter', sans-serif; font-size: 14px; color: #3B3D41;
    background: #F9F9F9;
  }
  .textarea-styled {
    width: 100%; min-height: 80px; border: 1px solid #D5D7D9; border-radius: 8px;
    padding: 12px; font-family: 'Inter', sans-serif; font-size: 14px; color: #3B3D41;
    background: #F9F9F9; resize: none;
  }
  
  .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  .input-with-icon { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 12px; width: 18px; pointer-events: none; opacity: 0.5; }
  .input-with-icon .input-styled { padding-left: 38px; }

  .modal-footer { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
  .footer-row { display: flex; gap: 12px; width: 100%; }
  
  .btn-modal {
    flex: 1; height: 42px; border-radius: 8px; font-size: 14px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: opacity 0.2s;
  }
  .btn-modal:hover { opacity: 0.9; }
  .btn-rejeitar { background: #B20000; color: white; border: none; }
  .btn-aprovar { background: #00C853; color: white; border: none; }
  .btn-cancelar { background: #FFFFFF; color: #757575; border: 1px solid #D5D7D9; }

  @media (max-width: 768px) {
    .reservas-coord-page { padding: 24px 16px; }
    .title-salas { font-size: 40px; }
    .row-2 { grid-template-columns: 1fr; }
    .filters-wrapper { flex-direction: column; align-items: flex-start; width: 100%; }
    .filter-btn-group { width: 100%; justify-content: space-between; }
  }
`;

export default function ReservasSolicitadas() {
  const [reservas, setReservas] = useState<Reserva[]>(mockReservas);
  const [filtroAtivo, setFiltroAtivo] = useState<"Todas" | StatusReserva>("Todas");
  const [modalRevisarAberto, setModalRevisarAberto] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  /*
  // PREPARAÇÃO DE INTEGRAÇÃO COM A API: BUSCAR RESERVAS
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.get('/reservas/solicitadas');
        setReservas(response.data);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };
    fetchReservas();
  }, []);
  */

  const reservasPendentes = reservas.filter(r => r.status === "Pendente" && (filtroAtivo === "Todas" || filtroAtivo === "Pendente"));
  const reservasAprovadas = reservas.filter(r => r.status === "Aprovada" && (filtroAtivo === "Todas" || filtroAtivo === "Aprovada"));
  const reservasRejeitadas = reservas.filter(r => r.status === "Rejeitada" && (filtroAtivo === "Todas" || filtroAtivo === "Rejeitada"));

  const abrirModal = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalRevisarAberto(true);
  };

  const fecharModal = () => {
    setModalRevisarAberto(false);
    setReservaSelecionada(null);
  };

  const processarReserva = async (novoStatus: StatusReserva) => {
    if (!reservaSelecionada) return;

    /*
    // PREPARAÇÃO DE INTEGRAÇÃO COM A API: ATUALIZAR STATUS DA RESERVA
    try {
      await api.patch(`/reservas/${reservaSelecionada.id}/status`, { status: novoStatus });
      setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? { ...r, status: novoStatus } : r));
      fecharModal();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Ocorreu um erro ao processar a reserva.");
    }
    */

    // Comportamento atual do mock-up:
    setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? { ...r, status: novoStatus } : r));
    fecharModal();
  };

  const CardReserva = ({ reserva }: { reserva: Reserva }) => (
    <div className="reserva-card">
      <p className="reserva-subtitle">Solicitação de reserva</p>
      <h2 className="sala-nome-card">{reserva.sala}</h2>

      <div className="card-info-line">
        <span className="text-label">Status:</span>
        <span className={`pill pill-${reserva.status.toLowerCase()}`}>{reserva.status}</span>
      </div>

      <div className="card-info-line">
        <span className="text-label">Data:</span>
        <span className="pill pill-date">{reserva.data} (Segunda-feira)</span>
      </div>

      <div className="card-info-line">
        <span className="text-label">Horário:</span>
        <span className="pill pill-hour">{reserva.horario}</span>
      </div>

      {reserva.status === "Pendente" && (
        <button className="btn-revisar" onClick={() => abrirModal(reserva)}>
          Revisar reserva
        </button>
      )}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="reservas-coord-page">
        
        <header className="header-salas">
          <div className="header-content">
            <img src={iconVerify} alt="Verificar" className="header-icon" />
            <h1 className="title-salas">Reservas Solicitadas</h1>
          </div>
          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <div className="filters-wrapper">
          <span className="filter-label">Status:</span>
          <div className="filter-btn-group">
            <button 
              className={`filter-pill-btn aprovada ${filtroAtivo === 'Aprovada' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Aprovada' ? 'Todas' : 'Aprovada')}
            >
              Aprovada
            </button>
            <button 
              className={`filter-pill-btn pendente ${filtroAtivo === 'Pendente' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Pendente' ? 'Todas' : 'Pendente')}
            >
              Pendente
            </button>
            <button 
              className={`filter-pill-btn rejeitada ${filtroAtivo === 'Rejeitada' ? 'active' : ''}`}
              onClick={() => setFiltroAtivo(filtroAtivo === 'Rejeitada' ? 'Todas' : 'Rejeitada')}
            >
              Rejeitada
            </button>
          </div>
        </div>

        {reservasPendentes.length > 0 && (
          <div>
            <h3 className="section-title">Reservas pendentes:</h3>
            <div className="reservas-grid">
              {reservasPendentes.map((r) => <CardReserva key={r.id} reserva={r} />)}
            </div>
          </div>
        )}

        {reservasAprovadas.length > 0 && (
          <div>
            <h3 className="section-title">Reservas aprovadas:</h3>
            <div className="reservas-grid">
              {reservasAprovadas.map((r) => <CardReserva key={r.id} reserva={r} />)}
            </div>
          </div>
        )}

        {reservasRejeitadas.length > 0 && (
          <div>
            <h3 className="section-title">Reservas rejeitadas:</h3>
            <div className="reservas-grid">
              {reservasRejeitadas.map((r) => <CardReserva key={r.id} reserva={r} />)}
            </div>
          </div>
        )}

        {modalRevisarAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharModal}>
                <img src={iconX} alt="Fechar" className="w-4 h-4" />
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Solicitação de reserva</h2>
              </div>

              <div className="form-group">
                <label className="modal-label">Sala solicitada:</label>
                <input type="text" className="input-styled" value={reservaSelecionada.sala} readOnly />
              </div>

              <div className="row-2">
                <div className="form-group">
                  <label className="modal-label">Data da reserva</label>
                  <div className="input-with-icon">
                    <img src={iconData} alt="Data" className="input-icon" />
                    <input type="text" className="input-styled" value={`${reservaSelecionada.data} (Terça-feira)`} readOnly />
                  </div>
                </div>

                <div className="form-group">
                  <label className="modal-label">Horário da reserva</label>
                  <div className="input-with-icon">
                    <img src={iconHorario} alt="Horário" className="input-icon" />
                    <input type="text" className="input-styled" value={reservaSelecionada.horario} readOnly />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="modal-label">Motivo da Reserva</label>
                <textarea className="textarea-styled" value={reservaSelecionada.motivo} readOnly />
              </div>

              <div className="modal-footer">
                <div className="footer-row">
                  <button className="btn-modal btn-rejeitar" onClick={() => processarReserva('Rejeitada')}>
                    Rejeitar reserva
                  </button>
                  <button className="btn-modal btn-aprovar" onClick={() => processarReserva('Aprovada')}>
                    Aprovar reserva
                  </button>
                </div>
                <button className="btn-modal btn-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}