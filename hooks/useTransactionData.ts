import { useMemo } from 'react';
import { Transaction, TransactionType, TransactionWithBalance } from '../types';

export const useTransactionData = (
  transactions: Transaction[],
  latestTotalBalance: number 
) => {
  return useMemo(() => {
    // 1. Calculate Running Balance Backwards
    // Because we load data Newest -> Oldest, the first item's balance is the Latest Total Balance (of that page context).
    
    let currentVirtualBalance = latestTotalBalance;
    
    const withBalance: TransactionWithBalance[] = transactions.map((t, index) => {
      // The running balance displayed on this row represents the balance AFTER this transaction
      const balanceForThisRow = currentVirtualBalance;

      // Prepare balance for the NEXT row (which is older)
      // If current was Income (+), previous balance must be (Current - Amount)
      // If current was Expense (-), previous balance must be (Current + Amount)
      if (t.type === TransactionType.INCOME) {
        currentVirtualBalance -= t.amount;
      } else {
        currentVirtualBalance += t.amount;
      }

      return { ...t, runningBalance: balanceForThisRow };
    });

    // We no longer filter here. The 'transactions' prop is already filtered by API.
    
    // Calculate Summary based on CURRENT VIEW (Page)
    // Note: This summary is only for the visible page data, not the global filtered total.
    // For global filtered stats, we would need a separate API call or aggregation.
    // However, the UI currently shows "Total Saldo" (Global) in the header, which is passed separately.
    
    const pageIncome = withBalance
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const pageExpense = withBalance
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      allTransactionsWithBalance: withBalance, // For Dashboard
      filteredTransactions: withBalance, // For Table (Already filtered)
      summary: {
        income: pageIncome,
        expense: pageExpense,
        count: withBalance.length
      }
    };
  }, [transactions, latestTotalBalance]);
};