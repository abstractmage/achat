import { NextPageContext } from "next";
import AppStore from "~/store";

interface PageContext extends NextPageContext {
  store: AppStore;
}

export default PageContext;