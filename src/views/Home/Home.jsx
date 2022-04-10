import "./home.scss";
import Bg from '../../assets/ohm/bg.png'
import img1_1 from '../../assets/ohm/1-1.png';
import CaiDan from '../../assets/ohm/tuozhuaicaidandaohang.png'
import medium from '../../assets/ohm/med@2x.png';
import Logo from '../../assets/logo-white.png' 


function Home() { 

  return <div>

    <div className="headBox">
    <div className="logoText"><img src={Logo} alt="" className="logo" /></div>
      
    </div> 
    <div className="boodyBox fxColumn">
       <div className="titleColor">
        KAMI is a decentralized reserve currency
      </div>
      <div className="titleColor">
        with Autostaking and Autorebasing feature.
      </div>
      <div style={{ height: 30 }}></div>

      <div className="contentStyle">
      KAMI is designed to appreciate wealth & help you pay less for more.
              Your token accumulation increases as you preserve KAMI. 
              No matter the fluctuation in the market,
              the value of your holding keeps increasing.      </div>
      <div className="fxBetween"> 
         <a href="/dashboard" className="btnBox_1">Open Dapp</a>
       </div> 
 
    </div> 

  </div>
}

export default Home;
 