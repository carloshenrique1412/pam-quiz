// js/estado.js
export const estado = {
  telaAtual: "tela1",
  categoriaSelecionada: null,
  totalSelecionado: null,
  questoes: [],
  indice: 0,
  acertos: 0,
  respostas: [], 
  intervalo: null
};

export function irParaTela(id) {
  document.getElementById(estado.telaAtual).classList.remove("active");
  document.getElementById(id).classList.add("active");
  estado.telaAtual = id;
}