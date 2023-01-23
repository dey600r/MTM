import packageInfo from '../../package.json';

export const environment = {
  production: true,
  lastVersion: packageInfo.version,
  lastUpdate: packageInfo.dateVersion,
  isFree: false,
  pathTranslate: './assets/i18n/'
};
