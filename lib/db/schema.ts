import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

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

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),
  category: varchar('category', { length: 100 }).default('Functional Safety').notNull(),
  author: varchar('author', { length: 100 }).default('Drivvize Engineering').notNull(),
  readTime: varchar('read_time', { length: 50 }).default('5 min read'),
  isPublished: boolean('is_published').default(false).notNull(),
  views: integer('views').default(0).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
