import * as React from "react";
import { fetchGames } from "../hooks/useGames";

const Overview = () => {
    React.useEffect(() => {
        fetchGames()
            .then(games => {
                console.log(games);
            })
            .catch(err => {
                console.log("ERROR");
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
    }, []);

    return <div></div>;
};

export default Overview;
