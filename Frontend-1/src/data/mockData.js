export const INITIAL_CONTEXT_FILES = [
  {
    id: 'f1',
    name: 'Contract_v3.pdf',
    size: '2.4 MB',
    pages: 24,
    type: 'pdf',
    icon: 'picture_as_pdf',
    color: '#ffb4ab',
    summary: 'Master Enterprise Software Agreement between Alpha Dynamics and CyberScale Inc., covering SLA, IP indemnification, uncapped PII liability, and arbitration.',
    content: `SECTION 4: INDEMNIFICATION AND LIABILITY
4.1 Intellectual Property Indemnity. Provider shall defend, indemnify, and hold harmless Customer from any third-party claims alleging infringement of patent, copyright, or trademark, capped at $1,000,000 USD.
4.2 Data Protection & Privacy. In the event of a Security Incident or unauthorized access to Personally Identifiable Information (PII), liability is uncapped in cases of gross negligence or willful misconduct.
4.3 Service Availability Guarantee. 99.9% uptime SLA with recurring credits of 5% monthly fee per hour of unplanned outage beyond allowance.`,
  },
  {
    id: 'f2',
    name: 'Q3_Chart.png',
    size: '856 KB',
    type: 'image',
    icon: 'bar_chart',
    color: '#818cf8',
    summary: 'Q3 Financial performance bar chart illustrating month-over-month ARR progression from July ($340k) to September ($450k) with bounding box highlighting peak revenue metrics.',
  },
  {
    id: 'f3',
    name: 'financial_model_2026.csv',
    size: '1.2 MB',
    type: 'sheet',
    icon: 'table_chart',
    color: '#2fd9f4',
    summary: 'Multi-year ARR growth forecasts, Customer Acquisition Cost (CAC) breakdowns, Net Dollar Retention (NDR at 134%), and churn projections.',
  },
];

export const TAB_MESSAGES = {
  doc: [
    {
      id: 'm-doc-1',
      sender: 'user',
      text: 'Can you extract the key liabilities from Contract_v3.pdf?',
      timestamp: '10:42 AM',
      mode: 'doc',
    },
    {
      id: 'm-doc-2',
      sender: 'assistant',
      text: `Based on **Contract_v3.pdf**, here are the primary liabilities outlined in Section 4:

• **Indemnification:** Party A holds liability for third-party IP claims up to $1M.
• **Data Breach:** Liability is uncapped for gross negligence regarding PII data handling.`,
      citations: [
        {
          label: 'Pg. 12, Sec 4.2',
          doc: 'Contract_v3.pdf',
          snippet: 'Section 4.2: In the event of a Security Incident regarding PII data handling, liability is uncapped for gross negligence.',
          page: 12,
        },
      ],
      timestamp: '10:42 AM',
      mode: 'doc',
    },
  ],
  vision: [
    {
      id: 'm-vis-1',
      sender: 'user',
      text: 'What is the Q3 revenue trend from this chart?',
      timestamp: '10:44 AM',
      mode: 'vision',
    },
    {
      id: 'm-vis-2',
      sender: 'assistant',
      text: `Analyzing **Q3_Chart.png**:

The chart indicates a steady **15% MoM growth** in Q3, peaking in September at $450k ARR.`,
      hasBoundingBox: true,
      chartData: {
        july: 340,
        aug: 390,
        sept: 450,
        growth: '15% MoM',
      },
      timestamp: '10:44 AM',
      mode: 'vision',
    },
  ],
  general: [
    {
      id: 'm-gen-1',
      sender: 'user',
      text: 'Write a python script to parse a CSV into JSON.',
      timestamp: '10:45 AM',
      mode: 'general',
    },
    {
      id: 'm-gen-2',
      sender: 'assistant',
      text: `Here is a robust Python script using the built-in \`csv\` and \`json\` modules:`,
      codeSnippet: `import csv, json

def csv_to_json(csv_path, json_path):
  with open(csv_path) as f:
    data = list(csv.DictReader(f))
  with open(json_path, 'w') as f:
    json.dump(data, f, indent=2)`,
      timestamp: '10:45 AM',
      mode: 'general',
    },
  ],
};

export const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Hobby Canvas',
    priceMonthly: 0,
    priceAnnual: 0,
    description: 'Perfect for individual builders exploring multi-modal document reasoning.',
    features: [
      'Standard AI Multi-Modal Engine',
      'Up to 10 context files per workspace',
      'Document Q&A with direct page citations',
      'Visual chart & diagram inspection',
      'Python & JS code sandbox preview',
      'Standard community support',
    ],
    cta: 'Start Free Forever',
  },
  {
    id: 'pro',
    name: 'Pro Member',
    priceMonthly: 20,
    priceAnnual: 16,
    popular: true,
    description: 'Engineered for power analysts, researchers, and engineers demanding peak precision.',
    features: [
      'Unlimited high-speed Neural Reasoning Engine',
      'Gemini 3.7 Flash & 3.1 Pro Preview reasoning',
      '100+ files per workspace (2M+ token window)',
      'High-precision visual bounding box grounding',
      'Live code execution & terminal sandbox',
      'Cross-document semantic synthesis',
      'Priority compute lane (sub-40ms latency)',
    ],
    cta: 'Upgrade to Pro',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Ultra',
    priceMonthly: 89,
    priceAnnual: 75,
    description: 'Dedicated infrastructure, custom fine-tuned weights, and strict enterprise governance.',
    features: [
      'Dedicated private container clusters',
      'Zero data retention SLA & SOC2 compliant',
      'Custom fine-tuned domain embeddings',
      'SSO (SAML, Okta, Google Workspace)',
      'Unlimited seat licenses & team collaboration',
      'Dedicated ML Engineer solutions architect',
    ],
    cta: 'Contact Sales',
  },
];

export const DEFAULT_USER_PROFILE = {
  name: 'Alex Vance',
  age: 28,
  educationQualification: "Master's in Computer Science",
  occupation: 'AI Research Scientist',
  email: 'alex.vance@lucychat.ai',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'Pro Member',
  role: 'Principal Research Engineer',
  company: 'Synthetix BioLabs',
  bio: 'Building automated multi-modal document reasoning pipelines and visual chart telemetry models.',
  timezone: 'UTC-08:00 (Pacific Time)',
  joinedDate: 'November 2025',
  tokenUsage: 1840000,
  tokenLimit: 5000000,
  documentQueriesUsed: 248,
  documentQueriesLimit: 500,
  visionScansUsed: 42,
  visionScansLimit: 100,
  apiKeyPrefix: 'lc_live_98a7b3c2e1f4...',
  twoFactorEnabled: true,
};

export const MOCK_CHAT_SESSIONS = [
  {
    id: 'session-1',
    title: 'Master Service Agreement Review',
    updatedAt: '10 mins ago',
    preview: 'Extracting indemnification limits from Contract_v3.pdf...',
    category: 'document',
    messages: [
      {
        id: 'm-1',
        sender: 'user',
        text: 'Can you analyze Section 4 of Contract_v3.pdf and flag all uncapped liabilities?',
        timestamp: '10:42 AM',
      },
      {
        id: 'm-2',
        sender: 'assistant',
        text: 'I parsed **Contract_v3.pdf** (24 pages). Here is the risk summary:\n\n• **Uncapped PII Exposure:** Section 4.2 dictates uncapped liability for data breaches under gross negligence.\n• **IP Indemnification:** Capped at $1,000,000 USD (Section 4.1).\n• **SLA Guarantee:** 99.9% uptime with 5% monthly fee credit per hour of outage.',
        timestamp: '10:43 AM',
        citations: [
          {
            label: 'Pg. 12, Sec 4.2',
            doc: 'Contract_v3.pdf',
            snippet: 'Section 4.2: Data Protection & Privacy. Liability is uncapped in cases of gross negligence.',
            page: 12,
          },
        ],
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Q3 Financial Chart & Outlier Scan',
    updatedAt: '2 hours ago',
    preview: 'Identified +32.4% MoM peak in September ARR progression.',
    category: 'vision',
    messages: [
      {
        id: 'm-3',
        sender: 'user',
        text: 'Inspect the Q3_Chart.png and highlight any abnormal acceleration in revenue.',
        timestamp: '8:15 AM',
      },
      {
        id: 'm-4',
        sender: 'assistant',
        text: 'Visual telemetry analysis complete on **Q3_Chart.png**:\n\n• **Peak Month:** September generated **$450k ARR** (+32.4% MoM jump from August).\n• **Trend:** Consecutive quarter-over-quarter compounding rate of 18.2%.\n• **Bounding Box:** Isolated coordinates `[x: 180, y: 45, w: 220, h: 160]` around the September bar.',
        timestamp: '8:16 AM',
        chartSummary: 'September ARR surged to $450k with strong enterprise expansion.',
        hasBoundingBox: true,
      },
    ],
  },
  {
    id: 'session-3',
    title: 'Vector Search Pipeline in TypeScript',
    updatedAt: 'Yesterday',
    preview: 'Synthesized cosine similarity RAG kernel with sub-40ms recall.',
    category: 'code',
    messages: [
      {
        id: 'm-5',
        sender: 'user',
        text: 'Write a zero-dependency function to compute cosine similarity and rank vector embeddings.',
        timestamp: 'Yesterday',
      },
      {
        id: 'm-6',
        sender: 'assistant',
        text: 'Here is an optimized cosine similarity function with vector normalization:',
        timestamp: 'Yesterday',
        codeSnippet: `export function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}`,
        codeExplanation: 'Performs single-pass calculation with zero memory allocations for maximum throughput.',
      },
    ],
  },
  {
    id: 'session-4',
    title: 'Biotech Clinical Trial Data Synthesis',
    updatedAt: '3 days ago',
    preview: 'Aggregated 14 cohort outcomes and pharmacokinetic curves.',
    category: 'reasoning',
    messages: [
      {
        id: 'm-7',
        sender: 'user',
        text: 'Summarize the primary efficacy endpoints from the Phase II trial notes.',
        timestamp: '3 days ago',
      },
      {
        id: 'm-8',
        sender: 'assistant',
        text: 'Primary endpoint met with **p < 0.001** across 480 enrolled subjects. No dose-limiting toxicities observed in cohort 3.',
        timestamp: '3 days ago',
      },
    ],
  },
];
