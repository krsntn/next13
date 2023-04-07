import { t } from 'i18next';

export function mapBetTypeName(betType) {
  switch (betType) {
    case 1:
      return t(`betTypes.handicap`);
    case 2:
      return t(`betTypes.odd_even`);
    case 3:
      return t(`betTypes.over_under`);
    case 5:
      return t(`betTypes.ft_1x2`);
    case 7:
      return t(`betTypes.1h_handicap`);
    case 8:
      return t(`betTypes.1h_over_under`);
    case 15:
      return t(`betTypes.1h_1x2`);
    case 20:
      return t(`betTypes.moneyline`);
    case 21:
      return t(`betTypes.1st_moneyline`);
    case 153:
      return t(`betTypes.game_handicap`);
    case 701:
      return t(`betTypes.match_handicap`);
    case 704:
      return t(`betTypes.match_point_handicap`);
    case 705:
      return t(`betTypes.match_point_over_under`);
    case 706:
      return t(`betTypes.match_point_odd_even`);
  }
}

export const twoOptionsBetTypes = [
  1, 2, 3, 7, 8, 20, 21, 153, 701, 704, 705, 706,
];
