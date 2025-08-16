/**
 * Firebase RTDB Telemetry (no-auth)
 * Coleta:
 * - Visita de página
 * - Cliques marcados com [data-analytics-click]
 * - Envio de formulário de contato [data-analytics-form="contact"]
 *
 * Pré-requisitos:
 * - Substituir FIREBASE_CONFIG com meu config e incluir "databaseURL".
 * - Regras do RTDB já publicadas conforme descrição do prompt.
 */

import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Usar a mesma instância do Firebase já inicializada pelo Analytics
let db = null;
let app = null;

// Função para inicializar RTDB quando o Analytics estiver pronto
function initRTDB() {
    if (window.__ga && window.__ga.app) {
        app = window.__ga.app;
        db = getDatabase(app);
        console.log('[RTDB] Telemetry inicializado');
        
        // Inicializar funcionalidades após RTDB estar pronto
        initTelemetry();
    } else {
        // Fallback: aguardar um pouco mais
        setTimeout(initRTDB, 100);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRTDB);
} else {
    initRTDB();
}

// Função para inicializar toda a telemetria
function initTelemetry() {
    // Util: corta strings para obedecer regras
    const cut = (val, max) => (typeof val === "string" ? val.slice(0, max) : "");
    
    function now() { return Date.now(); }
    
    // --------- VISIT ----------
    function trackVisit() {
      try {
        const payload = {
          path: cut(location.pathname || "/", 200),
          ts: now()
        };
        push(ref(db, "visits"), payload).catch(() => {});
      } catch (e) { /* no-op */ }
    }
    
    // --------- CLICK ----------
    function trackClickFrom(el) {
      const name  = cut(el.getAttribute("data-analytics-click") || "click", 60);
      const label = cut(el.getAttribute("data-analytics-label") || (el.textContent || "").trim(), 120);
      const href  = cut(el.getAttribute("href") || "", 300);
    
      const payload = { element: name, ts: now() };
      if (label) payload.label = label;
      if (href)  payload.href  = href;
    
      push(ref(db, "clicks"), payload).catch(() => {});
    }
    
    // Listener global: qualquer elemento com data-analytics-click
    document.addEventListener("click", (ev) => {
      const el = ev.target?.closest?.("[data-analytics-click]");
      if (!el) return;
      trackClickFrom(el);
    });
    
    // --------- FORM MESSAGE ----------
    function bindContactForm() {
      const form = document.querySelector('[data-analytics-form="contact"]');
      if (!form) return;
    
      form.addEventListener("submit", () => {
        try {
          const name  = cut(form.querySelector('[name="nome"]')?.value || "", 80);
          const email = cut(form.querySelector('[name="email"]')?.value || "", 120);
          const text  = cut(form.querySelector('[name="mensagem"]')?.value || "", 1000);
    
          // mínimas validações para atender regras (comprimentos e formato)
          const validName  = name.length >= 2;
          const validText  = text.length >= 5;
          const validEmail = /.+@.+\..+/.test(email);
    
          if (validName && validText && validEmail) {
            push(ref(db, "messages"), { name, email, text, ts: now() }).catch(() => {});
          }
        } catch (e) { /* no-op */ }
      });
    }
    
    // --------- RATE LIMIT SIMPLES (cliente) ---------
    // Evita flood básico: no máximo 1 visita logada a cada 10s.
    (function basicRateLimit() {
      try {
        const k = "__rtdb_visit_last";
        const last = Number(localStorage.getItem(k) || "0");
        if (now() - last > 10000) {
          trackVisit();
          localStorage.setItem(k, String(now()));
        }
      } catch (_) { trackVisit(); }
    })();
    
    // Vincula form após DOM pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", bindContactForm);
    } else {
      bindContactForm();
    }
    
    // Expor helpers para debug, se necessário
    window.__rtdb = { trackVisit, trackClickFrom };
}
