import React from 'react';
import { observer } from 'mobx-react';
import Router from 'next/router';
import QueryInput from '~/components/query-input';
import './styles.scss';
import { useStore } from '~/store';
import Item from '~/components/item';
import getInitials from '~/utils/get-initials';
import generateColor from '~/utils/generate-color';

const useSubmit = (query: string, request: () => void) => {
  const firstEffect = React.useRef(true);
  const timeout = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    timeout.current && clearTimeout(timeout.current);

    if (!firstEffect.current) timeout.current = setTimeout(request, 1000);

    firstEffect.current = false;
  }, [query, request]);
};

function Chats() {
  const { chatsPage: { query, setQuery, chats, requestChats }, prepareHydrate } = useStore();

  useSubmit(query, requestChats);

  return (
    <div className="chats">
      <QueryInput query={query} onChange={setQuery} />
      {
        chats
          ? (
            <div className="chats__list">
              {
                chats.docs.map(chat => (
                  <Item
                    key={chat._id}
                    image={{
                      initials: getInitials(chat.companion.nickname),
                      color: generateColor(chat._id)
                    }}
                    first={chat.companion.nickname}
                    second={chat.companion.email}
                    onClick={() => {
                      prepareHydrate();
                      Router.push('/chats/[id]', `/chats/${chat._id}`, { shallow: true });
                    }}
                    hoverable
                  />
                ))
              }
            </div>
          )
          : null
      }
    </div>
  );
}

export default observer(Chats);
