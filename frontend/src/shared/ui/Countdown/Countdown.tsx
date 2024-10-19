import { useEffect, useState } from 'react';

type Props = {
  seconds?: number;
  disabled?: boolean;
  onFinish?: () => void;
};

const Countdown = ({ seconds = 0, disabled, onFinish }: Props) => {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [disabled]);

  useEffect(() => {
    if (countdown <= 0) {
      onFinish?.();
    }
  }, [countdown]);

  const formatTime = () => {
    const hours = Math.floor(countdown / 3600);
    const minutes = Math.floor((countdown % 3600) / 60);
    const seconds = countdown % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (countdown <= 0 || disabled) {
    return null;
  }

  return formatTime();
};

export default Countdown;
