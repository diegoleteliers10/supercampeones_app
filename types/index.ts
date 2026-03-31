// Type definitions for LigaKids

export type UserRole = "admin" | "scorer" | "parent";

export type MatchStatus = "upcoming" | "live" | "completed" | "blocked";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  teamIds: string[];
  createdAt: number;
}

export interface League {
  _id: string;
  name: string;
  category: string;
  season: string;
  createdAt: number;
  updatedAt: number;
}

export interface Team {
  _id: string;
  leagueId: string;
  name: string;
  group: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  players: Player[];
  createdAt: number;
}

export interface Player {
  name: string;
  number: number;
  position: string;
}

export interface Round {
  _id: string;
  leagueId: string;
  number: number;
  date: string;
  createdAt: number;
}

export interface Match {
  _id: string;
  roundId: string;
  leagueId: string;
  localTeamId: string;
  visitorTeamId: string;
  field: string;
  scheduledTime: string;
  status: MatchStatus;
  scoreLocal: number;
  scoreVisitor: number;
  scorerId?: string;
  startedAt?: number;
  finishedAt?: number;
  createdAt: number;
  // Joined data
  localTeam?: Team;
  visitorTeam?: Team;
  round?: Round;
  goals?: Goal[];
  fairplayCards?: FairplayCard[];
}

export interface Goal {
  _id: string;
  matchId: string;
  teamId: string;
  playerName: string;
  minute: number;
  createdAt: number;
}

export interface FairplayCard {
  _id: string;
  matchId: string;
  teamId: string;
  note?: string;
  createdAt: number;
}

export interface Standing {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}
