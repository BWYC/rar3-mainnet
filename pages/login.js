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
<div style={{height: "250px"}}></div>
{address ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}>
          <ConnectWallet/>
        <Link className="button" style={{margin: "5%"}} href="">ENTER DEX</Link>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '50%',
            height: '50vh',
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
              padding: '0.5rem 1rem',
              borderBottom: '1px solid #EEE',
              height: '100%'
            }}>
              <div style={{
                minWidth: "80%"
              }}>
                 <p style={{ textAlign: "center",  textShadow: "lightblue 1px 1px 5px", margin: "3%", color: "lightgray" }}>RAREBAY SIGN IN</p>
                <EmailSignIn />
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '2rem',
                  marginBottom: '1rem',
                  color: '#CCC'
                }}>
                  <hr style={{ width: "45%", borderTop: "1px solid #CCC" }}/>
                  <p>or</p>
                  <hr style={{ width: "45%", borderTop: "1px solid #CCC" }} />
                </div>
                <SocialLoginButton strategy="google" />
                <SocialLoginButton strategy="facebook" />
                <SocialLoginButton strategy="apple" />
              </div>
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