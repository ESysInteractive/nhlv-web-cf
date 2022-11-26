interface Status {
    gameState: string
    detailedState: string
    color: string
    live: boolean
}

interface StatusMap {
    [index: string]: Status
}

export default {
    "1": {
        
    }
} as StatusMap