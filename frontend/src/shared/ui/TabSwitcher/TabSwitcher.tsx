import clsx from 'clsx';
import { FC } from 'react';

import styles from './TabSwitcher.module.scss';

interface Button {
  category: string;
  icon?: string;
  text: string;
}

interface TabSwitcherProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  buttons: Button[];
  selectedCategory: string;
  onCategoryClick: (category: string) => void;
}

const TabSwitcher: FC<TabSwitcherProps> = ({ buttons, selectedCategory, onCategoryClick, ...props }) => {
  return (
    <div
      {...props}
      className={clsx([styles['category-tab-switcher'], props.className, buttons.length === 2 && styles['tabs-2']])}
    >
      {buttons.map(btn => {
        return (
          <button
            key={btn.category}
            type="button"
            className={clsx(
              styles['category-tab-switcher-btn'],
              btn.category === selectedCategory && styles['category-tab-switcher-btn-selected'],
            )}
            onClick={() => onCategoryClick(btn.category)}
          >
            {btn.icon && (
              <img
                src={btn.category === selectedCategory ? '/icons/water-icon-white.svg' : btn.icon}
                width={16}
                height={16}
                alt="icon"
                className={clsx([styles['category-tab-switcher-svg']])}
              />
            )}
            {btn.text}
          </button>
        );
      })}
    </div>
  );
};

export default TabSwitcher;
