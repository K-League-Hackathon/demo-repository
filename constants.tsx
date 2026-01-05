
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
  'h1': './public/players/김경민.png', 
  'h2': './public/players/김진호.png',
  'h3': './public/players/포포비치.png',
  'h4': './public/players/안영규.png',
  'h5': './public/players/두현석.png',
  'h6': './public/players/안혁주.png',
  'h7': './public/players/정호연.png',
  'h8': './public/players/최경록.png',
  'h9': './public/players/티그랑.png',
  'h10': './public/players/이희균.png',
  'h11': './public/players/이건희.png',
};

// 광주 FC - 1-4-4-2 포메이션 (왼쪽)
export const HOME_FORMATION = [
  { id: 'h1', name: '김경민', number: 1, pos: 'GK', x: 5, y: 34 },
  { id: 'h2', name: '김진호', number: 27, pos: 'RB', x: 20, y: 8 },
  { id: 'h3', name: '포포비치', number: 4, pos: 'RCB', x: 20, y: 25 },
  { id: 'h4', name: '안영규', number: 6, pos: 'LCB', x: 20, y: 43 },
  { id: 'h5', name: '두현석', number: 13, pos: 'LB', x: 20, y: 60 },
  { id: 'h6', name: '안혁주', number: 28, pos: 'RM', x: 35, y: 12 },
  { id: 'h7', name: '정호연', number: 14, pos: 'RCM', x: 35, y: 30 },
  { id: 'h8', name: '최경록', number: 30, pos: 'LCM', x: 35, y: 48 },
  { id: 'h9', name: '티그랑', number: 11, pos: 'LM', x: 35, y: 65 },
  { id: 'h10', name: '이희균', number: 10, pos: 'RS', x: 48, y: 25 },
  { id: 'h11', name: '이건희', number: 20, pos: 'LS', x: 48, y: 50 },
];

// 서울 FC - 1-4-2-3-1 포메이션 (오른쪽)
export const AWAY_FORMATION = [
  { id: 'a1', name: '김승규', number: 1, pos: 'GK', x: 95, y: 34 },
  { id: 'a2', name: '박진섭', number: 50, pos: 'RB', x: 80, y: 8 },
  { id: 'a3', name: '한승규', number: 66, pos: 'RCB', x: 80, y: 25 },
  { id: 'a4', name: '권완규', number: 3, pos: 'LCB', x: 80, y: 43 },
  { id: 'a5', name: '최재현', number: 21, pos: 'LB', x: 80, y: 60 },
  { id: 'a6', name: '강상우', number: 11, pos: 'RDM', x: 70, y: 20 },
  { id: 'a7', name: '김주성', number: 30, pos: 'LDM', x: 70, y: 48 },
  { id: 'a8', name: '김진수', number: 9, pos: 'RW', x: 60, y: 10 },
  { id: 'a9', name: '팔로세비치', number: 26, pos: 'CAM', x: 60, y: 34 },
  { id: 'a10', name: '기성용', number: 6, pos: 'LW', x: 60, y: 58 },
  { id: 'a11', name: '조영욱', number: 32, pos: 'ST', x: 52, y: 34 },
];

export const PLAYERS: Player[] = HOME_FORMATION.map(f => ({
  id: f.id,
  name: f.name,
  engName: f.id.replace(/-/g, ' ').toUpperCase(),
  position: f.pos,
  number: f.number,
  team: 'GWANGJU FC',
  teamLogo: '/광주fc.png',
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
