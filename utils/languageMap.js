import i18n from '../translation/i18n';

export function getSBLanguage() {
  switch (i18n.language) {
    case 'zhcn':
      return 'cs';
    case 'enus':
      return 'en';
    case 'thth':
      return 'th';
    case 'vivn':
      return 'vn';
    case 'zhtw':
      return 'ch';
    default:
      return 'cs';
  }
}

export function getAppLanguage() {
  if (i18n.language.length === 4) {
    return `${i18n.language.substring(0, 2)}-${i18n.language.slice(-2)}`;
  }

  return 'zh-cn';
}
