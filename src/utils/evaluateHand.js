export function evaluateHand(cards) {
  const suits = {};
  const ranks = {};
  const values = [];
  const cardsByValue = {};

  function getVal(card) {
    const r = card.slice(1);
    if (r === 'J') return 11;
    if (r === 'Q') return 12;
    if (r === 'K') return 13;
    if (r === 'A') return 14;
    return parseInt(r);
  }

  // 準備
  cards.forEach(card => {
    const suit = card[0];
    const val = getVal(card);
    values.push(val);
    suits[suit] = (suits[suit] || []);
    suits[suit].push(card);
    ranks[val] = (ranks[val] || []);
    ranks[val].push(card);
    cardsByValue[val] = cardsByValue[val] || [];
    cardsByValue[val].push(card);
  });

  const uniqueVals = [...new Set(values)].sort((a, b) => b - a);
  const rankCounts = Object.entries(ranks).map(([v, arr]) => ({ value: parseInt(v), count: arr.length, cards: arr }));
  rankCounts.sort((a, b) => b.count - a.count || b.value - a.value);

  const flushSuit = Object.keys(suits).find(s => suits[s].length >= 5);
  const flushCards = flushSuit ? suits[flushSuit] : [];

  function findStraight(cards) {
    const vals = [...new Set(cards.map(getVal))].sort((a, b) => a - b);
    if (vals.includes(14)) vals.unshift(1); // Aを1としても使える

    for (let i = vals.length - 1; i >= 4; i--) {
      const slice = vals.slice(i - 4, i + 1);
      if (slice[4] - slice[0] === 4 &&
          slice.every((v, idx, arr) => idx === 0 || v === arr[idx - 1] + 1)) {
        const straightCards = [];
        const used = new Set();
        for (let v of slice.reverse()) {
          for (let card of cards) {
            if (getVal(card) === v && !used.has(card)) {
              straightCards.push(card);
              used.add(card);
              break;
            }
          }
        }
        return straightCards;
      }
    }
    return null;
  }

  // ストレートフラッシュ
  const sf = flushCards.length >= 5 ? findStraight(flushCards) : null;
  if (sf) return { rank: 'Straight Flush', bestFive: sf };

  // フォーカード
  if (rankCounts[0].count === 4) {
    const kicker = cards.filter(c => !rankCounts[0].cards.includes(c))
                        .sort((a, b) => getVal(b) - getVal(a))[0];
    return { rank: 'Four of a Kind', bestFive: [...rankCounts[0].cards, kicker] };
  }

  // フルハウス
  if (rankCounts[0].count === 3 && rankCounts[1]?.count >= 2) {
    return {
      rank: 'Full House',
      bestFive: [...rankCounts[0].cards.slice(0,3), ...rankCounts[1].cards.slice(0,2)]
    };
  }

  // フラッシュ
  if (flushCards.length >= 5) {
    const sortedFlush = flushCards.sort((a, b) => getVal(b) - getVal(a));
    return { rank: 'Flush', bestFive: sortedFlush.slice(0, 5) };
  }

  // ストレート
  const straight = findStraight(cards);
  if (straight) return { rank: 'Straight', bestFive: straight };

  // スリーカード
  if (rankCounts[0].count === 3) {
    const kickers = cards.filter(c => !rankCounts[0].cards.includes(c))
                         .sort((a, b) => getVal(b) - getVal(a)).slice(0,2);
    return { rank: 'Three of a Kind', bestFive: [...rankCounts[0].cards, ...kickers] };
  }

  // ツーペア
  if (rankCounts[0].count === 2 && rankCounts[1]?.count === 2) {
    const combined = [...rankCounts[0].cards, ...rankCounts[1].cards];
    const kicker = cards.filter(c => !combined.includes(c))
                        .sort((a, b) => getVal(b) - getVal(a))[0];
    return { rank: 'Two Pair', bestFive: [...combined, kicker] };
  }

  // ワンペア
  if (rankCounts[0].count === 2) {
    const kickers = cards.filter(c => !rankCounts[0].cards.includes(c))
                         .sort((a, b) => getVal(b) - getVal(a)).slice(0,3);
    return { rank: 'One Pair', bestFive: [...rankCounts[0].cards, ...kickers] };
  }

  // ハイカード
  const sorted = [...cards].sort((a, b) => getVal(b) - getVal(a));
  return { rank: 'High Card', bestFive: sorted.slice(0, 5) };
}
