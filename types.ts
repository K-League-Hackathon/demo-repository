
export interface PlayerStats {
  subject: string;
  value: number;
  fullMark: number;
}

export interface KeyTrait {
  name: string;
  description: string;
}

export interface Player {
  id: string;
  name: string;
  engName: string;
  position: string;
  number: number;
  team: string;
  teamLogo: string;
  photoUrl: string;
  stats: PlayerStats[];
  keyTraits: KeyTrait[]; // 기존 preferredPlays를 대체하는 고퀄리티 별명 데이터
  preferredPlays: string[]; // 하위 호환성을 위해 유지
  x: number;
  y: number;
}

export interface MatchInfo {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  stadium: string;
}

export interface Coordinate {
  x: number;
  y: number;
}

export interface SequenceAction {
  action_id: number;
  type_name: "Pass" | "Shot" | "Touch" | "Carry";
  start_x: number;
  start_y: number;
  end_x?: number;
  end_y?: number;
  result_name?: "Successful" | "Unsuccess" | "On Target" | "Off Target" | "Goal";
  player_name_ko: string;
  team_name_ko?: string;
  receiver_name_ko?: string;
  time_seconds: number;
}
