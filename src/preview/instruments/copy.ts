import type { Text } from '../content';
import type { InstrumentId } from './model';
interface Copy {
  title: Text;
  object: Text;
  caption: Text;
  hint: Text;
  details: readonly [Text, Text, Text];
}
export const copy: Record<InstrumentId, Copy> = {
  superpowered: {
    title: ['One playback API. Two native bridges.', 'Una API de audio. Dos puentes nativos.'],
    object: ['Native audio test bench', 'Banco de pruebas de audio nativo'],
    hint: [
      'Switch platforms. Compare the Android test entry.',
      'Cambia de plataforma. Compara la entrada de prueba de Android.',
    ],
    caption: [
      'Two native sockets connect a React Native playback API to the same Superpowered C++ core. The scope illustrates audio output; it is not a benchmark.',
      'Dos conectores nativos unen una API de React Native con el mismo núcleo C++ de Superpowered. El osciloscopio ilustra la salida de audio; no es un benchmark.',
    ],
    details: [
      [
        'Exposed one JavaScript playback API in React Native. This work was a freelance engagement with Thumbjive for Jiveworld in September–October 2018, before Lupa’s 2019 public launch.',
        'Expuse una API de reproducción JavaScript en React Native. Fue un trabajo freelance con Thumbjive para Jiveworld en septiembre–octubre de 2018, antes del lanzamiento público de Lupa en 2019.',
      ],
      [
        'Android used Java/JNI built with the Android NDK; iOS used an Objective-C module. Both bridged to the Superpowered C++ audio SDK. This historical integration does not imply JSI or TurboModules.',
        'Android usaba Java/JNI con Android NDK; iOS usaba un módulo Objective-C. Ambos conectaban con el SDK de audio C++ Superpowered. Esta integración histórica no implica JSI ni TurboModules.',
      ],
      [
        'Built a standalone Java Android test app over the same JNI layer and a React Native demo for a like-for-like playback comparison. Select the native-only harness to bypass React Native in the diagram. No measured speedup or exact shipped binary is claimed.',
        'Desarrollé una app de prueba Java en Android sobre la misma capa JNI y una demo React Native para comparar la reproducción en condiciones equivalentes. La prueba nativa omite React Native en el diagrama. No se afirma una mejora medida ni un binario publicado concreto.',
      ],
    ],
  },
  puramente: {
    title: ['A session, ready wherever you are.', 'Una sesión, estés donde estés.'],
    object: ['Two-channel audio console', 'Consola de audio de dos canales'],
    hint: [
      'Try offline mode, then adjust the two faders.',
      'Prueba el modo offline y ajusta los dos faders.',
    ],
    caption: [
      'Two reels and independent faders feed a waveform monitor on an audio deck. Access and downloaded-source indicators select the session source. Faders represent narration and background levels. The small completion pad represents the optional HealthKit integration.',
      'Dos carretes y faders independientes alimentan un monitor de ondas. Los indicadores de acceso y descarga seleccionan la fuente de la sesión. Los faders representan narración y fondo. La placa de finalización representa la integración opcional con HealthKit.',
    ],
    details: [
      [
        'React Navigation organizes the mobile journey. The access cartridge illustrates premium eligibility; Firebase and RevenueCat supported the subscription product, while React Admin tools managed premium access. Exact production validation and offline entitlement policies are not reconstructed here.',
        'React Navigation organiza el recorrido móvil. El cartucho ilustra la elegibilidad premium; Firebase y RevenueCat apoyaban el producto por suscripción, y React Admin gestionaba el acceso premium. No se reconstruyen la validación ni las políticas offline de producción.',
      ],
      [
        'Narration and background audio remain separate channels. Move either level to move its fader independently. With the network off, this example requires a downloaded session; a missing download blocks playback before the head.',
        'La narración y el audio de fondo son canales separados. Cada nivel mueve su fader de forma independiente. Sin red, el ejemplo requiere una sesión descargada; si falta, la reproducción se detiene antes del cabezal.',
      ],
      [
        'The playback head represents the mobile audio experience, including background playback. HealthKit is a separate, optional completion integration. This switch illustrates that responsibility without requesting permission, writing records or claiming a health outcome.',
        'El cabezal representa el audio móvil, incluida la reproducción en segundo plano. HealthKit es una integración opcional y separada para la finalización. El control ilustra esa responsabilidad sin pedir permisos, escribir registros ni afirmar beneficios de salud.',
      ],
    ],
  },
  boom: {
    title: ['Change the format. Keep the foundation.', 'Cambia el formato. Conserva la base.'],
    object: ['Game-format arcade cabinet', 'Máquina arcade de formatos de juego'],
    hint: [
      'Choose a cartridge and follow its configuration.',
      'Elige un cartucho y sigue su configuración.',
    ],
    caption: [
      'A single arcade cabinet switches its screen between a quiz, prediction curve and poll. Its latched controls represent the chosen format; the admin slot represents managed game data. Example formats and selections are fictional.',
      'Una máquina arcade cambia su pantalla entre preguntas, curva de predicción y encuesta. Los controles representan el formato elegido; la ranura representa los datos administrados. Los formatos y selecciones son ficticios.',
    ],
    details: [
      [
        'A React factory pattern selects a component for the requested format. Change the cartridge: the illustrative component and configuration change together while the frame stays shared. React Native and Redux supported the broader client work.',
        'Un patrón factory en React selecciona un componente para el formato solicitado. Cambia el cartucho: el componente y la configuración ilustrativos cambian juntos, conservando el bastidor. React Native y Redux formaban parte del trabajo del cliente.',
      ],
      [
        'New formats and social features also require server logic and event handling. The screen carries a fictional selection across that boundary. The example illustrates an event responsibility without asserting a broker, delivery guarantee or production event schema.',
        'Los nuevos formatos y funciones sociales también requieren lógica de servidor y manejo de eventos. La pantalla lleva una selección ficticia a ese límite. El ejemplo ilustra la responsabilidad sin afirmar un broker, garantía de entrega ni esquema de producción.',
      ],
      [
        'The internal admin tool managed game client data structures stored in MongoDB. Edit the title to inspect the configuration; an empty title stays a draft in this example. No production write occurs, and this local validation rule is illustrative.',
        'La herramienta interna administraba estructuras del cliente guardadas en MongoDB. Edita el título para inspeccionar la configuración; un título vacío conserva el borrador del ejemplo. No se escribe en producción y esta validación es ilustrativa.',
      ],
    ],
  },
  seen: {
    title: [
      'Different providers. One readable score.',
      'Distintos proveedores. Un mismo marcador.',
    ],
    object: ['Cache archive & adapter desk', 'Archivador de caché y mesa de adaptadores'],
    hint: [
      'Switch the cache and provider, then reveal the score.',
      'Cambia la caché y el proveedor; revela el marcador.',
    ],
    caption: [
      'Cache drawers slide open to reuse data; provider adapters normalize a cache miss on a separate desk before the score tray. A cache hit reuses the common response; a miss needs an adapter. Privacy shutters represent Spoiler Shield. The account module is a supporting path.',
      'Los cajones de caché abren para reutilizar datos; una mesa separada normaliza los fallos de caché antes de la bandeja de resultados. Un acierto reutiliza la respuesta común; un fallo requiere un adaptador. Las cubiertas representan Spoiler Shield. El módulo de cuenta es una ruta de apoyo.',
    ],
    details: [
      [
        'The Expo app requests scores and league data from the Workers backend. Supabase holds account and follow data used for personalization; it is not a mandatory stage of every score request. Try Follow a team to illuminate the supporting account module.',
        'La app Expo solicita resultados y ligas al backend en Workers. Supabase almacena cuentas y seguimientos para personalizar; no es una etapa obligatoria de cada consulta. Prueba Seguir un equipo para iluminar ese módulo de apoyo.',
      ],
      [
        'A cache hit returns an already normalized response and skips the provider. On a miss, a provider adapter maps its own shape to the shared contract. The cabinet simplifies short-lived memory/Cache API and longer-lived KV storage; these controls do not simulate production TTLs.',
        'Un acierto devuelve una respuesta ya normalizada sin consultar al proveedor. Un fallo usa un adaptador para mapear su formato al contrato común. El archivador simplifica memoria/Cache API y KV; los controles no simulan los TTL de producción.',
      ],
      [
        'Both fictional providers produce the same match shape. Spoiler Shield changes what the app reveals, not what the backend retrieves. The separate notification path uses per-league Durable Objects and OneSignal; it is not a required step in this score response.',
        'Los dos proveedores ficticios producen el mismo formato de partido. Spoiler Shield cambia lo que revela la app, no lo que obtiene el backend. La ruta separada de notificaciones usa Durable Objects por liga y OneSignal; no es una etapa requerida para esta respuesta.',
      ],
    ],
  },
  mcp: {
    title: ['One entrance. Shared tools.', 'Una entrada. Herramientas compartidas.'],
    object: ['Shared-access patch rack', 'Rack de conexiones compartidas'],
    hint: [
      'Change the session and route a tool through the rack.',
      'Cambia la sesión y conecta una herramienta en el rack.',
    ],
    caption: [
      'The rack shares one access shutter across three tool banks. Its optical monitor follows the selected route; SSO controls whether the shutter opens.',
      'El rack comparte una compuerta de acceso entre tres bancos de herramientas. Su monitor óptico muestra la ruta elegida; el SSO determina si la compuerta abre.',
    ],
    details: [
      [
        'Identity comes first. Try removing the session: the interaction stops before the shared gateway. This switch illustrates the access boundary; it does not perform authentication.',
        'Primero, la identidad. Quita la sesión: la interacción se detiene antes del gateway. Este control ilustra el límite de acceso; no autentica usuarios.',
      ],
      [
        'One common entry point replaces separate per-seat access. The shared rack stays the same when you choose a different example tool. The documented implementation used ContextForge and Terraform.',
        'Una entrada común reemplaza el acceso por usuario. El rack compartido sigue siendo el mismo al cambiar de herramienta. La implementación documentada usó ContextForge y Terraform.',
      ],
      [
        'The selected cartridge receives the interaction and its result returns through the shared entry point. Tool names and responses here are fictional; no production service is contacted.',
        'El cartucho seleccionado recibe la interacción y devuelve su resultado por la entrada compartida. Los nombres y respuestas son ficticios; no se consulta ningún servicio de producción.',
      ],
    ],
  },
  boards: {
    title: ['From a note to shared context.', 'De una nota al contexto compartido.'],
    object: ['Composing press', 'Prensa de composición'],
    hint: [
      'Compose a note, choose its audience, then advance.',
      'Crea una nota, elige su audiencia y avanza.',
    ],
    caption: [
      'The note plate travels on a composing press. Type blocks represent rich content, the press fixture represents the GraphQL contract, and the receiving tray represents stored notes. Member clips show the example sharing audience.',
      'La placa de la nota recorre una prensa. Los bloques representan contenido enriquecido, el soporte central representa el contrato GraphQL y la bandeja representa las notas guardadas. Las pinzas muestran la audiencia del ejemplo.',
    ],
    details: [
      [
        'Rich text, images, Markdown and links belong to the same note experience. Select a type to change the plate engraving. The text field supplies a local example, not an upload or rich-text editor.',
        'Texto enriquecido, imágenes, Markdown y enlaces forman parte de la misma experiencia. El tipo cambia el grabado de la placa. El campo aporta un ejemplo local, no una carga de archivos ni un editor enriquecido.',
      ],
      [
        'The interface and data contract meet here. Board items hold the content; board members are part of the collaboration model. The pins show the selected audience, without implying a particular permissions or synchronization protocol.',
        'Aquí se encuentran la interfaz y el contrato de datos. Los elementos contienen el contenido; los miembros forman parte del modelo colaborativo. Las pinzas muestran la audiencia sin implicar un protocolo concreto de permisos o sincronización.',
      ],
      [
        'The storage model preserves the note’s content for the product. The example below reflects the selected type, text and audience. This local walkthrough does not imply real-time editing or production persistence.',
        'El modelo de almacenamiento conserva el contenido. El ejemplo refleja el tipo, texto y audiencia elegidos. Este recorrido local no implica edición en tiempo real ni persistencia en producción.',
      ],
    ],
  },
  graphql: {
    title: ['Ask for fields. Follow the contract.', 'Pide campos. Sigue el contrato.'],
    object: ['Schema loom', 'Telar de esquemas'],
    hint: [
      'Choose fields and watch the query and response agree.',
      'Elige campos y compara la consulta con su respuesta.',
    ],
    caption: [
      'Each selected thread represents one requested field. The moving reed gathers the selected strands into the response sockets. Counts describe this small example, not measured backend work.',
      'Cada hilo seleccionado representa un campo. El peine móvil reúne los hilos seleccionados en los receptáculos de respuesta. Los conteos describen este ejemplo, no trabajo medido del backend.',
    ],
    details: [
      [
        'The selection set defines the shape the client asks for. Toggle fields to change the actual example query. Members requests a nested selection of id and name.',
        'La selección define la forma que solicita el cliente. Cambia los campos para modificar la consulta del ejemplo. Members solicita id y name en una selección anidada.',
      ],
      [
        'The illuminated stations identify the selected Board fields. Schemas define the contract; resolvers supply the values. Station counts are not database query counts and do not assume batching, caching or a particular execution plan.',
        'Las estaciones iluminadas identifican los campos de Board. Los esquemas definen el contrato y los resolvers aportan los valores. Las estaciones no cuentan consultas de base de datos ni suponen batching, caché o un plan de ejecución.',
      ],
      [
        'The example response includes exactly the selected fields. The documented 15% federated-query performance improvement belongs to separate GraphQL work; this instrument does not reconstruct that benchmark or attribute it to Boards.',
        'La respuesta incluye exactamente los campos seleccionados. La mejora documentada del 15% en consultas federadas pertenece a otro trabajo de GraphQL; el instrumento no reconstruye ese benchmark ni lo atribuye a Boards.',
      ],
    ],
  },
};
