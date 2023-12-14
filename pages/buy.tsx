import { useContract, useNFTs, useAddress, useOwnedNFTs, ThirdwebNftMedia,  useValidDirectListings,
  useValidEnglishAuctions } from "@thirdweb-dev/react";
import Container from "../components/Container/Container";
import NFTGrid from "../components/NFT/NFTGrid";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../const/contractAddresses";
import ProfilePage from "./profile/[address]";
import styles from "../styles/Profile.module.css";
import Link from "next/link";
import { Spinner } from "@chakra-ui/react"
import tokenPageStyles from "../styles/Token.module.css";
import { NFT as NFTType } from "@thirdweb-dev/sdk";
import SaleInfo from "../components/SaleInfo/SaleInfo";
import React, { useState } from "react";
import TokenPage from "./token/[contractAddress]/[tokenId]";
import { color } from "web3uikit";
import {Twitter, Discord, UserTeam, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import Data from "./collections/data"
import ListingWrapper from "../components/ListingWrapper/ListingWrapper";
import Skeleton from "../components/Skeleton/Skeleton";


export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const verfied = true
  const address = useAddress();
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  const { data: data, isLoading: isLoading } = useNFTs(
    nftCollection
  );
  const { data: directListings, isLoading: loadingDirects } =
    useValidDirectListings(marketplace);

  const { data: auctionListings, isLoading: loadingAuctions } =
    useValidEnglishAuctions(marketplace);

   const [selectedNft, setSelectedNft] = useState<NFTType>();

 

  return (
    <Container maxWidth="lg">
      {!selectedNft ? (
        <>
        <div  style={{color: "white", height: "80px", width: "100%", padding: "1%", backdropFilter: "blur(100px)", borderRadius: "8px", fontSize: "20px", background: "rbg(0, 0, 0, 0.7)", display: "flex", flexDirection: "row", gap: "10px" }}>
        <Data />
        <p className={styles.verify}  style={{color: "white", width: "100%",  padding: "2%", borderRadius: "8px", display: "flex"}}>
        RAR31ONES
       {verfied ? ( <>
        <Checkmark fontSize={20} style={{background: "green", padding: "1px", border: "dashed 1px", borderRadius: "100%"}} />
       </>)
          : (<></>)}</p>
          <Link href="/collections" style={{textAlign: "center", padding: "2%", border: "solid 1px gray", background: "rgba(0, 0, 50, 0.3)", fontSize: "14px", borderRadius: "8px", width: "40%", height: "60px"}}><p>VIEW ITEMS</p></Link>
        </div>
        <div
        className={styles.activeTabContent}
      >
        {loadingDirects ? (
         <div>
          <Skeleton width="100%" height="100" />
         </div>
        ) : directListings && directListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          directListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>
        </>
      ):(
<>

                <Container maxWidth="lg">
                <button
                  onClick={() => {
                    setSelectedNft(undefined);
                  }}
                  className={tokenPageStyles.crossButton}
                >
                  X
                </button>
                <TokenPage contractMetadata={selectedNft.metadata} nft={selectedNft} />
                </Container>

</>
      )}
      </Container>
  );
}