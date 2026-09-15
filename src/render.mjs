import { icons } from './icons.mjs';

const e = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

export function render(site, assets) {
  const mailtoMain = `mailto:${site.email}?subject=${encodeURIComponent('Propuesta UGC / Colaboración - ' + site.name)}`;
  const driveUrl = site.driveUrl || 'https://drive.google.com';
  const base = site.url ? site.url.replace(/\/$/, '') : '';

  const renderVideoCard = (item) => {
    const isReady = Boolean(assets[item.src]);
    const archClass = item.shape === 'arch' ? 'card-arch-top' : '';

    return `
      <article class="v2-video-card ${archClass}" id="${e(item.id)}" data-player>
        <div class="video-frame ${archClass}">
          ${item.statusMock ? `
            <div class="video-mock-bar" aria-hidden="true">
              <span class="mock-time">${e(item.statusMock)}</span>
              <span class="mock-signals">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor"><path d="M1 9h2V7H1v2zm4 0h2V5H5v4zm4 0h2V3H9v6zm4 0h1V1h-1v8z"/></svg>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor"><rect x="0.5" y="0.5" width="13" height="9" rx="2" fill="none" stroke="currentColor"/><path d="M14.5 3.5v3h1v-3h-1z"/><rect x="2" y="2" width="9" height="6" rx="1"/></svg>
              </span>
            </div>
          ` : ''}

          <div class="video-media">
            ${isReady ? `
              <video playsinline muted preload="none" poster="${e(item.poster)}" aria-label="${e(item.title)}">
                ${assets[item.captions] ? `<track kind="captions" src="${e(item.captions)}" srclang="es" label="Español" default>` : ''}
                <source src="${e(item.src)}" type="video/mp4">
              </video>
            ` : `
              <img class="video-poster" src="${e(item.poster)}" alt="${e(item.title)} — ${e(item.category)}" loading="lazy" decoding="async">
            `}
          </div>

          <div class="video-card-overlay">
            <div class="overlay-info">
              <h3 class="video-card-title">${e(item.title)}</h3>
              <p class="video-card-category">${e(item.category)}</p>
            </div>
            <button class="video-play-btn" data-toggle aria-label="Reproducir video ${e(item.title)}">
              ${icons.play}
            </button>
          </div>

          ${isReady ? `
            <div class="v2-player-controls" hidden>
              <button class="control-btn" data-toggle aria-label="Pausar o reproducir">${icons.play}</button>
              <span class="control-time">0:00 / 0:00</span>
              <input class="control-seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Progreso del video">
              <button class="control-btn" data-mute aria-label="Activar sonido">${icons.sound}</button>
              <button class="control-btn" data-fullscreen aria-label="Pantalla completa">${icons.fullscreen}</button>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${base}/#adriana-seijas`,
        name: site.name,
        alternateName: site.brandName,
        jobTitle: site.role,
        description: site.description,
        url: base,
        email: site.email,
        sameAs: [site.instagramUrl],
        knowsAbout: [
          'User Generated Content (UGC)',
          'Comunicación y Periodismo',
          'Marketing de Maternidad y Bienestar',
          'Producción de Video 4K para Redes Sociales'
        ]
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${base}/#service`,
        name: `${site.name} — ${site.brandName}`,
        url: base,
        telephone: '',
        email: site.email,
        priceRange: '$$',
        image: `${base}${site.hero.portrait.src}`,
        areaServed: {
          '@type': 'Country',
          name: 'México'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paquetes de Producción UGC',
          itemListElement: site.services.packages.map((pkg, idx) => ({
            '@type': 'Offer',
            position: idx + 1,
            name: pkg.name,
            description: pkg.summary,
            price: pkg.price.replace(/[^0-9]/g, '') || undefined,
            priceCurrency: pkg.currency || 'MXN'
          }))
        }
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${e(site.title)}</title>
  <meta name="description" content="${e(site.description)}">
  <link rel="canonical" href="${e(site.url)}">

  <!-- Open Graph / Meta -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:url" content="${e(site.url)}">
  <meta property="og:title" content="${e(site.title)}">
  <meta property="og:description" content="${e(site.description)}">
  <meta property="og:image" content="${e(base + site.hero.portrait.src)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(site.title)}">
  <meta name="twitter:description" content="${e(site.description)}">
  <meta name="twitter:image" content="${e(base + site.hero.portrait.src)}">

  <!-- Preload Critical Fonts -->
  <link rel="preload" href="/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/dm-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Google Fonts Fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/refinements.css">

  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body class="theme-v2">
  <a class="skip-link" href="#contenido-principal">Saltar al contenido principal</a>

  <!-- NAVEGACIÓN SUPERIOR FIGMA -->
  <header class="site-nav-v2" id="navegacion">
    <div class="nav-container container">
      <a href="#" class="brand-link" aria-label="Maternidad con Adri — Inicio">
        <span class="brand-symbol" aria-hidden="true">${icons.handHelping}</span>
        <span class="brand-labels">
          <strong class="brand-title">${e(site.brandName)}</strong>
          <span class="brand-tag">${e(site.badge)}</span>
        </span>
      </a>

      <nav class="nav-menu" aria-label="Navegación del sitio">
        <a href="#videos">Videos</a>
        <a href="#servicios">Servicios</a>
        <a href="#paquetes">Paquetes</a>
        <a href="#sobre-mi">Sobre mí</a>
      </nav>

      <div class="nav-cta">
        <a href="#contacto" class="btn-pill btn-pill-outline">
          <span>Hablemos</span>
          <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
        </a>
      </div>
    </div>
  </header>

  <main id="contenido-principal">
    <!-- HERO EDITORIAL FIGMA -->
    <section class="v2-hero-section container" id="inicio" aria-labelledby="hero-title">
      <div class="hero-grid">
        <!-- Columna Izquierda: Mensaje y Acciones -->
        <div class="hero-left-col">
          <h1 class="hero-display-title" id="hero-title">
            ${e(site.hero.headline)}
          </h1>
          <p class="hero-body-text">
            ${e(site.hero.subtitle)}
          </p>

          <div class="hero-actions-row">
            <a href="#videos" class="btn-pill btn-pill-primary">
              <span>${e(site.hero.ctaPrimary.text)}</span>
              <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
            </a>
            <a href="#contacto" class="btn-pill btn-pill-secondary">
              <span>${e(site.hero.ctaSecondary.text)}</span>
              <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
            </a>
          </div>

          <div class="hero-proof-row">
            <div class="proof-avatars" aria-hidden="true">
              ${site.hero.socialProof.avatars.map((av, i) => `
                <img class="avatar-circle av-${i+1}" src="${e(av.src)}" alt="${e(av.alt)}" width="36" height="36" loading="eager">
              `).join('')}
            </div>
            <p class="proof-text">${e(site.hero.socialProof.text)}</p>
          </div>
        </div>

        <!-- Columna Derecha: Retrato en Arco -->
        <div class="hero-right-col">
          <div class="hero-arch-wrapper">
            <img class="hero-arch-img" src="${e(site.hero.portrait.src)}" alt="${e(site.hero.portrait.alt)}" width="620" height="740" fetchpriority="high" decoding="async">
            
            <div class="hero-floating-card">
              <strong class="floating-name">${e(site.hero.portrait.name)}</strong>
              <span class="floating-role">${e(site.hero.portrait.role)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN DE VIDEOS REALES FIGMA -->
    <section class="v2-videos-section container" id="videos" aria-labelledby="videos-heading">
      <div class="videos-header-split">
        <h2 class="section-display-h2" id="videos-heading">
          ${e(site.videos.title)}
        </h2>
        <p class="section-subtitle-p">
          ${e(site.videos.subtitle)}
        </p>
      </div>

      <div class="v2-videos-grid">
        ${site.videos.items.map(renderVideoCard).join('')}
      </div>

      <div class="videos-bottom-action">
        <a href="${e(driveUrl)}" target="_blank" rel="noopener noreferrer" class="btn-pill btn-pill-outline">
          <span>${e(site.videos.ctaMore.text)}</span>
          <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
        </a>
      </div>
    </section>

    <!-- SECCIÓN DE SERVICIOS Y PAQUETES FIGMA -->
    <section class="v2-services-section container" id="servicios" aria-labelledby="services-heading">
      <div class="services-header-split">
        <h2 class="section-display-h2" id="services-heading">
          ${e(site.services.title)}
        </h2>
        <div class="process-steps-row" aria-label="Etapas de trabajo">
          ${site.services.process.map(step => `
            <div class="step-pill">
              <span class="step-num">${e(step.num)}</span>
              <span class="step-name">${e(step.title)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="v2-packages-grid" id="paquetes">
        ${site.services.packages.map(pkg => `
          <article class="v2-package-card ${pkg.featured ? 'is-featured-arch' : ''}">
            <div class="package-head">
              <h3 class="package-name">${e(pkg.name)}</h3>
              <p class="package-summary">${e(pkg.summary)}</p>
            </div>

            <div class="package-pricing">
              <span class="package-price">${e(pkg.price)}</span>
              <span class="package-qty">${e(pkg.quantity)}</span>
            </div>

            <p class="package-deliverable">${e(pkg.deliverable)}</p>

            <ul class="package-features-list" aria-label="Inclusiones de ${e(pkg.name)}">
              ${pkg.features.map(f => `
                <li><span class="check-icon" aria-hidden="true">${icons.check}</span> <span>${e(f)}</span></li>
              `).join('')}
            </ul>

            <div class="package-btn-wrap">
              <a href="#contacto" class="btn-pill ${pkg.featured ? 'btn-pill-white' : 'btn-pill-outline'}">
                <span>${e(pkg.ctaText)}</span>
                <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
              </a>
            </div>
          </article>
        `).join('')}
      </div>

      <div class="services-footer-bar">
        <p class="services-custom-note">${e(site.services.customNote)}</p>
        <div class="services-status-wrap">
          <span class="agenda-badge">${e(site.services.statusBadge)}</span>
        </div>
      </div>
      <p class="billing-tax-note">${e(site.services.billingNote)}</p>
    </section>

    <!-- SECCIÓN DE PRUEBA SOCIAL Y CONTACTO FIGMA -->
    <section class="v2-proof-contact-section" id="sobre-mi">
      <!-- Fila Superior: Testimonio de Cliente -->
      <div class="client-proof-banner container">
        <div class="proof-photo-col">
          <img class="proof-campaign-img" src="${e(site.proofAndContact.campaignImage)}" alt="Colaboración UGC de Adriana Seijas con marca de bienestar" width="680" height="460" loading="lazy">
        </div>
        <div class="proof-quote-col">
          <blockquote class="proof-blockquote">
            ${e(site.proofAndContact.quote)}
          </blockquote>
          <div class="proof-meta-row">
            <span class="proof-author">${e(site.proofAndContact.author)}</span>
            <span class="proof-badge">${e(site.proofAndContact.badge)}</span>
          </div>
        </div>
      </div>

      <!-- Fila Inferior: Invitación a Colaborar / Tarjeta Flotante -->
      <div class="contact-terracotta-band" id="contacto">
        <div class="contact-inner container">
          <div class="contact-copy-col">
            <h2 class="contact-headline">
              ${e(site.proofAndContact.headline)}
            </h2>
            <p class="contact-subtext">
              ${e(site.proofAndContact.subtitle)}
            </p>
          </div>

          <div class="contact-card-col">
            <div class="floating-contact-card">
              <div class="card-head-row">
                <span class="card-title">${e(site.proofAndContact.floatingCard.title)}</span>
                <span class="card-tat">${e(site.proofAndContact.floatingCard.tat)}</span>
              </div>
              <div class="card-divider" aria-hidden="true"></div>
              <a class="card-email-link" href="${e(mailtoMain)}">
                ${e(site.proofAndContact.floatingCard.email)}
              </a>
              <div class="card-btn-row">
                <a class="btn-pill btn-pill-primary" href="${e(mailtoMain)}">
                  <span>${e(site.proofAndContact.floatingCard.ctaText)}</span>
                  <span class="icon-arr" aria-hidden="true">${icons.arrowUpRight}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN PREGUNTAS FRECUENTES (CONSERVA COPYS V1) -->
    <section class="v2-faq-section container" id="faq" aria-labelledby="faq-title">
      <div class="faq-header">
        <h2 class="section-display-h2" id="faq-title">${e(site.faq.title)}</h2>
        <p class="section-subtitle-p">${e(site.faq.intro)}</p>
      </div>

      <div class="faq-grid">
        ${site.faq.items.map((item, idx) => `
          <details class="faq-accordion-item" ${idx === 0 ? 'open' : ''}>
            <summary class="faq-question">
              <span>${e(item.question)}</span>
              <span class="faq-toggle-icon" aria-hidden="true">+</span>
            </summary>
            <div class="faq-answer">
              <p>${e(item.answer)}</p>
            </div>
          </details>
        `).join('')}
      </div>
    </section>
  </main>

  <!-- PIE DE PÁGINA FIGMA -->
  <footer class="v2-site-footer">
    <div class="footer-inner container">
      <div class="footer-brand-col">
        <div class="footer-logo">
          <span class="footer-symbol" aria-hidden="true">${icons.handHelping}</span>
          <span class="footer-brand-text">${e(site.footer.brand)}</span>
        </div>
        <p class="footer-copyright">${e(site.footer.copyright)}</p>
      </div>

      <div class="footer-links-col">
        <div class="footer-nav-links">
          <a href="${e(site.footer.instagramUrl)}" target="_blank" rel="noopener noreferrer">${e(site.footer.instagram)}</a>
          <a href="mailto:${e(site.footer.email)}">${e(site.footer.email)}</a>
        </div>
        <p class="footer-tagline-serif">${e(site.footer.tagline)}</p>
      </div>
    </div>
  </footer>

  <script src="/main.js" type="module"></script>
</body>
</html>
`;
}
