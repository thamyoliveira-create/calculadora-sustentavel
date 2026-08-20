import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './authContext';
import * as repo from './repository';
import {
  Account, Category, Transaction, CreditCard, Budget, Goal, Debt, Investment, AssetLiability, Bill, Notification, Settings,
} from './types';

interface DataContextValue {
  loading: boolean;
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  cards: CreditCard[];
  budgets: Budget[];
  goals: Goal[];
  debts: Debt[];
  investments: Investment[];
  assetsLiabilities: AssetLiability[];
  bills: Bill[];
  notifications: Notification[];
  settings: Settings | null;
  refreshAll: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshAccounts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshCards: () => Promise<void>;
  refreshBudgets: () => Promise<void>;
  refreshGoals: () => Promise<void>;
  refreshDebts: () => Promise<void>;
  refreshInvestments: () => Promise<void>;
  refreshAssetsLiabilities: () => Promise<void>;
  refreshBills: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [assetsLiabilities, setAssetsLiabilities] = useState<AssetLiability[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  const refreshAccounts = useCallback(async () => { setAccounts(await repo.fetchAccounts()); }, []);
  const refreshCategories = useCallback(async () => { setCategories(await repo.fetchCategories()); }, []);
  const refreshTransactions = useCallback(async () => { setTransactions(await repo.fetchTransactions()); }, []);
  const refreshCards = useCallback(async () => { setCards(await repo.fetchCards()); }, []);
  const refreshBudgets = useCallback(async () => { setBudgets(await repo.fetchBudgets()); }, []);
  const refreshGoals = useCallback(async () => { setGoals(await repo.fetchGoals()); }, []);
  const refreshDebts = useCallback(async () => { setDebts(await repo.fetchDebts()); }, []);
  const refreshInvestments = useCallback(async () => { setInvestments(await repo.fetchInvestments()); }, []);
  const refreshAssetsLiabilities = useCallback(async () => { setAssetsLiabilities(await repo.fetchAssetsLiabilities()); }, []);
  const refreshBills = useCallback(async () => { setBills(await repo.fetchBills()); }, []);
  const refreshNotifications = useCallback(async () => { setNotifications(await repo.fetchNotifications()); }, []);
  const refreshSettings = useCallback(async () => { setSettings(await repo.fetchSettings()); }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshAccounts(), refreshCategories(), refreshTransactions(), refreshCards(),
      refreshBudgets(), refreshGoals(), refreshDebts(), refreshInvestments(),
      refreshAssetsLiabilities(), refreshBills(), refreshNotifications(), refreshSettings(),
    ]);
  }, [refreshAccounts, refreshCategories, refreshTransactions, refreshCards, refreshBudgets, refreshGoals, refreshDebts, refreshInvestments, refreshAssetsLiabilities, refreshBills, refreshNotifications, refreshSettings]);

  useEffect(() => {
    if (!user) {
      setAccounts([]); setCategories([]); setTransactions([]); setCards([]);
      setBudgets([]); setGoals([]); setDebts([]); setInvestments([]);
      setAssetsLiabilities([]); setBills([]); setNotifications([]); setSettings(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      await repo.seedDefaultCategories();
      await refreshAll();
      setLoading(false);
    })();
  }, [user, refreshAll]);

  const value: DataContextValue = {
    loading,
    accounts, categories, transactions, cards, budgets, goals, debts,
    investments, assetsLiabilities, bills, notifications, settings,
    refreshAll, refreshTransactions, refreshAccounts, refreshCategories,
    refreshCards, refreshBudgets, refreshGoals, refreshDebts, refreshInvestments,
    refreshAssetsLiabilities, refreshBills, refreshNotifications, refreshSettings,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
