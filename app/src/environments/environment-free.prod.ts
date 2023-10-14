import packageInfo from '../../package.json';

export const environment = {
  production: true,
  lastVersion: packageInfo.version,
  lastUpdate: packageInfo.dateVersion,
  minVersion: packageInfo.minVersion,
  isFree: true,
  pathTranslate: './assets/i18n/'
};
