import { supabase } from "./supabaseClient.js";

// Alternar entre seções
const loginSection = document.getElementById("loginSection");
const cadastroSection = document.getElementById("cadastroSection");
document.getElementById("showCadastro").addEventListener("click", () => {
  loginSection.classList.add("hidden");
  cadastroSection.classList.remove("hidden");
});
document.getElementById("showLogin").addEventListener("click", () => {
  cadastroSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// Mostrar/ocultar senha
document.querySelectorAll(".toggleSenha").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const input = document.getElementById(targetId);
    input.type = input.type === "password" ? "text" : "password";
  });
});

// Cadastro
document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("cadNome").value.trim();
  const email = document.getElementById("cadEmail").value.trim();
  const senha = document.getElementById("cadSenha").value;
  const confirmar = document.getElementById("cadConfirmarSenha").value;

  if (senha !== confirmar) return alert("As senhas não coincidem!");

  const { error } = await supabase.from("usuarios").insert([{ nome, email, senha }]);
  if (error) return alert("Erro no cadastro: " + error.message);

  alert("Conta criada com sucesso!");
  cadastroSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// Login
document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value;

  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("email", email)
    .eq("senha", senha)
    .single();

  if (error || !data) {
    alert("Email ou senha incorretos.");
  } else {
    localStorage.setItem("usuarioLogado", JSON.stringify(data));
    window.location.href = "/pages/lobby.html";
  }
});
