import { useEmbeddedWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import styles from "../styles/login.module.css";
import React from "react";



export default function EmailSignIn() {
    const [state, setState] = useState<
        "init" | "sending_email" | "email_verification"
    >("init");

    const [email, setEmail] = useState<string>("");
    const [verificationCode, setVerificationCode] = useState<string>("");
    const { connect, sendVerificationEmail } = useEmbeddedWallet();
  const recaptchaRef = React.createRef();
  const handleSubmit = (event: { preventDefault: () => void; }) => {
  };
  
  const onReCAPTCHAChange = (captchaCode: any) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if(!captchaCode) {
      return;
    }
    // Else reCAPTCHA was executed successfully so proceed with the 
    // alert
    alert(`Hey, ${email}`);
    // Reset the reCAPTCHA so that it can be executed again if user 
    // submits another email.
  }

    const handleEmailEntered = async () => {
        if (!email) {
            alert("Please enter an email");
            return;
        }
        setState("sending_email");
        await sendVerificationEmail({ email });
        setState("email_verification");
    };

    const handleEmailVerification = async () => {
        if (!email || !verificationCode) {
            alert("Please enter an verification code");
            return;
        }
        await connect({ strategy: "email_verification", email, verificationCode });
    };

    if (state === "sending_email") {
        return <div className={styles.spinner} />;
    }

    if (state === "email_verification") {
        return (
            <>
            <p style={{ color: "#333", margin: "10px"}}>Enter the verification code sent to your email</p>
     
            <input
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                style={{
                    width: "100%",
                    height: "42px",
                    marginBottom: "1rem",
                    border: "1px solid #CCC",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem"
                }}
            />
            <button 
                className={styles.emailSignInBtn}
                onClick={handleEmailVerification}
                style={{
                    width: "100%",
                    height: "42px",
                    marginBottom: "1rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "RoyalBlue",
                    color: "#FFF",
                    border: "1px solid RoyalBlue",
                    borderRadius: "8px",
                }}
            >
                Verify
            </button>
            <a onClick={() => setState("init")}>
                <p style={{ color: "royalblue", cursor: "pointer", textAlign: "center" }}>Go Back</p>
            </a>
            </>
    );
    }

    return (
        <>
               <form onSubmit={handleSubmit}>

            <input 
                type="text" 
                style={{
                    width: "100%",
                    height: "42px",
                    marginBottom: "1rem",
                    border: "1px solid #CCC",
                    borderRadius: "8px",
                    padding: "0.5rem 1rem"
                }}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
            type="submit"
            className={styles.emailSignInBtn}
                style={{
                    width: "100%",
                    height: "42px",
                    marginBottom: "1rem",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "RoyalBlue",
                    color: "#FFF",
                    border: "1px solid RoyalBlue",
                    borderRadius: "8px",
                }}
                onClick={handleEmailEntered}
            >Sign In</button>
            </form>
        </>
    );
}