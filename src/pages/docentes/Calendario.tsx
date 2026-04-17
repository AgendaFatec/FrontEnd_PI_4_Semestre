import React, { useMemo, useState } from "react";

import iconCalendario from "../../assets/calendario_FATEC.png";
import iconFiltro from "../../assets/filtrar.svg";
import iconSeta from "../../assets/seta.svg";
import iconX from "../../assets/x.svg";
import iconData from "../../assets/data.svg";
import iconHorario from "../../assets/horario.svg";

type ModoVisualizacao = "dia" | "semana" | "mes" | "lista";

type Reserva = {
  id: number;
  titulo: string;
  professor: string;
  sala: string;
  data: string;
  inicio: string;
  fim: string;
  status: "reservado";
};

const salas = ["Sala 30", "Sala 31", "Sala 32", "Sala 33", "Sala 34"];

const reservasMock: Reserva[] = [
  {
    id: 1,
    titulo: "Aula 02",
    professor: "Professor VIT",
    sala: "Sala 30",
    data: "2026-02-05",
    inicio: "14:50",
    fim: "16:30",
    status: "reservado",
  },
  {
    id: 2,
    titulo: "Professora Elaine",
    professor: "Professora Elaine",
    sala: "Sala 31",
    data: "2026-02-05",
    inicio: "14:50",
    fim: "16:30",
    status: "reservado",
  },
  {
    id: 3,
    titulo: "Aula 02",
    professor: "Professor VIT",
    sala: "Sala 30",
    data: "2026-02-05",
    inicio: "09:20",
    fim: "11:00",
    status: "reservado",
  },
  {
    id: 4,
    titulo: "Professora Elaine",
    professor: "Professora Elaine",
    sala: "Sala 31",
    data: "2026-02-05",
    inicio: "09:20",
    fim: "11:00",
    status: "reservado",
  },
];

const horarios = ["07:30", "09:20", "11:10", "14:50", "16:40"];

const horariosExibicao: Record<string, string> = {
  "07:30": "07:30\n09:10",
  "09:20": "09:20\n11:00",
  "11:10": "11:10\n13:00",
  "14:50": "14:50\n16:30",
  "16:40": "16:40\n18:20",
};

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const diasSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const diasSemanaCurto = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const styles = `
  * {
    box-sizing: border-box;
  }

.calendario-page {
  min-height: 100vh;
  background: #f6f6f6;
  padding: 44px 62px 34px;
  font-family: 'Inter', Arial, sans-serif;
  color: #333;
}

.calendario-header {
  margin-bottom: 26px;
}

.calendario-header-row {
  display: flex;
  align-items: flex-end;
  gap: 18px;
}

.calendario-header-icon {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

  .calendario-header-title {
    margin: 0;
    font-family: 'Roboto Slab', Georgia, serif;
    font-size: 64px;
    font-weight: 700;
    color: #005c6d;
    line-height: 1;
    letter-spacing: -0.5px;
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
    background: #c40000;
  }

  .header-line-tail {
    width: 230px;
    height: 3px;
    background: #c40000;
    margin-left: -6px;
    border-radius: 999px;
  }

 .calendario-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

  .calendario-toolbar-esquerda {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .calendario-toolbar-direita {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
  }

  .btn-hoje,
  .btn-nav-data,
  .btn-modo,
  .btn-filtro,
  .dropdown-item,
  .botao-slot-reserva {
    font-family: inherit;
  }

  .btn-hoje {
    height: 30px;
    padding: 0 12px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    background: #ffffff;
    color: #2f2f2f;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-nav-data {
    width: 26px;
    height: 26px;
    border: 1px solid #d8d8d8;
    border-radius: 3px;
    background: #ffffff;
    color: #4e4e4e;
    font-size: 12px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .calendario-data-label {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #232323;
  }

  .btn-modo {
    min-width: 40px;
    height: 28px;
    padding: 0 12px;
    border: 1px solid #dbdbdb;
    border-radius: 4px;
    background: #ffffff;
    color: #585858;
    font-size: 12px;
    cursor: pointer;
  }

  .btn-modo.ativo {
    background: #c40000;
    color: #ffffff;
    border-color: #c40000;
    font-weight: 700;
  }

.calendario-subtoolbar {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

  .filtro-wrapper {
    position: relative;
  }

  .btn-filtro {
    height: 28px;
    padding: 0 10px;
    border: 1px solid #dddddd;
    border-radius: 4px;
    background: #ffffff;
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    color: #4a4a4a;
    font-size: 12px;
    font-weight: 600;
  }

  .btn-filtro img {
    width: 11px;
    height: 11px;
    object-fit: contain;
  }

  .dropdown-filtro {
    position: absolute;
    top: 34px;
    left: 0;
    width: 180px;
    background: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 24px rgba(0,0,0,0.08);
    z-index: 50;
  }

  .dropdown-item {
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid #f0f0f0;
    background: #ffffff;
    text-align: left;
    padding: 10px 12px;
    font-size: 12px;
    color: #3a3a3a;
    cursor: pointer;
  }

  .dropdown-item:last-child {
    border-bottom: none;
  }

  .dropdown-item:hover {
    background: #faf3f3;
  }

  .calendario-instrucao {
    font-size: 12px;
    color: #666666;
    font-weight: 600;
  }

  .calendario-content {
    background: #ffffff;
    border-radius: 0;
  }

  .calendario-grade-dia {
    display: grid;
    grid-template-columns: 58px 1fr;
    border: 1px solid #dfdfdf;
    background: #ffffff;
  }

  .calendario-coluna-horarios {
    background: #f3e2e2;
    border-right: 1px solid #dfdfdf;
  }

  .calendario-hora-slot {
    min-height: 58px;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1px;
    padding: 8px 4px 0 6px;
    font-size: 10px;
    line-height: 1.08;
    font-weight: 700;
    color: #3d3d3d;
    white-space: pre-line;
  }

  .calendario-coluna-dia {
    display: flex;
    flex-direction: column;
  }

  .calendario-topo-dia {
    height: 34px;
    border-bottom: 1px solid #dfdfdf;
    background: #fbfbfb;
  }

  .calendario-linha-dia {
    min-height: 58px;
    border-bottom: 1px solid #dfdfdf;
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 6px 8px;
    background: #ffffff;
  }

  .compacto-dia {
    grid-template-columns: 58px 1fr !important;
  }

  .horario-topo-vazio {
    background: #f8f8f8 !important;
    border-bottom: 1px solid #dfdfdf !important;
    height: 34px !important;
  }

  .hora-slot-dia {
    min-height: 58px !important;
    padding: 8px 4px 0 6px !important;
    font-size: 10px !important;
    line-height: 1.08 !important;
    font-weight: 700 !important;
    color: #3d3d3d !important;
    background: #f3e2e2 !important;
    border-bottom: 1px solid #dfdfdf !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
  }

  .linha-dia-compacta {
    min-height: 58px !important;
    padding: 6px 8px !important;
    display: flex !important;
    align-items: flex-start !important;
    justify-content: flex-start !important;
    border-bottom: 1px solid #dfdfdf !important;
    background: #fff !important;
  }

  .grupo-reservas-dia {
    display: flex !important;
    gap: 6px !important;
    align-items: flex-start !important;
  }

  .bloco-reserva {
    width: 66px;
    min-width: 66px;
    max-width: 66px;
    min-height: 62px;
    background: #f3dddd;
    border: 1px solid #df9c9c;
    border-radius: 0;
    padding: 7px 6px 4px;
    position: relative;
  }

  .bloco-reserva-dia {
    width: 66px;
    min-width: 66px;
    max-width: 66px;
  }

  .bloco-dia-esboco {
    width: 66px !important;
    min-width: 66px !important;
    max-width: 66px !important;
    min-height: 62px !important;
    padding: 7px 6px 4px !important;
    background: #f3dddd !important;
    border: 1px solid #df9c9c !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .bloco-reserva-bolinha {
    display: none;
  }

  .bloco-reserva-titulo {
    font-size: 10px;
    font-weight: 700;
    color: #df0000;
    line-height: 1.05;
    margin-bottom: 6px;
  }

  .bloco-reserva-professor {
    font-size: 9px;
    color: #202020;
    line-height: 1.05;
    font-weight: 700;
  }

  .slot-vazio-dia {
    width: 100%;
    height: 100%;
  }

  .botao-slot-reserva {
    border: 1px solid #df9f9f;
    background: #f7e8e8;
    color: #c40000;
    border-radius: 0;
    padding: 5px 8px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .faixa-solicitar {
    width: 100% !important;
    min-height: 28px !important;
    margin-top: 10px !important;
    background: #f7e3e3 !important;
    border: 1px solid #dfa3a3 !important;
    color: #b30000 !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    border-radius: 0 !important;
    text-align: center !important;
    padding: 6px 8px !important;
  }

  .calendario-grade-semana {
    display: grid;
    grid-template-columns: 58px repeat(6, 1fr);
    border: 1px solid #dfdfdf;
    background: #ffffff;
  }

  .calendario-canto-vazio {
    height: 34px;
    background: #fbfbfb;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
  }

  .cabecalho-dia-semana {
    height: 34px;
    background: #fbfbfb;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }

  .cabecalho-dia-nome {
    font-size: 10px;
    color: #5d5d5d;
    line-height: 1;
  }

  .cabecalho-dia-numero {
    font-size: 11px;
    font-weight: 700;
    color: #2c2c2c;
    line-height: 1;
  }

  .semana-hora {
    background: #f3e2e2;
    border-right: 1px solid #dfdfdf;
  }

  .celula-semana {
    min-height: 58px;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    position: relative;
    padding: 6px;
    background: #ffffff;
  }

  .calendario-grade-mes {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-top: 1px solid #dfdfdf;
    border-left: 1px solid #dfdfdf;
    background: #ffffff;
  }

  .cabecalho-mes {
    height: 28px;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    background: #fbfbfb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    color: #606060;
    font-weight: 600;
  }

  .celula-mes {
    min-height: 110px;
    border-right: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    background: #ffffff;
    padding: 8px;
    position: relative;
  }

  .celula-mes.vazia {
    background: #fafafa;
  }

  .numero-dia-mes {
    font-size: 12px;
    font-weight: 700;
    color: #444;
    margin-bottom: 8px;
  }

  .eventos-dia-mes {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .evento-mes {
    background: #c40000;
    color: #ffffff;
    border-radius: 6px;
    padding: 5px 7px;
    font-size: 10px;
    line-height: 1.2;
  }

  .evento-mes-topo {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
  }

  .evento-mes-bolinha {
    width: 6px;
    height: 6px;
    background: #ffffff;
    border-radius: 50%;
    display: inline-block;
  }

  .evento-mes-hora {
    font-size: 10px;
  }

  .evento-mes-titulo {
    font-weight: 700;
    font-size: 10px;
  }

  .evento-mes-professor {
    font-size: 10px;
  }

  .botao-mes {
    position: absolute;
    left: 8px;
    right: 8px;
    bottom: 8px;
    opacity: 0;
  }

  .calendario-lista {
    padding: 10px 0;
  }

  .item-lista-reserva {
    margin-bottom: 12px;
    border: 1px solid #efcaca;
    background: #faeaea;
    border-radius: 6px;
    padding: 12px 14px;
  }

  .item-lista-linha-superior {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .item-lista-horario {
    font-size: 12px;
    color: #444;
    font-weight: 600;
  }

  .item-lista-badge {
    background: #c40000;
    color: #ffffff;
    font-size: 10px;
    border-radius: 999px;
    padding: 3px 9px;
    font-weight: 700;
  }

  .item-lista-titulo {
    font-size: 14px;
    font-weight: 700;
    color: #303030;
  }

  .hover-slot {
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .celula-semana:hover .hover-slot,
  .calendario-linha-dia:hover .hover-slot,
  .celula-mes:hover .botao-mes {
    opacity: 1;
  }

  .calendario-legenda {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    gap: 18px;
    flex-wrap: wrap;
    font-size: 10px;
    color: #5a5a5a;
  }

  .legenda-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .legenda-quadrado {
    width: 7px;
    height: 7px;
    border: 1px solid #cbcbcb;
    display: inline-block;
  }

  .legenda-quadrado.branco {
    background: #ffffff;
  }

  .legenda-quadrado.vermelho {
    background: #c40000;
    border-color: #c40000;
  }

  .legenda-check {
    width: 8px;
    height: 8px;
    border: 1px solid #8d8d8d;
    display: inline-block;
    position: relative;
  }

  .legenda-check::after {
    content: "";
    position: absolute;
    width: 4px;
    height: 2px;
    border-left: 1.5px solid #444;
    border-bottom: 1.5px solid #444;
    transform: rotate(-45deg);
    left: 1px;
    top: 2px;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.42);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 48px 20px;
    z-index: 999;
    overflow-y: auto;
  }

  .modal-calendario {
    width: 100%;
    max-width: 560px;
    background: #ffffff;
    border-radius: 18px;
    padding: 22px 22px 20px;
    position: relative;
    box-shadow: 0 14px 38px rgba(0,0,0,0.18);
  }

  .modal-fechar {
    position: absolute;
    top: 14px;
    right: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .modal-fechar img {
    width: 16px;
    height: 16px;
  }

  .modal-header-line {
    border-left: 4px solid #73a28c;
    padding-left: 10px;
    margin-bottom: 18px;
  }

  .modal-title {
    margin: 0;
    font-family: 'Roboto Slab', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: #005c6d;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .modal-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .modal-form-group {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .modal-form-group label {
    font-size: 13px;
    font-weight: 700;
    color: #5e5e5e;
  }

  .modal-form-group input,
  .modal-form-group select {
    width: 100%;
    height: 40px;
    border: 2px solid #d7d7d7;
    border-radius: 10px;
    background: #ffffff;
    font-family: inherit;
    font-size: 14px;
    color: #3b3d41;
    outline: none;
    padding: 0 12px;
  }

  .input-with-icon {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
  }

  .input-with-icon input,
  .input-with-icon select {
    padding-left: 36px;
  }

  .modal-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }

  .btn-modal-cancelar,
  .btn-modal-confirmar {
    min-width: 150px;
    height: 38px;
    padding: 0 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-modal-cancelar {
    background: #ffffff;
    color: #6b6b6b;
    border: 1px solid #dfdfdf;
  }

  .btn-modal-confirmar {
    background: #b20000;
    color: #ffffff;
    border: none;
  }

  @media (max-width: 900px) {
.calendario-page {
  padding: 28px 20px 28px;
}

    .calendario-header-title {
      font-size: 42px;
    }

 .calendario-header-icon {
  width: 52px;
  height: 52px;
}

    .header-line-main {
      width: 120px;
      height: 12px;
    }

    .header-line-tail {
      width: 140px;
    }

    .calendario-toolbar,
    .calendario-subtoolbar {
      align-items: stretch;
    }

    .calendario-content {
      overflow-x: auto;
    }

    .calendario-grade-semana,
    .calendario-grade-dia,
    .calendario-grade-mes {
      min-width: 760px;
    }

    .modal-form-row {
      grid-template-columns: 1fr;
    }

    .modal-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-modal-cancelar,
    .btn-modal-confirmar {
      width: 100%;
      min-width: 0;
    }
  }
`;

function formatarDataISO(data: Date) {
  return data.toISOString().split("T")[0];
}

function formatarTituloDia(data: Date) {
  return `${data.getDate()} de ${meses[data.getMonth()]} (${data.getFullYear()})`;
}

function getSemanaAtual(dataBase: Date) {
  const data = new Date(dataBase);
  const dia = data.getDay();
  const diffInicio = dia === 0 ? -6 : 1 - dia;
  const inicio = new Date(data);
  inicio.setDate(data.getDate() + diffInicio);

  const semana = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(inicio);
    d.setDate(inicio.getDate() + i);
    semana.push(d);
  }
  return semana;
}

function getDiasDoMes(dataBase: Date) {
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);

  const inicioIndice = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();

  const dias: Array<Date | null> = [];

  for (let i = 0; i < inicioIndice; i++) dias.push(null);
  for (let dia = 1; dia <= totalDias; dia++) dias.push(new Date(ano, mes, dia));

  while (dias.length % 7 !== 0) dias.push(null);

  return dias;
}

function somarDias(data: Date, qtd: number) {
  const nova = new Date(data);
  nova.setDate(nova.getDate() + qtd);
  return nova;
}

export default function CalendarioDocente() {
  const [modo, setModo] = useState<ModoVisualizacao>("dia");
  const [dataAtual, setDataAtual] = useState(new Date(2026, 1, 5));
  const [filtroSala, setFiltroSala] = useState("");
  const [mostrarFiltro, setMostrarFiltro] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [salaSelecionada, setSalaSelecionada] = useState("Sala 30");
  const [horarioSelecionado, setHorarioSelecionado] = useState("14:50 às 16:30");
  const [nomeAula, setNomeAula] = useState("");

  const reservasFiltradas = useMemo(() => {
    if (!filtroSala) return reservasMock;
    return reservasMock.filter((r) => r.sala === filtroSala);
  }, [filtroSala]);

  const reservasDoDia = useMemo(() => {
    const iso = formatarDataISO(dataAtual);
    return reservasFiltradas.filter((r) => r.data === iso);
  }, [dataAtual, reservasFiltradas]);

  const reservasDaSemana = useMemo(() => {
    const semana = getSemanaAtual(dataAtual).map((d) => formatarDataISO(d));
    return reservasFiltradas.filter((r) => semana.includes(r.data));
  }, [dataAtual, reservasFiltradas]);

  const reservasDoMes = useMemo(() => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    return reservasFiltradas.filter((r) => {
      const d = new Date(`${r.data}T00:00:00`);
      return d.getFullYear() === ano && d.getMonth() === mes;
    });
  }, [dataAtual, reservasFiltradas]);

  const abrirModalReserva = (data: Date) => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const nomeDia = diasSemana[data.getDay()];
    setDataSelecionada(`${dia}/${mes}/${ano} (${nomeDia})`);
    setModalAberto(true);
  };

  const mudarAnterior = () => {
    if (modo === "dia") setDataAtual(somarDias(dataAtual, -1));
    if (modo === "semana") setDataAtual(somarDias(dataAtual, -7));
    if (modo === "mes" || modo === "lista") {
      setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 1, 1));
    }
  };

  const mudarProximo = () => {
    if (modo === "dia") setDataAtual(somarDias(dataAtual, 1));
    if (modo === "semana") setDataAtual(somarDias(dataAtual, 7));
    if (modo === "mes" || modo === "lista") {
      setDataAtual(new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 1));
    }
  };

  const renderTitulo = () => {
    if (modo === "dia") return formatarTituloDia(dataAtual);

    if (modo === "semana") {
      const semana = getSemanaAtual(dataAtual);
      const inicio = semana[0];
      const fim = semana[5];
      return `${meses[dataAtual.getMonth()]} - Semana ${Math.ceil(
        (inicio.getDate() + 6) / 7
      )} (${inicio.getDate()}-${fim.getDate()}/${dataAtual.getFullYear()})`;
    }

    return `${meses[dataAtual.getMonth()]} (${dataAtual.getFullYear()})`;
  };

  const renderDia = () => {
    return (
      <div className="calendario-grade-dia compacto-dia">
        <div className="calendario-coluna-horarios">
          <div className="calendario-topo-dia horario-topo-vazio"></div>

          {horarios.map((h) => (
            <div key={h} className="calendario-hora-slot hora-slot-dia">
              {horariosExibicao[h].split("\n").map((linha, i) => (
                <span key={i}>{linha}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="calendario-coluna-dia">
          <div className="calendario-topo-dia"></div>

          {horarios.map((h) => {
            const reservasNoHorario = reservasDoDia.filter((r) => r.inicio === h);

            return (
              <div key={h} className="calendario-linha-dia linha-dia-compacta">
                {reservasNoHorario.length > 0 ? (
                  <div className="grupo-reservas-dia">
                    {reservasNoHorario.map((reserva) => (
                      <div
                        key={reserva.id}
                        className="bloco-reserva bloco-reserva-dia bloco-dia-esboco"
                      >
                        <div className="bloco-reserva-titulo">{reserva.titulo}</div>
                        <div className="bloco-reserva-professor">{reserva.professor}</div>
                      </div>
                    ))}
                  </div>
                ) : h === "14:50" ? (
                  <button
                    className="botao-slot-reserva faixa-solicitar"
                    onClick={() => abrirModalReserva(dataAtual)}
                  >
                    + Solicitar reserva
                  </button>
                ) : (
                  <div className="slot-vazio-dia"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderSemana = () => {
    const semana = getSemanaAtual(dataAtual);

    return (
      <div className="calendario-grade-semana">
        <div className="calendario-canto-vazio"></div>

        {semana.map((dia) => (
          <div key={dia.toISOString()} className="cabecalho-dia-semana">
            <span className="cabecalho-dia-nome">
              {diasSemana[dia.getDay()].replace("-feira", "")}
            </span>
            <span className="cabecalho-dia-numero">{dia.getDate()}</span>
          </div>
        ))}

        {horarios.map((hora) => (
          <React.Fragment key={hora}>
            <div className="calendario-hora-slot semana-hora">
              {horariosExibicao[hora].split("\n").map((linha, i) => (
                <span key={i}>{linha}</span>
              ))}
            </div>

            {semana.map((dia) => {
              const iso = formatarDataISO(dia);
              const reserva = reservasDaSemana.find(
                (r) => r.data === iso && r.inicio === hora
              );

              return (
                <div key={`${iso}-${hora}`} className="celula-semana">
                  {reserva ? (
                    <div className="bloco-reserva">
                      <div className="bloco-reserva-titulo">{reserva.titulo}</div>
                      <div className="bloco-reserva-professor">{reserva.professor}</div>
                    </div>
                  ) : (
                    <button
                      className="botao-slot-reserva hover-slot"
                      onClick={() => abrirModalReserva(dia)}
                    >
                      + Solicitar reserva
                    </button>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderMes = () => {
    const dias = getDiasDoMes(dataAtual);

    return (
      <div className="calendario-grade-mes">
        {diasSemanaCurto.map((dia) => (
          <div key={dia} className="cabecalho-mes">
            {dia}
          </div>
        ))}

        {dias.map((dia, index) => {
          if (!dia) {
            return <div key={index} className="celula-mes vazia"></div>;
          }

          const iso = formatarDataISO(dia);
          const reservasDia = reservasDoMes.filter((r) => r.data === iso);

          return (
            <div key={iso} className="celula-mes">
              <div className="numero-dia-mes">{dia.getDate()}</div>

              <div className="eventos-dia-mes">
                {reservasDia.slice(0, 2).map((reserva) => (
                  <div key={reserva.id} className="evento-mes">
                    <div className="evento-mes-topo">
                      <span className="evento-mes-bolinha"></span>
                      <span className="evento-mes-hora">
                        {reserva.inicio} - {reserva.fim}
                      </span>
                    </div>
                    <div className="evento-mes-titulo">{reserva.titulo}</div>
                    <div className="evento-mes-professor">{reserva.professor}</div>
                  </div>
                ))}

                {reservasDia.length === 0 && (
                  <button
                    className="botao-slot-reserva botao-mes"
                    onClick={() => abrirModalReserva(dia)}
                  >
                    + Solicitar reserva
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLista = () => (
    <div className="calendario-lista">
      {reservasDoMes.map((reserva) => (
        <div key={reserva.id} className="item-lista-reserva">
          <div className="item-lista-linha-superior">
            <span className="item-lista-horario">
              {reserva.inicio} - {reserva.fim}
            </span>
            <span className="item-lista-badge">{reserva.sala}</span>
          </div>
          <div className="item-lista-titulo">{reserva.professor}</div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <style>{styles}</style>

      <div className="calendario-page">
        <header className="calendario-header">
          <div className="calendario-header-row">
            <img
              src={iconCalendario}
              alt="Calendário"
              className="calendario-header-icon"
            />
            <h1 className="calendario-header-title">Calendário</h1>
          </div>

          <div className="header-line-wrap">
            <div className="header-line-main"></div>
            <div className="header-line-tail"></div>
          </div>
        </header>

        <section className="calendario-toolbar">
          <div className="calendario-toolbar-esquerda">
            <button className="btn-hoje" onClick={() => setDataAtual(new Date(2026, 1, 5))}>
              Hoje
            </button>

            <button className="btn-nav-data" onClick={mudarAnterior}>
              &lt;
            </button>

            <button className="btn-nav-data" onClick={mudarProximo}>
              &gt;
            </button>

            <span className="calendario-data-label">{renderTitulo()}</span>
          </div>

          <div className="calendario-toolbar-direita">
            <button
              className={`btn-modo ${modo === "dia" ? "ativo" : ""}`}
              onClick={() => setModo("dia")}
            >
              Dia
            </button>

            <button
              className={`btn-modo ${modo === "semana" ? "ativo" : ""}`}
              onClick={() => setModo("semana")}
            >
              Semana
            </button>

            <button
              className={`btn-modo ${modo === "mes" ? "ativo" : ""}`}
              onClick={() => setModo("mes")}
            >
              Mês
            </button>

            <button
              className={`btn-modo ${modo === "lista" ? "ativo" : ""}`}
              onClick={() => setModo("lista")}
            >
              Lista
            </button>
          </div>
        </section>

        <section className="calendario-subtoolbar">
          <div className="filtro-wrapper">
            <button
              className="btn-filtro"
              onClick={() => setMostrarFiltro((prev) => !prev)}
            >
              <img src={iconFiltro} alt="Filtro" />
              <span>{filtroSala || "Filtrar por sala..."}</span>
              <img src={iconSeta} alt="Abrir" />
            </button>

            {mostrarFiltro && (
              <div className="dropdown-filtro">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setFiltroSala("");
                    setMostrarFiltro(false);
                  }}
                >
                  Todas as salas
                </button>

                {salas.map((sala) => (
                  <button
                    key={sala}
                    className="dropdown-item"
                    onClick={() => {
                      setFiltroSala(sala);
                      setMostrarFiltro(false);
                    }}
                  >
                    {sala}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="calendario-instrucao">
            Clique em um retângulo para fazer uma reserva de sala.
          </div>
        </section>

        <section className="calendario-content">
          {modo === "dia" && renderDia()}
          {modo === "semana" && renderSemana()}
          {modo === "mes" && renderMes()}
          {modo === "lista" && renderLista()}
        </section>

        <footer className="calendario-legenda">
          <div className="legenda-item">
            <span className="legenda-quadrado branco"></span>
            <span>Em branco - Horário Livre</span>
          </div>

          <div className="legenda-item">
            <span className="legenda-quadrado vermelho"></span>
            <span>Em vermelho - Horário e Sala Reservada</span>
          </div>

          <div className="legenda-item">
            <span className="legenda-check"></span>
            <span>Ver como lista</span>
          </div>
        </footer>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-calendario" onClick={(e) => e.stopPropagation()}>
            <button className="modal-fechar" onClick={() => setModalAberto(false)}>
              <img src={iconX} alt="Fechar" />
            </button>

            <div className="modal-header-line">
              <h2 className="modal-title">Solicitar reserva</h2>
            </div>

            <div className="modal-form">
              <div className="modal-form-group">
                <label>Qual sala deseja reservar?</label>
                <select
                  value={salaSelecionada}
                  onChange={(e) => setSalaSelecionada(e.target.value)}
                >
                  {salas.map((sala) => (
                    <option key={sala} value={sala}>
                      {sala}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-form-group">
                <label>Nome da aula/matéria</label>
                <input
                  type="text"
                  value={nomeAula}
                  onChange={(e) => setNomeAula(e.target.value)}
                  placeholder="Digite o nome da aula"
                />
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label>Data da reserva</label>
                  <div className="input-with-icon">
                    <img src={iconData} alt="Data" className="input-icon" />
                    <input type="text" value={dataSelecionada} readOnly />
                  </div>
                </div>

                <div className="modal-form-group">
                  <label>Período (horário)</label>
                  <div className="input-with-icon">
                    <img src={iconHorario} alt="Horário" className="input-icon" />
                    <select
                      value={horarioSelecionado}
                      onChange={(e) => setHorarioSelecionado(e.target.value)}
                    >
                      <option>07:30 às 09:10</option>
                      <option>09:20 às 11:00</option>
                      <option>11:10 às 13:00</option>
                      <option>14:50 às 16:30</option>
                      <option>16:40 às 18:20</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-modal-cancelar" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>

                <button className="btn-modal-confirmar" onClick={() => setModalAberto(false)}>
                  Confirmar reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}