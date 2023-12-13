import { useContract, useNFT } from "@thirdweb-dev/react";
import { DirectListingV3, EnglishAuction } from "@thirdweb-dev/sdk";
import Link from "next/link";
import React from "react";
import { NFT_COLLECTION_ADDRESS2 } from "../../const/contractAddresses";
import styles from "../../styles/Buy.module.css";
import NFT from "../NFT/bwyc";
import Skeleton from "../Skeleton/Skeleton";

type Props = {
  listing: DirectListingV3 | EnglishAuction;
};

/**
 * Accepts a listing and renders the associated NFT for it
 */
export default function ListingWrapper1({ listing }: Props) {
  const { contract: nftContract } = useContract(NFT_COLLECTION_ADDRESS2);

  const { data: nft, isLoading } = useNFT(nftContract, listing.asset.id);

  if (isLoading) {
    return (
      <div className={styles.nftContainer}>
        <Skeleton width={"100%"} height="312px" />
      </div>
    );
  }

  if (!nft) return null;

  return (
    <Link
      href={`/token/0x9bA655328197b3fF54b9554294ef8017CdC09AC3/${nft.metadata.id}`}
      key={nft.metadata.id}
      className={styles.nftContainer}
    >
      <NFT nft={nft} />
    </Link>
  );
}