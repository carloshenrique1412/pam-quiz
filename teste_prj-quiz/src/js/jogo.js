// jogo.js — timer + lógica das perguntas

import { estado, irParaTela, salvar } from './estado.js';

// ── Timer ──────────────────────────────────────────────
export function iniciarTimer() {
  let tempo = 15;
  document.querySelector(".tempo-duracao").textContent = `${tempo}s`;
  estado.intervalo = setInterval(() => {
    document.querySelector(".tempo-duracao").textContent = `${--tempo}s`;
    if (tempo <= 0) { pararTimer(); _tempoEsgotado(); }
  }, 1000);
}

export function pararTimer() {
  clearInterval(estado.intervalo);
}

// ── Renderização ───────────────────────────────────────
export function renderizarQuestao() {
  const q = estado.questoes[estado.indice];
  const pct = (estado.indice / estado.totalSelecionado) * 100;

  document.getElementById("pergunta-texto").textContent = q.questao;
  document.getElementById("prog-atual").textContent = estado.indice + 1;
  document.getElementById("prog-total").textContent = estado.totalSelecionado;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("pergunta-status").innerHTML =
    `<b>${estado.indice + 1}</b> de <b>${estado.totalSelecionado}</b> Perguntas`;

  const lista = document.getElementById("answer-opcoes");
  lista.innerHTML = "";
  q.opcoes.forEach((op, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;
    const p = document.createElement("p");
    p.textContent = op;
    li.appendChild(p);
    li.addEventListener("click", () => { pararTimer(); _responder(li); });
    lista.appendChild(li);
  });

  const r = estado.respostas[estado.indice];
  if (r) _marcarOpcoes(r.respostaCorreta, r.acertou ? -1 : r.respostaDada);
}

// ── Resposta ───────────────────────────────────────────
function _responder(liClicado) {
  const q = estado.questoes[estado.indice];
  const clicado = parseInt(liClicado.dataset.index);
  const acertou = clicado === q.respostaCorreta;

  if (acertou) estado.acertos++;
  _marcarOpcoes(q.respostaCorreta, acertou ? -1 : clicado);

  estado.respostas[estado.indice] = {
    pergunta: q.questao, opcoes: q.opcoes,
    respostaCorreta: q.respostaCorreta, respostaDada: clicado, acertou
  };
  salvar();
}

function _tempoEsgotado() {
  const q = estado.questoes[estado.indice];
  _marcarOpcoes(q.respostaCorreta, -1);
  estado.respostas[estado.indice] = {
    pergunta: q.questao, opcoes: q.opcoes,
    respostaCorreta: q.respostaCorreta, respostaDada: -1, acertou: false
  };
  salvar();
}

function _marcarOpcoes(correta, errada) {
  document.querySelectorAll(".answer-opcoes li").forEach(li => li.style.pointerEvents = "none");
  const liC = document.querySelector(`.answer-opcoes li[data-index="${correta}"]`);
  if (liC) { liC.classList.add("correta"); liC.innerHTML += `<span class="material-symbols-rounded">check_circle</span>`; }
  if (errada >= 0) {
    const liE = document.querySelector(`.answer-opcoes li[data-index="${errada}"]`);
    if (liE) { liE.classList.add("incorreta"); liE.innerHTML += `<span class="material-symbols-rounded">cancel</span>`; }
  }
}

// ── Navegação ──────────────────────────────────────────
export function proximaPergunta() {
  if (!estado.respostas[estado.indice]) {
    alert("Selecione uma resposta ou aguarde o timer!");
    return;
  }
  pararTimer();
  estado.indice++;
  salvar();

  if (estado.indice >= estado.totalSelecionado) {
    document.dispatchEvent(new CustomEvent("quiz:revisao"));
    return;
  }
  renderizarQuestao();
  iniciarTimer();
}