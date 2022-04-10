import { ethers } from "ethers";
import { addresses } from "../constants";
 import { abi as kamiAbi } from "../abi/KAMIV2.json";

import { setAll, getTokenPrice } from "../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
 import axios from "axios";

 const networkID = '43114';

const DAILY_RATE = 2.03067241;
const REWARD_YIELD = 0.04189;
const RELATIVE_RATE = (period) =>  Math.round(((DAILY_RATE/100+1) ** period - 1) * 10000) / 100;

var kami_PRICE = '0';
var kami_24H_PRICE = 0;

var pollDataInterval;
var address;
var provider;
var signer;
var contract;

 

const getTokenPrice2 = async (address: string) => {
  let price = 0;
  let change = 0;
  let liquidity=0;
  try {
    const dataDexScreener:any = await axios.get(`https://api.dexscreener.io/latest/dex/tokens/${address}`, {
      headers: {
        accept: "application/json",
        "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
      },
    });
    
    price = parseFloat(dataDexScreener.data.pairs[0].priceUsd);
    change= dataDexScreener.data.pairs[0].priceChange.h24;
    liquidity= dataDexScreener.data.pairs[0].liquidity.usd;
  } catch (error) {
    console.log("err: ", error);
  }
  return {price,change,liquidity};
};


async function callSTTreasury(){
  const callSnowTraceTreasurykami = await fetch(`https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${addresses[networkID].TOKEN_ADDRESS}&address=${addresses[networkID].TREASURY_ADDRESS}&tag=latest&apikey=YVUHB5K8QBW7TENH6JK1QHHDJDBXG3HYYJ`);
  const dataSnowTraceTreasurykami = await callSnowTraceTreasurykami.json();
  const MKT_VALUE_TREASURY_ASSETS_kami = parseInt(ethers.utils.formatEther(dataSnowTraceTreasurykami.result.toString()));

  return MKT_VALUE_TREASURY_ASSETS_kami;
}

async function callSTRfv(){
  const callSnowTraceRFVkami = await fetch(`https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${addresses[networkID].TOKEN_ADDRESS}&address=${addresses[networkID].RFV_ADDRESS}&tag=latest&apikey=YVUHB5K8QBW7TENH6JK1QHHDJDBXG3HYYJ`);
  const dataSnowTraceRFVkami = await callSnowTraceRFVkami.json();
  const MKT_VALUE_RFV_kami = parseInt(ethers.utils.formatEther(dataSnowTraceRFVkami.result.toString()));

  return MKT_VALUE_RFV_kami;
}


async function getAvaxPriceUsd() {
  let price = 0;
  let change = 0;
  try {
    const dataDexScreener:any = await axios.get(`https://api.dexscreener.io/latest/dex/tokens/${addresses[networkID].WAVAX_ADDRESS}`, {
      headers: {
        accept: "application/json",
        "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
      },
    });
    
    price = parseFloat(dataDexScreener.data.pairs[0].priceUsd);
    change= dataDexScreener.data.pairs[0].priceChange.h24;
  } catch (error) {
    console.log("err: ", error);
  }
  return  price
}

async function getTreasuryAssetsMarketValue() {
  let price = 0;
  let change = 0;
  try {
    const dataDexScreener:any = await axios.get(`https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${addresses[networkID].TOKEN_ADDRESS}&address=${addresses[networkID].TREASURY_ADDRESS}&tag=latest&apikey=YVUHB5K8QBW7TENH6JK1QHHDJDBXG3HYYJ`, {
      headers: {
        accept: "application/json",
        "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
      },
    });
    
    price =  dataDexScreener.data.result.toString() 
  } catch (error) {
    console.log("err: ", error);
  }
  return  price
}

async function getRfvAssetsMarketValue() {
  let price = 0;
  let change = 0;
  try {
    const dataDexScreener:any = await axios.get(`https://api.snowtrace.io/api?module=account&action=tokenbalance&contractaddress=${addresses[networkID].TOKEN_ADDRESS}&address=${addresses[networkID].RFV_ADDRESS}&tag=latest&apikey=YVUHB5K8QBW7TENH6JK1QHHDJDBXG3HYYJ`, {
      headers: {
        accept: "application/json",
        "X-API-Key": "nt7iGNZbNrRtx0VEYMbmzgCPtV1Tve0o6iUP70D5vQB4raJbxpRHTN9ztwazERps",
      },
    });
    
    price =  dataDexScreener.data.result.toString() 
  } catch (error) {
    console.log("err: ", error);
  }
  return  price
}


export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    
    const {price:marketPrice, change: price_24hr_change,liquidity:liquidity } = await getTokenPrice2(addresses[networkID].TOKEN_ADDRESS);

    console.log('price change '+price_24hr_change);

    const kamiContract = new ethers.Contract(
      addresses[networkID].TOKEN_ADDRESS as string,
      kamiAbi,
      provider.getSigner(),
    ) ; 
    let rebaseStarted = true;  

    var supply = await kamiContract.getCirculatingSupply();
    const circSupply = parseInt(ethers.utils.formatEther(supply.toString()));

    const avaxMarketValue =ethers.utils.formatEther((await provider.getBalance(addresses[networkID].TREASURY_ADDRESS)).toString());

    const avaxtreasuryRFV =ethers.utils.formatEther((await provider.getBalance(addresses[networkID].RFV_ADDRESS)).toString());


    const marketCap = circSupply* marketPrice;


    console.log('marketCap change '+marketCap);

    const avaxPrice = await getAvaxPriceUsd(); 
    const   MKT_VALUE_TREASURY_ASSETS_kami =  await callSTTreasury();

    const MKT_VALUE_RFV_kami = await callSTRfv();

    const backingPerKAMI = ((Number(MKT_VALUE_RFV_kami) * marketPrice + Number(avaxtreasuryRFV) * avaxPrice + Number(avaxMarketValue) * avaxPrice + 
    Number(MKT_VALUE_TREASURY_ASSETS_kami) * marketPrice) / (circSupply * marketPrice) * 100) 


    const averageKAMIHolding =(circSupply * marketPrice / 1592) 


    const totalLiquidity = Number(liquidity) 


    const treasuryMarketValue = (Number(avaxMarketValue) * avaxPrice + Number(MKT_VALUE_TREASURY_ASSETS_kami) * marketPrice) 

    const treasuryRFV = (Number(MKT_VALUE_RFV_kami) * marketPrice + Number(avaxtreasuryRFV) * avaxPrice) 

    
    return {
      marketCap,
      marketPrice,
      price_24hr_change,
      circSupply,
      totalSupply:500000,
      treasuryMarketValue,
      backingPerKAMI,
      averageKAMIHolding,
      treasuryRFV,
      totalLiquidity,
      rebaseStarted
    } as unknown as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(loadMarketPrice()).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async () => {
  let marketPrice: number;
  try {
    marketPrice = await getTokenPrice("kami");
  } catch (e) {
    marketPrice = await getTokenPrice("kami");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly rebaseStarted: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly price_24hr_change?: number;
  readonly totalSupply?: number;
  readonly treasuryRFV?: number;
  readonly treasuryMarketValue?: number;
  readonly totalLiquidity?: number;
  readonly backingPerKAMI?: number;
  readonly averageKAMIHolding?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
  rebaseStarted:true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);


