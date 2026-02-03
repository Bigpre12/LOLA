import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Button, Card, CardContent, CardHeader, Badge } from "@/components/ui";
import { formatDate, formatCredits } from "@/lib/utils";
import { RunStatus } from "@/types";

// Type for runs with template info
interface RunWithTemplate {
  id: string;
  status: RunStatus;
  createdAt: Date;
  template: {
    name: string;
    slug: string;
    category: string;
  };
}

async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        credits: true,
        plan: true,
        runs: {
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            template: {
              select: {
                name: true,
                slug: true,
                category: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch {
    return null;
  }
}

// Mock data for when DB is not available
function getMockUserData() {
  return {
    credits: 100,
    plan: "FREE" as const,
    runs: [
      {
        id: "run-1",
        status: "COMPLETED" as RunStatus,
        createdAt: new Date(Date.now() - 3600000),
        template: {
          name: "Product Gallery",
          slug: "product-gallery",
          category: "ECOMMERCE",
        },
      },
      {
        id: "run-2",
        status: "RUNNING" as RunStatus,
        createdAt: new Date(Date.now() - 1800000),
        template: {
          name: "Lifestyle Set",
          slug: "lifestyle-set",
          category: "ECOMMERCE",
        },
      },
    ],
  };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const userData = await getUserData(session.user.id) || getMockUserData();
  const recentRuns = userData.runs as RunWithTemplate[];
  const thisMonthRuns = recentRuns.filter(
    (run: RunWithTemplate) => new Date(run.createdAt).getMonth() === new Date().getMonth()
  );

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">
                Welcome back, {session.user.name || session.user.email}
              </p>
            </div>
            <Link href="/templates">
              <Button>
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New run
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Credits remaining</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatCredits(userData.credits)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              {userData.plan === "FREE" && (
                <Link href="#" className="text-sm text-violet-400 hover:text-violet-300 mt-4 inline-block">
                  Upgrade to Pro →
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Runs this month</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {thisMonthRuns.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Current plan</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {userData.plan === "PRO" ? "Pro" : "Free"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Runs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Recent runs</h2>
          </CardHeader>
          <CardContent className="p-0">
            {recentRuns.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {recentRuns.map((run) => (
                  <Link
                    key={run.id}
                    href={`/results/${run.id}`}
                    className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">{run.template.name}</p>
                        <p className="text-sm text-slate-500">{formatDate(run.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          run.status === "COMPLETED"
                            ? "success"
                            : run.status === "FAILED"
                            ? "error"
                            : run.status === "RUNNING"
                            ? "info"
                            : "warning"
                        }
                      >
                        {run.status}
                      </Badge>
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-white font-medium mb-2">No runs yet</h3>
                <p className="text-slate-400 mb-4">Get started by running your first template.</p>
                <Link href="/templates">
                  <Button>Browse templates</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
