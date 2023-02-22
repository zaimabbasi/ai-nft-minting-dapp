import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface WalletState {
    account: string;
}

const initialState: WalletState = {
    account: ""
};

const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        setAccount: (state, action) => {
            const { account } = action.payload;
            state.account = account;
        },
        clearAccount: (state) => {
            state.account = initialState.account;
        }
    }
});

export const selectAccount = (state: RootState) => state.wallet.account;

export const { setAccount, clearAccount } = walletSlice.actions;

export default walletSlice.reducer;
