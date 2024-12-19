import { useEffect, useState } from "react";
import "./Todo.scss";
import { Box, Button, Input, Modal, useMediaQuery, useTheme } from "@mui/material";
import { useCreateTodoMutation, useGetTodoQuery, useEditStatusMutation, useDeleteTodoMutation } from "../../store/api/todo.api";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TodoColumn } from "./components/TodoColumn/TodoColumn";
import { useTranslation } from "react-i18next";
import { TodoNavigation } from "./components/TodoNavigation/TodoNavigation";

export const Status = {
    doing: 'Doing',
    process: 'Process',
    done: 'Done',
};

export type StatusType = typeof Status[keyof typeof Status];

export interface TodoItem {
    id: string;
    text: string;
    status: StatusType;
    createdAt: string;
}

export const Todo = () => {
    const { t } = useTranslation();
    const [todoCreate] = useCreateTodoMutation();
    const [updateTodo] = useEditStatusMutation();
    const [deleteTodo] = useDeleteTodoMutation();
    const [text, setText] = useState<string>("");
    const [selectedText, setSelectedText] = useState<string|null>(null);
    const { data, refetch } = useGetTodoQuery('');
    const [modal, setModal] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    useEffect(() => {
        if(!isMobile) {
            setSelectedText(null)
        }else {
            setSelectedText("Doing")
        }
        
    },[isMobile])

    const onClick = () => {
        setModal(true);
    };

    const send = () => {
        todoCreate({ text }).unwrap().then(refetch);
        setModal(false);
        setText("");
    };

    const handleDrop = (item: { id: string; status: StatusType }, newStatus: StatusType) => {
        updateTodo({ id: item.id, status: newStatus }).unwrap().then(refetch);
    };

    const deleteTodoHandler = (id: string) => {
        deleteTodo(id).unwrap().then(refetch);
    };

    const changeStatusHandler = (id: string, newStatus: StatusType) => {
        updateTodo({ id, status: newStatus }).unwrap().then(refetch);
    };

    return (
        <>
        <DndProvider backend={HTML5Backend}>
            <Modal open={modal} onClose={() => setModal(false)}>
                <Box className="modalCreate">
                    <span>{t('List.todo.createNote')}</span>
                    <Input
                        onChange={(e) => setText(e.target.value)}
                        value={text}
                        placeholder={t('List.todo.placehold')}
                        type="text"
                    />
                    <Button onClick={send} variant="outlined">{t('List.todo.add')}</Button>
                </Box>
            </Modal>
            <div className="buttonTodo">
                <Button variant="outlined" onClick={onClick}>{t('List.todo.create')}</Button>
            </div>
            {
                isMobile?<TodoNavigation onSelect={setSelectedText}/>:<div className="todo">
                {Object.values(Status).map((status) => (
                    <TodoColumn
                        key={status}
                        status={status}
                        data={data}
                        onDrop={handleDrop}
                        onDeleteTodo={deleteTodoHandler}
                        onChangeStatus={changeStatusHandler}
                    />
                ))}
            </div>
            }
            {
                selectedText ==="Doing"?
                <>
                <TodoColumn
                        key={"Doing"}
                        status={"Doing"}
                        data={data}
                        onDrop={handleDrop}
                        onDeleteTodo={deleteTodoHandler}
                        onChangeStatus={changeStatusHandler}
                    />
                </>
                :selectedText ==="Procces"?
                <>
                <TodoColumn
                        key={"Process"}
                        status={"Process"}
                        data={data}
                        onDrop={handleDrop}
                        onDeleteTodo={deleteTodoHandler}
                        onChangeStatus={changeStatusHandler}
                    />
                </>
                :selectedText ==="Done"?
                <>
                <TodoColumn
                        key={"Done"}
                        status={"Done"}
                        data={data}
                        onDrop={handleDrop}
                        onDeleteTodo={deleteTodoHandler}
                        onChangeStatus={changeStatusHandler}
                    />
                </>:""
            }
            
        </DndProvider>
        </>
    );
};
