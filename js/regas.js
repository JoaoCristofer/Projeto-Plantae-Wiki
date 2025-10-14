import { supabase } from "./supabaseClient.js";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
const listaRega = document.getElementById("listaRega");

if (!usuarioLogado) {
  window.location.href = "/pages/login.html";
} else {
  carregarRegas();
}

async function carregarRegas() {
  const { data, error } = await supabase
    .from("usuario_plantas")
    .select("*, plantas(nome)")
    .eq("usuario_id", usuarioLogado.id);

  if (error) {
    console.error("Erro ao carregar regas:", error);
    return;
  }

  listaRega.innerHTML = "";

  if (!data || data.length === 0) {
    listaRega.innerHTML = `<p style="text-align:center;">Você ainda não possui plantas cadastradas 🌱</p>`;
    return;
  }

  data.forEach((item) => {
    const planta = item.plantas;
    const nome = item.nome_apelido || planta?.nome || "Planta desconhecida";
    const freqDias = item.frequencia_rega || 7;
    const ultimaRega = item.data_ultima_rega
      ? new Date(item.data_ultima_rega)
      : null;
    const proximaRega = item.proxima_rega
      ? new Date(item.proxima_rega)
      : ultimaRega
      ? new Date(ultimaRega.getTime() + freqDias * 86400000)
      : null;

    const hoje = new Date();
    const precisaRegar = proximaRega && hoje >= proximaRega;

    const card = document.createElement("article");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${nome}</h3>
      <p><strong>Frequência:</strong> a cada ${freqDias} dias</p>
      <p><strong>Última rega:</strong> ${
        ultimaRega ? ultimaRega.toLocaleDateString() : "Nunca"
      }</p>
      <p><strong>Próxima rega:</strong> ${
        proximaRega ? proximaRega.toLocaleDateString() : "Indefinida"
      }</p>
      <button class="regar-btn" data-id="${item.id}" ${
      precisaRegar ? 'style="background-color:#2ecc71;"' : ""
    }>
        Regar agora 🌿
      </button>
    `;

    listaRega.appendChild(card);
  });

  document.querySelectorAll(".regar-btn").forEach((btn) => {
    btn.addEventListener("click", () => regarPlanta(btn.dataset.id));
  });
}

async function regarPlanta(id) {
  // Busca a planta atual para pegar a frequência
  const { data: plantaData, error: fetchError } = await supabase
    .from("usuario_plantas")
    .select("frequencia_rega")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Erro ao buscar frequência:", fetchError);
    alert("Erro ao buscar dados da planta.");
    return;
  }

  const freq = plantaData?.frequencia_rega || 7;
  const hoje = new Date();
  const proxima = new Date(hoje.getTime() + freq * 86400000);

  const { error } = await supabase
    .from("usuario_plantas")
    .update({
      data_ultima_rega: hoje.toISOString(),
      proxima_rega: proxima.toISOString(),
    })
    .eq("id", id);

  if (error) {
    alert("Erro ao atualizar a rega: " + error.message);
    return;
  }

  alert("🌿 Planta regada com sucesso!");
  carregarRegas();
}
