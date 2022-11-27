import * as React from "react";
import styledComponent from "styled-components";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import moment, { Moment } from "moment-timezone";
import GameStatusMap from "../hooks/useGameStatus";
import { NHLGame, GameStatusCode, fetchGames } from "../hooks/useGames";

const ContainerHolder = styledComponent.div`
    margin-top: 50px;
    margin-left: 20px;
`;

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    position: "relative",
    zIndex: 1,
    width: "100%"
}));

interface StatusProps {
    bgColor: string
}

const Status = styledComponent.div<StatusProps>`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 20%;
    background-color: ${props => props.bgColor};
    border-radius: 4px;
    justify-content: center;
    text-align: center;
`;

const Content = styledComponent.div`
    margin-top: 30px;
`;

const ContentLeft = styledComponent.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
`;

const ContentRight = styledComponent.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
`;

const ScoreLight = styledComponent.span`
    position: absolute;
    font-weight: bolder;
    left: 95%;
    margin-top: 5px;
`;

const ScoreDark = styledComponent.span`
    position: absolute;
    font-weight: bolder;
    left: 95%;
    margin-top: 5px;
    opacity: .5;
`;

const Spacer = styledComponent.div`
    background: #fff;
    opacity: .1;
    height: 1px;
    width: 100%;
    line-height: 0;
    margin-top: 10px;
    margin-bottom: 10px;
`;

const NetworkHolder = styledComponent.div`
    display: flex;
    column-gap: 5px;
`;

const NetworkContainer = styledComponent.div`
    position: relative;
`;

interface NetworkProps {
    logoHeight: string
}

const Network = styledComponent.img<NetworkProps>`
    height: ${props => props.logoHeight};
`;

const Games = () => {
    const [mounted, setMounted] = React.useState<boolean>(false);
    const [data, setData] = React.useState<NHLGame[]>(null);
    const [loading, setLoading] = React.useState<boolean>(true);

    let defaultDate = moment();

    if (typeof window === undefined) defaultDate = moment(localStorage.getItem("savedDate"));

    const [date, setDate] = React.useState<Moment>(defaultDate);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const fetchForDate = (date: Moment) => {
        fetchGames(date)
            .then(games => {
                setData(games);
                setLoading(false);
            })
            .catch(err => {
                console.log("Fetching games errored");
                if (err instanceof Error) {
                    console.error(err.message);
                }
            });
    };

    React.useEffect(() => {
        fetchForDate(date);

        let interval = setInterval(() => {
            setLoading(true);
            fetchForDate(date);
        }, 60000);
        return () => clearInterval(interval);
    }, [date]);

    if (loading) return <h1>Loading...</h1>;

    return (
        <React.Fragment key={String(mounted)}>
            <ContainerHolder>
                <Container>
                    <Box sx={{ flexGrow: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                                label="Date"
                                value={date}
                                onChange={newDate => {
                                    setDate(newDate);
                                    localStorage.setItem("savedDate", moment(newDate).format("YYYY-MM-DD"));
                                }}
                                renderInput={params => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        <Grid container spacing={2}>
                            {data && data.map(game => (
                                <Grid key={game.id} item md={4}>
                                    <Item>
                                        <Status bgColor={GameStatusMap[game.status.statusCode].color}>
                                            <span style={{ color: "#fff" }}>
                                                {GameStatusMap[game.status.statusCode].detailedState} {(game.status.statusCode === GameStatusCode.SCHEDULED) && `(${game.date.tz("America/Edmonton").format("h:mm A [MT]")})`}
                                            </span>
                                        </Status>
                                        <Content>
                                            {GameStatusMap[game.status.statusCode].live &&
                                                <ContentRight>
                                                    <div>{game.linescore.currentPeriodOrdinal}</div>
                                                    <div>{game.linescore.currentPeriodTimeRemaining}</div>
                                                </ContentRight>
                                            }
                                            <ContentLeft>
                                                <div>
                                                    <img
                                                        style={{ height: "20px" }}
                                                        src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${game.teams.away.team.id}.svg`}
                                                    />
                                                    <span>{game.teams.away.team.name} ({game.teams.away.leagueRecord.wins}-{game.teams.away.leagueRecord.losses}{game.teams.away.leagueRecord.ot !== undefined && `-` + game.teams.away.leagueRecord.ot}) {(game.status.statusCode !== GameStatusCode.SCHEDULED && game.status.statusCode !== GameStatusCode.PREGAME && game.status.statusCode !== GameStatusCode.PPD) && (game.teams.away.score >= game.teams.home.score ? <ScoreLight>{game.teams.away.score}</ScoreLight> : <ScoreDark>{game.teams.away.score}</ScoreDark>)}</span>
                                                </div>
                                                <div>
                                                    <img
                                                        style={{ height: "20px" }}
                                                        src={`https://www-league.nhlstatic.com/images/logos/teams-current-primary-light/${game.teams.home.team.id}.svg`}
                                                    />
                                                    <span>{game.teams.home.team.name} ({game.teams.home.leagueRecord.wins}-{game.teams.home.leagueRecord.losses}{game.teams.home.leagueRecord.ot !== undefined && `-` + game.teams.home.leagueRecord.ot}) {(game.status.statusCode !== GameStatusCode.SCHEDULED && game.status.statusCode !== GameStatusCode.PREGAME && game.status.statusCode !== GameStatusCode.PPD) && (game.teams.home.score >= game.teams.away.score ? <ScoreLight>{game.teams.home.score}</ScoreLight> : <ScoreDark>{game.teams.home.score}</ScoreDark>)}</span>
                                                </div>
                                            </ContentLeft>
                                            <Spacer />
                                            <NetworkHolder>
                                                {game.networks && (
                                                    Object.entries(game.networks).map(([key, value]) => (
                                                        <a>
                                                            <NetworkContainer>
                                                                <Network src={value.logo} title={key} logoHeight={value.height} />
                                                            </NetworkContainer>
                                                        </a>
                                                    ))
                                                )}
                                            </NetworkHolder>
                                        </Content>
                                    </Item>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </ContainerHolder>
        </React.Fragment>
    );
};

export default Games;
