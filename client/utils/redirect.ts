import { NextPageContext } from "next";
import Router from 'next/router';
import { AppState, AppAction } from "~/store/types";

const redirect = async (ctx: NextPageContext<AppState, AppAction>, location: string = '/') => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
    return;
  }

  await Router.push(location, location, { shallow: true });
};

export default redirect;
