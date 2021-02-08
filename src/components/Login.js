import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Login({ onLogin }) {
    const history = useHistory();

    // Стейты комнаты и имени пользователя
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('');

    // Метод для управляемых компонент комнаты и имени пользователя
    const handleChange = e => {
        e.target.name === 'roomId' ? setRoomId(e.target.value) : setUserName(e.target.value);
    };

    // Функция клика для авторизации и входа в комнату(или ее создания)
    const handleClick = async () => {
        if (!roomId || !userName) return;
        const obj = { roomId, userName };
        await fetch('/rooms', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(obj)
        });
        onLogin(obj);

        // После авторизации происходит переадресация на страницу комнаты
        history.push(`/rooms/:${roomId}`);
    };

    return (
        <div className='form'>
            <input type='text' placeholder='Room ID' value={roomId} name='roomId' onChange={handleChange} className='input' />
            <input type='text' placeholder='Name' value={userName} name='username' onChange={handleChange} className='input' />
            <button onClick={handleClick} className='button'>Enter</button>
        </div>
    )
}