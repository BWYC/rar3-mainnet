import { useContract, useNFTs, useAddress, useOwnedNFTs, ThirdwebNftMedia,  useValidDirectListings,
  useValidEnglishAuctions } from "@thirdweb-dev/react";
import Container from "../components/Container/Container";
import { NFT_COLLECTION_ADDRESS2, MARKETPLACE_ADDRESS } from "../const/contractAddresses";
import ProfilePage from "./profile/[address]";
import styles from "../styles/Profile.module.css";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react"
import tokenPageStyles from "../styles/Token.module.css";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import React, { useState } from "react";
import TokenPage from "./token/0xF6C2584850Fd1F50fc979F72888Fb67CFa39a2C2/[tokenId]";
import { color } from "web3uikit";
import {Twitter, Discord, UserTeam, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import Data from "./collections/data1"
import ListingWrapper1 from "../components/ListingWrapper/ListingWrapper1";


export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const verfied = true
  const address = useAddress();
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS2);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  const { data: ownedNfts, isLoading: isLoading } = useOwnedNFTs(
    nftCollection,
    address,
  );
  const { data: directListings, isLoading: loadingDirects } =
    useValidDirectListings(marketplace, {seller: address});

  const { data: auctionListings, isLoading: loadingAuctions } =
    useValidEnglishAuctions(marketplace, {seller: address});

   const [selectedNft, setSelectedNft] = useState<NFTType>();

 

  return (
    <Container maxWidth="lg">
      {!selectedNft ? (
        <>
        <div  style={{color: "white", height: "80px", width: "100%", padding: "1%", backdropFilter: "blur(100px)", borderRadius: "8px", fontSize: "20px", background: "rbg(0, 0, 0, 0.7)", display: "flex", flexDirection: "row", gap: "10px" }}>
        <Data />
        <p className={styles.verify}  style={{color: "white", width: "100%",  padding: "2%", borderRadius: "8px", display: "flex"}}>
      BWYC SEASON II
       {verfied ? ( <>
        <Checkmark fontSize={20} style={{background: "green", padding: "1px", border: "dashed 1px", borderRadius: "100%"}} />
       </>)
          : (<></>)}</p>
          <Link href={`/collections2`} style={{textAlign: "center", padding: "2%", border: "solid 1px gray", background: "rgba(0, 0, 50, 0.3)", fontSize: "14px", borderRadius: "8px", width: "40%", height: "60px"}}><p>VIEW ITEMS</p></Link>
        </div>
        {loadingDirects ? (
          <p>LOADING...</p>
        ) : directListings && directListings.length === 0 ? (
          <Link className="button" href="/portfolio" style={{padding: "5%"}}>Nothing for sale yet! Head to the sell tab to list an NFT.</Link>
        ) : (
          directListings?.map((listing) => (
            <ListingWrapper1 listing={listing} key={listing.id} />
          ))
        )}
        </>
      ):(
<>

                <Container maxWidth="lg">
              
                <TokenPage contractMetadata={selectedNft.metadata} nft={selectedNft} />
                  <button
                  onClick={() => {
                    setSelectedNft(undefined);
                  }}
                  className={tokenPageStyles.crossButton}
                >
                  X
                </button>
                </Container>

</>
      )}
      </Container>
  );
}