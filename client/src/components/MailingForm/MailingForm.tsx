import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { TextField, Button, Box, Chip, Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  decrementGiftCardQuantity,
  incrementGiftCardQuantity,
} from '../../redux/slices/giftCardSlice';
import GiftCardDialog from '../GiftCardDialog/GiftCardDialog';
import { GiftCard, Mailing, MailingGift } from '../../types';
import { validationMailingFormSchema as validationSchema } from '../../validation/validationMailingForm';
import { RootState } from '../../redux/store';

import { fetchGiftCardsByIds } from '../../redux/actions/giftsActions';
import moment from 'moment';

interface MailingFormProps {
  initialValues: Mailing;
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
  const currentGiftCards = useSelector(
    (state: RootState) => state.giftCards.currentGiftCards
  );
  const mailingGifts = initialValues.gifts;

  useEffect(() => {
    if (mailingGifts.length) {
      const ids = mailingGifts.map((gift) => gift.giftCardId);
      dispatch(fetchGiftCardsByIds(ids));
    }
  }, [dispatch, mailingGifts]);

  useEffect(() => {
    return () => onClose();
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleGiftCardSelect = (giftCard: GiftCard) => {
    const selectedGifts = formik.values.gifts || [];
    const existingGift = selectedGifts.find(
      (gift: MailingGift) => gift.giftCardId === giftCard.id
    );

    if (existingGift) {
      existingGift.quantity += 1;
    } else {
      selectedGifts.push({
        mailingId: formik.values.id,
        giftCardId: giftCard.id,
        quantity: 1,
      });
    }

    formik.setFieldValue('gifts', selectedGifts);
    dispatch(decrementGiftCardQuantity(giftCard.id));
  };

  const handleGiftCardRemove = (giftCardId: number) => {
    const selectedGifts = formik.values.gifts || [];
    const giftToRemove = selectedGifts.find(
      (gift: MailingGift) => gift.giftCardId === giftCardId
    );

    if (giftToRemove) {
      giftToRemove.quantity -= 1;
      if (giftToRemove.quantity === 0) {
        const updatedGifts = selectedGifts.filter(
          (gift: MailingGift) => gift.giftCardId !== giftCardId
        );
        formik.setFieldValue('gifts', updatedGifts);
      } else {
        formik.setFieldValue('gifts', [...selectedGifts]);
      }
      dispatch(incrementGiftCardQuantity(giftCardId));
    }
  };

  const handleShowGiftDialog = () => {
    setIsGiftDialogOpen(!isGiftDialogOpen);
  };

  useEffect(() => {
    if (formik.values.mailingDate) {
      formik.setFieldValue(
        'mailingDate',
        moment(formik.values.mailingDate).format('YYYY-MM-DD')
      );
    }
  }, [formik.values.mailingDate]);

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
        size='small'
      />
      <Autocomplete
        multiple
        id='gifts'
        options={[]}
        disableClearable
        value={formik.values.gifts}
        renderTags={(value: MailingGift[]) =>
          value.map((option: MailingGift, index: number) => {
            const giftCard = currentGiftCards.find(
              (gift) => (gift.id = option.giftCardId)
            );
            return (
              <Chip
                key={option.giftCardId}
                label={`${giftCard?.name} (${option.quantity})`}
                onDelete={() => handleGiftCardRemove(option.giftCardId)}
                color='primary'
                style={{ margin: 4 }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant='outlined'
            label='Выберите подарки'
            placeholder='Выберите подарки'
            error={formik.touched.gifts && Boolean(formik.errors.gifts)}
            helperText={formik.touched.gifts && formik.errors.gifts}
            onClick={handleShowGiftDialog}
          />
        )}
      />
      <TextField
        label='Дата рассылки'
        type='date'
        name='mailingDate'
        value={moment(formik.values.mailingDate).format('YYYY-MM-DD')}
        onChange={formik.handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        error={formik.touched.mailingDate && Boolean(formik.errors.mailingDate)}
        helperText={formik.touched.mailingDate && formik.errors.mailingDate}
        fullWidth
        margin='normal'
        InputProps={{
          inputProps: { min: moment().format('YYYY-MM-DD') },
        }}
        size='small'
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
        size='small'
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
        size='small'
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
        multiline
        rows={2}
        maxRows={4}
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
        size='small'
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
        selectedGiftCards={formik.values.gifts}
        onSelect={handleGiftCardSelect}
        onRemove={handleGiftCardRemove}
      />
    </form>
  );
};

export default MailingForm;
