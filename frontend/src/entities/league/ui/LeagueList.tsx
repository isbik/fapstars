import { FC } from 'react';

import { League } from '../types';

import LeagueListItem from './LeagueListItem';

import { Skeleton } from '~/shared/ui/Skeleton';
import { cn } from '~/shared/utils/cn';

interface LeagueListProps {
  isLoading: boolean;
  leagues: League[] | null;
  emptyText?: string;
  className?: string;
}

const LeagueList: FC<LeagueListProps> = ({ emptyText, isLoading, leagues, className }) => {
  if (isLoading)
    return Array.from({ length: 5 }).map((_, index) => (
      <div className="bg-[#191A1D] flex gap-4 px-4 py-2 rounded-lg mb-3" key={index}>
        <Skeleton className="size-12" variant="circle" />

        <div className="flex flex-col gap-2 mr-auto">
          <Skeleton className="w-24 h-[22px]" />
          <Skeleton className="w-32 h-[22px]" />
        </div>
        <Skeleton className="size-8" variant="circle" />
      </div>
    ));

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {leagues && (
        <>
          {leagues.length === 0 ? (
            <p className="text-xl text-center">{emptyText ?? 'Leagues not found.'}</p>
          ) : (
            <>
              {leagues.map(league => {
                return <LeagueListItem key={league.id} league={league} />;
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LeagueList;
