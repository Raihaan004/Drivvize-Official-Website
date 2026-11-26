import { Suspense } from 'react';
import { EditEventClient } from './EditEventClient';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-3 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
            Loading Event Editor...
          </p>
        </div>
      }
    >
      <EditEventClient eventId={id} />
    </Suspense>
  );
}

