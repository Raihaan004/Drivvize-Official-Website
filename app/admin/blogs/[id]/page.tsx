import { Suspense } from 'react';
import { EditBlogClient } from './EditBlogClient';

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto py-16 flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-ink/50 font-bold">
            Loading Editor...
          </p>
        </div>
      }
    >
      <EditBlogClient blogId={id} />
    </Suspense>
  );
}
