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
import { Web3Button } from "@thirdweb-dev/react";
import { NextPage } from "next";
import { SocialLoginButton } from "../components/social";
import EmailSignIn from "../components/Email";
import { NFT_COLLECTION_ADDRESS } from "../const/contractAddresses";

export default function Login() {
  const { contract } = useContract(contractAddress);
  const { data: contractMetadata, isLoading: contractLoading } =
    useContractMetadata(contract);
  const address = useAddress();
  const { data: nfts } = useOwnedNFTs(contract, address);
  const router = useRouter();

  useEffect(() => {
    if (nfts?.length) {
      router.push("/dex");
    }
  }, [nfts, router, address]);
    return (
        <div className="body">
{address ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}>
          <ConnectWallet/>
        <Link className="button" style={{margin: "5%"}} href="/dex">ENTER DEX</Link>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '85vh'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '80%',
            height: '85vh',
          }}>
            <div style={{
              padding: '0.5rem 1rem',
            }}>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: "10%",
              padding: '0.5rem 1rem',
              borderBottom: '1px solid #EEE',
              height: 'auto'
            }}>
       
                 <p style={{ textAlign: "center",  textShadow: "lightblue 1px 1px 5px", color: "white", fontSize: "20px" }}>RAREBAY SIGN IN</p>
                 <p style={{ textAlign: "center",  textShadow: "lightblue 1px 1px 5px", color: "lightgray", fontSize: "10px" }}>Sign in with a social wallet</p>
                 <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '3rem',
                  marginBottom: '4rem',
                  marginTop: '4rem',
                  color: '#CCC',
                  margin: "2%"
                }}>
                   <ConnectWallet
   theme="system"
 style={{border: "solid 1px white", borderWidth: "0.5px", fontFamily: "Pixel NES", background: "gray", textShadow: "gray 2px 1px 1px" }}
 modalSize={"compact"}
 btnTitle={"CONNECT WALLET"}
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
                </div>
                ————— OR —————
                <SocialLoginButton strategy="google" />
                <SocialLoginButton strategy="facebook" />
                <SocialLoginButton strategy="apple" />
            </div>
          </div>
        </div>
      )}
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