import { memo } from "react"; 
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, Zoom, Container, useMediaQuery, SvgIcon } from "@material-ui/core";
import {
  MarketCap,
  KAMIPrice,
  NextRebase,
  CircSupply,
  BackingPerKAMI,
  AverageKAMIHolding,
} from "./components/Metric/Metric";

import { KAMIPriceCard, RFVOfTreasuryAssetsCard, TotalLiquidityCard, MarketValueCard } from "./components/Card/Card";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <div id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <MarketCap />
              <KAMIPrice />
              <NextRebase />  
              <CircSupply />
              <BackingPerKAMI />
              <AverageKAMIHolding />
            </Box>
          </Paper>
        </Box>

        <Zoom in={true}>
          <Grid container spacing={6} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <KAMIPriceCard />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <MarketValueCard />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TotalLiquidityCard />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <RFVOfTreasuryAssetsCard />
            </Grid>
 
          </Grid>
          
        </Zoom>
      </Container>
    </div>
  );
});

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <TreasuryDashboard />
  </QueryClientProvider>
);
