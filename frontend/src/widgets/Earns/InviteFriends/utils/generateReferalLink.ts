const generateReferalLink = (tgId: string) => {
  const BOT_NAME = 'FapStarsBot';

  return `https://t.me/${BOT_NAME}?start=ref${tgId}`;
};

export default generateReferalLink;
