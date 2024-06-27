import React from 'react';
import { useDispatch } from 'react-redux';
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
import {
  decrementGiftCardQuantity,
  incrementGiftCardQuantity,
} from '../../redux/giftCardSlice';
import { GiftCard } from '../../types';

interface GiftCardDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  giftCards: GiftCard[];
  selectedGiftCards: GiftCard[];
  onSelect: (giftCard: GiftCard) => void;
  onRemove: (giftCardId: number) => void;
}

const GiftCardDialog: React.FC<GiftCardDialogProps> = ({
  open,
  onClose,
  onAdd,
  giftCards,
  selectedGiftCards,
  onSelect,
  onRemove,
}) => {
  const dispatch = useDispatch();

  const handleSelect = (giftCard: GiftCard) => {
    onSelect(giftCard);
    dispatch(decrementGiftCardQuantity(giftCard.id));
  };

  const handleRemove = (giftCardId: number) => {
    onRemove(giftCardId);
    dispatch(incrementGiftCardQuantity(giftCardId));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Выберите подарок</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {giftCards.map((card) => {
            const selectedCard = selectedGiftCards.find(
              (selectedCard) => selectedCard.id === card.id
            );
            const selectedQuantity = selectedCard
              ? selectedCard.remainingQuantity
              : 0;

            return (
              <Grid item xs={4} key={card.id}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>{card.name}</Typography>
                    <Typography>Осталось: {card.remainingQuantity}</Typography>
                    <Typography>
                      Дата сгорания: {card.expirationDate}
                    </Typography>
                    <Typography>Номинал: {card.price}</Typography>
                    <Box
                      sx={{
                        minHeight: '31px',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button
                        onClick={() => handleSelect(card)}
                        color='primary'
                        variant='contained'
                        startIcon={<AddIcon />}
                        disabled={card.remainingQuantity === 0}
                        size='small'
                        sx={{ minHeight: '31px' }}
                      >
                        {selectedQuantity > 0 && `(${selectedQuantity})`}
                      </Button>
                      {selectedQuantity > 0 && (
                        <Button
                          onClick={() => handleRemove(card.id)}
                          color='secondary'
                          variant='contained'
                          startIcon={<RemoveIcon />}
                          size='small'
                          sx={{ minHeight: '31px' }}
                        />
                      )}
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
        <Button onClick={onAdd} color='primary'>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiftCardDialog;
