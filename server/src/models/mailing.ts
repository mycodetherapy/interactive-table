import { GiftCard } from './giftCard';

export type Mailing = {
  id: number;
  name: string;
  giftCards: MailingGift[];
  mailingDate: string;
  daysToClaim: number;
  daysToReceive: number;
  description: string;
  cardNumbers: string;
};

export type MailingGift = {
  mailingId: number;
  giftCardId: number;
  quantity: number;
};
