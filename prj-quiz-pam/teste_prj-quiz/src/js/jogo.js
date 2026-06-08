// js/jogo.js
import { estado, irParaTela } from './estado.js';
import { iniciarTimer, pararTimer } from './timer.js';
import { preencherRevisao } from './telas-finais.js';

export function renderizarQuestao() {
  const q = estado.questoes[estado.indice];

  document.getElementById("pergunta-texto").textContent = q.questao;
  document.getElementById("prog-atual").textContent = estado.indice + 1;
  document.getElementById("prog-total").textContent = estado.totalSelecionado;
  document.getElementById("progress-fill").style.width = ((estado.indice / estado.totalSelecionado) * 100) + "%";
  document.getElementById("pergunta-status").innerHTML = `<b>${estado.indice + 1}</b> de <b>${estado.totalSelecionado}</b> Perguntas`;

  const lista = document.getElementById("answer-opcoes");
  lista.innerHTML = "";

  q.opcoes.forEach((op, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;
    const p = document.createElement("p");
    p.textContent = op;
    li.appendChild(p);
    
    li.addEventListener("click", () => {
      pararTimer();
      verificarResposta(li);
    });
    lista.appendChild(li);
  });
}

export function verificarResposta(liClicado) {
  const q = estado.questoes[estado.indice];
  const correto = q.respostaCorreta;
  const clicado = parseInt(liClicado.dataset.index);

  document.querySelectorAll(".answer-opcoes li").forEach(li => {
    li.style.pointerEvents = "none";
  });

  const liCorreto = document.querySelector(`.answer-opcoes li[data-index="${correto}"]`);
  liCorreto.classList.add("correta");
  liCorreto.innerHTML += `<span class="material-symbols-rounded">check_circle</span>`;

  const acertou = clicado === correto;

  if (!acertou) {
    liClicado.classList.add("incorreta");
    liClicado.innerHTML += `<span class="material-symbols-rounded">cancel</span>`;
  } else {
    estado.acertos++;
  }

  estado.respostas.push({ pergunta: q.questao, opcoes: q.opcoes, respostaCorreta: correto, respostaDada: clicado, acertou });
}

export function tempoEsgotado() {
  const q = estado.questoes[estado.indice];

  document.querySelectorAll(".answer-opcoes li").forEach(li => {
    li.style.pointerEvents = "none";
  });

  const liCorreto = document.querySelector(`.answer-opcoes li[data-index="${q.respostaCorreta}"]`);
  if (liCorreto) {
    liCorreto.classList.add("correta");
    liCorreto.innerHTML += `<span class="material-symbols-rounded">check_circle</span>`;
  }

  estado.respostas.push({ pergunta: q.questao, opcoes: q.opcoes, respostaCorreta: q.respostaCorreta, respostaDada: -1, acertou: false });
}

export function proximaPergunta() {
  if (estado.respostas.length <= estado.indice) {
    alert("Selecione uma resposta ou aguarde o timer!");
    return;
  }

  estado.indice++;
  pararTimer();

  if (estado.indice >= estado.totalSelecionado) {
    preencherRevisao();
    irParaTela("tela-revisao");
    return;
  }

  renderizarQuestao();
  iniciarTimer();
}