import { icons } from './icons.mjs';

const e = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

export function render(site, assets) {
  const offer = site.collaboration;
  const driveUrl = site.driveUrl || 'https://drive.google.com';
  const mailtoMain = `mailto:${site.email}?subject=${encodeURIComponent(site.contact?.subject || 'Propuesta UGC / Colaboración - Adriana Seijas')}`;
  const base = site.url ? site.url.replace(/\/$/, '') : '';

  const picture = assets[site.portrait.src]
    ? `<img class="portrait-image" src="${e(site.portrait.src)}" alt="${e(site.portrait.alt)}" width="720" height="900" fetchpriority="high" decoding="async">`
    : `<div class="portrait-placeholder" role="img" aria-label="Retrato editorial de Adriana Seijas — Creadora UGC &amp; Comunicadora">
        <span class="portrait-top">COMUNICACIÓN &amp; UGC</span>
        <span class="portrait-letter" aria-hidden="true">as.</span>
        <div class="portrait-bottom">
          <strong>Adriana Seijas</strong>
          <small>CREADORA UGC · CDMX</small>
        </div>
      </div>`;

  const renderPiece = (p) => {
    const ready = assets[p.video];
    return `
      <article class="work-piece ${e(p.tone)}" id="${e(p.id)}" data-topic="${e(p.topic)}" aria-labelledby="title-${e(p.id)}">
        <div class="piece-meta">
          <span class="piece-badge-angle">${e(p.angleTag)}</span>
          <span class="piece-badge-ratio">FORMATO 9:16</span>
        </div>

        <div class="film ${ready ? 'is-ready' : 'is-pending'}" ${ready ? 'data-player' : ''}>
          ${ready ? `
            <video playsinline muted preload="none" ${assets[p.poster] && !p.poster.endsWith(".svg") ? `poster="${e(p.poster)}"` : ''} aria-label="${e(p.title)}" controls>
              ${assets[p.captions] ? `<track kind="captions" src="${e(p.captions)}" srclang="es" label="Español" default>` : ''}
              <source src="${e(p.video)}" type="video/mp4">
            </video>
            <button class="big-play" data-toggle aria-label="Reproducir ${e(p.title)}">${icons.play}</button>
            <div class="player-controls" hidden>
              <div class="player-buttons">
                <button data-toggle aria-label="Reproducir">${icons.play}</button>
                <span class="player-time">0:00 / 0:00</span>
                <button data-mute aria-label="Activar sonido" aria-pressed="true">${icons.sound}</button>
                <button data-fullscreen aria-label="Pantalla completa">${icons.fullscreen}</button>
              </div>
              <input class="seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="Posición del video">
            </div>
            <p class="player-error" role="status" hidden>No se pudo cargar el video. <button data-retry>Volver a intentar</button></p>
          ` : `
            <div class="film-cover">
              <div class="cover-header">
                <span class="cover-brand">FORMATO 9:16</span>
                <span class="cover-status">EN PRODUCCIÓN</span>
              </div>
              <div class="cover-title" aria-hidden="true">
                ${p.cover.map((line, j) => `<span${j === 1 ? ' class="italic"' : ''}>${e(line)}</span>`).join('')}
              </div>
              <div class="cover-divider" aria-hidden="true"></div>
              <div class="cover-hook-box">
                <span class="hook-box-label">Idea de inicio:</span>
                <p class="hook-box-text">${e(p.hookExample || p.hookSummary || p.objective)}</p>
              </div>
              <div class="cover-footer">
                <span class="cover-objective">${e(p.objective)}</span>
              </div>
            </div>
            <span class="pending-label">${icons.camera} Próximamente · Muestra en Grabación</span>
          `}
        </div>

        <div class="piece-details">
          <div class="piece-header">
            <h3 id="title-${e(p.id)}">${e(p.title)}</h3>
            <div class="piece-objective-tag"><strong>Objetivo:</strong> ${e(p.objective)}</div>
          </div>
          <p class="piece-desc">${e(p.description)}</p>

          <ul class="tags" aria-label="Etiquetas del creativo">
            ${p.tags.map(t => `<li>${e(t)}</li>`).join('')}
          </ul>

          <div class="piece-actions">
            <a class="download-drive-btn" href="${e(p.downloadUrl || driveUrl)}" target="_blank" rel="noopener noreferrer">
              ${icons.drive} <span>[Descargar MP4 en Drive ↗]</span>
            </a>
          </div>
        </div>
      </article>
    `;
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/`,
        name: 'Maternidad con Adri',
        alternateName: ['Adriana Seijas UGC', 'Maternidad con Adri — Portfolio'],
        description: site.description,
        inLanguage: 'es-MX',
        publisher: { '@id': `${base}/#person` }
      },
      {
        '@type': 'Person',
        '@id': `${base}/#person`,
        name: site.name,
        alternateName: ['Adri', 'Maternidad con Adri', 'Adriana Seijas UGC'],
        jobTitle: site.role,
        description: site.description,
        url: `${base}/`,
        image: `${base}${site.portrait.src}`,
        email: `mailto:${site.email}`,
        sameAs: [
          site.instagramUrl
        ],
        knowsAbout: [
          'User Generated Content (UGC)',
          'Maternidad y Crianza',
          'Bienestar Familiar',
          'Video Vertical 9:16',
          'TikTok Ads',
          'Instagram Reels',
          'Periodismo y Comunicación'
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: 'MX'
        }
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${base}/#service`,
        name: 'Maternidad con Adri — Servicios UGC & Estrategia Creativa',
        url: `${base}/`,
        provider: { '@id': `${base}/#person` },
        image: `${base}/images/og-adri.jpg`,
        description: site.description,
        areaServed: [
          { '@type': 'Country', name: 'Mexico' },
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Spain' }
        ],
        priceRange: '$$ (MXN)',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Paquetes de Creación UGC',
          itemListElement: site.pricing.packages.map(pkg => ({
            '@type': 'Offer',
            name: pkg.name,
            description: pkg.summary,
            price: pkg.price.replace(/[^0-9]/g, '') || undefined,
            priceCurrency: pkg.currency
          }))
        }
      },
      ...(site.faq ? [{
        '@type': 'FAQPage',
        '@id': `${base}/#faq`,
        mainEntity: site.faq.items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      }] : [])
    ]
  };

  return `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(site.title)}</title>
  <meta name="description" content="${e(site.description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#f7f4ec">
  <meta name="color-scheme" content="light">

  <!-- Geotargeting & Local Signals (GEO) -->
  <meta name="geo.region" content="MX-CMX">
  <meta name="geo.placename" content="Ciudad de México">
  <meta name="geo.position" content="19.4326;-99.1332">
  <meta name="ICBM" content="19.4326, -99.1332">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:site_name" content="Maternidad con Adri — Adriana Seijas">
  <meta property="og:title" content="${e(site.title)}">
  <meta property="og:description" content="${e(site.description)}">
  <meta property="og:image" content="${e(base)}/images/og-adri.jpg">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Adriana Seijas | Maternidad con Adri — Creadora UGC y Comunicación">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${e(site.title)}">
  <meta name="twitter:description" content="${e(site.description)}">
  <meta name="twitter:image" content="${e(base)}/images/og-adri.jpg">

  ${base ? `<link rel="canonical" href="${e(base)}/"><meta property="og:url" content="${e(base)}/">` : ''}
  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">

  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>

  <link rel="preload" href="/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css">
  <script type="module" src="/main.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Saltar al contenido</a>

  <header class="site-header wrap">
    <a class="wordmark" href="#inicio" aria-label="Adriana Seijas, inicio">adri<span>.</span></a>
    <div class="header-descriptor">
      <span>Adriana Seijas</span>
      <span>${e(site.role)} · ${e(site.city)}</span>
    </div>
    <nav aria-label="Navegación principal">
      <a href="#estrategia">Estrategia</a>
      <a href="#trabajo">Showcase</a>
      <a href="#entregables">Entregables</a>
      <a href="#tarifas">Tarifas</a>
      <a href="#preguntas">Preguntas</a>
      <a class="nav-contact" href="#contacto">Contacto ${icons.diagonal}</a>
    </nav>
  </header>

  <main id="main">
    <!-- HERO SECTION: CRO optimizado con escaneo < 5s -->
    <section class="hero wrap" id="inicio" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">
          <span class="hero-name">${e(site.hero.identity)}<span class="name-period">.</span></span>
          <span class="hero-role-line">${e(site.role)}</span>
          <span class="hero-tagline">${e(site.hero.headline)}</span>
        </h1>

        <!-- MATRIZ OPERATIVA DE ESCANEO RÁPIDO (< 5 SEGUNDOS) -->
        <div class="hero-matrix" role="region" aria-label="Datos operativos rápidos para marcas y colaboraciones">
          <div class="matrix-item matrix-highlight">
            <span class="matrix-icon">${icons.clock}</span>
            <div class="matrix-text">
              <span class="matrix-label">Tiempo de Entrega</span>
              <strong class="matrix-value">${e(site.tat)}</strong>
            </div>
          </div>

          <div class="matrix-item">
            <span class="matrix-icon">${icons.mapPin}</span>
            <div class="matrix-text">
              <span class="matrix-label">Ubicación</span>
              <strong class="matrix-value">${e(site.city)}, ${e(site.location)}</strong>
            </div>
          </div>

          <div class="matrix-item">
            <span class="matrix-icon">${icons.sound}</span>
            <div class="matrix-text">
              <span class="matrix-label">Idioma</span>
              <strong class="matrix-value">Español (Nativo)</strong>
            </div>
          </div>

          <div class="matrix-item matrix-wide">
            <span class="matrix-icon">${icons.sparkles}</span>
            <div class="matrix-text">
              <span class="matrix-label">Temáticas Principales</span>
              <strong class="matrix-value">${e(site.profileNiches)}</strong>
            </div>
          </div>

          <div class="matrix-item matrix-wide">
            <span class="matrix-icon">${icons.camera}</span>
            <div class="matrix-text">
              <span class="matrix-label">Tipos de Video</span>
              <strong class="matrix-value">${e(site.servicesList)}</strong>
            </div>
          </div>
        </div>

        <p class="hero-intro">${e(site.hero.text)}</p>

        <!-- CTAS PRINCIPALES Y BOTÓN CRO DE COPIAR CORREO -->
        <div class="hero-actions">
          <a class="button button-dark" href="${e(mailtoMain)}">
            <span>${e(site.hero.primary)}</span>
            ${icons.diagonal}
          </a>
          <a class="button button-outline" href="${e(driveUrl)}" target="_blank" rel="noopener noreferrer">
            <span>${e(site.hero.secondary)}</span>
            ${icons.drive}
          </a>
          <button type="button" class="btn-copy-fast" data-copy-email="${e(site.email)}" title="Copiar correo para pegar">
            ${icons.copy}
            <span>Copiar correo</span>
          </button>
        </div>

        <div class="hero-contact-strip">
          <span class="strip-label">Contacto directo:</span>
          <a class="strip-email" href="${e(mailtoMain)}">${e(site.email)}</a>
          <span class="strip-sep">·</span>
          <a class="strip-insta" href="${e(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">${e(site.instagram)} ↗</a>
        </div>
      </div>

      <figure class="hero-portrait">
        <div class="portrait-frame">
          ${picture}
          <div class="portrait-note">
            <span class="note-kicker">Comunicación Auténtica</span>
            <p>Conectar.<br><em>Transmitir.</em><br>Convencer.</p>
            <span class="note-signature" aria-hidden="true">Adri</span>
          </div>
        </div>
        <figcaption>
          <span>Adriana Seijas · Creadora UGC &amp; Comunicadora</span>
          <span>${e(site.city)}</span>
        </figcaption>
      </figure>
    </section>

    <!-- VALUE PROPOSITION SECTION: Estrategia y Comunicación -->
    <section class="value-prop wrap" id="estrategia" aria-labelledby="strat-title">
      <div class="section-badge">${e(site.valueProposition.title)}</div>
      <div class="section-intro">
        <h2 id="strat-title">Más que un video bonito: <em>comunicación natural que conecta y genera confianza.</em></h2>
        <p class="lead-text">${e(site.valueProposition.text)}</p>
      </div>

      <div class="pillars-grid">
        ${site.valueProposition.pillars.map(p => `
          <div class="pillar-card">
            <span class="pillar-number">${e(p.number)}</span>
            <h3>${e(p.title)}</h3>
            <p>${e(p.text)}</p>
          </div>
        `).join('')}
      </div>

      <div class="modes-container">
        <h3 class="modes-title">Dos formas de colaborar según lo que necesites</h3>
        <div class="modes-grid">
          ${offer.modes.map((m, idx) => `
            <article class="mode-card ${idx === 0 ? 'mode-primary' : ''}">
              <div class="mode-top">
                <span class="mode-badge">${e(m.badge)}</span>
                <span class="mode-order">Opción ${idx + 1}</span>
              </div>
              <h4 class="mode-name">${e(m.title)}</h4>
              <p class="mode-tagline">${e(m.tagline)}</p>
              <p class="mode-desc">${e(m.text)}</p>
            </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- VIDEO SHOWCASE SECTION -->
    <section class="work wrap" id="trabajo" aria-labelledby="work-title">
      <div class="section-badge">Video Showcase</div>
      <div class="section-intro">
        <h2 id="work-title">${e(site.work.title)}</h2>
        <p>${e(site.work.intro)}</p>
      </div>

      <div class="work-grid">
        ${site.work.pieces.map(renderPiece).join('')}
      </div>
    </section>

    <!-- SERVICIOS Y ENTREGABLES -->
    <section class="deliverables wrap" id="entregables" aria-labelledby="deliv-title">
      <div class="section-badge">Detalles de Entrega</div>
      <div class="section-intro">
        <h2 id="deliv-title">${e(site.deliverables.title)}</h2>
        <p>${e(site.deliverables.intro)}</p>
      </div>

      <div class="deliverables-grid">
        ${site.deliverables.items.map(item => `
          <div class="deliverable-card">
            <div class="deliv-icon">${icons[item.iconKey] || icons.check}</div>
            <div class="deliv-text">
              <h3>${e(item.title)}</h3>
              <p>${e(item.description)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- TARIFAS Y PAQUETES BASE (En MXN con Facturación Fiscal) -->
    <section class="pricing wrap" id="tarifas" aria-labelledby="pricing-title">
      <div class="section-badge">Tarifas &amp; Paquetes</div>
      <div class="section-intro">
        <h2 id="pricing-title">${e(site.pricing.title)}</h2>
        <p>${e(site.pricing.intro)}</p>
      </div>

      <div class="pricing-grid">
        ${site.pricing.packages.map(pkg => `
          <article class="pricing-card ${pkg.popular ? 'is-popular' : ''}">
            ${pkg.popular ? `<div class="card-pop-badge">${icons.sparkles} ${e(pkg.badge)}</div>` : `<div class="card-std-badge">${e(pkg.badge)}</div>`}
            <div class="pkg-head">
              <h3 class="pkg-title">${e(pkg.name)}</h3>
              <div class="pkg-qty">${e(pkg.quantity)}</div>
              <div class="pkg-price-box">
                <span class="price-val">${e(pkg.price)}</span>
                <span class="price-curr">${e(pkg.currency)}</span>
              </div>
            </div>
            <p class="pkg-summary">${e(pkg.summary)}</p>
            <ul class="pkg-features" aria-label="Qué incluye este paquete">
              ${pkg.features.map(f => `<li>${icons.check} <span>${e(f)}</span></li>`).join('')}
            </ul>
            <a class="button ${pkg.popular ? 'button-dark' : 'button-outline'} pkg-cta-btn" href="mailto:${e(site.email)}?subject=${encodeURIComponent(`Solicitud ${pkg.name} - Adriana Seijas`)}">
              <span>${e(pkg.ctaText)}</span>
              ${icons.diagonal}
            </a>
          </article>
        `).join('')}
      </div>

      <div class="pricing-footnotes">
        <div class="footnote-item">
          <span class="fn-icon">${icons.shield}</span>
          <p><strong>Facturación Electrónica:</strong> ${e(site.pricing.billingNote)}</p>
        </div>
        <div class="footnote-item">
          <span class="fn-icon">${icons.arrow}</span>
          <p><strong>Flexibilidad:</strong> ${e(site.pricing.flexibilityNote)}</p>
        </div>
      </div>
    </section>

    <!-- PREGUNTAS FRECUENTES (FAQ & GEO OPTIMIZATION) -->
    ${site.faq ? `
    <section class="faq wrap" id="preguntas" aria-labelledby="faq-title">
      <div class="section-badge">Preguntas Frecuentes</div>
      <div class="section-intro">
        <h2 id="faq-title">${e(site.faq.title)}</h2>
        <p>${e(site.faq.intro)}</p>
      </div>

      <div class="faq-accordion">
        ${site.faq.items.map((item, idx) => `
          <details class="faq-item"${idx === 0 ? ' open' : ''}>
            <summary class="faq-summary">
              <span class="faq-question">${e(item.question)}</span>
              <span class="faq-icon" aria-hidden="true">${icons.down}</span>
            </summary>
            <div class="faq-content">
              <p>${e(item.answer)}</p>
            </div>
          </details>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- FOOTER / CONTACTO RÁPIDO (Cero Fricción) -->
    <section class="contact-section wrap" id="contacto" aria-labelledby="contact-title">
      <div class="contact-card">
        <div class="contact-header">
          <span class="contact-kicker">Hablemos de tu marca</span>
          <h2 id="contact-title">${e(site.contact.title)}<br><em>${e(site.contact.emphasis)}</em></h2>
          <p class="contact-desc">${e(site.contact.text)}</p>
        </div>

        <div class="contact-body">
          <div class="contact-box-primary">
            <span class="box-tag">Correo Electrónico (Respuesta en menos de 24h)</span>
            <div class="email-copy-wrapper">
              <a class="selectable-email" href="${e(mailtoMain)}" title="Hacer clic para redactar correo">${e(site.contact.directEmail)}</a>
              <button type="button" class="btn-copy-chip" data-copy-email="${e(site.contact.directEmail)}" title="Copiar correo al portapapeles">
                ${icons.copy}
                <span>Copiar</span>
              </button>
            </div>
            <p class="contact-prompt-note">${e(site.contact.prompt)}</p>
            <div class="contact-btn-row">
              <a class="button button-white" href="${e(mailtoMain)}">
                <span>Escribir por Correo</span>
                ${icons.diagonal}
              </a>
            </div>
          </div>

          <div class="contact-box-secondary">
            <span class="box-tag">Material y Enlaces</span>
            <ul class="quick-links-list">
              <li>
                <a href="${e(driveUrl)}" target="_blank" rel="noopener noreferrer">
                  <span class="ql-icon">${icons.drive}</span>
                  <div>
                    <strong>Carpeta Google Drive ↗</strong>
                    <span>Videos de muestra y recursos</span>
                  </div>
                </a>
              </li>
              <li>
                <a href="${e(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">
                  <span class="ql-icon">${icons.camera}</span>
                  <div>
                    <strong>Instagram (${e(site.instagram)}) ↗</strong>
                    <span>Contenido sobre maternidad y vida cotidiana</span>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer wrap">
    <div class="footer-brand">
      <a class="wordmark" href="#inicio" aria-label="Adriana Seijas">adri<span>.</span></a>
      <p><strong>Adriana Seijas</strong><br>${e(site.role)}<br>${e(site.city)}, ${e(site.location)}</p>
    </div>
    <div class="footer-links">
      <a href="${e(driveUrl)}" target="_blank" rel="noopener noreferrer">Google Drive ↗</a>
      <a href="${e(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram ${e(site.instagram)} ↗</a>
      <a href="${e(mailtoMain)}">${e(site.email)}</a>
    </div>
    <a class="back-top" href="#inicio">Volver arriba ${icons.down}</a>
  </footer>

  <!-- TOAST FEEDBACK FOR COPY-TO-CLIPBOARD -->
  <div id="toast" class="toast" role="status" aria-live="polite" hidden>
    ${icons.check} <span>¡Correo copiado al portapapeles!</span>
  </div>
</body>
</html>`;
}

