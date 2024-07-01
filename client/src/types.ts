export type GiftCard = {
  id: number;
  name: string;
  remainingQuantity: number;
  expirationDate: string;
  price: number;
};

export type MailingGift = {
  mailingId: number;
  giftCardId: number;
  quantity: number;
};

export type Mailing = {
  id: number;
  name: string;
  gifts: MailingGift[];
  date: string;
  daysToClaim: number;
  daysToReceive: number;
  description: string;
  cardNumbers: string;
};
