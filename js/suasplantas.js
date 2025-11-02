import { supabase } from "./supabaseClient.js";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const container = document.getElementById("plantasUsuario");

if (!usuarioLogado) {
  window.location.href = "/pages/login.html";
} else {
  carregarPlantasUsuario();
}

async function carregarPlantasUsuario() {
  const { data, error } = await supabase
    .from("usuario_plantas")
    .select("*, plantas(nome, descricao, imagem)")
    .eq("usuario_id", usuarioLogado.id);

  if (error) {
    console.error("Erro ao carregar plantas:", error);
    return;
  }

  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = `<p style="text-align:center;">Você ainda não adicionou nenhuma planta 🌱</p>`;
    return;
  }

  for (const item of data) {
    const planta = item.plantas;
    const nomePlanta = planta?.nome || "Planta";
    const apelido = item.nome_apelido ? ` (${item.nome_apelido})` : "";
    const descricao = planta?.descricao || "Sem descrição disponível.";
    const imagem = await buscarImagem(planta?.imagem);

    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${imagem}" alt="${nomePlanta}" />
      <div class="card-content">
        <h3>${nomePlanta}${apelido}</h3>
        <p>${descricao}</p>
        <small>Adicionada em: ${new Date(item.data_adicao).toLocaleDateString()}</small>
        <div class="card-footer">
          <a href="plantadetalhe.html?id=${item.planta_id}" role="button">Ver detalhes</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

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
