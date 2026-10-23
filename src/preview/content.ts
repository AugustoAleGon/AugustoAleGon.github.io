import type { ProjectId } from '../content/projects';

export type Text = readonly [en: string, es: string];
export type Step = { title: Text; detail: Text };
export interface Story {
  id: string;
  company: string;
  title: Text;
  summary: Text;
  work: Text[];
  result: Text;
  stack: string[];
  steps: [Step, Step, Step];
}

export const stories: Story[] = [
  {
    id: 'superpowered',
    company: 'Thumbjive · Jiveworld · Sep–Oct 2018',
    title: [
      'Taking React Native into a C++ audio core.',
      'De React Native a un núcleo de audio C++.',
    ],
    summary: [
      'A cross-platform Superpowered integration and Android test harnesses for comparing native playback with a React Native bridge.',
      'Integración de Superpowered en ambas plataformas y apps de prueba Android para comparar audio nativo con el puente de React Native.',
    ],
    work: [
      [
        'Bridged Superpowered into React Native with Java/JNI and the Android NDK on Android, and Objective-C on iOS.',
        'Integré Superpowered con React Native mediante Java/JNI y Android NDK en Android, y Objective-C en iOS.',
      ],
      [
        'Exposed one JavaScript playback API over a shared C++ core.',
        'Expuse una API JavaScript de reproducción sobre un núcleo C++ compartido.',
      ],
      [
        'Built a standalone Java Android test app and a React Native demo to compare playback over the same JNI layer.',
        'Desarrollé una app Java independiente y una demo React Native para comparar reproducción sobre la misma capa JNI.',
      ],
    ],
    result: [
      'Delivered the native-audio integration and comparison demos during a freelance engagement for the product that became Lupa. The work predates its 2019 public launch.',
      'Entregué la integración de audio nativo y las demos de comparación en un trabajo freelance para el producto que se convirtió en Lupa. El trabajo precede a su lanzamiento público en 2019.',
    ],
    stack: ['React Native', 'Superpowered', 'C++', 'Java', 'JNI', 'Android NDK', 'Objective-C'],
    steps: [
      {
        title: ['Playback entry', 'Entrada de reproducción'],
        detail: [
          'One JavaScript API starts the React Native playback path. Android also has a native-only test entry.',
          'Una API JavaScript inicia la ruta React Native. Android también tiene una entrada de prueba nativa.',
        ],
      },
      {
        title: ['Native boundary', 'Límite nativo'],
        detail: [
          'Java/JNI on Android or Objective-C on iOS connects the app to the shared SDK.',
          'Java/JNI en Android u Objective-C en iOS conectan la app con el SDK compartido.',
        ],
      },
      {
        title: ['Shared audio core', 'Núcleo de audio compartido'],
        detail: [
          'Superpowered processes playback in C++. The Android harness provides a comparison path through the same JNI layer.',
          'Superpowered procesa el audio en C++. La app de prueba Android ofrece una ruta de comparación por la misma capa JNI.',
        ],
      },
    ],
  },
  {
    id: 'puramente',
    company: 'Pura Mente · Side project',
    title: ['Meditation audio, online and offline.', 'Audio de meditación, con y sin conexión.'],
    summary: [
      'Connect narration, background audio and offline playback with the supporting subscription and native integrations.',
      'Conectar narración, audio de fondo y reproducción offline con las integraciones nativas y de suscripción.',
    ],
    work: [
      [
        'Worked on narration, background audio, offline playback and HealthKit.',
        'Trabajé en narración, audio de fondo, reproducción offline y HealthKit.',
      ],
      [
        'Migrated React Navigation and built React Admin tools for premium access, with Firebase and RevenueCat integrations.',
        'Migré React Navigation y desarrollé herramientas React Admin para acceso premium, con integraciones de Firebase y RevenueCat.',
      ],
    ],
    result: [
      'Contributed to the mobile playback experience and the tools supporting premium access, alongside my main roles.',
      'Contribuí a la reproducción móvil y las herramientas de acceso premium, en paralelo a mis roles principales.',
    ],
    stack: [
      'React Native',
      'React Navigation',
      'Firebase',
      'RevenueCat',
      'HealthKit',
      'React Admin',
    ],
    steps: [
      {
        title: ['Session & access', 'Sesión y acceso'],
        detail: [
          'The mobile journey selects a session; subscription tools support premium access.',
          'El recorrido móvil selecciona una sesión; las herramientas de suscripción apoyan el acceso premium.',
        ],
      },
      {
        title: ['Audio & offline', 'Audio y modo offline'],
        detail: [
          'Narration and background audio have separate levels. Downloaded content supports offline playback.',
          'La narración y el fondo tienen niveles separados. El contenido descargado permite la reproducción offline.',
        ],
      },
      {
        title: ['Playback & completion', 'Reproducción y finalización'],
        detail: [
          'Mobile playback carries the session. HealthKit supports an optional completion integration.',
          'La reproducción móvil desarrolla la sesión. HealthKit permite una integración opcional de finalización.',
        ],
      },
    ],
  },
  {
    id: 'mcp',
    company: 'Luxury Presence',
    title: ['A shared gateway for AI tools.', 'Un gateway compartido para herramientas de IA.'],
    summary: [
      'Replace a per-seat MCP service with an internal gateway protected by company SSO.',
      'Reemplazar un servicio MCP por usuario con un gateway interno protegido por el SSO de la empresa.',
    ],
    work: [
      [
        'Worked with a team of five on an internal gateway based on IBM ContextForge.',
        'Trabajé con un equipo de cinco en un gateway interno basado en IBM ContextForge.',
      ],
      [
        'Contributed to the SSO-protected replacement for MintMCP and its Terraform infrastructure.',
        'Contribuí al reemplazo de MintMCP protegido por SSO y a su infraestructura con Terraform.',
      ],
    ],
    result: [
      'Removed the vendor cost and per-seat limits. A shared internal entry point made tool access easier to manage.',
      'Eliminamos el costo del proveedor y los límites por usuario. Un punto de entrada interno facilitó la gestión del acceso.',
    ],
    stack: ['MCP', 'ContextForge', 'SSO', 'Terraform'],
    steps: [
      {
        title: ['Team access', 'Acceso del equipo'],
        detail: [
          'An internal user starts a tool interaction. Company SSO protects access to the gateway.',
          'Un usuario interno inicia una interacción. El SSO de la empresa protege el acceso al gateway.',
        ],
      },
      {
        title: ['MCP gateway', 'Gateway MCP'],
        detail: [
          'The internal ContextForge-based gateway is the shared access point for MCP tools.',
          'El gateway interno basado en ContextForge es el punto de acceso compartido a herramientas MCP.',
        ],
      },
      {
        title: ['Tool interaction', 'Interacción con herramientas'],
        detail: [
          'The tool interaction returns through the shared gateway. This is a conceptual view, not a deployment map.',
          'La interacción retorna por el gateway compartido. Es una vista conceptual, no un mapa de despliegue.',
        ],
      },
    ],
  },
  {
    id: 'boards',
    company: 'Luxury Presence',
    title: ['Boards that people can work on together.', 'Boards para trabajar en equipo.'],
    summary: [
      'Bring collaborative notes and sharing into the product, from the interface to its data model.',
      'Integrar notas colaborativas y contenido compartido, desde la interfaz hasta el modelo de datos.',
    ],
    work: [
      [
        'Built Notes on Boards with rich text, images, Markdown and links, including the note storage model.',
        'Desarrollé Notes on Boards con texto enriquecido, imágenes, Markdown y enlaces, incluido su modelo de almacenamiento.',
      ],
      [
        'Worked on sharing from product design through release, and GraphQL schemas and resolvers for board items and members.',
        'Trabajé en contenido compartido desde el diseño hasta el lanzamiento, y en esquemas y resolvers GraphQL para elementos y miembros.',
      ],
    ],
    result: [
      'Delivered a collaboration feature across product, frontend and backend concerns.',
      'Entregué una función de colaboración que abarca producto, frontend y backend.',
    ],
    stack: ['React', 'React Native', 'GraphQL', 'Rich text'],
    steps: [
      {
        title: ['Compose & share', 'Crear y compartir'],
        detail: [
          'The interface supports notes, rich content and sharing interactions.',
          'La interfaz permite crear notas, contenido enriquecido e interacciones para compartir.',
        ],
      },
      {
        title: ['Schema & resolvers', 'Esquema y resolvers'],
        detail: [
          'GraphQL work covers board items and board members.',
          'El trabajo en GraphQL abarca elementos y miembros de los boards.',
        ],
      },
      {
        title: ['Stored content', 'Contenido guardado'],
        detail: [
          'The note storage model preserves the content used by the product.',
          'El modelo de almacenamiento conserva el contenido que usa el producto.',
        ],
      },
    ],
  },
  {
    id: 'graphql',
    company: 'Luxury Presence',
    title: ['GraphQL beyond the client.', 'GraphQL más allá del cliente.'],
    summary: [
      'Work across API contracts, resolvers and query performance.',
      'Trabajar en contratos de API, resolvers y rendimiento de consultas.',
    ],
    work: [
      [
        'Contributed schemas and resolvers for Boards items and members.',
        'Contribuí esquemas y resolvers para elementos y miembros de Boards.',
      ],
      [
        'Improved federated query performance by 15% in separate GraphQL work documented in my CV.',
        'Mejoré un 15% el rendimiento de consultas federadas en otro trabajo de GraphQL documentado en mi CV.',
      ],
    ],
    result: [
      'Experience on both sides of the API boundary: consuming data and shaping the contract that serves it.',
      'Experiencia en ambos lados de la API: consumir datos y definir el contrato que los entrega.',
    ],
    stack: ['GraphQL', 'Schemas', 'Resolvers', 'Query performance'],
    steps: [
      {
        title: ['Client query', 'Consulta del cliente'],
        detail: [
          'The client requests the fields it needs through a GraphQL contract.',
          'El cliente solicita los campos que necesita mediante un contrato GraphQL.',
        ],
      },
      {
        title: ['Resolver work', 'Trabajo en resolvers'],
        detail: [
          'Schemas and resolvers support board item and member operations.',
          'Los esquemas y resolvers soportan operaciones sobre elementos y miembros de los boards.',
        ],
      },
      {
        title: ['Response', 'Respuesta'],
        detail: [
          'Query performance is part of backend ownership. The 15% improvement is not attributed specifically to Boards.',
          'El rendimiento también es responsabilidad del backend. La mejora del 15% no se atribuye específicamente a Boards.',
        ],
      },
    ],
  },
  {
    id: 'events',
    company: 'SteadyMD',
    title: ['Keep slow work out of the request.', 'Separar el trabajo lento de la solicitud.'],
    summary: [
      'Move report generation into background jobs so it does not interrupt the admin application.',
      'Mover la generación de reportes a tareas en segundo plano para no interrumpir la aplicación de administración.',
    ],
    work: [
      [
        'Used BullMQ to move report generation into background processing and prevent admin outages.',
        'Usé BullMQ para mover la generación de reportes a segundo plano y evitar caídas del administrador.',
      ],
      [
        'Also worked with SNS/SQS events, Node.js integrations and Redis Pub/Sub between services.',
        'También trabajé con eventos SNS/SQS, integraciones Node.js y Redis Pub/Sub entre servicios.',
      ],
    ],
    result: [
      'Separated slow report work from interactive admin requests. SNS/SQS and Redis Pub/Sub were additional event-driven work, not one combined pipeline.',
      'Separé los reportes lentos de las solicitudes interactivas. SNS/SQS y Redis Pub/Sub fueron otros trabajos con eventos, no un único pipeline.',
    ],
    stack: ['Node.js', 'BullMQ', 'SNS / SQS', 'Redis'],
    steps: [
      {
        title: ['Request a report', 'Solicitar un reporte'],
        detail: [
          'The admin application needs a report without doing the slow work in its request path.',
          'El administrador necesita un reporte sin ejecutar el trabajo lento dentro de la solicitud.',
        ],
      },
      {
        title: ['Queue the work', 'Encolar el trabajo'],
        detail: [
          'BullMQ moves report generation into background jobs.',
          'BullMQ mueve la generación de reportes a tareas en segundo plano.',
        ],
      },
      {
        title: ['Process in background', 'Procesar en segundo plano'],
        detail: [
          'Report generation runs separately, protecting the interactive admin application.',
          'La generación se ejecuta por separado para proteger la aplicación interactiva.',
        ],
      },
    ],
  },
  {
    id: 'seen',
    company: 'Seen · Freelance',
    title: [
      'From sports data to a mobile experience.',
      'De los datos deportivos a la experiencia móvil.',
    ],
    summary: [
      'Build the React Native application and backend for a women’s sports product.',
      'Desarrollar la aplicación React Native y el backend de un producto de deportes femeninos.',
    ],
    work: [
      [
        'Built the Expo app with scores, leagues, a feed and Spoiler Shield.',
        'Desarrollé la app Expo con resultados, ligas, un feed y Spoiler Shield.',
      ],
      [
        'Built provider adapters, normalized responses and caching on Cloudflare Workers, with Supabase for accounts and follows.',
        'Desarrollé adaptadores de proveedores, respuestas normalizadas y caché en Cloudflare Workers, con Supabase para cuentas y seguimientos.',
      ],
    ],
    result: [
      'Delivered work across the mobile product and the backend that serves it.',
      'Entregué trabajo tanto en el producto móvil como en el backend que lo sirve.',
    ],
    stack: ['Expo', 'TypeScript', 'Cloudflare Workers', 'Supabase'],
    steps: [
      {
        title: ['Mobile request', 'Solicitud móvil'],
        detail: [
          'The app requests scores and league data. Spoiler Shield controls what the viewer reveals.',
          'La app solicita resultados y ligas. Spoiler Shield controla qué revela el usuario.',
        ],
      },
      {
        title: ['Cache & adapters', 'Caché y adaptadores'],
        detail: [
          'Workers check cached data and use provider adapters when fresh data is needed.',
          'Workers consulta la caché y usa adaptadores de proveedores cuando necesita datos nuevos.',
        ],
      },
      {
        title: ['Normalized response', 'Respuesta normalizada'],
        detail: [
          'A common response shape lets the app present data from different providers consistently.',
          'Un formato común permite que la app presente de forma consistente datos de distintos proveedores.',
        ],
      },
    ],
  },
  {
    id: 'boom',
    company: 'Boom Entertainment',
    title: ['New games across the stack.', 'Nuevos juegos en todo el stack.'],
    summary: [
      'Extend game formats and social features through the client, server, events and storage.',
      'Extender formatos de juego y funciones sociales en cliente, servidor, eventos y almacenamiento.',
    ],
    work: [
      [
        'Used a React factory pattern to make new game formats extensible.',
        'Usé un patrón factory en React para extender los formatos de juego.',
      ],
      [
        'Worked on an internal admin tool that managed game client data structures stored in MongoDB.',
        'Trabajé en una herramienta interna para administrar estructuras de datos de juegos guardadas en MongoDB.',
      ],
    ],
    result: [
      'Connected the product interface with the server and data changes needed to support new formats.',
      'Conecté la interfaz con los cambios de servidor y datos necesarios para soportar nuevos formatos.',
    ],
    stack: ['React', 'React Native', 'Redux', 'MongoDB'],
    steps: [
      {
        title: ['Game format', 'Formato de juego'],
        detail: [
          'React components extend the presentation of new game formats.',
          'Los componentes React extienden la presentación de nuevos formatos.',
        ],
      },
      {
        title: ['Server & events', 'Servidor y eventos'],
        detail: [
          'Changes span server logic and event handling as well as the client.',
          'Los cambios abarcan lógica de servidor y eventos, además del cliente.',
        ],
      },
      {
        title: ['Game data', 'Datos del juego'],
        detail: [
          'Internal administration manages game data structures stored in MongoDB.',
          'La administración interna gestiona estructuras de datos guardadas en MongoDB.',
        ],
      },
    ],
  },
];

export const brands: Record<ProjectId, string> = {
  luxury: '/brands/luxury-presence.jpg',
  seen: '/brands/seen.jpg',
  steadymd: '/brands/steadymd.png',
  puramente: '/brands/pura-mente.jpg',
};

export const mobileCopy: Record<ProjectId, { type: Text; summary: Text; work: Text[] }> = {
  seen: {
    type: ['Sports', 'Deportes'],
    summary: [
      'Women’s sports, from the score to the story.',
      'Deportes femeninos, del resultado a la historia.',
    ],
    work: [
      ['Built the mobile application and backend.', 'Desarrollé la aplicación móvil y el backend.'],
      [
        'Scores, leagues, feed and Spoiler Shield in React Native and Expo.',
        'Resultados, ligas, feed y Spoiler Shield con React Native y Expo.',
      ],
      [
        'Provider adapters, caching, accounts and follows.',
        'Adaptadores de proveedores, caché, cuentas y seguimientos.',
      ],
    ],
  },
  luxury: {
    type: ['Real estate', 'Bienes raíces'],
    summary: [
      'Tools for agents, built for the way they work.',
      'Herramientas para la forma de trabajar de los agentes.',
    ],
    work: [
      [
        'Worked on React Native and Expo architecture, screens and state management.',
        'Trabajé en arquitectura, pantallas y estado con React Native y Expo.',
      ],
      [
        'Built rich notes on Boards and sharing flows, including GraphQL work.',
        'Desarrollé notas enriquecidas y flujos para compartir, incluido trabajo en GraphQL.',
      ],
      [
        'Mentored two web engineers moving into mobile development.',
        'Guié a dos ingenieros web en su transición a desarrollo móvil.',
      ],
    ],
  },
  steadymd: {
    type: ['Healthcare', 'Salud'],
    summary: [
      'A reliable connection between patients and clinicians.',
      'Una conexión confiable entre pacientes y profesionales.',
    ],
    work: [
      [
        'Led mobile work on a white-label app based on Rocket.Chat.',
        'Lideré trabajo móvil en una app de marca blanca basada en Rocket.Chat.',
      ],
      [
        'WebSocket messaging, Realm offline persistence and push notifications.',
        'Mensajería WebSocket, persistencia offline con Realm y notificaciones push.',
      ],
      [
        'Supported a product with over one million cumulative messages and 100+ clinicians.',
        'Contribuí a un producto con más de un millón de mensajes acumulados y más de 100 profesionales.',
      ],
    ],
  },
  puramente: {
    type: ['Wellbeing', 'Bienestar'],
    summary: [
      'Make room for a daily meditation practice.',
      'Crear espacio para una práctica diaria de meditación.',
    ],
    work: [
      [
        'Worked on narration and background audio, offline playback and HealthKit.',
        'Trabajé en narración y audio de fondo, reproducción offline y HealthKit.',
      ],
      [
        'Migrated React Navigation and built React Admin tools for premium access.',
        'Migré React Navigation y desarrollé herramientas React Admin para acceso premium.',
      ],
      [
        'Integrated Firebase and RevenueCat in a side project alongside my main role.',
        'Integré Firebase y RevenueCat en un proyecto paralelo a mi trabajo principal.',
      ],
    ],
  },
};
