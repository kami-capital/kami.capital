import { useEffect, useState } from "react"; 
import { useAppSelector } from "src/hooks";
import { Grid, InputAdornment, OutlinedInput, Zoom, Slider } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

function Calculator() {
  const isAppLoading = useAppSelector((state: any) => {
    return state.app && state.app.loading;
  });
  const marketPrice = useAppSelector((state: any) => {
    return state.app && state.app.marketPrice;
  });
  const kamiBalance = useAppSelector((state: any) => {
    return state.account.balances && state.account.balances.kami;
  });
  const [kamiAmount, setKamiAmount] = useState(0);
  const [rewardYield, setRewardYield] = useState(153617.50);
  const [priceAtPurchase, setPriceAtPurchase] = useState(0);
  const [futureMarketPrice, setFutureMarketPrice] = useState(0);
  const [days, setDays] = useState(30);

  const [rewardsEstimation, setRewardsEstimation] = useState(0);
  const [potentialReturn, setPotentialReturn] = useState(0);
  const [initialInvestment, setInitialInvestment] = useState(0);

  const calcCurrentWealth = () => {
    return kamiAmount * marketPrice;
  };

  const calcNewBalance = () => {
    let balance = kamiAmount;
    for (let i = 0; i < days; i++) {
      balance += balance * 0.020999;
    }
    return balance;
  };
  
  useEffect(() => {
    setKamiAmount(parseFloat(kamiBalance));
    setPriceAtPurchase(marketPrice);
    setFutureMarketPrice(marketPrice);
  }, [kamiBalance, marketPrice]);

  useEffect(() => {
    setInitialInvestment(kamiAmount * priceAtPurchase);
  }, [kamiAmount, priceAtPurchase]);

  useEffect(() => {
    const newBalance = calcNewBalance();
    setRewardsEstimation(newBalance);
    const newPotentialReturn = newBalance * futureMarketPrice;
    setPotentialReturn(newPotentialReturn);
  }, [days, futureMarketPrice, kamiAmount]);

  return (
    <div className="calculator-view">
      <Zoom in={true}>
        <div className="calculator-card">
          <Grid className="calculator-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <div className="calculator-card-header">
                <p className="calculator-card-header-title">Calculator</p>
                <p className="calculator-card-header-subtitle">Estimate your returns</p>
              </div>
            </Grid>
            <Grid item>
              <div className="calculator-card-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="calculator-card-apy">
                      <p className="calculator-card-metrics-title">KAMI Price</p>
                      <p className="calculator-card-metrics-value">
                        {isAppLoading ? <Skeleton width="100px" /> : `$${marketPrice}`}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="calculator-card-tvl">
                      <p className="calculator-card-metrics-title">APY:</p>
                      <p className="calculator-card-metrics-value">
                        {isAppLoading ? 
                          <Skeleton width="100px" /> : <>{new Intl.NumberFormat("en-US").format(rewardYield)}%</>}
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="calculator-card-index">
                      <p className="calculator-card-metrics-title">Your KAMI Balance</p>
                      <p className="calculator-card-metrics-value">{isAppLoading ? <Skeleton width="100px" /> : <>{kamiAmount.toFixed(2)} KAMI</>}</p>
                    </div>
                  </Grid>
                </Grid>
              </div>
          </Grid>

        <div className="calculator-card-area">
            <div>
                <div className="calculator-card-action-area">
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <div className="calculator-card-action-area-inp-wrap">
                        <p className="calculator-card-action-area-inp-wrap-title">KAMI Amount</p>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={kamiAmount.toFixed(2)}
                          onChange={e => setKamiAmount(parseFloat(e.target.value))}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={() => setKamiAmount(kamiAmount)} className="stake-card-action-input-btn">
                                <p>Max</p>
                              </div>
                            </InputAdornment>
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div className="calculator-card-action-area-inp-wrap">
                        <p className="calculator-card-action-area-inp-wrap-title">APY (%)</p>
                        <OutlinedInput
                          type="number"
                          placeholder="Amount"
                          className="calculator-card-action-input"
                          value={rewardYield}
                          onChange={e => setRewardYield(parseFloat(e.target.value))}
                          labelWidth={0}
                          endAdornment={
                            <InputAdornment position="end">
                              <div onClick={() => setRewardYield(rewardYield)} className="stake-card-action-input-btn">
                                <p>Current</p>
                              </div>
                            </InputAdornment>
                          }
                          disabled
                        />
                      </div>
                    </Grid>
                      <Grid item xs={12} sm={6}>
                          <div className="calculator-card-action-area-inp-wrap">
                              <p className="calculator-card-action-area-inp-wrap-title">KAMI price at purchase ($)</p>
                              <OutlinedInput
                                  type="number"
                                  placeholder="Amount"
                                  className="calculator-card-action-input"
                                  value={priceAtPurchase}
                                  onChange={e => setPriceAtPurchase(parseFloat(e.target.value))}
                                  labelWidth={0}
                                  endAdornment={
                                      <InputAdornment position="end">
                                          <div onClick={() => setPriceAtPurchase(marketPrice)} className="stake-card-action-input-btn">
                                              <p>Current</p>
                                          </div>
                                      </InputAdornment>
                                  }
                              />
                          </div>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                          <div className="calculator-card-action-area-inp-wrap">
                              <p className="calculator-card-action-area-inp-wrap-title">Future KAMI market price ($)</p>
                              <OutlinedInput
                                  type="number"
                                  placeholder="Amount"
                                  className="calculator-card-action-input"
                                  value={futureMarketPrice}
                                  onChange={e => setFutureMarketPrice(parseFloat(e.target.value))}
                                  labelWidth={0}
                                  endAdornment={
                                      <InputAdornment position="end">
                                          <div onClick={() => setFutureMarketPrice(marketPrice)} className="stake-card-action-input-btn">
                                              <p>Current</p>
                                          </div>
                                      </InputAdornment>
                                  }
                              />
                          </div>
                      </Grid>
                  </Grid>
                </div>
                <div className="calculator-days-slider-wrap">
                  <p className="calculator-days-slider-wrap-title">{`${days} day${days > 1 ? "s" : ""}`}</p>
                  <Slider className="calculator-days-slider" min={1} max={365} value={days} onChange={(e, newValue: any) => setDays(newValue)} />
                </div>
                <div className="calculator-user-data">
                  <div className="data-row">
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${initialInvestment.toFixed(2)}</>}</p>
                    <p className="data-row-name">Your initial investment</p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${calcCurrentWealth().toFixed(2)}</>}</p>
                    <p className="data-row-name">Current Balance</p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{rewardsEstimation.toFixed(2)} KAMI</>}</p>
                    <p className="data-row-name">KAMI rewards estimation</p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>${potentialReturn.toFixed(2)}</>}</p>
                    <p className="data-row-name">Potential return</p>
                  </div>
                  <div className="data-row">
                    <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{Math.floor(Number(potentialReturn) / 10000)}</>}</p>
                    <p className="data-row-name">Potential number of Thai Trips</p>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </Zoom>
    </div>
  );
}

export default Calculator;
