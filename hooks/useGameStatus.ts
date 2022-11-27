import { GameStatusCode } from "./useGames";

interface DetailedStatus {
    gameState: string
    detailedState: string
    color: string
    live: boolean
}

type StatusMap = {
    [key in GameStatusCode]?: DetailedStatus
}

const GameStatusMap: StatusMap = {
    [GameStatusCode.SCHEDULED]: {
        gameState: "Preview",
        detailedState: "Scheduled",
        color: "#222",
        live: false
    },
    [GameStatusCode.PREGAME]: {
        gameState: "Preview",
        detailedState: "Pre-Game",
        color: "#444",
        live: false
    },
    [GameStatusCode.LIVE]: {
        gameState: "Live",
        detailedState: "In Progress",
        color: "rgb(215, 200, 38)",
        live: true
    },
    [GameStatusCode.LIVE_CRITICAL]: {
        gameState: "LiveCritical",
        detailedState: "In Progress",
        color: "#e03131",
        live: true
    },
    [GameStatusCode.CONCLUDED]: {
        gameState: "Final",
        detailedState: "Final",
        color: "#000",
        live: false
    },
    [GameStatusCode.FINAL1]: {
        gameState: "Final",
        detailedState: "Final",
        color: "#000",
        live: false
    },
    [GameStatusCode.FINAL2]: {
        gameState: "Final",
        detailedState: "Final",
        color: "#000",
        live: false
    },
    [GameStatusCode.SCHEDULED_TBD]: {
        gameState: "Preview",
        detailedState: "Scheduled (Time TBD)",
        color: "#000",
        live: false
    },
    [GameStatusCode.PPD]: {
        gameState: "Preview",
        detailedState: "Postponed",
        color: "rgb(255, 119, 0)",
        live: false
    }
};

export default GameStatusMap;
