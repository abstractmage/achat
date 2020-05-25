import React from 'react';
import { NextPageContext } from 'next';

import Profile, { ProfileProps } from '~/components/pages/profile';
import { AppAction, AppState } from '~/store/types';


function Index(props: ProfileProps) {
  return (
    <Profile {...props} />
  );
}

Index.getInitialProps = async (ctx: NextPageContext<AppState, AppAction>) => {
  return {
    activeModal: ctx.query.modal,
  };
};


export default Index;
