import React from 'react';
import LogoSeal from '../assets/seal.png'
import LogoCalamba from '../assets/logo-calamba.jpeg'
import BannerPondo from '../assets/banner-pondo.png'
import Footer from '../assets/congfooter.png'
import LogoCha from '../assets/logo.png'
import { Header, Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { inWords } from '../utils/towords';

export const LRFPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        TID,
        ADDRESS_BRGY,
        LAB_HOS_NAME,
        LAB_HOS_CODE,
        LAB_HOS_REF_CODE,
        LAB_HOS_AMOUNT,
        OTHER_DATE
    } = printData

    const formWhole = {"width":"816px","height":"1056px","border":"1px solid gray","fontFamily":"Lato"}
    const formSheet = {"width":"816px","height":"528px","position":"relative","border":"1px solid gray"}
    const logoCha = {"width":"7rem","position":"absolute","margin":"-1rem 2rem", "right":"0"}

    const logoSeal = {"width":"2.5rem","position":"absolute","margin":"0rem 2rem", "left":"3rem"}
    const logoCalamba = {"width":"2.5rem","position":"absolute","margin":"0rem 2rem"}

    const bannerPondo = {"width":"11rem","position":"absolute","margin":"0rem 2rem", "left":"6rem"}
    const footerPondo = {"width":"auto","position":"absolute","bottom":"0"}
    
    const body = {"marginTop": "2rem", "textAlign":"justify"}
    const head = {"marginTop": "2rem", "marginBottom": '2rem'}
    const r = {"textAlign":"center"}
    const equateOne = {"textAlign":"left","margin":"0rem 2rem","fontSize":"12px"}
    const fieldRow = {"marginTop":"0.5rem", "textAlign":"left"}
    const fieldRowDate = {"marginTop":"3rem", "textAlign":"left", "marginBottom":"4rem"}
    const fieldA = {"fontSize":"15px","fontWeight":"bolder", "fontSize": "20px"}
    const fieldRow1 = {"textAlign":"left", "lineHeight": '1.8rem'}
    const titleHead = {"fontWeight":"bolder","fontSize":"30px", "textAlign": 'center'}

    const formatDate = (d) => {
        // For dates that have time
        if(d && d.length >= 10){
            return d
        }else{
            return d ? d.substring(0, d.indexOf(' ')) : ''
        }
    }

    const renderRFForm = (copyNum) =>{
        return (
            <div className="form-sheet" style={formSheet}>
            <div className="head" style={head}>
                <Image src={LogoCha} className="logo-calamba" style={logoCha}></Image>
                {/* <Image src={LogoCalamba} className="logo-calamba" style={logoCalamba}></Image> */}
                {/* <Image src={LogoSeal} className="logo-calamba" style={logoSeal}></Image> */}
                {/* <Image src={BannerPondo} className="banner-pondo" style={bannerPondo}></Image> */}
            </div>
            <div className="body" style={body}>
                <div className="equate-one" style={equateOne}>
                    <div className="field-row" style={fieldRowDate}>
                        <div className="field-a" style={fieldA}>{formatDate(OTHER_DATE)}</div>
                        <div className="field-q">Date of Issuance</div>
                    </div>
                    <div className="letter-proper" style={{textAlignLast:'justify', fontSize:'15px', marginTop: '1rem'}}>
                        <div className="field-q" style={fieldRow1} >
                        
                        Relative to the provisions of the Memorandum of Agreement between the
                        <br/>
                        Office of the Lone District of Calamba and <b><u>{LAB_HOS_NAME}</u></b>,
                        <br/>
                        respectully forwarding the approved request of <b><u>{`${NAME_LAST}, ${NAME_FIRST} ${NAME_MIDDLE}`}</u></b>
                        <br/>
                        from <b><u>{`${ADDRESS_BRGY} CALAMBA CITY`}</u></b> to avail the free laboratory assistance of 
                        <br/>
                        amounting to
                        {
                            LAB_HOS_AMOUNT ? (
                                <>
                                {` `}
                                    <b><u>{`Php ${LAB_HOS_AMOUNT}`}</u></b>&ensp;
                                    <u><b>{`(${inWords(LAB_HOS_AMOUNT)} pesos)`}</b></u>
                                    {` `}
                                </>
                            ) : (
                                <>
                                    {` `}
                                    <u><b>{`Php _____________`}</b></u>&ensp;
                                    <u><b>{`, __________________________________________________________ pesos `}</b></u>
                                    {` `}
                                </>
                            )
                        }
                        with the referral code number <b><u>{`${LAB_HOS_REF_CODE ? `${LAB_HOS_CODE}${LAB_HOS_REF_CODE}` : 'XXX-XXXXXX'}.`}</u></b>
                        </div>
                    </div>             
                </div>
                <Image src={Footer} className="footer-rf" style={footerPondo}></Image>
                <div style={{display: 'flex'}}>
                    
                    <div style={{fontSize: '10px', lineHeight: '15px', paddingLeft: '3rem',  textAlign: 'left'}}>
                    <br/><br/>
                    <i>By the authority of</i>
                    <br/><br/><br/>
                    ____________________________________________________________________________
                    <br/>
                    <div style={{textAlign: 'center'}}>
                    <b style={{marginTop: '1rem', fontSize: '12px'}}>
                    HON. CHARISSE ANNE HERNANDEZ
                    </b><br/>
                    <i>Lone District of the City of Calamba<br/>REPRESENTATIVE</i>
                    </div>

                    </div>

                    <div style={{textAlign: 'right', fontSize: '8px', lineHeight: '0.8rem', marginTop:'14rem', marginLeft: 'auto', paddingRight: '2rem', zIndex: '999'}}>
                    {TID}<br/>
                    THIS DOCUMENT IS SYSTEM GENERATED.<br/>
                    <i>Copy {copyNum}</i>
                    </div>
                    

                </div>

            </div> 
        </div>
        )
    }

    return (
        <div style={formWhole} id="intshtz" ref={ref} >
            {renderRFForm(1)}
            {renderRFForm(2)}
        </div>
    );
  });