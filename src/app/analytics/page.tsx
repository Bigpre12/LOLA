import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

async function getAnalyticsData(userId: string) {
  const [
    user,
    recentRuns,
    topTemplates,
    feedbackStats,
  ] = await Promise.all([
    // User stats
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        plan: true,
        monthlyRunsUsed: true,
        monthlyRunsLimit: true,
        _count: { select: { runs: true } },
      },
    }),
    // Recent runs
    prisma.run.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        template: { select: { name: true, slug: true } },
      },
    }),
    // Top templates by usage
    prisma.run.groupBy({
      by: ["templateId"],
      where: { userId },
      _count: { templateId: true },
      orderBy: { _count: { templateId: "desc" } },
      take: 5,
    }),
    // Feedback stats
    prisma.runFeedback.aggregate({
      where: { userId },
      _avg: { rating: true },
      _count: { id: true },
    }),
  ]);

  // Get template details for top templates
  const templateIds = topTemplates.map((t) => t.templateId);
  const templates = await prisma.template.findMany({
    where: { id: { in: templateIds } },
    select: { id: true, name: true, slug: true, avgRating: true },
  });

  const topTemplatesWithDetails = topTemplates.map((t) => ({
    ...t,
    template: templates.find((tmpl) => tmpl.id === t.templateId),
  }));

  return {
    user,
    recentRuns,
    topTemplates: topTemplatesWithDetails,
    feedbackStats,
  };
}

// Get global template leaderboard
async function getTemplateLeaderboard() {
  return prisma.template.findMany({
    where: { isPublic: true },
    orderBy: [{ avgRating: "desc" }, { totalRuns: "desc" }],
    take: 10,
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      avgRating: true,
      totalRatings: true,
      totalRuns: true,
      successRate: true,
    },
  });
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const [data, leaderboard] = await Promise.all([
    getAnalyticsData(session.user.id),
    getTemplateLeaderboard(),
  ]);

  const { user, recentRuns, topTemplates, feedbackStats } = data;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">
            See which templates work best and track your usage
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Runs</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {user?._count.runs || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">This Month</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {user?.monthlyRunsUsed || 0}
                    <span className="text-lg text-slate-500">/{user?.monthlyRunsLimit || 50}</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Rating Given</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {feedbackStats._avg.rating?.toFixed(1) || "—"}
                    <span className="text-lg text-slate-500">/5</span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Feedback Given</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {feedbackStats._count.id || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Your Top Templates */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Your Most Used Templates</h2>
            </CardHeader>
            <CardContent className="p-0">
              {topTemplates.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {topTemplates.map((item, i) => (
                    <div key={item.templateId} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {item.template?.name || "Unknown Template"}
                          </p>
                          <p className="text-sm text-slate-500">{item._count.templateId} runs</p>
                        </div>
                      </div>
                      {item.template?.avgRating ? (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                          <span className="text-sm">{item.template.avgRating.toFixed(1)}</span>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No runs yet. Start using templates to see your stats.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Global Template Leaderboard */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">Top Performing Templates</h2>
              <p className="text-sm text-slate-400">Based on user ratings across LOLA</p>
            </CardHeader>
            <CardContent className="p-0">
              {leaderboard.length > 0 ? (
                <div className="divide-y divide-slate-700/50">
                  {leaderboard.map((template, i) => (
                    <div key={template.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          i === 0 ? "bg-yellow-500/20 text-yellow-400" :
                          i === 1 ? "bg-slate-400/20 text-slate-300" :
                          i === 2 ? "bg-amber-600/20 text-amber-500" :
                          "bg-slate-800 text-slate-400"
                        }`}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium">{template.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{template.totalRuns.toLocaleString()} runs</span>
                            <span>•</span>
                            <span>{template.totalRatings} ratings</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          template.category === "ECOMMERCE" ? "success" :
                          template.category === "ADS" ? "info" : "default"
                        }>
                          {template.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-yellow-400">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                          <span className="text-sm font-medium">{template.avgRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  No template data yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          </CardHeader>
          <CardContent className="p-0">
            {recentRuns.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        run.status === "COMPLETED" ? "bg-green-400" :
                        run.status === "FAILED" ? "bg-red-400" :
                        run.status === "RUNNING" ? "bg-blue-400" :
                        "bg-yellow-400"
                      }`} />
                      <div>
                        <p className="text-white">{run.template.name}</p>
                        <p className="text-sm text-slate-500">{formatDate(run.createdAt)}</p>
                      </div>
                    </div>
                    <Badge variant={
                      run.status === "COMPLETED" ? "success" :
                      run.status === "FAILED" ? "error" :
                      run.status === "RUNNING" ? "info" : "warning"
                    }>
                      {run.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400">
                No activity yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
