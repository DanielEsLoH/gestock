import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Account {
  accountId: string;
  email: string;
  name: string;
  companyName?: string;
}

interface AuthState {
  token: string | null;
  account: Account | null;
  isAuthenticated: boolean;
}

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const accountStr = localStorage.getItem('account');

    if (token && accountStr) {
      try {
        const account = JSON.parse(accountStr);
        return {
          token,
          account,
          isAuthenticated: true
        };
      } catch (e) {
        // If parsing fails, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('account');
      }
    }
  }

  return {
    token: null,
    account: null,
    isAuthenticated: false
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; account: Account }>) => {
      state.token = action.payload.token;
      state.account = action.payload.account;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('account', JSON.stringify(action.payload.account));
      }
    },
    logout: (state) => {
      state.token = null;
      state.account = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('account');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
