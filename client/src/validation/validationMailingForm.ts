import * as Yup from 'yup';
export const validationMailingFormSchema = Yup.object({
  name: Yup.string().required('Название рассылки обязательно'),
  giftCards: Yup.array().min(1, 'Выбор подарков обязателен'),
  daysToClaim: Yup.number()
    .min(2, 'Кол-во дней на взятие должно быть не менее 2')
    .required('Кол-во дней на взятие обязательно'),
  daysToReceive: Yup.number()
    .min(2, 'Кол-во дней на получение должно быть не менее 2')
    .required('Кол-во дней на получение обязательно'),
  description: Yup.string()
    .max(500, 'Описание акции не должно превышать 500 символов')
    .required('Описание акции обязательно'),
  cardNumbers: Yup.string()
    .matches(/^[0-9,]*$/, 'Только цифры и запятые')
    .max(5000, 'Номера карт не должны превышать 5000 символов')
    .required('Номера карт обязательны'),
});
