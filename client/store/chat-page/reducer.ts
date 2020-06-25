import { ChatPageState, ActionChatPage } from "./types";


export const defaultState: ChatPageState = {
  chat: null,
  state: 'empty',
  input: '',
};

const reducer = (state: ChatPageState = defaultState, action: ActionChatPage): ChatPageState => {
  switch (action.type) {
    case 'CHAT-PAGE/REQUEST-CHAT': return {
      ...state,
      state: 'loading',
    };
    case 'CHAT-PAGE/SET-CHAT': return {
      ...state,
      chat: action.chat,
      state: 'loaded',
    };
    case 'CHAT-PAGE/SET-INPUT': return {
      ...state,
      input: action.value,
    };
    case 'CHAT-PAGE/REQUEST-MESSAGE': return {
      ...state,
    };
    case 'CHAT-PAGE/ADD-MESSAGE': {
      const newState = { ...state };

      if (newState.chat && newState.chat.messages) {
        newState.chat.messages.docs = [...newState.chat.messages.docs].concat(action.message);
      }

      return newState;
    }
    default: return state;
  }
};


export default reducer;
