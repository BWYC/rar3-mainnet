import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { ACTIVE_CHAIN, DEX_ADDRESS, TOKEN_ADDRESS } from "../const/details";
import {
  ConnectWallet,
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractMetadata,
  useContractRead,
  useContractWrite,
  useNetworkMismatch,
  useSDK,
  useSwitchChain,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import SwapInput from "../components/input";
import {Swap} from '@web3uikit/icons'
import toast, { Toaster } from "react-hot-toast";
import toastStyle from "../util/toastConfig";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: dexContract } = useContract(DEX_ADDRESS, "custom");
  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenMetadata } = useContractMetadata(tokenContract);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(
    tokenContract,
    DEX_ADDRESS
  );

  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const sdk = useSDK();
  const [contractBalance, setContractBalance] = useState<string>("0");

  const [nativeValue, setNativeValue] = useState<string>("0");
  const [tokenValue, setTokenValue] = useState<string>("0");
  const [currentFrom, setCurrentFrom] = useState<string>("native");
  const [loading, setLoading] = useState<boolean>(false);

  const { mutateAsync: swapNativeToToken } = useContractWrite(
    dexContract,
    "swapEthTotoken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentFrom === "native"
      ? [
          toWei(nativeValue || "0"),
          toWei(contractBalance || "0"),
          contractTokenBalance?.value,
        ]
      : [
          toWei(tokenValue || "0"),
          contractTokenBalance?.value,
          toWei(contractBalance || "0"),
        ]
  );

  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_ADDRESS);
      setContractBalance(balance?.displayValue || "0");
    } catch (err) {
      console.error(err);
    }
  };

  const executeSwap = async () => {
    setLoading(true);
    if (isMismatched) {
      switchChain(ACTIVE_CHAIN.chainId);
      setLoading(false);
      return;
    }
    try {
      if (currentFrom === "native") {
        await swapNativeToToken({ overrides: { value: toWei(nativeValue) } });
        toast({
          status: "success",
          title: "Swap Successful",
          description: `You have successfully swapped your ${
            ACTIVE_CHAIN.nativeCurrency.symbol
          } to ${symbol || "tokens"}.`,
        });
      } else {
        // Approve token spending
        await approveTokenSpending({ args: [DEX_ADDRESS, toWei(tokenValue)] });
        // Swap!
        await swapTokenToNative({ args: [toWei(tokenValue)] });
        toast( `You have successfully swapped your ${
          symbol || "tokens"
        } to ${ACTIVE_CHAIN.nativeCurrency.symbol}.`, {
          icon: "✅",
          style: toastStyle,
          position: "bottom-center",
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast(`SWAP FAILED, PLEASE TRY AGAIN`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    setInterval(fetchContractBalance, 10000);
  }, []);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentFrom === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Head>
        <title>RareBay | Swap</title>
        <meta name="description" content="Swap WHLS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        direction="column"
        gap="5"
        mt="40"
        p="5"
        mx="auto"
        maxW={{ base: "sm", md: "xl" }}
        w="full"
        rounded="2xl"
        borderWidth="1px"
        borderColor="gray.300"
        style={{padding: "2%", borderRadius: "16px", border: "solid 2px"}}
      >
        <Flex
          direction={currentFrom === "native" ? "column" : "column-reverse"}
          gap="5"
         
        >
           <div style={{display: "flex", padding: "1%", gap: "5px"}}>
    CORE <Image src={"/core.png"} w="20" h="20" />
    </div>
          <SwapInput
            current={currentFrom}
            type="native"
            max={nativeBalance?.displayValue}
            value={nativeValue}
            setValue={setNativeValue}
            tokenImage={tokenMetadata?.image}
          />

          <Button
            onClick={() =>
              currentFrom === "native"
                ? setCurrentFrom("token")
                : setCurrentFrom("native")
            }
            maxW="5"
            mx="auto"
            style={{margin: "5%", fontWeight: "900", display: "flex"}}
          >
            ↓↑
          </Button>
          <div style={{display: "flex", padding: "1%", gap: "5px"}}>
    WHLS <Image src={"/whls.png"} w="20" h="20" />
    </div>
          <SwapInput
            current={currentFrom}
            type="token"
            max={tokenBalance?.displayValue}
            value={tokenValue}
            setValue={setTokenValue}
            tokenImage={tokenMetadata?.image}
          />
        
        </Flex>

        {address ? (
          <Button
          className="button"
            onClick={executeSwap}
            py="7"
            fontSize="2xl"
            colorScheme="twitter"
            rounded="xl"
            isDisabled={loading}
          >
            {loading ? <Spinner /> : "Swap Tokens ⇌"}
          </Button>
        ) : (
          <ConnectWallet
          theme="dark"
          style={{border: "solid", borderColor: "initial", borderWidth: "0.5px", fontFamily: "Pixel NES"}}
          modalSize={"compact"}
          btnTitle={"CONNECT"}
          modalTitle={"RAREBAY"}
          switchToActiveChain={true}
          welcomeScreen={{
          title: "WELCOME TO THE HOME OF RAR3",
      
          subtitle:
           "Connect wallet to get started.",
          }}
          modalTitleIconUrl={
          "https://bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a.ipfs.nftstorage.link/ipfs/bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a/xcxczxz.png"
          }
          />
        )}
      </Flex>
    </>
  );
}
