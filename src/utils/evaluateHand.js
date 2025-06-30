export function evaluateHand(cards) {
  const sorted = [...cards].sort((a, b) => getVal(b) - getVal(a))
  return {
    rank: 'High Card',
    bestFive: sorted.slice(0, 5)
  }
}

function getVal(card) {
  const r = card.slice(1)
  if (r === 'J') return 11
  if (r === 'Q') return 12
  if (r === 'K') return 13
  if (r === 'A') return 14
  return parseInt(r)
}
