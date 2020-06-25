import React from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import io from 'socket.io-client';

import './styles.scss';
import { companionSelector } from '~/store/chat-page/selectors';
import ArrowLeftSVG from './svg/arrow-left.svg';
import SendSVG from './svg/send.svg';
import { ChatContext } from '~/pages/chats/[id]';
import useDispatch from '~/store/dispatch';
import { setInput, sendMessage, addMessage } from '~/store/chat-page/actions';
import Message from '~/types/message';
import { ChatPageState } from '~/store/chat-page/types';


const isToday = (date: Date) => {
  const today = new Date();

  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const getMessageTime = (time: string) => {
  const date = new Date(time);

  if (isToday(date)) return `${date.getHours()}:${date.getMinutes()}`;
  
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};

const useScrollBottom = (chatData: ChatPageState) => {
  const bodyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bodyRef.current && bodyRef.current.scrollTo(0, bodyRef.current.scrollHeight);
  }, [bodyRef, chatData.chat?.messages?.docs]);

  return bodyRef;
};

const useChatSocket = (chatId?: string) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = React.useState<SocketIOClient.Socket | null>(null);

  React.useEffect(() => {
    const connect = () => {
      if (!chatId) return;

      const socket = io('http://localhost:3001', { query: { chatId } });
      socket.on('message', (message: Message) => console.log(message));// dispatch(addMessage(message)));
      setSocket(socket);
    };

    const disconnect = () => setSocket(socket => {
      if (socket) {
        socket.disconnect();
      }

      return null;
    });

    connect();

    return () => disconnect();
  }, [dispatch, chatId]);
  
  return socket;
};

function Chat() {
  const chatData = React.useContext(ChatContext);
  const companion = useSelector(companionSelector);
  const dispatch = useDispatch();
  const bodyRef = useScrollBottom(chatData);

  useChatSocket(chatData.chat?._id);

  return (
    chatData.state === 'loaded'
      ? (
        <div className="chat">
          <div className="chat__header">
            <div className="chat__header-button">
              <ArrowLeftSVG />
            </div>
            <div className="chat__header-text">{companion!.nickname}</div>
          </div>
          <div className="chat__body-wrapper">
            <div ref={bodyRef} className="chat__body">
              {chatData.chat!.messages!.docs.map(message => (
                <div
                  key={message._id}
                  className={cx(
                    'chat__item',
                    typeof message.user === 'string' && message.user === companion!._id && 'chat__item_response'
                  )}
                >
                  <div className="chat__item-inner">
                    <div className="chat__item-content">{message.value}</div>
                    <div className="chat__item-time">{getMessageTime(message.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="chat__input">
            <textarea
              className="chat__input-field"
              placeholder="type something..."
              onChange={e => dispatch(setInput(e.currentTarget.value))}
              value={chatData.input}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && e.preventDefault()}
              onKeyUp={e =>
                e.key === 'Enter'
                && !e.shiftKey 
                && chatData.input !== ''
                && dispatch(sendMessage(chatData.input))
              }
            />
            <button
              className="chat__input-button"
              onClick={() => chatData.input && dispatch(sendMessage(chatData.input))}
            >
              <SendSVG />
            </button>
          </div>
        </div>
      ) : null
  );
}


export default Chat;
