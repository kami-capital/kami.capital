import { Skeleton } from "@material-ui/lab";
import { Typography, Box } from "@material-ui/core";
import { formatCurrency, formatNumber } from "../../../../helpers";
import { useAppSelector } from "src/hooks";
import { useTimer } from "../../hooks/useTimer";

export const Metric = props => <Box className={`metric ${props.className}`}>{props.children}</Box>;

Metric.Value = props => <Typography variant="h5">{props.children || <Skeleton type="text" />}</Typography>;

Metric.Title = props => (
  <Typography variant="h6" color="textSecondary">
    {props.children}
  </Typography>
);

export const MarketCap = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketCap = useAppSelector(state => {
    return state.app && state.app.marketCap;
  });
  return (
    <Metric className="market">
      <Metric.Title>Market Cap</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketCap, 2)}</Metric.Value>
    </Metric>
  );
};

export const KAMIPrice = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice =useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  return (
    <Metric className="price">
      <Metric.Title> Price</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketPrice, 4)}</Metric.Value>
    </Metric>
  );
};

export const NextRebase = () => {
  const nextRebase = useTimer(1800 - (Math.floor(new Date().getTime() / 1000 - 1560) % 1800));
  const isRebaseStarted = useAppSelector(state => {
    return state.app && state.app.rebaseStarted;
  });

  return (
    <Metric className="price">
      <Metric.Title>Next Rebase</Metric.Title>
      <Metric.Value>{isRebaseStarted && nextRebase}</Metric.Value>
    </Metric>
  );
};

export const CircSupply = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const circSupply = useAppSelector(state => {
    return state.app && state.app.circSupply;
  });
  return (
    <Metric className="circ">
      <Metric.Title>Circulating Supply</Metric.Title>
      <Metric.Value>{!isAppLoading && formatNumber(circSupply)}</Metric.Value>
    </Metric>
  );
};

export const BackingPerKAMI = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const backingPerKAMI = useAppSelector(state => {
    return state.app && state.app.backingPerKAMI;
  });

  return (
    <Metric className="circ">
      <Metric.Title>Backed Liquidity</Metric.Title>
      <Metric.Value>{!isAppLoading && formatNumber(backingPerKAMI, 2)}%</Metric.Value>
    </Metric>
  );
};

export const AverageKAMIHolding = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const averageKAMIHolding = useAppSelector(state => {
    return state.app && state.app.averageKAMIHolding;
  });
  return (
    <Metric className="bpo">
      <Metric.Title>Average KAMI Holding</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(averageKAMIHolding, 2)}</Metric.Value>
    </Metric>
  );
};

export const KAMIPriceCard = () => {
  const isAppLoading = useAppSelector(state => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector(state => {
    return state.app && state.app.marketPrice;
  });
  return (
    <Metric className="price">
      <Metric.Title>KAMI Price</Metric.Title>
      <Metric.Value>{!isAppLoading && formatCurrency(marketPrice, 2)}</Metric.Value>
    </Metric>
  );
};
