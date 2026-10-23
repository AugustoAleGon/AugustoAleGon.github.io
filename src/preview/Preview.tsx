import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import ThemeToggle from '../components/ThemeToggle';
import LoadBoundary from '../components/LoadBoundary';
import { projects, type ProjectId } from '../content/projects';
import { brands, mobileCopy, stories, type Story, type Text } from './content';
import s from './Preview.module.css';

const Architecture = lazy(() => import('./Architecture'));
const demos = {
  seen: lazy(() => import('../demos/Seen')),
  luxury: lazy(() => import('../demos/Luxury')),
  steadymd: lazy(() => import('../demos/Chat')),
  puramente: lazy(() => import('../demos/Meditation')),
};
function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
const snapshot = () => window.location.hash;
type Translate = (text: Text) => string;

function SocialLinks({ tr, footer = false }: { tr: Translate; footer?: boolean }) {
  return (
    <nav
      className={s.socialLinks}
      aria-label={tr(
        footer
          ? ['Footer social profiles', 'Perfiles sociales del pie de página']
          : ['Social profiles', 'Perfiles sociales'],
      )}
    >
      <a href="https://www.linkedin.com/in/augustoalegon" target="_blank" rel="noreferrer">
        LinkedIn <Icon name="external" size={14} />
      </a>
      <a href="https://github.com/augustoalegon" target="_blank" rel="noreferrer">
        GitHub <Icon name="external" size={14} />
      </a>
    </nav>
  );
}

function Mark({ kind }: { kind: 'web' | 'chain' | 'phone' | 'work' }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {kind === 'web' ? (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 9h18M7 6.5h.01M10 6.5h.01m-1 6-3 2 3 2m6-4 3 2-3 2" />
        </>
      ) : kind === 'chain' ? (
        <>
          <path d="m9 15 6-6m-4-3 2-2a4 4 0 0 1 6 6l-3 3m-5-2-3 3a4 4 0 0 0 6 6l2-2" />
        </>
      ) : kind === 'phone' ? (
        <>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M10 5h4m-3 14h2" />
        </>
      ) : (
        <>
          <rect x="3" y="7" width="18" height="14" rx="2" />
          <path d="M8 7V4h8v3M3 12h18m-10 0v3h2v-3" />
        </>
      )}
    </svg>
  );
}
function Brand({ id, large = false }: { id: ProjectId; large?: boolean }) {
  return (
    <img
      className={large ? s.largeBrand : s.brand}
      src={brands[id]}
      alt=""
      width={large ? 72 : 40}
      height={large ? 72 : 40}
    />
  );
}
function StoryLink({ id, tr, label }: { id: string; tr: Translate; label: Text }) {
  return (
    <a className={s.storyLink} href={`#story/${id}`}>
      <span>{tr(label)}</span>
      <Icon name="arrow" size={17} />
    </a>
  );
}
function Career({ tr }: { tr: Translate }) {
  return (
    <section className={s.career} id="career" aria-labelledby="career-title">
      <div className={s.sectionIntro}>
        <h2 id="career-title">{tr(['Experience', 'Experiencia'])}</h2>
        <p>
          {tr([
            'The roles. The work. How it fits together.',
            'Los roles. El trabajo. Cómo se conecta.',
          ])}
        </p>
      </div>
      <div className={s.timeline}>
        <article className={s.role}>
          <div className={s.roleHeading}>
            <Brand id="luxury" />
            <div>
              <h3>Luxury Presence</h3>
              <p>{tr(['Senior Software Engineer', 'Ingeniero de software senior'])}</p>
            </div>
          </div>
          <p className={s.period}>{tr(['Nov 2022 — Present', 'Nov 2022 — Actualidad'])}</p>
          <p>
            {tr([
              'Building across mobile, collaborative interfaces, backend services and internal AI tooling.',
              'Desarrollo móvil, interfaces colaborativas, servicios backend y herramientas internas de IA.',
            ])}
          </p>
          <div className={s.contributionLinks}>
            <StoryLink id="mcp" tr={tr} label={['MCP gateway & SSO', 'Gateway MCP y SSO']} />
            <StoryLink
              id="boards"
              tr={tr}
              label={['Boards collaboration', 'Colaboración en Boards']}
            />
            <StoryLink
              id="graphql"
              tr={tr}
              label={['GraphQL schemas & performance', 'Esquemas GraphQL y rendimiento']}
            />
          </div>
          <a className={s.quietLink} href="#mobile/luxury">
            <Mark kind="phone" />
            {tr(['Explore mobile work', 'Explorar trabajo móvil'])}
            <Icon name="arrow" size={15} />
          </a>
        </article>
        <article className={s.role}>
          <div className={s.roleHeading}>
            <span className={s.roleSymbol}>
              <Mark kind="work" />
            </span>
            <div>
              <h3>Boom Entertainment</h3>
              <p>{tr(['Software Engineer', 'Ingeniero de software'])}</p>
            </div>
          </div>
          <p className={s.period}>{tr(['Apr — Nov 2022', 'Abr — Nov 2022'])}</p>
          <p>
            {tr([
              'Game formats and social features across the client, server, events and data.',
              'Formatos de juego y funciones sociales en cliente, servidor, eventos y datos.',
            ])}
          </p>
          <div className={s.contributionLinks}>
            <StoryLink
              id="boom"
              tr={tr}
              label={['Extending games across the stack', 'Extender juegos en todo el stack']}
            />
          </div>
        </article>
        <article className={s.role}>
          <div className={s.roleHeading}>
            <Brand id="steadymd" />
            <div>
              <h3>SteadyMD</h3>
              <p>{tr(['Software Engineer', 'Ingeniero de software'])}</p>
            </div>
          </div>
          <p className={s.period}>{tr(['Nov 2018 — Apr 2022', 'Nov 2018 — Abr 2022'])}</p>
          <p>
            {tr([
              'Patient messaging, a growing mobile team, and backend work that kept care moving.',
              'Mensajería para pacientes, un equipo móvil en crecimiento y un backend al servicio de la atención.',
            ])}
          </p>
          <div className={s.contributionLinks}>
            <StoryLink
              id="events"
              tr={tr}
              label={[
                'Background jobs & event-driven systems',
                'Tareas en segundo plano y sistemas con eventos',
              ]}
            />
          </div>
          <a className={s.quietLink} href="#mobile/steadymd">
            <Mark kind="phone" />
            {tr(['Explore mobile work', 'Explorar trabajo móvil'])}
            <Icon name="arrow" size={15} />
          </a>
        </article>
        <article className={s.role}>
          <div className={s.roleHeading}>
            <Brand id="puramente" />
            <div>
              <h3>Pura Mente</h3>
              <p>{tr(['React Native · Side project', 'React Native · Proyecto paralelo'])}</p>
            </div>
          </div>
          <p className={s.period}>
            {tr([
              'Oct 2020 — Aug 2022 · Alongside my main roles',
              'Oct 2020 — Ago 2022 · En paralelo a mis roles principales',
            ])}
          </p>
          <p>
            {tr([
              'Meditation audio, offline playback and tools for a subscription product.',
              'Audio para meditación, reproducción offline y herramientas para un producto por suscripción.',
            ])}
          </p>
          <div className={s.contributionLinks}>
            <StoryLink
              id="puramente"
              tr={tr}
              label={[
                'Audio, offline playback & premium access',
                'Audio, modo offline y acceso premium',
              ]}
            />
          </div>
          <a className={s.quietLink} href="#mobile/puramente">
            <Mark kind="phone" />
            {tr(['Explore the contribution', 'Explorar la contribución'])}
            <Icon name="arrow" size={15} />
          </a>
        </article>
        <details className={s.earlier}>
          <summary>
            {tr(['Earlier experience · 2016–2018', 'Experiencia anterior · 2016–2018'])}
            <Icon name="plus" size={17} />
          </summary>
          <ul>
            <li>
              <a href="#story/superpowered">
                Thumbjive / Jiveworld <span>Superpowered · React Native · 2018</span>
              </a>
            </li>
            <li>
              Nativapps <span>React Native · 2018</span>
            </li>
            <li>
              Qrosity <span>React Native · 2017–2018</span>
            </li>
            <li>
              Inkitt <span>React Native · 2017</span>
            </li>
            <li>
              Petcheck <span>React · 2017</span>
            </li>
            <li>
              Tumotorizado <span>React Native · 2017</span>
            </li>
            <li>
              SoSystem <span>Frontend · 2016</span>
            </li>
          </ul>
        </details>
      </div>
      <article className={s.freelance}>
        <div className={s.roleHeading}>
          <Brand id="seen" />
          <div>
            <h3>Seen</h3>
            <p>{tr(['Freelance · Mobile & backend', 'Freelance · Móvil y backend'])}</p>
          </div>
        </div>
        <p>
          {tr([
            'A women’s sports product I built across the app and API.',
            'Un producto de deportes femeninos que desarrollé desde la app hasta la API.',
          ])}
        </p>
        <StoryLink
          id="seen"
          tr={tr}
          label={['Explore the full-stack work', 'Explorar el trabajo full-stack']}
        />
      </article>
    </section>
  );
}

function Home({ tr }: { tr: Translate }) {
  return (
    <>
      <div className={s.opening}>
        <section className={s.identity} aria-labelledby="intro-title">
          <h1 id="intro-title">
            Augusto
            <br />
            Gonzalez<span>.</span>
          </h1>
          <p className={s.position}>
            {tr(['Full-stack engineer.', 'Ingeniero full-stack.'])}
            <br />
            <span>{tr(['Deep roots in mobile.', 'Con raíces en desarrollo móvil.'])}</span>
          </p>
          <img
            className={s.portrait}
            src="/images/augusto-gonzalez.jpeg"
            alt={tr(['Augusto Gonzalez', 'Augusto Gonzalez'])}
            width="1254"
            height="1254"
            fetchPriority="high"
          />
          <p className={s.introText}>
            {tr([
              'I work across the interface, the API and the systems behind them.',
              'Trabajo en la interfaz, la API y los sistemas que las conectan.',
            ])}{' '}
            <a href="#story/mcp">
              {tr(['Explore the MCP gateway', 'Explorar el gateway MCP'])}
              <Icon name="arrow" size={14} />
            </a>
          </p>
          <div className={s.identityActions}>
            <a href="#mobile">
              <Mark kind="phone" />
              {tr(['Open mobile workspace', 'Abrir espacio móvil'])}
              <Icon name="arrow" size={18} />
            </a>
            <a href="/cv/augusto-gonzalez-fullstack.pdf" target="_blank" rel="noreferrer">
              {tr(['Read my CV', 'Ver mi CV'])}
              <Icon name="external" size={15} />
            </a>
          </div>
          <SocialLinks tr={tr} />
        </section>
        <Career tr={tr} />
      </div>
      <section className={s.webSection} id="web" aria-labelledby="web-title">
        <div className={s.sectionHeading}>
          <h2 id="web-title">
            React. Next.js.
            <br />
            {tr(['The web, end to end.', 'La web, de principio a fin.'])}
          </h2>
          <p>
            {tr([
              'Interfaces that connect product decisions to the systems behind them.',
              'Interfaces que conectan las decisiones de producto con los sistemas que las sostienen.',
            ])}
          </p>
        </div>
        <div className={s.webRows}>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Admin platforms & SSR', 'Plataformas de administración y SSR'])}</h3>
              <p>
                {tr([
                  'React and Next.js admin work at Luxury Presence; Next.js and Redux Toolkit at SteadyMD.',
                  'Trabajo en administradores con React y Next.js en Luxury Presence; Next.js y Redux Toolkit en SteadyMD.',
                ])}
              </p>
            </div>
            <span>React / Next.js</span>
          </article>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Collaboration & API contracts', 'Colaboración y contratos de API'])}</h3>
              <p>
                {tr([
                  'Notes, sharing, board items and members. Product interactions connected to GraphQL schemas and resolvers.',
                  'Notas, contenido compartido, elementos y miembros. Interacciones conectadas con esquemas y resolvers GraphQL.',
                ])}
              </p>
              <a href="#story/boards">
                {tr(['Explore Boards', 'Explorar Boards'])}
                <Icon name="arrow" size={16} />
              </a>
            </div>
            <span>React / GraphQL</span>
          </article>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Components & confidence', 'Componentes y confianza'])}</h3>
              <p>
                {tr([
                  'Contributed to a React 19 design system library with Vitest, alongside work with Figma and product teams.',
                  'Contribuí a una biblioteca de diseño con React 19 y Vitest, además de colaborar con Figma y equipos de producto.',
                ])}
              </p>
            </div>
            <span>React 19 / Vitest</span>
          </article>
        </div>
        <div className={s.dataNote}>
          <h3>{tr(['Data & events', 'Datos y eventos'])}</h3>
          <p>
            {tr([
              'SNS/SQS, Redis Pub/Sub and background jobs at SteadyMD. Kafka and Debezium are also part of my documented data stack; a detailed CDC case study is still to come.',
              'SNS/SQS, Redis Pub/Sub y tareas en segundo plano en SteadyMD. Kafka y Debezium también forman parte de mi stack documentado; el caso detallado de CDC está pendiente.',
            ])}
          </p>
          <a href="#story/events">
            {tr(['Explore background processing', 'Explorar procesamiento en segundo plano'])}
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>
      <section className={s.webSection} id="ai" aria-labelledby="ai-title">
        <div className={s.sectionHeading}>
          <h2 id="ai-title">
            {tr(['AI, connected to real work.', 'IA conectada al trabajo real.'])}
          </h2>
          <p>
            {tr([
              'Tools, operational workflows and conversational product features. Applied work at Luxury Presence, alongside an academic model-serving project.',
              'Herramientas, flujos operativos y funciones conversacionales. Trabajo aplicado en Luxury Presence, junto a un proyecto académico de servicio de modelos.',
            ])}
          </p>
        </div>
        <div className={s.webRows}>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Shared access to AI tools', 'Acceso compartido a herramientas de IA'])}</h3>
              <p>
                {tr([
                  'Contributed to the internal ContextForge MCP gateway, protected by company SSO and provisioned with Terraform, in a team of five.',
                  'Contribuí al gateway MCP interno con ContextForge, SSO y Terraform, en un equipo de cinco.',
                ])}
              </p>
              <StoryLink
                id="mcp"
                tr={tr}
                label={['Explore the gateway architecture', 'Explorar la arquitectura del gateway']}
              />
            </div>
            <span>MCP / ContextForge</span>
          </article>
          <article>
            <Mark kind="work" />
            <div>
              <h3>{tr(['From alerts to actionable fixes', 'De alertas a correcciones'])}</h3>
              <p>
                {tr([
                  'Built agent-driven workflows that turn Datadog alerts into Linear tickets and open pull requests for straightforward fixes.',
                  'Desarrollé flujos con agentes que convierten alertas de Datadog en tickets de Linear y abren pull requests para correcciones sencillas.',
                ])}
              </p>
              <p className={s.projectType}>Datadog → Linear → Pull request</p>
            </div>
            <span>{tr(['Incident automation', 'Automatización de incidentes'])}</span>
          </article>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Actions through conversation', 'Acciones mediante conversación'])}</h3>
              <p>
                {tr([
                  'Worked on an OpenAI-powered chatbot in Notes, enabling users to perform saved searches and create new contacts through a conversational interface.',
                  'Trabajé en un chatbot de Notes con OpenAI, que permite ejecutar búsquedas guardadas y crear contactos mediante una interfaz conversacional.',
                ])}
              </p>
              <StoryLink
                id="boards"
                tr={tr}
                label={[
                  'Explore the Notes & Boards context',
                  'Explorar el contexto de Notes y Boards',
                ]}
              />
            </div>
            <span>OpenAI / Notes</span>
          </article>
          <article>
            <Mark kind="web" />
            <div>
              <h3>{tr(['Serving an NLP model', 'Servir un modelo de PLN'])}</h3>
              <p>
                {tr([
                  'Academic project: built a FastAPI REST service exposing a trained NLP model. Applications send raw text and receive model predictions over HTTP.',
                  'Proyecto académico: desarrollé un servicio REST con FastAPI que expone un modelo de PLN entrenado. Las aplicaciones envían texto y reciben predicciones por HTTP.',
                ])}
              </p>
            </div>
            <span>Python / FastAPI</span>
          </article>
        </div>
      </section>
      <section className={s.webSection} id="native-audio" aria-labelledby="native-audio-title">
        <div className={s.sectionHeading}>
          <h2 id="native-audio-title">
            {tr(['Across the native boundary.', 'Al otro lado del puente nativo.'])}
          </h2>
          <p>
            {tr([
              'Jiveworld · Freelance with Thumbjive · September–October 2018',
              'Jiveworld · Freelance con Thumbjive · Septiembre–octubre de 2018',
            ])}
          </p>
        </div>
        <div className={s.dataNote}>
          <h3>Superpowered + React Native</h3>
          <p>
            {tr([
              'One JavaScript playback API, two platform bridges and a shared C++ audio core. A native Android test app made it possible to compare playback with the React Native demo over the same JNI layer.',
              'Una API JavaScript de reproducción, dos puentes de plataforma y un núcleo de audio C++ compartido. Una app Android nativa permitía comparar la reproducción con la demo React Native sobre la misma capa JNI.',
            ])}
          </p>
          <StoryLink
            id="superpowered"
            tr={tr}
            label={['Explore the bridge architecture', 'Explorar la arquitectura del puente']}
          />
        </div>
      </section>
      <section className={s.web3Section} id="web3" aria-labelledby="web3-title">
        <div className={s.sectionHeading}>
          <h2 id="web3-title">{tr(['Web3, through building.', 'Web3, construyendo.'])}</h2>
          <p>
            {tr([
              'Personal and bootcamp projects that connect familiar frontend work to wallets, contracts and on-chain data.',
              'Proyectos personales y de bootcamp que conectan frontend con wallets, contratos y datos on-chain.',
            ])}
          </p>
        </div>
        <div className={s.web3Projects}>
          <article>
            <Mark kind="chain" />
            <h3>Celo Time-Lock Vault</h3>
            <p className={s.projectType}>
              {tr(['Personal project · 2025', 'Proyecto personal · 2025'])}
            </p>
            <p>
              {tr([
                'A Next.js App Router interface for wallet balances, simulated writes, transaction receipts and time-locked CELO. Solidity contracts and Foundry tests.',
                'Una interfaz Next.js App Router para balances, simulación de escritura, recibos y bloqueo temporal de CELO. Contratos Solidity y pruebas Foundry.',
              ])}
            </p>
            <div className={s.repoLinks}>
              <a
                href="https://github.com/AugustoAleGon/ui-time-lock-vault"
                target="_blank"
                rel="noreferrer"
              >
                {tr(['Frontend', 'Frontend'])}
                <Icon name="external" size={14} />
              </a>
              <a
                href="https://github.com/AugustoAleGon/time-lock-celo"
                target="_blank"
                rel="noreferrer"
              >
                {tr(['Contracts', 'Contratos'])}
                <Icon name="external" size={14} />
              </a>
            </div>
          </article>
          <article>
            <Mark kind="chain" />
            <h3>Uniswap Dashboard</h3>
            <p className={s.projectType}>
              {tr(['Personal project · 2025', 'Proyecto personal · 2025'])}
            </p>
            <p>
              {tr([
                'Next.js and GraphQL for pool queries, token balances and cumulative swaps, with refresh and error states.',
                'Next.js y GraphQL para consultar pools, balances de tokens y swaps acumulados, con estados de actualización y error.',
              ])}
            </p>
            <div className={s.repoLinks}>
              <a
                href="https://github.com/AugustoAleGon/uniswap-dashboard"
                target="_blank"
                rel="noreferrer"
              >
                {tr(['View source', 'Ver código'])}
                <Icon name="external" size={14} />
              </a>
            </div>
          </article>
          <article>
            <Mark kind="chain" />
            <h3>Avalanche NFT Minting</h3>
            <p className={s.projectType}>
              {tr(['Bootcamp project · 2024', 'Proyecto de bootcamp · 2024'])}
            </p>
            <p>
              {tr([
                'React, wagmi and viem for wallet interaction. Pinata/IPFS for metadata and an ERC-721 contract for minting.',
                'React, wagmi y viem para interactuar con wallets. Pinata/IPFS para metadatos y un contrato ERC-721 para minting.',
              ])}
            </p>
            <div className={s.repoLinks}>
              <a
                href="https://github.com/AugustoAleGon/avalanche-final-project"
                target="_blank"
                rel="noreferrer"
              >
                {tr(['View source', 'Ver código'])}
                <Icon name="external" size={14} />
              </a>
            </div>
          </article>
        </div>
      </section>
      <section className={s.learning}>
        <h2>
          {tr(['Still learning. Still building.', 'Seguir aprendiendo. Seguir construyendo.'])}
        </h2>
        <div>
          <p>
            {tr([
              'I want to go deeper into AI and Web3. My applied AI work includes an internal MCP gateway, incident automation and chatbot actions. My next step is to build on that experience with better tools and stronger systems.',
              'Quiero profundizar en IA y Web3. Mi trabajo aplicado en IA incluye un gateway MCP interno, automatización de incidentes y acciones de chatbot. Mi siguiente paso es construir sobre esa experiencia con mejores herramientas y sistemas más sólidos.',
            ])}
          </p>
          <a href="#story/mcp">
            {tr(['Explore the MCP gateway', 'Explorar el gateway MCP'])}
            <Icon name="arrow" size={17} />
          </a>
        </div>
      </section>
    </>
  );
}

function StoryPage({ story, tr }: { story: Story; tr: Translate }) {
  return (
    <article className={s.storyPage}>
      <a className={s.back} href="#career">
        <Icon name="back" size={18} />
        {tr(['Back to experience', 'Volver a experiencia'])}
      </a>
      <div className={s.storyHeader}>
        <h1>{tr(story.title)}</h1>
        <div>
          <p className={s.companyName}>{story.company}</p>
          <p>{tr(story.summary)}</p>
          <div className={s.stack}>
            {story.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </div>
      <LoadBoundary key={story.id}>
        <Suspense
          fallback={
            <output className={s.figureLoading}>
              {tr(['Loading the architecture…', 'Cargando la arquitectura…'])}
            </output>
          }
        >
          <Architecture key={story.id} story={story} tr={tr} />
        </Suspense>
      </LoadBoundary>
      <div className={s.storyDetail}>
        <section>
          <h2>{tr(['What I worked on', 'En qué trabajé'])}</h2>
          <ul>
            {story.work.map((work) => (
              <li key={work[0]}>{tr(work)}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{tr(['What changed', 'Qué cambió'])}</h2>
          <p>{tr(story.result)}</p>
        </section>
      </div>
    </article>
  );
}

function Mobile({ app, tr }: { app: ProjectId | undefined; tr: Translate }) {
  const [demo, setDemo] = useState(false);
  const project = projects.find((item) => item.id === app);
  const details = app ? mobileCopy[app] : undefined;
  const Demo = app ? demos[app] : null;
  const screen = useRef<HTMLDivElement>(null);
  function toggleDemo(value: boolean) {
    setDemo(value);
    screen.current?.scrollTo({ top: 0, behavior: 'instant' });
  }
  return (
    <section className={s.mobileWorkspace}>
      <div className={s.mobileIntro}>
        <a className={s.back} href="#career">
          <Icon name="back" size={18} />
          {tr(['Back to experience', 'Volver a experiencia'])}
        </a>
        <h1>
          {tr(['A different way\nto explore mobile.', 'Otra forma de\nexplorar el mundo móvil.'])}
        </h1>
        <p>
          {tr([
            'An app library of my work. Open a product to see my contribution, then try a small interactive demo.',
            'Una biblioteca de mi trabajo. Abre un producto para ver mi contribución y luego probar una pequeña demo interactiva.',
          ])}
        </p>
      </div>
      <div className={s.phoneShell}>
        <div className={s.phoneDisplay} data-library={!project}>
          <div className={s.phoneStatus} aria-hidden="true">
            <span>9:41</span>
            <span className={s.island} />
            <svg width="42" height="12" viewBox="0 0 42 12" fill="currentColor">
              <path d="M0 8h3v4H0zm5-3h3v7H5zm5-3h3v10h-3zm5-2h3v12h-3z" />
              <rect x="24" y="2" width="16" height="8" rx="2" />
            </svg>
          </div>
          <div className={s.phoneToolbar}>
            <a
              href={demo && app ? `#mobile/${app}` : '#mobile'}
              onClick={
                demo
                  ? (event) => {
                      event.preventDefault();
                      toggleDemo(false);
                    }
                  : undefined
              }
              aria-label={tr([
                demo ? 'Back to contribution' : 'App library',
                demo ? 'Volver a la contribución' : 'Biblioteca de apps',
              ])}
            >
              <Icon name={demo ? 'back' : 'home'} size={19} />
            </a>
            <span>
              {demo
                ? tr(['Interactive demo', 'Demo interactiva'])
                : (project?.name ?? tr(['App library', 'Biblioteca de apps']))}
            </span>
            <a href="#career" aria-label={tr(['Exit mobile workspace', 'Salir del espacio móvil'])}>
              <Icon name="external" size={17} />
            </a>
          </div>
          <div ref={screen} className={`${s.phoneScreen} ${demo ? s.demoScreen : ''}`}>
            {project && details && app ? (
              demo && Demo ? (
                <LoadBoundary key={app}>
                  <Suspense
                    fallback={
                      <p className={s.demoLoading}>{tr(['Loading demo…', 'Cargando demo…'])}</p>
                    }
                  >
                    <Demo />
                  </Suspense>
                </LoadBoundary>
              ) : (
                <article className={s.appStory}>
                  <Brand id={app} large />
                  <h2>{project.name}</h2>
                  <p className={s.appType}>{tr(details.type)}</p>
                  <p className={s.appSummary}>{tr(details.summary)}</p>
                  <h3>{tr(['My contribution', 'Mi contribución'])}</h3>
                  <ul>
                    {details.work.map((work) => (
                      <li key={work[0]}>{tr(work)}</li>
                    ))}
                  </ul>
                  <a
                    className={s.storyLink}
                    href={`#story/${app === 'luxury' ? 'boards' : app === 'steadymd' ? 'events' : app}`}
                  >
                    {tr(['Explore the architecture', 'Explorar la arquitectura'])}
                    <Icon name="arrow" size={16} />
                  </a>
                  <button className={s.primary} onClick={() => toggleDemo(true)}>
                    <Icon name="play" size={16} />
                    {tr(['Try the demo', 'Probar la demo'])}
                  </button>
                  {app === 'steadymd' && (
                    <p className={s.storeNote}>
                      {tr([
                        'Company icon shown. The store listing is now named Lemonaid Primary Care Complete.',
                        'Se muestra el icono de la empresa. La ficha de la tienda ahora se llama Lemonaid Primary Care Complete.',
                      ])}
                    </p>
                  )}
                  <div className={s.storeLinks}>
                    <a href={project.ios} target="_blank" rel="noreferrer">
                      App Store
                      <Icon name="external" size={13} />
                    </a>
                    {project.android && (
                      <a href={project.android} target="_blank" rel="noreferrer">
                        Google Play
                        <Icon name="external" size={13} />
                      </a>
                    )}
                  </div>
                  <a
                    className={s.appWebsite}
                    href={project.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tr(['Product website', 'Sitio del producto'])}
                    <Icon name="external" size={13} />
                  </a>
                </article>
              )
            ) : (
              <div className={s.appLibrary}>
                <h2>{tr(['Made for\nreal life.', 'Para la\nvida real.'])}</h2>
                <p>
                  {tr([
                    'Four products. Different challenges.',
                    'Cuatro productos. Distintos desafíos.',
                  ])}
                </p>
                <div className={s.appGrid}>
                  {projects.map((item) => (
                    <a key={item.id} href={`#mobile/${item.id}`}>
                      <span className={s.appCategory}>{tr(mobileCopy[item.id].type)}</span>
                      <Brand id={item.id} large />
                      <strong>{item.name}</strong>
                      <span className={s.appAction}>
                        {tr(['View my work', 'Ver mi trabajo'])}
                        <Icon name="arrow" size={14} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <a
            className={s.homeBar}
            href="#mobile"
            aria-label={tr(['Return to app library', 'Volver a la biblioteca de apps'])}
          >
            <span />
          </a>
        </div>
      </div>
      <div className={s.mobileDetails}>
        <div className={s.mobileExpertise}>
          <h2>React Native & Expo</h2>
          <p>
            {tr([
              'Architecture, state management, offline behavior, native integrations and release workflows.',
              'Arquitectura, manejo de estado, comportamiento offline, integraciones nativas y procesos de lanzamiento.',
            ])}
          </p>
        </div>
        <p className={s.workspaceNote}>
          {tr([
            'This is a portfolio workspace, inspired by iOS. Demos use fictional local data.',
            'Este espacio de portafolio se inspira en iOS. Las demos usan datos locales ficticios.',
          ])}
        </p>
      </div>
    </section>
  );
}

export default function Preview() {
  const { i18n } = useTranslation();
  const es = i18n.language.startsWith('es');
  const tr: Translate = (text) => text[es ? 1 : 0];
  const hash = useSyncExternalStore(subscribe, snapshot);
  const route = hash.startsWith('#story/')
    ? 'story'
    : hash.startsWith('#mobile')
      ? 'mobile'
      : 'home';
  const story = stories.find((item) => item.id === hash.split('/')[1]);
  const app = projects.find((item) => item.id === hash.split('/')[1])?.id;
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.lang = es ? 'es' : 'en';
  }, [es]);
  useEffect(() => {
    const target = document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
    if (hash) main.current?.focus({ preventScroll: true });
  }, [hash]);
  function changeLanguage() {
    const language = es ? 'en' : 'es';
    void i18n.changeLanguage(language);
    document.documentElement.lang = language;
    const url = new URL(window.location.href);
    url.searchParams.set('lang', language);
    window.history.replaceState(null, '', url);
    try {
      localStorage.setItem('portfolio.language.v1', language);
    } catch {
      /* Language still works when storage is unavailable. */
    }
  }
  return (
    <div className={s.preview}>
      <a className={s.skip} href="#main-content">
        {tr(['Skip to content', 'Ir al contenido'])}
      </a>
      <header className={s.header}>
        <a className={s.wordmark} href="#main-content" aria-label="ag. — Augusto Gonzalez">
          ag<span>.</span>
        </a>
        <nav aria-label={tr(['Main navigation', 'Navegación principal'])}>
          <a
            href="#career"
            aria-current={route === 'home' && hash === '#career' ? 'location' : undefined}
          >
            {tr(['Experience', 'Experiencia'])}
          </a>
          <a href="#mobile" aria-current={route === 'mobile' ? 'page' : undefined}>
            Mobile
          </a>
          <a href="#web">React / Next.js</a>
          <a href="#ai">{tr(['AI', 'IA'])}</a>
          <a href="#web3">Web3</a>
        </nav>
        <button
          className={s.language}
          onClick={changeLanguage}
          aria-label={es ? 'EN — Switch to English' : 'ES — Cambiar a español'}
        >
          {es ? 'EN' : 'ES'}
          <Icon name="globe" size={15} />
        </button>
        <ThemeToggle />
      </header>
      <main id="main-content" ref={main} tabIndex={-1}>
        {route === 'story' && story ? (
          <StoryPage story={story} tr={tr} />
        ) : route === 'mobile' ? (
          <Mobile key={app ?? 'library'} app={app} tr={tr} />
        ) : (
          <Home tr={tr} />
        )}
      </main>
      <footer className={s.footer}>
        <div>
          <h2>{tr(['Let’s build something useful.', 'Construyamos algo útil.'])}</h2>
          <a href="mailto:augustogonzalez.dev@gmail.com">
            augustogonzalez.dev@gmail.com
            <Icon name="arrow" size={19} />
          </a>
          <SocialLinks tr={tr} footer />
        </div>
        <span>{tr(['Layout preview · October 2026', 'Vista previa · Octubre de 2026'])}</span>
      </footer>
    </div>
  );
}
