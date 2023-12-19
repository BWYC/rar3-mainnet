import { MediaRenderer, embeddedWallet, smartWallet, useConnect, useEmbeddedWallet } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

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
                chainId: 80001,
            } 
        );
    };

    return (
        <button
            className={styles.socialLoginBtn}
            style={{
                width: "100%",
                height: "42px",
                marginBottom: "1rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FFF",
                border: "1px solid #CCC",
                borderRadius: "8px",
            }}
            onClick={signInWithSocial}
        ><span style={{ marginRight: "10px" }}><MediaRenderer src={`/images/${strategy}Icon.png`} height="24px" width="24px"/></span> Sign in with {strategyName}</button>
    );
};