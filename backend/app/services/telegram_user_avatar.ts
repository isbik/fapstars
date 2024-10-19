import env from '#start/env';

type UserProfilePhotos = {
  result: {
    total_count: number;
    photos: {
      file_id: string;
      file_unique_id: string;
    }[][];
  };
};

type File = {
  result: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    file_path: string;
  };
};

export const getUserAvatar = async (userId: string): Promise<string | null> => {
  const response = await fetch(
    `https://api.telegram.org/bot${env.get('BOT_TOKEN')}/getUserProfilePhotos?user_id=${userId}`,
  );

  if (!response.ok) return null;

  const data = (await response.json()) as UserProfilePhotos;

  const photo = data?.result?.photos?.[0];

  if (!photo) return null;

  const avatarFileId = photo?.[2].file_id;

  // Getting avatar url
  const fileResponse = await fetch(
    `https://api.telegram.org/bot${env.get('BOT_TOKEN')}/getFile?file_id=${avatarFileId}`,
  );

  if (!fileResponse.ok) return null;

  const fileData = (await fileResponse.json()) as File;

  const file_path = fileData?.result?.file_path;

  if (!file_path) return null;

  const avatarUrl = `https://api.telegram.org/file/bot${env.get('BOT_TOKEN')}/${file_path}`;

  return avatarUrl;
};
