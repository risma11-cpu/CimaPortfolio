window.addEventListener("load", () => {

    const intro = document.getElementById("intro");
    const site = document.getElementById("real-site");

    // ===== SKIP INTRO KALAU ADA HASH DI URL (misal balik dari sertifikat.html) =====
    if (window.location.hash) {
        intro.style.display = "none";
        site.style.display = "block";
        initScrollAnimations();

        const target = document.querySelector(window.location.hash);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: "auto"
            });
        }
        return;
    }

    const animations = [
        { selector: ".top-tags", class: "from-top", delay: 0 },
        { selector: ".left h1", class: "from-left", delay: 0.3 },
        { selector: ".desc", class: "from-left", delay: 0.6 },
        { selector: ".live-line", class: "from-bottom", delay: 0.9 },
        { selector: ".buttons", class: "zoom-in", delay: 1.2 },
        { selector: ".site-link", class: "from-bottom", delay: 1.5 },
        { selector: ".right", class: "from-right", delay: 0.6 },
        { selector: ".stats", class: "from-bottom", delay: 1.8 },
    ];

    animations.forEach(item => {
        const el = document.querySelector(item.selector);
        if (el) {
            el.style.animationDelay = `${item.delay}s`;
            el.classList.add(item.class);
        }
    });

    // ===== HIDE INTRO =====
    setTimeout(() => {
        intro.classList.add("smooth-out");

        setTimeout(() => {
            intro.style.display = "none";
            site.style.display = "block";
            initScrollAnimations(); 
        }, 1200);
    }, 3800);
});


// ===============================
// SCROLL REVEAL (SECTIONS)
// ===============================
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        ".slide-in-left, .slide-in-right, .slide-in-up"
    );

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translate(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));
}


// ===============================

const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".ul-list li");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navItems.forEach(item => {
        item.classList.remove("active");

        const link = item.querySelector("a");
        if (link && link.getAttribute("href") === `#${current}`) {
            item.classList.add("active");
        }
    });
});

// ===============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 120,
                behavior: "smooth"
            });
        }
    });
});
// --- ANIMASI PROJECT (ZIG-ZAG / KIRI KANAN) ---
const projects = document.querySelectorAll('.project-card');

const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Nambahin class 'show' buat animasi
            entry.target.classList.add('show');
            
            // Stop observing biar gak ulang animasi
            projectObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2 // Animasi jalan pas 20% kartunya keliatan
});

// Pasang observer ke semua kartu
projects.forEach((project) => {
    projectObserver.observe(project);
});
// ===== HIRE ME MODAL =====
const hireModal = document.getElementById("hireModal");
const btnHireMe = document.getElementById("btnHireMe");
const hireClose = document.getElementById("hireClose");

if (btnHireMe) {
    btnHireMe.addEventListener("click", () => {
        hireModal.classList.add("show");
        document.body.style.overflow = "hidden";
    });
}

if (hireClose) {
    hireClose.addEventListener("click", () => {
        hireModal.classList.remove("show");
        document.body.style.overflow = "";
    });
}

if (hireModal) {
    hireModal.addEventListener("click", (e) => {
        if (e.target === hireModal) {
            hireModal.classList.remove("show");
            document.body.style.overflow = "";
        }
    });
}
// HAMBURGER MENU
const mobBtn = document.getElementById('mobBtn');
const navMenu = document.getElementById('navMenu');

mobBtn.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const icon = mobBtn.querySelector('i');
    if (navMenu.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
    } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});

// SMOOTH SCROLL + TUTUP MENU
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Tutup menu
        navMenu.classList.remove('show');
        const icon = mobBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');

        // Ambil target section
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            // Delay dikit biar menu tertutup dulu
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 150);
        }
    });
});

// TUTUP MENU KETIKA KLIK DI LUAR
document.addEventListener('click', (e) => {
    if (!mobBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('show');
        const icon = mobBtn.querySelector('i');
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
    }
});
(() => {
    // Kirim pesan dari form kontak ke email lewat FormSubmit (tanpa backend)
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim...';

    const formData = new FormData(contactForm);
    formData.append('_subject', 'Pesan baru dari website');
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    // Balas langsung ke email pengirim
    formData.append('_replyto', formData.get('user_email'));

    try {
      const response = await fetch('https://formsubmit.co/ajax/lrsmtrrhmy@gmail.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        alert('Pesan berhasil dikirim! Terima kasih.');
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Gagal mengirim');
      }
    } catch (err) {
      console.error(err);
      alert('Maaf, pesan gagal dikirim. Coba lagi nanti.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}
})();