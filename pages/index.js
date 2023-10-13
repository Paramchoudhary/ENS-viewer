import Head from "next/head";
import styles from "../pages/styles/Home.module.css";
import Web3Modal from "web3modal";
import {ethers , providers } from "ethers";
import{useEffect,useRef,useState }  from "react";


export default function Home() {

    const [walletConnected, setWalletConnected] = useState(false);

    const web3ModalRef = useRef();
   
    const [ens, setENS] = useState("");

    const [address, setAddress] = useState("");
  
  
    const setENSOrAddress = async (address, web3Provider) => {
      
      var _ens = await web3Provider.lookupAddress(address);

      if (_ens) {
        setENS(_ens);
      } else {
        setAddress(address);
      }
    };
  
  
    const getProviderOrSigner = async (needSigner = false) => {

      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
  
      // If user is not connected to the Goerli network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 5) {
        window.alert("Change the network to Goerli");
        throw new Error("Change network to Goerli");
      }
      const signer = web3Provider.getSigner();
      // Get the address associated to the signer which is connected to  MetaMask
      const address = await signer.getAddress();
      // Calls the function to set the ENS or Address
      await setENSOrAddress(address, web3Provider);
      return signer;
    };
  
 
    const connectWallet = async () => {
      try {

        await getProviderOrSigner(true);
        setWalletConnected(true);
      } catch (err) {
        console.error(err);
      }
    };
  
    /*
      renderButton: Returns a button based on the state of the dapp
    */
    const renderButton = () => {
      if (walletConnected) {
        <div>Wallet connected</div>;
      } else {
        return (
          <button onClick={connectWallet} className={styles.button}>
            Connect your wallet
          </button>
        );
      }
    };
  
   
    useEffect(() => {

      if (!walletConnected) {

        web3ModalRef.current = new Web3Modal({
          network: "goerli",
          providerOptions: {},
          disableInjectedProvider: false,
        });
        connectWallet();
      }
    }, [walletConnected]);
  
    return (
      <div>
        <Head>
          <title>ENS viewer</title>
          <meta name="description" content="ENS-Dapp" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.title}>
             your ENS or address:→ {ens ? ens : address}!
            </h1>
          
            {renderButton()}
          </div>
          <div>

          </div>
        </div>
  
       
      </div>
    );
  }