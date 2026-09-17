import { icons } from './icons.mjs';

const e = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[char]);

export function render(site, assets) {
  const mailtoMain = `mailto:${site.email}?subject=${encodeURIComponent('Colaboración UGC - Adriana Seijas')}`;
  const base = site.url ? site.url.replace(/\/$/, '') : '';

  const renderSpotlightCase = (piece, index) => {
    const isReady = Boolean(assets[piece.video]);
    const isEven = index % 2 === 1;

    return `
      <article class="spotlight-case ${isEven ? 'is-reversed' : ''}" id="${e(piece.id)}" data-player>
        <div class="spotlight-media-col">
          <div class="spotlight-video-frame">
            <div class="spotlight-media-wrap">
              ${isReady ? `
                <video src="${e(piece.video)}" playsinline muted preload="metadata" poster="${e(piece.poster)}" aria-label="${e(piece.title)}">
                  ${assets[piece.captions] ? `<track kind="captions" src="${e(piece.captions)}" srclang="es" label="Español" default>` : ''}
                  <source src="${e(piece.video)}" type="video/mp4">
                </video>
              ` : `
                <img class="spotlight-poster-img" src="${e(piece.poster)}" alt="${e(piece.title)} — Adriana Seijas UGC" loading="lazy" decoding="async">
              `}
            </div>

            <button class="spotlight-play-btn" data-toggle aria-label="Reproducir video ${e(piece.title)}">
              <span class="play-icon-inner" aria-hidden="true">${icons.play}</span>
            </button>

            ${isReady ? `
              <div class="spotlight-player-controls" hidden>
                <button class="ctrl-btn" data-toggle aria-label="Pausar o reproducir">${icons.play}</button>
                <span class="ctrl-time">0:00 / 0:00</span>
                <input class="ctrl-seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Línea de tiempo">
                <button class="ctrl-btn" data-mute aria-label="Activar sonido">${icons.sound}</button>
                <button class="ctrl-btn" data-fullscreen aria-label="Pantalla completa">${icons.fullscreen}</button>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="spotlight-story-col">
          <span class="spotlight-num">${e(piece.number)}</span>
          <h3 class="spotlight-title">${e(piece.title)}</h3>
          <p class="spotlight-hook-copy"><strong>${e(piece.copy)}</strong></p>

          <div class="spotlight-tags-line">
            <span class="tags-line-label">Tags:</span>
            <div class="tags-inline-group">
              ${piece.tags.map(t => `<span class="tag-item">${e(t)}</span>`).join('<span class="tag-dot" aria-hidden="true">·</span>')}
            </div>
          </div>
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
          'Maternidad y Crianza',
          'Lifestyle Familiar',
          'Producción de Video 4K para Redes Sociales'
        ]
      },
      {
        '@type': 'CreativeWork',
        '@id': `${base}/#portfolio`,
        name: `Portfolio Editorial — ${site.name}`,
        author: { '@id': `${base}/#adriana-seijas` },
        description: site.description,
        url: base,
        inLanguage: 'es',
        genre: 'UGC Video Storytelling'
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

  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-N5RK6MLW');</script>
  <!-- End Google Tag Manager -->

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0LG1K9B8FP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-0LG1K9B8FP');
  </script>

  <!-- Open Graph / Meta -->
  <meta property="og:type" content="profile">
  <meta property="og:locale" content="es_MX">
  <meta property="og:url" content="${e(site.url)}">
  <meta property="og:title" content="${e(site.title)}">
  <meta property="og:description" content="${e(site.description)}">
  <meta property="og:image" content="${e(base + '/images/og-adri-v2.png')}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Adriana Seijas — Creadora UGC &amp; Comunicadora en México">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(site.title)}">
  <meta name="twitter:description" content="${e(site.description)}">
  <meta name="twitter:image" content="${e(base + '/images/og-adri-v2.png')}">

  <!-- Preload Critical Fonts -->
  <link rel="preload" href="/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/dm-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Google Fonts Fallback -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/styles.css">

  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
</head>
<body class="editorial-body">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N5RK6MLW"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <a class="skip-to-content" href="#contenido">Saltar al contenido</a>

  <!-- NAVEGACIÓN BOUTIQUE / MINIMALISTA -->
  <header class="editorial-header">
    <div class="header-content container">
      <div class="header-brand-wrap">
        <a class="wordmark" href="#inicio" aria-label="Adriana Seijas, inicio">adri<span>.</span></a>
        <div class="header-descriptor">
          <span>Adriana Seijas</span>
          <span>${e(site.role)} · CDMX</span>
        </div>
      </div>

      <nav class="header-nav" aria-label="Navegación principal">
        <a href="#trabajo">Showcase</a>
        <a href="#enfoque">Enfoque</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div class="header-cta-wrap">
        <a href="#contacto" class="editorial-link-btn">
          <span>Hablemos</span>
          <span class="arrow-svg" aria-hidden="true">${icons.arrowUpRight}</span>
        </a>
      </div>
    </div>
  </header>

  <main id="contenido">
    <!-- 01 — HERO EDITORIAL -->
    <section class="editorial-hero container" id="inicio" aria-labelledby="hero-title">
      <div class="hero-editorial-layout">
        <div class="hero-typography-col">
          <div class="hero-eyebrow-badge">
            <span class="badge-dot" aria-hidden="true"></span>
            <span class="badge-text">${e(site.hero.differentiator)}</span>
          </div>

          <h1 class="hero-statement" id="hero-title">
            ${e(site.hero.headline)}
          </h1>

          <p class="hero-narrative">
            ${e(site.hero.narrative)}
          </p>

          <div class="hero-cta-group">
            <a href="#trabajo" class="btn-editorial-primary">
              <span>${e(site.hero.ctaPrimary.text)}</span>
              <span class="arrow-svg" aria-hidden="true">${icons.arrowUpRight}</span>
            </a>
            <a href="#contacto" class="btn-editorial-secondary">
              <span>${e(site.hero.ctaSecondary.text)}</span>
              <span class="arrow-svg" aria-hidden="true">${icons.arrowUpRight}</span>
            </a>
          </div>
        </div>

        <div class="hero-portrait-col">
          <div class="hero-portrait-frame">
            <img class="hero-portrait-img" src="${e(site.hero.portrait.src)}" alt="${e(site.hero.portrait.alt)}" width="640" height="800" fetchpriority="high" decoding="async">
            <div class="hero-portrait-caption">
              <span class="caption-title">Adriana Seijas</span>
              <span class="caption-sub">Mamá · Comunicadora &amp; UGC · México</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 02 — SPOTLIGHT WORK (Inmediato & Visual) -->
    <section class="editorial-spotlight container" id="trabajo" aria-labelledby="spotlight-title">
      <div class="spotlight-intro-header">
        <span class="section-label">02 / Showcase</span>
        <h2 class="spotlight-main-heading" id="spotlight-title">
          ${e(site.work.headline)}
        </h2>
        <p class="spotlight-intro-text">
          ${e(site.work.intro)}
        </p>
      </div>

      <div class="spotlight-cases-flow">
        ${site.work.pieces.map((piece, i) => renderSpotlightCase(piece, i)).join('')}
      </div>
    </section>

    <!-- 03 — DIFERENCIAL TIPOGRÁFICO (Enfoque: 4 Puntos) -->
    <section class="editorial-differential container" id="enfoque" aria-labelledby="differential-title">
      <div class="differential-header">
        <span class="section-label">03 / Enfoque</span>
        <h2 class="differential-statement" id="differential-title">
          ${e(site.diferencial.headline)}
        </h2>
      </div>

      <div class="differential-editorial-list">
        ${site.diferencial.points.map(pt => `
          <div class="differential-row">
            <span class="diff-num">${e(pt.num)}</span>
            <div class="diff-content">
              <h3 class="diff-title">${e(pt.title)}</h3>
              <p class="diff-desc">${e(pt.desc)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 04 — FORMAS DE TRABAJAR (2 Modalidades Limpias) -->
    <section class="editorial-working container" id="colaboracion" aria-labelledby="working-title">
      <div class="working-header">
        <span class="section-label">04 / Colaboración</span>
        <h2 class="working-heading" id="working-title">
          ${e(site.workingTogether.headline)}
        </h2>
        <p class="working-intro">
          ${e(site.workingTogether.intro)}
        </p>
      </div>

      <div class="working-options-grid">
        ${site.workingTogether.options.map(opt => `
          <div class="working-option-col">
            <span class="opt-letter">${e(opt.number)}</span>
            <h3 class="opt-title">${e(opt.title)}</h3>
            <p class="opt-desc">${e(opt.description)}</p>
          </div>
        `).join('')}
      </div>

      <div class="working-footnotes">
        <p class="working-single-note">${e(site.workingTogether.note)}</p>
      </div>
    </section>

    <!-- 05 — CAPACIDADES & NICHO -->
    <section class="editorial-index container" id="capacidades" aria-labelledby="index-title">
      <div class="index-grid">
        <div class="index-col">
          <span class="section-label">05 / Capacidades</span>
          <h3 class="index-heading" id="index-title">${e(site.capabilitiesAndNiche.capabilitiesTitle)}</h3>
          <ul class="index-list" aria-label="Capacidades creativas">
            ${site.capabilitiesAndNiche.capabilities.map(cap => `
              <li>${e(cap)}</li>
            `).join('')}
          </ul>
        </div>

        <div class="index-col">
          <span class="section-label">Nicho &amp; Categorías</span>
          <h3 class="index-heading">${e(site.capabilitiesAndNiche.nicheTitle)}</h3>
          <ul class="index-list" aria-label="Categorías especializadas">
            ${site.capabilitiesAndNiche.niche.map(item => `
              <li>${e(item)}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    </section>

    <!-- 06 — CONTACTO (El Gran CTA) -->
    <section class="editorial-contact" id="contacto" aria-labelledby="contact-heading">
      <div class="contact-inner-container container">
        <div class="contact-editorial-flow">
          <span class="section-label on-dark">06 / Contacto</span>
          <h2 class="contact-hero-statement" id="contact-heading">
            ${e(site.contact.headline)}
          </h2>
          <p class="contact-supporting-copy">
            ${e(site.contact.supporting)}
          </p>

          <div class="contact-direct-action">
            <a class="contact-email-hero" href="${e(mailtoMain)}">
              <span>${e(site.contact.email)}</span>
            </a>
            <div class="contact-buttons-row">
              <a href="${e(mailtoMain)}" class="btn-contact-primary">
                <span>${e(site.contact.ctaButton)}</span>
                <span class="arrow-svg" aria-hidden="true">${icons.arrowUpRight}</span>
              </a>
              <a href="${e(site.contact.instagramUrl)}" target="_blank" rel="noopener noreferrer" class="btn-contact-secondary">
                <span>Instagram ${e(site.contact.instagram)}</span>
                <span class="arrow-svg" aria-hidden="true">${icons.arrowUpRight}</span>
              </a>
            </div>
          </div>

          <div class="contact-commitments-row">
            <span>${e(site.contact.commitment)}</span>
            <span class="dot-separator" aria-hidden="true">·</span>
            <span>${e(site.contact.availability)}</span>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- 07 — FOOTER MINIMALISTA BOUTIQUE -->
  <footer class="editorial-footer">
    <div class="footer-container container">
      <div class="footer-left">
        <a class="wordmark" href="#inicio" aria-label="Adriana Seijas">adri<span>.</span></a>
        <strong class="footer-brand-name">${e(site.footer.name)}</strong>
        <span class="footer-brand-role">${e(site.footer.role)}</span>
        <p class="footer-tagline">“${e(site.footer.tagline)}”</p>
      </div>

      <div class="footer-right">
        <div class="footer-links">
          <a href="${e(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram ${e(site.instagram)}</a>
          <a href="${e(mailtoMain)}">${e(site.email)}</a>
        </div>
        <div class="footer-meta">
          <span>${e(site.footer.billing)}</span>
          <span class="footer-copy">${e(site.footer.copyright)}</span>
        </div>
      </div>
    </div>
  </footer>

  <script src="/main.js" type="module"></script>
</body>
</html>
`;
}
