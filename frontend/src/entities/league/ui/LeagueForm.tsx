import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { COUNTRIES } from '~/entities/country/constants';
import { CreateLeagueRequest } from '~/entities/league/types';
import { ValidationError } from '~/shared/types';
import { AvatarEdit, Button, Checkbox, Input } from '~/shared/ui';
import { Autocomplete } from '~/shared/ui/Inputs/Autocomplete/Autocomplete';

type LeagueFormProps = {
  initPayload?: Partial<CreateLeagueRequest>;
  onSubmit: (event: FormEvent<HTMLFormElement>, payload: Partial<CreateLeagueRequest>) => void;
  isLoading?: boolean;
  errors?: Map<ValidationError[keyof ValidationError], ValidationError> | null;
};
const LeagueForm = ({ isLoading, errors, initPayload, onSubmit }: LeagueFormProps) => {
  const [payload, setPayload] = useState<Partial<CreateLeagueRequest>>(
    initPayload ?? {
      name: '',
      socialLink: '',
      isAiModel: false,
    },
  );

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    switch (e.target.type) {
      case 'text':
      case 'select-one':
        setPayload({ ...payload, [e.target.name]: e.target.value });
        break;
      case 'checkbox':
        setPayload({ ...payload, [e.target.name]: e.target.checked });
        break;
      default:
        console.error('Unsupported input type');
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const renderAvatar = () => {
    if (file) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="league_avatar"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      );
    }

    if (payload?.avatar) {
      return (
        <img src={payload?.avatar} alt="league_avatar" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'magenta',
        }}
      >
        AI
      </div>
    );
  };

  return (
    <>
      <form
        onSubmit={event => onSubmit(event, payload)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              width: 116,
              height: 116,
              position: 'relative',
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: 9999, overflow: 'hidden' }}>
              {renderAvatar()}
            </div>
            <AvatarEdit
              style={{
                position: 'absolute',
                right: -10,
                bottom: -10,
                zIndex: 200,
              }}
              onClick={() => avatarInputRef.current?.click()}
            />
          </div>
          <input
            type="file"
            name="avatar"
            ref={avatarInputRef}
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>

        <Input
          label="League name"
          placeholder="Enter league name"
          name="name"
          onChange={handleOnChange}
          errors={[errors?.get('name')?.message ?? '']}
          value={payload?.name ?? ''}
        />
        <Input
          label="Social link"
          placeholder="https://"
          name="socialLink"
          onChange={handleOnChange}
          errors={[errors?.get('socialLink')?.message ?? '']}
          value={payload?.socialLink ?? ''}
        />
        <Autocomplete
          label="Country"
          name="countryCode"
          onSelectItem={item => setPayload({ ...payload, countryCode: item.id })}
          selected={payload?.countryCode ?? ''}
          errors={[errors?.get('countryCode')?.message ?? '']}
          items={COUNTRIES.map(country => ({
            id: country.code,
            name: country.name,
            display: (
              <>
                <img
                  style={{ width: 22, height: 28, marginRight: 8 }}
                  src={`https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${country.code}.svg`}
                  alt=""
                />
                {country.name}
              </>
            ),
          }))}
        />
        <Checkbox
          name="isAiModel"
          label={'AI model'}
          checked={payload['isAiModel'] ?? false}
          onChange={handleOnChange}
        />

        <Button css={{ marginTop: 'auto' }} disabled={isLoading}>
          {initPayload ? 'Update' : 'Create'} League
        </Button>
      </form>
    </>
  );
};

export { LeagueForm };
