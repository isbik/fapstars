import { useEffect, useState } from 'react';

import { getConfigsApi } from '../api/configs';
import { Configs } from '../types/Configs';

export const useConfigs = () => {
  const [configs, setConfigs] = useState<Configs | null>(null);

  useEffect(() => {
    getConfigsApi()
      .then(data => {
        setConfigs(data);
      })
      .catch(console.error);
  }, []);

  return {
    configs: configs ?? {
      dailyRewards: [],
      coinsToVerifyLeague: 100_000,
    },
  };
};
