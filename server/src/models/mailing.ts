import { GiftCard } from './giftCard';

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
