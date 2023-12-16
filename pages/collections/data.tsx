import { useContract, useContractEvents, useContractRead, useTotalCirculatingSupply, useAddress, useValidDirectListings, useValidEnglishAuctions, useClaimedNFTs } from "@thirdweb-dev/react";
import {Twitter, Discord, UserTeam, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import CollectionPurchaseSection from "../../components/collectionPurchaseSection"
import Image from "next/image";
import { useNFTs } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "../../const/contractAddresses";
import { Eye } from "web3uikit";
import {Grid, User} from '@web3uikit/icons'
import Link from "next/link";


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
        <div style={{display: "flex", padding: "1%", backdropFilter: "blur(100px)", filter: "opacity(1)", fontSize: "20px", gap: "10px", color: "", width: "90%", height: "40px", justifyItems: "center" }}>
<User fontSize={25} style={{color: "orange"}} />{NFTs?.toNumber()}<hr style={{margin: "5px"}} />
<Link href="/collection" style={{textAlign: "center", padding: "1%", border: "solid 0px gray", fontSize: "16px", borderRadius: "8px", width: "50px", height: "100%"}}><Eye fontSize={25} /></Link>
          <Link href="#" style={{textAlign: "center", padding: "1%", border: "solid 0px gray", fontSize: "16px", borderRadius: "8px", width: "50px", height: "100%"}}><Grid fontSize='25px'/></Link>
</div>

        </>
    )
}