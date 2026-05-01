const SUPABASE_URL = 'https://pmatmmwororvxzyneesq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_odVCjKjMJ8dgupXETAj17w_TmlwRvR9';

const pages = ['home', 'servicios', 'nosotros', 'equipo', 'clientes', 'contactar'];

async function navigate(page, anchor = null) {
  if (!pages.includes(page)) page = 'home';

  try {
    const res = await fetch(`pages/${page}.html`);
    const html = await res.text();
    const app = document.getElementById('app');
    app.innerHTML = html;
    app.classList.remove('page-enter');
    void app.offsetWidth;
    app.classList.add('page-enter');
  } catch (e) {
    console.error('Error cargando página:', e);
  }

  window.location.hash = page === 'home' ? '' : page;
  updateNav(page);

  if (anchor) {
    setTimeout(() => {
      const el = document.getElementById(anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (page === 'contactar') initForm();
  initAnimations();
}

function updateNav(page) {
  document.querySelectorAll('nav ul a').forEach(a => {
    a.classList.remove('active');
    if (a.dataset.page === page) a.classList.add('active');
  });
}

function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const msg = document.getElementById('ctaMessage');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    const data = {
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      empresa: document.getElementById('empresa').value,
      telefono: document.getElementById('telefono').value
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        msg.className = 'cta-message success';
        msg.textContent = '✓ ¡Solicitud enviada! Te contactaremos en menos de 48 horas.';
        form.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch (err) {
      msg.className = 'cta-message error';
      msg.textContent = '✗ Hubo un error. Por favor intenta de nuevo.';
    }

    btn.textContent = 'Solicitar diagnóstico gratuito';
    btn.disabled = false;
  });
}

function initAnimations() {
  const cards = document.querySelectorAll('.pillar-card, .testimonial-card, .value-item, .leader-card');
  const fade = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.08 });

  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(20px)';
    c.style.transition = 'opacity .5s ease, transform .5s ease';
    fade.observe(c);
  });
}

// Arrancar la app
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);
});