import type { WorkshopState } from './types'

export const AETROS_DEFAULTS: Partial<WorkshopState> = {
  projectName: 'Aetros — ESG Community Platform',
  segments: [
    {
      id: 'seg-1',
      name: 'เจ้าหน้าที่ ESG / Sustainability Officer',
      situation: 'ต้องทำ ESG Report ครั้งแรก ภายใน deadline 3 เดือน',
      when: 'ก่อน quarter close / ก่อนส่งรายงานต่อ board',
      where: 'องค์กรขนาดกลาง-ใหญ่, ทีม ESG 1–3 คน',
    },
    {
      id: 'seg-2',
      name: 'Individual Eco-Enthusiast',
      situation: 'อยากมีส่วนร่วมกับ sustainability แต่ไม่รู้จะเริ่มจากไหน',
      when: 'หลังเห็นข่าว climate / หลังดู documentary',
      where: 'urban professional, อายุ 25–40',
    },
    {
      id: 'seg-3',
      name: 'ESG Expert / Consultant',
      situation: 'มีความรู้ลึก อยากแบ่งปันและสร้างเครือข่าย',
      when: 'หลังทำโปรเจกต์ ESG สำเร็จ / อยากหา audience',
      where: 'freelance consultant, NGO, academia',
    },
  ],
  jtbdStatements: [
    {
      id: 'jtbd-1',
      segmentId: 'seg-1',
      situation: 'เมื่อใกล้ deadline ESG Report และข้อมูลกระจัดกระจาย',
      job: 'รวบรวม framework, ตัวอย่าง และ best practice ที่ใช้ได้จริง',
      outcome: 'ส่งรายงานได้ตรงมาตรฐานโดยไม่ต้องเริ่มจากศูนย์',
      functional: 'เข้าถึง template GRI/CSRD, checklist Scope 1–3',
      emotional: 'มั่นใจว่าไม่พลาดข้อกำหนดสำคัญ',
      social: 'ได้รับการยอมรับจาก board และ stakeholder',
    },
  ],
  pains: [
    { id: 'pain-1', segmentId: 'seg-1', text: 'ข้อมูล ESG กระจายหลาย department รวมยาก', importance: 5, dimension: 'functional' },
    { id: 'pain-2', segmentId: 'seg-1', text: 'ไม่มั่นใจว่า framework ที่เลือกถูกต้อง', importance: 4, dimension: 'emotional' },
    { id: 'pain-3', segmentId: 'seg-2', text: 'action สีเขียวเล็กๆ รู้สึกว่าไม่มี impact จริง', importance: 4, dimension: 'emotional' },
  ],
  gains: [
    { id: 'gain-1', segmentId: 'seg-1', text: 'ส่งรายงาน ESG ตรงเวลาและผ่าน audit', importance: 5, dimension: 'functional' },
    { id: 'gain-2', segmentId: 'seg-2', text: 'เห็น progress ชัดเจน (XP, carbon credits)', importance: 5, dimension: 'emotional' },
    { id: 'gain-3', segmentId: 'seg-3', text: 'สร้าง personal brand ในฐานะ ESG expert', importance: 4, dimension: 'social' },
  ],
  valueMap: {
    productsServices: [
      'Community Hub — feed, challenges, knowledge topics',
      'Dashboard — Eco-Avatar, action tracker, gamification',
      'Marketplace — carbon credit rewards',
      'Expert content + moderator approval flow',
    ],
    painRelievers: [
      { id: 'pr-1', painId: 'pain-1', description: 'Knowledge Hub รวม E/S/G topics + community Q&A' },
      { id: 'pr-2', painId: 'pain-2', description: 'Expert posts + GRI/Scope guides จากผู้เชี่ยวชาญ' },
      { id: 'pr-3', painId: 'pain-3', description: 'Action tracker + global impact counter แสดงผลรวม' },
    ],
    gainCreators: [
      { id: 'gc-1', gainId: 'gain-1', description: 'Knowledge + expert network สำหรับ ESG Report' },
      { id: 'gc-2', gainId: 'gain-2', description: 'Gamified XP, tiers, Eco-Avatar evolution' },
      { id: 'gc-3', gainId: 'gain-3', description: 'Expert role + approved posts + leaderboard' },
    ],
  },
  bmc: {
    customerSegments: 'ESG officers, eco enthusiasts, experts — JTBD-driven segments from Step 2',
    valueProposition: 'Inner Universe empowerment: จาก compliance → individual impact ที่วัดได้',
    channels: 'Web app, community feed, challenges, partner org posts',
    customerRelationships: 'Community co-creation, gamification, expert moderation',
    revenueStreams: 'Freemium community, B2B org accounts, marketplace partnerships (future)',
    keyResources: 'Platform, expert network, carbon credit partners, content library',
    keyActivities: 'Community moderation, challenge design, impact tracking',
    keyPartners: 'NGOs, solar/EV partners, tree-planting orgs, ESG consultancies',
    costStructure: 'Platform infra, moderation, partner rewards, content curation',
  },
}

export const JTBD_EXAMPLES = [
  {
    label: 'ESG Report Officer',
    text: 'When ใกล้ deadline ESG Report, I want to หา framework และตัวอย่างที่ใช้ได้จริง, so I can ส่งรายงานได้โดยไม่เริ่มจากศูนย์',
  },
  {
    label: 'Eco Beginner',
    text: 'When รู้สึกอยากช่วยโลกแต่ไม่รู้จะเริ่ม, I want to บันทึก action เล็กๆ และเห็น progress, so I can รู้สึกว่ามีส่วนร่วมจริง',
  },
  {
    label: 'ESG Expert',
    text: 'When มี insight จากโปรเจกต์ ESG, I want to แชร์และได้ feedback จากชุมชน, so I can สร้าง authority และเครือข่าย',
  },
]
