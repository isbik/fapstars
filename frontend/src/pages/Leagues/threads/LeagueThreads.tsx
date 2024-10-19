import { ChangeEvent, FC, MutableRefObject, UIEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './LeagueThreads.module.scss';

import postThread from '~/entities/thread/api/postThread';
import searchThreads from '~/entities/thread/api/searchThreads';
import { IThread } from '~/entities/thread/types';
import Thread from '~/entities/thread/ui/thread';
import { useInfiniteScroll } from '~/shared/hooks/useInfiniteScroll';
import { useThrottle } from '~/shared/hooks/useTrottle';
import Loader from '~/shared/icons/loader';
import { PaperClipIcon } from '~/shared/icons/paperclip';
import { Input } from '~/shared/ui';

const LeagueThreads: FC = () => {
  const { leagueId } = useParams();
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState<IThread[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const wrapperRef = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement>;
  const triggerRef = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement>;

  const onScrollEnd = () => {
    if (hasMore) {
      console.log('Loading next page');
      setPage(prev => prev + 1);
    }
  };

  useInfiniteScroll({ triggerRef, wrapperRef, callback: onScrollEnd });

  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTop = scrollPosition;
    }
  }, [wrapperRef.current]);

  const onScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  }, 500);

  const onThreadType = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const postThreadMessage = async () => {
    setIsLoading(true);
    leagueId && (await postThread({ content: message, leagueId: leagueId }));
    await fetchThreads();
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      postThreadMessage();
      setMessage('');
    }
  };

  const fetchThreads = useCallback(async () => {
    const options = {
      filter: {
        leagueId: leagueId,
      },
      include: ['owner'],
      pagination: {
        page: page,
        perPage: 3,
      },
    };
    if (hasMore) {
      setIsLoading(true);
      searchThreads(options).then(({ data, meta }) => {
        setIsLoading(false);

        data &&
          setThreads(prev => {
            return prev ? [...prev, ...data] : data;
          });
        console.log(meta, 'meta');

        if (meta && meta.currentPage >= meta.lastPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      });
    }
  }, [page]);

  useEffect(() => {
    fetchThreads();
  }, [page]);

  if (!threads)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader />
      </div>
    );

  const handleAddPhoto = () => {
    console.log('hi');
  };

  return (
    <div ref={wrapperRef} onScroll={onScroll} className={styles.Threads}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>League notes</h1>
      </div>
      <div>
        {threads?.length > 0 && (
          <div className={styles.list}>
            {threads.map(thread => {
              return (
                <Thread
                  key={thread.id}
                  content={thread.content}
                  username={thread?.owner?.username}
                  pic={thread.owner?.avatar}
                />
              );
            })}

            <div style={{ alignSelf: 'center' }}> {isLoading && <Loader />}</div>
          </div>
        )}

        {hasMore ? <div className={styles.trigger} ref={triggerRef}></div> : null}
        {!hasMore && <span>All threads are loaded</span>}
      </div>

      <div className={'sticky bottom-0'}>
        <Input
          className={styles.input}
          placeholder="Message"
          value={message}
          onChange={onThreadType}
          onKeyDown={handleKeyDown}
          leftIcon={<PaperClipIcon onClick={handleAddPhoto} className={styles.paperclip} fill={'black'} />}
        />
      </div>
    </div>
  );
};

export default LeagueThreads;
