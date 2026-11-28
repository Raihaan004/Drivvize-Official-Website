import { NextResponse } from 'next/server';
import { asc, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contactReplies, contactSubmissions } from '@/lib/db/schema';
import { getAdminSession } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase() ?? '';
    const statusFilter = searchParams.get('status')?.trim().toLowerCase() ?? 'all';

    const [allInquiries, allReplies] = await Promise.all([
      db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt))
        .limit(300),
      db
        .select()
        .from(contactReplies)
        .orderBy(asc(contactReplies.createdAt)),
    ]);

    const replyMap = new Map<number, typeof allReplies>();
    for (const r of allReplies) {
      const existing = replyMap.get(r.inquiryId) ?? [];
      existing.push(r);
      replyMap.set(r.inquiryId, existing);
    }

    const enriched = allInquiries.map((inq) => {
      const replies = replyMap.get(inq.id) ?? [];
      const lastReplyAt =
        replies.length > 0 ? replies[replies.length - 1].createdAt : null;
      return {
        ...inq,
        replies,
        replyCount: replies.length,
        lastActivityAt: lastReplyAt ?? inq.createdAt,
      };
    });

    const filtered = enriched.filter((inq) => {
      if (statusFilter === 'starred' && !inq.isStarred) return false;
      if (
        statusFilter !== 'all' &&
        statusFilter !== 'starred' &&
        inq.status.toLowerCase() !== statusFilter
      ) {
        return false;
      }

      if (!query) return true;
      return (
        `${inq.firstName} ${inq.lastName}`.toLowerCase().includes(query) ||
        inq.email.toLowerCase().includes(query) ||
        inq.phone.toLowerCase().includes(query) ||
        (inq.companyName ?? '').toLowerCase().includes(query) ||
        inq.message.toLowerCase().includes(query) ||
        inq.replies.some(
          (r) =>
            r.message.toLowerCase().includes(query) ||
            r.subject.toLowerCase().includes(query),
        )
      );
    });

    const stats = {
      total: enriched.length,
      newCount: enriched.filter((i) => i.status === 'new').length,
      openCount: enriched.filter((i) => i.status === 'open').length,
      repliedCount: enriched.filter((i) => i.status === 'replied').length,
      archivedCount: enriched.filter((i) => i.status === 'archived').length,
      starredCount: enriched.filter((i) => i.isStarred).length,
      totalRepliesSent: allReplies.filter((r) => r.sentViaEmail).length,
      companiesCount: new Set(enriched.map((i) => i.companyName).filter(Boolean)).size,
    };

    const receiverConfigured = Boolean(
      process.env.CONTACT_RECEIVER_EMAIL?.trim() || process.env.SMTP_USER?.trim(),
    );
    const activeReceiverEmail =
      process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
      process.env.SMTP_USER?.trim() ||
      '';
    const smtpConfigured = Boolean(
      process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim(),
    );

    return NextResponse.json({
      success: true,
      inquiries: filtered,
      stats,
      mailConfig: {
        smtpConfigured,
        receiverConfigured,
        activeReceiverEmail,
      },
    });
  } catch (error) {
    console.error('Fetch inquiries error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve inquiries' },
      { status: 500 },
    );
  }
}
