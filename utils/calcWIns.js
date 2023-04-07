export function calcWins(betAmount, oddsType, price) {
  const wager = Number(betAmount);
  if (wager) {
    if ([1, 'malayPrice', 4, 'indoPrice'].includes(oddsType)) {
      if (price >= 0) {
        return wager * price;
      }

      return wager;
    }

    if ([2, 'hongKongPrice'].includes(oddsType)) {
      return wager * price;
    }

    if ([3, 'decimalPrice'].includes(oddsType)) {
      return wager * price - wager;
    }

    if ([5, 'americanPrice'].includes(oddsType)) {
      if (price >= 0) {
        return wager * (price / 100);
      }

      return wager;
    }
  }

  return 0;
}

export function calcParlayWins(betAmount, bets) {
  const wins = bets.map((bet) => {
    const wager = Number(betAmount);
    return wager * bet.selection.oddsPrice.parlayPrice - wager;
  });

  return wins.reduce((acc, cur) => acc + cur, 0);
}
