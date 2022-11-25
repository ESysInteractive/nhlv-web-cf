import "../styles/global.css";
import * as React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
    const [isDarkMode, setDarkMode] = React.useState<boolean>(true);

    const theme = React.useMemo(() => createTheme({
        palette: {
            mode: isDarkMode ? "dark" : "light"
        }
    }), []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} key={router.pathname} />
        </ThemeProvider>
    )
};

export default MyApp;
