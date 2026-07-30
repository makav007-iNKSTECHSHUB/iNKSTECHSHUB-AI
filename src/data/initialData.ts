import { TaskItem, TeamMember, ArchitectureBlueprint, LanguageCode } from '../types';

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Mahmood',
    role: 'Creative Director & Chief Systems Architect',
    city: 'Zurich',
    country: 'Switzerland',
    timezone: 'Europe/Zurich',
    offsetUTC: 2,
    status: 'Online',
    languages: ['English', 'German', 'French'],
    currentTask: 'Directing High-End Creative AI & Minimalist Audio/Visual Protocols'
  },
  {
    id: 'team-2',
    name: 'Elena Rostova',
    role: 'VP Commercial Sourcing & Infrastructure Logistics',
    city: 'Tallinn',
    country: 'Estonia',
    timezone: 'Europe/Tallinn',
    offsetUTC: 3,
    status: 'In Deep Work',
    languages: ['English', 'Russian', 'Estonian'],
    currentTask: 'Procuring Commercial Bare-Metal GPU Nodes & Dark Fiber Transit'
  },
  {
    id: 'team-3',
    name: 'Julian Vance',
    role: 'Lead Platform Engineer & Precision Protocol Architect',
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London',
    offsetUTC: 1,
    status: 'Online',
    languages: ['English'],
    currentTask: 'Refactoring Low-Latency Infrastructure & Edge Pipeline Routing'
  },
  {
    id: 'team-4',
    name: 'Kenji Takahashi',
    role: 'Audio DSP Engine & Real-Time Synthesis Lead',
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo',
    offsetUTC: 9,
    status: 'In Sync',
    languages: ['Japanese', 'English'],
    currentTask: 'Optimizing Minimalist WebAudio DSP Buffers & Spatial Frequency Matrix'
  },
  {
    id: 'team-5',
    name: 'Tariq Al-Mansoor',
    role: 'Chief Security & Commercial Compliance Counsel',
    city: 'Dubai',
    country: 'UAE',
    timezone: 'Asia/Dubai',
    offsetUTC: 4,
    status: 'Online',
    languages: ['Arabic', 'English'],
    currentTask: 'Auditing Swiss Sovereign DSG & EU GDPR Cryptographic Vaults'
  },
  {
    id: 'team-6',
    name: 'Astrid Lindqvist',
    role: 'High-End Design System & Experience Lead',
    city: 'Amsterdam',
    country: 'Netherlands',
    timezone: 'Europe/Amsterdam',
    offsetUTC: 2,
    status: 'Online',
    languages: ['Dutch', 'English', 'German'],
    currentTask: 'Refining Precision Visual System & Monospaced Typographic Hierarchy'
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 'task-101',
    title: 'Architect Commercial Bare-Metal GPU Sourcing Pipeline',
    description: 'Procure and benchmark 4x NVIDIA H100 SXM5 nodes with dedicated Swiss interconnect for ultra-low latency generative audio and high-end visual rendering.',
    category: 'AI Sourcing',
    status: 'in_progress',
    assignee: 'Elena Rostova',
    priority: 'P0',
    aiPriority: 'P0',
    eisenhowerQuadrant: 'Do First',
    aiContextSuggestion: '[iNKSTECHSHUB AI] High urgency: Finalize commercial procurement agreement with Tallinn hardware leads prior to 14:00 CET Tokyo sync.',
    timezoneTarget: 'Europe/Tallinn',
    estimatedHours: 12,
    riskFactor: 'High',
    strategicImpact: 'Unlocks sub-15ms generative sound synthesis & 8K precision canvas rendering',
    createdAt: '2026-07-29T20:00:00Z'
  },
  {
    id: 'task-102',
    title: 'Design Minimalist Slick Audio Engine & DSP Buffer Pipeline',
    description: 'Implement zero-jitter WebAudio spatial routing, high-precision frequency synthesis, and minimalist acoustic feedback protocols.',
    category: 'Architecture',
    status: 'in_progress',
    assignee: 'Kenji Takahashi',
    priority: 'P1',
    aiPriority: 'P0',
    eisenhowerQuadrant: 'Do First',
    aiContextSuggestion: '[iNKSTECHSHUB AI] Crucial for Tokyo morning DSP sync at 09:00 JST. Validate WebAudio spatial buffer stability during peak shift.',
    timezoneTarget: 'Asia/Tokyo',
    estimatedHours: 10,
    riskFactor: 'High',
    strategicImpact: 'Pristine acoustic architecture with zero visual-audio phase drift',
    createdAt: '2026-07-29T22:30:00Z'
  },
  {
    id: 'task-103',
    title: 'Enforce Precision Design Protocols & Monospaced Visual System',
    description: 'Refine high-contrast typography, strict geometric grid alignment, and minimalist dark aesthetics across all core application viewports.',
    category: 'Frontend/UI',
    status: 'completed',
    assignee: 'Astrid Lindqvist',
    priority: 'P2',
    aiPriority: 'P2',
    eisenhowerQuadrant: 'Schedule',
    aiContextSuggestion: '[iNKSTECHSHUB AI] Completed. Monospaced typographic grid and high-contrast dark aesthetic verified across all 8 supported locales.',
    timezoneTarget: 'Europe/Amsterdam',
    estimatedHours: 6,
    riskFactor: 'Low',
    strategicImpact: 'Establishes immaculate visual identity & anti-slop UI standards',
    createdAt: '2026-07-29T18:00:00Z'
  },
  {
    id: 'task-104',
    title: 'Deploy Commercial Multi-Region Edge Infrastructure',
    description: 'Provision Cloud Run edge proxies paired with bare-metal compute nodes across Zurich, London, and Tokyo for global client state synchronization.',
    category: 'Infrastructure',
    status: 'in_progress',
    assignee: 'Julian Vance',
    priority: 'P1',
    aiPriority: 'P1',
    eisenhowerQuadrant: 'Schedule',
    aiContextSuggestion: '[iNKSTECHSHUB AI] Schedule Terraform deployment during Zurich/London overlap window (10:00 - 16:00 CET) under Mahmood\'s review.',
    timezoneTarget: 'Europe/London',
    estimatedHours: 8,
    riskFactor: 'Medium',
    strategicImpact: 'Achieves 99.999% commercial uptime with edge latency under 25ms',
    createdAt: '2026-07-29T21:15:00Z'
  },
  {
    id: 'task-105',
    title: 'Audit Cryptographic Link Vault & Sovereign Data Residency',
    description: 'Verify AES-GCM-256 client link payload encryption, zero-knowledge passphrase locks, and multi-region time-lock expiration policies.',
    category: 'Security',
    status: 'backlog',
    assignee: 'Tariq Al-Mansoor',
    priority: 'P2',
    aiPriority: 'P1',
    eisenhowerQuadrant: 'Do First',
    aiContextSuggestion: '[iNKSTECHSHUB AI] Elevated priority for European commercial client audit. Ensure cryptographic hash checksums pass zero-trust validation.',
    timezoneTarget: 'Asia/Dubai',
    estimatedHours: 6,
    riskFactor: 'Low',
    strategicImpact: 'Guarantees Swiss banking-grade payload isolation & client privacy',
    createdAt: '2026-07-29T22:00:00Z'
  }
];

export const initialBlueprint: ArchitectureBlueprint = {
  title: 'iNKSTECHSHUB Commercial Sourcing & Minimalist Audio-Visual Blueprint v4.2',
  summary: 'High-Performance Commercial Architecture combining Swiss Bare-Metal Compute Nodes, Low-Latency Audio Synthesis Engines, and Precision Visual Design Protocols.',
  billOfMaterials: [
    { component: 'Bare-Metal Compute Backbone', spec: '16x Hetzner AX102 AMD EPYC 9354 32-Core, 256GB ECC RAM, Falkenstein DC', estimatedMonthlyCostUSD: 2100 },
    { component: 'Commercial GPU Acceleration', spec: '4x NVIDIA H100 SXM5 80GB VRAM (AI & Audio DSP Pipeline)', estimatedMonthlyCostUSD: 7200 },
    { component: 'Minimalist Audio Transit Proxy', spec: 'Dedicated Low-Jitter Audio Routing Proxy + Cloudflare Anycast WAF', estimatedMonthlyCostUSD: 850 },
    { component: 'Multi-Region Persistence Layer', spec: 'Active-Active Cloud Spanner + Redis Enterprise Memory Cache', estimatedMonthlyCostUSD: 2200 },
    { component: 'Encrypted Link Cryptography Vault', spec: 'Swiss HSM Key Management & AES-256 Payload Engine', estimatedMonthlyCostUSD: 450 }
  ],
  terraformSnippet: `# iNKSTECHSHUB Commercial Architecture & Audio Infrastructure Spec
# Author: Mahmood / iNKSTECHSHUB Creative Direction & Architecture
provider "google" {
  project = "inkstechshub-commercial-prod"
  region  = "europe-west6" # Zurich Sovereign Region
}

resource "google_cloud_run_v2_service" "audio_edge_proxy" {
  name     = "inkshub-audio-edge-proxy"
  location = "europe-west6"
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/inkstechshub-commercial-prod/audio-dsp-engine:v4.2"
      env {
        name  = "SWISS_SECURITY_LEVEL"
        value = "MAXIMUM"
      }
      env {
        name  = "AUDIO_SYNTHESIS_PRECISION"
        value = "32BIT_FLOAT_ZERO_JITTER"
      }
      resources {
        limits = {
          cpu    = "4000m"
          memory = "8Gi"
        }
      }
    }
  }
}`,
  architectureDiagramNodes: [
    'Cloudflare Anycast WAF & Transit',
    'Swiss Edge Gateway (Zurich)',
    'Low-Latency Audio DSP Routing Proxy',
    'Commercial Bare-Metal GPU Cluster',
    'AES-GCM Cryptographic Link Vault',
    'Active-Active Cloud Spanner DB'
  ],
  complianceNotes: 'Certified under Swiss Federal Act on Data Protection (FADP), EU GDPR, and ISO 27001 precision infrastructure standards.',
  cloudProvider: 'Hybrid (Swiss Bare-Metal + GCP Edge Proxies)'
};

export const translations: Record<LanguageCode, {
  brandTitle: string;
  creatorTag: string;
  navConsole: string;
  navTasks: string;
  navSourcing: string;
  navTimezones: string;
  navEncryptedVault: string;
  shareEncryptedLink: string;
  aiEngineMode: string;
  prioritizeWithAI: string;
  promptPlaceholder: string;
  runAnalysis: string;
  generating: string;
  taskMatrixTitle: string;
  taskMatrixSubtitle: string;
  contextSuggestionsHeader: string;
  sourcingTitle: string;
  sourcingSubtitle: string;
  generateBlueprint: string;
  timezoneTitle: string;
  timezoneSubtitle: string;
  encryptedVaultTitle: string;
  encryptedVaultSubtitle: string;
  generateEncryptedToken: string;
  copyLink: string;
  linkCopied: string;
  activeLanguageLabel: string;
  totalTasks: string;
  urgentTasks: string;
  globalTeamOnline: string;
  totalMonthlyCost: string;
}> = {
  en: {
    brandTitle: 'iNKSTECHSHUB AI',
    creatorTag: 'Created by Mahmood • Elite Digital Architecture',
    navConsole: 'AI Console',
    navTasks: 'AI Task Matrix',
    navSourcing: 'Infrastructure Sourcing',
    navTimezones: 'Global Timezones',
    navEncryptedVault: 'Encrypted Link Vault',
    shareEncryptedLink: 'Share Secure Link',
    aiEngineMode: 'Engine Persona',
    prioritizeWithAI: 'Auto-Prioritize Tasks with AI',
    promptPlaceholder: 'Describe your digital architecture requirements, technical stack inquiry, or sourcing mandate...',
    runAnalysis: 'Execute Operational Analysis',
    generating: 'Synthesizing Insight...',
    taskMatrixTitle: 'Generative AI Task Prioritization',
    taskMatrixSubtitle: 'Context-aware suggestions and workload optimization across global team timezones',
    contextSuggestionsHeader: 'Context-Aware AI Guidance for Team Members',
    sourcingTitle: 'Technical Infrastructure & Sourcing Matrix',
    sourcingSubtitle: 'Bespoke enterprise cloud, bare-metal GPU clusters, and Bill of Materials (BOM)',
    generateBlueprint: 'Generate Custom Blueprint',
    timezoneTitle: 'Global Team Timezones & Availability',
    timezoneSubtitle: 'Real-time synchronization for disparate time zones (Zurich, London, Tokyo, Dubai, NY, Tallinn)',
    encryptedVaultTitle: 'Encrypted Link Sharing & Collaboration',
    encryptedVaultSubtitle: 'Provide secure, encrypted links for collaborative access to project documentation',
    generateEncryptedToken: 'Generate Encrypted Share Link',
    copyLink: 'Copy Encrypted Link',
    linkCopied: 'Encrypted Link Copied!',
    activeLanguageLabel: 'Language',
    totalTasks: 'Total Tasks',
    urgentTasks: 'Urgent (P0)',
    globalTeamOnline: 'Team Online',
    totalMonthlyCost: 'Est. Monthly Cost'
  },
  de: {
    brandTitle: 'iNKSTECHSHUB KI',
    creatorTag: 'Erstellt von Mahmood • Digitale Spitzenarchitektur',
    navConsole: 'KI-Konsole',
    navTasks: 'KI-Aufgabenmatrix',
    navSourcing: 'Infrastruktur-Beschaffung',
    navTimezones: 'Globale Zeitzonen',
    navEncryptedVault: 'Verschlüsselter Link-Tresor',
    shareEncryptedLink: 'Sicheren Link Teilen',
    aiEngineMode: 'Engine-Persona',
    prioritizeWithAI: 'Aufgaben mit KI Priorisieren',
    promptPlaceholder: 'Beschreiben Sie Ihre Architektur-Anforderungen, Tech-Stack-Frage oder Beschaffungsmandat...',
    runAnalysis: 'Betriebsanalyse Ausführen',
    generating: 'Erkenntnisse Synthetisieren...',
    taskMatrixTitle: 'Generative KI-Aufgabenpriorisierung',
    taskMatrixSubtitle: 'Kontextbezogene Vorschläge und Arbeitslastoptimierung über globale Zeitzonen',
    contextSuggestionsHeader: 'Kontextbezogene KI-Anleitung für Teammitglieder',
    sourcingTitle: 'Technische Infrastruktur & Sourcing-Matrix',
    sourcingSubtitle: 'Mascgeschneiderte Enterprise-Cloud, Bare-Metal-GPU-Cluster und Stückliste (BOM)',
    generateBlueprint: 'Benutzerdefinierten Bauplan Erstellen',
    timezoneTitle: 'Globale Team-Zeitzonen & Verfügbarkeit',
    timezoneSubtitle: 'Echtzeit-Synchronisierung für verteilte Zeitzonen (Zürich, London, Tokio, Dubai, NY)',
    encryptedVaultTitle: 'Verschlüsselte Freigabe & Zusammenarbeit',
    encryptedVaultSubtitle: 'Sichere, verschlüsselte Links für den kooperativen Zugriff auf Projektdokumente',
    generateEncryptedToken: 'Verschlüsselten Freigabelink Generieren',
    copyLink: 'Link Kopieren',
    linkCopied: 'Verschlüsselter Link Kopiert!',
    activeLanguageLabel: 'Sprache',
    totalTasks: 'Gesamtaufgaben',
    urgentTasks: 'Dringend (P0)',
    globalTeamOnline: 'Team Online',
    totalMonthlyCost: 'Geschätzte Monatliche Kosten'
  },
  fr: {
    brandTitle: 'iNKSTECHSHUB IA',
    creatorTag: 'Créé par Mahmood • Architecture Numérique d\'Élite',
    navConsole: 'Console IA',
    navTasks: 'Matrice de Tâches',
    navSourcing: 'Sourcing Infrastructure',
    navTimezones: 'Fuseaux Horaires',
    navEncryptedVault: 'Coffre-fort de Liens',
    shareEncryptedLink: 'Partager Lien Sécurisé',
    aiEngineMode: 'Moteur IA',
    prioritizeWithAI: 'Prioriser avec l\'IA Generative',
    promptPlaceholder: 'Décrivez vos exigences d\'architecture numérique, stack technique ou mandat de sourcing...',
    runAnalysis: 'Exécuter l\'Analyse Opérationnelle',
    generating: 'Synthèse des Données...',
    taskMatrixTitle: 'Priorisation Générative des Tâches',
    taskMatrixSubtitle: 'Suggestions contextuelles et optimisation selon les fuseaux horaires mondiaux',
    contextSuggestionsHeader: 'Guide IA Contextuel pour l\'Équipe',
    sourcingTitle: 'Infrastructure Technique & Matrice de Sourcing',
    sourcingSubtitle: 'Solutions Cloud Enterprise, clusters GPU bare-metal et nomenclature (BOM)',
    generateBlueprint: 'Générer Blueprint Sur Mesure',
    timezoneTitle: 'Fuseaux Horaires de l\'Équipe Mondiale',
    timezoneSubtitle: 'Synchronisation en temps réel pour équipes distantes (Zurich, Londres, Tokyo, Dubaï)',
    encryptedVaultTitle: 'Partage de Liens Chiffrés',
    encryptedVaultSubtitle: 'Fournissez un lien sécurisé et chiffré pour l\'accès collaboratif à la documentation',
    generateEncryptedToken: 'Générer le Lien Chiffré',
    copyLink: 'Copier le Lien',
    linkCopied: 'Lien Chiffré Copié !',
    activeLanguageLabel: 'Langue',
    totalTasks: 'Tâches Totales',
    urgentTasks: 'Urgentes (P0)',
    globalTeamOnline: 'Équipe en Ligne',
    totalMonthlyCost: 'Coût Mensuel Est.'
  },
  es: {
    brandTitle: 'iNKSTECHSHUB IA',
    creatorTag: 'Creado por Mahmood • Arquitectura Digital de Élite',
    navConsole: 'Consola IA',
    navTasks: 'Matriz de Tareas',
    navSourcing: 'Sourcing de Infraestructura',
    navTimezones: 'Zona Horaria Global',
    navEncryptedVault: 'Bóveda de Enlaces',
    shareEncryptedLink: 'Compartir Enlace Seguro',
    aiEngineMode: 'Motor IA',
    prioritizeWithAI: 'Priorizar con IA Generativa',
    promptPlaceholder: 'Describa sus requerimientos de arquitectura digital, stack técnico o abastecimiento...',
    runAnalysis: 'Ejecutar Análisis Operativo',
    generating: 'Sintetizando Información...',
    taskMatrixTitle: 'Priorización Generativa de Tareas',
    taskMatrixSubtitle: 'Sugerencias adaptadas al contexto y optimización de carga en zonas horarias',
    contextSuggestionsHeader: 'Orientación Contextual IA para el Equipo',
    sourcingTitle: 'Infraestructura Técnica y Sourcing',
    sourcingSubtitle: 'Cloud empresarial a medida, clusters GPU bare-metal y Lista de Materiales (BOM)',
    generateBlueprint: 'Generar Blueprint Personalizado',
    timezoneTitle: 'Zonas Horarias y Disponibilidad Global',
    timezoneSubtitle: 'Sincronización en tiempo real para equipos globales (Zúrich, Londres, Tokio, Dubái)',
    encryptedVaultTitle: 'Colaboración mediante Enlaces Cifrados',
    encryptedVaultSubtitle: 'Proporcione enlaces cifrados seguros para acceso colaborativo a la documentación',
    generateEncryptedToken: 'Generar Enlace Cifrado',
    copyLink: 'Copiar Enlace',
    linkCopied: '¡Enlace Cifrado Copiado!',
    activeLanguageLabel: 'Idioma',
    totalTasks: 'Tareas Totales',
    urgentTasks: 'Urgentes (P0)',
    globalTeamOnline: 'Equipo en Línea',
    totalMonthlyCost: 'Costo Mensual Est.'
  },
  ru: {
    brandTitle: 'iNKSTECHSHUB AI',
    creatorTag: 'Создано Mahmood • Цифровая Архитектура Высокого Класса',
    navConsole: 'ИИ Консоль',
    navTasks: 'Матрица Задач',
    navSourcing: 'Инфраструктура и Закупки',
    navTimezones: 'Часовые Пояса',
    navEncryptedVault: 'Зашифрованные Ссылки',
    shareEncryptedLink: 'Поделиться Ссылкой',
    aiEngineMode: 'Режим ИИ Движка',
    prioritizeWithAI: 'Приоритеты ИИ',
    promptPlaceholder: 'Опишите требования к цифровой архитектуре, технологическому стеку или закупкам...',
    runAnalysis: 'Запустить Анализ',
    generating: 'Генерация Аналитики...',
    taskMatrixTitle: 'Генеративная Приоритезация Задач ИИ',
    taskMatrixSubtitle: 'Контекстные рекомендации и оптимизация нагрузки с учетом часовых поясов',
    contextSuggestionsHeader: 'Контекстные Рекомендации ИИ для Команды',
    sourcingTitle: 'Техническая Инфраструктура и Сорсинг',
    sourcingSubtitle: 'Облачные решения, GPU кластеры и спецификация оборудования (BOM)',
    generateBlueprint: 'Создать Архитектурный План',
    timezoneTitle: 'Часовые Пояса Команды',
    timezoneSubtitle: 'Синхронизация в реальном времени (Цюрих, Лондон, Токио, Дубай, Нью-Йорк, Таллин)',
    encryptedVaultTitle: 'Зашифрованные Ссылки и Доступ',
    encryptedVaultSubtitle: 'Безопасный доступ к проектной документации для коллег в разных странах',
    generateEncryptedToken: 'Создать Зашифрованную Ссылку',
    copyLink: 'Скопировать Ссылку',
    linkCopied: 'Зашифрованная Ссылка Скопирована!',
    activeLanguageLabel: 'Язык',
    totalTasks: 'Всего Задач',
    urgentTasks: 'Критические (P0)',
    globalTeamOnline: 'В Сети',
    totalMonthlyCost: 'Оценка Затрат в Месяц'
  },
  ja: {
    brandTitle: 'iNKSTECHSHUB AI',
    creatorTag: 'Mahmoodによって作成された最高峰デジタルアーキテクチャ',
    navConsole: 'AIコンソール',
    navTasks: 'AIタスクマトリクス',
    navSourcing: 'インフラ調達',
    navTimezones: '世界タイムゾーン',
    navEncryptedVault: '暗号化リンク保管庫',
    shareEncryptedLink: '安全なリンクを共有',
    aiEngineMode: 'AIエンジンモード',
    prioritizeWithAI: 'AIでタスクを自動優先度付け',
    promptPlaceholder: 'デジタルアーキテクチャの要件、技術スタック、インフラ調達条件を入力してください...',
    runAnalysis: '運用分析を実行',
    generating: '洞察を生成中...',
    taskMatrixTitle: '生成AIタスク優先度自動解析',
    taskMatrixSubtitle: 'グローバルチームのタイムゾーンに応じた文脈配慮型のタスク提案と最適化',
    contextSuggestionsHeader: 'チームメンバー向けAIコンテキストアドバイス',
    sourcingTitle: '技術インフラ＆ソージングマトリクス',
    sourcingSubtitle: 'エンタープライズクラウド、ベアメタルGPUクラスタ、部品構成表 (BOM)',
    generateBlueprint: 'カスタム設計図を生成',
    timezoneTitle: '世界チームのタイムゾーン＆稼働状況',
    timezoneSubtitle: '複数タイムゾーン間のリアルタイム同期 (チューリッヒ、ロンドン、東京、ドバイ)',
    encryptedVaultTitle: '暗号化リンク共有＆コラボレーション',
    encryptedVaultSubtitle: 'プロジェクトドキュメントへの安全なアクセスを提供する暗号化リンクの生成',
    generateEncryptedToken: '暗号化共有リンクを作成',
    copyLink: 'リンクをコピー',
    linkCopied: '暗号化リンクをコピーしました！',
    activeLanguageLabel: '言語',
    totalTasks: '総タスク数',
    urgentTasks: '緊急 (P0)',
    globalTeamOnline: 'オンラインメンバー',
    totalMonthlyCost: '推定月額費用'
  },
  ar: {
    brandTitle: 'iNKSTECHSHUB AI',
    creatorTag: 'تم التطوير بواسطة محمود • الهندسة الرقمية المتقدمة',
    navConsole: 'لوحة الذكاء الاصطناعي',
    navTasks: 'مصفوفة المهام',
    navSourcing: 'تجهيز البنية التحتية',
    navTimezones: 'المناطق الزمنية',
    navEncryptedVault: 'خزنة الروابط المشفرة',
    shareEncryptedLink: 'مشاركة رابط آمن',
    aiEngineMode: 'وضع المحرك',
    prioritizeWithAI: 'ترتيب الأولويات بالذكاء الاصطناعي',
    promptPlaceholder: 'أدخل متطلبات البنية التحتية الرقمية، أو التقنيات المطلوبة، أو طلبات التجهيز...',
    runAnalysis: 'تشغيل التحليل التشغيلي',
    generating: 'جاري توليد الرؤى...',
    taskMatrixTitle: 'تحديد أولويات المهام بالذكاء الاصطناعي',
    taskMatrixSubtitle: 'اقتراحات ذكية تراعي المناطق الزمنية للفرق العالمية وتحسن توزيع العمل',
    contextSuggestionsHeader: 'توجيهات الذكاء الاصطناعي السياقية لأعضاء الفريق',
    sourcingTitle: 'البنية التحتية التقنية ومصفوفة التوريد',
    sourcingSubtitle: 'سحابة المؤسسات، مجموعات معالجات المعالجة (GPU)، وقائمة المواد (BOM)',
    generateBlueprint: 'إنشاء مخطط مخصص',
    timezoneTitle: 'المناطق الزمنية للفريق العالمي',
    timezoneSubtitle: 'مزامنة مباشرة عبر المناطق الزمنية المختلفة (زيورخ، لندن، طوكيو، دبي)',
    encryptedVaultTitle: 'مشاركة الروابط المشفرة والتعاون',
    encryptedVaultSubtitle: 'توفير روابط مشفرة وآمنة للوصول المشترك إلى وثائق المشروع',
    generateEncryptedToken: 'توليد رابط مشاركة مشفر',
    copyLink: 'نسخ الرابط',
    linkCopied: 'تم نسخ الرابط المشفر!',
    activeLanguageLabel: 'اللغة',
    totalTasks: 'إجمالي المهام',
    urgentTasks: 'عاجل (P0)',
    globalTeamOnline: 'متصل الان',
    totalMonthlyCost: 'التكلفة الشهرية المقدرة'
  },
  nl: {
    brandTitle: 'iNKSTECHSHUB AI',
    creatorTag: 'Gemaakt door Mahmood • Elite Digitale Architectuur',
    navConsole: 'AI Console',
    navTasks: 'AI Taakmatrix',
    navSourcing: 'Infrastructuur Sourcing',
    navTimezones: 'Mondiale Tijdzones',
    navEncryptedVault: 'Gecodeerde Link Kluis',
    shareEncryptedLink: 'Veilige Link Delen',
    aiEngineMode: 'Engine Persona',
    prioritizeWithAI: 'Automatisch Prioriteren met AI',
    promptPlaceholder: 'Beschrijf uw digitale architectuurvereisten, technische stack-vragen of sourcing-mandaat...',
    runAnalysis: 'Operationele Analyse Uitvoeren',
    generating: 'Inzichten Synthetiseren...',
    taskMatrixTitle: 'Generatieve AI Taakprioritering',
    taskMatrixSubtitle: 'Contextbewuste suggesties en werklastoptimalisatie over wereldwijde tijdzones',
    contextSuggestionsHeader: 'Contextbewuste AI-begeleiding voor Teamleden',
    sourcingTitle: 'Technische Infrastructuur & Sourcing Matrix',
    sourcingSubtitle: 'Op maat gemaakte Enterprise Cloud, bare-metal GPU-clusters en Stuklijst (BOM)',
    generateBlueprint: 'Aangepaste Blauwdruk Genereren',
    timezoneTitle: 'Wereldwijde Tijdzones & Beschikbaarheid',
    timezoneSubtitle: 'Realtime synchronisatie voor gedistribueerde tijdzones (Zürich, Londen, Tokio, Dubai)',
    encryptedVaultTitle: 'Gecodeerde Links & Samenwerking',
    encryptedVaultSubtitle: 'Bied veilige, gecodeerde links voor collaboratieve toegang tot projectdocumentatie',
    generateEncryptedToken: 'Gecodeerde Deellink Genereren',
    copyLink: 'Link Kopiëren',
    linkCopied: 'Gecodeerde Link Gekopieerd!',
    activeLanguageLabel: 'Taal',
    totalTasks: 'Totaal Taken',
    urgentTasks: 'Urgent (P0)',
    globalTeamOnline: 'Team Online',
    totalMonthlyCost: 'Geschatte Maandkosten'
  }
};
