

// 1. Importa o estado e as funções dos outros módulos
import { estado, irParaTela } from './estado.js';
import { iniciarTimer } from './timer.js';
import { renderizarQuestao, proximaPergunta } from './jogo.js';
import { irParaResultado, irParaRevisao, reiniciar } from './telas-finais.js';

// 2. Configuração dos botões na tela inicial (Configuração de Categoria)
document.querySelectorAll(".categoria-opcao").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".categoria-opcao").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    estado.categoriaSelecionada = btn.dataset.cat;
  });
});

// Configuração da quantidade de perguntas
document.querySelectorAll(".perguntas-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".perguntas-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    estado.totalSelecionado = parseInt(btn.dataset.total);
  });
});

// Função para dar o pontapé inicial no Quiz
function iniciarQuiz() {
  if (!estado.categoriaSelecionada || !estado.totalSelecionado) {
    alert("Selecione uma categoria e o número de perguntas!");
    return;
  }

  // Captura do banco QUESTOES_DB global
  const pool = [...QUESTOES_DB[estado.categoriaSelecionada]].sort(() => Math.random() - 0.5);
  estado.questoes = pool.slice(0, estado.totalSelecionado);
  estado.indice = 0;
  estado.acertos = 0;
  estado.respostas = [];

  irParaTela("pergunta-screen");
  renderizarQuestao();
  iniciarTimer();
}

// 3. EXPÕE AS FUNÇÕES PARA O HTML
// Como o HTML não enxerga o que está dentro de módulos JS, anexamos o que for usado
// em atributos "onclick" diretamente no objeto "window".
window.irParaTela = irParaTela;
window.iniciarQuiz = iniciarQuiz;
window.proximaPergunta = proximaPergunta;
window.irParaResultado = irParaResultado;
window.irParaRevisao = irParaRevisao;
window.reiniciar = reiniciar;