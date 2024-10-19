import { useEffect, useState } from 'react';

interface useMountProps {
  opened: boolean;
  time?: number;
}

export const useMount = ({ opened, time }: useMountProps) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (opened && !mounted) {
      setMounted(true);
    } else if (!opened && mounted) {
      timer = setTimeout(() => {
        setMounted(false);
      }, time ?? 0);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [mounted, opened, time]);

  return { mounted };
};

export default useMount;
