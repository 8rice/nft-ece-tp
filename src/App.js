import { useEffect, useState } from 'react';
import './App.css';
import abi from './contracts/ABI.json';
import { ethers } from 'ethers';
import AwesomeSlider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';
import 'react-awesome-slider/dist/styles.css';



const contractAddress = "0x7c49DA33aa35eD4D5fc7A0F9a92976C7221EaDb5";
const network = 'goerli';
const apiKey = "3MAnoxl3mq5l2gKBYK7xh5R9-4MXy7Ca";
const provider = new ethers.providers.AlchemyProvider(network, apiKey);

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [balanceInEth, setBalanceInEth] = useState(null);
  const [funds, setFunds] = useState(null);

  const displayBalances = async () => {
    try {
      const balances = await provider.getBalance(contractAddress);
      if (balances.length !== 0) {
        let balanceContract = balances;
        balanceContract = ethers.utils.formatEther(balanceContract);
        balanceContract = (+balanceContract).toFixed(4)
        setFunds(balanceContract);
        console.log(balanceContract)
      } else {
        console.log("Funds of contract not found");
      }
    } catch (e) {
      console.log("error : rebuild app");
    }

  }
  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!")
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
      try {
        const balances = await provider.getBalance(account);
        if (balances.length !== 0) {
          let balance = balances;
          balance = ethers.utils.formatEther(balance);
          balance = (+balance).toFixed(4)
          setBalanceInEth(balance);
          console.log(balance)
        } else {
          console.log("Balance not found");

        }
      } catch (e) {
        console.log("error : rebuild app");
      }
    } else {
      console.log("No authorized account found");
    }
  }

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Initialize payment");
        let nftTxn = await nftContract.safeMint({ gasPrice: ethers.utils.parseUnits('1000', 'gwei'), gasLimit: 250000, value: ethers.utils.parseUnits('5000000', 'gwei') });

        console.log("Mining... please wait");
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object does not exist");
      }

    } catch (err) {
      console.log(err);
    }
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const mintNftButton = () => {
    return (
      <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
        Mint NFT
      </button>
    )
  }

  useEffect(() => {
    checkWalletIsConnected();
    displayBalances();
  }, [])

  const AutoplaySlider = withAutoplay(AwesomeSlider);

  const data = [
    {
      id: "1",
      img:
        "https://gateway.pinata.cloud/ipfs/Qmd71rStzgXzUK96tKFN34G1GN3kAkizVnz7srRadGRhY1/10.png"
    },
    {
      id: "2",
      img:
        "https://gateway.pinata.cloud/ipfs/Qmd71rStzgXzUK96tKFN34G1GN3kAkizVnz7srRadGRhY1/2.png"
    },
    {
      id: "3",
      img:
        "https://gateway.pinata.cloud/ipfs/Qmd71rStzgXzUK96tKFN34G1GN3kAkizVnz7srRadGRhY1/3.png"
    },
    {
      id: "4",
      img:
        "https://gateway.pinata.cloud/ipfs/Qmd71rStzgXzUK96tKFN34G1GN3kAkizVnz7srRadGRhY1/4.png"
    },
    {
      id: "5",
      img:
        "https://gateway.pinata.cloud/ipfs/Qmd71rStzgXzUK96tKFN34G1GN3kAkizVnz7srRadGRhY1/5.png"
    }
  ];

  return (
    <div className='main-app'>
      <img alt='eth' className='floating-img' width={'50px'} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1024px-Earth_Western_Hemisphere_transparent_background.png" />
      <h1>Dogs For The Planet</h1>
      <div className='resume'>
        Spécialistes en blockchain, nous implémentons notre site web de vente de NFT. Bien que chacun de nos tokens soit unique, tous s’inscrivent dans un même ensemble cohérent. Notre collection de "Swaggy Doggies" compte une centaine de chiens personnalisés aux looks complètement barrés. Le prix du mint coûte 0.005 ETH et ce profit est directement reversé à des associations qui luttent pour la même cause que nous.
      </div>
      <div className='presentation'>
        <div className='mint'>
          <h3>Get your NFT and participate in helping the planet</h3>
          <div>
            {currentAccount ? mintNftButton() : connectWalletButton()}
          </div>
        </div>
        <div className='infos'>
          <h3>Infos</h3>
          <div className='wallet'>Address connected {currentAccount}</div>
          <div className='balance'>Your balance is {balanceInEth} <img alt='eth' width={'15px'} src="https://cryptologos.cc/logos/ethereum-eth-logo.png" /></div>
        </div>
      </div>
      <div className='funds'>
        <h3>The dogs raised</h3>
        <div>
          {funds} <img alt='eth' width={'25px'} src="https://cryptologos.cc/logos/ethereum-eth-logo.png" />
        </div>
      </div>

      <div className='slider'>
        <AutoplaySlider
          play={true}
          cancelOnInteraction={true} // should stop playing on user interaction
          interval={2000}
        >
          {data.map((d) =>
            <div>
              <img alt='dogs' className='img-auto' src={d.img} />
            </div>
          )}
        </AutoplaySlider>
      </div>
      <div className='quisommesnous'>
        <h3> Qui sommes-nous ?</h3>
        <div>
          Nous sommes 3 étudiants en école d'ingénieur, passionnés par une même cause : la lutte pour la protection de l'environnement. Aujourd'hui, il ne fait plus aucun doute que notre planète est en danger. Pollution de l’air, difficile accès à l’eau potable, destruction des écosystèmes, hausse des canicules et des catastrophes naturelles, augmentation des zoonoses… les risques liés à l’environnement sont nombreux.
        </div>
        <div>
          Désireux d'agir, nous réfléchissons alors à créer une association. Faute de temps et de moyens, nous décidons finalement d'aider des associations déjà existantes, qui luttent activement pour protéger l'environnement. Nous montons alors un projet qui permettrais de lever des fonds que nous investirons dans des associations.
        </div>
        Alors n'attends plus, soit acteur de la protection de l'environnement !
      </div>
      <div className='footer'>
        <div>
          <p>Contact</p>
          <p>Newsletter</p>
        </div>
        <div>
          <p>Who are we</p>
          <p>About the dogs</p>
          <p>What are NFTs</p>
          <p>How can I buy an NFT</p>
        </div>
        <div>
          <p>About the project</p>
          <p>What's Next</p>
        </div>
      </div>
    </div>
  )
}

export default App;
