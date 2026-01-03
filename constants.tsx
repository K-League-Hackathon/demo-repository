
import { Player, SequenceAction } from './types';

export const COLORS = {
  NAVY_DARK: '#050b18',
  NAVY_ACCENT: '#0a1428',
  GOLD: '#c5a059',
  GOLD_BRIGHT: '#f2d398',
  WHITE: '#ffffff',
  GRAY: '#94a3b8',
  SUCCESS: '#3b82f6', 
  DANGER: '#ef4444',  
  AWAY: '#94a3b8',
};

const TRAITS_POOLS: Record<string, {name: string, description: string}[]> = {
  GK: [
    { name: "철벽 방어 (Iron Wall)", description: "골문 앞을 든든하게 지키는 수호신" },
    { name: "공중볼 강자 (Aerial King)", description: "높은 타점으로 제공권을 장악함" },
    { name: "클러치 세이브 (Clutch Hand)", description: "결정적인 위기 상황에서 팀을 구함" }
  ],
  DF: [
    { name: "진격의 거인 (Colossus)", description: "강력한 피지컬로 상대 공격진을 압도" },
    { name: "커팅 마스터 (Intercept Pro)", description: "상대의 패스 길목을 미리 차단" },
    { name: "빌드업의 시발점 (Architect)", description: "정교한 롱패스로 공격 전개를 주도" }
  ],
  MF: [
    { name: "그라운드의 마에스트로 (Maestro)", description: "경기 전체 흐름을 완벽하게 조율" },
    { name: "박스 투 박스 (Engine Room)", description: "지치지 않는 체력으로 공수 전반에 기여" },
    { name: "키패스 머신 (Chance Maker)", description: "상대 수비진을 허무는 결정적 패스 공급" }
  ],
  ST: [
    { name: "원샷원킬 (Sniper)", description: "기회가 오면 놓치지 않는 정교한 마무리" },
    { name: "라인 브레이커 (Speed Demon)", description: "상대 수비 뒷공간을 파고드는 폭발적 속도" },
    { name: "타겟맨 (Wall Finisher)", description: "전방에서 공을 소유하며 동료에게 기회 창출" }
  ]
};

// 고해상도 스포츠 초상화 이미지 (Unsplash 기반 플레이스홀더)
const PLAYER_IMAGES: Record<string, string> = {
  'h1': 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&q=80&w=400', 
  'h2': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
  'h3': 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=400',
  'h4': 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=400',
  'h5': 'https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=400',
  'won-du-jae': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=400',
  'kang-hyeon-muk': 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&q=80&w=400',
  'kim-min-jun': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=400',
  'lee-kang-in': 'https://images.unsplash.com/photo-1560272564-c83d66b1ad12?auto=format&fit=crop&q=80&w=400',
  'h10': 'https://images.unsplash.com/photo-1552318975-27db393d2833?auto=format&fit=crop&q=80&w=400',
  'kim-jae-woo': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400',
};

export const HOME_FORMATION = [
  { id: 'h1', name: '조현우', number: 21, pos: 'GK', x: 5, y: 34 },
  { id: 'h2', name: '설영우', number: 66, pos: 'RB', x: 28, y: 8 },
  { id: 'h3', name: '김영권', number: 19, pos: 'RCB', x: 22, y: 24 },
  { id: 'h4', name: '정승현', number: 15, pos: 'LCB', x: 22, y: 44 },
  { id: 'h5', name: '이명재', number: 13, pos: 'LB', x: 28, y: 60 },
  { id: 'won-du-jae', name: '원두재', number: 6, pos: 'CDM', x: 42, y: 34 },
  { id: 'kang-hyeon-muk', name: '강현묵', number: 7, pos: 'LCM', x: 52, y: 50 },
  { id: 'kim-min-jun', name: '김민준', number: 17, pos: 'RCM', x: 52, y: 18 },
  { id: 'lee-kang-in', name: '이강인', number: 10, pos: 'RW', x: 78, y: 12 },
  { id: 'h10', name: '주민규', number: 18, pos: 'ST', x: 88, y: 34 },
  { id: 'kim-jae-woo', name: '김재우', number: 11, pos: 'LW', x: 78, y: 56 },
];

export const PLAYERS: Player[] = HOME_FORMATION.map(f => ({
  id: f.id,
  name: f.name,
  engName: f.id.replace(/-/g, ' ').toUpperCase(),
  position: f.pos,
  number: f.number,
  team: 'SEOUL FC',
  teamLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/K_League_1_logo.svg/1200px-K_League_1_logo.svg.png',
  photoUrl: PLAYER_IMAGES[f.id] || `https://picsum.photos/seed/${f.id}/400/500`,
  x: f.x,
  y: f.y,
  stats: [
    { subject: 'PAC', value: 70 + Math.random() * 20, fullMark: 100 },
    { subject: 'SHO', value: 60 + Math.random() * 30, fullMark: 100 },
    { subject: 'PAS', value: 75 + Math.random() * 20, fullMark: 100 },
    { subject: 'DRI', value: 70 + Math.random() * 25, fullMark: 100 },
    { subject: 'DEF', value: 40 + Math.random() * 50, fullMark: 100 },
    { subject: 'PHY', value: 60 + Math.random() * 30, fullMark: 100 },
  ],
  keyTraits: TRAITS_POOLS[f.pos.includes('G') ? 'GK' : f.pos.includes('D') ? 'DF' : f.pos.includes('M') ? 'MF' : 'ST'] || TRAITS_POOLS['MF'],
  preferredPlays: ['전술적 움직임', '높은 활동량', '포지셔닝 강점']
}));

export const MOCK_SEQUENCE: SequenceAction[] = [
  { action_id: 2335, type_name: "Pass", start_x: 81.1, start_y: 50.5, end_x: 60.1, end_y: 49.4, player_name_ko: "김영권", team_name_ko: "SEOUL FC", receiver_name_ko: "김민준", result_name: "Successful", time_seconds: 1850.2 },
  { action_id: 2337, type_name: "Carry", start_x: 60.1, start_y: 49.4, end_x: 45.7, end_y: 32.1, player_name_ko: "김민준", team_name_ko: "SEOUL FC", time_seconds: 1851.5 },
  { action_id: 2338, type_name: "Pass", start_x: 45.7, start_y: 32.1, end_x: 37.1, end_y: 34.4, player_name_ko: "김민준", team_name_ko: "SEOUL FC", receiver_name_ko: "강현묵", result_name: "Successful", time_seconds: 1853.0 },
  { action_id: 2340, type_name: "Carry", start_x: 37.1, start_y: 34.4, end_x: 19.9, end_y: 42.3, player_name_ko: "강현묵", team_name_ko: "SEOUL FC", time_seconds: 1855.2 },
  { action_id: 2341, type_name: "Shot", start_x: 19.9, start_y: 42.3, end_x: 4.2, end_y: 36.4, player_name_ko: "강현묵", team_name_ko: "SEOUL FC", result_name: "Goal", time_seconds: 1858.0 }
];
