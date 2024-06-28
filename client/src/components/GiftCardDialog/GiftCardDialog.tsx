import React from 'react';
import { useSelector } from 'react-redux';
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
import { GiftCard } from '../../types';
import { RootState } from '../../redux/store';
import moment from 'moment';

interface GiftCardDialogProps {
  open: boolean;
  onClose: () => void;
  selectedGiftCards: GiftCard[];
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
  const giftCards = useSelector(
    (state: RootState) => state.giftCards.giftCards
  );

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
        <Button onClick={onClose} color='primary'>
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiftCardDialog;
