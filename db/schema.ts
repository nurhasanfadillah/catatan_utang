import { bigint, date, index, numeric, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const transactions = pgTable(
  'transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    created_at: bigint('created_at', { mode: 'number' }).notNull(),
    date: date('date').notNull(),
    description: text('description').notNull(),
    type: text('type').notNull(),
    amount: numeric('amount', { precision: 15, scale: 2 }).notNull().default('0'),
  },
  (table) => [
    index('idx_transactions_date').on(table.date),
    index('idx_transactions_type').on(table.type),
    index('idx_transactions_created_at').on(table.created_at),
  ]
);

export const appUsers = pgTable(
  'app_users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').notNull().unique(),
    password: text('password').notNull(),
    name: text('name').notNull(),
    role: text('role').notNull(),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('idx_app_users_username').on(table.username),
  ]
);
