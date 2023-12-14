import {
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
  useValidEnglishAuctions,
} from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS2,
} from "../../const/contractAddresses";
import Skeleton from "../Skeleton/Skeleton";
import styles from "./NFT.module.css";
import truncateEthAddress from "truncate-eth-address";
import { Tooltip } from "web3uikit";


type Props = {
  nft: NFT;
};

export default function NFTComponent({ nft }: Props) {
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3",
  );

  // 1. Load if the NFT is for direct listing
  const { data: directListing, isLoading: loadingDirect } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS2,
      tokenId: nft.metadata.id,
    });

  // 2. Load if the NFT is for auction
  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS2,
      tokenId: nft.metadata.id,
    });
  const owner = nft.owner as string;

  return (
    <>
<Tooltip content={"Buy"} position="bottom">
      <ThirdwebNftMedia metadata={nft.metadata} style={{width: "100%", height: "100%", borderRadius: "16px", overflow: "hidden"}} />

      <p className={styles.nftName}>
        {nft.metadata.id}: {truncateEthAddress(owner)}
      </p>
      <div className={styles.priceContainer}>
        {loadingContract || loadingDirect || loadingAuction ? (
          <Skeleton width="100%" height="100%" />
        ) : directListing && directListing[0] ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price💲</p>

              <p
                className={styles.nftPriceValue}>
                {`${directListing[0]?.currencyValuePerToken.displayValue}
            ${directListing[0]?.currencyValuePerToken.symbol}`}


              </p>
			  <div>

			  </div>

            </div>
          </div>
        ) : auctionListing && auctionListing[0] ? (
          <div className={styles.nftPriceContainer}>
            <div>
              <p
                className={styles.nftPriceLabel}
        
              >
                Minimum Bid
              </p>
              <p
                className={styles.nftPriceValue}
              
              >
                {`${auctionListing[0]?.minimumBidCurrencyValue.displayValue}
            ${auctionListing[0]?.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.nftPriceContainer}>
            <div>
              <p className={styles.nftPriceLabel}>Price💲</p>
              <p
                className={styles.nftPriceValue}>
                unListed
              </p>
            </div>
          </div>
        )}
      </div>

      </Tooltip>
    </>
  );
}