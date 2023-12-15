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
  import { NFT_COLLECTION_ADDRESS, tokenContractAddress, stakingContractAddress } from "../const/contractAddresses"
  import styles from "../styles/stake.module.css";
import Container from "../components/Container/Container";
import NFTCard from "../components/NFTCard"
  
  const Stake = () => {
    const address = useAddress();
    const { contract: nftDropContract } = useContract(
      NFT_COLLECTION_ADDRESS,
      "nft-drop",
    );
    const { contract: tokenContract } = useContract(
      tokenContractAddress,
      "token",
    );
    const { contract, isLoading } = useContract(stakingContractAddress);
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
        stakingContractAddress,
      );
      if (!isApproved) {
        await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
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
              isDisabled
            style={{
              backgroundColor: "black",
              borderStyle: "solid",
              border: "solid 0.5px red",
              color: "red",
              textShadow: "red 1px 1px 10px",
              margin: "2%"
            }}
            action={(contract) => contract.call("claimRewards")}
            contractAddress={stakingContractAddress}
          >
            Claim Rewards
          </Web3Button>
          <h1 style={{ textAlign: "center", fontSize: "30px",  textShadow: "orange 1px 1px 5px", }}>Staked</h1>
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
              <h1 style={{ textAlign: "center", fontSize: "30px",  textShadow: "orange 1px 1px 5px", }}>Unstaked</h1>
              <div className={styles.nftBoxGrid}>
                {ownedNfts?.map((nft) => (
                  <div key={nft.metadata.id.toString()}>
                    <ThirdwebNftMedia
                      style={{
                        borderRadius: "16px",
                        width: "100%",
                        height: "250px",
                      }}
                      metadata={nft.metadata}
                      className={styles.nftMedia}
                    />
                
                    <h5 style={{ textAlign: "center" }}>#{nft.metadata.id}</h5>
                 
                    <Web3Button
                      style={{
                        backgroundColor: "transparent",
                        border: " solid 1px grey",
                        color: "white",
                        textShadow: "white 1px 1px 5px",
                        display: "flex",
                        alignItems: "center",
                        margin: "5%"
                      }}
                      contractAddress={stakingContractAddress}
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
  
  export default Stake;