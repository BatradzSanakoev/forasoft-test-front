import React from 'react';
import { Switch, Route } from 'react-router-dom';

import socket from './utils/socket';
import reducer from './utils/reducer';
import Chat from './components/Chat';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Создание редюсера для хранения нескольких состояний 
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: []
  });

  // Стейт мониторинга состояния видеотрансляции
  const [streamOn, setStreamOn] = React.useState(false);
  const onStopStream = () => {
    setStreamOn(!streamOn);
  };

   // Получение списка пользователей
  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    });
  };

  //  Получение сообщений чата
  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    });
  };


  // Авторизация, создание и вход в комнату
  // Содержит получение данных пользователя и номер комнаты
  const onLogin = (obj) => {

    dispatch({
      type: 'JOINED',
      payload: obj
    });

    socket.emit('room join', obj);
    
    fetch(`/rooms/${obj.roomId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((data) => dispatch({
        type: 'SET_DATA',
        payload: data
      }));
  };

  // Создание DOM элемента для видеотрансляции
  const myVideo = document.createElement('video');
  myVideo.autoplay = true;

  // Функции запуска видеотраснляции
  const videoStream = (obj) => {
    navigator.mediaDevices.getUserMedia(obj)
      .then((stream) => {
        addVideoStream(myVideo, stream);
      });
  };

  const addVideoStream = (video, stream) => {
    const videoGrid = document.getElementById('video');
    video.srcObject = stream;
    videoGrid.append(video);
  };

  // Функция отключения видеотрансляции
  const streamOff = (obj) => {
    navigator.mediaDevices.getUserMedia(obj)
      .then((stream) => {
        console.log(stream.getTracks());
        stream.getTracks().forEach(track => track.stop());
        myVideo.srcObject = null;
      });
  };


  // Хуки получения различных данных при рендере страницы
  React.useEffect(() => {
    socket.on('room joined', setUsers);
    socket.on('room left', setUsers);
    socket.on('room message', addMessage);
    socket.on('streamOn', videoStream);
    socket.on('streamOff', streamOff);
  }, []);

  return (
    <div className='App'>
      <Switch>
        <Route exact path='/'>
          <Login onLogin={onLogin} />
        </Route>
        <ProtectedRoute path={`/rooms`} component={Chat} {...state} onAddMessage={addMessage} onStopStream={onStopStream} streamOn={streamOn} />
      </Switch>
    </div>
  );
}

export default App;
