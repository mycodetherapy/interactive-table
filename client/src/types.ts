export type GiftCard = {
  id: number;
  name: string;
  remainingQuantity: number;
  expirationDate: string;
  price: number;
};

export type RestockGift = {
  id: number;
  quantity: number;
};

export type Mailing = {
  id: number;
  name: string;
  giftCards: GiftCard[];
  date: string;
  daysToClaim: number;
  daysToReceive: number;
  description: string;
  cardNumbers: string;
};
