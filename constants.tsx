
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
  'h1': '김경민.png', 
  'h2': '김진호.png',
  'h3': '포포비치.png',
  'h4': '안영규.png',
  'h5': '두현석.png',
  'h6': '안혁주.png',
  'h7': '정호연.png',
  'h8': '최경록.png',
  'h9': '티그랑.png',
  'h10':'이희균.png',
  'h11':'이건희.png',
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

// 선수별 실제 능력치 데이터
const PLAYER_STATS: Record<string, { PAC: number; SHO: number; PAS: number; DRI: number; DEF: number; PHY: number }> = {
  '안영규': { PAC: 70.1, SHO: 23.6, PAS: 94.5, DRI: 50.1, DEF: 82.5, PHY: 85.4 },
  '안혁주': { PAC: 43.5, SHO: 57.7, PAS: 17.3, DRI: 50.1, DEF: 22.1, PHY: 13.8 },
  '이건희': { PAC: 33.2, SHO: 88.4, PAS: 18.1, DRI: 50.1, DEF: 21.6, PHY: 71.4 },
  '이희균': { PAC: 72.9, SHO: 87.7, PAS: 58.5, DRI: 50.1, DEF: 50.8, PHY: 27.5 },
  '김진호': { PAC: 61.6, SHO: 18.8, PAS: 87.9, DRI: 50.1, DEF: 75.6, PHY: 65.3 },
};

// 기본 능력치 (데이터가 없는 선수용)
const getPlayerStats = (name: string) => {
  const stats = PLAYER_STATS[name];
  if (stats) {
    return [
      { subject: 'PAC', value: stats.PAC, fullMark: 100 },
      { subject: 'SHO', value: stats.SHO, fullMark: 100 },
      { subject: 'PAS', value: stats.PAS, fullMark: 100 },
      { subject: 'DRI', value: stats.DRI, fullMark: 100 },
      { subject: 'DEF', value: stats.DEF, fullMark: 100 },
      { subject: 'PHY', value: stats.PHY, fullMark: 100 },
    ];
  }
  // 기본 랜덤 능력치
  return [
    { subject: 'PAC', value: 70 + Math.random() * 20, fullMark: 100 },
    { subject: 'SHO', value: 60 + Math.random() * 30, fullMark: 100 },
    { subject: 'PAS', value: 75 + Math.random() * 20, fullMark: 100 },
    { subject: 'DRI', value: 70 + Math.random() * 25, fullMark: 100 },
    { subject: 'DEF', value: 40 + Math.random() * 50, fullMark: 100 },
    { subject: 'PHY', value: 60 + Math.random() * 30, fullMark: 100 },
  ];
};

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
  stats: getPlayerStats(f.name),
  keyTraits: TRAITS_POOLS[f.pos.includes('G') ? 'GK' : f.pos.includes('D') ? 'DF' : f.pos.includes('M') ? 'MF' : 'ST'] || TRAITS_POOLS['MF'],
  preferredPlays: ['전술적 움직임', '높은 활동량', '포지셔닝 강점']
}));

export const MOCK_SEQUENCE: SequenceAction[] = [
  { action_id: 626, type_name: "Pass", start_x: 33.813885, start_y: 37.660848, end_x: 44.389905, end_y: 61.167292, player_name_ko: "안영규", team_name_ko: "광주FC", receiver_name_ko: "김진호", result_name: "Successful", time_seconds: 1228 },
  { action_id: 627, type_name: "Pass Received", start_x: 44.389905, start_y: 61.167292, end_x: 44.389905, end_y: 61.167292, player_name_ko: "김진호", team_name_ko: "광주FC", time_seconds: 1228.5 },
  { action_id: 628, type_name: "Carry", start_x: 44.389905, start_y: 61.167292, end_x: 71.454285, end_y: 63.2508664, player_name_ko: "김진호", team_name_ko: "광주FC", time_seconds: 1229 },
  { action_id: 629, type_name: "Pass", start_x: 71.454285, start_y: 63.2508664, end_x: 82.65789, end_y: 55.155956, player_name_ko: "김진호", team_name_ko: "광주FC", receiver_name_ko: "안혁주", result_name: "Successful", time_seconds: 1230 },
  { action_id: 630, type_name: "Pass Received", start_x: 82.65789, start_y: 55.155956, end_x: 82.65789, end_y: 55.155956, player_name_ko: "안혁주", team_name_ko: "광주FC", time_seconds: 1230.5 },
  { action_id: 631, type_name: "Pass", start_x: 82.65789, start_y: 55.155956, end_x: 84.966945, end_y: 48.744984, player_name_ko: "안혁주", team_name_ko: "광주FC", receiver_name_ko: "이건희", result_name: "Successful", time_seconds: 1231 },
  { action_id: 632, type_name: "Pass Received", start_x: 84.966945, start_y: 48.744984, end_x: 84.966945, end_y: 48.744984, player_name_ko: "이건희", team_name_ko: "광주FC", time_seconds: 1231.5 },
  { action_id: 633, type_name: "Carry", start_x: 84.966945, start_y: 48.744984, end_x: 86.01831, end_y: 45.475884, player_name_ko: "이건희", team_name_ko: "광주FC", time_seconds: 1232 },
  { action_id: 634, type_name: "Pass", start_x: 86.01831, start_y: 45.475884, end_x: 82.594575, end_y: 41.949744, player_name_ko: "이건희", team_name_ko: "광주FC", receiver_name_ko: "이희균", result_name: "Successful", time_seconds: 1233 },
  { action_id: 635, type_name: "Pass Received", start_x: 82.594575, start_y: 41.949744, end_x: 82.594575, end_y: 41.949744, player_name_ko: "이희균", team_name_ko: "광주FC", time_seconds: 1234 },
  { action_id: 636, type_name: "Shot", start_x: 82.594575, start_y: 41.949744, end_x: 105.0, end_y: 36.672260464, player_name_ko: "이희균", team_name_ko: "광주FC", result_name: "Goal", time_seconds: 1235 },
  { action_id: 637, type_name: "Goal", start_x: 105.0, start_y: 36.672260464, end_x: 105.0, end_y: 36.672260464, player_name_ko: "이희균", team_name_ko: "광주FC", result_name: "Goal", time_seconds: 1235 }
];

