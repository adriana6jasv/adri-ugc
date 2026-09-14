// Configuración de identidad, comunicación, videos y servicios de Adriana Seijas
export const site = {
  name: 'Adriana Seijas',
  brandShort: 'adri',
  role: 'Creadora UGC & Comunicadora',
  specialty: 'Maternidad, Bienestar y Vida Familiar',
  location: 'México',
  city: 'Ciudad de México',
  region: 'CDMX',
  tat: '3–5 días hábiles',
  profileNiches: 'Maternidad · Bienestar · Familia · Hogar',
  servicesList: 'Demostración de Producto · Reseñas Reales · Historias Cotidianas',
  languages: [
    { name: 'Español (Nativo)', sampleId: 'problem-solution' }
  ],
  collaboration: {
    role: 'Creación de Contenido UGC & Comunicación',
    turnaround: '3–5 días hábiles tras recibir el producto',
    paidIdentity: 'Disponible para contenido orgánico y anuncios de marca',
    paidIdentityDays: ['30', '60', '90'],
    agencyFolderUrl: 'https://drive.google.com',
    modes: [
      {
        title: 'Concepto y Guion Integral',
        badge: 'Servicio Completo',
        tagline: 'Desde la propuesta creativa hasta el video final',
        text: 'Analizo tu producto, propongo enfoques creativos según las dudas de tu audiencia, redacto guiones cercanos y naturales, y entrego el video editado listo para publicar o pautar.'
      },
      {
        title: 'Grabación con tu Propio Guion',
        badge: 'Producción Ágil',
        tagline: 'Grabación cuidada siguiendo las pautas de tu marca',
        text: 'Grabo tu contenido siguiendo el guion o brief de tu equipo, entregando tomas de alta calidad y variantes de inicio para que elijas la que mejor conecta con tu comunidad.'
      }
    ],
    delivery: 'Formato 4K vertical · Voz clara con micrófono · Subtítulos integrados',
    variations: 'Variantes de inicio y llamados a la acción. Material adicional disponible.'
  },
  email: 'adriana6jasv@gmail.com',
  instagram: '@maternidadconadri',
  instagramUrl: 'https://instagram.com/maternidadconadri',
  driveUrl: 'https://drive.google.com',
  url: 'https://maternidadconadri.com',
  title: 'Adriana Seijas | Maternidad con Adri — Creadora UGC & Comunicación en México',
  description: 'Creadora de contenido UGC y comunicadora en Ciudad de México. Especializada en marcas de maternidad, bienestar y vida familiar. Videos auténticos en 4K que conectan y generan confianza.',
  portrait: {
    src: '/images/adri.webp',
    alt: 'Adriana Seijas, creadora UGC y comunicadora especializada en maternidad, bienestar y vida familiar',
    position: '50% 18%'
  },
  hero: {
    identity: 'Adriana Seijas',
    brandMark: 'adri',
    headline: 'Contenido auténtico que conecta con familias reales.',
    text: 'Mamá real con formación en Comunicación y Periodismo. Creo videos cercanos y honestos para marcas de maternidad, bienestar y estilo de vida: inicios que capturan la atención en los primeros segundos, mensajes claros y recomendaciones genuinas que transmiten confianza e impulsan la decisión de compra.',
    primary: 'Contactar por Correo',
    secondary: 'Ver Portafolio / Carpeta Drive',
    badges: [
      { label: 'Entrega', value: '3–5 días hábiles', highlight: true },
      { label: 'Ubicación', value: 'Ciudad de México, México', highlight: false },
      { label: 'Idiomas', value: 'Español (Nativo)', highlight: false },
      { label: 'Temáticas', value: 'Maternidad · Bienestar · Familia · Hogar', highlight: false },
      { label: 'Contenido', value: 'Demostración de Producto · Reseñas Reales · Historias Cotidianas', highlight: false }
    ]
  },
  valueProposition: {
    title: 'Estrategia',
    subtitle: 'Por qué la comunicación auténtica marca la diferencia en cada video',
    text: 'Un buen video UGC no se trata de actuar ni de vender de forma agresiva. Con mi experiencia en periodismo y comunicación, identifico lo que de verdad le importa a una mamá o a una familia: transmito los beneficios con naturalidad, honestidad y cercanía para que el público confíe en tu marca.',
    pillars: [
      {
        number: '01',
        title: 'Empatía y Conexión Real',
        text: 'Hablo el mismo idioma que las familias. Conozco las dudas, rutinas y necesidades del hogar, logrando que cada recomendación se sienta como un consejo sincero entre amigas.'
      },
      {
        number: '02',
        title: 'Atención desde el Primer Segundo',
        text: 'La decisión de ver o deslizar ocurre al instante. Comienzo cada video con situaciones cotidianas o preguntas reales que despiertan curiosidad inmediata sin trucos exagerados.'
      },
      {
        number: '03',
        title: 'Claridad que Genera Confianza',
        text: 'Formación periodística aplicada al video: buena dicción, mensaje ordenado y demostración práctica que resuelven dudas y motivan la compra de forma orgánica.'
      }
    ]
  },
  work: {
    title: 'Showcase de Video',
    intro: 'Ideas en formato vertical 9:16 pensadas para distintos momentos: desde mostrar el detalle de un producto hasta contar una historia cotidiana.',
    topics: [
      { id: 'all', label: 'Todos los Formatos' },
      { id: 'voiceover', label: 'Voz en Off + Tomas de Producto' },
      { id: 'problem-solution', label: 'Problema → Solución' },
      { id: 'paid-ads', label: 'Video Dinámico para Redes' }
    ],
    pendingNotice: 'Muestras interactivas de producción. Los videos se actualizan automáticamente al colocar los archivos finales en /public/videos.',
    pieces: [
      {
        id: 'video-voiceover',
        number: '01',
        topic: 'voiceover',
        angleTag: 'Voz en Off + Tomas de Producto',
        title: 'Voz en Off + Tomas de Detalle',
        objective: 'Mostrar la textura, calidad y uso diario del producto con una locución cálida',
        hookSummary: 'Locución cercana y cuidada sobre tomas estéticas del producto en el hogar.',
        cover: ['El producto,', 'los detalles,', 'la historia.'],
        tone: 'olive',
        video: '/videos/video-voiceover.mp4',
        poster: '/images/poster-voiceover.svg',
        captions: '/videos/voiceover.es.vtt',
        downloadUrl: 'https://drive.google.com',
        description: 'No siempre es necesario hablar de frente a la cámara. Tomas detalladas del producto en un entorno cotidiano real, con una locución cálida y fluida que explica cada beneficio de manera agradable.',
        tags: ['Voz en Off', 'Detalle de Producto', 'Calidad 4K', 'Entorno Cotidiano']
      },
      {
        id: 'video-problem-solution',
        number: '02',
        topic: 'problem-solution',
        angleTag: 'Problema Cotidiano → Solución Real',
        title: 'Problema Cotidiano → Solución Real',
        objective: 'Mostrar cómo tu producto resuelve una necesidad común en la vida familiar',
        hookExample: '“Si tus hijos pierden el interés en los juguetes a los cinco minutos, esto nos sorprendió…”',
        cover: ['Un problema', 'cotidiano.', 'Una solución.'],
        tone: 'clay',
        video: '/videos/video-problem-solution.mp4',
        poster: '/images/poster-problem-solution.svg',
        captions: '/videos/problem-solution.es.vtt',
        downloadUrl: 'https://drive.google.com',
        description: 'Plantea una situación común con la que cualquier familia empatiza de inmediato y muestra cómo el producto aporta una solución práctica y duradera, cerrando con una recomendación honesta.',
        tags: ['Problema / Solución', 'Historia Real', 'Consejo Práctico', 'Recomendación Genuina']
      },
      {
        id: 'video-paid-ads',
        number: '03',
        topic: 'paid-ads',
        angleTag: 'Video Dinámico con Variantes de Inicio',
        title: 'Video Dinámico (Variantes de Inicio)',
        objective: 'Tener distintas opciones de apertura para ver cuál conecta mejor con tu audiencia',
        cover: ['Un mensaje claro.', 'Tres inicios.', 'Máxima conexión.'],
        tone: 'sand',
        video: '/videos/video-real-mom-storytelling.mp4',
        poster: '/images/poster-real-mom.svg',
        captions: '/videos/real-mom.es.vtt',
        downloadUrl: 'https://drive.google.com',
        description: 'Video pensado tanto para redes sociales como para anuncios pagados en Instagram y TikTok. Un mismo mensaje central con diferentes opciones de inicio para evaluar cuál genera mayor interés:',
        hooks: [
          {
            id: 'hook-a',
            name: 'Opción 1 (Sorpresa honesta)',
            quote: '“No esperaba que en casa fuéramos a usar esto tanto todos los días.”',
            focus: 'Sorpresa genuina sobre la utilidad del producto'
          },
          {
            id: 'hook-b',
            name: 'Opción 2 (Situación común)',
            quote: '“Siempre comprábamos cosas que duraban cinco minutos. Con esto fue diferente.”',
            focus: 'Identificación con una experiencia común de compra'
          },
          {
            id: 'hook-c',
            name: 'Opción 3 (Recomendación directa)',
            quote: '“Si estás buscando una recomendación que de verdad valga la pena, mira esto.”',
            focus: 'Recomendación directa de mamá a mamá'
          }
        ],
        tags: ['Video para Redes', 'Variantes de Inicio', 'Conexión Natural', 'Instagram & TikTok']
      }
    ]
  },
  deliverables: {
    title: 'Qué incluye cada entrega',
    intro: 'Todo el material se entrega listo para publicar en tus redes o utilizar en tus campañas publicitarias.',
    items: [
      {
        iconKey: 'camera',
        title: 'Formato Vertical en Alta Calidad (9:16)',
        description: 'Grabación en alta definición 4K con encuadre vertical nativo para Instagram Reels, TikTok y YouTube Shorts.'
      },
      {
        iconKey: 'mic',
        title: 'Audio Nítido y Voz Cercana',
        description: 'Captura con micrófono de solapa para que la voz suene cálida, clara y sin interferencias.'
      },
      {
        iconKey: 'captions',
        title: 'Subtítulos Integrados y Dinámicos',
        description: 'Textos animados en pantalla para captar la atención de quienes miran videos con el sonido desactivado.'
      },
      {
        iconKey: 'shield',
        title: 'Derechos de Uso para tu Marca',
        description: 'Licencia completa para publicar el contenido en tus redes sociales y utilizarlo en campañas publicitarias.'
      },
      {
        iconKey: 'archive',
        title: 'Tomas Adicionales y Recursos Extra',
        description: 'Tomas secundarias del producto y momentos espontáneos para que tu equipo disponga de más recursos visuales.'
      }
    ]
  },
  pricing: {
    title: 'Paquetes e Inversión',
    intro: 'Propuestas claras y accesibles para incorporar contenido auténtico a la comunicación de tu marca.',
    billingNote: 'Se ofrece facturación electrónica fiscal en México (CFDI / SAT). Precios antes de IVA.',
    flexibilityNote: 'Tarifas flexibles y adaptables según volumen de piezas, colaboraciones recurrentes o acuerdos de exclusividad.',
    packages: [
      {
        id: 'test-pack',
        name: 'Paquete Individual',
        quantity: '1 Video',
        price: '$3,200',
        currency: 'MXN',
        popular: false,
        badge: 'Para Comenzar',
        summary: 'Ideal para probar la dinámica de trabajo y dar a conocer tu producto con un primer video de calidad.',
        features: [
          '1 Video UGC terminado en formato vertical 9:16 en alta resolución',
          'Comprensión del producto y propuesta de guion cercano',
          'Apertura atractiva + llamado a la acción claro',
          'Subtítulos integrados y voz nítida con micrófono',
          'Derechos de uso para redes y publicidad incluidos',
          '1 ronda de ajustes incluida'
        ],
        ctaText: 'Solicitar Paquete Individual'
      },
      {
        id: 'creative-testing',
        name: 'Paquete de 3 Videos',
        quantity: '3 Videos + Variantes de Inicio',
        price: '$7,500',
        currency: 'MXN',
        popular: true,
        badge: 'El Más Elegido',
        summary: 'Tres enfoques distintos para mostrar tu producto desde varias perspectivas y conectar con más clientes.',
        features: [
          '3 Videos completos con enfoques distintos (reseña, uso diario, problema-solución)',
          'Variantes de inicio por video para probar qué apertura funciona mejor',
          'Guiones naturales basados en las dudas y beneficios reales del producto',
          'Edición cuidada, subtítulos dinámicos y música en tendencia',
          'Derechos de uso comercial completos para redes y publicidad',
          '2 rondas de ajustes incluidas'
        ],
        ctaText: 'Solicitar Paquete de 3 Videos'
      },
      {
        id: 'monthly-retainer',
        name: 'Colaboración Mensual',
        quantity: 'Contenido Continuo',
        price: 'A Medida',
        currency: 'MXN',
        popular: false,
        badge: 'Para Presencia Constante',
        summary: 'Contenido fresco mes con mes para mantener la presencia de tu marca activa y la confianza de tu comunidad.',
        features: [
          'De 4 a 8+ videos al mes según las necesidades de tu marca',
          'Tomas extra y material complementario en cada entrega',
          'Seguimiento y nuevas propuestas de contenido para tu nicho',
          'Prioridad en tiempos de entrega acordados',
          'Tarifa preferencial por volumen'
        ],
        ctaText: 'Cotizar Plan a Medida'
      }
    ]
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
  contact: {
    title: 'Hablemos de tu marca y de cómo',
    emphasis: 'conectar con tu audiencia.',
    text: 'Si tienes una marca de maternidad, bienestar, hogar o estilo de vida, creemos videos que transmitan cercanía, resuelvan dudas y generen confianza en tus futuros clientes.',
    prompt: 'Escríbeme contándome sobre tu producto y los objetivos que tienes en mente.',
    directEmail: 'adriana6jasv@gmail.com',
    subject: 'Colaboración UGC - [Nombre de tu Marca]'
  }
};

