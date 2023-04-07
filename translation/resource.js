import BetRecordEnUs from './resources/en-us/betRecord.json';
import BetSlipEnUs from './resources/en-us/betSlip.json';
import EventPageEnUs from './resources/en-us/eventPage.json';
import GeneralEnUs from './resources/en-us/general.json';
import HomePageEnUs from './resources/en-us/homePage.json';
import LoadingScreenEnUs from './resources/en-us/loadingScreen.json';
import SettingsEnUs from './resources/en-us/settings.json';
import StateCodeEnUs from './resources/en-us/stateCode.json';
import TopbarEnUs from './resources/en-us/topbar.json';
import BetRecordZhCn from './resources/zh-cn/betRecord.json';
import BetSlipZhCn from './resources/zh-cn/betSlip.json';
import EventPageZhCn from './resources/zh-cn/eventPage.json';
import GeneralZhCn from './resources/zh-cn/general.json';
import HomePageZhCn from './resources/zh-cn/homePage.json';
import LoadingScreenZhCn from './resources/zh-cn/loadingScreen.json';
import SettingsZhCn from './resources/zh-cn/settings.json';
import StateCodeZhCn from './resources/zh-cn/stateCode.json';
import TopbarZhCn from './resources/zh-cn/topbar.json';

export default {
  zhcn: {
    translation: {
      ...BetRecordZhCn,
      ...BetSlipZhCn,
      ...EventPageZhCn,
      ...GeneralZhCn,
      ...HomePageZhCn,
      ...LoadingScreenZhCn,
      ...SettingsZhCn,
      ...StateCodeZhCn,
      ...TopbarZhCn,
    },
  },
  enus: {
    translation: {
      ...BetRecordEnUs,
      ...BetSlipEnUs,
      ...EventPageEnUs,
      ...GeneralEnUs,
      ...HomePageEnUs,
      ...LoadingScreenEnUs,
      ...SettingsEnUs,
      ...StateCodeEnUs,
      ...TopbarEnUs,
    },
  },
};
