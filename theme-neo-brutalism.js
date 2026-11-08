/* =====================================================================
   THEME SWITCHER + TEMA NEO-BRUTALISM
   ---------------------------------------------------------------------
   Satu file ini berisi:
   1. CSS tema Neo-brutalism (aktif hanya saat <html data-theme="neo">)
   2. Tombol pengganti tema (kanan bawah) + penyimpanan pilihan di browser

   Tema asli (merah/pink gelap, id "default") TIDAK diubah sama sekali.
   Kalau tema "default" dipilih, file ini tidak menerapkan CSS apa pun.
   Tema yang tampil pertama kali dibuka diatur di DEFAULT_THEME (sekarang
   "cursor"); pengunjung tetap bisa ganti lewat tombol Tema.

   CARA PASANG: tambahkan baris ini di dalam <head> index.html dan
   sertifikat.html (setelah link style.css):

       <script src="theme-neo-brutalism.js"></script>

   Mau tambah tema lain nanti? Cukup tambah satu item di array THEMES
   dan satu blok CSS dengan selector html[data-theme="id-tema"].

   Tema ke-3 "Cursor Swarm" ada di file theme-cursor.js (dimuat otomatis
   di akhir file ini) dan butuh cursor-swarm.min.js di folder yang sama.
   ===================================================================== */
(function () {
  "use strict";

  // Key diganti (v2) supaya pilihan lama (mis. Dark Rose) di browser pengunjung
  // direset, lalu semua mulai dari tema bawaan baru.
  var STORAGE_KEY = "portfolio-theme-v2";

  // Tema yang tampil pertama kali dibuka (sebelum pengunjung memilih sendiri).
  // Isi "default" untuk kembali ke Dark Rose, "neo" untuk Neo-Brutalism.
  var DEFAULT_THEME = "cursor";

  // id "default" = tampilan asli (tanpa data-theme)
  var THEMES = [
    { id: "default", label: "Dark Rose", swatch: "#ff4d6d" },
    { id: "neo", label: "Neo-Brutalism", swatch: "#ffe14d" },
    { id: "cursor", label: "Cursor Swarm", swatch: "#111111" }
  ];

  /* ---------- baca / simpan pilihan ---------- */
  function getSaved() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return THEMES.some(function (t) { return t.id === v; }) ? v : DEFAULT_THEME;
    } catch (e) { return DEFAULT_THEME; }
  }

  function save(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function apply(id) {
    var root = document.documentElement;
    if (id === "default") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", id);
  }

  // Terapkan secepat mungkin (script ada di <head>) supaya tidak berkedip
  var current = getSaved();
  apply(current);

  /* ---------- font untuk tema neo (hanya dimuat sekali) ---------- */
  var font = document.createElement("link");
  font.rel = "stylesheet";
  font.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Space+Mono:wght@400;700&display=swap";
  document.head.appendChild(font);

  /* ---------- CSS ---------- */
  var css = String.raw`
/* ===================== SWITCHER (semua tema) ===================== */
.theme-switch {
  position: fixed; right: 16px; bottom: 16px; z-index: 9000;
  font-family: "Montserrat", "Inter", sans-serif;
}
.theme-switch__toggle {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 10px 16px; font-size: 13px; font-weight: 600;
  color: #f5c7d3; background: rgba(120,10,25,.75);
  border: 1px solid rgba(255,80,110,.35); border-radius: 30px;
  box-shadow: 0 8px 25px rgba(255,0,80,.3);
  backdrop-filter: blur(12px); transition: .3s;
}
.theme-switch__toggle i { color: #ff4d6d; }
.theme-switch__toggle:hover { background: rgba(255,80,120,.3); }
.theme-switch__menu {
  position: absolute; right: 0; bottom: calc(100% + 10px); min-width: 190px;
  display: none; flex-direction: column; gap: 6px; padding: 8px;
  background: rgba(12,6,10,.96); border: 1px solid rgba(255,80,110,.3);
  border-radius: 16px; box-shadow: 0 15px 40px rgba(255,0,80,.3);
}
.theme-switch.open .theme-switch__menu { display: flex; }
.theme-switch__opt {
  display: flex; align-items: center; gap: 10px; width: 100%;
  padding: 10px 12px; cursor: pointer; font-size: 13px; text-align: left;
  color: #f5c7d3; background: transparent; border: 1px solid transparent;
  border-radius: 10px; font-family: inherit; transition: .2s;
}
.theme-switch__opt:hover { background: rgba(255,80,120,.2); }
.theme-switch__opt[aria-pressed="true"] {
  background: rgba(255,80,120,.25); border-color: rgba(255,80,120,.5); color: #fff;
}
.theme-switch__dot {
  width: 14px; height: 14px; border-radius: 50%; flex: none;
  border: 2px solid rgba(255,255,255,.6);
}

/* ============================================================
   TEMA NEO-BRUTALISM  — hanya aktif di html[data-theme="neo"]
   ============================================================ */
html[data-theme="neo"] {
  --ink: #111111;
  --paper: #fff8e7;
  --white: #ffffff;
  --yellow: #ffe14d;
  --pink: #ff7ab6;
  --cyan: #5ce1e6;
  --lime: #b8f34d;
  --orange: #ff9f45;
  --bd: 3px solid var(--ink);
  --shadow: 6px 6px 0 var(--ink);
  --shadow-sm: 4px 4px 0 var(--ink);
  --head: "Space Grotesk", "Montserrat", sans-serif;
  --body: "Space Mono", "Inter", monospace;
  scroll-behavior: auto;
}

/* ---- dasar ---- */
html[data-theme="neo"] body {
  background-color: var(--paper);
  background-image: radial-gradient(var(--ink) 1px, transparent 1px);
  background-size: 22px 22px;
  background-attachment: scroll;
  color: var(--ink);
  font-family: var(--body);
}
html[data-theme="neo"] ::selection { background: var(--pink); color: var(--ink); }
html[data-theme="neo"] *,
html[data-theme="neo"] *::before,
html[data-theme="neo"] *::after { backdrop-filter: none !important; }
html[data-theme="neo"] ::-webkit-scrollbar { width: 14px; }
html[data-theme="neo"] ::-webkit-scrollbar-track { background: var(--paper); border-left: var(--bd); }
html[data-theme="neo"] ::-webkit-scrollbar-thumb { background: var(--pink); border: var(--bd); }

/* ---- font judul ---- */
html[data-theme="neo"] .left h1,
html[data-theme="neo"] .info-home h1,
html[data-theme="neo"] .info-home h3,
html[data-theme="neo"] .about h3,
html[data-theme="neo"] .project h1,
html[data-theme="neo"] .services h1,
html[data-theme="neo"] .certificate h1,
html[data-theme="neo"] .section-title,
html[data-theme="neo"] .cert-title-block h1,
html[data-theme="neo"] .project-card h3,
html[data-theme="neo"] .service-card h3,
html[data-theme="neo"] .hire-intro h2,
html[data-theme="neo"] .hire-block h4,
html[data-theme="neo"] .core span,
html[data-theme="neo"] .stack-group-title {
  font-family: var(--head);
  font-weight: 700;
  letter-spacing: 0;
  text-shadow: none;
}

/* ---- intro ---- */
html[data-theme="neo"] .card {
  background: var(--white);
  border: var(--bd);
  border-radius: 0;
  box-shadow: 10px 10px 0 var(--ink);
}
html[data-theme="neo"] .top-tags span {
  background: var(--white); color: var(--ink); border: var(--bd);
  border-radius: 0; font-weight: 700; box-shadow: 3px 3px 0 var(--ink);
}
html[data-theme="neo"] .top-tags .dot { background: var(--lime); color: var(--ink); }
html[data-theme="neo"] .left h1 { color: var(--ink); font-weight: 700; }
html[data-theme="neo"] .desc { color: var(--ink); }
html[data-theme="neo"] .live-line span { color: var(--ink); background: var(--yellow); border: 2px solid var(--ink); padding: 3px 8px; }
html[data-theme="neo"] .btn {
  background: var(--yellow); color: var(--ink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: var(--shadow-sm); transition: transform .12s, box-shadow .12s;
}
html[data-theme="neo"] .btn i { color: var(--ink); }
html[data-theme="neo"] .btn:hover {
  background: var(--pink); transform: translate(3px,3px); box-shadow: 1px 1px 0 var(--ink);
}
html[data-theme="neo"] .site-link {
  background: var(--cyan); color: var(--ink); border: var(--bd); border-radius: 0; font-weight: 700;
}
html[data-theme="neo"] .right {
  background: var(--cyan); border: var(--bd); border-radius: 0; box-shadow: var(--shadow); color: var(--ink);
}
html[data-theme="neo"] .right-head { color: var(--ink); font-weight: 700; }
html[data-theme="neo"] .online { color: var(--ink); background: var(--lime); border: 2px solid var(--ink); padding: 0 6px; }
html[data-theme="neo"] .orbit { border: 3px dashed var(--ink); }
html[data-theme="neo"] .orbit i {
  background: var(--yellow); color: var(--ink); border: 3px solid var(--ink); box-shadow: 2px 2px 0 var(--ink);
}
html[data-theme="neo"] .core { background: var(--pink); border: var(--bd); box-shadow: var(--shadow-sm); }
html[data-theme="neo"] .core span { color: var(--ink); }
html[data-theme="neo"] .stats div { background: var(--white); border: var(--bd); border-radius: 0; box-shadow: 3px 3px 0 var(--ink); }
html[data-theme="neo"] .stats h4 { color: var(--ink); font-family: var(--head); font-weight: 700; }
html[data-theme="neo"] .stats p { color: var(--ink); }

/* ---- navbar ---- */
html[data-theme="neo"] .ul-list {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
}
html[data-theme="neo"] .ul-list li { border-radius: 0; border: 2px solid transparent; }
html[data-theme="neo"] .ul-list li a { color: var(--ink); font-family: var(--head); font-weight: 700; }
html[data-theme="neo"] .ul-list li i { color: var(--ink); }
html[data-theme="neo"] .ul-list li:hover { background: var(--cyan); border-color: var(--ink); box-shadow: none; }
html[data-theme="neo"] .ul-list li.active { background: var(--yellow); border-color: var(--ink); box-shadow: 3px 3px 0 var(--ink); }
html[data-theme="neo"] .ul-list li.active a,
html[data-theme="neo"] .ul-list li.active i { color: var(--ink); }
html[data-theme="neo"] .hamburger {
  background: var(--yellow); color: var(--ink); border: var(--bd); border-radius: 0; box-shadow: var(--shadow-sm);
}

/* ---- home ---- */
html[data-theme="neo"] .home { color: var(--ink); }
html[data-theme="neo"] .home-p {
  background: var(--lime); color: var(--ink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: 3px 3px 0 var(--ink);
}
html[data-theme="neo"] .home-s { color: var(--ink); }
html[data-theme="neo"] .info-home h1 {
  color: var(--ink); display: inline-block; background: var(--yellow);
  border: var(--bd); box-shadow: var(--shadow); padding: 4px 16px; transform: rotate(-1.5deg);
}
html[data-theme="neo"] .info-home h3 { color: var(--ink); background: var(--pink); display: inline-block; padding: 2px 12px; border: var(--bd); }
html[data-theme="neo"] .info-p,
html[data-theme="neo"] .info-p2 { color: var(--ink); }
html[data-theme="neo"] .btn-home1 {
  background: var(--pink); color: var(--ink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: var(--shadow-sm); transition: transform .12s, box-shadow .12s;
}
html[data-theme="neo"] .btn-home1:hover { transform: translate(3px,3px); box-shadow: 1px 1px 0 var(--ink); }
html[data-theme="neo"] .btn-home2 {
  background: var(--white); color: var(--ink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: var(--shadow-sm); transition: transform .12s, box-shadow .12s;
}
html[data-theme="neo"] .btn-home2:hover { background: var(--cyan); color: var(--ink); transform: translate(3px,3px); box-shadow: 1px 1px 0 var(--ink); }
html[data-theme="neo"] hr { border: 0; height: 5px; background: var(--ink); width: 90%; }
html[data-theme="neo"] .follow { align-items: center; }
html[data-theme="neo"] .follow ul a { color: var(--ink); }
html[data-theme="neo"] .follow ul a:hover { color: var(--ink); text-shadow: none; background: var(--yellow); }
html[data-theme="neo"] .home img {
  border: var(--bd); border-radius: 0; box-shadow: 10px 10px 0 var(--pink), 10px 10px 0 3px var(--ink);
}

/* ---- about ---- */
html[data-theme="neo"] .about { color: var(--ink); font-family: var(--body); }
html[data-theme="neo"] .img-about img { border: var(--bd); box-shadow: 3px 3px 0 var(--ink); }
html[data-theme="neo"] .info-text h5 { color: var(--ink); font-family: var(--head); font-weight: 700; }
html[data-theme="neo"] .info-text p { color: var(--ink); }
html[data-theme="neo"] .about h3 {
  color: var(--ink); background: var(--cyan); display: inline-block;
  border: var(--bd); box-shadow: var(--shadow-sm); padding: 2px 14px;
}
html[data-theme="neo"] .about-text p { font-family: var(--body); color: var(--ink); }
html[data-theme="neo"] .about-text span { color: var(--ink); background: var(--yellow); padding: 0 4px; }
html[data-theme="neo"] .photo-container {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
}
html[data-theme="neo"] .photo-container img { border-radius: 0; border: 2px solid var(--ink); }
html[data-theme="neo"] .tape {
  background: var(--yellow); border: 2px solid var(--ink); border-radius: 0; box-shadow: none; opacity: 1;
}
html[data-theme="neo"] .tape::before { display: none; }

/* ---- judul section ---- */
html[data-theme="neo"] .project,
html[data-theme="neo"] .services,
html[data-theme="neo"] .certificate { color: var(--ink); }
html[data-theme="neo"] .project p,
html[data-theme="neo"] .services p,
html[data-theme="neo"] .certificate p,
html[data-theme="neo"] .info-pro p { color: var(--ink); }
html[data-theme="neo"] .project h1,
html[data-theme="neo"] .services h1,
html[data-theme="neo"] .certificate h1 {
  color: var(--ink); background: var(--yellow); border: var(--bd); box-shadow: var(--shadow);
  padding: 6px 20px; margin-bottom: 14px; text-align: center; text-transform: uppercase;
}
html[data-theme="neo"] .project hr,
html[data-theme="neo"] .services hr,
html[data-theme="neo"] .certificate hr {
  background: var(--ink); height: 6px; width: 100px; border-radius: 0;
}
html[data-theme="neo"] #techstack h1 { background: var(--cyan); }
html[data-theme="neo"] #learning h1 { background: var(--lime); }
html[data-theme="neo"] #tools h1 { background: var(--orange); }
html[data-theme="neo"] #certificate h1 { background: var(--pink); }
html[data-theme="neo"] #service h1 { background: var(--cyan); }

/* ---- kartu project / sertifikat ---- */
html[data-theme="neo"] .project-card {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
  transition: transform .15s, box-shadow .15s;
}
html[data-theme="neo"] .project-card:hover { transform: translate(-3px,-3px); box-shadow: 10px 10px 0 var(--ink); }
html[data-theme="neo"] .project-card img,
html[data-theme="neo"] #certificate .project-card img,
html[data-theme="neo"] #badges .project-card img {
  border-radius: 0 !important; border: var(--bd) !important; background: var(--white);
}
html[data-theme="neo"] .project-card h3 { color: var(--ink); }
html[data-theme="neo"] .project-card p { color: var(--ink); }
html[data-theme="neo"] .project-card .skills a {
  color: var(--ink); background: var(--lime); border: 2px solid var(--ink); border-radius: 0; font-weight: 700;
}
html[data-theme="neo"] .project-card .skills a:nth-child(2n) { background: var(--cyan); }
html[data-theme="neo"] .project-card .btn {
  color: var(--ink); background: var(--pink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: 3px 3px 0 var(--ink);
}
html[data-theme="neo"] .project-card .btn:hover { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--ink); background: var(--yellow); }
html[data-theme="neo"] .cert-photo::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ff7ab6' stroke='%23111' stroke-width='2' d='M12 21s-6.5-4.35-9.5-8.5C.5 9 2 5 6 5c2.2 0 3.6 1.3 4.5 2.7C11.4 6.3 12.8 5 15 5c4 0 5.5 4 3.5 7.5C18.5 16.65 12 21 12 21z'/%3E%3C/svg%3E");
  filter: none;
}
html[data-theme="neo"] .cert-partners-label { color: var(--ink); font-weight: 700; background: var(--yellow); border: 2px solid var(--ink); padding: 2px 10px; }
html[data-theme="neo"] .cert-partners-logos img { border: var(--bd); box-shadow: 3px 3px 0 var(--ink); background: var(--white); }

/* ---- sertifikat.html ---- */
html[data-theme="neo"] .cert-hero-kicker { color: var(--ink); }
html[data-theme="neo"] .cert-title-block h1 { color: var(--ink); background: var(--yellow); display: inline-block; padding: 6px 20px; border: var(--bd); box-shadow: var(--shadow); }
html[data-theme="neo"] .cert-title-underline { background: var(--ink); border-radius: 0; height: 6px; }
html[data-theme="neo"] .cert-glass-panel {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: 10px 10px 0 var(--ink);
}
html[data-theme="neo"] .cert-glass-panel::before { display: none; }
html[data-theme="neo"] .cert-page .project-card { background: var(--paper); }
html[data-theme="neo"] .cert-nav-btn {
  background: var(--yellow); color: var(--ink); border: var(--bd); border-radius: 0;
  font-weight: 700; box-shadow: var(--shadow-sm); transition: transform .12s, box-shadow .12s;
}
html[data-theme="neo"] .cert-nav-btn i { color: var(--ink); }
html[data-theme="neo"] .cert-nav-btn:hover { background: var(--pink); transform: translate(3px,3px); box-shadow: 1px 1px 0 var(--ink); }

/* ---- tech stack / learning / tools ---- */
html[data-theme="neo"] .stack-group-title { color: var(--ink); font-weight: 700; }
html[data-theme="neo"] .stack-badge,
html[data-theme="neo"] .learn-card,
html[data-theme="neo"] .tools-badge {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow-sm);
  transition: transform .15s, box-shadow .15s, background .15s;
}
html[data-theme="neo"] .stack-badge:hover,
html[data-theme="neo"] .learn-card:hover,
html[data-theme="neo"] .tools-badge:hover {
  background: var(--yellow); border-color: var(--ink);
  transform: translate(-3px,-3px); box-shadow: 8px 8px 0 var(--ink);
}
html[data-theme="neo"] .stack-badge span,
html[data-theme="neo"] .learn-card h4 { color: var(--ink); font-weight: 700; }
/* ikon brand: beri outline hitam supaya warna terang tetap terbaca */
html[data-theme="neo"] .stack-badge i,
html[data-theme="neo"] .tools-badge i,
html[data-theme="neo"] .learn-card i { -webkit-text-stroke: 1.2px var(--ink); }
html[data-theme="neo"] .stack-badge:hover i,
html[data-theme="neo"] .tools-badge:hover i { filter: none; }
html[data-theme="neo"] .stack-badge .fa-github,
html[data-theme="neo"] .tools-badge .fa-github { color: var(--white); }
html[data-theme="neo"] .learn-tag {
  color: var(--ink); background: var(--pink); border: 2px solid var(--ink); border-radius: 0; font-weight: 700;
}
html[data-theme="neo"] .tools-badge .tools-tip {
  background: var(--ink); color: var(--white); border: 2px solid var(--ink); border-radius: 0;
}

/* ---- services ---- */
html[data-theme="neo"] .services::before { display: none; }
html[data-theme="neo"] .service-card {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
}
html[data-theme="neo"] .service-card::before { display: none; }
html[data-theme="neo"] .service-card:hover { transform: translate(-4px,-4px); box-shadow: 10px 10px 0 var(--ink); }
html[data-theme="neo"] .service-card:nth-child(3n+1) { background: #fff3b0; }
html[data-theme="neo"] .service-card:nth-child(3n+2) { background: #c8f7f9; }
html[data-theme="neo"] .service-card:nth-child(3n) { background: #ffd1e6; }
html[data-theme="neo"] .service-icon {
  background: var(--white); color: var(--ink); border: var(--bd); border-radius: 0; box-shadow: var(--shadow-sm);
}
html[data-theme="neo"] .service-card h3 { color: var(--ink); }
html[data-theme="neo"] .service-card p { color: var(--ink); }
html[data-theme="neo"] .service-features span {
  background: var(--white); color: var(--ink); border: 2px solid var(--ink); border-radius: 0; font-weight: 700;
}

/* ---- contact ---- */
html[data-theme="neo"] .contact-info p,
html[data-theme="neo"] .contact-item { color: var(--ink); }
html[data-theme="neo"] .contact-item svg { color: var(--ink); filter: none; }
html[data-theme="neo"] .social-link {
  background: var(--white); color: var(--ink); border: var(--bd); border-radius: 0; box-shadow: 3px 3px 0 var(--ink);
}
html[data-theme="neo"] .social-link:hover { background: var(--pink); color: var(--ink); transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--ink); }
html[data-theme="neo"] .contact-form {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
}
html[data-theme="neo"] .form-group input,
html[data-theme="neo"] .form-group textarea {
  background: var(--paper); color: var(--ink); border: var(--bd); border-radius: 0; font-family: var(--body);
}
html[data-theme="neo"] .form-group input::placeholder,
html[data-theme="neo"] .form-group textarea::placeholder { color: #555; }
html[data-theme="neo"] .form-group input:focus,
html[data-theme="neo"] .form-group textarea:focus {
  outline: none; border-color: var(--ink); background: #fff3b0; box-shadow: var(--shadow-sm);
}

/* ---- modal Hire Me ---- */
html[data-theme="neo"] .hire-overlay { background: rgba(17,17,17,.7); }
html[data-theme="neo"] .hire-content {
  background: var(--paper); border: var(--bd); border-radius: 0; box-shadow: 10px 10px 0 var(--pink);
}
html[data-theme="neo"] .hire-content::-webkit-scrollbar-track { background: var(--paper); }
html[data-theme="neo"] .hire-content::-webkit-scrollbar-thumb { background: var(--ink); border-radius: 0; }
html[data-theme="neo"] .hire-close {
  background: var(--pink); color: var(--ink); border: var(--bd); border-radius: 0; box-shadow: 3px 3px 0 var(--ink);
}
html[data-theme="neo"] .hire-close:hover { background: var(--yellow); box-shadow: 1px 1px 0 var(--ink); }
html[data-theme="neo"] .hire-top { border-bottom: var(--bd); background: var(--yellow); }
html[data-theme="neo"] .hire-top img { border: var(--bd); border-radius: 0; box-shadow: var(--shadow-sm); }
html[data-theme="neo"] .hire-intro h2 { color: var(--ink); }
html[data-theme="neo"] .hire-role { color: var(--ink); font-weight: 700; }
html[data-theme="neo"] .hire-status { background: var(--lime); color: var(--ink); border: 2px solid var(--ink); border-radius: 0; }
html[data-theme="neo"] .hire-block h4 { color: var(--ink); }
html[data-theme="neo"] .hire-block p { color: var(--ink); }
html[data-theme="neo"] .hire-edu-item { border-left: 5px solid var(--ink); }
html[data-theme="neo"] .hire-edu-item strong { color: var(--ink); }
html[data-theme="neo"] .hire-edu-item p { color: #333; }
html[data-theme="neo"] .hire-skills span {
  background: var(--cyan); color: var(--ink); border: 2px solid var(--ink); border-radius: 0; font-weight: 700;
}
html[data-theme="neo"] .hire-skills span:hover { background: var(--pink); color: var(--ink); }
html[data-theme="neo"] .hire-certs li { color: var(--ink); }
html[data-theme="neo"] .hire-certs li::before { background: var(--ink); border-radius: 0; }
html[data-theme="neo"] .hire-socials a { color: var(--ink); }
html[data-theme="neo"] .hire-socials a:hover { color: var(--ink); text-shadow: none; background: var(--yellow); }
html[data-theme="neo"] .hire-footer { border-top: var(--bd); background: var(--white); }
html[data-theme="neo"] .hire-footer p { color: var(--ink); }

/* ---- switcher versi neo ---- */
html[data-theme="neo"] .theme-switch { font-family: var(--head); }
html[data-theme="neo"] .theme-switch__toggle {
  color: var(--ink); background: var(--yellow); border: var(--bd); border-radius: 0;
  box-shadow: var(--shadow-sm); transition: transform .12s, box-shadow .12s;
}
html[data-theme="neo"] .theme-switch__toggle i { color: var(--ink); }
html[data-theme="neo"] .theme-switch__toggle:hover { background: var(--pink); transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--ink); }
html[data-theme="neo"] .theme-switch__menu {
  background: var(--white); border: var(--bd); border-radius: 0; box-shadow: var(--shadow);
}
html[data-theme="neo"] .theme-switch__opt { color: var(--ink); border-radius: 0; font-weight: 700; border: 2px solid transparent; }
html[data-theme="neo"] .theme-switch__opt:hover { background: var(--cyan); }
html[data-theme="neo"] .theme-switch__opt[aria-pressed="true"] { background: var(--yellow); border-color: var(--ink); color: var(--ink); }
html[data-theme="neo"] .theme-switch__dot { border: 2px solid var(--ink); border-radius: 0; }

/* ---- responsif ---- */
@media (max-width: 768px) {
  html[data-theme="neo"] {
    --shadow: 4px 4px 0 var(--ink);
    --shadow-sm: 3px 3px 0 var(--ink);
  }
  html[data-theme="neo"] .card { background: var(--white); box-shadow: 6px 6px 0 var(--ink); }
  html[data-theme="neo"] .ul-list { background: var(--white); }
  html[data-theme="neo"] .info-home h1 { transform: none; }
  html[data-theme="neo"] .project h1,
  html[data-theme="neo"] .services h1 { font-size: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  html[data-theme="neo"] * { transition: none !important; }
}
`;

  var style = document.createElement("style");
  style.id = "theme-neo-brutalism-css";
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- UI pengganti tema ---------- */
  function buildSwitcher() {
    if (document.querySelector(".theme-switch")) return;

    var wrap = document.createElement("div");
    wrap.className = "theme-switch";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-switch__toggle";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<i class="fa-solid fa-palette"></i><span>Tema</span>';

    var menu = document.createElement("div");
    menu.className = "theme-switch__menu";
    menu.setAttribute("role", "group");
    menu.setAttribute("aria-label", "Pilih tema");

    function refresh() {
      menu.querySelectorAll(".theme-switch__opt").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.theme === current));
      });
    }

    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "theme-switch__opt";
      b.dataset.theme = t.id;
      b.innerHTML =
        '<span class="theme-switch__dot" style="background:' + t.swatch + '"></span>' + t.label;
      b.addEventListener("click", function () {
        current = t.id;
        apply(current);
        save(current);
        refresh();
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
      menu.appendChild(b);
    });

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    wrap.appendChild(menu);
    wrap.appendChild(toggle);
    document.body.appendChild(wrap);
    refresh();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildSwitcher);
  } else {
    buildSwitcher();
  }

  /* ---------- TEMA KE-3: muat Cursor Swarm dari file terpisah ----------
     Dengan begini index.html & sertifikat.html tidak perlu diubah:
     keduanya sudah memuat file ini. */
  if (document.readyState === "loading") {
    // dimuat sinkron (sebelum halaman tampil) supaya tidak ada kedipan merah
    document.write('<script src="theme-cursor.js"><\/script>');
  } else {
    var cursorTheme = document.createElement("script");
    cursorTheme.src = "theme-cursor.js";
    document.head.appendChild(cursorTheme);
  }
})();