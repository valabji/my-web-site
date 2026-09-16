import { useState, useEffect } from 'react';
import './ScrollUp.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ScrollUp() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = (e) => {
    e.currentTarget.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`scroll-up ${visible ? 'is-visible' : ''}`}
      onClick={scrollToTop}
      aria-label={t('scrollTop')}
    >
      <span className="lni lni-chevron-up" aria-hidden="true" />
    </button>
  );
}
