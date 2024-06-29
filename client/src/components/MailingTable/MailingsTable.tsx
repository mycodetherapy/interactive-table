import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  removeMailing,
  updateMailing,
  addMailing,
} from '../../redux/mailingsSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import MailingForm from '../MailingForm/MailingForm';
import { ConfirmationModal } from '../Modals/ConfirmationModal';
import { Mailing, MailingGift, RestockGift } from '../../types';
import { restockGiftCards } from '../../redux/giftCardSlice';
import moment from 'moment';

const MailingsTable: React.FC = () => {
  const mailings = useSelector((state: RootState) => state.mailings.mailings);
  const dispatch = useDispatch();
  const [editingMailing, setEditingMailing] = useState<Mailing | null>(null);
  const [confirmMoalOpen, setConfirmMoalOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const isExistMailing = (currentId: number) =>
    !!mailings.find((mailing) => mailing.id === currentId);

  const handleCreate = () => {
    const newMailing: Mailing = {
      id: Date.now(),
      name: 'Новая рассылка',
      gifts: [],
      daysToClaim: 0,
      daysToReceive: 0,
      description: '',
      cardNumbers: '',
      date: new Date(),
    };
    setEditingMailing(newMailing);
    handleShowForm();
  };

  const handleEdit = (newMailing: Mailing) => {
    setEditingMailing(newMailing);
    handleShowForm();
  };
  const handleConfirmation = (newMailing: Mailing) => {
    setEditingMailing(newMailing);
    handleShowConfirmation();
  };

  const handleSave = () => {
    if (editingMailing) {
      const isExist = isExistMailing(editingMailing.id);
      isExist
        ? dispatch(updateMailing(editingMailing))
        : dispatch(addMailing(editingMailing));
      handleShowConfirmation();
      handleShowForm();
    }
  };

  const confirmModalData = () => {
    let data = { title: 'акции', acceptTitle: 'акцию' };
    const isExist = isExistMailing(editingMailing?.id || NaN);
    if (isExist) {
      data.title = `Редактировние существующей ${data.title}`;
      data.acceptTitle = `Сохранить ${data.acceptTitle}`;
    } else {
      data.title = `Создание новой ${data.title}`;
      data.acceptTitle = `Создать ${data.acceptTitle}`;
    }
    return data;
  };

  const handleShowConfirmation = () => {
    setConfirmMoalOpen(!confirmMoalOpen);
  };

  const handleShowForm = () => {
    setFormOpen(!formOpen);
  };

  const handleRemoveMailing = (
    mailingId: number,
    restockGifts: RestockGift[]
  ) => {
    dispatch(removeMailing(mailingId));
    dispatch(restockGiftCards(restockGifts));
  };

  const totalRemainingQuantity = (gifts: MailingGift[]): number => {
    return gifts.reduce((total, gifts) => total + gifts.quantity, 0);
  };

  return (
    <TableContainer>
      <Button variant='contained' color='primary' onClick={handleCreate}>
        Добавить рассылку
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название рассылки</TableCell>
            <TableCell>Дата рассылки</TableCell>
            <TableCell>Кол-во отправленных подарков</TableCell>
            <TableCell>Отмена рассылки</TableCell>
            <TableCell>Редактировать рассылку</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mailings.map((mailing) => (
            <TableRow key={mailing.id}>
              <TableCell>{mailing.name}</TableCell>
              <TableCell>{moment(mailing.date).format('DD.MM.YYYY')}</TableCell>
              <TableCell>{totalRemainingQuantity(mailing.gifts)}</TableCell>
              <TableCell>
                <Button
                  color='secondary'
                  onClick={() => {
                    const restockGifts: RestockGift[] = mailing.gifts.map(
                      (card: MailingGift) => ({
                        id: card.giftCardId,
                        quantity: card.quantity,
                      })
                    );
                    handleRemoveMailing(mailing.id, restockGifts);
                  }}
                >
                  Удалить
                </Button>
              </TableCell>
              <TableCell>
                <Button color='primary' onClick={() => handleEdit(mailing)}>
                  Редактировать
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={formOpen} onClose={() => setEditingMailing(null)}>
        <DialogTitle>Редактировать рассылку</DialogTitle>
        <DialogContent>
          {editingMailing && (
            <MailingForm
              initialValues={editingMailing}
              onSubmit={handleConfirmation}
              onClose={handleShowForm}
            />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={confirmMoalOpen}
        title={confirmModalData().title}
        acceptTitle={confirmModalData().acceptTitle}
        acceptAction={handleSave}
        cancelAction={handleShowConfirmation}
      />
    </TableContainer>
  );
};

export default MailingsTable;
