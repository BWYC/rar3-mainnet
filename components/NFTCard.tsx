import {
    ThirdwebNftMedia,
    useContract,
    useNFT,
    Web3Button,
  } from "@thirdweb-dev/react";
  import type { FC } from "react";
  import { NFT_COLLECTION_ADDRESS, stakingContractAddress } from "../const/contractAddresses";
  import styles from "../styles/Home.module.css";
  
  interface NFTCardProps {
    tokenId: number;
  }
  
  const NFTCard: FC<NFTCardProps> = ({ tokenId }) => {
    const { contract } = useContract(NFT_COLLECTION_ADDRESS, "nft-drop");
    const { data: nft } = useNFT(contract, tokenId);
  
    return (
      <>
        {nft && (
          <div style={{alignItems: "center", gap: "20px"}}>
            {nft.metadata && (
              <ThirdwebNftMedia
                style={{ borderRadius: "8px", width: "100%", height: "250px"  }}
                metadata={nft.metadata}
                className={styles.nftMedia}
              />
            )}
      
  
            <h5 style={{ textAlign: "center" }}>#{nft.metadata.id}</h5>
      
            <Web3Button
              isDisabled
              style={{
                backgroundColor: "transparent",
                border: " solid 1px grey",
                color: "white",
                textShadow: "white 1px 1px 5px",
                display: "flex",
                alignItems: "center",
                margin: "5%"
              }}
              action={(contract) =>
                contract?.call("withdraw", [[nft.metadata.id]])
              }
              contractAddress={stakingContractAddress}
            >
              LOCKED⛔
            </Web3Button>
          
          </div>
        )}
      </>
    );
  };
  export default NFTCard;