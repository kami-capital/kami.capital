import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
 import { abi as kamiAbi } from "../abi/KAMIV2.json";
 
import { setAll } from "../helpers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk } from "./interfaces";
 
interface IUserBalances {
  balances: {
    kami: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let kamiBalance = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");

    if (address) {
      try {
       
        const kamiContract = new ethers.Contract(
          addresses[networkID].TOKEN_ADDRESS as string,
          kamiAbi,
          provider.getSigner(),
        ) ; 
        kamiBalance = await kamiContract.balanceOf(address);

        poolBalance = BigNumber.from("0");


       
      } catch (e) {
        console.warn("caught error in getBalances", e);
      }
    }

    return {
      balances: {
        kami: ethers.utils.formatEther(kamiBalance),
        pool: poolBalance,
      },
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let poolAllowance = BigNumber.from("0");
    if (address) {
      try {
         poolAllowance =BigNumber.from("1");// await kamiContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      } catch (e) {
        console.warn("failed contract calls in slice", e);
      }
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      pooling: {
        kamiPool: +poolAllowance,
      },
    };
  },
);

interface IAccountSlice extends IUserBalances {
  balances: {
    kami: string;
    pool: string;
  };
  loading: boolean;
  pooling: {
    kamiPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: true,
  balances: {
    kami: "",
    pool: "",
  },
  pooling: { kamiPool: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
