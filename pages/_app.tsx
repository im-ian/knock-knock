import { Avatar, Grid, NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

import "../styles/globals.css";
import SideNav from "../components/sidenav";

function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <RecoilRoot>
        <Grid.Container gap={2} css={{ height: "100vh" }}>
          <Grid xs={3}>
            <SideNav />
          </Grid>
          <Grid xs={9}>
            <Component {...pageProps} />
          </Grid>
        </Grid.Container>
      </RecoilRoot>
    </NextUIProvider>
  );
}

export default App;
