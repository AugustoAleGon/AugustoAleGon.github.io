import { useTranslation } from 'react-i18next';
import { setTheme, useTheme } from '../theme';
import Icon from './Icon';
import s from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { t } = useTranslation();
  const theme = useTheme();
  const label = t(theme === 'dark' ? 'nav.lightMode' : 'nav.darkMode');
  return (
    <button
      type="button"
      className={s.toggle}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={label}
      title={label}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
    </button>
  );
}
