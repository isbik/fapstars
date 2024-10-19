import battleIcon from '~/assets/icons/battle.svg';
import earnIcon from '~/assets/icons/earn.svg';
import leaguesIcon from '~/assets/icons/leagues.svg';
import mineIcon from '~/assets/icons/mine.svg';
import myleagueIcon from '~/assets/icons/myleague.svg';

export const NAV_LINKS: NavLink[] = [
  {
    title: 'Leagues',
    icon: leaguesIcon,
    alt: 'Leagues',
    href: '/leagues',
  },
  {
    title: 'Mine',
    icon: mineIcon,
    alt: 'Mine',
    href: '/mine',
  },
  {
    title: 'Battle',
    icon: battleIcon,
    alt: 'Battle',
    href: '/battle',
  },
  {
    title: 'My Profile',
    icon: myleagueIcon,
    alt: 'My Profile',
    href: '/profile',
  },
  {
    title: 'Earn',
    icon: earnIcon,
    alt: 'Earn',
    href: '/earn',
  },
];

export type NavLink = {
  title: string;
  icon: string;
  alt: string;
  href: string;
};
