import { useContract, useContractEvents, useContractRead, useTotalCirculatingSupply, useAddress } from "@thirdweb-dev/react";
import {Twitter, Discord, HandCoin, ArrowDown, Dapps, Checkmark } from '@web3uikit/icons'
import Link from "next/link";

export default function Data() {
    const address = useAddress();
    const { contract } = useContract("0xF6C2584850Fd1F50fc979F72888Fb67CFa39a2C2");
    const { data: NFTs, isLoading, error } = useTotalCirculatingSupply(contract);
    const { data: Royalty } = useContractRead(contract, "getDefaultRoyaltyInfo")

    return(
        <>
        <div style={{display: "flex", marginLeft: "10px", marginBottom: "2%", position: "absolute", zIndex: "1", outline: "solid 0px lightgray", padding: "10px", borderRadius: "4px", filter: "opacity(1)", background: "rgba(0, 0, 0, 0.1)", fontSize: "13px", gap: "10px", color: "lightgray", marginTop: "1%" }}>
<ArrowDown fontSize='20px'/><Link href="/mints">MINT</Link><div style={{width: "2px", height: "100%", background: "white"}} />
  <HandCoin fontSize='20px'/> <Link href="/pools">STAKE</Link>
</div>
        </>
    )
}