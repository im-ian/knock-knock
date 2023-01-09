import { Avatar, Grid, NextUIProvider } from "@nextui-org/react";
import type { AppProps } from "next/app";

import useLocalStorage from "../hooks/useLocalStorage";

import "../styles/globals.css";

function App({ Component, pageProps }: AppProps) {
  const [nickname] = useLocalStorage("nickname", "익명");

  return (
    <NextUIProvider>
      <Grid.Container gap={2}>
        <Grid xs={3}>
          <Avatar text={nickname} />
        </Grid>
        <Grid xs={9} css={{ minHeight: "100vh" }}>
          <Component {...pageProps} />
        </Grid>
      </Grid.Container>
    </NextUIProvider>
  );
}

export default App;
