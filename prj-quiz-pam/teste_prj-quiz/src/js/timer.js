// js/timer.js
import { estado } from './estado.js';
import { tempoEsgotado } from './jogo.js';

export function iniciarTimer() {
  let tempo = 15;
  document.querySelector(".tempo-duracao").textContent = `${tempo}s`;

  estado.intervalo = setInterval(() => {
    tempo--;
    document.querySelector(".tempo-duracao").textContent = `${tempo}s`;
    if (tempo <= 0) {
      pararTimer();
      tempoEsgotado();
    }
  }, 1000);
}

export function pararTimer() {
  clearInterval(estado.intervalo);
}