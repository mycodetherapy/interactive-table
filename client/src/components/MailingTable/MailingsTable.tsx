import React, { useEffect, useState } from 'react';
import styles from './MailingsTable.module.css';
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
  TextField,
  Box,
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
import { setCurrentPage } from '../../redux/slices/mailingsSlice';
import { LIMIT_ROWS } from '../../constants';
import ErrorSnackbar from '../SnackBars/ErrorSnackbar';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const isExistMailing = (currentId: number) =>
    !!mailings?.find((mailing) => mailing.id === currentId);

  useEffect(() => {
    dispatch(fetchMailings(currentPage, LIMIT_ROWS, debouncedSearchTerm));
  }, [dispatch, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim() !== '' ? searchTerm : '');
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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

  //@Add mailing rollback on error
  const handleSave = () => {
    if (editingMailing) {
      const isExist = isExistMailing(editingMailing.id);
      isExist
        ? dispatch(modifyMailing(editingMailing))
        : dispatch(createMailing(editingMailing));
      dispatch(fetchMailings(currentPage, LIMIT_ROWS));
      handleShowConfirmation();
      handleShowForm();
    }
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

  const handleChangePage = (event: unknown, newPage: number) => {
    dispatch(setCurrentPage(newPage));
    dispatch(fetchMailings(newPage, LIMIT_ROWS));
  };

  const totalRemainingQuantity = (gifts: MailingGift[]): number => {
    return gifts.reduce((total, gifts) => total + gifts.quantity, 0);
  };

  const confirmModalData = () => {
    let data = { title: '', acceptTitle: '', content: '' };
    const isExist = isExistMailing(editingMailing?.id || NaN);
    if (isExist) {
      data.title = `Редактировние акции`;
      data.acceptTitle = `Сохранить акцию`;
      data.content = `Акция будет сохранена. Сохранить акцию?`;
    } else {
      data.title = `Создание новой новой акции`;
      data.acceptTitle = `Создать акцию`;
      data.content = `Будет создана новая акция. Создать акцию?`;
    }
    return data;
  };

  return (
    <TableContainer className={styles.container}>
      <Box className={styles.header}>
        <TextField
          label='Поиск по названию рассылки'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant='outlined'
          fullWidth
          margin='normal'
          size='small'
          className={styles.searchInput}
        />
        <Button variant='contained' color='primary' onClick={handleCreate}>
          Добавить рассылку
        </Button>
      </Box>

      <Table className={styles.table}>
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
        content={confirmModalData().content}
        acceptTitle={confirmModalData().acceptTitle}
        acceptAction={handleSave}
        cancelAction={handleShowConfirmation}
      />
      <ErrorSnackbar />
    </TableContainer>
  );
};

export default MailingsTable;
