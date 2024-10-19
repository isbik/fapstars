const validateBalance = (balance: string): void => {
  try {
    BigInt(balance);
  } catch (e) {
    throw new Error('ERROR: Invalid data in LocalStorage');
  }
};

export default validateBalance;
