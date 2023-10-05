import packageInfo from '../../package.json';

export const environment = {
  production: false,
  lastVersion: packageInfo.version,
  lastUpdate: packageInfo.dateVersion,
  minVersion: packageInfo.minVersion,
  isFree: false,
  pathTranslate: './assets/i18n/'
};
