import { useState, useMemo } from "react";
import "./reservaDocente.css";

type Reserva = {
  id: number;
  sala: string;
  data: string;
  horario: string;
  status: "aprovado" | "pendente" | "rejeitado";
  motivo?: string;
};

const mockReservas: Reserva[] = [
  {
    id: 1,
    sala: "Sala 30",
    data: "23/02/2026",
    horario: "19:10 às 22:00",
    status: "aprovado",
  },
  {
    id: 2,
    sala: "Sala 30",
    data: "23/02/2026",
    horario: "19:10 às 22:00",
    status: "pendente",
  },
  {
    id: 3,
    sala: "Sala 30",
    data: "23/02/2026",
    horario: "19:10 às 22:00",
    status: "rejeitado",
    motivo: "Conflito de horário com outra reserva",
  },
];

export default function MinhasReservas() {
  const [filtro, setFiltro] = useState<string>("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  const reservasFiltradas = useMemo(() => {
    if (filtro === "todas") return mockReservas;
    return mockReservas.filter(r => r.status === filtro);
  }, [filtro]);

  const abrirModal = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setReservaSelecionada(null);
  };

  const cancelar = (id: number) => {
    alert(`Reserva ${id} cancelada`);
  };

  return (
    <div className="lista-salas-container">

      {/* HEADER */}
      <header className="header-salas">
        <h1 className="title-salas">Minhas Reservas</h1>
        <div className="header-line"></div>
      </header>

      {/* TABS */}
      <div className="filters-container">
        <button className={filtro === "todas" ? "active" : ""} onClick={() => setFiltro("todas")}> Todas</button>
        <button className={filtro === "aprovado" ? "active" : ""} onClick={() => setFiltro("aprovado")}>Aprovadas</button>
        <button className={filtro === "pendente" ? "active" : ""} onClick={() => setFiltro("pendente")}>Pendentes</button>
        <button className={filtro === "rejeitado" ? "active" : ""} onClick={() => setFiltro("rejeitado")}>Rejeitadas</button>
      </div>

      {/* LISTA */}
      <div className="salas-grid">
        {reservasFiltradas.map((reserva) => (
          <div key={reserva.id} className="sala-card">
            <div className="sala-info">
              <h2 className="sala-nome-card">{reserva.sala}</h2>

              <p><span className="text-label">Data:</span> {reserva.data}</p>
              <p><span className="text-label">Horário:</span> {reserva.horario}</p>

              <span className={`pill-${reserva.status === "aprovado" ? "red" : reserva.status === "pendente" ? "gray" : "outline-red"}`}>
                {reserva.status.toUpperCase()}
              </span>

                <div className="card-actions">
                {reserva.status !== "rejeitado" && (
                  <button className="btn-confirm" onClick={() => cancelar(reserva.id)}>
                    Cancelar
                  </button>
                )}

                {reserva.status === "rejeitado" && (
                  <button className="btn-cancel" onClick={() => abrirModal(reserva)}>
                    Ver motivo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalAberto && reservaSelecionada && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Motivo da rejeição</h2>
            <p>{reservaSelecionada.motivo}</p>

            <div className="modal-footer">
              <button className="btn-confirm" onClick={fecharModal}> Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}