import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
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
  Pagination,
} from '@mui/material';
import MailingForm from '../MailingForm/MailingForm';
import { ConfirmationModal } from '../Modals/ConfirmationModal';
import { GiftCard, Mailing, MailingGift } from '../../types';
import moment from 'moment';
import {
  createMailing,
  fetchMailings,
  modifyMailing,
  removeMailingById,
} from '../../redux/actions/mailingsActions';
import { getGiftCardsByIdsApi } from '../../api/apiGiftCards';
import { saveGiftCards } from '../../redux/actions/giftsActions';
import { setCurrentPage } from '../../redux/mailingsSlice';
import { LIMIT_ROWS } from '../../constants';

const MailingsTable: React.FC = () => {
  const mailings = useSelector((state: RootState) => state.mailings.mailings);
  const currentPage = useSelector(
    (state: RootState) => state.mailings.currentPage
  );
  const totalPages = useSelector(
    (state: RootState) => state.mailings.totalMailings
  );
  const dispatch = useDispatch();
  const [editingMailing, setEditingMailing] = useState<Mailing | null>(null);
  const [confirmMoalOpen, setConfirmMoalOpen] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchMailings(currentPage, LIMIT_ROWS));
  }, [dispatch, currentPage]);

  const isExistMailing = (currentId: number) =>
    !!mailings?.find((mailing) => mailing.id === currentId);

  const handleCreate = () => {
    const newMailing: Mailing = {
      id: Date.now(),
      name: 'Новая рассылка',
      gifts: [],
      daysToClaim: 0,
      daysToReceive: 0,
      description: '',
      cardNumbers: '',
      mailingDate: moment(new Date()).format('YYYY-MM-DD'),
    };
    setEditingMailing(newMailing);
    handleShowForm();
  };

  const handleEdit = (newMailing: Mailing) => {
    setEditingMailing(newMailing);
    handleShowForm();
  };

  const handleConfirmation = (changedValues: Mailing) => {
    if (editingMailing) {
      setEditingMailing(changedValues);
      handleShowConfirmation();
    }
  };

  const handleSave = () => {
    if (editingMailing) {
      const isExist = isExistMailing(editingMailing.id);
      isExist
        ? dispatch(modifyMailing(editingMailing))
        : dispatch(createMailing(editingMailing));
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

  const handleRemoveMailing = async (
    mailingId: number,
    restockGifts: MailingGift[]
  ) => {
    const giftsForChange = await getGiftCardsByIdsApi(
      restockGifts.map((gift) => gift.giftCardId)
    );

    const updates = restockGifts.map((restockGift) => {
      const giftCard = giftsForChange.find(
        (gift: GiftCard) => gift.id === restockGift.giftCardId
      );
      return {
        id: restockGift.giftCardId,
        remainingQuantity:
          (giftCard?.remainingQuantity ?? 0) + restockGift.quantity,
      };
    });

    dispatch(saveGiftCards(updates));
    dispatch(removeMailingById(mailingId));
  };

  const totalRemainingQuantity = (gifts: MailingGift[]): number => {
    return gifts.reduce((total, gifts) => total + gifts.quantity, 0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage));
    dispatch(fetchMailings(newPage, LIMIT_ROWS));
  };

  return (
    <TableContainer
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '90vh',
        flexGrow: 1,
      }}
    >
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
              <TableCell>
                {moment(mailing.mailingDate).format('DD.MM.YYYY')}
              </TableCell>
              <TableCell>{totalRemainingQuantity(mailing.gifts)}</TableCell>
              <TableCell>
                <Button
                  color='secondary'
                  onClick={() => {
                    handleRemoveMailing(mailing.id, mailing.gifts);
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
      <Pagination
        count={Math.ceil(totalPages / LIMIT_ROWS)}
        page={currentPage}
        onChange={handleChangePage}
        color='primary'
        sx={{ marginTop: 'auto' }}
      />
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
