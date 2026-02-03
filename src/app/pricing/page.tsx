import Link from "next/link";
import { Button, Card, CardContent, CardHeader, Badge } from "@/components/ui";
import { Footer } from "@/components/marketing";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Try LOLA risk-free",
    features: [
      "50 runs per month",
      "All templates included",
      "Standard processing speed",
      "Community support",
    ],
    limitations: ["Watermark on outputs", "No API access"],
    cta: "Start free",
    ctaVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Starter",
    price: 29,
    period: "/month",
    description: "For solo creators and small shops",
    features: [
      "200 runs per month",
      "All templates included",
      "Priority processing",
      "No watermarks",
      "Email support",
      "Export pipeline JSON",
    ],
    limitations: [],
    cta: "Start trial",
    ctaVariant: "primary" as const,
    popular: true,
  },
  {
    name: "Pro",
    price: 79,
    period: "/month",
    description: "For growing brands and agencies",
    features: [
      "1,000 runs per month",
      "All templates included",
      "Fastest processing",
      "No watermarks",
      "Priority support",
      "Full API access",
      "Webhooks",
      "Custom templates",
      "Team sharing (coming soon)",
    ],
    limitations: [],
    cta: "Start trial",
    ctaVariant: "primary" as const,
    popular: false,
  },
  {
    name: "Enterprise",
    price: null,
    period: "custom",
    description: "For high-volume teams",
    features: [
      "Unlimited runs",
      "Dedicated infrastructure",
      "Custom model integrations",
      "SLA guarantee",
      "Dedicated account manager",
      "Custom training",
      "On-premise option",
    ],
    limitations: [],
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    popular: false,
  },
];

const costComparison = [
  { action: "Product gallery (4 images)", flowforge: "$0.40", weavy: "$1.20", savings: "67%" },
  { action: "Lifestyle set (6 images)", flowforge: "$0.60", weavy: "$1.80", savings: "67%" },
  { action: "Social ad pack (5 formats)", flowforge: "$0.50", weavy: "$1.50", savings: "67%" },
  { action: "Amazon listing pack (7 images)", flowforge: "$0.70", weavy: "$2.10", savings: "67%" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" className="mb-4">
            Simple, transparent pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Pay for runs, not confusion
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No hidden credits, no model surcharges, no surprises. 
            You know exactly what each run costs before you click.
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? "border-violet-500 ring-2 ring-violet-500/20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="success">Most popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-4">
                  {plan.price !== null ? (
                    <>
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">{plan.period}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-white">Custom</span>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-500">{limitation}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Enterprise" ? "#contact" : "/auth/signin"}>
                  <Button
                    variant={plan.ctaVariant}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cost comparison */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Transparent cost per run
          </h2>
          <p className="text-slate-400">
            Compare actual costs for common workflows. No surprises, no &ldquo;premium model surcharges.&rdquo;
          </p>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Workflow</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">LOLA</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">Weavy (est.)</th>
                  <th className="text-center py-4 px-6 text-sm font-medium text-slate-400">You save</th>
                </tr>
              </thead>
              <tbody>
                {costComparison.map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/30 last:border-0">
                    <td className="py-4 px-6 text-sm text-slate-300">{row.action}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-lg font-semibold text-green-400">{row.flowforge}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-slate-500">{row.weavy}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge variant="success">{row.savings}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-center text-xs text-slate-500 mt-4">
          * Weavy estimates based on published credit pricing and typical model usage. Your actual costs may vary.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What counts as a 'run'?",
              a: "One run = one template execution, regardless of how many images it generates. A 'Product Gallery' template that outputs 5 images counts as 1 run.",
            },
            {
              q: "Do unused runs roll over?",
              a: "Monthly runs reset at the start of each billing cycle. We're considering rollover for Pro plans—let us know if that matters to you.",
            },
            {
              q: "Can I switch plans anytime?",
              a: "Yes! Upgrade instantly, downgrade at the end of your billing period. No lock-in contracts.",
            },
            {
              q: "What if I need more runs mid-month?",
              a: "You can purchase run packs ($10 for 50 runs) anytime, no plan change required.",
            },
            {
              q: "Why is LOLA cheaper than Weavy?",
              a: "We use optimized model routing, efficient batching, and pass our cost savings directly to you. No VC-subsidized pricing games—just honest economics.",
            },
          ].map((faq, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <h3 className="text-white font-medium mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
