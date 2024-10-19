import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import styles from './LeagueDetailPage.module.scss';

import useAuth from '~/app/context/auth/useAuth';
import LeagueDefault from '~/assets/league_icon.png';
import UserIcon from '~/assets/user.png';
import { getCountry } from '~/entities/country/utils/getCountry';
import { getLeagueById, joinLeague, leaveLeague } from '~/entities/league/api';
import { League } from '~/entities/league/types';
import { CheckVerified } from '~/entities/league/ui/CheckVerified';
import { LeagueVerification } from '~/entities/league/ui/LeagueVerification';
import searchThreads from '~/entities/thread/api/searchThreads';
import { IThread } from '~/entities/thread/types';
import Thread from '~/entities/thread/ui/thread';
import { searchUser } from '~/entities/user/api';
import { User } from '~/entities/user/types';
import StarIcon from '~/shared/icons/star';
import { TelegramIcon } from '~/shared/icons/telegram';
import { AvatarEdit, Button, Drawer, InfoBlock, ListItem, Subtitle } from '~/shared/ui';
import { ExpandAvatar } from '~/shared/ui/ExpandAvatar';
import { ExitIcon } from '~/shared/ui/Icons';
import { Star } from '~/shared/ui/Star/Star';
import { cn } from '~/shared/utils/cn';
import { formatNumber } from '~/shared/utils/formatNumber';

// import TabSwitcher from "~/shared/ui/TabSwitcher/TabSwitcher"

interface LeagueDetailPageProps {
  className?: string;
}

// const buttons = [
// 	{
// 		category: "Weekly",
// 		text: "Weekly",
// 	},
// 	{
// 		category: "Batch",
// 		text: "Batch",
// 	},
// ]

const LeagueDetailPage: React.FC<LeagueDetailPageProps> = () => {
  const { leagueId } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  // const [selectedCategory, setSelectedCategory] = useState("Weekly")
  const [league, setLeague] = useState<League | null>();
  const [members, setMembers] = useState<User[] | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnterLeagueModalOpen, setIsEnterLeagueModalOpen] = useState(false);
  const [isOpenSuccessModal, setisOpenSuccessModal] = useState(false);
  const [threads, setThreads] = useState<IThread[] | null>(null);

  // const onCategoryClick = () => {
  // 	if (selectedCategory === "Weekly") {
  // 		setSelectedCategory("Batch")
  // 	} else if (selectedCategory === "Batch") {
  // 		setSelectedCategory("Weekly")
  // 	}
  // }
  useEffect(() => {
    console.log('isOpenSuccessModal', isOpenSuccessModal);
  }, [isOpenSuccessModal]);

  useEffect(() => {
    // TODO: Сделать 2 отдельных лоадера и 2 отдельных скелетона на них,
    // или тянуть всё одним запросом
    // или вынести мемберов в отдельный виджет
    if (!leagueId) return;

    console.log('leagueId', leagueId);
    Promise.all([
      getLeagueById(leagueId).then(data => data && setLeague(data)),
      searchUser({
        filter: { leagueId },
        pagination: { perPage: 100, page: 1 },
      }).then(({ data }) => data && setMembers(data)),
    ]);
    console.log(JSON.stringify(league));
  }, [leagueId, user]);

  useEffect(() => {
    getThreadsHandler();
  }, []);

  const getThreadsHandler = async () => {
    await searchThreads({
      filter: {
        leagueId: leagueId,
      },
      include: ['owner'],
    }).then(({ data }) => setThreads(data));
  };

  const handleJoinLeague = () => {
    if (!leagueId) return;
    joinLeague(leagueId).then(data => {
      setUser(data);
      onEnterLeagueModalOpen();
      setisOpenSuccessModal(true);
    });

    // TODO: Отображать состояния загрузки и Drawer об успехе/ошибке
  };

  const handleOpenModal = async () => {
    setIsModalOpen(prev => !prev);
  };

  const handleOpenSuccessModal = async () => {
    setisOpenSuccessModal(prev => !prev);
  };

  const onEnterLeagueModalOpen = async () => {
    setIsEnterLeagueModalOpen(prev => !prev);
  };

  const leaveFromLeague = async () => {
    leaveLeague().then(data => {
      setUser(data);
      handleOpenModal();
    });

    // TODO: Отображать состояния загрузки и Drawer об успехе/ошибке
  };

  const country = getCountry(league?.countryCode);

  return (
    <>
      <Drawer isVisible={isModalOpen} onClose={handleOpenModal}>
        <div className={styles.leaveFromLeague}>
          <img src={league?.avatar ? league?.avatar : ''} alt="ava" className={styles.avatar} />

          <p className={styles.text}>
            Do you want to leave {league?.name} league? The league rating will decrease by the amount of your fapstars
            balance.
          </p>

          <Button onClick={leaveFromLeague}>Yes</Button>
          <Button variant="default" onClick={handleOpenModal}>
            Cancel
          </Button>
        </div>
      </Drawer>

      <Drawer isVisible={isEnterLeagueModalOpen} onClose={onEnterLeagueModalOpen}>
        <div className={styles.leaveFromLeague}>
          <img src={league?.avatar ? league?.avatar : ''} alt="ava" className={styles.avatar} />
          <p className={styles.text}>Join {league?.name} league?</p>

          <Button onClick={handleJoinLeague}>Yes</Button>
          <Button variant="default" onClick={onEnterLeagueModalOpen}>
            Cancel
          </Button>
        </div>
      </Drawer>

      <Drawer isVisible={isOpenSuccessModal} onClose={handleOpenSuccessModal}>
        <div className={styles.leaveFromLeague}>
          <img src={league?.avatar ? league?.avatar : ''} alt="ava" className={styles.avatar} />
          <h3>Congrats!</h3>
          <p className={styles.text}>You’ve joined {league?.name} league. Fap and earn more FAP Coins </p>
        </div>
      </Drawer>

      <div className={styles.header}>
        <div className={styles.avatarWrapper}>
          <ExpandAvatar
            src={league?.avatar || LeagueDefault}
            alt="league_avatar"
            className={styles.photo}
            width={116}
            height={116}
          />
          {user?.id === league?.ownerId && (
            <AvatarEdit
              className={styles.avatarEdit}
              onClick={() => {
                navigate(`/leagues/${leagueId}/edit`);
              }}
            />
          )}
        </div>
        <h1 className="flex items-center gap-1 text-2xl">
          {league?.name}
          {league?.isVerified && <CheckVerified />}
        </h1>
        {country && (
          <span className={styles.country}>
            <img
              src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${country.code}.svg`}
              alt={country.name}
            />
            {country.name}
          </span>
        )}
      </div>
      <div className={styles.info}>
        <InfoBlock
          className={styles.balanceWrapper}
          style={{
            flexGrow: 1,
          }}
        >
          <span>Balance</span>
          <div className={styles.balanceData}>
            <Star />
            <span>{formatNumber(league?.balance)}</span>
          </div>
        </InfoBlock>
        <InfoBlock className={styles.members} style={{ flexGrow: 1 }}>
          <span className={styles.title}>Members</span>
          <span className={styles.count}>{league?.members_count ?? 0}</span>
        </InfoBlock>
      </div>

      {!league?.isVerified && <LeagueVerification league={league} />}

      {leagueId === user?.leagueId && (
        <button className={styles.exit} onClick={handleOpenModal}>
          <ExitIcon /> Leave the league
        </button>
      )}
      <div className={styles.links}>
        <Button className={styles.linkBtn} variant="outline">
          <TelegramIcon />
          <span>Telegram Channel</span>
        </Button>
        <Button>
          <StarIcon />
          <span>Donate League</span>
        </Button>
      </div>

      <div className={styles.subtitleWrapper}>
        <Subtitle>League notes</Subtitle>

        <Link className={styles.threadsLink} to={`/leagues/${leagueId}/threads`}>
          View All {'  >'}
        </Link>
      </div>

      <div className={styles.threads}>
        {threads &&
          threads.slice(0, 3).map(thread => {
            return (
              <Thread
                content={thread.content}
                username={thread?.owner?.username}
                pic={thread.owner?.avatar}
                key={thread.id}
              />
            );
          })}
      </div>

      <Subtitle>Members</Subtitle>
      <div className={cn(styles.list, '')}>
        {members?.map(member => (
          <ListItem
            key={member.id}
            title={member.username}
            onClick={() => navigate(`/users/${member.id}`)}
            content={
              <>
                <Star />
                {formatNumber(member.balance)}
              </>
            }
            picture={member.avatar ?? UserIcon}
          />
        ))}
        {members?.length === 0 && <p>No members</p>}
      </div>

      {!user?.leagueId && (
        <Button className={cn('sticky bottom-0')} onClick={onEnterLeagueModalOpen}>
          Join league
        </Button>
      )}
    </>
  );
};

export default LeagueDetailPage;
