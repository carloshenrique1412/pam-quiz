// script.js
import { estado, irParaTela, salvar, limpar } from './estado.js';

import { enviarDadosBackend } from './passandoDados.js';
import { iniciarTimer, renderizarQuestao, proximaPergunta } from './jogo.js';

const TOTAL = 5;

// ── Resultado ──────────────────────────────────────────
function _msgResultado() {
  const pct = (estado.acertos / estado.totalSelecionado) * 100;
  const msg = pct === 100 ? "Perfeito! Você acertou tudo!"
    : pct >= 70 ? "Ótimo esforço! Continue assim!"
      : pct >= 40 ? "Bom começo! Pratique mais um pouco."
        : "Não desanime! Tente novamente.";
  document.getElementById("resultado-mensagem").innerHTML =
    `Você respondeu <b>${estado.acertos}</b> de <b>${estado.totalSelecionado}</b> perguntas corretamente. ${msg}`;

    enviarDadosBackend(); // Chama a função para enviar os dados ao backend
}

function escaparHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Revisão ────────────────────────────────────────────
function preencherRevisao() {
  document.getElementById("revisao-placar").innerHTML =
    `Você acertou <b>${estado.acertos}</b> de <b>${estado.totalSelecionado}</b> perguntas`;

  document.getElementById("revisao-lista").innerHTML = estado.respostas.map((r, i) => {
    const opcoes = r.opcoes.map((op, oi) => {
      const cls = oi === r.respostaCorreta ? "correta"
        : (oi === r.respostaDada && !r.acertou) ? "errada" : "neutra";
      const label = oi === r.respostaCorreta ? ""
        : (oi === r.respostaDada && !r.acertou) ? "" : "";
      return `<div class="revisao-resp ${cls}"><span class="revisao-resp-label">${label}</span>${escaparHTML(op)}</div>`;
    }).join("") + (r.respostaDada === -1
      ? `<div class="revisao-resp errada"><span class="revisao-resp-label">⏰ Tempo esgotado</span></div>` : "");

    return `<div class="revisao-item ${r.acertou ? "acertou" : "errou"}">
      <div class="revisao-item-header">
        <span class="revisao-num">Q${i + 1}</span>
        <p class="revisao-pergunta">${r.pergunta}</p>
      </div>
      <div class="revisao-respostas">${opcoes}</div>
    </div>`;
  }).join("");
}

// ── Evento disparado pelo jogo.js ao terminar perguntas ─
document.addEventListener("quiz:revisao", () => {
  preencherRevisao();
  irParaTela("tela-revisao");
});

// ── Ações públicas (onclick no HTML) ──────────────────
document.addEventListener("DOMContentLoaded", () => {
  window.iniciarQuiz = async function () {
    const db = await fetch("./src/data/questoes.json").then(r => r.json());
    const pool = Object.values(db).flat().sort(() => Math.random() - 0.5);
    Object.assign(estado, { questoes: pool.slice(0, TOTAL), totalSelecionado: TOTAL, indice: 0, acertos: 0, respostas: [] });
    salvar();
    irParaTela("pergunta-screen");
    renderizarQuestao();
    iniciarTimer();
  };

  window.proximaPergunta = proximaPergunta;
 window.irParaResultado = function () {
  _msgResultado();
  mostrarDadosUsuario();
  irParaTela("tela-resultado");
};
  window.irParaRevisao = function () { preencherRevisao(); irParaTela("tela-revisao"); };
  window.reiniciar = function () { limpar(); sessionStorage.clear(); location.href = 'formInicio.html'; };

  // ── Restaura sessão ao recarregar ──────────────────
  const tela = estado.telaAtual;
  if (tela && tela !== "tela1") {
    document.getElementById("tela1").classList.remove("active");
    document.getElementById(tela).classList.add("active");
    if (tela === "pergunta-screen") { renderizarQuestao(); iniciarTimer(); }
    else if (tela === "tela-revisao") preencherRevisao();
    else if (tela === "tela-resultado") _msgResultado();
  }
});

function mostrarDadosUsuario() {
  const p = JSON.parse(sessionStorage.getItem('pessoa'));
  if (!p) return;

  document.getElementById('dados-usuario').innerHTML = `
    <div class="dados-box">
      <p>Nome: ${p.nome}</p>
      <p>Email: ${p.email}</p>
      <p>Estado: ${p.estado}</p>
      <p>Sexo: ${p.sexo}</p>
    </div>
  `;
}

