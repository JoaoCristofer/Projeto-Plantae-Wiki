import { supabase } from "./supabaseClient.js";

async function carregarPlantas() {
  const { data, error } = await supabase.from("plantas").select("*");
  if (error) {
    console.error("Erro ao carregar plantas:", error);
    return;
  }

  const container = document.getElementById("plantasContainer");
  container.innerHTML = "";

  for (const planta of data) {
    const nome = planta.nome;
    const descricao = planta.descricao || "Sem descrição disponível.";
    // usa o campo imagem da tabela agora
    const imagem = await buscarImagem(planta.imagem);

    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${imagem}" alt="${nome}">
      <div class="card-content">
        <h3>${nome}</h3>
        <p>${descricao}</p>
        <div class="card-footer">
          <a href="plantadetalhe.html?id=${planta.id}" role="button">Ver detalhes</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  }
}

// tenta carregar imagem independente do formato (a partir do campo imagem)
async function buscarImagem(nomeArquivo) {
  const basePath = "../img/";
  const formatos = ["jpg", "jpeg", "png", "webp"];

  for (const ext of formatos) {
    const path = `${basePath}${nomeArquivo.toLowerCase().replace(/\s+/g, "")}.${ext}`;
    try {
      const res = await fetch(path, { method: "HEAD" });
      if (res.ok) return path;
    } catch (e) {
      // ignora erro e tenta o próximo formato
    }
  }
  return "../img/default.png";
}

carregarPlantas();
