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
    titulo: "Sala 30",
    professor: "Professor Fretz",
    sala: "Sala 30",
    data: "2026-02-05",
    inicio: "14:50",
    fim: "16:30",
    status: "reservado",
  },
  {
    id: 2,
    titulo: "Sala 02",
    professor: "Professor VIT",
    sala: "Sala 02",
    data: "2026-02-05",
    inicio: "09:20",
    fim: "11:00",
    status: "reservado",
  },
  {
    id: 3,
    titulo: "Sala 02",
    professor: "Professor VIT",
    sala: "Sala 02",
    data: "2026-02-05",
    inicio: "14:50",
    fim: "16:30",
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
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .calendario-toolbar-esquerda {
    display: flex;
    align-items: center;
    gap: 8px;
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
  .filtro-select,
  .slot-add-dia,
  .slot-add-semana,
  .btn-lista-footer {
    font-family: inherit;
  }

  .btn-hoje {
    height: 26px;
    padding: 0 10px;
    border: 1px solid #d5d5d5;
    border-radius: 4px;
    background: #ffffff;
    color: #2f2f2f;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-nav-data {
    width: 20px;
    height: 20px;
    border: none;
    background: transparent;
    color: #4b5563;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .calendario-data-label {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #1f2937;
  }

  .btn-modo {
    min-width: 44px;
    height: 24px;
    padding: 0 10px;
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    background: #ffffff;
    color: #4b5563;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }

  .btn-modo.ativo {
    background: #c40000;
    color: #ffffff;
    border-color: #c40000;
  }

  .calendario-subtoolbar {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 18px;
  }

  .filtro-bloco {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .filtro-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #4b5563;
    font-weight: 700;
  }

  .filtro-label img {
    width: 16px;
    height: 16px;
    object-fit: contain;
  }

  .filtro-select-wrap {
    position: relative;
    width: 205px;
  }

  .filtro-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 100%;
    height: 40px;
    border: 1.5px solid #cfd4dc;
    border-radius: 10px;
    background: #f8f8f8;
    padding: 0 38px 0 16px;
    font-size: 13px;
    font-weight: 700;
    color: #2f2f2f;
    cursor: pointer;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  }

  .filtro-select:hover {
    background: #fbfbfb;
    border-color: #bcc3cd;
  }

  .filtro-select:focus {
    background: #ffffff;
    border-color: #aeb7c3;
    box-shadow: 0 0 0 3px rgba(180, 185, 195, 0.18);
  }

  .filtro-select-icone {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    object-fit: contain;
    pointer-events: none;
    opacity: 0.8;
  }

  .calendario-instrucao {
    text-align: center;
    font-size: 11px;
    color: #374151;
    font-weight: 700;
    margin: 12px 0 14px;
  }

  .calendario-content {
    background: #f1f1f1;
    border: 1px solid #ebebeb;
    border-radius: 0;
    padding: 12px;
  }

  /* DIA */
  .dia-wrapper {
    background: transparent;
  }

  .dia-agenda {
    display: flex;
    border: 1px solid #d4d4d4;
    border-radius: 6px;
    overflow: hidden;
    background: #ffffff;
  }

  .dia-coluna-horarios {
    width: 82px;
    min-width: 82px;
    background: #f1dede;
    border-right: 1px solid #d4d4d4;
    flex-shrink: 0;
  }

  .dia-horario {
    height: 66px;
    border-bottom: 1px solid #d4d4d4;
    padding: 10px 8px 0 10px;
    font-size: 12px;
    font-weight: 700;
    color: #243244;
    line-height: 1.18;
    white-space: pre-line;
    overflow: hidden;
  }

  .dia-horario:last-child {
    border-bottom: none;
  }

  .dia-grade {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }

  .dia-linha {
    min-height: 66px;
    border-bottom: 1px solid #d4d4d4;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    position: relative;
    padding: 0;
    background: #ffffff;
  }

  .dia-linha:last-child {
    border-bottom: none;
  }

  .dia-linha-conteudo {
    width: 100%;
    min-height: 66px;
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 10px 12px;
  }

  .mini-box-reserva {
    width: 96px;
    min-height: 44px;
    background: #fdeeee;
    border: 1px solid #ef6b6b;
    border-radius: 2px;
    padding: 6px 6px 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .mini-box-titulo {
    font-size: 10px;
    line-height: 1.05;
    font-weight: 700;
    color: #d00000;
    margin-bottom: 4px;
  }

  .mini-box-professor {
    font-size: 8px;
    line-height: 1.08;
    font-weight: 700;
    color: #262626;
  }

  .slot-add-dia {
    position: absolute;
    inset: 0;
    opacity: 0;
    border: 1px solid #ef6b6b;
    background: #fdeeee;
    color: #c40000;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .dia-linha:hover .slot-add-dia {
    opacity: 1;
  }

  .dia-linha.tem-reserva:hover .slot-add-dia {
    display: none;
  }

  /* SEMANA */
  .semana-wrapper {
    background: #ffffff;
  }

  .calendario-grade-semana {
    display: grid;
    grid-template-columns: 82px repeat(6, 1fr);
    border: 1px solid #d4d4d4;
    background: #ffffff;
  }

  .calendario-canto-vazio {
    height: 38px;
    background: #f1dede;
    border-right: 1px solid #d4d4d4;
    border-bottom: 1px solid #d4d4d4;
  }

  .cabecalho-dia-semana {
    height: 38px;
    background: #ffffff;
    border-right: 1px solid #d4d4d4;
    border-bottom: 1px solid #d4d4d4;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    padding: 2px 4px;
  }

  .cabecalho-dia-semana.destacado {
    background: #f1dede;
  }

  .cabecalho-dia-nome {
    font-size: 10px;
    line-height: 1;
    font-weight: 700;
    color: #243244;
    text-align: center;
  }

  .cabecalho-dia-numero {
    font-size: 11px;
    line-height: 1;
    font-weight: 700;
    color: #111827;
  }

  .cabecalho-dia-bolinha {
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #c40000;
    color: #ffffff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
  }

  .semana-hora {
    background: #f1dede;
    border-right: 1px solid #d4d4d4;
  }

  .calendario-hora-slot {
    min-height: 66px;
    border-bottom: 1px solid #d4d4d4;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 1px;
    padding: 10px 8px 0 10px;
    font-size: 12px;
    line-height: 1.18;
    font-weight: 700;
    color: #243244;
    white-space: pre-line;
    overflow: hidden;
  }

  .celula-semana {
    min-height: 66px;
    border-right: 1px solid #d4d4d4;
    border-bottom: 1px solid #d4d4d4;
    position: relative;
    background: #ffffff;
    padding: 0;
    overflow: hidden;
  }

  .celula-semana-conteudo {
    width: 100%;
    height: 100%;
    min-height: 66px;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 6px;
  }

  .mini-box-semana {
    width: 96px;
    min-width: 96px;
    max-width: 96px;
    min-height: 50px;
    background: #fdeeee;
    border: 1px solid #ef6b6b;
    border-radius: 0;
    padding: 6px 6px 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    box-sizing: border-box;
  }

  .mini-box-semana .mini-box-titulo {
    font-size: 10px;
    line-height: 1.05;
    margin-bottom: 4px;
    color: #d00000;
    font-weight: 700;
    white-space: normal;
    word-break: normal;
    overflow-wrap: break-word;
  }

  .mini-box-semana .mini-box-professor {
    font-size: 8px;
    line-height: 1.08;
    color: #111111;
    font-weight: 700;
    white-space: normal;
    word-break: normal;
    overflow-wrap: break-word;
  }

  .slot-add-semana {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    border: 1px solid #ef6b6b;
    background: #fdeeee;
    color: #c40000;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.15s ease;
  }

  .celula-semana:hover .slot-add-semana {
    opacity: 1;
  }

  .celula-semana.tem-reserva:hover .slot-add-semana {
    display: none;
  }

  /* MÊS */
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
    border: 1px solid #df9f9f;
    background: #f7e8e8;
    color: #c40000;
    border-radius: 0;
    padding: 5px 8px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .celula-mes:hover .botao-mes {
    opacity: 1;
  }

  /* LISTA */
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

  /* RODAPÉ */
  .calendario-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .calendario-legenda {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
    font-size: 10px;
    color: #5a5a5a;
  }

  .legenda-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
  }

  .legenda-quadrado {
    width: 7px;
    height: 7px;
    border: 1px solid #cbcbcb;
    display: inline-block;
    border-radius: 2px;
  }

  .legenda-quadrado.branco {
    background: #e4e4e4;
    border-color: #e4e4e4;
  }

  .legenda-quadrado.vermelho {
    background: #c40000;
    border-color: #c40000;
  }

  .btn-lista-footer {
    height: 24px;
    padding: 0 12px;
    border: 1px solid #d2d6dc;
    border-radius: 6px;
    background: #ffffff;
    color: #4b5563;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  /* MODAL */
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
      padding: 24px 18px 24px;
    }

    .calendario-header-title {
      font-size: 28px;
    }

    .calendario-header-icon {
      width: 40px;
      height: 40px;
    }

    .header-line-main {
      width: 120px;
      height: 8px;
    }

    .header-line-tail {
      width: 120px;
    }

    .calendario-content {
      overflow-x: auto;
    }

    .dia-agenda,
    .calendario-grade-semana,
    .calendario-grade-mes {
      min-width: 900px;
    }

    .filtro-bloco {
      width: 100%;
      align-items: flex-start;
      flex-direction: column;
      gap: 10px;
    }

    .filtro-select-wrap {
      width: 100%;
      max-width: 260px;
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

  const semana: Date[] = [];
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

function getFimByInicio(inicio: string) {
  const mapa: Record<string, string> = {
    "07:30": "09:10",
    "09:20": "11:00",
    "11:10": "13:00",
    "14:50": "16:30",
    "16:40": "18:20",
  };

  return mapa[inicio] ?? "00:00";
}

function normalizarSala(valor: string) {
  const encontrada = salas.find(
    (s) => s.toLowerCase() === valor.toLowerCase().trim()
  );
  return encontrada ?? "";
}

export default function CalendarioDocente() {
  const [modo, setModo] = useState<ModoVisualizacao>("dia");
  const [dataAtual, setDataAtual] = useState(new Date(2026, 1, 5));
  const [filtroSala, setFiltroSala] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [dataSelecionadaISO, setDataSelecionadaISO] = useState(
    formatarDataISO(new Date(2026, 1, 5))
  );
  const [salaSelecionada, setSalaSelecionada] = useState("Sala 30");
  const [horarioSelecionado, setHorarioSelecionado] = useState("14:50 às 16:30");
  const [nomeAula, setNomeAula] = useState("");

  const reservasFiltradas = useMemo(() => {
    if (!filtroSala.trim()) return reservasMock;
    const termo = filtroSala.toLowerCase().trim();
    return reservasMock.filter((r) => r.sala.toLowerCase().includes(termo));
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

  const abrirModalReserva = (data: Date, horario?: string, salaPadrao?: string) => {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    const nomeDia = diasSemana[data.getDay()];

    setDataSelecionada(`${dia}/${mes}/${ano} (${nomeDia})`);
    setDataSelecionadaISO(formatarDataISO(data));

    if (horario) {
      setHorarioSelecionado(`${horario} às ${getFimByInicio(horario)}`);
    } else {
      setHorarioSelecionado("14:50 às 16:30");
    }

    if (salaPadrao) {
      setSalaSelecionada(salaPadrao);
    } else if (filtroSala.trim()) {
      setSalaSelecionada(normalizarSala(filtroSala) || "Sala 30");
    } else {
      setSalaSelecionada("Sala 30");
    }

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
      <div className="dia-wrapper">
        <div className="dia-agenda">
          <div className="dia-coluna-horarios">
            {horarios.map((h) => (
              <div key={h} className="dia-horario">
                {horariosExibicao[h]}
              </div>
            ))}
          </div>

          <div className="dia-grade">
            {horarios.map((h) => {
              const reserva = reservasDoDia.find((r) => r.inicio === h);

              return (
                <div
                  key={h}
                  className={`dia-linha ${reserva ? "tem-reserva" : ""}`}
                >
                  <div className="dia-linha-conteudo">
                    {reserva && (
                      <div className="mini-box-reserva">
                        <div className="mini-box-titulo">{reserva.sala}</div>
                        <div className="mini-box-professor">{reserva.professor}</div>
                      </div>
                    )}

                    {!reserva && (
                      <button
                        type="button"
                        className="slot-add-dia"
                        onClick={() => abrirModalReserva(dataAtual, h)}
                      >
                        + Solicitar reserva
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderSemana = () => {
  const semana = getSemanaAtual(dataAtual);
  const diaDestaque = dataAtual.getDate();

  return (
    <div className="semana-wrapper">
      <div className="calendario-grade-semana">
        <div className="calendario-canto-vazio"></div>

        {semana.map((dia) => {
          const destacado = dia.getDate() === diaDestaque;

          return (
            <div
              key={dia.toISOString()}
              className={`cabecalho-dia-semana ${destacado ? "destacado" : ""}`}
            >
              <span className="cabecalho-dia-nome">
                {diasSemana[dia.getDay()].replace("-feira", "")}
              </span>

              {destacado ? (
                <span className="cabecalho-dia-bolinha">{dia.getDate()}</span>
              ) : (
                <span className="cabecalho-dia-numero">{dia.getDate()}</span>
              )}
            </div>
          );
        })}

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
                <div
  key={`${iso}-${hora}`}
  className={`celula-semana ${reserva ? "tem-reserva" : ""}`}
>
  <div className="celula-semana-conteudo">
    {reserva ? (
      <div className="mini-box-semana">
        <div className="mini-box-titulo">{reserva.sala}</div>
        <div className="mini-box-professor">{reserva.professor}</div>
      </div>
    ) : (
      <button
        type="button"
        className="slot-add-semana"
        onClick={() => abrirModalReserva(dia, hora)}
      >
        + Solicitar reserva
      </button>
    )}
  </div>
</div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
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
                    type="button"
                    className="botao-mes"
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
            <button
              type="button"
              className="btn-hoje"
              onClick={() => setDataAtual(new Date(2026, 1, 5))}
            >
              Hoje
            </button>

            <button type="button" className="btn-nav-data" onClick={mudarAnterior}>
              ‹
            </button>

            <button type="button" className="btn-nav-data" onClick={mudarProximo}>
              ›
            </button>

            <span className="calendario-data-label">{renderTitulo()}</span>
          </div>

          <div className="calendario-toolbar-direita">
            <button
              type="button"
              className={`btn-modo ${modo === "dia" ? "ativo" : ""}`}
              onClick={() => setModo("dia")}
            >
              Dia
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "semana" ? "ativo" : ""}`}
              onClick={() => setModo("semana")}
            >
              Semana
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "mes" ? "ativo" : ""}`}
              onClick={() => setModo("mes")}
            >
              Mês
            </button>

            <button
              type="button"
              className={`btn-modo ${modo === "lista" ? "ativo" : ""}`}
              onClick={() => setModo("lista")}
            >
              Lista
            </button>
          </div>
        </section>

        <section className="calendario-subtoolbar">
  <div className="filtro-bloco">
    <div className="filtro-label">
      <img src={iconFiltro} alt="Filtro" />
      <span>Filtros:</span>
    </div>

    <div className="filtro-select-wrap">
      <select
        className="filtro-select"
        value={filtroSala}
        onChange={(e) => setFiltroSala(e.target.value)}
      >
        <option value="">Filtrar por sala...</option>
        {salas.map((sala) => (
          <option key={sala} value={sala}>
            {sala}
          </option>
        ))}
      </select>

      <img
        src={iconSeta}
        alt="Abrir seleção"
        className="filtro-select-icone"
      />
    </div>
  </div>
</section>

        <div className="calendario-instrucao">
          Clique em um retângulo para fazer uma reserva de sala.
        </div>

        <section className="calendario-content">
          {modo === "dia" && renderDia()}
          {modo === "semana" && renderSemana()}
          {modo === "mes" && renderMes()}
          {modo === "lista" && renderLista()}
        </section>

        <footer className="calendario-footer">
          <div className="calendario-legenda">
            <div className="legenda-item">
              <span className="legenda-quadrado branco"></span>
              <span>Em Branco - Horário Livre</span>
            </div>

            <div className="legenda-item">
              <span className="legenda-quadrado vermelho"></span>
              <span>Em Vermelho - Horário e Sala Reservada</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-lista-footer"
            onClick={() => setModo("lista")}
          >
            ☰ Ver como lista
          </button>
        </footer>
      </div>

      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-calendario" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-fechar"
              onClick={() => setModalAberto(false)}
            >
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
                      <option value="07:30 às 09:10">07:30 às 09:10</option>
                      <option value="09:20 às 11:00">09:20 às 11:00</option>
                      <option value="11:10 às 13:00">11:10 às 13:00</option>
                      <option value="14:50 às 16:30">14:50 às 16:30</option>
                      <option value="16:40 às 18:20">16:40 às 18:20</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancelar"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-modal-confirmar"
                  onClick={() => setModalAberto(false)}
                >
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