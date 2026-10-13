// leaderboard.js — busca o ranking no backend (banco de dados), desenha a lista
// e permite editar (PUT) e excluir (DELETE) cada resultado

const API = "http://localhost:3000/api";
const MEDALHAS = ["🥇", "🥈", "🥉"];
const MAX_ACERTOS = 5; // total de questões do quiz (mesmo valor de TOTAL em script.js)

const lista = document.getElementById("lb-lista");
const status = document.getElementById("lb-status");

// ── Chamadas ao backend ────────────────────────────────
async function chamarApi(url, options) {
  const resp = await fetch(url, options);
  const corpo = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(corpo.erro || `Erro ${resp.status}`);
  return corpo;
}

const atualizarResultado = (id, nome, acertos) =>
  chamarApi(`${API}/resultado/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, acertos }),
  });

const excluirResultado = (id) =>
  chamarApi(`${API}/resultado/${id}`, { method: "DELETE" });

// ── Montagem das linhas ────────────────────────────────
function criarBotao(texto, titulo, classe, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "lb-btn" + (classe ? ` ${classe}` : "");
  btn.textContent = texto;
  btn.title = titulo;
  btn.addEventListener("click", () => onClick(btn));
  return btn;
}

function classeLinha(i) {
  return "lb-linha" + (i < 3 ? ` top${i + 1}` : "");
}

function criarPosicao(i) {
  const pos = document.createElement("span");
  pos.className = "lb-pos";
  pos.textContent = i < 3 ? MEDALHAS[i] : `#${i + 1}`;
  return pos;
}

// Linha normal (só leitura)
function criarLinha(jogador, i) {
  const li = document.createElement("li");
  li.className = classeLinha(i);

  // textContent (e não innerHTML): o nome vem do banco e foi digitado pelo usuário
  const nome = document.createElement("span");
  nome.className = "lb-nome";
  nome.textContent = jogador.nome;

  const acertos = document.createElement("span");
  acertos.className = "lb-acertos";
  acertos.textContent = jogador.acertos;

  const acoes = document.createElement("div");
  acoes.className = "lb-acoes";
  acoes.append(
    criarBotao("✏", "Editar", "", () => li.replaceWith(criarLinhaEdicao(jogador, i))),
    criarBotao("🗑", "Excluir", "perigo", (btn) => confirmarExclusao(jogador, btn))
  );

  li.append(criarPosicao(i), nome, acertos, acoes);
  return li;
}

// Linha em modo edição (inputs no lugar do nome e dos acertos)
function criarLinhaEdicao(jogador, i) {
  const li = document.createElement("li");
  li.className = classeLinha(i) + " editando";

  const inputNome = document.createElement("input");
  inputNome.className = "field-input";
  inputNome.type = "text";
  inputNome.maxLength = 100;
  inputNome.value = jogador.nome;
  inputNome.setAttribute("aria-label", "Nome");

  const inputAcertos = document.createElement("input");
  inputAcertos.className = "field-input lb-input-acertos";
  inputAcertos.type = "number";
  inputAcertos.min = 0;
  inputAcertos.max = MAX_ACERTOS;
  inputAcertos.value = jogador.acertos;
  inputAcertos.setAttribute("aria-label", "Acertos");

  const cancelar = () => li.replaceWith(criarLinha(jogador, i));

  const salvar = async (btn) => {
    const nome = inputNome.value.trim();
    const acertos = Number(inputAcertos.value);

    if (!nome) return alert("Informe o nome do jogador.");
    if (inputAcertos.value === "" || !Number.isInteger(acertos) || acertos < 0 || acertos > MAX_ACERTOS) {
      return alert(`Acertos deve ser um número inteiro de 0 a ${MAX_ACERTOS}.`);
    }

    btn.disabled = true;
    try {
      await atualizarResultado(jogador.id, nome, acertos);
      await carregarRanking(); // recarrega: a posição pode mudar com os novos acertos
    } catch (erro) {
      btn.disabled = false;
      alert(`Não foi possível salvar: ${erro.message}`);
    }
  };

  const acoes = document.createElement("div");
  acoes.className = "lb-acoes";
  const btnSalvar = criarBotao("✔", "Salvar", "ok", salvar);
  acoes.append(btnSalvar, criarBotao("✖", "Cancelar", "", cancelar));

  // Enter salva, Esc cancela
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter") salvar(btnSalvar);
    if (e.key === "Escape") cancelar();
  });

  li.append(criarPosicao(i), inputNome, inputAcertos, acoes);
  setTimeout(() => inputNome.focus(), 0);
  return li;
}

async function confirmarExclusao(jogador, btn) {
  if (!confirm(`Excluir o resultado de "${jogador.nome}" (${jogador.acertos} acertos)?\nEssa ação não pode ser desfeita.`)) return;

  btn.disabled = true;
  try {
    await excluirResultado(jogador.id);
    await carregarRanking();
  } catch (erro) {
    btn.disabled = false;
    alert(`Não foi possível excluir: ${erro.message}`);
  }
}

// ── Carregar ranking ───────────────────────────────────
async function carregarRanking() {
  try {
    const ranking = await chamarApi(`${API}/leaderboard`);
    if (!Array.isArray(ranking)) throw new Error("Resposta inesperada do servidor");

    status.classList.remove("erro");

    if (ranking.length === 0) {
      lista.replaceChildren();
      status.textContent = "Nenhum resultado registrado ainda. Seja o primeiro da lista!";
      return;
    }

    status.textContent = "";
    lista.replaceChildren(...ranking.map(criarLinha));
  } catch (erro) {
    console.error("Erro ao carregar ranking:", erro);
    lista.replaceChildren();
    status.classList.add("erro");
    status.textContent = "Não foi possível carregar o ranking. Verifique se o servidor está rodando.";
  }
}

// Volta para o quiz (index.html restaura a tela de resultado pela sessionStorage)
document.getElementById("btn-voltar").addEventListener("click", () => {
  location.href = "index.html";
});

carregarRanking();
