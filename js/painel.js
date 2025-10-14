import { supabase } from "./supabaseClient.js";

const form = document.getElementById("formPlanta");
const msg = document.getElementById("mensagem");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const planta = {
    nome: form.nome.value.trim(),
    nome_cientifico: form.nome_cientifico.value.trim(),
    descricao: form.descricao.value.trim(),
    tempo_crescimento: parseInt(form.tempo_crescimento.value) || null,
    tipo_solo: form.tipo_solo.value.trim(),
    incidencia_solar: form.incidencia_solar.value.trim(),
    ambiente_ideal: form.ambiente_ideal.value.trim(),
    categoria_id: parseInt(form.categoria_id.value) || null,
    estacao_ideal: form.estacao_ideal.value.trim(),
    frequencia_rega: parseInt(form.frequencia_rega.value) || null,
    imagem: form.imagem.value.trim(),
    data_cadastro: new Date().toISOString()
  };

  const { error } = await supabase.from("plantas").insert([planta]);

  if (error) {
    console.error("Erro ao cadastrar planta:", error);
    msg.textContent = "❌ Erro ao cadastrar planta.";
    msg.style.color = "red";
  } else {
    msg.textContent = "✅ Planta cadastrada com sucesso!";
    msg.style.color = "green";
    form.reset();
  }
});
