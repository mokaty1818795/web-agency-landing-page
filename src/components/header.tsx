import { Flex, Heading, HStack, Link, Icon } from "@chakra-ui/react";
import { SessionWallet } from "algorand-session-wallet";
import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { conf, sessionGetActiveConf } from "../algorand/config";
import Signin from "../pages/landing/connection/signin";

export const Header = () => {
  const activeConf = sessionGetActiveConf();
  const sw = new SessionWallet(conf[activeConf].network);
  const [sessionWallet, setSessionWallet] = useState(sw);
  const [accts, setAccounts] = useState(sw.accountList());
  const [connected, setConnected] = useState(sw.connected());

  function updateWallet(sw: SessionWallet) {
    setSessionWallet(sw);
    setAccounts(sw.accountList());
    setConnected(sw.connected());
  }
  return (
    <Flex
      px="200px"
      py="20px"
      width="full"
      bg="blue.900"
      alignItems="flex-end"
      justifyContent="space-between"
    >
      <Flex alignItems="flex-end">
        <Heading
          color="whiteAlpha.900"
          mr="60px"
          fontSize={20}
          letterSpacing="1.5px"
        >
          My Logo
        </Heading>
        <HStack color="whiteAlpha.700" spacing="40px">
          <Link>Home</Link>
          <Link>Service</Link>
          <Link>About us</Link>
        </HStack>
      </Flex>
      <Signin
        darkMode={false}
        sessionWallet={sessionWallet}
        accts={accts}
        connected={connected}
        updateWallet={updateWallet}
      />
    </Flex>
  );
};
