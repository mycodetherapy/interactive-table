import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  Mailing,
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

const MailingsTable: React.FC = () => {
  const mailings = useSelector((state: RootState) => state.mailings.mailings);
  const dispatch = useDispatch();
  const [editingMailing, setEditingMailing] = useState<Mailing | null>(null);
  const [confirmMoalOpen, setConfirmMoalOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  const isExistMailing = (currentId: number) =>
    !!mailings.find((mailing) => mailing.id === currentId);

  const handleEdit = (newMailing: Mailing) => {
    setEditingMailing(newMailing);
    setFormOpen(!formOpen);
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
      setFormOpen(!formOpen);
    }
  };

  const handleShowConfirmation = () => {
    setConfirmMoalOpen(!confirmMoalOpen);
  };

  const handleCreate = () => {
    const newMailing: Mailing = {
      id: Date.now(),
      name: 'Новая рассылка',
      giftCard: null,
      giftsSent: 0,
      daysToClaim: 0,
      daysToReceive: 0,
      description: '',
      cardNumbers: '',
      date: new Date().toISOString().substring(0, 10),
    };
    setEditingMailing(newMailing);
    setFormOpen(!formOpen);
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
              <TableCell>{mailing.date}</TableCell>
              <TableCell>{mailing.giftsSent}</TableCell>
              <TableCell>
                <Button
                  color='secondary'
                  onClick={() => dispatch(removeMailing(mailing.id))}
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
