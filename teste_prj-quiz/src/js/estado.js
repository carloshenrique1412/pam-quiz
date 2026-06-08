// estado.js — estado global + sessionStorage

const CHAVE = "quiz_estado";

const INICIAL = {
  telaAtual: "tela1",
  questoes: [],
  indice: 0,
  acertos: 0,
  respostas: [],
  totalSelecionado: null,
  intervalo: null
};

function carregar() {
  try {
    const s = sessionStorage.getItem(CHAVE);
    if (s) return { ...INICIAL, ...JSON.parse(s), intervalo: null };
  } catch (_) {}
  return { ...INICIAL };
}

export function salvar() {
  const { intervalo, ...dados } = estado;
  sessionStorage.setItem(CHAVE, JSON.stringify(dados));
}

export function limpar() {
  sessionStorage.removeItem(CHAVE);
}

export function irParaTela(id) {
  document.getElementById(estado.telaAtual).classList.remove("active");
  document.getElementById(id).classList.add("active");
  estado.telaAtual = id;
  salvar();
}

export const estado = carregar();