import React, { ChangeEvent, useEffect, useState } from 'react';

import styles from './LeaguesPage.module.sass';

import useAuth from '~/app/context/auth/useAuth';
import { searchLeagues } from '~/entities/league/api';
import { SearchLeaguesRequest } from '~/entities/league/api/searchLeagues';
import { League } from '~/entities/league/types';
import { LeagueList } from '~/entities/league/ui';
import { MagnifyIcon } from '~/shared/icons/magnify';
import { Button, Input } from '~/shared/ui';
import TabSwitcher from '~/shared/ui/TabSwitcher/TabSwitcher';
import { debounce } from '~/shared/utils';

const LeaguesPage: React.FC = () => {
  const { user } = useAuth();
  const [leagues, setLeagues] = useState<League[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  const [orderColumn, setOrderColumn] = useState<string>('balance');

  useEffect(() => {
    const controller = new AbortController();

    const options: SearchLeaguesRequest = {
      filter: { name: search },
      pagination: { page: 1, perPage: 100 },
    };

    if (orderColumn === 'balance') {
      options.orderBy = { column: 'balance', direction: 'desc' };
    }

    if (orderColumn === 'created_at') {
      options.orderBy = { column: 'created_at', direction: 'desc' };
    }

    setIsLoading(true);
    searchLeagues(options, { signal: controller.signal })
      .then(({ data }) => {
        data && setLeagues(data);
      })
      .finally(() => setIsLoading(false));
  }, [search, orderColumn]);

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 350);

  return (
    <>
      <div className={styles.titleWrapper}>
        <h2>Join league</h2>
        <span>
          Engage with other participants or
          <br /> create new league
        </span>
      </div>

      <Input
        className={styles.searchInput}
        leftIcon={<MagnifyIcon />}
        name="search"
        placeholder="Search"
        onChange={handleSearch}
      />

      <TabSwitcher
        className="mt-8 mb-6"
        buttons={[
          { category: 'balance', text: 'Top' },
          { category: 'created_at', text: 'New' },
        ]}
        selectedCategory={orderColumn}
        onCategoryClick={setOrderColumn}
      />

      <LeagueList className="pb-4 mb-auto" isLoading={isLoading} leagues={leagues} />

      {!user?.leagueId && (
        <Button className="sticky bottom-0" link="/leagues/create">
          New league
        </Button>
      )}
    </>
  );
};

export default LeaguesPage;
