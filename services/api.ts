import { Transaction, TransactionType } from '../types';

const BASE = '/api';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

function normalizeTransaction(item: any): Transaction {
  return {
    ...item,
    date: typeof item.date === 'string' ? item.date.split('T')[0] : item.date,
    amount: Number(item.amount),
    createdAt: item.createdAt ?? item.created_at
  };
}

export const api = {
  getTransactions: async (
    page: number = 1,
    pageSize: number = 10,
    filterType: 'ALL' | TransactionType = 'ALL',
    startDate: string = '',
    endDate: string = ''
  ): Promise<{ data: Transaction[]; count: number }> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      filterType,
      startDate,
      endDate
    });
    const raw = await apiFetch<{ data: any[]; count: number }>(`/transactions?${params}`);
    return {
      data: raw.data.map(normalizeTransaction),
      count: raw.count
    };
  },

  getBalanceSummary: async (): Promise<{ income: number; expense: number; balance: number }> => {
    return apiFetch('/transactions/summary');
  },

  getNetChangeSum: async (
    limit: number,
    filterType: 'ALL' | TransactionType = 'ALL',
    startDate: string = '',
    endDate: string = ''
  ): Promise<number> => {
    if (limit <= 0) return 0;
    const params = new URLSearchParams({
      limit: String(limit),
      filterType,
      startDate,
      endDate
    });
    const res = await apiFetch<{ netChange: number }>(`/transactions/net-change?${params}`);
    return res.netChange;
  },

  getAllTransactionsForExport: async (startDate?: string, endDate?: string): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const query = params.toString();
    const raw = await apiFetch<any[]>(`/transactions/export${query ? `?${query}` : ''}`);
    return raw.map(normalizeTransaction);
  },

  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
    const raw = await apiFetch<any>('/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: transaction.date,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount
      })
    });
    return normalizeTransaction(raw);
  },

  updateTransaction: async (id: string, transaction: Partial<Transaction>): Promise<void> => {
    const { createdAt, id: _, ...updateData } = transaction as any;
    await apiFetch(`/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE}/transactions/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error(`API error ${res.status}`);
  }
};
