
export type Clue = {
    answer: string;
    normalizedAnswer: string;
    clue: string;
    value: number;
    category: string;
    airdate: string;
}

export type GameData = {
    id: number;
    episode_num: number;
    season_id: number;
    air_date: string;
    notes: string;
    contestant1: number;
    contestant2: number;
    contestant3: number;
    winner: number;
    score1: number;
    score2: number;
    score3: number;
}

export type GameResponse = {
    status: "success";
    data: GameData[];
} | {
    status: "failure";
}

export type ClueData = {
    id: number;
    game_id: number;
    value: number;
    daily_double: boolean;
    round: "J!" | "DJ!";
    category: string;
    clue: string;
    response: string;
}

export type ClueResponse = {
    status: "success";
    data: ClueData[];
} | {
    status: "failure"
}
