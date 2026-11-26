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
  documentName: varchar('document_name', { length: 255 }),
  documentSize: varchar('document_size', { length: 60 }),
  documentUrl: text('document_url'),
  isPublished: boolean('is_published').default(false).notNull(),
  views: integer('views').default(0).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

export const blogEngagements = pgTable('blog_engagements', {
  slug: varchar('slug', { length: 255 }).primaryKey(),
  likes: integer('likes').default(0).notNull(),
  ratingSum: integer('rating_sum').default(0).notNull(),
  ratingCount: integer('rating_count').default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type BlogEngagement = typeof blogEngagements.$inferSelect;

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  kind: varchar('kind', { length: 20 }).default('internal').notNull(),
  format: varchar('format', { length: 20 }).default('Online').notNull(),
  status: varchar('status', { length: 20 }).default('upcoming').notNull(),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  timeLabel: varchar('time_label', { length: 120 }),
  location: varchar('location', { length: 255 }).default('Live online session').notNull(),
  hosts: text('hosts').default('["Drivvize Engineering"]').notNull(),
  about: text('about').notNull(),
  agenda: text('agenda'),
  tags: text('tags'),
  role: varchar('role', { length: 120 }),
  year: integer('year'),
  image: text('image'),
  registrationUrl: text('registration_url'),
  isFeatured: boolean('is_featured').default(false).notNull(),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;

export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id'),
  eventSlug: varchar('event_slug', { length: 255 }).notNull(),
  eventTitle: varchar('event_title', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 60 }),
  company: varchar('company', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;

export const blogWriters = pgTable('blog_writers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  title: varchar('title', { length: 160 }).default('Functional Safety Consultant').notNull(),
  role: varchar('role', { length: 60 }).default('Managed Writer').notNull(),
  email: varchar('email', { length: 255 }),
  bio: text('bio'),
  avatarColor: varchar('avatar_color', { length: 30 }).default('#1d3f6e').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type BlogWriter = typeof blogWriters.$inferSelect;
export type NewBlogWriter = typeof blogWriters.$inferInsert;

export const blogComments = pgTable('blog_comments', {
  id: serial('id').primaryKey(),
  blogSlug: varchar('blog_slug', { length: 255 }).notNull(),
  blogTitle: varchar('blog_title', { length: 255 }).notNull(),
  authorName: varchar('author_name', { length: 120 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  comment: text('comment').notNull(),
  status: varchar('status', { length: 30 }).default('approved').notNull(),
  adminReply: text('admin_reply'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type BlogComment = typeof blogComments.$inferSelect;
export type NewBlogComment = typeof blogComments.$inferInsert;

export const blogViews = pgTable('blog_views', {
  id: serial('id').primaryKey(),
  blogSlug: varchar('blog_slug', { length: 255 }).notNull(),
  visitorKey: varchar('visitor_key', { length: 128 }).notNull(),
  viewedAt: timestamp('viewed_at', { withTimezone: true }).defaultNow().notNull(),
});

export type BlogView = typeof blogViews.$inferSelect;

export const careerApplications = pgTable('career_applications', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 60 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  area: varchar('area', { length: 120 }).notNull(),
  yearsExperience: varchar('years_experience', { length: 40 }),
  resumeFileName: varchar('resume_file_name', { length: 255 }).notNull(),
  resumeMimeType: varchar('resume_mime_type', { length: 160 }).notNull(),
  resumeSizeBytes: integer('resume_size_bytes').notNull(),
  resumeData: text('resume_data').notNull(),
  consent: boolean('consent').default(true).notNull(),
  status: varchar('status', { length: 40 }).default('new').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type CareerApplication = typeof careerApplications.$inferSelect;
export type NewCareerApplication = typeof careerApplications.$inferInsert;
