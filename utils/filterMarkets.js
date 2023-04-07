import { mapBetTypeName } from './mapBetTypeName';

export function filterMarkets(markets) {
  let sortedMarkets = [];
  let finalData = [];

  // console.log('availableMarkets', markets);

  sortedMarkets = generateMarketsSorting(
    filterBetTypes(markets[0].sportType),
    markets,
  );

  let section = [];
  sortedMarkets.map((item, index) => {
    if (index % 3 === 2 || index === sortedMarkets.length - 1) {
      section.push(item);
      finalData.push(section);
      section = [];
    } else {
      section.push(item);
    }
  });

  return finalData;
}

const prefixData = {
  selections: [],
  marketStatus: 'closed',
};

function generateMarketsSorting(betTypes, markets) {
  return betTypes.map((betType) => ({
    ...prefixData,
    ...(markets.find((x) => x.betType === betType) || {}),
    betType,
    displayBetTypeName: mapBetTypeName(betType),
  }));
}

export function filterBetTypes(sportType) {
  switch (sportType) {
    case 1: // Soccer
      return [5, 1, 3, 15, 7, 8];
    case 2: // Basketball
    case 3: // Football
      return [20, 1, 3, 21, 7, 8];
    case 4: // Ice Hockey
      return [20, 1, 3, 2];
    case 5: // Tennis
      return [20, 153, 3, 1];
    case 6: // Volleyball
    case 9: // Badminton
      return [20, 704, 705, 701, 706];
    case 16: // Boxing
    case 25: // Darts
    case 31: // Entertainment
      return [20, 1, 3];
    case 45: // BeachVolleyball
      return [20, 704, 705];
    case 56: // Lotto
      return [20, 1, 3, 2, 7, 8];
    default:
      return [20, 1, 3, 2];
  }
}
