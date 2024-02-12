import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { PAGES } from './utils/constants';
import { AuthProvider } from './contexts/AuthContext';
import SidebarComponent from './components/SidebarComponent';
import Window from './components/Window';
import Controller from './components/Controller';
import Kiosk from './components/Kiosk';
import IntakeSheet from './components/IntakeSheet';
import Hit from './components/Hit';
import Print from './components/Print';
import Report from './components/Report';
import SocialCase from './components/SocialCase';
import MOA from './components/MOA';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import { Header, Icon, Image } from 'semantic-ui-react';
import Medicine from './components/Medicine';
import LogoStix from './assets/logostix.png'

const App = () => {
  const [ visible, setVisible ] = useState(false)
  
  useEffect(()=>{
    var elem = document.getElementById("root");
    if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
    }
  },[])

  const handleSideBar = () => {
    setVisible(!visible)
  }

  const getHeaderTitle = () => {
    switch(window.location.pathname){
      case PAGES.FRONTDESK: return 'Manage Constituents Information'
      case PAGES.PRINTING: return 'Generate Documents'
      case PAGES.MOA: return 'Manage Accredited Hospitals'
      case PAGES.REPORTS: return 'Manage Reports'
      case PAGES.SOCIAL: return 'Generate Social Case Study'
      case PAGES.LOGS: return 'View Logs'
      case PAGES.MEDS: return 'Medicine Request'
      case PAGES.HIT: return 'Assessment'
      default: return ''
    }
  }

  const renderHeader = () => {
    return (
        <div className="headerfd">
            <Icon name="content" size="large" color="blue" onClick={handleSideBar} className="hamb"></Icon>
            {/* <img src={Logo} className="logo-fd" alt=""></img> */}
            <Header as='h2' className="headertitle">
                {getHeaderTitle()}
            </Header>
            <Image src={LogoStix} style={{paddingRight: '1rem', padding: "1rem 7rem"}} className="logo-stix"></Image>
        </div>
    )
  }

  return (
    <div className="App">

    <Router>
      <AuthProvider>
      <Switch>
        <Route path={PAGES.LOGIN} component={Login} />
        <Route path={PAGES.WINDOW} component={Window} />
        <Route exact path={PAGES.KIOSK} component={Kiosk} />
        <Route exact path={PAGES.CONTROLLER} component={Controller} />
        <Route exact path={PAGES.HIT} component={Hit} />
        
        <SidebarComponent
            visible={visible} 
            handleSideBar={handleSideBar}
        >
          {renderHeader()}
          <PrivateRoute exact path={PAGES.MOA} component={MOA} />
          <PrivateRoute exact path={PAGES.MEDS} component={Medicine} />
          <PrivateRoute exact path={PAGES.FRONTDESK} component={IntakeSheet} />
          <PrivateRoute exact path={PAGES.PRINTING} component={Print} />
          <PrivateRoute exact path={PAGES.REPORTS} component={Report} />
          <PrivateRoute exact path={PAGES.SOCIAL} component={SocialCase} />

        </SidebarComponent>
       
      </Switch>
      </AuthProvider>
    </Router>

    </div>
  );
}

export default App;
