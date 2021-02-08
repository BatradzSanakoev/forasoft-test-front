import React from 'react';

import socket from '../utils/socket';

export default function Chat({ users, messages, userName, roomId, onAddMessage, onStopStream, streamOn }) {
    // Стейт содержания инпута сообщения
    const [messageValue, setMessageValue] = React.useState('');
    const messagesRef = React.useRef(null);

    // Преобразование даты в нужный формат
    const date = new Date().toLocaleString('ru', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

    // Метод отправки сообщения при клике на кнопку
    const sendMessage = () => {
        socket.emit('room message', {
            text: messageValue,
            userName,
            roomId,
            date
        });
        messageValue && onAddMessage({ userName, text: messageValue, date });
        setMessageValue('');
    };

    // Хук для контроля автоматического скролла сообщений в низ
    React.useEffect(() => messagesRef.current.scrollTo(0, 99999), [messages]);

    return (
        <div className='test-section'>
            <div className='chat'>
                <div className='room-props'>
                    <h2 className='room'>RoomId: {roomId}</h2>
                    <div className='users'>
                        <h3 className='users__header'>Users online:</h3>
                        <ul className='users__list'>
                            {users.map((user, index) =>
                                <li className='user' key={index}>{user}</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className='chat-field'>
                    <div className='messages' ref={messagesRef}>
                        {
                            messages.map((message, index) =>
                                <div className={`message ${message.userName !== userName && 'message_in'}`} key={index}>
                                    <p className='message__text'>{message.text}</p>
                                    <p className='message__author'>{message.userName}</p>
                                    <p className='message__date'>{message.date}</p>
                                </div>
                            )
                        }
                    </div>
                    <form className='chat__form' noValidate>
                        <textarea className='chat__text' value={messageValue} onChange={e => setMessageValue(e.target.value)} rows='3'></textarea>

                        {/*  Кнопка отправки сообщений */}
                        <button disabled={!messageValue} className='chat__button' type='button' onClick={() => sendMessage()}>Send</button>

                        {/*  Кнопка начала видеотрансляции с собеседником */}
                        <button disabled={streamOn} className='chat__button' type='button' onClick={() => {
                            socket.emit('streamOn', { video: true, audio: true }, roomId);
                            onStopStream();
                        }}>RTC</button>

                        {/*  Кнопка прекращения видеотрансляции */}
                        <button disabled={!streamOn} className='chat__button' type='button' onClick={() => {
                            socket.emit('streamOff', { video: true, audio: true }, roomId);
                            onStopStream();
                        }}>End Video</button>

                    </form>
                </div>
            </div>
            <div id='video'></div>
        </div>
    )
}