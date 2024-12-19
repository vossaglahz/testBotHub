import { Outlet, useLocation } from "react-router-dom"
import { UserCard } from "./components/userCard/userCard"
import "./Chat.scss"
import { useEffect, useState } from "react"
import { socket } from "../../store/socket/socket"
import { useAppSelector } from "../../store/store"

interface IUser {
    id: number;
    name: string;
    photo: string;
    online: boolean;
    role: string;
}

export const Chat = () => {
    const [userList, setUserList] = useState<IUser[]>([]);
    const { pathname } = useLocation();
    const { user } = useAppSelector((state) => state.users);
    const chatId = pathname.split('/').pop() || '';

    useEffect(() => {
        if (user) {

            socket.connect();
            socket.emit('register', user.id, user.role);  
                      
            socket.on('lawyersList', (userList) => {
                setUserList(userList);
            });

            socket.on('userOnline', (data) => {
                setUserList((prevUserList) =>
                    prevUserList.map((u) =>
                        u.id === Number(data.userId) && u.role === data.role ? { ...u, online: true } : u
                    )
                );
            });
    
            socket.on('userOffline', (data) => {
                setUserList((prevUserList) => {
                    const updatedList = prevUserList.map((u) =>
                        u.id === Number(data.userId) && u.role === data.role ? { ...u, online: false } : u
                    );
                    return updatedList
                });   
            });

            socket.on('disconnect', () => {
                console.log(`Socket ${socket.id} disconnected`);
            });
            
            return () => {
                socket.off('lawyersList');
                socket.off('userOnline');
                socket.off('userOffline');
                socket.disconnect();
            };
        }
    }, [user, socket, chatId]);

    return (
        <div className="container">
            <div className="containerChat">
                <div className="userHistory">
                    {userList.length ? (
                        userList.map((user, index) => (
                                <UserCard
                                    className={chatId===String(user.id)? "active":""}
                                    key={index}
                                    id = {user.id.toString()}
                                    fullname={user.name}
                                    image={user.photo}
                                    status={user.online ? 'online' : 'offline'}
                                />
                        ))
                    ) : (
                        <p>Пользователи не найдены</p>
                    )}
                </div>
                <Outlet/>
            </div>
        </div>
    );
};
