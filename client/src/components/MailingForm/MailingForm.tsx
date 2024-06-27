import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { Mailing } from '../../redux/mailingsSlice';

interface GiftCard {
  id: number;
  name: string;
  remainingQuantity: number;
  expirationDate: string;
  price: number;
}

const giftCards: GiftCard[] = [
  {
    id: 1,
    name: 'Gift Card 1',
    remainingQuantity: 10,
    expirationDate: '2024-07-10',
    price: 100,
  },
  {
    id: 2,
    name: 'Gift Card 2',
    remainingQuantity: 5,
    expirationDate: '2024-07-15',
    price: 50,
  },
  {
    id: 3,
    name: 'Gift Card 3',
    remainingQuantity: 8,
    expirationDate: '2024-07-20',
    price: 75,
  },
  {
    id: 4,
    name: 'Gift Card 4',
    remainingQuantity: 15,
    expirationDate: '2024-08-01',
    price: 150,
  },
  {
    id: 5,
    name: 'Gift Card 5',
    remainingQuantity: 2,
    expirationDate: '2024-06-30',
    price: 25,
  },
  {
    id: 6,
    name: 'Gift Card 6',
    remainingQuantity: 20,
    expirationDate: '2024-08-10',
    price: 200,
  },
];

const validationSchema = Yup.object({
  name: Yup.string().required('Название рассылки обязательно'),
  giftCard: Yup.object().required('Выбор подарка обязателен'),
  giftsSent: Yup.number()
    .min(1, 'Кол-во подарков должно быть больше 0')
    .required('Кол-во подарков обязательно'),
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

const MailingForm: React.FC<{
  initialValues: any;
  onSubmit: (values: Mailing) => void;
}> = ({ initialValues, onSubmit }) => {
  const [isGiftCardDialogOpen, setIsGiftCardDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleGiftCardSelect = (giftCard: GiftCard) => {
    formik.setFieldValue('giftCard', giftCard);
    setIsGiftCardDialogOpen(false);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        label='Название рассылки'
        name='name'
        value={formik.values.name}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
        fullWidth
        margin='normal'
      />
      <Button variant='outlined' onClick={() => setIsGiftCardDialogOpen(true)}>
        Выбрать подарок
      </Button>
      {formik.values.giftCard && (
        <div>
          <Typography variant='body1'>
            Выбранный подарок: {formik.values.giftCard.name}
          </Typography>
        </div>
      )}
      <TextField
        label='Кол-во подарков'
        name='giftsSent'
        type='number'
        value={formik.values.giftsSent}
        onChange={formik.handleChange}
        error={formik.touched.giftsSent && Boolean(formik.errors.giftsSent)}
        helperText={formik.touched.giftsSent && formik.errors.giftsSent}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Кол-во дней на взятие подарка'
        name='daysToClaim'
        type='number'
        value={formik.values.daysToClaim}
        onChange={formik.handleChange}
        error={formik.touched.daysToClaim && Boolean(formik.errors.daysToClaim)}
        helperText={formik.touched.daysToClaim && formik.errors.daysToClaim}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Кол-во дней на получение подарка'
        name='daysToReceive'
        type='number'
        value={formik.values.daysToReceive}
        onChange={formik.handleChange}
        error={
          formik.touched.daysToReceive && Boolean(formik.errors.daysToReceive)
        }
        helperText={formik.touched.daysToReceive && formik.errors.daysToReceive}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Описание акции'
        name='description'
        value={formik.values.description}
        onChange={formik.handleChange}
        error={formik.touched.description && Boolean(formik.errors.description)}
        helperText={formik.touched.description && formik.errors.description}
        fullWidth
        margin='normal'
      />
      <TextField
        label='Номера карт'
        name='cardNumbers'
        value={formik.values.cardNumbers}
        onChange={formik.handleChange}
        error={formik.touched.cardNumbers && Boolean(formik.errors.cardNumbers)}
        helperText={formik.touched.cardNumbers && formik.errors.cardNumbers}
        fullWidth
        margin='normal'
      />
      <Button type='submit' color='primary'>
        Сохранить
      </Button>

      <Dialog
        open={isGiftCardDialogOpen}
        onClose={() => setIsGiftCardDialogOpen(false)}
      >
        <DialogTitle>Выберите подарок</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {giftCards.map((card) => (
              <Grid item xs={4} key={card.id}>
                <Card onClick={() => handleGiftCardSelect(card)}>
                  <CardContent>
                    <Typography variant='h6'>{card.name}</Typography>
                    <Typography>Осталось: {card.remainingQuantity}</Typography>
                    <Typography>
                      Дата сгорания: {card.expirationDate}
                    </Typography>
                    <Typography>Номинал: {card.price}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsGiftCardDialogOpen(false)}
            color='primary'
          >
            Отмена
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default MailingForm;
