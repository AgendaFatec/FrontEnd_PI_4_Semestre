import { useState, useMemo, useEffect } from "react";
import iconVerify from "../../assets/verify_FATEC.png";
import { api } from "../../services/api";

type StatusReserva = "aprovado" | "pendente" | "rejeitado";

type Reserva = {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: StatusReserva;
  motivo?: string;
};

const styles = `
  * {
    box-sizing: border-box;
  }

  .minhas-reservas-page {
    min-height: 100vh;
    background: #FAFAFA;
    padding: 34px 42px 60px;
    font-family: 'Inter', sans-serif;
    color: #3b3d41;
  }

  .header-salas {
    margin-bottom: 20px;
  }

  .header-content {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .header-icon {
    width: 52px;
    height: 52px;
    object-fit: contain;
  }

  .title-salas {
    margin: 0;
    font-family: 'Roboto Slab', serif;
    font-size: 64px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1;
  }

  .header-line-wrap {
    margin-top: 14px;
    display: flex;
    align-items: center;
  }

  .header-line-main {
    width: 175px;
    height: 16px;
    border-radius: 999px;
    background: #b20000;
  }

  .header-line-tail {
    width: 200px;
    height: 3px;
    background: #b20000;
    margin-left: -6px;
    border-radius: 999px;
  }

 .top-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

  .btn-reservar {
    height: 42px;
    padding: 0 18px;
    border: none;
    border-radius: 8px;
    background: #005c6d;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  }

  .btn-reservar:hover {
    filter: brightness(0.96);
  }

.filters-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: #6f6f6f;
  line-height: 1;
}

.filters-container {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  min-width: 112px;
  height: 42px;
  padding: 0 22px;
  border-radius: 18px;
  border: 2px solid #c89b9b;
  background: #ffffff;
  color: #2f3b44;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: none;
}

.filter-btn:hover {
  border-color: #b20000;
  color: #b20000;
}

.filter-btn.active {
  background: #c40000;
  color: #ffffff;
  border-color: #c40000;
}

  .reservas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
    gap: 22px;
    align-items: start;
  }

  .reserva-card {
    background: #ffffff;
    border: 2px solid #979797;
    border-radius: 16px;
    padding: 18px 16px 16px;
    min-height: 188px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }

  .reserva-subtitle {
    margin: 0 0 6px;
    font-size: 14px;
    color: #7a7a7a;
    font-weight: 500;
  }

  .sala-nome-card {
    margin: 0 0 8px;
    padding-left: 10px;
    border-left: 4px solid #73a28c;
    font-family: 'Roboto Slab', serif;
    font-size: 20px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1.2;
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .card-info-line {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    font-size: 14px;
    color: #666666;
  }

  .text-label {
    font-weight: 700;
    color: #7a7a7a;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 24px;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
  }

  .pill-date,
  .pill-hour {
    background: #7a7a7a;
    color: #ffffff;
    font-size: 11px;
    min-height: 22px;
    padding: 4px 10px;
  }

  .pill-aprovado {
    background: #32d267;
    color: #ffffff;
  }

  .pill-pendente {
    background: #f2cf27;
    color: #ffffff;
  }

  .pill-rejeitado {
    background: #d11a1a;
    color: #ffffff;
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    flex-wrap: wrap;
  }

  .btn-small {
    height: 28px;
    padding: 0 12px;
    border: none;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    color: #ffffff;
  }

  .btn-alterar {
    background: #005c6d;
  }

  .btn-cancelar {
    background: #b20000;
  }

  .btn-motivo {
    background: #005c6d;
  }

  .empty-state {
    color: #7a7a7a;
    font-size: 15px;
    margin-top: 8px;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.42);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 20px;
    z-index: 999;
    overflow-y: auto;
  }

  .modal-content {
    width: 100%;
    max-width: 540px;
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 22px 20px;
    position: relative;
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.18);
  }

  .modal-content.small {
    max-width: 400px;
  }

  .modal-close {
    position: absolute;
    top: 14px;
    right: 16px;
    border: none;
    background: transparent;
    color: #7a7a7a;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
  }

  .modal-header-line {
    border-left: 4px solid #73a28c;
    padding-left: 10px;
    margin-bottom: 18px;
  }

  .modal-title {
    margin: 0;
    font-family: 'Roboto Slab', serif;
    font-size: 22px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1.2;
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .modal-label {
    font-size: 13px;
    font-weight: 700;
    color: #5e5e5e;
    margin-bottom: 6px;
  }

  .input,
  .textarea {
    width: 100%;
    border: 2px solid #d7d7d7;
    border-radius: 10px;
    background: #ffffff;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: #3b3d41;
    outline: none;
  }

  .input {
    height: 40px;
    padding: 0 12px;
  }

  .textarea {
    min-height: 92px;
    resize: vertical;
    padding: 12px;
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .cancel-card-preview {
    background: #f6e4e6;
    border: 1px solid #d7bcbc;
    border-radius: 10px;
    padding: 18px 14px;
  }

  .cancel-question {
    text-align: center;
    font-size: 20px;
    font-weight: 700;
    color: #4a4a4a;
    margin: 8px 0 2px;
  }

  .modal-text-box {
    border: 1px solid #dddddd;
    border-radius: 8px;
    min-height: 96px;
    background: #ffffff;
    padding: 12px;
    font-size: 13px;
    color: #5a5a5a;
    line-height: 1.5;
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 18px;
  }

  .modal-footer.center {
    justify-content: center;
  }

  .btn-modal {
    min-width: 150px;
    height: 38px;
    padding: 0 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-modal-light {
    background: #ffffff;
    color: #6b6b6b;
    border: 1px solid #dfdfdf;
  }

  .btn-modal-primary {
    background: #b20000;
    color: #ffffff;
    border: none;
  }

  @media (max-width: 768px) {
    .minhas-reservas-page {
      padding: 24px 16px 40px;
    }

    .title-salas {
      font-size: 42px;
    }

    .header-icon {
      width: 40px;
      height: 40px;
    }

    .header-line-main {
      width: 120px;
      height: 12px;
    }

    .header-line-tail {
      width: 120px;
    }

    .top-actions {
      gap: 12px;
    }

    .row-2 {
      grid-template-columns: 1fr;
    }

    .modal-content {
      padding: 20px 16px 18px;
    }

    .modal-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-modal {
      width: 100%;
      min-width: 0;
    }
  }
`;

export default function MinhasReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [filtro, setFiltro] = useState<"todas" | StatusReserva>("todas");

  const [modalMotivoAberto, setModalMotivoAberto] = useState(false);
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false);
  const [modalAlteracaoAberto, setModalAlteracaoAberto] = useState(false);

  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");
  const [motivoAlteracao, setMotivoAlteracao] = useState("");
  const [novaSala, setNovaSala] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await api.get('/agendamentos') as { data: unknown[] };

        const reservasFormatadas = response.data.map((item: any) => {
          let statusFormatado: StatusReserva = "pendente";
          if (item.status === "APROVADO" || item.status === "Aprovada") statusFormatado = "aprovado";
          else if (item.status === "REJEITADO" || item.status === "Rejeitada") statusFormatado = "rejeitado";

          let dataFormatada = item.dataReserva;
          if (item.dataReserva && item.dataReserva.includes('-')) {
            const dataObj = new Date(item.dataReserva);
            dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
          }

          return {
            id: item.idAgendamento || item.id,
            sala: item.sala?.nomeSala || item.nomeSala || `Sala ${item.salaId}`,
            data: dataFormatada || "Data não informada",
            horario: item.horarioInicio && item.horarioFim ? `${item.horarioInicio} às ${item.horarioFim}` : item.horario || "Horário não informado",
            status: statusFormatado,
            motivo: item.motivoReserva || item.motivo || "Nenhum motivo informado",
          };
        });

        setReservas(reservasFormatadas);
      } catch (error) {
        console.error("Erro ao buscar reservas:", error);
      }
    };

    fetchReservas();
  }, []);

  const reservasFiltradas = useMemo(() => {
    if (filtro === "todas") return reservas;
    return reservas.filter((r) => r.status === filtro);
  }, [filtro, reservas]);

  const abrirModalMotivo = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalMotivoAberto(true);
  };

  const abrirModalCancelar = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalCancelarAberto(true);
  };

  const abrirModalAlteracao = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setNovaSala(reserva.sala);
    setNovaData(reserva.data);
    setNovoHorario(reserva.horario);
    setModalAlteracaoAberto(true);
  };

  const fecharTudo = () => {
    setModalMotivoAberto(false);
    setModalCancelarAberto(false);
    setModalAlteracaoAberto(false);
    setReservaSelecionada(null);
  };

  // FUNÇÃO PARA CANCELAR RESERVA
  const confirmarCancelamento = async () => {
    if (!reservaSelecionada) return;
    try {
      await api.delete(`/agendamentos/${reservaSelecionada.id}`);
      
      setReservas(prev => prev.filter(r => r.id !== reservaSelecionada.id));
      alert("Reserva cancelada com sucesso.");
      fecharTudo();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      alert("Erro ao cancelar reserva. Verifique sua conexão com o servidor.");
    }
  };

  // FUNÇÃO PARA ALTERAR RESERVA
  const confirmarAlteracao = async () => {
    if (!reservaSelecionada) return;

    try {
      const payload = {
        salaNome: novaSala,
        dataReserva: novaData,
        horario: novoHorario,
        motivo: motivoAlteracao
      };

      await api.put(`/agendamentos/${reservaSelecionada.id}`, payload);
      
      setReservas(prev => prev.map(r => r.id === reservaSelecionada.id ? {
        ...r, 
        sala: novaSala,
        data: novaData,
        horario: novoHorario,
        status: "pendente"
      } : r));

      alert("Solicitação de alteração enviada com sucesso.");
      setMotivoAlteracao("");
      fecharTudo();
    } catch (error) {
      console.error("Erro ao alterar reserva:", error);
      alert("Erro ao solicitar alteração.");
    }
  };

  const getStatusClass = (status: StatusReserva) => {
    if (status === "aprovado") return "pill-aprovado";
    if (status === "pendente") return "pill-pendente";
    return "pill-rejeitado";
  };

  const getStatusLabel = (status: StatusReserva) => {
    if (status === "aprovado") return "Aprovada";
    if (status === "pendente") return "Pendente";
    return "Rejeitada";
  };

  return (
    <>
      <style>{styles}</style>

      <div className="minhas-reservas-page">
        <header className="header-salas">
          <div className="header-content">
            <img
              src={iconVerify}
              alt="Ícone Minhas Reservas"
              className="header-icon"
            />
            <h1 className="title-salas">Minhas Reservas</h1>
          </div>

          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <div className="top-actions">
          <button className="btn-reservar">+ Reservar sala</button>

          <div className="filters-bar">
            <span className="filter-label">Status:</span>

            <div className="filters-container">
              <button
                className={`filter-btn ${filtro === "todas" ? "active" : ""}`}
                onClick={() => setFiltro("todas")}
              >
                Todas
              </button>

              <button
                className={`filter-btn ${filtro === "aprovado" ? "active" : ""}`}
                onClick={() => setFiltro("aprovado")}
              >
                Aprovadas
              </button>

              <button
                className={`filter-btn ${filtro === "pendente" ? "active" : ""}`}
                onClick={() => setFiltro("pendente")}
              >
                Pendentes
              </button>

              <button
                className={`filter-btn ${filtro === "rejeitado" ? "active" : ""}`}
                onClick={() => setFiltro("rejeitado")}
              >
                Rejeitadas
              </button>
            </div>
          </div>
        </div>

        <div className="reservas-grid">
          {reservasFiltradas.length > 0 ? (
            reservasFiltradas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <p className="reserva-subtitle">Solicitação de reserva</p>

                <h2 className="sala-nome-card">{reserva.sala}</h2>

                <div className="status-line">
                  <span className="text-label">Status:</span>
                  <span className={`pill ${getStatusClass(reserva.status)}`}>
                    {getStatusLabel(reserva.status)}
                  </span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Data:</span>
                  <span className="pill pill-date">
                    {reserva.data}
                  </span>
                </div>

                <div className="card-info-line">
                  <span className="text-label">Horário:</span>
                  <span className="pill pill-hour">{reserva.horario}</span>
                </div>

                <div className="card-actions">
                  {reserva.status !== "rejeitado" && (
                    <button
                      className="btn-small btn-alterar"
                      onClick={() => abrirModalAlteracao(reserva)}
                    >
                      Solicitar alteração
                    </button>
                  )}

                  {reserva.status !== "rejeitado" && (
                    <button
                      className="btn-small btn-cancelar"
                      onClick={() => abrirModalCancelar(reserva)}
                    >
                      Cancelar reserva
                    </button>
                  )}

                  {reserva.status === "rejeitado" && (
                    <button
                      className="btn-small btn-motivo"
                      onClick={() => abrirModalMotivo(reserva)}
                    >
                      Visualizar motivo
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="empty-state">Nenhuma reserva encontrada para esse filtro.</p>
          )}
        </div>

        {modalAlteracaoAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Solicitar alteração</h2>
              </div>

              <div className="modal-body">
                <div>
                  <div className="modal-label">Alterar sala:</div>
                  <select
                    className="input"
                    value={novaSala}
                    onChange={(e) => setNovaSala(e.target.value)}
                  >
                    <option value="Sala 26">Sala 26</option>
                    <option value="Sala 27">Sala 27</option>
                    <option value="Sala 28">Sala 28</option>
                    <option value="Sala 29">Sala 29</option>
                    <option value="Sala 30">Sala 30</option>
                  </select>
                </div>

                <div className="row-2">
                  <div>
                    <div className="modal-label">Alterar data:</div>
                    <input
                      className="input"
                      value={novaData}
                      onChange={(e) => setNovaData(e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="modal-label">Alterar horário:</div>
                    <input
                      className="input"
                      value={novoHorario}
                      onChange={(e) => setNovoHorario(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="modal-label">Motivo da alteração:</div>
                  <textarea
                    className="textarea"
                    value={motivoAlteracao}
                    onChange={(e) => setMotivoAlteracao(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-modal btn-modal-light" onClick={fecharTudo}>
                  Cancelar
                </button>
                <button className="btn-modal btn-modal-primary" onClick={confirmarAlteracao}>
                  Solicitar alteração
                </button>
              </div>
            </div>
          </div>
        )}

        {modalCancelarAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-body">
                <div className="cancel-card-preview">
                  <p className="reserva-subtitle">Solicitação de reserva</p>
                  <h2 className="sala-nome-card">{reservaSelecionada.sala}</h2>

                  <div className="status-line">
                    <span className="text-label">Status:</span>
                    <span className={`pill ${getStatusClass(reservaSelecionada.status)}`}>
                      {getStatusLabel(reservaSelecionada.status)}
                    </span>
                  </div>

                  <div className="card-info-line">
                    <span className="text-label">Data:</span>
                    <span className="pill pill-date">
                      {reservaSelecionada.data}
                    </span>
                  </div>

                  <div className="card-info-line">
                    <span className="text-label">Horário:</span>
                    <span className="pill pill-hour">{reservaSelecionada.horario}</span>
                  </div>
                </div>

                <div className="cancel-question">
                  Deseja mesmo cancelar essa reserva?
                </div>
              </div>

              <div className="modal-footer center">
                <button className="btn-modal btn-modal-light" onClick={fecharTudo}>
                  Voltar
                </button>
                <button className="btn-modal btn-modal-primary" onClick={confirmarCancelamento}>
                  Cancelar reserva
                </button>
              </div>
            </div>
          </div>
        )}

        {modalMotivoAberto && reservaSelecionada && (
          <div className="modal-overlay" onClick={fecharTudo}>
            <div
              className="modal-content small"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={fecharTudo}>
                ×
              </button>

              <div className="modal-header-line">
                <h2 className="modal-title">Motivo da rejeição</h2>
              </div>

              <div className="modal-body">
                <div className="modal-text-box">
                  {reservaSelecionada.motivo}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}