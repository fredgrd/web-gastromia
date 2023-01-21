export interface Card {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
}

// --------------------------------------------------------------------------
// Helpers

export const isCard = (card: any): card is Card => {
  const unsafeCast = card as Card;

  return (
    unsafeCast.id !== undefined &&
    unsafeCast.brand !== undefined &&
    unsafeCast.last4 !== undefined &&
    unsafeCast.exp_month !== undefined &&
    unsafeCast.exp_year !== undefined
  );
};

export const isCards = (cards: any[]): cards is Card[] => {
  const areCards = cards.reduce((acc, curr) => {
    if (isCard(curr)) {
      return acc * 1;
    } else {
      return acc * 0;
    }
  }, 1);

  return areCards === 1;
};
