import React from "react";
import { Box, Grid } from "@mui/material";
import Home from "./components/Home";

function App() {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={6}>
        <Home />
      </Grid>
      {/* <Grid item xs={6}>
        <Home />
      </Grid> */}
    </Grid>
  );
}

export default App;
