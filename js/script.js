// Tema terang/gelap (mengikuti pengaturan perangkat, bisa diganti manual)
const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
let saved = null;
try { saved = localStorage.getItem('tema'); } catch (e) {}
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
root.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('tema', next); } catch (e) {}
});

// Menu mobile
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});

// Tandai menu aktif saat scroll
const links = [...nav.querySelectorAll('a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => observer.observe(s));

// Filter proyek
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
  const cat = btn.dataset.filter;
  projects.forEach(p => { p.hidden = cat !== 'semua' && !p.dataset.cat.split(' ').includes(cat); });
}));

// Formulir kontak: membuka aplikasi email dengan pesan terisi.
// Ganti dengan layanan form (Formspree, Netlify Forms, dll.) bila ingin kirim langsung.
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const nama = d.get('nama').trim(), email = d.get('email').trim(), pesan = d.get('pesan').trim();
  if (!nama || !/^\S+@\S+\.\S+$/.test(email) || !pesan) {
    note.textContent = 'Lengkapi nama, email yang valid, dan pesan.';
    return;
  }
  const subject = encodeURIComponent('Pesan dari ' + nama);
  const body = encodeURIComponent(pesan + '\n\n' + nama + ' (' + email + ')');
  window.location.href = 'mailto:email@contoh.com?subject=' + subject + '&body=' + body;
  note.textContent = 'Membuka aplikasi email Anda…';
});

// Perbesar foto sertifikat
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const lbCap = lightbox.querySelector('p');
document.querySelectorAll('.cert-open').forEach(btn => btn.addEventListener('click', () => {
  const img = btn.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = btn.closest('.cert').querySelector('figcaption').textContent;
  lightbox.showModal();
}));
lightbox.querySelector('.lb-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });

document.getElementById('year').textContent = new Date().getFullYear();
