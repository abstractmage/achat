import Router from 'next/router';
import PageContext from "~/types/page-context";

const redirect = async (ctx: PageContext, location: string = '/') => {
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
    return;
  }

  await Router.push(location, location, { shallow: true });
};

export default redirect;
