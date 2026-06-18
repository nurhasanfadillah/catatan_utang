import { supabase } from './supabaseClient';
import { Transaction, TransactionType } from '../types';

export const api = {
  // Fetch transactions with pagination, exact count, and SERVER-SIDE FILTERS
  getTransactions: async (
    page: number = 1, 
    pageSize: number = 10,
    filterType: 'ALL' | TransactionType = 'ALL',
    startDate: string = '',
    endDate: string = ''
  ): Promise<{ data: Transaction[]; count: number }> => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Start building the query
    let query = supabase
      .from('transactions')
      .select('*', { count: 'exact' });

    // Apply Server-Side Filters
    if (filterType !== 'ALL') {
      query = query.eq('type', filterType);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    // Apply Sorting and Pagination
    const { data, error, count } = await query
      .order('date', { ascending: false }) // Newest first
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }

    const formattedData = (data || []).map((item: any) => ({
      ...item,
      createdAt: item.created_at
    }));

    return { data: formattedData, count: count || 0 };
  },

  // Efficiently calculate total balance from DB (Global Stats)
  getBalanceSummary: async (): Promise<{ income: number; expense: number; balance: number }> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('type, amount');

    if (error) {
      console.error('Error fetching balance summary:', error);
      return { income: 0, expense: 0, balance: 0 };
    }

    let income = 0;
    let expense = 0;

    data.forEach((t: any) => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return {
      income,
      expense,
      balance: income - expense
    };
  },

  // Calculate the net change for the filtered offset rows.
  // This ensures the "Starting Balance" at the top of Page 2 is correct relative to the filters applied.
  getNetChangeSum: async (
    limit: number,
    filterType: 'ALL' | TransactionType = 'ALL',
    startDate: string = '',
    endDate: string = ''
  ): Promise<number> => {
    if (limit <= 0) return 0;
    
    // Fetch only type and amount for efficiency
    let query = supabase
      .from('transactions')
      .select('type, amount');

    // Apply SAME filters as getTransactions
    if (filterType !== 'ALL') {
      query = query.eq('type', filterType);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(0, limit - 1);

    if (error) {
      console.error('Error fetching offset sum:', error);
      return 0;
    }

    let netChange = 0;
    data.forEach((t: any) => {
      if (t.type === TransactionType.INCOME) {
        netChange += t.amount;
      } else {
        netChange -= t.amount;
      }
    });

    return netChange;
  },

  // Fetch ALL transactions for PDF Export
  getAllTransactionsForExport: async (startDate?: string, endDate?: string): Promise<Transaction[]> => {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (startDate) query = query.gte('date', startDate);
    if (endDate) query = query.lte('date', endDate);

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((item: any) => ({
      ...item,
      createdAt: item.created_at
    }));
  },

  // Create new transaction
  createTransaction: async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction | null> => {
    const newTx = {
      ...transaction,
      created_at: Date.now()
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert([newTx])
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    return { ...data, createdAt: data.created_at };
  },

  // Update existing transaction
  updateTransaction: async (id: string, transaction: Partial<Transaction>): Promise<void> => {
    const { createdAt, id: _, ...updateData } = transaction as any;
    
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  },

  // Delete transaction
  deleteTransaction: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
};