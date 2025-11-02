import { supabase } from "./supabaseClient.js";

const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
if (!usuarioLogado) {
  window.location.href = "/pages/login.html";
}

const params = new URLSearchParams(window.location.search);
const plantaId = params.get("id");

const nomeEl = document.getElementById("nomePlanta");
const descricaoEl = document.getElementById("descricaoPlanta");
const detalhesEl = document.getElementById("detalhesPlanta");
const imgEl = document.getElementById("imgPlanta");
const btnAdd = document.getElementById("btnAdicionar");

let plantaAtual = null;

async function carregarPlanta() {
  const { data, error } = await supabase
    .from("plantas")
    .select("*")
    .eq("id", plantaId)
    .single();

  if (error) {
    console.error("Erro ao carregar planta:", error);
    return;
  }

  plantaAtual = data;
  nomeEl.textContent = data.nome;
  descricaoEl.textContent = data.descricao;
  detalhesEl.innerHTML = `
    <p><strong>Nome científico:</strong> ${data.nome_cientifico}</p>
    <p><strong>Tempo de crescimento:</strong> ${data.tempo_crescimento}</p>
    <p><strong>Tipo de solo:</strong> ${data.tipo_solo}</p>
    <p><strong>Incidência solar:</strong> ${data.incidencia_solar}</p>
    <p><strong>Ambiente ideal:</strong> ${data.ambiente_ideal}</p>
    <p><strong>Estação ideal:</strong> ${data.estacao_ideal}</p>
    <p><strong>Frequência de rega:</strong> a cada ${data.frequencia_rega || 7} dias</p>
  `;

  // carregar imagem a partir do campo imagem
  imgEl.src = await buscarImagem(data.imagem);

  btnAdd.addEventListener("click", async () => {
    if (!plantaAtual) return;

    const { data: existentes, error: erroBusca } = await supabase
      .from("usuario_plantas")
      .select("nome_apelido")
      .eq("usuario_id", usuarioLogado.id)
      .eq("planta_id", plantaAtual.id);

    if (erroBusca) {
      console.error("Erro ao verificar planta existente:", erroBusca);
      alert("Erro ao verificar plantas existentes.");
      return;
    }

    let apelidoBase = plantaAtual.nome;
    let apelidoFinal = apelidoBase;

    if (existentes && existentes.length > 0) {
      apelidoFinal = `${apelidoBase} ${existentes.length + 1}`;
    }

    const { error } = await supabase.from("usuario_plantas").insert([
      {
        usuario_id: usuarioLogado.id,
        planta_id: plantaAtual.id,
        nome_apelido: apelidoFinal,
        data_adicao: new Date().toISOString(),
        data_ultima_rega: null,
        proxima_rega: null,
        observacoes: null,
        frequencia_rega: plantaAtual.frequencia_rega || 7,
      },
    ]);

    if (error) {
      console.error("Erro ao adicionar planta:", error);
      alert("Erro ao adicionar planta: " + error.message);
    } else {
      alert(`🌿 ${apelidoFinal} adicionada com sucesso!`);
      window.location.href = "/pages/suasplantas.html";
    }
  });
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

carregarPlanta();
