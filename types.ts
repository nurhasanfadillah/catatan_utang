export enum TransactionType {
  INCOME = 'TAGIHAN',
  EXPENSE = 'KASBON'
}

export interface Transaction {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  description: string;
  type: TransactionType;
  amount: number;
  createdAt: number;
}

export interface TransactionWithBalance extends Transaction {
  runningBalance: number;
}

export type Theme = 'light' | 'dark';

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  transactionCount: number;
}

export type UserRole = 'admin' | 'user';

export interface User {
  username: string;
  name: string;
  role: UserRole;
}