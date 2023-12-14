import React from 'react'

import PropTypes from 'prop-types'
import useState from "react"
import {Discord2, TwitterOutline, Network} from '@web3uikit/icons'
import Image from 'next/image'
import X from "../public/x.png"
import C from "../public/core.png"
import { NetworkInput } from '@thirdweb-dev/sdk'
import { NetworkSelector } from '@thirdweb-dev/react'
import Link from 'next/link'
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"


const animation = { duration: 40000, easing: (t: any) => t }


const Patner = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
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
  return (
    <>
      <div  ref={sliderRef} className="keen-slider" >
        <div className="keen-slider__slide number-slide1" >
          <Link href="https://coredao.org">  <Image width="70" height="70" src={C} alt="CORE"/></Link>
 
      <Link href="https://rarebay.xyz">  <Image width="60" height="60" src="/fav-200h.ico" alt="RARE" style={{borderRadius: "100%"}}/></Link>
     
      <Link href="https://thirdweb.com">  <Image width="100" height="30" src="/3rd.png" alt="ThirdWeb" style={{borderRadius: "8px", border: "solid 0px gray", boxShadow: "gray 1px 1px 3px"}} /></Link>
      <Link href="https://metamask.io">  <Image width="68" height="68" src="/mt.png" alt="" /></Link>
      <Link href="https://bitcoin.org">  <Image width="50" height="50" src="/btc2.png" alt="" /></Link>
          <Link href="https://nextjs.org">  <Image width="50" height="50" src="/px.png" alt="" /></Link>
          <Link href="https://boredwhalesyachtclub,org">  <Image width="70" height="70"  src="/favicon.png" alt="BWYC" /></Link>
        </div>
        <div className="keen-slider__slide number-slide1">
         <p className="home-heading1" >HOME OF THE RAREST</p>
        </div>
        <div className="keen-slider__slide number-slide1">
        <p className="home-heading1">RAR3BAY.xyz</p> 
        </div>
      </div>
      <style jsx>
        {`
         .home-heading1 {
          color: rgb(140, 140, 140);
          height: 100%;
          width: 100%;
          font-size: 30px;
          align-self: center;
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
        .home-heading1:hover {
          font-size: 40px;
          cursor: pointer;
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
            font-size: 30px;
            font-weight: 900;
            height: 70px;
            max-height: 100vh;
            gap: 150px;
          }
          
          .number-slide1 {
            background: transparent;
            backdropfilter: blur(50px);
            width: 20px;
            padding: 1%;
          }  
            .number-slide12{
            background: rgba(0, 0, 0, 0.498);
            backdropfilter: blur(50px);
            width: 20px;
            padding: 1%;
            fontStyle: arial italics;

          }  
        `}
      </style>
    </>
  )
}



export default Patner;