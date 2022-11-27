import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "../components/Header";
import Games from "../components/Games";
import Footer from "../components/Footer";

const Overview = () => {
    const [isDarkMode, setDarkMode] = React.useState<boolean>(true);

    const theme = React.useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? "dark" : "light"
        }
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Games />
            <Footer />
        </ThemeProvider>
    );
};

export default Overview;
