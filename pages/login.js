import Container from "../components/Container/Container"
import { ConnectWallet } from "@thirdweb-dev/react"
import Link from "next/link"
import checkBalance from "../util/checkBalance";
import {
  MediaRenderer,
  useAddress,
  useContract,
  useContractMetadata,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getUser } from "../auth.config";
import { contractAddress } from "../const/yourDetails";
import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";
import { CoreBlockchain } from "@thirdweb-dev/chains";
import toastStyle from "../util/toastConfig";

export default function Login() {
  
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);
  const address = useAddress();
  const { data: nfts } = useOwnedNFTs(contract, address);
  const router = useRouter();

  useEffect(() => {
    if (nfts?.length) {
      router.push("/portfolio");
    }
  }, [nfts, router, address]);
    return (
        <div className="body">
        <Container maxWidth="lg">

<div style={{height: "250px"}}></div>
<ConnectWallet
  <ConnectWallet 
  theme={({
   colors: {
     modalBg: "#3385FF",
     accentText: "#3385FF",
     accentButtonBg: "#0064fa",
     borderColor: "gray",
     primaryText: "white",
     background: "#131418",
   },
  })}
    style={{fontFamily: "Pixel Nes", border: "solid", textShadow: "currentColor 5px 5px 16px", borderWidth: "0.5px", backdropFilter: "blur(10px)"}}  
 modalSize={"compact"}
 btnTitle={"CONNECT"}
 modalTitle={"RAREBAY"}
 switchToActiveChain={true}
 welcomeScreen={{
   title: "WELCOME TO THE HOME OF RAR3",
   Image: {
     src: "https://bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a.ipfs.nftstorage.link/ipfs/bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a/xcxczxz.png",
     width: 150,
     height: 150,
   },
   subtitle:
     "Connect wallet to get started.",
 }}
 modalTitleIconUrl={
   "https://bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a.ipfs.nftstorage.link/ipfs/bafybeid3fqzkm3eciwpla4tijoj3ifcxhcxskcnayohd4dvysfngp2w72a/xcxczxz.png"
 }
/>
   <p style={{color: "inital", margin: "5%", textShadow: "currentColor 2px 2px 8px"}}>Connect and sign your wallet</p>
   <Link className="button" href="/dex">ENTR DEX</Link> 
</Container>
<style jsx>
    { `
  .body{
    
        }
    `
    }
</style>
        </div>
    )

    
}
export async function getServerSideProps(context) {
  const user = await getUser(context.req);

  if (!user) {
    return {
      props: {},
    };
  }

  const secretKey = process.env.TW_SECRET_KEY;

  if (!secretKey) {
    console.log("Missing env var: TW_SECRET_KEY");
    throw new Error("Missing env var: TW_SECRET_KEY");
  }
  // Ensure we are able to generate an auth token using our private key instantiated SDK
  const PRIVATE_KEY = process.env.THIRDWEB_AUTH_PRIVATE_KEY;
  if (!PRIVATE_KEY) {
    throw new Error("You need to add an PRIVATE_KEY environment variable.");
  }

  // Instantiate our SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.THIRDWEB_AUTH_PRIVATE_KEY,
    CoreBlockchain,
    { secretKey }
  );

  // Check to see if the user has an NFT
  const hasNft = await checkBalance(sdk, user.address);

  // If they don't have an NFT, redirect them to the login page
  if (!hasNft) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // Finally, return the props
  return {
    props: {},
  };
}