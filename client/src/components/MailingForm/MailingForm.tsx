import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Chip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import {
  decrementGiftCardQuantity,
  incrementGiftCardQuantity,
} from '../../redux/giftCardSlice';
import { RootState } from '../../redux/store';
import GiftCardDialog from '../GiftCardDialog/GiftCardDialog';
import { Mailing } from '../../types';

interface GiftCard {
  id: number;
  name: string;
  remainingQuantity: number;
  expirationDate: string;
  price: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Название рассылки обязательно'),
  giftCards: Yup.array()
    .of(
      Yup.object({
        id: Yup.number().required(),
        name: Yup.string().required(),
        remainingQuantity: Yup.number().required(),
        expirationDate: Yup.string().required(),
        price: Yup.number().required(),
      })
    )
    .required('Выбор подарков обязателен'),
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
  const dispatch = useDispatch();
  const giftCards = useSelector(
    (state: RootState) => state.giftCards.giftCards
  );
  const [isGiftCardDialogOpen, setIsGiftCardDialogOpen] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleGiftCardSelect = (giftCard: GiftCard) => {
    const selectedCards = formik.values.giftCards || [];
    const existingCard = selectedCards.find(
      (card: GiftCard) => card.id === giftCard.id
    );

    if (existingCard) {
      existingCard.remainingQuantity += 1;
    } else {
      selectedCards.push({ ...giftCard, remainingQuantity: 1 });
    }

    formik.setFieldValue('giftCards', selectedCards);
    dispatch(decrementGiftCardQuantity(giftCard.id));
  };

  const handleGiftCardRemove = (giftCardId: number) => {
    const selectedCards = formik.values.giftCards || [];
    const cardToRemove = selectedCards.find(
      (card: GiftCard) => card.id === giftCardId
    );

    if (cardToRemove) {
      cardToRemove.remainingQuantity -= 1;
      if (cardToRemove.remainingQuantity === 0) {
        const updatedCards = selectedCards.filter(
          (card: GiftCard) => card.id !== giftCardId
        );
        formik.setFieldValue('giftCards', updatedCards);
      } else {
        formik.setFieldValue('giftCards', [...selectedCards]);
      }
      dispatch(incrementGiftCardQuantity(giftCardId));
    }
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
      {formik.values.giftCards && (
        <Box display='flex' flexWrap='wrap' mt={2}>
          {formik.values.giftCards.map((giftCard: GiftCard) => (
            <Chip
              key={giftCard.id}
              label={`${giftCard.name} (${giftCard.remainingQuantity})`}
              onDelete={() => handleGiftCardRemove(giftCard.id)}
              color='primary'
              style={{ margin: 4 }}
            />
          ))}
        </Box>
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

      <GiftCardDialog
        open={isGiftCardDialogOpen}
        onClose={() => setIsGiftCardDialogOpen(false)}
        onAdd={() => setIsGiftCardDialogOpen(false)}
        giftCards={giftCards}
        selectedGiftCards={formik.values.giftCards}
        onSelect={handleGiftCardSelect}
        onRemove={handleGiftCardRemove}
      />
    </form>
  );
};

export default MailingForm;
