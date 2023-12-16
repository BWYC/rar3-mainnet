import { useContract, useContractEvents, useContractRead, useTotalCirculatingSupply, useAddress, useValidDirectListings, useValidEnglishAuctions, useClaimedNFTs } from "@thirdweb-dev/react";
import {Link, Twitter, Discord, UserTeam, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import CollectionPurchaseSection from "../../components/collectionPurchaseSection"
import Image from "next/image";
import { useNFTs } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";


export default function Data() {
    const address = useAddress();
    const { contract } = useContract("0x9ba655328197b3ff54b9554294ef8017cdc09ac3");
    const { data: NFTs, isLoading, error } = useTotalCirculatingSupply(contract);
    const { data: Royalty } = useContractRead(contract, "getDefaultRoyaltyInfo")
    // Connect to marketplace contract
    const { contract: marketplace } = useContract(
      MARKETPLACE_ADDRESS,
      "marketplace-v3",
    );
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
  
    const { data: data, isLoading: Loading } = useNFTs(
      nftCollection
    );
    const { data: directListings, isLoading: loadingDirects } =
      useValidDirectListings(marketplace);
  
    const { data: auctionListings, isLoading: loadingAuctions } =
      useValidEnglishAuctions(marketplace);

  

    return(
        <>
        <div style={{display: "flex", outline: "solid 0.5px gray", padding: "2%", borderRadius: "8px", backdropFilter: "blur(100px)", filter: "opacity(1)", background: "rgba(0, 0, 0, 0.1)", fontSize: "12px", gap: "10px", color: "", width: "100%", height: "60px", justifyItems: "center" }}>
<ArrowDown fontSize='20px'/>  ITEMS: <p style={{color: "orange"}}>{NFTs?.toNumber()}</p><hr style={{margin: "5px"}} />
FLOOR: {}<hr style={{margin: "5px"}} /><Image alt="" src="/core.png" height={40} width={40} />
VOLUME: {}<hr style={{margin: "5px"}} /><Image alt="" src="/core.png" height={40} width={40} />

</div>

        </>
    )
}