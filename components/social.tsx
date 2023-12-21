import { MediaRenderer, embeddedWallet, smartWallet, useConnect, useEmbeddedWallet } from "@thirdweb-dev/react";
import styles from "../styles/login.module.css";
import Image from "next/image"

type SocialLoginProps = {
    strategy: any;
};

export const SocialLoginButton = ({ strategy }: SocialLoginProps) => {
    const { connect } = useEmbeddedWallet();
    const connectSmartWallet = useConnect();
    const smartWalletConfig = smartWallet(embeddedWallet(), {
        factoryAddress: "Your account factory address",
        gasless: true,
    });

    const firstChar = strategy.charAt(0).toUpperCase();
    const rest = strategy.slice(1);
    const strategyName = firstChar + rest;

    const signInWithSocial = async () => {
        const personalWallet = await connect({
            strategy: strategy,
        });
        await connectSmartWallet(
            smartWalletConfig,
            {
                personalWallet: personalWallet,
                chainId: 1116,
            } 
        );
    };

    return (
        <button
            className="button"
            style={{
                width: "100%",
                height: "50px",
                marginBottom: "1rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFF",
                border: "1px solid #CCC",
                borderRadius: "8px",
                fontSize: "12px"
            }}
            onClick={signInWithSocial}
        ><span style={{ marginRight: "10px" }}><Image src={`/${strategy}Icon.png`} height={24} width={24} alt=""/></span>{strategyName} Sign in</button>
    );
};