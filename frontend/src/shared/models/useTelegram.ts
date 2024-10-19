import { useEffect } from 'react';

const useTelegram = () => {
  const tg = window.Telegram.WebApp;

  useEffect(() => {
    if (!tg) return;

    tg.ready();
    tg.expand();
    tg.disableVerticalSwipes();
    tg.setHeaderColor('#0A000C');
    tg.setBackgroundColor('#760B68');
  }, [tg]);

  return { tg };
};

export default useTelegram;
