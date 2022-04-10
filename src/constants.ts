import { NodeHelper } from "./helpers/NodeHelper";
import { EnvHelper } from "./helpers/Environment";
import ethereum from "./assets/tokens/wETH.svg"; 
import avalanche from "./assets/tokens/AVAX.svg";

export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-graph";
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

export enum NetworkId {
 // MAINNET = 1,
 // TESTNET_RINKEBY = 4, 

  POLYGON = 137,
  POLYGON_TESTNET = 80001,
  AVALANCHE_FUJI_TESTNET = 43113,
  AVALANCHE_MAINNET = 43114,

//  FANTOM = 250,
//  FANTOM_TESTNET = 4002,

  Localhost = 1337,
}

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
  56: "https://api.thegraph.com/subgraphs/name/pooltogether/bsc-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = { 
  43114: { 
    DAI_ADDRESS: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    TOKEN_ADDRESS: "0xEDdeF578a930DDc6F8Ceef10f4B00829c54686C2",
    CLAIMS_ADDRESS: "0xf01BE68406373c0F2F0eed62544A1cb0D7145250", 
    WAVAX_ADDRESS:"0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    PRESALE_ADDRESS: "0x110A07C4E81B0084F9eA9f0521E61A4F0b8F98f9", 
    TREASURY_ADDRESS: "0x34a4892E3004b7a7e577E45075Be9d69C9f13b3E", 
    RFV_ADDRESS: "0xD67e4A31A74c3A709f64c353c9c1698654bf9938", 
    TOKEN_URL: "https://i.ibb.co/XssNtyb/logo.png",
    TOKEN_SYMBOL: "KAMI",
    TOKEN_DECIMALS: "18",
  }
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: string;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [43114];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = 43114;

export const NETWORKS: { [key: number]: INetwork } = {
  1: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://bscscan.com/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(1),
  },
  4: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => EnvHelper.alchemyEthereumTestnetURI,
  }, 
  43113: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc/"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  43114: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc/"],
    blockExplorerUrls: ["https://snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(43114),
  },
  137: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "Polygon",
      symbol: "MATIC",
    },
    rpcUrls: ["https://polygon-mainnet.infura.io/v3/1030b8cbec174e90a95d512d970c2a0e"],
    blockExplorerUrls: ["https://polygonscan.com/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(43114),
  },
};
