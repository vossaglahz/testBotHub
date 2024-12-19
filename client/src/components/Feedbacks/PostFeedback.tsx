import { ChangeEvent, FormEvent, useState } from "react";
import { Box } from "@mui/system";
import { Button, FormControl, Grid2, MenuItem, Select, SelectChangeEvent, TextareaAutosize, TextField } from "@mui/material";
import "../DealHistory/CreatingDealModal/CreatingDealModal.scss";
import { TypedMutationTrigger } from '@reduxjs/toolkit/query/react';

interface NewDealData {
  title: string;
  description: string;
  status: string;
  category: string;
}

interface CreatingDealModalProps {
  closeModal: () => void;
  createFeedback: TypedMutationTrigger<{ data: any }, NewDealData, any>; 
}



export const PostFeedbackModal = ({ closeModal, createFeedback }: CreatingDealModalProps) => {
  const [newFeedback, setNewFeedback] = useState({
    title: '',
    description: '',
    status: '',
    category: '',
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 750,
    bgcolor: '#fff',
    border: '1px solid #ccc',
    boxShadow: 24,
    padding: 4,
    borderRadius: 2
  };


  const submitHandleForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createFeedback({ ...newFeedback });
    closeModal();
  };

  const inputHandleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setNewFeedback(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  return (
    <>
    <Box className="modal" component={'form'} autoComplete="off" onSubmit={submitHandleForm} sx={style} >
      <Grid2 container direction="column" spacing={2}>
        <Grid2>
          <h3 className="input-title">Тема <span>*</span> :</h3>
          <TextField
            fullWidth
            variant="outlined"
            id="titpe"
            value={newFeedback.title}
            onChange={inputHandleChange}
            name="title"
          />
        </Grid2>
        <Grid2>
          <h3 className="input-title">Описание <span>*</span> :</h3>
          <TextareaAutosize
            className="description-textarea"
            id="description"
            value={newFeedback.description}
            onChange={inputHandleChange}
            name="description"
            minRows={4}
          />
        </Grid2>
        <Grid2 className="grid-wrap">
        <Grid2>
            <h3 className="input-title">Категория:</h3>
            <FormControl fullWidth>
              <Select
                className="feedback-select"
                value={newFeedback.category}
                onChange={inputHandleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                name="category"
              >
                <MenuItem value={''}>Выберите категорию</MenuItem>
                <MenuItem value={'Functionality'}>Функциональность</MenuItem>
                <MenuItem value={'Bug'}>Баг</MenuItem>
                <MenuItem value={'UI'}>UI</MenuItem>
                <MenuItem value={'Performance'}>Производительность</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2>
            <h3 className="input-title">Статус:</h3>
            <FormControl fullWidth>
              <Select
                className="feedback-select"
                value={newFeedback.status}
                onChange={inputHandleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                name="status"
              >
                <MenuItem value={''}>Выберите статус</MenuItem>
                <MenuItem value={'Idea'}>Идея</MenuItem>
                <MenuItem value={'Planned'}>Запланировано</MenuItem>
                <MenuItem value={'Processing'}>В процессе</MenuItem>
                <MenuItem value={'Done'}>Завершено</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
        </Grid2>
        <Grid2>
          <Button className="create-deal-button" type="submit" color="primary" variant="contained" sx={{'&.Mui-disabled': {backgroundColor: '#9abade', color: '#9abade',}}}>
            Создать
          </Button>
        </Grid2>
      </Grid2>
    </Box>
    </>
   
  );
};