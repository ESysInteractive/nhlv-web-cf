interface Network {
    logo: string
    height: string
}

export interface Networks {
    [network: string]: Network
}

const NetworkMap: Networks = {
    DEFAULT: {
        logo: require("../public/images/networks/default.png").default.src,
        height: "30px"
    }
}

export const getNetwork = (network: string) => {
    let networkFound = NetworkMap.DEFAULT;

    for (const [key, value] of Object.entries(NetworkMap)) {
        if (network.toUpperCase().includes(key)) {
            networkFound = value;
            break;
        }
    }

    return networkFound;
};
