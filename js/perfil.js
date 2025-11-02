import { supabase } from "./supabaseClient.js";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const nomeUsuario = document.getElementById("nomeUsuario");
const emailUsuario = document.getElementById("emailUsuario");
const listaPlantas = document.getElementById("listaPlantas");

if (!usuarioLogado) {
  window.location.href = "/pages/login.html";
} else {
  nomeUsuario.textContent = usuarioLogado.nome;
  emailUsuario.textContent = usuarioLogado.email;
  carregarPlantas();
}

async function carregarPlantas() {
  const { data, error } = await supabase
    .from("usuario_plantas")
    .select("*, plantas(nome, descricao, imagem)")
    .eq("usuario_id", usuarioLogado.id);

  if (error) {
    console.error("Erro ao carregar plantas:", error);
    return;
  }

  if (!data || data.length === 0) {
    listaPlantas.innerHTML = `<p>Você ainda não adicionou nenhuma planta.</p>`;
    return;
  }

  for (const item of data) {
    const planta = item.plantas;
    const nomePlanta = planta?.nome || "Planta";
    const descricao = planta?.descricao || "Sem descrição disponível.";
    const imagem = await buscarImagem(planta?.imagem);

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${imagem}" alt="${nomePlanta}" />
      <h3>${nomePlanta}</h3>
    `;
    listaPlantas.appendChild(card);
  }
}

// função para buscar imagem pelo campo imagem
async function buscarImagem(nomeArquivo) {
  if (!nomeArquivo) return "../img/default.png";
  const basePath = "../img/";
  const formatos = ["jpg", "jpeg", "png", "webp"];

  for (const ext of formatos) {
    const path = `${basePath}${nomeArquivo.toLowerCase().replace(/\s+/g, "")}.${ext}`;
    try {
      const res = await fetch(path, { method: "HEAD" });
      if (res.ok) return path;
    } catch (e) {}
  }
  return "../img/default.png";
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "/pages/login.html";
});
