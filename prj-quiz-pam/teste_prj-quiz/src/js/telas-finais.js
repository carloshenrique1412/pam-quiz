// js/telas-finais.js
import { estado, irParaTela } from './estado.js';

export function preencherRevisao() {
  document.getElementById("revisao-placar").innerHTML = `Você acertou <b>${estado.acertos}</b> de <b>${estado.totalSelecionado}</b> perguntas`;

  const lista = document.getElementById("revisao-lista");
  lista.innerHTML = "";

  estado.respostas.forEach((r, i) => {
    const div = document.createElement("div");
    div.className = "revisao-item " + (r.acertou ? "acertou" : "errou");

    let opcoesHTML = r.opcoes.map((op, oi) => {
      let cls = "neutra";
      let label = "";
      if (oi === r.respostaCorreta) {
        cls = "correta";
        label = "✓ Correta: ";
      } else if (oi === r.respostaDada && !r.acertou) {
        cls = "errada";
        label = "✗ Sua resp.: ";
      }
      return `<div class="revisao-resp ${cls}"><span class="revisao-resp-label">${label}</span>${op}</div>`;
      
      let resposta = {
        pergunta: r,
        resposta: oi
      }

      sessionStorage.setItem('resposta', JSON.stringify(resposta))

      console.log(resposta)
    }).join("");

    if (r.respostaDada === -1) {
      opcoesHTML += `<div class="revisao-resp errada"><span class="revisao-resp-label">⏰ Tempo esgotado</span></div>`;
    }

    div.innerHTML = `
      <div class="revisao-item-header">
        <span class="revisao-num">Q${i + 1}</span>
        <p class="revisao-pergunta">${r.pergunta}</p>
      </div>
      <div class="revisao-respostas">${opcoesHTML}</div>
    `;
    lista.appendChild(div);

  });
}

export function irParaResultado() {
  const pct = (estado.acertos / estado.totalSelecionado) * 100;
  let msg = "";

  if (pct === 100)      msg = "Perfeito! Você acertou tudo!";
  else if (pct >= 70)   msg = "Ótimo esforço! Continue assim!";
  else if (pct >= 40)   msg = "Bom começo! Pratique mais um pouco.";
  else                  msg = "Não desanime! Tente novamente.";

  document.getElementById("resultado-mensagem").innerHTML =
    `Você respondeu <b>${estado.acertos}</b> de <b>${estado.totalSelecionado}</b> perguntas corretamente. ${msg}`;

  irParaTela("tela-resultado");
}

export function irParaRevisao() {
  irParaTela("tela-revisao");
}

export function reiniciar() {
  estado.categoriaSelecionada = null;
  estado.totalSelecionado = null;
  document.querySelectorAll(".categoria-opcao").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".perguntas-btn").forEach(b => b.classList.remove("active"));
  irParaTela("tela1");
}