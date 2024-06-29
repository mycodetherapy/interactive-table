export type GiftCard = {
  id: number;
  name: string;
  remainingQuantity: number;
  expirationDate: Date;
  price: number;
};

export type MailingGift = {
  mailingId: number;
  giftCardId: number;
  giftName: string;
  quantity: number;
};

export type RestockGift = {
  id: number;
  quantity: number;
};

export type Mailing = {
  id: number;
  name: string;
  giftCards: GiftCard[];
  // gifts: MailingGift[];
  date: Date;
  daysToClaim: number;
  daysToReceive: number;
  description: string;
  cardNumbers: string;
};
