import "@/utils/styles/globals.scss";
import { AppPropsWithLayout } from "@/utils/types";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  //return right hand side if left hand side is undefined
  //could render default layout instead of just page => page
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(<Component {...pageProps} />);
}
