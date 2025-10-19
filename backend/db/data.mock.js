/**
 * ============================================
 * MOCK DATA
 * ============================================
 */

export const mockData = {
  /**
   * ============================================
   * USUARIOS DEL SISTEMA
   * ============================================
   */
  users: [
    {
      username: "admin",
      email: "admin@negromate.com",
      role: "admin",
    },
  ],
  /**
   * ============================================
   * CONTENIDO DE LAS PÁGINAS
   * ============================================
   */
  content: [
    {
      section: "aboutUs",
      title: "Sobre Nosotros",
      mainParagraph:
        "<strong>Negromate Creatives</strong> emerge en el escenario creativo de Madrid, España. Somos emprendedores con una perspectiva fresca y arraigada en la cultura urbana que nos rodea e inspira. Transformamos ideas en visuales y nos especializamos en la creación de identidades de marcas, desarrollando logotipos e ilustraciones que capturan la esencia.<br><b> La creatividad va más allá del ámbito digital,</b> llevamos nuestro arte a espacios físicos, interviniendo muros en el entorno urbano. Personalizamos prendas de ropa para quienes buscan expresar su individualidad. Nuestra estética se basa en la fluidez del surf y el arte alternativo. Estos elementos sellan un carácter inconfundible en los proyectos que hemos desarrollado juntos a nuestros clientes.<br><b><u>Comprometidos con soluciones de diseño de alta calidad que comunican, conectan con audiencia y perduran.</u></b>",
      artists: {
        title: "Adriana y Yoel",
        imageUrl: "/images/artistas-aboutUs.webp",
        instagram: {
          adriana: "https://www.instagram.com/adriluzzatto/",
          yoel: "https://www.instagram.com/soy.yowyow/",
        },
        paragraphs: [
          "En <strong>Negromate Creatives</strong> la conceptualización y pasión por el arte urbano se entrelazan para dar vida a proyectos únicos. Nuestra historia comienza en Madrid, donde nos conocemos en el departamento de diseño en una agencia de marketing. Ambos estilos confluyeron de manera natural, impulsándonos a unir fuerzas y fundar nuestra propia agencia de creación.",
          "<strong>Adriana</strong> con una década de experiencia en dirección de arte, ha trabajado con marcas de renombre como Coca-Cola y Cabify. Su visión aporta un enfoque profesional a cada proyecto, desde la idea inicial del diseño hasta los tipos de pintura que estaran en los murales. Confiamos en ella la ejecución de proyectos complejos, siempre orientada en soluciones de impacto visual.",
          "<strong>Yoel</strong> complementa esta experiencia con 5 años dedicados a la docencia artística y su trabajo como freelancer. Su versatilidad radica en la creación de ilustraciones detalladas, la intervención de espacios a través de murales con graffiti y la conceptualización de diseños para ropa. Aportando un toque fresco y auténtico a cada pieza.",
          "<b>Creamos este lugar que celebra el arte alternativo y lo lleva a otros espacios para compartirlo. Nos encanta colaborar con artistas locales y globales para enriquecer nuestras propuestas y ofrecer siempre algo nuevo en con la comunidad.</b>",
        ],
      },
    },
  ],
  /**
   * ============================================
   * CATÁLOGO DE PRODUCTOS/SERVICIOS
   * ============================================
   */
  products: [
    // ============================================
    // CATEGORÍA: DISEÑO GRÁFICO
    // ============================================
    {
      category: "GraphicDesign",
      name: "Paquete Esencial de Marca",
      price: 250,
      imageUrl: "/images/santoku.webp",
      description: "Ideal para startups y pequeños proyectos.",
      details: [
        "Diseño de logotipo principal",
        "Paleta de colores y tipografías",
        "2 rondas de revisión",
        "Archivos en formato vectorial y PNG",
      ],
    },
    {
      category: "GraphicDesign",
      name: "Paquete Identidad Corporativa",
      price: 500,
      imageUrl: "/images/rayolab-bg.webp",
      description: "La solución completa para establecer tu marca.",
      details: [
        "Todo del Paquete Esencial",
        "Diseño de logotipo secundario y favicon",
        "Manual de marca básico (4 páginas)",
        "Diseño de tarjeta de visita",
        "4 rondas de revisión",
      ],
    },
    {
      category: "GraphicDesign",
      name: "Paquete Premium Total",
      price: 750,
      imageUrl: "/images/ivy-bg.webp",
      description: "Para marcas que buscan un impacto total y versatilidad.",
      details: [
        "Todo del Paquete Corporativo",
        "Manual de marca extendido (10+ páginas)",
        "Plantillas para redes sociales (3 posts, 1 story)",
        "Diseño de firma de email",
        "Revisiones ilimitadas por 2 semanas",
      ],
    },
    // ============================================
    // CATEGORÍA: ROPA PERSONALIZADA
    // ============================================
    {
      category: "CustomClothing",
      name: "Prenda Única",
      price: 50,
      imageUrl: "/images/clothes.webp",
      description: "Una camiseta o sudadera con un diseño exclusivo para ti.",
      details: [
        "1 prenda (camiseta o sudadera)",
        "Diseño personalizado (hasta 2 colores)",
        "Técnica de serigrafía o vinilo textil",
        "Asesoría de diseño incluida",
      ],
    },
    {
      category: "CustomClothing",
      name: "Pack Dúo Creativo",
      price: 100,
      imageUrl: "/images/clothes-graff.webp",
      description:
        "Perfecto para parejas, amigos o para tener una de recambio.",
      details: [
        "2 prendas a elección",
        "Diseño complejo (hasta 4 colores)",
        "Técnicas mixtas (aerografía, serigrafía)",
        "Proceso colaborativo de diseño",
      ],
    },
    {
      category: "CustomClothing",
      name: "Colección Cápsula",
      price: 150,
      imageUrl: "/images/clothes-wall.webp",
      description: "Lanza tu propia mini-colección con nuestra ayuda.",
      details: [
        "5 prendas (mix de camisetas/sudaderas)",
        "Conceptualización de la colección",
        "Diseños cohesivos para todas las prendas",
        "Etiquetado personalizado de la marca",
      ],
    },
    // ============================================
    // CATEGORÍA: MURALES
    // ============================================
    {
      category: "Murals",
      name: "Mural Interior Pequeño",
      price: 600,
      imageUrl: "/images/manos-pizza.webp",
      description: "Dale vida a una pared de tu local u hogar (hasta 4m²).",
      details: [
        "Diseño y boceto digital",
        "Superficie hasta 4 metros cuadrados",
        "Pintura plástica y sprays de alta calidad",
        "Trabajo realizado en 1-2 días",
      ],
    },
    {
      category: "Murals",
      name: "Mural Mediano Impacto Visual",
      price: 850,
      imageUrl: "/images/el-refugio.webp",
      description:
        "Transforma un espacio comercial o una fachada (hasta 10m²).",
      details: [
        "Todo del Paquete Pequeño",
        "Superficie hasta 10 metros cuadrados",
        "Mayor complejidad y detalle en el diseño",
        "Barniz protector anti-graffiti y UV",
      ],
    },
    {
      category: "Murals",
      name: "Gran Formato Exterior",
      price: 1200,
      imageUrl: "/images/sancho-abarca.webp",
      description:
        "Proyectos de gran escala para un impacto urbano masivo (más de 10m²).",
      details: [
        "Todo del Paquete Mediano",
        "Superficie superior a 10 metros cuadrados",
        "Estudio del entorno y visibilidad",
        "Posibilidad de uso de andamios o elevador (coste extra a evaluar)",
      ],
    },
  ],
  /**
   * ============================================
   * IMÁGENES DE GALERÍAS
   * ============================================
   */
  galleryImages: {
    graphicDesign: [
      {
        id: 1,
        brand: "Rayo Lab",
        imageUrl: "/images/rayolab-bg.webp",
        description:
          "Nuestra marca es la base de todo lo que hacemos, definiendo quiénes somos y por qué existimos...",
      },
      {
        id: 2,
        brand: "Ivy",
        imageUrl: "/images/ivy-bg.webp",
        description:
          "Con este símbolo representamos nuestra singularidad, nuestro carácter, cultura y estilo como marca...",
      },
      {
        id: 3,
        brand: "Caribes",
        imageUrl: "/images/caribes-bg.webp",
        description:
          "Inspirados en las calles de Caracas. Observamos la sinergia entre el ciudadano y su transporte diario...",
      },
      {
        id: 4,
        brand: "Yujushapes",
        imageUrl: "/images/yujushapes-bg.webp",
        description:
          "Personaje que encarna la alegría y la pasión por el movimiento. Testigo silencioso de cada truco...",
      },
      {
        id: 5,
        brand: "Santoku",
        imageUrl: "/images/santoku.webp",
        description:
          "El logotipo del restaurante Santoku está inspirado en la icónica estampa japonesa La Gran Ola de Kanagawa...",
      },
    ],
    customClothing: [
      {
        id: 1,
        title: "Graffiti Wear",
        imageUrl: "/images/clothes-graff.webp",
        description: "Personalización con spray sobre tela.",
      },
      {
        id: 2,
        title: "Diseño en Muro",
        imageUrl: "/images/clothes-wall.webp",
        description: "El arte de la pared a tu ropa.",
      },
      {
        id: 3,
        title: "Texturas Urbanas",
        imageUrl: "/images/clothes.webp",
        description: "Capas de arte y moda.",
      },
      {
        id: 4,
        title: "Rayo Lab Merch",
        imageUrl: "/images/rayolab-gorra.webp",
        description: "Gorras con estilo.",
      },
      {
        id: 5,
        title: "Bolsa Rayo Lab",
        imageUrl: "/images/rayolab-bolsa.webp",
        description: "Lleva el arte contigo.",
      },
      {
        id: 6,
        title: "Copa Rayo Lab",
        imageUrl: "/images/rayolab-copa.webp",
        description: "Hasta en tu café.",
      },
    ],
    murals: [
      {
        id: 1,
        title: "This is Goiko",
        imageUrl: "/images/goiko.webp",
        description: "Un mural vibrante para un restaurante icónico.",
      },
      {
        id: 2,
        title: "Chavela Taco Masters",
        imageUrl: "/images/chavela.webp",
        description: "Arte que abre el apetito.",
      },
      {
        id: 3,
        title: "Con Las Manos",
        imageUrl: "/images/manos-pizza.webp",
        description: "Pizzería con un toque radical.",
      },
      {
        id: 4,
        title: "Media Luna",
        imageUrl: "/images/media-luna.webp",
        description: "Decoración navideña en cristalera.",
      },
      {
        id: 5,
        title: "El Refugio, Madrid",
        imageUrl: "/images/el-refugio.webp",
        description: "La mirada del lobo en un refugio de montaña.",
      },
      {
        id: 6,
        title: "Sancho Abarca, Zaragoza",
        imageUrl: "/images/sancho-abarca.webp",
        description: "Un zorro lleno de color en el paisaje de Zaragoza.",
      },
    ],
  },
}; 
