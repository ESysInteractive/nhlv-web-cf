import * as React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";

const Header = () => {
    const [mounted, setMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <React.Fragment key={String(mounted)}>
            <Box sx={{ flexGrow: 1 }}>
                
            </Box>
        </React.Fragment>
    );
};

export default Header;
