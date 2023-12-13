import {
    ConnectWallet,
    ThirdwebNftMedia,
    useAddress,
    useContract,
    useContractRead,
    useOwnedNFTs,
    useTokenBalance,
    Web3Button,
  } from "@thirdweb-dev/react";
  import { BigNumber, ethers } from "ethers";
  import { useEffect, useState } from "react";
import NFTGrid from "../components/NFT/NFTGrid.jsx";
  import { NFT_COLLECTION_ADDRESS3, tokenContractAddress, stakingContractAddress4 } from "../const/contractAddresses"
  import styles from "../styles/stake.module.css";
import Container from "../components/Container/Container.jsx";
import NFTCard from "../components/NFTCard.jsx"
  
  const Stake3 = () => {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
      NFT_COLLECTION_ADDRESS3,
      "nft-drop",
    );
    const { contract: tokenContract } = useContract(
      tokenContractAddress,
      "token",
    );
    const { contract, isLoading } = useContract(stakingContractAddress4);
    const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
    const { data: tokenBalance } = useTokenBalance(tokenContract, address);
    const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
    const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
      address,
    ]);
  
    useEffect(() => {
      if (!contract || !address) return;
  
      async function loadClaimableRewards() {
        const stakeInfo = await contract?.call("getStakeInfo", [address]);
        setClaimableRewards(stakeInfo[1]);
      }
  
      loadClaimableRewards();
    }, [address, contract]);
  
    async function stakeNft(id: string) {
      if (!address) return;
  
      const isApproved = await nftDropContract?.isApproved(
        address,
        stakingContractAddress4,
      );
      if (!isApproved) {
        await nftDropContract?.setApprovalForAll(stakingContractAddress4, true);
      }
      await contract?.call("stake", [[id]]);
    }
  
    if (isLoading) {
      return (
        <div
          style={{
            margin: "5%",
            fontSize: "25px",
            width: "400px",
            textAlign: "center",
            color: "white",
            minWidth: "100%",
            padding: "10%"
          }}
        >
          LOADING...
        </div>
      );
    }
  
    return (
      <>
     
  
          {!address ? (
            <ConnectWallet />
          ) : (
            <>
              <div className={styles.tokenGrid}>
                <div className={styles.tokenItem}>
                  <h3 className={styles.tokenLabel}>Rewards Earned</h3>
                  <p className={styles.tokenValue}>
                    <b>
                      {!claimableRewards
                        ? "Loading..."
                        : ethers.utils.formatUnits(claimableRewards, 18)}
                    </b>{" "}
                    {tokenBalance?.symbol}
                  </p>
                </div>
                <div className={styles.tokenItem}>
                  <h3 className={styles.tokenLabel}>Current Balance</h3>
                  <p className={styles.tokenValue}>
                    <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
                  </p>
                </div>
              </div>
              <Web3Button
            style={{
              backgroundColor: "black",
              borderStyle: "solid",
              borderColor: "Orange",
              color: "Orange",
            }}
            action={(contract) => contract.call("claimRewards")}
            contractAddress={stakingContractAddress4}
          >
            Claim Rewards
          </Web3Button>
              <h2 style={{ textAlign: "center", color: "lightgreen" }}>Staked Tokens</h2>
              <div className={styles.nftBoxGrid}>
                {stakedTokens &&
                  stakedTokens[0]?.map((stakedToken: BigNumber) => (
                    <NFTCard
                      tokenId={stakedToken.toNumber()}
                      key={stakedToken.toString()}
                    />
                  ))}
              </div>
              <div style={{height: "50px"}}></div>
              <h1 style={{ textAlign: "center", color: "lightred" }}>Unstaked Tokens</h1>
              <div className={styles.nftBoxGrid}>
                {ownedNfts?.map((nft) => (
                  <div key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      style={{
                        borderRadius: "32px",
                        width: "100%",
                        height: "250px",
                      }}
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                
                    <h5 style={{ textAlign: "center" }}>{nft.metadata.name}</h5>
                 
                    <Web3Button
                      style={{
                        backgroundColor: "black",
                        borderStyle: "solid",
                        borderColor: "Orange",
                        color: "Orange",
                        alignItems: "center",
                      }}
                      contractAddress={stakingContractAddress4}
                      action={() => stakeNft(nft.metadata.id)}
                    >
                      Stake
                    </Web3Button>
            
                  </div>
                ))}
              </div>
            </>
          )}
  
      </>
    );
  };
  
  export default Stake3;