import { version, dateVersion } from '../../package.json';

export const environment = {
  production: true,
  lastVersion: version,
  lastUpdate: dateVersion,
  isFree: true,
  pathTranslate: './assets/i18n/'
};
