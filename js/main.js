/* Grey Labs website - front-end behaviour. Edit CONFIG below before launch. */
const CONFIG = {
  whatsapp: "94000000000",          // WhatsApp number, country code first, no + or spaces
  email: "hello@example.com",       // public contact email
  phone: "+94 00 000 0000",         // public phone number
  maxFileMB: 25,                    // upload size limit per file
  allowed: ["stl","step","stp","obj","pdf","png","jpg","jpeg","ai"],
  formEndpoint: ""                  // optional POST endpoint (Formspree, Getform, own API). Empty = send by WhatsApp
};

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* form delivery: POST to CONFIG.formEndpoint, or hand off to WhatsApp when unset */
  const waLink = text => "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(text);

  const summary = (form, title) => {
    const lines = [title];
    new FormData(form).forEach((v, k) => {
      if (k === "bot-field" || k === "form-name" || typeof v !== "string" || !v) return;
      lines.push(k.charAt(0).toUpperCase() + k.slice(1) + ": " + v);
    });
    const files = $("#files") ? [...$("#files").files].map(f => f.name) : [];
    if (files.length) lines.push("Files: " + files.join(", "));
    return lines.join("\n");
  };

  const deliver = async (form, title) => {
    if (!CONFIG.formEndpoint) {
      window.open(waLink(summary(form, title)), "_blank", "noopener");
      return "whatsapp";
    }
    const res = await fetch(CONFIG.formEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status);
    return "sent";
  };

  /* contact details from CONFIG */
  $$("[data-wa]").forEach(a => {
    const t = a.dataset.wa || "Hi Grey Labs, I would like a quote.";
    a.href = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-email]").forEach(a => { a.href = "mailto:" + CONFIG.email; a.textContent = CONFIG.email; });
  $$("[data-phone]").forEach(a => { a.href = "tel:" + CONFIG.phone.replace(/\s/g, ""); a.textContent = CONFIG.phone; });
  $$("[data-maxmb]").forEach(e => e.textContent = CONFIG.maxFileMB);

  /* mobile menu */
  const tog = $(".nav-toggle"), nav = $("nav.main");
  if (tog) tog.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    tog.setAttribute("aria-expanded", open);
  });

  /* portfolio filter */
  const chips = $$(".chip[data-filter]");
  chips.forEach(c => c.addEventListener("click", () => {
    chips.forEach(x => x.setAttribute("aria-pressed", x === c));
    $$(".work-card").forEach(w => w.hidden = c.dataset.filter !== "all" && w.dataset.cat !== c.dataset.filter);
  }));

  /* quote form */
  const form = $("#quote-form");
  if (form) {
    const steps = $$("fieldset[data-step]", form);
    const prog = $(".progress", form), back = $("#q-back"), next = $("#q-next"), submit = $("#q-submit");
    const mq = matchMedia("(max-width:767px)");
    let cur = 0;
    const svc = new URLSearchParams(location.search).get("service");
    if (svc) { const r = $(`input[name=service][value="${svc}"]`, form); if (r) r.checked = true; }

    const render = () => {
      const w = mq.matches;
      steps.forEach((s, i) => s.hidden = w && i !== cur);
      prog.hidden = !w;
      $$("span", prog).forEach((p, i) => p.classList.toggle("on", i <= cur));
      back.hidden = !w || cur === 0;
      next.hidden = !w || cur === steps.length - 1;
      submit.hidden = w && cur !== steps.length - 1;
    };
    mq.addEventListener("change", render);
    const stepValid = i => $$("input,select,textarea", steps[i]).every(f => f.reportValidity());
    next.addEventListener("click", () => { if (stepValid(cur)) { cur++; render(); window.scrollTo({ top: form.offsetTop - 90, behavior: "smooth" }); } });
    back.addEventListener("click", () => { cur--; render(); });
    render();

    /* file validation */
    const fileInput = $("#files"), list = $("#file-list"), msg = $("#q-msg");
    const show = (t, ok) => { msg.hidden = false; msg.className = "msg " + (ok ? "ok" : "err"); msg.textContent = t; };
    fileInput.addEventListener("change", () => {
      list.innerHTML = ""; msg.hidden = true;
      const bad = [];
      [...fileInput.files].forEach(f => {
        const ext = f.name.split(".").pop().toLowerCase();
        if (!CONFIG.allowed.includes(ext)) bad.push(f.name + ": file type not supported");
        else if (f.size > CONFIG.maxFileMB * 1048576) bad.push(f.name + ": larger than " + CONFIG.maxFileMB + " MB");
        const li = document.createElement("li");
        li.innerHTML = "<span></span><span></span>";
        li.children[0].textContent = f.name; li.children[1].textContent = (f.size / 1048576).toFixed(1) + " MB";
        list.appendChild(li);
      });
      if (bad.length) { fileInput.value = ""; list.innerHTML = ""; show(bad.join(". ") + ". For large files, share a cloud-storage link in the notes.", false); }
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();
      steps.forEach(s => s.hidden = false);
      if (!form.checkValidity()) {
        const bad = form.querySelector(":invalid"); const idx = steps.findIndex(s => s.contains(bad));
        cur = Math.max(idx, 0); render(); form.reportValidity(); return;
      }
      render();
      submit.disabled = true; submit.textContent = "Sending...";
      try {
        const result = await deliver(form, "Quote request from the Grey Labs website");
        if (result === "sent") {
          form.reset(); list.innerHTML = ""; cur = 0; render();
          show("Thank you. Your quote request has been received. We will reply with a quote soon.", true);
        } else {
          show("Your request is ready in WhatsApp. Send the message there and attach your files to complete it.", true);
        }
      } catch (err) {
        show("Sorry, we could not send your request. Please try again or send it on WhatsApp.", false);
      }
      submit.disabled = false; submit.textContent = "Submit quote request";
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* order tracking (DEMO data - replace with a real lookup/API before launch) */
  const tf = $("#track-form");
  if (tf) {
    const STAGES = ["Received", "Quoted", "Approved", "In Production", "Ready", "Delivered"];
    const DEMO = { "GL-1042": { item: "Custom bracket (sample order)", stage: 3 } };
    tf.addEventListener("submit", e => {
      e.preventDefault();
      const ref = $("#ref").value.trim().toUpperCase(), out = $("#track-out");
      const o = DEMO[ref];
      if (!o) { out.innerHTML = '<div class="msg err">We could not find that reference. Please check it or contact us on WhatsApp.</div>'; return; }
      out.innerHTML = '<div class="card"><p class="muted"></p><ol class="timeline"></ol></div>';
      $("p", out).textContent = ref + "  ·  " + o.item;
      STAGES.forEach((s, i) => {
        const li = document.createElement("li");
        li.className = i < o.stage ? "done" : i === o.stage ? "cur" : "";
        li.innerHTML = '<span class="dot">' + (i < o.stage ? "✓" : "") + "</span><span></span>";
        li.children[1].textContent = s;
        $("ol", out).appendChild(li);
      });
    });
  }

  /* contact form */
  const cf = $("#contact-form");
  if (cf) cf.addEventListener("submit", async e => {
    e.preventDefault();
    const m = $("#c-msg");
    try {
      const result = await deliver(cf, "Message from the Grey Labs website");
      m.hidden = false; m.className = "msg ok";
      if (result === "sent") { cf.reset(); m.textContent = "Thank you. We will get back to you soon."; }
      else m.textContent = "Your message is ready in WhatsApp. Send it there to complete it.";
    } catch (x) { m.hidden = false; m.className = "msg err"; m.textContent = "Sorry, that did not send. Please try WhatsApp or email."; }
  });
});
