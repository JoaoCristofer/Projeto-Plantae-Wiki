// /js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://jputexuedpxdppqpkgqx.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdXRleHVlZHB4ZHBwcXBrZ3F4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODkzNjYsImV4cCI6MjA3NDY2NTM2Nn0.zn5W-_fsESwRbkAANFWOgbS8wtUYGBi7SvoGebFhmr4";

// 🔒 Cria o cliente com persistência explícita
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage, // garante que todas as páginas compartilhem o mesmo storage
  },
});

// 🔁 Mantém sessão sincronizada entre abas e páginas
supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    localStorage.setItem("supabase_session", JSON.stringify(session));
  } else {
    localStorage.removeItem("supabase_session");
  }
});
