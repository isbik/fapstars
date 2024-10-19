import { useEffect, useState } from 'react';

import { copyToClipboard } from '../utils/copyToClipboard';

export const useCopied = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = (text: string) => {
    copyToClipboard(text);

    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return {
    isCopied,
    copy,
  };
};
