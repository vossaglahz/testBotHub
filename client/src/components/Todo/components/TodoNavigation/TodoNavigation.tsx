import { useState } from "react";
import "./TodoNavigation.scss";

interface TodoNavigationProps {
    onSelect: (text: string) => void;
}

export const TodoNavigation = ({ onSelect }: TodoNavigationProps) => {
    const [selected, setSelected] = useState<string>("Doing");

    const handleClick = (text: string) => {
        setSelected(text);
        onSelect(text);
    };

    return (
        <div className="todoNavigation">
            <div
                className={`todoItem ${selected === 'Doing' ? 'selected' : ''}`}
                onClick={() => handleClick('Doing')}
            >
                <h2>К выполнению</h2>
            </div>
            <div
                className={`todoItem ${selected === 'Procces' ? 'selected' : ''}`}
                onClick={() => handleClick('Procces')}
            >
                <h2>В процессе</h2>
            </div>
            <div
                className={`todoItem ${selected === 'Done' ? 'selected' : ''}`}
                onClick={() => handleClick('Done')}
            >
                <h2>Завершено</h2>
            </div>
        </div>
    );
};
