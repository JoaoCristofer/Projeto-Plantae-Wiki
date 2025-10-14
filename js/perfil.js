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

// Buscar plantas do usuário
async function carregarPlantas() {
  const { data, error } = await supabase
    .from("usuario_plantas")
    .select("*, plantas(nome, descricao)")
    .eq("usuario_id", usuarioLogado.id);

  if (error) {
    console.error("Erro ao carregar plantas:", error);
    return;
  }

  if (data.length === 0) {
    listaPlantas.innerHTML = `<p>Você ainda não adicionou nenhuma planta.</p>`;
    return;
  }

  data.forEach((item) => {
    const nomePlanta = item.plantas.nome;
    const nomeArquivo = nomePlanta.toLowerCase().replace(/\s+/g, "");
    const imgExts = ["jpg", "jpeg", "png", "webp"];
    let imgSrc = "";

    for (const ext of imgExts) {
      const teste = `/img/${nomeArquivo}.${ext}`;
      imgSrc = teste;
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${imgSrc}" alt="${nomePlanta}" />
      <h3>${nomePlanta}</h3>
    `;
    listaPlantas.appendChild(card);
  });
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "/pages/login.html";
});
