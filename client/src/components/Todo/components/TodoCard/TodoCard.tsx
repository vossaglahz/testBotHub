import { useDrag } from "react-dnd";
import { Status, TodoItem, StatusType } from "../../Todo";
import { Button, Menu, MenuItem } from "@mui/material";
import { getStatusTranslation } from "../TodoColumn/TodoColumn";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./style.scss"

interface TodoCardProps {
    todo: TodoItem;
    deleteTodo: (id: string) => void;
    changeStatus: (id: string, newStatus: StatusType) => void;
}

export const TodoCard = ({ todo, deleteTodo, changeStatus }: TodoCardProps) => {
    const [{ isDragging }, drag] = useDrag({
        type: "TODO",
        item: { id: todo.id, status: todo.status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = (newStatus: StatusType) => {
        changeStatus(todo.id, newStatus);
        handleMenuClose();
    };

    return (
        <div ref={drag} className={`todo__card ${isDragging ? "dragging" : ""}`}>
            <h3>{todo.text}</h3>
            <p style={{ color: todo.status === Status.done ? "green" : todo.status === Status.doing ? "red" : "blue" }}>
                {getStatusTranslation(todo.status, t)}
            </p>
            <span>{new Date(todo.createdAt).toLocaleString()}</span>
            <div>
                <div className="btnGroupTodo">
                <Button size="small" color="error" variant="outlined" onClick={() => deleteTodo(todo.id)}>
                    {t('List.todo.delete')}
                </Button>
                <Button size="small" variant="outlined" onClick={handleMenuClick}>
                    {t('List.todo.changeStatus')}
                </Button>
                </div>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    {Object.values(Status).map(
                        (newStatus) =>
                            newStatus !== todo.status && (
                                <MenuItem key={newStatus} onClick={() => handleStatusChange(newStatus)}>
                                    {getStatusTranslation(newStatus, t)}
                                </MenuItem>
                            )
                    )}
                </Menu>
            </div>
        </div>
    );
};
