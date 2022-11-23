import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { Landing } from "./pages/landing/landing";
import Create from "./pages/create-certificate/create";
import { conf, sessionGetActiveConf } from "./algorand/config";
import { SessionWallet } from "algorand-session-wallet";
import { useState } from "react";

const theme = extendTheme({
  fonts: {
    heading: "Raleway",
    body: "Raleway",
  },
});

export const App = () => {
  const activeConf = sessionGetActiveConf();
  const sw = new SessionWallet(conf[activeConf].network);
  const [sessionWallet, setSessionWallet] = React.useState(sw);
  const [accts, setAccounts] = useState(sw.accountList());
  const [connected, setConnected] = useState(sw.connected());

  function updateWallet(sw: SessionWallet) {
    setSessionWallet(sw);
    setAccounts(sw.accountList());
    setConnected(sw.connected());
  }
  return (
    <>
      <ChakraProvider theme={theme}>
        <Header />
        <Create activeConfig={activeConf} sw={sessionWallet} />
      </ChakraProvider>
    </>
  );
};
export default App;
