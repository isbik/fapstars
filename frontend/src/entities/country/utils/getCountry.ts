import { COUNTRIES } from '../constants';

export const getCountry = (countryCode?: string | null) => {
  if (!countryCode) return null;
  return COUNTRIES.find(country => country.code === countryCode) || null;
};
