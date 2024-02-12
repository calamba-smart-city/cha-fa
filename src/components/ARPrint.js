import React from 'react';
import LogoCalamba from '../assets/seal.png'
import LogoCha from '../assets/logo.png'
import { Header, Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { inWords } from '../utils/towords';

export const ARPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        TID,
        OUTPUT_CASH,
        OTHER_DATE
    } = printData

    const formWhole = {"width":"816px","height":"1056px","border":"1px solid gray","fontFamily":"Lato"}
    const formSheet = {"width":"816px","height":"528px","position":"relative","border":"1px solid gray"}
    const logoCalamba = {"width":"5.5rem","position":"absolute","margin":"0rem 2rem"}
    const logoCha = {"width":"5.5rem","position":"absolute","margin":"0rem 2rem", "right":"0"}
    const body = {"marginTop": "2rem", "textAlign":"justify"}
    const head = {"marginTop": "1rem", "marginBottom": '2rem'}
    const r = {"textAlign":"center"}
    const equateOne = {"textAlign":"left","margin":"0rem 2rem","fontSize":"12px"}
    const fieldRow = {"marginTop":"0.5rem", "textAlign":"left"}
    const fieldA = {"fontSize":"15px","fontWeight":"bolder"}
    const fieldRow1 = {"paddingTop":"0.5rem", "textAlign":"center"}
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
                <Image src={LogoCalamba} className="logo-calamba" style={logoCalamba}></Image>
                <Header as="h4" className="r" style={r}>
                    <Header.Subheader>
                        REPUBLIC OF THE PHILIPPINES <br/>
                        PROVINCE OF LAGUNA
                    </Header.Subheader>
                    DISTRICT OFFICE OF CALAMBA
                </Header>
            </div>
            <div className="body" style={body}>
                <div className="equate-one" style={equateOne}>
                <div className="field-row" style={fieldRow}>
                        <div className="field-a" style={titleHead}>ACKNOWLEDGEMENT</div>
                    </div>
                    <div className="field-row" style={fieldRow}>
                        <div className="field-a" style={fieldA}>{formatDate(OTHER_DATE)}</div>
                        <div className="field-q">Date of Issuance</div>
                    </div>
                    <br/>
                    <div className="letter-proper" style={{textAlign:'center', fontSize:'18.5px', marginTop: '1rem'}}>
                        <div className="field-q" style={fieldRow1} >
                        
                        I, <u><b>{`  ${NAME_LAST}, ${NAME_FIRST} ${NAME_MIDDLE}`} </b></u> hereby acknowledge that I have received<br/><br/> the amount of 
                        {
                            OUTPUT_CASH ? (
                                <>
                                {` `}
                                    <b>{`Php ${OUTPUT_CASH}`}</b>&ensp;
                                    <u><b>{`(${inWords(OUTPUT_CASH)} pesos)`}</b></u>
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
                        <br/><br/>
                        as financial assistance extended by the office the Lone District of Calamba. 
                        <br/><br/>with Referral Form Code <b>{`${TID}`}</b>
                        </div>
                    </div>
                </div>
                <div style={{textAlign: "left", marginTop:'6.5rem', fontSize:"10px", backgroundColor: "#fcd520", padding: '1rem 2rem', borderTop: '1rem solid gray'}}>
                    THIS DOCUMENT IS SYSTEM GENERATED.<br/>
                    <i>Copy {copyNum}</i>
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