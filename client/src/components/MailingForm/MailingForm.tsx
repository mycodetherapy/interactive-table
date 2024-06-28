import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Chip } from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  decrementGiftCardQuantity,
  incrementGiftCardQuantity,
} from '../../redux/giftCardSlice';
import GiftCardDialog from '../GiftCardDialog/GiftCardDialog';
import { GiftCard, Mailing } from '../../types';
import { validationMailingFormSchema as validationSchema } from '../../validation/validationMailingForm';

interface MailingFormProps {
  initialValues: any;
  onSubmit: (values: Mailing) => void;
  onClose: () => void;
}

const MailingForm: React.FC<MailingFormProps> = ({
  initialValues,
  onSubmit,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);

  useEffect(() => {
    return () => onClose();
  }, []);

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

  const handleShowGiftDialog = () => {
    setIsGiftDialogOpen(!isGiftDialogOpen);
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
      <Button variant='outlined' onClick={handleShowGiftDialog}>
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
      <Button color='primary' onClick={onClose}>
        Отменить
      </Button>

      <GiftCardDialog
        open={isGiftDialogOpen}
        onClose={handleShowGiftDialog}
        selectedGiftCards={formik.values.giftCards}
        onSelect={handleGiftCardSelect}
        onRemove={handleGiftCardRemove}
      />
    </form>
  );
};

export default MailingForm;
