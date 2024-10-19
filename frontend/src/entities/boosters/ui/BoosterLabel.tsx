import dayjs from 'dayjs';
import { useState } from 'react';

import Countdown from '~/shared/ui/Countdown/Countdown';

const BoosterLabel = ({ fullAt }: { fullAt?: string }) => {
  const [key, setKey] = useState(0);

  if (!fullAt) return null;

  const seconds = dayjs(fullAt).diff(dayjs(), 'seconds');

  const maxAvailable = 3 - Math.max(Math.ceil(seconds / 3600 / 4), 0);

  return (
    <p className="flex items-center" key={key}>
      {maxAvailable}/3 available
      {maxAvailable < 3 && (
        <span className="ml-auto">
          <Countdown
            onFinish={() => {
              console.log(111);

              return setKey(key + 1);
            }}
            seconds={dayjs(fullAt).diff(dayjs(), 'seconds') % (3600 * 4)}
          />
        </span>
      )}
    </p>
  );
};

export { BoosterLabel };
