import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export const pdfDownloads = pgTable('pdf_downloads', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  fileId: varchar('file_id', { length: 100 }).notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileTitle: varchar('file_title', { length: 255 }).notNull(),
  field: varchar('field', { length: 255 }).notNull(),
  downloadedAt: timestamp('downloaded_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PdfDownload = typeof pdfDownloads.$inferSelect;
export type NewPdfDownload = typeof pdfDownloads.$inferInsert;
