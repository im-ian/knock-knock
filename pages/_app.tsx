import { NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </NextUIProvider>
  );
}

export default App;
