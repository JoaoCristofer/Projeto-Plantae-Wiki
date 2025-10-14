import { supabase } from "./supabaseClient.js";

async function carregarPlantas() {
  const { data, error } = await supabase.from("plantas").select("*");
  if (error) {
    console.error("Erro ao carregar plantas:", error);
    return;
  }

  const container = document.getElementById("plantasContainer");
  container.innerHTML = "";

  data.forEach((planta) => {
    const nome = planta.nome;
    const descricao = planta.descricao || "Sem descrição disponível.";
    const imagem = buscarImagem(planta.nome);

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
  });
}

// tenta carregar imagem independente do formato
function buscarImagem(nome) {
  const basePath = "../img/";
  const formatos = ["jpg", "jpeg", "png", "webp"];
  for (const ext of formatos) {
    const path = `${basePath}${nome.toLowerCase()}.${ext}`;
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", path, false);
    xhr.send();
    if (xhr.status === 200) return path;
  }
  return "../img/default.png";
}

carregarPlantas();
