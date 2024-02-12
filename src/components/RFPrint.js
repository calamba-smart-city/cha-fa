import React from 'react';
import LogoCalamba from '../assets/seal.png'
import LogoCha from '../assets/logo.png'
import { Header, Image } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { inWords } from '../utils/towords';

export const RFPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        ADDRESS_BRGY,
        TID,
        OUTPUT_HOSPITAL_NAME,
        OUTPUT_REFERRAL_AMOUNT,
        OUTPUT_REFERRAL_DOH_CODE,
        OTHER_DATE,
        OTHER_REMARKS,
        BDAY_AGE
    } = printData

    const formWhole = {"width":"816px","height":"1056px","border":"1px solid gray","fontFamily":"Lato"}
    const formSheet = {"width":"816px","height":"528px","position":"relative","border":"1px solid gray"}
    const logoCalamba = {"width":"5.5rem","position":"absolute","margin":"0rem 2rem"}
    const logoCha = {"width":"5.5rem","position":"absolute","margin":"0rem 2rem", "right":"0"}
    const body = {"marginTop": "1rem", "textAlign":"justify","padding": "0rem","margin":"3rem", "borderRadius": "0.5rem"}
    const head = {"marginTop": "1rem", "marginBottom": '2rem'}
    const r = {"textAlign":"center"}
    const equateOne = {"textAlign":"left","margin":"0rem 2rem","fontSize":"12px"}
    const fieldRow = {"marginTop":"0.5rem", "textAlign":"left"}
    const fieldRowR = {"marginTop":"0.5rem", "textAlign":"right"}
    const fieldA = {"fontSize":"15px","fontWeight":"bolder"}
    const fieldRow1 = {"paddingTop":"0.5rem", "textAlign":"justify"}
    const titleHead = {"fontWeight":"bolder","fontSize":"15px", "textAlign": 'center'}
    const tableStyle = {"border":"1px solid black", "width": "100%", borderCollapse: 'collapse'}
    const trStyle = {"border":"1px solid black", "padding": '0.3rem'}

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
            <div className="body" style={body}>
                <div className="equate-one" style={equateOne}>
                <div className="field-row" style={fieldRow}>
                        <div className="field-a" style={titleHead}>Republic of the Philippines</div>
                        <div className="field-a" style={titleHead}>Department of Health</div>
                    </div>
                    <div className="field-row" style={fieldRowR}>
                    <br/>
                        <div className="field-a" style={fieldA}>{formatDate(OTHER_DATE)}</div>
                        {/* <div className="field-q">Date of Issuance</div> */}
                    </div>
                    <div className="letter-proper" style={{textAlign:'left', fontSize:'15px', marginTop: '1rem'}}>
                        <div className="field-q" style={fieldRow1} >
                        
                        Respectfully referred to <u><b>{`${OUTPUT_HOSPITAL_NAME}`}</b></u> <br/>the herein attached approved request of <u><b>{`  ${NAME_LAST}, ${NAME_FIRST} ${NAME_MIDDLE}`}{`, ${BDAY_AGE} y/o`}</b></u>
                        {`${` from `}`}
                        <u><b>{`${ADDRESS_BRGY} Calamba City Laguna`} </b></u>
                        {`${`, for the medical assistance below:`}`}
                        <br/><br/>
                        {/* amounting to
                        {
                            OUTPUT_REFERRAL_AMOUNT ? (
                                <>
                                {` `}
                                    <b>{`Php ${OUTPUT_REFERRAL_AMOUNT}`}</b>&ensp;
                                    <u><b>{`( ${inWords(OUTPUT_REFERRAL_AMOUNT)} pesos )`}</b></u>
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
                        } */}
                        {/* <br/><br/>with Referral Form Code <u><b>{`${TID}`}</b></u> and DOH Code: <u><b>{`${OUTPUT_REFERRAL_DOH_CODE}`}</b></u> */}
                        <div className="field-row" style={fieldRowR}>{`${OUTPUT_REFERRAL_DOH_CODE}`}</div>
                        {
                            OUTPUT_REFERRAL_AMOUNT ? (
                            <table style={tableStyle}>
                                <tr style={trStyle}>
                                    <td style={trStyle}>Type of Assistance:</td>
                                    <td style={trStyle}>{`${OTHER_REMARKS}`}</td>
                                </tr>
                                <tr style={trStyle}>
                                    <td style={trStyle}>Approved Amount:</td>
                                    <td style={trStyle}>{`Php ${OUTPUT_REFERRAL_AMOUNT}`}</td>
                                </tr>
                                <tr style={trStyle}>
                                    <td style={trStyle}>Amount in Words:</td>
                                    <td style={trStyle}>{`${inWords(OUTPUT_REFERRAL_AMOUNT)} pesos`}</td>
                                </tr>
                            </table>
                            ) : (<></>)
                        }
                        </div>
                    </div>
                    <div className="field-row" style={fieldRow}>
                        <br/><br/>
                        <div className="field-q">Note: <i>Valid with attached Social Case Study and photocopy of ID.</i></div>
                        <div className="field-q"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Validity is one (1) month from the date of the issuance.</i></div>
                        <div className="field-q"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Non-convertible to cash</i></div>
                        <div className="field-q"><i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`Copy ${copyNum} of Transaction Number: ${TID}`}</i></div>
                    </div>
                </div>
                {/* <div style={{textAlign: "left", marginTop:'5rem', fontSize:"10px", backgroundColor: "#fcd520", padding: '1rem 2rem', borderTop: '1rem solid gray'}}>
                    THIS DOCUMENT IS SYSTEM GENERATED.<br/>
                    <b>Validity is one (1) month from the date of the issuance.</b>
                    <br/>
                    <i>Copy {copyNum}</i>
                </div> */}
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