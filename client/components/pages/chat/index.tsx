import React from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react';
import './styles.scss';
import ArrowLeftSVG from './svg/arrow-left.svg';
import SendSVG from './svg/send.svg';
import { useStore } from '~/store';
import Message from '~/types/message';
import IO from '~/utils/io';

const isToday = (date: Date) => {
  const today = new Date();

  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

const getMessageTime = (time: string) => {
  const date = new Date(time);

  if (isToday(date)) return date.toLocaleTimeString();
  
  return date.toLocaleString();
};

const useScrollBottom = (docs: any[]) => {
  const bodyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bodyRef.current && bodyRef.current.scrollTo(0, bodyRef.current.scrollHeight);
  }, [bodyRef, docs]);

  return bodyRef;
};

const useChatSocket = (chatId: string, action: (message: Message) => void) => {
  React.useEffect(() => {
    const io = IO.getInstance();

    io.joinChat(chatId);
    io.socket.on('server:message', action);

    return () => {
      io.leaveChat(chatId);
      io.socket.off('server:message', action);
    };
  }, [chatId, action]);
};

const useChatProps = () => {
  const store = useStore();
  const authUser = store.auth.user!;
  const companion = store.chatPage.chat!.users!.docs.find(u => u._id !== authUser!._id)!;
  const input = store.chatPage.input;
  const chat = {
    ...store.chatPage.chat!,
    users: store.chatPage.chat!.users!,
    messages: store.chatPage.chat!.messages!,
  };

  return {
    authUser,
    companion,
    input,
    store,
    chat,
    setInput: store.chatPage.setInput,
    sendMessage: store.chatPage.requestSendMessage,
    addMessage: store.chatPage.addMessage,
  };
};

function Chat() {
  const { companion, input, setInput, chat, sendMessage, addMessage } = useChatProps();
  const bodyRef = useScrollBottom(chat.messages.docs);

  useChatSocket(chat._id, addMessage);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header-button">
          <ArrowLeftSVG />
        </div>
        <div className="chat__header-text">{companion!.nickname}</div>
      </div>
      <div className="chat__body-wrapper">
        <div ref={bodyRef} className="chat__body">
          {chat.messages.docs.slice().reverse().map(message => (
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
          onChange={e => setInput(e.currentTarget.value)}
          value={input}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && e.preventDefault()}
          onKeyUp={e =>
            e.key === 'Enter'
            && !e.shiftKey 
            && input !== ''
            && sendMessage()
          }
        />
        <button
          className="chat__input-button"
          onClick={() => input !== '' && sendMessage()}
        >
          <SendSVG />
        </button>
      </div>
    </div>
  );
}


export default observer(Chat);
