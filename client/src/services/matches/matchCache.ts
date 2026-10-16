export type MatchCard = {
  name: string;
  city: string;
  pic: string;
  hobbies: string[];
  raw: any;
  score?: number;
};

let cachedCards: MatchCard[] | null = null;
let cachedSemantic = false;

export const getCachedMatches = (): { cards: MatchCard[]; semantic: boolean } | null => {
  if (!cachedCards) return null;
  return { cards: cachedCards, semantic: cachedSemantic };
};

export const setCachedMatches = (cards: MatchCard[], semantic: boolean) => {
  cachedCards = cards;
  cachedSemantic = semantic;
};

export const clearCachedMatches = () => {
  cachedCards = null;
  cachedSemantic = false;
};
