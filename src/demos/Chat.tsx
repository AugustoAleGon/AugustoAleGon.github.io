import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import s from './Demos.module.css';

interface Message {
  id: number;
  text?: string;
  outgoing: boolean;
  queued: boolean;
}
export default function Chat() {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(false);
  const [offline, setOffline] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  useEffect(() => {
    const element = list.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, opened]);
  function toggleOffline() {
    const replyId = nextId.current++;
    if (offline)
      setMessages((items) => {
        const pending = items.some((m) => m.queued);
        const delivered = items.map((m) => ({ ...m, queued: false }));
        return pending
          ? [...delivered, { id: replyId, outgoing: false, queued: false }]
          : delivered;
      });
    setOffline(!offline);
  }
  return (
    <div className={`${s.demo} ${s.chat}`}>
      <div className={s.chatLogo}>
        steady<span>MD</span>
        <span className={s.healthMark}>+</span>
      </div>
      {!opened ? (
        <>
          <h3>{t('chat.title')}</h3>
          <p className={s.sub}>{t('projects.steadymd.action')}</p>
          <button className={s.conversation} onClick={() => setOpened(true)}>
            <div className={s.doctor}>M</div>
            <div>
              <strong>{t('chat.doctor')}</strong>
              <span>{t('chat.role')}</span>
              <p>{t('chat.preview')}</p>
            </div>
            <Icon name="external" size={16} />
          </button>
          <p className={s.medicalNote}>{t('chat.sample')}</p>
        </>
      ) : (
        <>
          <button className={s.back} onClick={() => setOpened(false)}>
            <Icon name="back" size={14} />
            {t('chat.title')}
          </button>
          <div className={s.chatPerson}>
            <div className={s.doctor}>M</div>
            <div>
              <strong>{t('chat.doctor')}</strong>
              <span>{t('chat.role')}</span>
            </div>
          </div>
          <button
            className={s.connection}
            aria-label={t('chat.toggle')}
            aria-pressed={offline}
            onClick={toggleOffline}
          >
            <span className={offline ? s.offlineDot : s.onlineDot} />
            {t(offline ? 'chat.offline' : 'chat.online')}
            <Icon name="wifi" size={14} />
          </button>
          <div ref={list} className={s.messageList} role="log" aria-live="polite">
            <p className={s.chatTime}>{t('chat.time')}</p>
            <div className={s.bubble}>{t('chat.greeting')}</div>
            {messages.map((m) => (
              <div key={m.id} className={m.outgoing ? s.outgoing : s.incoming}>
                <p className={s.bubble}>{m.text ?? t('chat.reply')}</p>
                {m.outgoing && <small>{t(m.queued ? 'chat.queued' : 'chat.sent')}</small>}
              </div>
            ))}
          </div>
          <form
            className={s.compose}
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.trim()) return;
              const message = {
                id: nextId.current++,
                text: draft.trim(),
                outgoing: true,
                queued: offline,
              };
              const reply = { id: nextId.current++, outgoing: false, queued: false };
              setMessages((items) => [...items, message, ...(!offline ? [reply] : [])]);
              setDraft('');
            }}
          >
            <input
              aria-label={t('chat.placeholder')}
              placeholder={t('chat.placeholder')}
              maxLength={250}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button aria-label={t('chat.send')} disabled={!draft.trim()}>
              <Icon name="send" size={17} />
            </button>
          </form>
          <p className={s.medicalNote}>{t('chat.sample')}</p>
        </>
      )}
    </div>
  );
}
