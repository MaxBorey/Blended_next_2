import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { exchangeCurrency } from '../service/exchangeAPI'; 

type ExchangeInfo = {
  to: string;
  from: string;
  amount: number;
  rate: number;
  result: number;
};

type CurrencyState = {
  baseCurrency: string;
  exchangeInfo: ExchangeInfo | null;
  isLoading: boolean;
  isError: boolean | null;
  hasHydrated: boolean;
  setBaseCurrency: (currency: string) => void;
  setHasHydrated: (state: boolean) => void;
  convert: (from: string, to: string, amount: number) => Promise<void>;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      baseCurrency: '',
      exchangeInfo: null,
      isLoading: false,
      isError: null,
      hasHydrated: false,

      setBaseCurrency: (currency) => set({ baseCurrency: currency }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      convert: async (from, to, amount) => {
        set({ isLoading: true, isError: null });
        try {
          const data = await exchangeCurrency({ from, to, amount });
          set({
            exchangeInfo: data,
            isLoading: false,
            isError: false,
          });
        } catch (error) {
          console.error(error);
          set({
            exchangeInfo: null,
            isLoading: false,
            isError: true,
          });
        }
      },
    }),
    {
      name: 'baseCurrency',
      partialize: (state) => ({
        baseCurrency: state.baseCurrency
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
