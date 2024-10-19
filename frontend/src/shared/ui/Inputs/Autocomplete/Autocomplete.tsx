import * as Tooltip from '@radix-ui/react-tooltip';
import { forwardRef, useState } from 'react';

import Input, { InputProps } from '../Input/Input';

import styles from './Autocomplete.module.scss';

import { useFallbackRef, useElementWidth } from '~/shared/hooks';

export { Autocomplete };

const Component = <T extends { id: string; name: string; display?: React.ReactNode }>(
  { items, className, showAll, onSelectItem, ...props }: AutocompleteProps<T>,
  forwardedRef: React.Ref<HTMLInputElement>,
) => {
  const ref = useFallbackRef<HTMLInputElement>(forwardedRef);

  const [search, setSearch] = useState(items?.find(item => item.id === props.selected)?.name || '');

  const filtered = showAll ? items : items.filter(({ name }) => name.toLowerCase().includes(search.toLowerCase()));

  const width = useElementWidth(ref?.current);

  const [open, setOpen] = useState(false);

  return (
    <Tooltip.Provider>
      <Tooltip.Root open={open && filtered.length !== 0}>
        <Tooltip.Trigger asChild>
          <Input
            value={search}
            type="text"
            {...props}
            className={className}
            ref={ref}
            onChange={event => {
              props.onChange?.(event);
              setSearch(event.target.value);
            }}
            onFocus={event => {
              props.onFocus?.(event);
              setOpen(true);
            }}
            onBlur={event => {
              props.onBlur?.(event);

              setTimeout(() => {
                setOpen(false);
              }, 100);
            }}
          ></Input>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="bottom"
          align="start"
          style={{ minWidth: width, maxWidth: width }}
          className={styles.options}
        >
          {filtered.map(item => (
            <span
              key={item.id}
              onClick={() => {
                onSelectItem(item);
                setSearch(item.name);
              }}
              className={styles.option}
              style={{
                backgroundColor: item.id === props.selected ? 'var(--color-primary)' : 'transparent',
              }}
            >
              {item.display ?? item.name}
            </span>
          ))}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Autocomplete = forwardRef(Component);

Component.displayName = 'Autocomplete';

export type AutocompleteProps<T = { id: string; name: string }> = {
  selected?: string | null;
  items: Array<T>;
  loading?: boolean;
  showAll?: boolean;
  onSelectItem: (value: T) => void;
} & InputProps;
