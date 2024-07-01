import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { GiftCard, MailingGift } from '../../types';
import { RootState } from '../../redux/store';
import moment from 'moment';
import {
  fetchGiftCards,
  saveGiftCards,
} from '../../redux/actions/giftsActions';

interface GiftCardDialogProps {
  open: boolean;
  onClose: () => void;
  selectedGiftCards: MailingGift[];
  onSelect: (giftCard: GiftCard) => void;
  onRemove: (giftCardId: number) => void;
}

const GiftCardDialog: React.FC<GiftCardDialogProps> = ({
  open,
  onClose,
  selectedGiftCards,
  onSelect,
  onRemove,
}) => {
  const dispatch = useDispatch();

  const giftCards = useSelector(
    (state: RootState) => state.giftCards.giftCards
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchGiftCards());
    }
  }, [open, dispatch]);

  const handleSave = () => {
    const updates = selectedGiftCards.map((selectedCard) => ({
      id: selectedCard.giftCardId,
      remainingQuantity:
        giftCards.find((card) => card.id === selectedCard.giftCardId)
          ?.remainingQuantity ?? 0 - selectedCard.quantity,
    }));

    dispatch(saveGiftCards(updates));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Выберите подарок</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {giftCards.map((card) => {
            const selectedCard = selectedGiftCards.find(
              (selectedCard) => selectedCard.giftCardId === card.id
            );
            const selectedQuantity = selectedCard ? selectedCard.quantity : 0;
            const isExpired = moment(card.expirationDate).isBefore(
              new Date(),
              'day'
            );

            return (
              <Grid item xs={4} key={card.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{card.name}</Typography>
                    <Typography>Осталось: {card.remainingQuantity}</Typography>
                    <Typography>
                      Дата сгорания:{' '}
                      {moment(card.expirationDate).format('DD.MM.YYYY')}
                    </Typography>
                    <Typography>Номинал: {card.price}</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        '& .MuiButton-startIcon': {
                          margin: 0,
                        },
                      }}
                    >
                      <Button
                        onClick={() => onSelect(card)}
                        color='primary'
                        variant='contained'
                        startIcon={<AddIcon />}
                        disabled={card.remainingQuantity === 0 || isExpired}
                        size='small'
                        sx={{ minHeight: '31px' }}
                      >
                        {selectedQuantity > 0 && `(${selectedQuantity})`}
                      </Button>

                      <Button
                        onClick={() => onRemove(card.id)}
                        color='secondary'
                        variant='contained'
                        startIcon={<RemoveIcon />}
                        disabled={!selectedQuantity}
                        size='small'
                        sx={{ minHeight: '31px', margin: 0 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Отмена
        </Button>
        <Button onClick={handleSave} color='primary'>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiftCardDialog;
