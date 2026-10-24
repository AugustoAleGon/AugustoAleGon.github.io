import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../components/Icon';
import s from './Demos.module.css';

type Room = 'care' | 'scheduling';
interface Message {
  id: number;
  text: string;
  time: string;
  queued: boolean;
}
const rooms: Room[] = ['care', 'scheduling'];
export default function Chat() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState<Room | null>('care');
  const [offline, setOffline] = useState(false);
  const [drafts, setDrafts] = useState({ care: '', scheduling: '' });
  const [messages, setMessages] = useState<Record<Room, Message[]>>({ care: [], scheduling: [] });
  const [unread, setUnread] = useState(true);
  const list = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const draft = active ? drafts[active] : '';
  useEffect(() => {
    const element = list.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [messages, active]);
  function toggleOffline() {
    if (offline)
      setMessages((items) => ({
        care: items.care.map((m) => ({ ...m, queued: false })),
        scheduling: items.scheduling.map((m) => ({ ...m, queued: false })),
      }));
    setOffline(!offline);
  }
  return (
    <div className={`${s.demo} ${s.chat}`}>
      <div className={s.chatLogo}>
        <span>
          steady<strong>MD</strong>
        </span>
        <span className={s.chatDemoLabel}>{t('chat.demo')}</span>
      </div>
      {active ? (
        <>
          <header className={s.chatHeader}>
            <button
              className={s.chatBack}
              aria-label={t('chat.back')}
              onClick={() => setActive(null)}
            >
              <Icon name="back" size={20} />
            </button>
            <div className={s.doctor} aria-hidden="true">
              {active === 'care' ? 'CT' : 'SC'}
            </div>
            <div>
              <h2>{t(`chat.${active}`)}</h2>
              <p>{t('chat.channel')}</p>
            </div>
          </header>
          <div
            ref={list}
            className={s.messageList}
            role="log"
            // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users must be able to scroll the message log.
            tabIndex={0}
            aria-label={t(`chat.${active}`)}
            aria-live="polite"
          >
            <p className={s.chatTime}>{t('chat.time')}</p>
            {[0, 1, 2].map((index) => (
              <article className={s.chatMessage} key={index}>
                <div className={s.doctor} aria-hidden="true">
                  {index === 1 ? 'AL' : active === 'care' ? 'M' : 'J'}
                </div>
                <div>
                  <div className={s.messageMeta}>
                    <strong>
                      {t(
                        index === 1
                          ? 'chat.you'
                          : active === 'care'
                            ? 'chat.doctor'
                            : 'chat.coordinator',
                      )}
                    </strong>
                    <time>{`09:${40 + index}`}</time>
                  </div>
                  <p>{t(`chat.${active}Message${index}`)}</p>
                </div>
              </article>
            ))}
            {messages[active].map((m) => (
              <article className={s.chatMessage} key={m.id}>
                <div className={`${s.doctor} ${s.selfAvatar}`} aria-hidden="true">
                  AL
                </div>
                <div>
                  <div className={s.messageMeta}>
                    <strong>{t('chat.you')}</strong>
                    <time>{m.time}</time>
                  </div>
                  <p>{m.text}</p>
                  <small>{t(m.queued ? 'chat.queued' : 'chat.sent')}</small>
                </div>
              </article>
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
                queued: offline,
                time: new Date().toLocaleTimeString(i18n.language, {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              };
              setMessages((items) => ({ ...items, [active]: [...items[active], message] }));
              setDrafts((items) => ({ ...items, [active]: '' }));
            }}
          >
            <textarea
              aria-label={t('chat.placeholder')}
              placeholder={t('chat.placeholder')}
              rows={2}
              maxLength={1000}
              value={draft}
              onChange={(event) =>
                setDrafts((items) => ({ ...items, [active]: event.target.value }))
              }
            />
            <button aria-label={t('chat.send')} disabled={!draft.trim()}>
              <Icon name="send" size={20} />
            </button>
          </form>
          <button
            className={s.connection}
            aria-label={`${t(offline ? 'chat.offline' : 'chat.online')} · ${t('chat.toggle')}`}
            aria-pressed={offline}
            onClick={toggleOffline}
          >
            <span className={offline ? s.offlineDot : s.onlineDot} />
            {t(offline ? 'chat.offline' : 'chat.online')}
            <Icon name="wifi" size={14} />
          </button>
        </>
      ) : (
        <section className={s.channelList}>
          <h2>{t('chat.title')}</h2>
          <p className={s.sub}>{t('chat.listHint')}</p>
          {rooms.map((room) => {
            const last = messages[room].at(-1);
            return (
              <button
                key={room}
                className={s.conversation}
                onClick={() => {
                  setActive(room);
                  if (room === 'scheduling') setUnread(false);
                }}
              >
                <div className={s.doctor} aria-hidden="true">
                  {room === 'care' ? 'CT' : 'SC'}
                </div>
                <div className={s.roomSummary}>
                  <div className={s.messageMeta}>
                    <strong>{t(`chat.${room}`)}</strong>
                    <time>{last?.time ?? '09:42'}</time>
                  </div>
                  <p>{last ? `${t('chat.you')}: ${last.text}` : t(`chat.${room}Message2`)}</p>
                </div>
                {room === 'scheduling' && unread && (
                  <span className={s.unread} aria-label={t('chat.unread')}>
                    1
                  </span>
                )}
              </button>
            );
          })}
        </section>
      )}
      <p className={s.medicalNote}>{t('chat.sample')}</p>
    </div>
  );
}
