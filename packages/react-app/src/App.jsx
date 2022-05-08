import WalletConnectProvider from "@walletconnect/web3-provider";
import { Button, Affix, Layout, Space } from "antd";
import "antd/dist/antd.css";
import { useUserAddress } from "eth-hooks";
import { ethers } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Web3Modal from "web3modal";
import { GithubOutlined } from "@ant-design/icons";
import "./App.css";
import { Address, Header } from "./components";
import { INFURA_ID, NETWORKS } from "./constants";
import signatorLogo from "./images/sig-logo.png";
import Signator from "./Signator";
import SignatorViewer from "./SignatorViewer";
import snapshot from '@snapshot-labs/snapshot.js';
import addresses from "./addresses";


const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
const client = new snapshot.Client712(hub);
const { Footer } = Layout;
/*
    Welcome to Signatorio !
*/

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.mainnet; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 😬 Sorry for all the console logging
const DEBUG = true;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

const scaffoldEthProvider = new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544");
const mainnetInfura = new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID);

// 🔭 block explorer URL
const blockExplorer = targetNetwork.blockExplorer;

/*
  Web3 modal helps us "connect" external wallets:
*/
const web3Modal = new Web3Modal({
  // network: "mainnet", // optional
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
});

const logoutOfWeb3Modal = async () => {
  await web3Modal.clearCachedProvider();
  window.localStorage.removeItem("walletconnect");
  setTimeout(() => {
    window.location.reload();
  }, 1);
};

function App() {
  const mainnetProvider = scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura;

  const [injectedProvider, setInjectedProvider] = useState();

  const [chainList, setChainList] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    const space = 'cre8r.eth';
const strategies = [
  {
    "name": "masterchef-pool-balance",
    "network": "250",
    "params": {
      "pid": "39",
      "symbol": "BEETSLP -> SLP",
      "weight": 202,
      "tokenIndex": null,
      "chefAddress": "0x8166994d9ebBe5829EC86Bd81258149B87faCfd3",
      "uniPairAddress": null,
      "weightDecimals": 3
    }
  },
  {
    "name": "erc20-balance-of-weighted",
    "network": "250",
    "params": {
      "symbol": "reaper",
      "weight": 0.2021571004,
      "address": "0xd70257272b108677B017A942cA80fD2b8Fc9251A",
      "decimals": 18
    }
  },
  {
    "name": "erc20-balance-of-weighted",
    "network": "250",
    "params": {
      "symbol": "moo",
      "address": "0x503FF2102D51ec816C693017d26E31df666Cadf0",
      "decimals": 18,
      "weight": 2.950783334
    }
  },
  {
    "name": "erc20-balance-of-weighted",
    "network": "250",
    "params": {
      "symbol": "beluga",
      "weight": 1,
      "address": "0x6D931508d47f1D858c209C5296E9afC091a2Ddff",
      "decimals": 18
    }
  },
  {
    "name": "contract-call",
    "network": "250",
    "params": {
      "symbol": "spiritLPCRE8R",
      "address": "0xDcD990038d9CBe98B84a6aD9dBc880e3d4b06599",
      "decimals": 18,
      "methodABI": {
        "name": "balanceOf",
        "type": "function",
        "inputs": [
          {
            "name": "account",
            "type": "address",
            "internalType": "address"
          }
        ],
        "outputs": [
          {
            "name": "",
            "type": "uint256",
            "internalType": "uint256"
          }
        ],
        "stateMutability": "view"
      }
    }
  }
];
const network = '250';
const voters = addresses

const blockNumber = 37320000;

snapshot.utils.getScores(
  space,
  strategies,
  network,
  voters,
  blockNumber
).then(scores => {
  console.log('Scores', scores);
  setData(scores)
  console.log(scores &&  scores.filter((val, i) => val[address] != null)[0] &&scores.filter((val, i) => val[address] != null)[0] [address]  )
  console.log(address)
});
 // console.log('addresses:',addresses.map(address=>address.toString(16)))
    const getChainList = async () => {
      try {
        const rawChainList = await fetch("https://chainid.network/chains.json");
        const chainListJson = await rawChainList.json();

        setChainList(chainListJson);
      } catch (e) {
        console.log(e);
      }
    };
    getChainList();
  }, []);

  // Use your injected provider from 🦊 Metamask or if you don't have it then instantly generate a 🔥 burner wallet.
  const address = useUserAddress(injectedProvider);

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect();
    setInjectedProvider(new ethers.providers.Web3Provider(provider));

    provider.on("chainChanged", chainId => {
      console.log(`chain changed to ${chainId}! updating providers`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    provider.on("accountsChanged", () => {
      console.log(`account changed!`);
      setInjectedProvider(new ethers.providers.Web3Provider(provider));
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      logoutOfWeb3Modal();
    });
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  const [route, setRoute] = useState();
  useEffect(() => {
    setRoute(window.location.pathname);
  }, [setRoute]);

  const modalButtons = [];
  if (web3Modal) {
    if (web3Modal.cachedProvider) {
      modalButtons.push(
        <Button
          key="logoutbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 2 }}
          shape="round"
          size="large"
          onClick={logoutOfWeb3Modal}
        >
          logout
        </Button>,
      );
    } else {
      modalButtons.push(
        <Button
          key="loginbutton"
          style={{ verticalAlign: "top", marginLeft: 8, marginTop: 2 }}
          shape="round"
          size="large"
          /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
          onClick={loadWeb3Modal}
        >
          connect
        </Button>,
      );
    }
  }

  return (
    <div className="App">
      {/* ✏️ Edit the header and change the title to your project name */}
      <Affix offsetTop={0}>
        <Header
          extra={[
            address && <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />,
            ...modalButtons,
          ]}
        />
      </Affix>
      <div className="logo-wrapper">
        <img className="logo" src={signatorLogo} alt="Signatorio" />
      </div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Signator
              mainnetProvider={mainnetProvider}
              injectedProvider={injectedProvider}
              address={address}
              loadWeb3Modal={loadWeb3Modal}
              chainList={chainList}
            />
          </Route>
          <Route path="/view">
            <SignatorViewer
              mainnetProvider={mainnetProvider}
              injectedProvider={injectedProvider}
              address={address}
              loadWeb3Modal={loadWeb3Modal}
              chainList={chainList}
            />
          </Route>
        </Switch>
      </BrowserRouter>

      {/* <ThemeSwitch /> */}
      <Footer style={{ textAlign: "center", fontSize: "16px" }}>
        <Space>
          <a href="https://github.com/CRE8RDAO/bb" target="_blank">
            <GithubOutlined />
          </a>
          <span>Your CRE8R Voting Power {data &&  data.filter((val, i) => val[address] != null)[0] &&data.filter((val, i) => val[address] != null)[0] [address]}</span>
          <a href="https://cre8r.vip/boosted-bribes/" target="_blank">
            🧱 Boosted Bribes™ {" "}
          </a>
        </Space>
      </Footer>
    </div>
  );
}

export default App;
