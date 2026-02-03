import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SharedRunView } from "./shared-run-view";

interface Props {
  params: Promise<{ token: string }>;
}

async function getSharedRun(token: string) {
  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
    include: {
      run: {
        include: {
          template: {
            select: {
              name: true,
              slug: true,
              modelPipeline: true,
            },
          },
        },
      },
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!shareLink) return null;

  // Check expiration
  if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
    return { expired: true };
  }

  // Check max views
  if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
    return { maxViewsReached: true };
  }

  // Increment view count
  await prisma.shareLink.update({
    where: { id: shareLink.id },
    data: {
      viewCount: { increment: 1 },
      lastViewedAt: new Date(),
    },
  });

  return shareLink;
}

export default async function SharedRunPage({ params }: Props) {
  const { token } = await params;
  const data = await getSharedRun(token);

  if (!data) {
    notFound();
  }

  if ("expired" in data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Link Expired</h1>
          <p className="text-slate-400">This share link has expired.</p>
        </div>
      </div>
    );
  }

  if ("maxViewsReached" in data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">View Limit Reached</h1>
          <p className="text-slate-400">This share link has reached its maximum number of views.</p>
        </div>
      </div>
    );
  }

  return (
    <SharedRunView
      shareLink={data}
      run={data.run}
      template={data.run.template}
      comments={data.comments}
    />
  );
}
