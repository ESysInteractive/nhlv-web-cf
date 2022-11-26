import moment, { Moment } from "moment-timezone";
import { Networks, getNetwork } from "./useNetworks";

interface APIResponse {
    dates: APIDate[]
}

interface APIDate {
    date: string
    games: APIGame[]
}

interface APIGame {
    gamePk: number
    gameType: GameType
    season: string
    gameDate: string
    status: GameStatus
    teams: APIGameTeams
    linescore: APILinescore
    broadcasts?: APIBroadcast[]
}

interface APIGameTeams {
    away: APIGameTeam
    home: APIGameTeam
}

interface APIGameTeam {
    score: number
    team: APITeam
}

interface APITeam {
    id: number
    name: string
    abbreviation: string
    teamName: string
}

interface APILinescore {
    currentPeriod: number
    currentPeriodOrdinal: string
    currentPeriodTimeRemaining: string
}

interface APIBroadcast {
    id: number
    name: string
    type: APIBroadcastType
    site: string
    language: string
}

enum APIBroadcastType {
    HOME = "home",
    AWAY = "away"
}

interface NHLGame {
    id: number
    type: GameType
    season: string
    date: Moment
    status: GameStatus
    teams: APIGameTeams
    linescore: APILinescore
    broadcasts?: Networks
}

enum GameType {
    PRESEASON = "PR",
    REGULAR = "R",
    PLAYOFFS = "P",
    ALLSTAR = "A",
    WOMEN_ALLSTAR = "WA",
    OLYMPIC = "O"
}

interface GameStatus {
    abstractGameState: string
    codedGameState: GameStatusCode
    detailedState: string
    statusCode: GameStatusCode
    startTimeTBD: boolean
}

enum GameStatusCode {
    SCHEDULED = 1,
    PREGAME,
    LIVE,
    LIVE_CRITICAL,
    CONCLUDED,
    FINAL1,
    FINAL2,
    SCHEDULED_TBD,
    PPD
}

export const fetchGames = async (startDate?: Moment, endDate?: Moment) => {
    const gameArray: NHLGame[] = [];

    const start = (startDate ?? moment()).tz("America/Edmonton").format("YYYY-MM-DD");
    const end = endDate ?? start;

    const baseUrl = `https://statsapi.web.nhl.com/api/v1/schedule?startDate=${start}&endDate=${end}&expand=schedule.broadcasts.all,schedule.teams,schedule.linescore,schedule.game.seriesSummary,schedule.game.content.media.epg`;
    const res = await fetch(baseUrl);

    if (res.ok) {
        const json: APIResponse = await res.json();

        for (const date of json.dates) {
            for (const apiGame of date.games) {
                const networks: Networks = {};

                if (apiGame.broadcasts) {
                    for (const broadcast of apiGame.broadcasts) {
                        networks[broadcast.name] = getNetwork(broadcast.name);
                    }
                }

                // Map API game to normalized game
                const game: NHLGame = {
                    id: apiGame.gamePk,
                    type: apiGame.gameType,
                    season: apiGame.season,
                    date: moment(apiGame.gameDate),
                    status: apiGame.status,
                    teams: apiGame.teams,
                    linescore: apiGame.linescore,
                    broadcasts: networks
                };
    
                gameArray.push(game);
            }
        }
    }

    return gameArray;
};