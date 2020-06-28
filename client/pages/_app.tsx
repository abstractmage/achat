import React from 'react';
import NextApp, { AppContext, AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import 'mobx-react-lite/batchingForReactDom'
import AppComponent from '~/components/app';
import AppStore, { initializeStore } from '~/store';
import IO from '~/utils/io';

type AppState = {
  store: AppStore;
};

class App extends NextApp<{ initialStoreData: AppStore }> {
  state = {
    store: new AppStore(),
  };

  static async getInitialProps(appCtx: AppContext) {
    const store = initializeStore();

    (appCtx.ctx as any).store = store;

    const appProps = await NextApp.getInitialProps(appCtx);

    return {
      ...appProps,
      initialStoreData: store,
    };
  }
  
  static getDerivedStateFromProps(props: AppProps & { initialStoreData: AppStore }, state: AppState) {
    state.store.hydrate(props.initialStoreData);

    return state;
  }

  componentDidMount() {
    IO.getInstance();
  }

  render() {
    return (
      <Provider store={this.state.store}>
        <AppComponent {...this.props} />
      </Provider>
    );
  }
}


export default App;
