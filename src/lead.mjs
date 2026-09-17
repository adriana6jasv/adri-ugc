import { icons } from './icons.mjs';

const e = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
})[char]);

export function renderLead(site) {
  const base = site.url ? site.url.replace(/\/$/, '') : 'https://maternidadconadri.com';

  return `<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hablemos | ${e(site.name)} — ${e(site.role)}</title>
  <meta name="description" content="Cuéntale a Adri sobre tu marca, campaña y entregables para recibir una propuesta de colaboración UGC. Respuesta en 1–2 días hábiles.">
  <meta name="theme-color" content="#fbf9f5">
  <link rel="canonical" href="${e(base)}/hablemos/">
  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">

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
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_MX">
  <meta property="og:url" content="${e(base)}/hablemos/">
  <meta property="og:title" content="Hablemos | ${e(site.name)} — ${e(site.role)}">
  <meta property="og:description" content="Cuéntale a Adri sobre tu marca, campaña y entregables para recibir una propuesta de colaboración UGC. Respuesta en 1–2 días hábiles.">
  <meta property="og:image" content="${e(base)}/images/og-adri-v2.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Adriana Seijas — Creadora UGC &amp; Comunicadora en México">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Hablemos | ${e(site.name)} — ${e(site.role)}">
  <meta name="twitter:description" content="Cuéntale a Adri sobre tu marca, campaña y entregables para recibir una propuesta de colaboración UGC. Respuesta en 1–2 días hábiles.">
  <meta name="twitter:image" content="${e(base)}/images/og-adri-v2.png">

  <!-- Preload Critical Fonts -->
  <link rel="preload" href="/fonts/cormorant-garamond-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/dm-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/dm-sans-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>

  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/lead.css">

  <!-- HubSpot Embed -->
  <script src="https://js.hsforms.net/forms/embed/52036222.js" defer></script>
</head>
<body class="editorial-body lead-page">
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N5RK6MLW"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <a class="skip-to-content" href="#formulario">Saltar al formulario</a>

  <header class="lead-header container">
    <div class="header-brand-wrap">
      <a class="wordmark" href="/" aria-label="Adriana Seijas, volver al portafolio">adri<span>.</span></a>
      <div class="header-descriptor">
        <span>Adriana Seijas</span>
        <span>${e(site.role)} · CDMX</span>
      </div>
    </div>
    <a class="lead-back-btn" href="/">
      <span class="lead-back-arrow" aria-hidden="true">←</span>
      <span>Volver al portafolio</span>
    </a>
  </header>

  <main class="lead-shell container" id="contenido">
    <section class="lead-copy" aria-labelledby="lead-title">
      <div class="hero-eyebrow-badge">
        <span class="badge-dot" aria-hidden="true"></span>
        <span class="badge-text">COLABORACIONES UGC</span>
      </div>

      <h1 class="lead-headline" id="lead-title">
        Cuéntame sobre <em>tu campaña.</em>
      </h1>

      <p class="lead-intro">
        Compárteme los datos principales y te responderé en 1–2 días hábiles con los siguientes pasos. Adri colabora con marcas de maternidad, infancia, bienestar y familia.
      </p>

      <div class="lead-expectations" aria-label="Proceso de tres pasos para colaborar">
        <article class="expectation-step">
          <span class="step-num" aria-hidden="true">01</span>
          <div class="step-body">
            <h2>Reviso tu brief</h2>
            <p>Producto, objetivo, entregables, tiempos y derechos de uso.</p>
          </div>
        </article>
        <article class="expectation-step">
          <span class="step-num" aria-hidden="true">02</span>
          <div class="step-body">
            <h2>Te respondo</h2>
            <p>En 1–2 días hábiles con disponibilidad y siguientes pasos claros.</p>
          </div>
        </article>
        <article class="expectation-step">
          <span class="step-num" aria-hidden="true">03</span>
          <div class="step-body">
            <h2>Armamos la propuesta</h2>
            <p>Alcance y presupuesto personalizado en pesos mexicanos (MXN), según tu campaña.</p>
          </div>
        </article>
      </div>

      <div class="lead-trust-strip">
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">✓</span>
          <span>Facturación fiscal en México (SAT)</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">✓</span>
          <span>Presupuestos y pagos en MXN</span>
        </div>
        <div class="trust-item">
          <span class="trust-icon" aria-hidden="true">✓</span>
          <span>Atención cálida y profesional en español</span>
        </div>
      </div>
    </section>

    <section class="lead-form-card" id="formulario" aria-labelledby="form-title">
      <div class="form-card-heading">
        <span class="form-badge">SOLICITUD DE COLABORACIÓN</span>
        <h2 id="form-title">Hablemos de tu marca</h2>
        <p class="form-subheading">
          Compárteme los datos principales para evaluar la colaboración:
        </p>
        <div class="form-guidance-box">
          <strong>En “Detalles de la campaña” te recomendamos incluir:</strong>
          <ul>
            <li>Nombre de la campaña o producto</li>
            <li>Entregables requeridos (videos, hooks, formatos)</li>
            <li>Presupuesto aproximado en MXN</li>
            <li>Fecha límite o cronograma estimado</li>
            <li>Derechos de uso (orgánico o paid media) y exclusividad</li>
          </ul>
        </div>
        <span class="form-required-legend">* Campos obligatorios</span>
      </div>

      <div class="hs-form-frame" data-region="na1" data-form-id="4ce2d475-ba60-4534-bda0-ad4deaaaea41" data-portal-id="52036222"></div>

      <noscript>
        <div class="lead-noscript-card">
          <p>Para completar el formulario interactivo activa JavaScript en tu navegador.</p>
          <p>También puedes enviar los datos de tu campaña directamente por correo a <a href="mailto:${e(site.email)}">${e(site.email)}</a>.</p>
        </div>
      </noscript>
    </section>
  </main>

  <footer class="editorial-footer lead-footer">
    <div class="footer-container container">
      <div class="footer-left">
        <a class="wordmark" href="/" aria-label="Adriana Seijas">adri<span>.</span></a>
        <strong class="footer-brand-name">${e(site.footer.name)}</strong>
        <span class="footer-brand-role">${e(site.footer.role)}</span>
        <p class="footer-tagline">“${e(site.footer.tagline)}”</p>
      </div>

      <div class="footer-right">
        <div class="footer-links">
          <a href="${e(site.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram ${e(site.instagram)} ↗</a>
          <a href="mailto:${e(site.email)}">${e(site.email)}</a>
        </div>
        <div class="footer-meta">
          <span>${e(site.footer.billing)}</span>
          <span class="footer-copy">${e(site.footer.copyright)}</span>
        </div>
      </div>
    </div>
  </footer>
</body>
</html>`;
}