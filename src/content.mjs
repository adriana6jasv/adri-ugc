// Configuración de identidad, comunicación, videos, servicios y contenido de Adriana Seijas — v2
export const site = {
  name: 'Adriana Seijas',
  brandName: 'Maternidad con Adri',
  badge: 'UGC · MÉXICO',
  role: 'Creadora UGC & Comunicadora',
  specialty: 'Maternidad, Bienestar y Vida Familiar',
  location: 'Ciudad de México, México',
  city: 'Ciudad de México',
  region: 'CDMX',
  tat: '3–5 días hábiles',
  email: 'adriana6jasv@gmail.com',
  instagram: '@maternidadconadri',
  instagramUrl: 'https://instagram.com/maternidadconadri',
  driveUrl: 'https://drive.google.com',
  url: 'https://maternidadconadri.com',
  title: 'Adriana Seijas | Maternidad con Adri — Videos UGC para Marcas Familiares en México',
  description: 'Creadora UGC y comunicadora en Ciudad de México. Videos auténticos en 4K para marcas de maternidad, bienestar y estilo de vida que quieren generar confianza sin sonar a anuncio.',

  portrait: {
    src: '/images/v2-hero-portrait.jpg',
    alt: 'Adriana Seijas con su pequeña, creadora UGC y comunicadora en México',
    position: '50% 20%'
  },

  hero: {
    badge: 'UGC · MÉXICO',
    brand: 'Maternidad con Adri',
    headline: 'Videos UGC para marcas de maternidad y bienestar que quieren generar confianza y vender sin sonar a anuncio.',
    subtitle: 'Mamá real con formación en Comunicación y Periodismo. Creo el guion, grabo en 4K y entrego piezas listas para Reels, TikTok y anuncios con mensajes honestos que conectan con familias reales.',
    ctaPrimary: {
      text: 'Ver videos reales',
      href: '#videos'
    },
    ctaSecondary: {
      text: 'Solicitar cotización',
      href: '#contacto'
    },
    socialProof: {
      text: 'Contenido cercano para marcas que cuidan familias reales.',
      avatars: [
        { src: '/images/v2-avatar-1.jpg', alt: 'Marca de bienestar y maternidad' },
        { src: '/images/v2-avatar-2.jpg', alt: 'Marca familiar recomendada' },
        { src: '/images/v2-avatar-3.jpg', alt: 'Cliente satisfecho con contenido UGC' }
      ]
    },
    portrait: {
      src: '/images/v2-hero-portrait.jpg',
      alt: 'Adriana Seijas con su pequeña, creadora UGC y comunicadora en México',
      name: 'Adriana Seijas',
      role: 'Creadora UGC · mamá · comunicadora'
    }
  },

  videos: {
    title: 'Contenido que se siente vivido, no producido.',
    subtitle: 'Estrategia, narrativa y una presencia frente a cámara que convierte beneficios en momentos cotidianos.',
    ctaMore: {
      text: 'Ver más videos reales',
      href: 'https://drive.google.com'
    },
    items: [
      {
        id: 'video-care',
        title: 'Rutina de cuidado',
        category: 'Wellness · Testimonio',
        statusMock: '0:18 / 1:42',
        shape: 'rounded',
        poster: '/images/v2-video-care.jpg',
        src: '/videos/video-voiceover.mp4',
        captions: '/videos/voiceover.es.vtt',
        description: 'No siempre es necesario hablar de frente a la cámara. Tomas detalladas del producto en un entorno cotidiano real, con una locución cálida y fluida que explica cada beneficio de manera agradable.',
        tags: ['Voz en Off', 'Detalle de Producto', 'Calidad 4K', 'Entorno Cotidiano']
      },
      {
        id: 'video-family',
        title: 'Un día en familia',
        category: 'Maternidad · Lifestyle',
        shape: 'arch',
        poster: '/images/v2-video-family.jpg',
        src: '/videos/video-problem-solution.mp4',
        captions: '/videos/problem-solution.es.vtt',
        description: 'Plantea una situación común con la que cualquier familia empatiza de inmediato y muestra cómo el producto aporta una solución práctica y duradera, cerrando con una recomendación honesta.',
        tags: ['Problema / Solución', 'Historia Real', 'Consejo Práctico', 'Recomendación Genuina']
      },
      {
        id: 'video-product',
        title: 'Producto en uso',
        category: 'Bebé · Demostración',
        shape: 'rounded',
        poster: '/images/v2-video-product.jpg',
        src: '/videos/video-real-mom-storytelling.mp4',
        captions: '/videos/real-mom.es.vtt',
        description: 'Video pensado tanto para redes orgánicas como para anuncios pautados en Instagram y TikTok. Un mensaje central con opciones de inicio (hooks) para evaluar cuál genera mayor interacción.',
        tags: ['Video para Redes', 'Variantes de Inicio', 'Demostración Práctica', 'Instagram & TikTok']
      }
    ]
  },

  // Bridge para scripts legacy
  get work() {
    return {
      pieces: this.videos.items.map(p => ({
        id: p.id,
        video: p.src,
        poster: p.poster,
        captions: p.captions,
        title: p.title,
        description: p.description,
        tags: p.tags
      }))
    };
  },

  services: {
    title: 'Una producción ágil, con estrategia desde el primer guion.',
    process: [
      {
        num: '01',
        title: 'Estrategia',
        summary: 'Empatía y Conexión Real',
        description: 'Analizo tu producto y defino ángulos creativos basados en las dudas, rutinas y necesidades del hogar para que el mensaje resuene de forma sincera.'
      },
      {
        num: '02',
        title: 'Producción',
        summary: 'Atención desde el Primer Segundo',
        description: 'Grabación 4K en entorno real con luz natural, dicción clara con micrófono de solapa y aperturas cotidianas que despiertan interés inmediato.'
      },
      {
        num: '03',
        title: 'Entrega',
        summary: 'Claridad que Genera Confianza',
        description: 'Edición cuidada, subtítulos dinámicos en pantalla, variantes de hook y entrega rápida de 3 a 5 días lista para publicar o pautar.'
      }
    ],
    packages: [
      {
        id: 'pack-individual',
        name: 'Paquete Individual',
        quantity: '1 Video',
        price: '$3,200',
        currency: 'MXN',
        featured: false,
        summary: 'Para probar una idea o lanzar una pieza puntual.',
        deliverable: '1 video UGC · Guion · Grabación 4K · 1 ronda de cambios',
        features: [
          '1 Video UGC terminado en formato vertical 9:16 en 4K',
          'Comprensión de producto y propuesta de guion cercano',
          'Apertura atractiva + llamado a la acción claro',
          'Subtítulos integrados y voz nítida con micrófono',
          'Derechos de uso para redes y pauta publicitaria',
          '1 ronda de ajustes incluida'
        ],
        ctaText: 'Consultar disponibilidad'
      },
      {
        id: 'pack-3-videos',
        name: 'Paquete de 3 Videos',
        quantity: '3 Videos',
        price: '$7,500',
        currency: 'MXN',
        featured: true,
        summary: 'Tres ángulos creativos para aprender qué conecta mejor.',
        deliverable: '3 videos UGC · Estrategia · Guiones · Grabación 4K · 2 rondas',
        features: [
          '3 Videos completos con enfoques distintos (reseña, uso diario, problema-solución)',
          'Variantes de inicio (hooks) para evaluar mejor rendimiento',
          'Guiones naturales basados en beneficios reales',
          'Edición cuidada, subtítulos dinámicos y música en tendencia',
          'Derechos de uso comercial completos para redes y pauta',
          '2 rondas de ajustes incluidas'
        ],
        ctaText: 'Consultar disponibilidad'
      },
      {
        id: 'pack-monthly',
        name: 'Colaboración Mensual',
        quantity: 'Contenido Continuo',
        price: 'A Medida',
        currency: 'MXN',
        featured: false,
        summary: 'Contenido constante para crecer con una voz reconocible.',
        deliverable: 'Planeación mensual · Producción continua · Entregas semanales · Seguimiento',
        features: [
          'De 4 a 8+ videos al mes según las necesidades de tu marca',
          'Tomas extra (B-roll) y material complementario en cada entrega',
          'Seguimiento y nuevas propuestas periódicas para tu nicho',
          'Prioridad en agenda y tiempos de entrega acordados',
          'Tarifa preferencial por volumen'
        ],
        ctaText: 'Consultar disponibilidad'
      }
    ],
    customNote: '¿Necesitas fotos, raw footage o derechos para pauta? Armamos una cotización a medida.',
    statusBadge: 'Agenda abierta · México',
    billingNote: 'Facturación Electrónica: Se ofrece facturación electrónica fiscal en México (CFDI / SAT). Precios antes de IVA.'
  },

  proofAndContact: {
    quote: '“Adriana entendió la esencia de la marca y la convirtió en contenido natural, claro y listo para publicar.”',
    author: 'Equipo de marca · Bienestar familiar',
    badge: 'GUION · PRODUCCIÓN · EDICIÓN',
    campaignImage: '/images/v2-campaign-proof.jpg',
    headline: 'Hagamos contenido que tu audiencia quiera ver.',
    subtitle: 'Cuéntame sobre tu marca, objetivo y fecha ideal. Respondo personalmente.',
    floatingCard: {
      title: 'Iniciar una colaboración',
      tat: 'RESPUESTA EN 1–2 DÍAS',
      email: 'adriana6jasv@gmail.com',
      ctaText: 'Solicitar cotización'
    }
  },

  faq: {
    title: 'Preguntas Frecuentes',
    intro: 'Respuestas directas para agencias y marcas sobre envíos, plazos, derechos comerciales y facturación.',
    items: [
      {
        question: '¿Cómo funciona el envío de productos en México e internacional?',
        answer: 'Una vez definido el enfoque y guion creativo, la marca envía el producto a Ciudad de México. Desde el momento en que se recibe físicamente el paquete, el plazo de producción y entrega del material terminado es de 3 a 5 días hábiles.'
      },
      {
        question: '¿Qué derechos de uso y pauta publicitaria (Paid Media) se incluyen?',
        answer: 'Todos los paquetes contemplan derechos de uso comercial completos para publicación orgánica en tus canales y para pauta publicitaria pagada (Instagram Ads, TikTok Ads y Meta Ads) sin costos ocultos.'
      },
      {
        question: '¿Trabajas con marcas fuera de México?',
        answer: 'Sí, habitualmente colaboro con marcas de Estados Unidos (mercado hispano), España, Latinoamérica y México. La comunicación, revisión de propuestas y entrega de archivos en alta resolución se gestiona de forma 100% remota y ágil vía Google Drive.'
      },
      {
        question: '¿Emites facturación electrónica fiscal en México?',
        answer: 'Sí, emito factura electrónica oficial (CFDI) conforme a las disposiciones fiscales del SAT en México para empresas y marcas registradas.'
      },
      {
        question: '¿Por qué elegir un perfil con formación en periodismo y comunicación?',
        answer: 'A diferencia de contenidos improvisados, la formación periodística aporta dicción profesional, estructura narrativa persuasiva y capacidad para transmitir los beneficios del producto de forma cercana, creíble y honesta.'
      }
    ]
  },

  footer: {
    brand: 'Maternidad con Adri',
    copyright: '© 2026 Adriana Seijas · México',
    instagram: 'Instagram @maternidadconadri',
    instagramUrl: 'https://instagram.com/maternidadconadri',
    email: 'adriana6jasv@gmail.com',
    tagline: 'Contenido real para familias reales.'
  }
};
