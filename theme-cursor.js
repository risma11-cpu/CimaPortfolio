/* =====================================================================
   TEMA 3: CURSOR SWARM (versi gelap)
   ---------------------------------------------------------------------
   Kanvas gelap bersih, lalu kursor-kursor "agent" membangun halaman
   di depan pengunjung saat di-scroll (kotak digambar, judul diketik,
   paragraf ditulis, gambar di-scan).

   - Hanya aktif saat <html data-theme="cursor">.
   - Tema "Dark Rose" dan "Neo-Brutalism" TIDAK diubah sama sekali.
   - File ini dimuat otomatis oleh theme-neo-brutalism.js.
   - Butuh file cursor-swarm.min.js di folder yang sama
     (hanya dimuat saat tema ini dipilih).
   - Pindah ke tema lain => animasi dilepas (destroy) dan halaman
     kembali persis seperti semula.
   ===================================================================== */
(function () {
  "use strict";

  var THEME_ID = "cursor";
  var LIB_SRC = "cursor-swarm.min.js";
  var html = document.documentElement;

  /* ---------- opsi swarm (ubah di sini kalau mau) ---------- */
  var SWARM_OPTIONS = {
    cursors: 3,
    names: ["DESIGN", "CODE", "COPY"],
    palette: {
      colors: ["#f4f4f1", "#ff5e00", "#3be8ff"],
      hud: {
        background: "rgba(17,17,20,.92)",
        color: "#f4f4f1",
        mute: "#9b9b95",
        border: "rgba(255,255,255,.14)"
      }
    },
    startPosition: "outside",   // agent terbang masuk dari luar layar
    deconstruct: false,         // bagian yang sudah jadi tidak dibongkar lagi
    copyPaste: 0.4,             // kadang kartu "di-copy paste" dari kartu sebelahnya
    relocation: false,
    idle: "dim",
    hud: true,
    hudPosition: "bottom-left",
    trigger: 0.9,
    // bagian yang tidak ikut dianimasikan (navbar, tombol tema, modal, form kontak)
    ignore: "#intro, header, .theme-switch, .hire-overlay, .contact-info, .contact-form"
  };

  /* ---------- CSS ---------- */
  var css = String.raw`
/* ============================================================
   TEMA CURSOR SWARM (GELAP) — hanya aktif di html[data-theme="cursor"]
   ============================================================ */
html[data-theme="cursor"] {
  color-scheme: dark;
  --cs-bg: #09090b;
  --cs-card: #111114;
  --cs-soft: #18181c;
  --cs-ink: #f4f4f1;
  --cs-on-ink: #09090b;
  --cs-mute: #9b9b95;
  --cs-line: #2a2a30;
  --cs-line-hi: #4a4a53;
  --cs-acc: #ff5e00;
  --cs-blue: #3be8ff;
  --cs-green: #3ddc84;
  --cs-green-bg: rgba(61,220,132,.12);
  --cs-green-line: rgba(61,220,132,.35);
  --cs-shadow: 0 1px 2px rgba(0,0,0,.5), 0 8px 24px rgba(0,0,0,.45);
  --cs-shadow-hover: 0 2px 4px rgba(0,0,0,.6), 0 14px 32px rgba(0,0,0,.6);
  --cs-sans: "Inter", "Montserrat", system-ui, sans-serif;
  --cs-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* ---- dasar: kanvas gelap dengan grid tipis ---- */
html[data-theme="cursor"] body {
  background-color: var(--cs-bg);
  background-image:
    linear-gradient(to right, rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 48px 48px;
  background-attachment: scroll;
  color: var(--cs-ink);
  font-family: var(--cs-sans);
}
html[data-theme="cursor"] ::selection { background: var(--cs-acc); color: #fff; }
html[data-theme="cursor"] *,
html[data-theme="cursor"] *::before,
html[data-theme="cursor"] *::after {
  backdrop-filter: none !important;
  text-shadow: none !important;
}
html[data-theme="cursor"] ::-webkit-scrollbar { width: 12px; }
html[data-theme="cursor"] ::-webkit-scrollbar-track { background: var(--cs-bg); border-left: 1px solid var(--cs-line); }
html[data-theme="cursor"] ::-webkit-scrollbar-thumb { background: #3a3a42; border: 3px solid var(--cs-bg); border-radius: 10px; }

/* ---- font judul ---- */
html[data-theme="cursor"] .left h1,
html[data-theme="cursor"] .info-home h1,
html[data-theme="cursor"] .info-home h3,
html[data-theme="cursor"] .about h3,
html[data-theme="cursor"] .project h1,
html[data-theme="cursor"] .services h1,
html[data-theme="cursor"] .certificate h1,
html[data-theme="cursor"] .section-title,
html[data-theme="cursor"] .cert-title-block h1,
html[data-theme="cursor"] .project-card h3,
html[data-theme="cursor"] .service-card h3,
html[data-theme="cursor"] .hire-intro h2,
html[data-theme="cursor"] .hire-block h4,
html[data-theme="cursor"] .core span,
html[data-theme="cursor"] .stack-group-title {
  font-family: var(--cs-sans);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* ---- intro ---- */
html[data-theme="cursor"] .card {
  background: var(--cs-card);
  border: 1px solid var(--cs-line);
  border-radius: 14px;
  box-shadow: var(--cs-shadow-hover);
}
html[data-theme="cursor"] .top-tags span {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line);
  border-radius: 6px; font-family: var(--cs-mono); font-size: 11px; font-weight: 500;
}
html[data-theme="cursor"] .top-tags .dot { background: var(--cs-green-bg); color: var(--cs-green); border-color: var(--cs-green-line); }
html[data-theme="cursor"] .left h1 { color: var(--cs-ink); }
html[data-theme="cursor"] .desc { color: var(--cs-mute); }
html[data-theme="cursor"] .live-line span {
  color: var(--cs-acc); font-family: var(--cs-mono); font-size: 12px;
  border: 1px dashed var(--cs-acc); border-radius: 6px; padding: 3px 8px; background: rgba(255,94,0,.10);
}
html[data-theme="cursor"] .btn {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line);
  border-radius: 8px; font-weight: 600; box-shadow: none; transition: background .2s, color .2s, border-color .2s;
}
html[data-theme="cursor"] .btn i { color: var(--cs-ink); }
html[data-theme="cursor"] .btn:hover { background: var(--cs-ink); color: var(--cs-on-ink); border-color: var(--cs-ink); }
html[data-theme="cursor"] .btn:hover i { color: var(--cs-on-ink); }
html[data-theme="cursor"] .site-link {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px dashed var(--cs-line-hi);
  border-radius: 8px; font-family: var(--cs-mono);
}
html[data-theme="cursor"] .site-link i { color: var(--cs-acc); }
html[data-theme="cursor"] .right {
  background: var(--cs-soft); border: 1px solid var(--cs-line); border-radius: 14px;
  box-shadow: none; color: var(--cs-ink);
}
html[data-theme="cursor"] .right-head { color: var(--cs-ink); font-family: var(--cs-mono); }
html[data-theme="cursor"] .online { color: var(--cs-green); }
html[data-theme="cursor"] .orbit { border: 1px dashed var(--cs-line-hi); }
html[data-theme="cursor"] .orbit i {
  background: var(--cs-card); color: var(--cs-ink); border: 1px solid var(--cs-line); box-shadow: var(--cs-shadow);
}
html[data-theme="cursor"] .core { background: var(--cs-ink); border: 0; box-shadow: var(--cs-shadow-hover); }
html[data-theme="cursor"] .core span { color: var(--cs-on-ink); }
html[data-theme="cursor"] .stats div {
  background: var(--cs-soft); border: 1px solid var(--cs-line); border-radius: 10px; box-shadow: none;
}
html[data-theme="cursor"] .stats h4 { color: var(--cs-ink); font-family: var(--cs-mono); font-weight: 700; }
html[data-theme="cursor"] .stats p { color: var(--cs-mute); }

/* ---- navbar ---- */
html[data-theme="cursor"] .ul-list {
  background: rgba(17,17,20,.96); border: 1px solid var(--cs-line); border-radius: 12px; box-shadow: var(--cs-shadow);
}
html[data-theme="cursor"] .ul-list li { border-radius: 8px; border: 1px solid transparent; }
html[data-theme="cursor"] .ul-list li a { color: var(--cs-ink); font-family: var(--cs-sans); font-weight: 500; }
html[data-theme="cursor"] .ul-list li i { color: var(--cs-mute); }
html[data-theme="cursor"] .ul-list li:hover { background: var(--cs-soft); border-color: var(--cs-line); box-shadow: none; }
html[data-theme="cursor"] .ul-list li.active { background: var(--cs-ink); border-color: var(--cs-ink); box-shadow: none; }
html[data-theme="cursor"] .ul-list li.active a,
html[data-theme="cursor"] .ul-list li.active i { color: var(--cs-on-ink); }
html[data-theme="cursor"] .hamburger {
  background: var(--cs-card); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 8px; box-shadow: var(--cs-shadow);
}

/* ---- home ---- */
html[data-theme="cursor"] .home { color: var(--cs-ink); }
html[data-theme="cursor"] .home-p {
  background: var(--cs-card); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 999px;
  font-family: var(--cs-mono); font-size: 13px; box-shadow: none;
}
html[data-theme="cursor"] .home-s { color: var(--cs-green); }
html[data-theme="cursor"] .info-home h1 { color: var(--cs-ink); }
html[data-theme="cursor"] .info-home h3 { color: var(--cs-acc); font-family: var(--cs-mono); font-weight: 500; }
html[data-theme="cursor"] .info-p,
html[data-theme="cursor"] .info-p2 { color: var(--cs-mute); }
html[data-theme="cursor"] .info-p2 i { color: var(--cs-acc); }
html[data-theme="cursor"] .btn-home1 {
  background: var(--cs-ink); color: var(--cs-on-ink); border: 1px solid var(--cs-ink); border-radius: 8px;
  font-weight: 600; box-shadow: none; transition: background .2s, border-color .2s, color .2s;
}
html[data-theme="cursor"] .btn-home1:hover { background: var(--cs-acc); border-color: var(--cs-acc); color: #fff; }
html[data-theme="cursor"] .btn-home2 {
  background: var(--cs-card); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 8px;
  font-weight: 600; box-shadow: none; transition: background .2s, border-color .2s;
}
html[data-theme="cursor"] .btn-home2:hover { background: var(--cs-soft); color: var(--cs-ink); border-color: var(--cs-ink); }
html[data-theme="cursor"] hr { border: 0; height: 1px; background: var(--cs-line); width: 90%; }
html[data-theme="cursor"] .follow { align-items: center; }
html[data-theme="cursor"] .followw { color: var(--cs-mute); }
html[data-theme="cursor"] .follow ul a { color: var(--cs-ink); }
html[data-theme="cursor"] .follow ul a:hover { color: var(--cs-acc); text-shadow: none; }
html[data-theme="cursor"] .home img {
  border: 1px solid var(--cs-line); border-radius: 14px; box-shadow: var(--cs-shadow-hover);
}

/* ---- about ---- */
html[data-theme="cursor"] .about { color: var(--cs-ink); font-family: var(--cs-sans); }
html[data-theme="cursor"] .img-about img { border: 1px solid var(--cs-line); box-shadow: var(--cs-shadow); }
html[data-theme="cursor"] .info-text h5 { color: var(--cs-ink); font-family: var(--cs-mono); font-weight: 700; }
html[data-theme="cursor"] .info-text p { color: var(--cs-mute); }
html[data-theme="cursor"] .about h3 {
  color: var(--cs-ink); display: inline-block; font-family: var(--cs-mono); font-size: 14px;
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 6px; padding: 4px 12px;
}
html[data-theme="cursor"] .about-text p { font-family: var(--cs-sans); color: var(--cs-mute); }
html[data-theme="cursor"] .about-text span { color: var(--cs-acc); background: transparent; font-family: var(--cs-mono); font-weight: 700; }
html[data-theme="cursor"] .photo-container {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 14px; box-shadow: var(--cs-shadow);
}
html[data-theme="cursor"] .photo-container img { border-radius: 10px; border: 1px solid var(--cs-line); }
html[data-theme="cursor"] .tape {
  background: rgba(255,94,0,.25); border: 1px solid rgba(255,94,0,.5); border-radius: 2px; box-shadow: none; opacity: 1;
}
html[data-theme="cursor"] .tape::before { display: none; }

/* ---- judul section ---- */
html[data-theme="cursor"] .project,
html[data-theme="cursor"] .services,
html[data-theme="cursor"] .certificate { color: var(--cs-ink); }
html[data-theme="cursor"] .project p,
html[data-theme="cursor"] .services p,
html[data-theme="cursor"] .certificate p,
html[data-theme="cursor"] .info-pro p { color: var(--cs-mute); }
html[data-theme="cursor"] .project h1,
html[data-theme="cursor"] .services h1,
html[data-theme="cursor"] .certificate h1 { color: var(--cs-ink); }
html[data-theme="cursor"] .section-title { color: var(--cs-ink); }
html[data-theme="cursor"] .project hr,
html[data-theme="cursor"] .services hr,
html[data-theme="cursor"] .certificate hr {
  background: var(--cs-acc); height: 3px; width: 60px; border-radius: 2px;
}

/* ---- kartu project / sertifikat ---- */
html[data-theme="cursor"] .project-card {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 12px; box-shadow: var(--cs-shadow);
  transition: transform .2s, box-shadow .2s, border-color .2s;
}
html[data-theme="cursor"] .project-card:hover {
  transform: translateY(-4px); box-shadow: var(--cs-shadow-hover); border-color: var(--cs-line-hi);
}
html[data-theme="cursor"] .project-card img,
html[data-theme="cursor"] #certificate .project-card img,
html[data-theme="cursor"] #badges .project-card img {
  border-radius: 8px !important; border: 1px solid var(--cs-line) !important; background: var(--cs-soft);
}
html[data-theme="cursor"] .project-card h3 { color: var(--cs-ink); }
html[data-theme="cursor"] .project-card p { color: var(--cs-mute); }
html[data-theme="cursor"] .project-card .skills a {
  color: var(--cs-ink); background: var(--cs-soft); border: 1px solid var(--cs-line);
  border-radius: 6px; font-family: var(--cs-mono); font-size: 12px; font-weight: 500;
}
html[data-theme="cursor"] .project-card .btn {
  color: var(--cs-ink); background: var(--cs-soft); border: 1px solid var(--cs-line); border-radius: 8px;
  font-weight: 600; box-shadow: none;
}
html[data-theme="cursor"] .project-card .btn:hover { color: var(--cs-on-ink); background: var(--cs-ink); border-color: var(--cs-ink); transform: none; }
html[data-theme="cursor"] .cert-photo::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff5e00' stroke='%23111' stroke-width='1.5' d='M12 21s-6.5-4.35-9.5-8.5C.5 9 2 5 6 5c2.2 0 3.6 1.3 4.5 2.7C11.4 6.3 12.8 5 15 5c4 0 5.5 4 3.5 7.5C18.5 16.65 12 21 12 21z'/%3E%3C/svg%3E");
  filter: none;
}
html[data-theme="cursor"] .cert-partners-label {
  color: var(--cs-mute); font-family: var(--cs-mono); font-size: 12px;
}
html[data-theme="cursor"] .cert-partners-logos img {
  border: 1px solid var(--cs-line); border-radius: 8px; box-shadow: none; background: #fff;
}

/* ---- sertifikat.html ---- */
html[data-theme="cursor"] .cert-hero-kicker { color: var(--cs-acc); font-family: var(--cs-mono); }
html[data-theme="cursor"] .cert-title-block h1 { color: var(--cs-ink); }
html[data-theme="cursor"] .cert-title-underline { background: var(--cs-acc); border-radius: 2px; height: 3px; }
html[data-theme="cursor"] .cert-glass-panel {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 14px; box-shadow: var(--cs-shadow);
}
html[data-theme="cursor"] .cert-glass-panel::before { display: none; }
html[data-theme="cursor"] .cert-page .project-card { background: var(--cs-soft); }
html[data-theme="cursor"] .cert-nav-btn {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 8px;
  font-weight: 600; box-shadow: none; transition: background .2s, color .2s, border-color .2s;
}
html[data-theme="cursor"] .cert-nav-btn i { color: var(--cs-ink); }
html[data-theme="cursor"] .cert-nav-btn:hover { background: var(--cs-ink); color: var(--cs-on-ink); border-color: var(--cs-ink); }
html[data-theme="cursor"] .cert-nav-btn:hover i { color: var(--cs-on-ink); }

/* ---- tech stack / learning / tools ---- */
html[data-theme="cursor"] .stack-group-title { color: var(--cs-mute); font-family: var(--cs-mono); font-weight: 500; }
html[data-theme="cursor"] .stack-badge,
html[data-theme="cursor"] .learn-card,
html[data-theme="cursor"] .tools-badge {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 10px; box-shadow: none;
  transition: transform .2s, box-shadow .2s, border-color .2s;
}
html[data-theme="cursor"] .stack-badge:hover,
html[data-theme="cursor"] .learn-card:hover,
html[data-theme="cursor"] .tools-badge:hover {
  background: var(--cs-soft); border-color: var(--cs-line-hi); transform: translateY(-3px); box-shadow: var(--cs-shadow-hover);
}
html[data-theme="cursor"] .stack-badge span,
html[data-theme="cursor"] .learn-card h4 { color: var(--cs-ink); font-weight: 600; }
html[data-theme="cursor"] .stack-badge i,
html[data-theme="cursor"] .tools-badge i,
html[data-theme="cursor"] .learn-card i { -webkit-text-stroke: 0; }
html[data-theme="cursor"] .stack-badge:hover i,
html[data-theme="cursor"] .tools-badge:hover i { filter: none; }
html[data-theme="cursor"] .stack-badge .fa-github,
html[data-theme="cursor"] .tools-badge .fa-github { color: var(--cs-ink); }
html[data-theme="cursor"] .learn-tag {
  color: var(--cs-ink); background: var(--cs-soft); border: 1px solid var(--cs-line);
  border-radius: 6px; font-family: var(--cs-mono); font-weight: 500;
}
html[data-theme="cursor"] .tools-badge .tools-tip {
  background: var(--cs-ink); color: var(--cs-on-ink); border: 1px solid var(--cs-ink); border-radius: 6px; font-family: var(--cs-mono);
}

/* ---- services ---- */
html[data-theme="cursor"] .services::before { display: none; }
html[data-theme="cursor"] .service-card {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 12px; box-shadow: var(--cs-shadow);
  transition: transform .2s, box-shadow .2s, border-color .2s;
}
html[data-theme="cursor"] .service-card::before { display: none; }
html[data-theme="cursor"] .service-card:hover {
  transform: translateY(-4px); box-shadow: var(--cs-shadow-hover); border-color: var(--cs-line-hi);
}
html[data-theme="cursor"] .service-icon {
  background: var(--cs-soft); color: var(--cs-acc); border: 1px solid var(--cs-line); border-radius: 10px; box-shadow: none;
}
html[data-theme="cursor"] .service-card h3 { color: var(--cs-ink); }
html[data-theme="cursor"] .service-card p { color: var(--cs-mute); }
html[data-theme="cursor"] .service-features span {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line);
  border-radius: 6px; font-family: var(--cs-mono); font-weight: 500;
}

/* ---- contact ---- */
html[data-theme="cursor"] .contact-info p,
html[data-theme="cursor"] .contact-item { color: var(--cs-mute); }
html[data-theme="cursor"] .contact-item svg { color: var(--cs-acc); filter: none; }
html[data-theme="cursor"] .social-link {
  background: var(--cs-card); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 10px; box-shadow: none;
  transition: background .2s, color .2s, border-color .2s;
}
html[data-theme="cursor"] .social-link:hover { background: var(--cs-ink); color: var(--cs-on-ink); border-color: var(--cs-ink); transform: none; box-shadow: none; }
html[data-theme="cursor"] .contact-form {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 14px; box-shadow: var(--cs-shadow);
}
html[data-theme="cursor"] .form-group input,
html[data-theme="cursor"] .form-group textarea {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line);
  border-radius: 8px; font-family: var(--cs-sans);
}
html[data-theme="cursor"] .form-group input::placeholder,
html[data-theme="cursor"] .form-group textarea::placeholder { color: #70706b; }
html[data-theme="cursor"] .form-group input:focus,
html[data-theme="cursor"] .form-group textarea:focus {
  outline: none; border-color: var(--cs-acc); background: var(--cs-card); box-shadow: 0 0 0 3px rgba(255,94,0,.25);
}
html[data-theme="cursor"] .contact-form .btn {
  background: var(--cs-ink); color: var(--cs-on-ink); border: 1px solid var(--cs-ink);
}
html[data-theme="cursor"] .contact-form .btn:hover { background: var(--cs-acc); border-color: var(--cs-acc); color: #fff; }

/* ---- modal Hire Me ---- */
html[data-theme="cursor"] .hire-overlay { background: rgba(0,0,0,.72); }
html[data-theme="cursor"] .hire-content {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 14px; box-shadow: 0 24px 60px rgba(0,0,0,.7);
}
html[data-theme="cursor"] .hire-content::-webkit-scrollbar-track { background: var(--cs-card); }
html[data-theme="cursor"] .hire-content::-webkit-scrollbar-thumb { background: #3a3a42; border-radius: 10px; }
html[data-theme="cursor"] .hire-close {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line); border-radius: 8px; box-shadow: none;
}
html[data-theme="cursor"] .hire-close:hover { background: var(--cs-ink); color: var(--cs-on-ink); }
html[data-theme="cursor"] .hire-top { border-bottom: 1px solid var(--cs-line); background: var(--cs-soft); }
html[data-theme="cursor"] .hire-top img { border: 1px solid var(--cs-line); border-radius: 12px; box-shadow: none; }
html[data-theme="cursor"] .hire-intro h2 { color: var(--cs-ink); }
html[data-theme="cursor"] .hire-role { color: var(--cs-acc); font-family: var(--cs-mono); font-weight: 500; }
html[data-theme="cursor"] .hire-status {
  background: var(--cs-green-bg); color: var(--cs-green); border: 1px solid var(--cs-green-line); border-radius: 6px;
}
html[data-theme="cursor"] .hire-block h4 { color: var(--cs-ink); }
html[data-theme="cursor"] .hire-block p { color: var(--cs-mute); }
html[data-theme="cursor"] .hire-edu-item { border-left: 2px solid var(--cs-acc); }
html[data-theme="cursor"] .hire-edu-item strong { color: var(--cs-ink); }
html[data-theme="cursor"] .hire-edu-item p { color: var(--cs-mute); }
html[data-theme="cursor"] .hire-skills span {
  background: var(--cs-soft); color: var(--cs-ink); border: 1px solid var(--cs-line);
  border-radius: 6px; font-family: var(--cs-mono); font-weight: 500;
}
html[data-theme="cursor"] .hire-skills span:hover { background: var(--cs-ink); color: var(--cs-on-ink); }
html[data-theme="cursor"] .hire-certs li { color: var(--cs-mute); }
html[data-theme="cursor"] .hire-certs li::before { background: var(--cs-acc); border-radius: 2px; }
html[data-theme="cursor"] .hire-socials a { color: var(--cs-ink); }
html[data-theme="cursor"] .hire-socials a:hover { color: var(--cs-acc); text-shadow: none; }
html[data-theme="cursor"] .hire-footer { border-top: 1px solid var(--cs-line); background: var(--cs-soft); }
html[data-theme="cursor"] .hire-footer p { color: var(--cs-mute); }

/* ---- switcher versi cursor ---- */
html[data-theme="cursor"] .theme-switch { font-family: var(--cs-sans); }
html[data-theme="cursor"] .theme-switch__toggle {
  color: var(--cs-ink); background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 10px;
  box-shadow: var(--cs-shadow); transition: background .2s, border-color .2s;
}
html[data-theme="cursor"] .theme-switch__toggle i { color: var(--cs-acc); }
html[data-theme="cursor"] .theme-switch__toggle:hover { background: var(--cs-soft); border-color: var(--cs-line-hi); }
html[data-theme="cursor"] .theme-switch__menu {
  background: var(--cs-card); border: 1px solid var(--cs-line); border-radius: 12px; box-shadow: var(--cs-shadow-hover);
}
html[data-theme="cursor"] .theme-switch__opt { color: var(--cs-ink); border-radius: 8px; font-weight: 500; }
html[data-theme="cursor"] .theme-switch__opt:hover { background: var(--cs-soft); }
html[data-theme="cursor"] .theme-switch__opt[aria-pressed="true"] { background: var(--cs-ink); border-color: var(--cs-ink); color: var(--cs-on-ink); }
html[data-theme="cursor"] .theme-switch__dot { border: 1px solid rgba(255,255,255,.4); }

/* ---- responsif ---- */
@media (max-width: 768px) {
  html[data-theme="cursor"] body { background-size: 32px 32px; }
  html[data-theme="cursor"] .ul-list { background: var(--cs-card); }
  html[data-theme="cursor"] .project h1,
  html[data-theme="cursor"] .services h1 { font-size: 24px; }
}
@media (prefers-reduced-motion: reduce) {
  html[data-theme="cursor"] * { transition: none !important; }
}
`;

  var style = document.createElement("style");
  style.id = "theme-cursor-css";
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- font mono (dimuat sekali, hanya saat tema dipilih) ---------- */
  var fontAdded = false;
  function ensureFont() {
    if (fontAdded) return;
    fontAdded = true;
    var font = document.createElement("link");
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(font);
  }

  /* ---------- pemasang / pelepas swarm ---------- */
  var swarm = null;        // instance CursorSwarm yang sedang jalan
  var pending = false;     // sedang menunggu library / halaman siap
  var token = 0;           // penanda supaya callback lama diabaikan
  var libState = "idle";   // idle | loading | ready
  var libWaiters = [];
  var siteObserver = null;

  function isActive() {
    return html.getAttribute("data-theme") === THEME_ID;
  }

  function loadLib(cb) {
    if (window.CursorSwarm) { libState = "ready"; cb(true); return; }
    libWaiters.push(cb);
    if (libState === "loading") return;
    libState = "loading";

    function done(ok) {
      libState = ok ? "ready" : "idle";   // gagal => boleh dicoba lagi nanti
      var list = libWaiters.splice(0);
      list.forEach(function (fn) { fn(ok); });
    }

    var s = document.createElement("script");
    s.src = LIB_SRC;
    s.onload = function () { done(!!window.CursorSwarm); };
    s.onerror = function () {
      if (window.console) {
        console.warn("[theme-cursor] " + LIB_SRC + " tidak ditemukan. " +
          "Taruh file itu di folder yang sama dengan index.html.");
      }
      done(false);
    };
    document.head.appendChild(s);
  }

  function stopWatching() {
    if (siteObserver) { siteObserver.disconnect(); siteObserver = null; }
  }

  // Tunggu sampai halaman asli tampil (index.html punya layar intro dulu).
  function whenPageReady(cb) {
    function go() {
      var site = document.getElementById("real-site");
      if (!site || getComputedStyle(site).display !== "none") { cb(); return; }
      stopWatching();
      siteObserver = new MutationObserver(function () {
        if (getComputedStyle(site).display !== "none") {
          stopWatching();
          cb();
        }
      });
      siteObserver.observe(site, { attributes: true, attributeFilter: ["style", "class"] });
    }
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
  }

  function createSwarm() {
    var opts = {};
    for (var k in SWARM_OPTIONS) opts[k] = SWARM_OPTIONS[k];
    opts.root = document.getElementById("real-site") || document.body;
    try {
      swarm = new window.CursorSwarm(opts).init();
    } catch (e) {
      swarm = null;
      if (window.console) console.warn("[theme-cursor] gagal memulai swarm:", e);
    }
  }

  function start() {
    if (swarm || pending) return;
    pending = true;
    var t = ++token;
    ensureFont();
    loadLib(function (ok) {
      if (t !== token) return;                       // tema sudah berganti
      if (!ok) { pending = false; return; }          // tampilan gelap tetap jalan, tanpa animasi
      whenPageReady(function () {
        if (t !== token || !isActive()) return;
        // beri satu frame supaya layout benar-benar settle
        requestAnimationFrame(function () {
          if (t !== token || !isActive()) return;
          pending = false;
          createSwarm();
        });
      });
    });
  }

  function stop() {
    token++;
    pending = false;
    stopWatching();
    if (swarm) {
      try { swarm.destroy(); } catch (e) {}
      swarm = null;
    }
  }

  function sync() {
    if (isActive()) start();
    else stop();
  }

  // Pantau pergantian tema dari tombol "Tema" (atribut data-theme di <html>)
  new MutationObserver(sync).observe(html, {
    attributes: true,
    attributeFilter: ["data-theme"]
  });
  sync();
})();