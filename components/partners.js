import React from 'react'

import PropTypes from 'prop-types'
import {Discord2, TwitterOutline, Network} from '@web3uikit/icons'
import X from "../public/x.png"
import C from "../public/core.png"
import { NetworkInput } from '@thirdweb-dev/sdk'
import { NetworkSelector } from '@thirdweb-dev/react'
import Link from 'next/link'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Head from "next/head";
import { Inter } from "next/font/google";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ACTIVE_CHAIN, DEX_ADDRESS, TOKEN_ADDRESS } from "../const/details";
import {
  ConnectWallet,
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractMetadata,
  useContractRead,
  useContractWrite,
  useNetworkMismatch,
  useSDK,
  useSwitchChain,
  useTokenBalance,
} from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import SwapInput from "./input";
import { BigNumber } from 'ethers'

const animation = { duration: 60000, easing: (t) => t }


const Patner = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
  })
  const toast = useToast();
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_ADDRESS, "token");
  const { contract: dexContract } = useContract(DEX_ADDRESS, "custom");
  const { data: symbol } = useContractRead(tokenContract, "symbol");
  const { data: tokenMetadata } = useContractMetadata(tokenContract);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(
    tokenContract,
    DEX_ADDRESS
  );

  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const sdk = useSDK();
  const [contractBalance, setContractBalance] = useState("0");

  const [nativeValue, setNativeValue] = useState("0");
  const [tokenValue, setTokenValue] = useState("0");
  const [currentFrom, setCurrentFrom] = useState("native");
  const [loading, setLoading] = useState(false);


const Price = contractBalance  / contractTokenBalance?.decimals


  const { mutateAsync: swapNativeToToken } = useContractWrite(
    dexContract,
    "swapEthTotoken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    currentFrom === "native"
      ? [
          toWei(nativeValue || "0"),
          toWei(contractBalance || "0"),
          contractTokenBalance?.value,
        ]
      : [
          toWei(tokenValue || "0"),
          contractTokenBalance?.value,
          toWei(contractBalance || "0"),
        ]
  );




  const fetchContractBalance = async () => {
    try {
      const balance = await sdk?.getBalance(DEX_ADDRESS);
      setContractBalance(balance?.displayValue || "0");
    } catch (err) {
      console.error(err);
    }
  };

  const executeSwap = async () => {
    setLoading(true);
    if (isMismatched) {
      switchChain(ACTIVE_CHAIN.chainId);
      setLoading(false);
      return;
    }
    try {
      if (currentFrom === "native") {
        await swapNativeToToken({ overrides: { value: toWei(nativeValue) } });
        toast({
          status: "success",
          title: "Swap Successful",
          description: `You have successfully swapped your ${
            ACTIVE_CHAIN.nativeCurrency.symbol
          } to ${symbol || "tokens"}.`,
        });
      } else {
        // Approve token spending
        await approveTokenSpending({ args: [DEX_ADDRESS, toWei(tokenValue)] });
        // Swap!
        await swapTokenToNative({ args: [toWei(tokenValue)] });
        toast({
          status: "success",
          title: "Swap Successful",
          description: `You have successfully swapped your ${
            symbol || "tokens"
          } to ${ACTIVE_CHAIN.nativeCurrency.symbol}.`,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Swap Failed",
        description:
          "There was an error performing the swap. Please try again.",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractBalance();
    setInterval(fetchContractBalance, 10000);
  }, []);

  useEffect(() => {
    if (!amountToGet) return;
    if (currentFrom === "native") {
      setTokenValue(toEther(amountToGet));
    } else {
      setNativeValue(toEther(amountToGet));
    }
  }, [amountToGet]);

  return (
    <>
      <div  ref={sliderRef} className="keen-slider" >
        <div className="keen-slider__slide number-slide1" >
          <Link href="https://coredao.org" style={{display: "flex"}}><Image width="40" height="40" src="/core.png" alt="CORE"/><p style={{padding: "7px", fontFamily: "Arial" }}>CoreDAO</p></Link>
 
      <Link href="https://rarebay.xyz"  style={{display: "flex"}}>  <Image width="40" height="40" src="/fav-200h.ico" alt="RARE" style={{borderRadius: "100%"}}/><p style={{padding: "7px", fontFamily: "Arial" }}>RareBay.xyz</p></Link>
     
      <Link href="https://thirdweb.com"  style={{display: "flex"}}>  <Image width="40" height="40" src="/3rd.png" alt="ThirdWeb"  /><p style={{padding: "7px", fontFamily: "Arial" }}>ThirdWeb</p></Link>
      <Link href="https://metamask.io"  style={{display: "flex"}}>  <Image width="40" height="40" src="/mt.png" alt="" /><p style={{padding: "7px", fontFamily: "Arial" }}>MetaMask</p></Link>
      <Link href="https://bitcoin.org"  style={{display: "flex"}}>  <Image width="40" height="40" src="/btc2.png" alt="" />
      <p style={{padding: "7px", fontFamily: "Arial" }}>Bitcoin</p>
      </Link>
          <Link href="https://nextjs.org"  style={{display: "flex"}}>  <Image width="40" height="40" src="/px.png" alt="" style={{borderRadius: "100%", padding: "0px", display: "flex"}} /><p style={{padding: "7px", fontFamily: "Arial" }}>NEXTJS</p></Link>
          <Link  style={{display: "flex"}} href="https://boredwhalesyachtclub,org">  <Image width="40" height="40"  src="/favicon.png" alt="BWYC" />
          <p style={{padding: "7px", fontFamily: "Arial" }}>BWYC</p>
          </Link>
        </div>
        <div className="keen-slider__slide number-slide1">
         <p className="home-heading1" >Liquidity: {contractBalance} CORE </p>
        </div>
        <div className="keen-slider__slide number-slide1">
        <p className="home-heading1" > Locked: {contractTokenBalance?.displayValue} </p>
        <p className="home-heading1" > WHLS/CORE: {Price}$ </p>
        </div>
      </div>
      <style jsx>
        {`
         .home-heading1 {
          color: rgb(140, 140, 140);
          height: 100%;
          width: 100%;
          font-size: 16px;
          align-self: center;
          padding: 10px;
          background: -webkit-linear-gradient(
            rgb(1, 12, 241),
            rgb(250, 100, 100)
          );
          margin-top: 0px;
          text-align: center;
          transition: 0.3s;
          font-family: "Pixel NES";
          text-decoration: none;
          background-image: linear-gradient(
            rgb(100, 100, 155) 1%,
            rgb(100, 100, 100) 49%,
            rgb(255, 100, 0) 98%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
          .footer-container {
            width: 100%;
            height: 60px;
            display: flex;
            z-index: auto;
            position: absolute;
            align-items: center;
            font-family: 'pixel NES';
            flex-direction: row;
            padding-bottom: 6px;
            justify-content: center;
            margin-top: -5%;
            margin-left: -5%;
            cursor: pointer;
            color: initial;
            font-size: 10px;
            backdrop-filter: blur(10px);
            justify-self: center;
          }
          .footer-container1 {
            width: auto;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 2%;
            cursor: pointer;
            gap: 20px;
            color: white;
          }
          .footer-container2 {
            width: 100%;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: lightgray;
          }
          .footer-text {
            width: 100%;
            text-align: center;
            color: initial;
          }
          .footer-root-class-name {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name1 {
            right: 0px;
            bottom: -11px;
          }
          .footer-root-class-name2 {
            right: 0px;
            bottom: -11px;
          }
          .footer-root-class-name3 {
            right: -1px;
            bottom: -14px;
          }
          .footer-root-class-name4 {
            left: -5px;
            bottom: -12px;
          }
          .footer-root-class-name5 {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name6 {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name7 {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name8 {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name9 {
            left: -2px;
            bottom: -2px;
          }
          .footer-root-class-name10 {
            left: -2px;
            bottom: -2px;
          }
          @media (max-width: 1004px) {
            .footer-text {
              font-size: 13px;
            }
          }
          @media (max-width: 479px) {
            .footer-container{
              display: none;
            }
            .footer-container1 {
              gap: 5;
              width: auto;
            }
            .footer-text {
              font-size: 10px;
            }
          }
          body {
            margin: 0;
            font-family: "Inter", sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          [class^="number-slide"],
          [class*=" number-slide"] {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 900;
            height: 70px;
            max-height: 100vh;
            text-align: center;
            gap: 100px;
            padding: 10px;
            width: 100%;
          }
          
          .number-slide1 {
            background: transparent;
            backdropfilter: blur(50px);
            width: 100%;
            padding: 1%;
            display: flex;
          }  
            .number-slide12{
            background: rgba(0, 0, 0, 0.498);
            backdropfilter: blur(50px);
            width: 100%;
            padding: 1%;
            fontStyle: arial italics;

          }  
        `}
      </style>
    </>
  )
}



export default Patner;