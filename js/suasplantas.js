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
    .select("*, plantas(nome, descricao)")
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

  data.forEach((item) => {
    const planta = item.plantas;
    const nomePlanta = planta?.nome || "Planta";
    const apelido = item.nome_apelido ? ` (${item.nome_apelido})` : "";
    const nomeArquivo = nomePlanta.toLowerCase().replace(/\s+/g, "");
    const imgExts = ["jpg", "jpeg", "png", "webp"];
    let imgSrc = "";

    for (const ext of imgExts) {
      imgSrc = `/img/${nomeArquivo}.${ext}`;
    }

    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${imgSrc}" alt="${nomePlanta}" />
      <div class="card-content">
        <h3>${nomePlanta}${apelido}</h3>
        <p>${planta?.descricao || "Sem descrição disponível."}</p>
        <small>Adicionada em: ${new Date(item.data_adicao).toLocaleDateString()}</small>
        <div class="card-footer">
          <a href="plantadetalhe.html?id=${item.planta_id}" role="button">Ver detalhes</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}
