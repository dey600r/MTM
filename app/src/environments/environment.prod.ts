import { version, dateVersion } from '../../package.json';

export const environment = {
  production: true,
  lastVersion: version,
  lastUpdate: dateVersion,
  isFree: false,
  pathTranslate: './assets/i18n/'
};
