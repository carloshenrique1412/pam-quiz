// leaderboard.js — busca o ranking no backend (banco de dados) e desenha a lista

const API_URL = "http://localhost:3000/api/leaderboard";
const MEDALHAS = ["🥇", "🥈", "🥉"];

const lista = document.getElementById("lb-lista");
const status = document.getElementById("lb-status");

function criarLinha(jogador, i) {
  const li = document.createElement("li");
  li.className = "lb-linha" + (i < 3 ? ` top${i + 1}` : "");

  const pos = document.createElement("span");
  pos.className = "lb-pos";
  pos.textContent = i < 3 ? MEDALHAS[i] : `#${i + 1}`;

  // textContent (e não innerHTML): o nome vem do banco e foi digitado pelo usuário
  const nome = document.createElement("span");
  nome.className = "lb-nome";
  nome.textContent = jogador.nome;

  const acertos = document.createElement("span");
  acertos.className = "lb-acertos";
  acertos.textContent = jogador.acertos;

  li.append(pos, nome, acertos);
  return li;
}

async function carregarRanking() {
  try {
    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error(`Erro ${resp.status}`);

    const ranking = await resp.json();
    if (!Array.isArray(ranking)) throw new Error("Resposta inesperada do servidor");

    if (ranking.length === 0) {
      status.textContent = "Nenhum resultado registrado ainda. Seja o primeiro da lista!";
      return;
    }

    status.textContent = "";
    lista.replaceChildren(...ranking.map(criarLinha));
  } catch (erro) {
    console.error("Erro ao carregar ranking:", erro);
    status.classList.add("erro");
    status.textContent = "Não foi possível carregar o ranking. Verifique se o servidor está rodando.";
  }
}

// Volta para o quiz (index.html restaura a tela de resultado pela sessionStorage)
document.getElementById("btn-voltar").addEventListener("click", () => {
  location.href = "index.html";
});

carregarRanking();
