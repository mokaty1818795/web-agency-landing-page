import {
  Text,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SessionWallet, allowedWallets } from "algorand-session-wallet";

type AlgorandWalletConnectorProps = {
  darkMode: boolean;
  connected: boolean;
  accts: string[];
  sessionWallet: SessionWallet;
  updateWallet(sw: SessionWallet): void;
};

const Signin = (props: AlgorandWalletConnectorProps) => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const { sessionWallet, updateWallet } = props;
  const finalRef = React.useRef(null);

  useEffect(() => {
    if (sessionWallet.connected()) {
      const accnt = sessionWallet.getDefaultAccount();
      sessionStorage.setItem("aacnt", accnt);
      return;
    }

    let interval: any;
    sessionWallet.connect().then((success) => {
      if (!success) return;
      interval = setInterval(() => {
        if (sessionWallet.connected()) {
          clearInterval(interval);
          updateWallet(sessionWallet);
        }
      }, 500);
    });

    return () => {
      clearInterval(interval);
    };
  }, [sessionWallet, updateWallet]);

  function handleDisplayWalletSelection() {
    setSelectorOpen(true);
  }

  async function handleSelectedWallet(e: any) {
    const choice = e.currentTarget.id;

    if (!(choice in allowedWallets)) {
      if (props.sessionWallet.wallet !== undefined)
        props.sessionWallet.disconnect();
      return setSelectorOpen(false);
    }

    const sw = new SessionWallet(
      props.sessionWallet.network,
      props.sessionWallet.permissionCallback,
      choice
    );

    if (!(await sw.connect())) {
      sw.disconnect();
    }

    props.updateWallet(sw);

    setSelectorOpen(false);
  }

  const closeModal = () => {
    setSelectorOpen(false);
  };

  // function handleChangeAccount(e: any) {
  //   props.sessionWallet.setAccountIndex(parseInt(e.target.value));
  //   props.updateWallet(props.sessionWallet);
  // }

  function disconnectWallet() {
    props.sessionWallet.disconnect();
    props.updateWallet(
      new SessionWallet(
        props.sessionWallet.network,
        props.sessionWallet.permissionCallback
      )
    );
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace("/dashboardhome");
  }

  const walletOptions: any = [];
  for (const [k, v] of Object.entries(allowedWallets)) {
    walletOptions.push(
      <Center>
        <Stack w="1rem"></Stack>
        <Stack py="0.5rem">
          <Button
            py="2rem"
            px="4rem"
            w="20rem"
            id={k}
            color="#ffffff"
            bg="#2C66B8"
            onClick={handleSelectedWallet}
          >
            <HStack
              alignItems="center"
              spacing="2"
              justifyContent="space-between"
            >
              <Img
                w="2rem"
                alt="wallet-branding"
                className="wallet-branding"
                src={v.img(props.darkMode)}
              />
              <h5>{v.displayName()}</h5>
            </HStack>
          </Button>
        </Stack>
      </Center>
    );
  }
  return (
    <>
      <Container maxW="3xl">
        {sessionWallet.connected() ? (
          <>
            <Flex alignItems="center" gap="8">
              <Text fontSize="md" fontWeight="bold" color="blue.00">
                Connected
              </Text>
              <Button
                borderRadius="full"
                color="#ffffff"
                bg="#2C66B8"
                _hover={{ bg: "#2C66B8" }}
                onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Stack
              py="2rem"
              direction={"column"}
              spacing={3}
              align={"center"}
              alignSelf={"center"}
            >
              <Button
                w="150px"
                color="#ffffff"
                bg="#2C66B8"
                borderRadius="full"
                _hover={{ bg: "#2C66B8" }}
                onClick={handleDisplayWalletSelection}
              >
                Connect
              </Button>
            </Stack>
            <Modal
              isOpen={selectorOpen}
              finalFocusRef={finalRef}
              onClose={closeModal}
              size="2xl"
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Choose Wallet</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{walletOptions}</ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default Signin;
