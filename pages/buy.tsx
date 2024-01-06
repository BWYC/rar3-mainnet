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
import { NFT, color } from "web3uikit";
import {Twitter, Discord, UserTeam, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import Data from "./collections/data"
import ListingWrapper from "../components/ListingWrapper/ListingWrapper";
import Skeleton from "../components/Skeleton/Skeleton";





export default function Buy() {
  // Load all of the NFTs from the NFT Collection
  const verfied = true
  const address = useAddress();
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  const [tab, setTab] = useState<"Direct Listings" | "Auctions">("Direct Listings");


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
        <div  style={{color: "white", height: "80px", width: "60%", padding: "1%", backdropFilter: "blur(10px)", borderRadius: "8px", fontSize: "16px", display: "flex", flexDirection: "row", gap: "5px", marginTop: "9%" }}>
        <Data />
        <p className={styles.verify}  style={{color: "white", width: "100%", fontSize: "14px",  padding: "2%", borderRadius: "8px", display: "flex"}}>
        RAR31ONES
       {verfied ? ( <>
        <Checkmark fontSize={16} style={{background: "green", padding: "1px", border: "dashed 1px", borderRadius: "100%"}} />
       </>)
          : (<></>)}</p>
        </div>
        <div className={styles.tabs}>
    <h3
      className={`${styles.tab} 
    ${tab === "Direct Listings" ? styles.activeTab : ""}`}
      onClick={() => setTab("Direct Listings")}
    >
      Direct Listings
    </h3>
    <h3
      className={`${styles.tab} 
    ${tab === "Auctions" ? styles.activeTab : ""}`}
      onClick={() => setTab("Auctions")}
    >
      Auctions
    </h3>
  </div>
        <div
              className={`${
                tab === "Direct Listings" ? styles.activeTabContent : styles.tabContent}`}
      >
        {loadingDirects ? (
         <Container maxWidth="lg">
          <div className={styles.spinner} />
         </Container>
        ) : directListings && directListings.length === 0 ? (
          <p>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          directListings?.map((listing) => (
            <>
            <ListingWrapper listing={listing} key={listing.id} />
            </>
          ))
        )}
      </div>
      <div
              className={`${
                tab === "Auctions" ? styles.activeTabContent : styles.tabContent}`}
      >
        {loadingAuctions ? (
         <Container maxWidth="lg">
        <div className={styles.spinner}  style={{marginTop: "10%"}} />
        </Container>
        ) : auctionListings && auctionListings.length === 0 ? (
          <p style={{display: "flex", color: "initial"}}>Nothing for sale yet! Head to the sell tab to list an NFT.</p>
        ) : (
          auctionListings?.map((listing) => (
            <ListingWrapper listing={listing} key={listing.id} />
          ))
        )}
      </div>
    </Container>
  );
}