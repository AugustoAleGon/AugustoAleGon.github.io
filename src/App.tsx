import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Phone from './components/Phone';
import Icon from './components/Icon';
import ThemeToggle from './components/ThemeToggle';
import { projects, type ProjectId } from './content/projects';
import s from './App.module.css';
import DeferredSystem from './system/DeferredSystem';

const year = new Date().getFullYear();

export default function App() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState<ProjectId>('seen');
  const project = projects.find((p) => p.id === selected)!;
  useEffect(() => {
    let active = true;
    void document.fonts.ready.then(() => {
      if (active && location.hash) {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      }
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.title =
      i18n.language === 'es'
        ? 'Augusto Gonzalez — Ingeniero full-stack'
        : 'Augusto Gonzalez — Full-stack engineer';
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('hero.intro'));
  }, [i18n.language, t]);
  function language() {
    const next = i18n.language === 'en' ? 'es' : 'en';
    void i18n.changeLanguage(next);
    const url = new URL(window.location.href);
    url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
    try {
      localStorage.setItem('portfolio.language.v1', next);
    } catch {
      /* The URL retains the language when storage is unavailable. */
    }
  }
  const highlights = t(`projects.${selected}.highlights`, { returnObjects: true }) as string[];
  return (
    <>
      <a className="skip-link" href="#main">
        {t('nav.skip')}
      </a>
      <header className={s.header}>
        <a href="#top" className={s.identity} aria-label="Augusto Gonzalez">
          <span className={s.mark}>
            ag
            <span />
          </span>
          <span>Augusto Gonzalez</span>
        </a>
        <nav aria-label={i18n.language === 'es' ? 'Navegación principal' : 'Main navigation'}>
          <a href="#work">{t('nav.work')}</a>
          <a href="#system">{t('nav.system')}</a>
          <a href="#about">{t('nav.about')}</a>
        </nav>
        <div className={s.headerRight}>
          <ThemeToggle />
          <button onClick={language} aria-label={t('nav.language')} className={s.language}>
            <span aria-current={i18n.language === 'en' ? 'true' : undefined}>EN</span>
            <span>/</span>
            <span aria-current={i18n.language === 'es' ? 'true' : undefined}>ES</span>
          </button>
          <a className={s.contactLink} href="mailto:augustogonzalez.dev@gmail.com">
            {t('nav.contact')}
            <Icon name="external" size={16} />
          </a>
        </div>
      </header>
      <main id="main">
        <section id="top" className={s.hero}>
          <div className={s.heroCopy}>
            <h1>
              {t('hero.line1')}
              <br />
              {t('hero.line2')}
              <br />
              <em>{t('hero.line3')}</em>
            </h1>
            <p className={s.intro}>{t('hero.intro')}</p>
            <div className={s.heroActions}>
              <a className="button" href="#system">
                {t('hero.explore')}
                <Icon name="arrow" size={17} />
              </a>
              <a className={s.cv} href="/cv/augusto-gonzalez-fullstack.pdf" download>
                {t('hero.cv')}
                <Icon name="down" size={16} />
              </a>
            </div>
            <p className={s.location}>
              <Icon name="globe" size={14} />
              {t('hero.location')}
            </p>
          </div>
          <div className={s.phoneStage}>
            <div className={s.phoneGround} />
            <Phone key={selected} selected={selected} onSelect={setSelected} />
          </div>
          <div className={s.projectSelector} id="work">
            <div className={s.selectorHeading}>
              <span>{t('hero.selected')}</span>
              <span>{t('hero.hint')}</span>
            </div>
            <div className={s.projectTabs} aria-label={t('hero.selected')}>
              {projects.map((p) => (
                <button
                  key={p.id}
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                >
                  <span className={s.projectIcon} data-brand={p.id}>
                    {p.monogram}
                  </span>
                  <span>{p.name}</span>
                  <Icon name="external" size={15} />
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className={s.caseStudy} aria-label={t('work.role')}>
          <div className={s.caseTitle}>
            <h2>{t(`projects.${selected}.subtitle`)}</h2>
            <div className={s.caseMeta}>
              <span>{project.name}</span>
              <span>
                {selected === 'seen'
                  ? t('work.freelance')
                  : selected === 'luxury'
                    ? t('work.present')
                    : project.period}
                {selected === 'puramente' ? ` · ${t('work.sideProject')}` : ''}
              </span>
            </div>
            <p>{t(`projects.${selected}.summary`)}</p>
            <div className={s.stack}>
              {project.stack.map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
          <div className={s.caseDetails}>
            <h3>{t('work.proof')}</h3>
            <ul>
              {highlights.map((text) => (
                <li key={text}>
                  <Icon name="check" size={15} />
                  {text}
                </li>
              ))}
            </ul>
            <div className={s.projectLinks}>
              <a href={project.ios} target="_blank" rel="noreferrer">
                {t('work.ios')}
                <Icon name="external" size={13} />
              </a>
              {project.android ? (
                <a href={project.android} target="_blank" rel="noreferrer">
                  {t('work.android')}
                  <Icon name="external" size={13} />
                </a>
              ) : (
                <span>{t('work.androidSoon')}</span>
              )}
              <a
                href={project.website}
                target="_blank"
                rel="noreferrer"
                aria-label={t('work.site')}
              >
                <Icon name="globe" size={16} />
              </a>
            </div>
            {selected === 'steadymd' && <p className={s.rename}>{t('work.renamed')}</p>}
          </div>
        </section>
        <section className={s.systemSection} id="system">
          <div className={s.sectionHeading}>
            <h2>
              {t('system.title1')}
              <br />
              <em>{t('system.title2')}</em>
            </h2>
            <p>{t('system.intro')}</p>
          </div>
          <DeferredSystem />
        </section>
        <section className={s.about} id="about">
          <div className={s.aboutIntro}>
            <h2>
              {t('about.title')}
              <br />
              <em>{t('about.italic')}</em>
            </h2>
            <p>{t('about.text')}</p>
            <p>{t('about.text2')}</p>
            <a className={s.textLink} href="/cv/augusto-gonzalez-mobile.pdf" download>
              {t('work.mobileCv')}
              <Icon name="down" size={16} />
            </a>
            <div className={s.toolset}>
              <h3>{t('about.stackTitle')}</h3>
              {[
                ['frontend', 'React · React Native · TypeScript'],
                ['backend', 'Node.js · GraphQL · AWS · Cloudflare'],
                ['delivery', 'Playwright · Maestro · Detox · EAS'],
              ].map(([key, text]) => (
                <div key={key}>
                  <span>{t(`about.${key}`)}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={s.timeline}>
            <h3>{t('about.career')}</h3>
            {[
              { name: 'Seen', role: 'about.engineer', period: t('work.freelance') },
              { name: 'Luxury Presence', role: 'about.current', period: t('work.present') },
              { name: 'Boom Entertainment', role: 'about.engineer', period: '2022' },
              { name: 'Pura Mente', role: 'about.mobile', period: '2020 — 2022' },
              { name: 'SteadyMD', role: 'about.engineer', period: '2018 — 2022' },
            ].map((job) => (
              <article key={job.name}>
                <div>
                  <h4>{job.name}</h4>
                  <span>{job.period}</span>
                </div>
                <p>{t(job.role)}</p>
              </article>
            ))}
            <div className={s.earlier}>
              <h4>{t('about.earlier')}</h4>
              <p>{t('about.earlierText')}</p>
            </div>
          </div>
        </section>
        <section className={s.contact} id="contact">
          <div>
            <h2>
              {t('contact.title')}
              <br />
              <em>{t('contact.italic')}</em>
            </h2>
            <p>{t('contact.text')}</p>
          </div>
          <a
            href="mailto:augustogonzalez.dev@gmail.com"
            className={s.contactButton}
            aria-label={`${t('contact.email')}: augustogonzalez.dev@gmail.com`}
          >
            <Icon name="external" size={34} />
          </a>
          <div className={s.contactBottom}>
            <a href="mailto:augustogonzalez.dev@gmail.com">augustogonzalez.dev@gmail.com</a>
            <div>
              <a href="https://github.com/augustoalegon" target="_blank" rel="noreferrer">
                GitHub
                <Icon name="external" size={13} />
              </a>
              <a href="https://www.linkedin.com/in/augustoalegon" target="_blank" rel="noreferrer">
                LinkedIn
                <Icon name="external" size={13} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className={s.footer}>
        <span>© {year} Augusto Gonzalez</span>
        <span>{t('contact.footer')}</span>
        <a href="#top">
          {t('contact.top')}
          <Icon name="arrow" size={14} style={{ transform: 'rotate(-90deg)' }} />
        </a>
      </footer>
    </>
  );
}
