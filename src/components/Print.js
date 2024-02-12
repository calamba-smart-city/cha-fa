import firebase from '../firebase'
import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { RFPrint } from '../components/RFPrint';
import { MBSPrint } from '../components/MBSPrint';
import { WBPrint } from '../components/WBPrint';
import { ARPrint } from './ARPrint';
import { LRFPrint } from './LRFPrint';
import { useDispatch } from 'react-redux';
import appSlice from '../store/slice/app.slice';
import { useReactToPrint } from 'react-to-print';
import { useAuth } from '../contexts/AuthContext';

const Print = () => {
    const def = {
        QID: 0,
        TID: 0,
        ASSISTANCE: {},
        NAME_FIRST: '',
        NAME_MIDDLE: '',
        NAME_LAST: '',
        BDAY_MONTH: '',
        BDAY_DAY: '',
        BDAY_YEAR: '',
        BDAY_AGE: '',
        CONTACT_NO: '',
        ADDRESS_STREET: '',
        ADDRESS_BRGY: '',
        ADDRESS_CITY: 'CALAMBA',
        ADDRESS_PROVINCE: 'LAGUNA',
        OTHER_YRS_STAY: '',
        SERVICE: ''
    }
    const [ notFound, setNotFound ] = useState(false)
    const [ tid, setTID ] = useState('')
    const [ values, setValues ] = useState(def)
    const [ loader, setLoader ] = useState(false)
    const componentRefGL = useRef();
    const componentRefAF = useRef();
    const componentRefMBS = useRef();
    const componentRefWB = useRef();
    const componentLabRefWB = useRef();
    const { currentUser, logout } = useAuth()
    const [ userDetails, setUserDetails ] = useState({
        name: '',
        role: '',
        img: ''
    })
    const [type,setType]=useState()

    const dispatch = useDispatch();

    const handlePrint = useReactToPrint({
        content: () => componentRefGL.current
    });

    const handlePrintAR = useReactToPrint({
        content: () => componentRefAF.current
    });

    const handlePrintMBS = useReactToPrint({
        content: () => componentRefMBS.current
    });

    const handlePrintWB = useReactToPrint({
        content: () => componentRefWB.current
    });

    const handlePrintLab = useReactToPrint({
        content: () => componentLabRefWB.current
    });

    useEffect(()=>{
        document.getElementById("myAnchor").focus();
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(currentUser){
            getUser(currentUser.uid)
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const getUser = async(code) => {
        const db = await firebase.firestore();
        var users = db.collection("users");

        // READ APPLICATION
        var u = users.doc(code).get().then((fields) => {
            return fields.data()
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        Promise.all([u]).then((val) => {
            if(val[0]){
                setUserDetails(val[0])
                return val[0]
            }else{
                setUserDetails({name: '',role: ''})
                return ''
            }
        });
    }

    const handleScan = (e) => {
        const { value } = e.target
        setTID(value.toUpperCase())
        find(value.toUpperCase())
    }

    const find = async(value) => {
        if(value.length === 9){
            setNotFound(false)
            setLoader(true)
            const db = await firebase.firestore();
            var applicationLogs = db.collection("application-logs");

            // READ APPLICATION
            var application = applicationLogs.doc(value).get().then((fields) => {
                return fields.data()
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            Promise.all([application]).then((values) => {
                if(values[0]){
                    setTimeout(()=>{
                        setValues(values[0])
                        setNotFound(false)
                        setLoader(false)
                        setType(getType(values[0]))
                        dispatch(appSlice.actions.setPrintData(values[0]))
                    },500)
                }else{
                    setValues(def)
                    setNotFound(true)
                    setLoader(false)
                }
            });
        }
    }

    const getType = ({ OUTPUT_CASH, TID, LAB_HOS_NAME }) => {
        console.log(OUTPUT_CASH, TID, LAB_HOS_NAME)
        if(TID.substring(0,3) === 'MED'){
            // IF MED
            let txt = ''
            if (window.confirm("Proceed with Medicine Billable Sheet?")) {
                txt = "MBS";
            } else {
                txt = "WB";
            }
            return txt
        }else{
            // IF HLT
            if(OUTPUT_CASH){
                return 'AR'
            }else if(LAB_HOS_NAME !== 'N/A'){
                return 'LF'
            }else{
                return 'RF'
            }
        }
    }

    const renderInput = () => {
        return <Input
            className="inputTID"
            iconPosition='left'
            error={notFound}
            placeholder='Search'
            disabled={values.TID !== 0}
            size='massive'
            value={tid}
            onChange={handleScan}
            id="myAnchor"
            name="TID"
            autoComplete="off"
            maxLength={"11"}
            loading={loader}
        />
    }

    const validateTid = () => {
        return values.TID !== 0 && tid
    }

    const renderPrint = () => {
        switch(type){
            case 'AR': return renderAcknowledgementReceipt()
            case 'RF': return renderReferralForm()
            case 'MBS': return renderMedicineBillableSheet()
            case 'WB': return renderWayBill()
            case 'LF': return renderLabReferralForm()
            default: return <></>
        }
    }

    const renderAcknowledgementReceipt = () => {
        return (
            <div className="ar">
                Endorsed to Acknowledgement Receipt
                <ARPrint ref={componentRefAF}/>
            </div>
        )
    }

    const renderReferralForm = () => {
        return (
            <div className="rf">
                Endorsed to Referral Form
                <RFPrint ref={componentRefGL}/>
            </div>
        )
    }

    const renderMedicineBillableSheet = () => {
        return (
            <div className="mbs">
                Endorsed to Medicine Billable Sheet
                <MBSPrint ref={componentRefMBS}/>
            </div>
        )
    }

    const renderWayBill = () => {
        return (
            <div className="mbs">
                Endorsed to Waybill
                <WBPrint ref={componentRefWB}/>
            </div>
        )
    }

    const renderLabReferralForm = () => {
        return (
            <div className="lrf">
                Endorsed to Laboratory Referral Form
                <LRFPrint ref={componentLabRefWB}/>
            </div>
        )
    }

    const renderPrintButton = () => {
        switch(type){
            case 'AR': return <Button primary size="massive" onClick={handlePrintAR}>Print Acknowledgement Receipt</Button>
            case 'RF': return <Button primary size="massive" onClick={handlePrint}>Print Referral Form</Button>
            case 'MBS': return <Button primary size="massive" onClick={handlePrintMBS}>Print Medicine Billable Sheet</Button>
            case 'WB': return <Button primary size="massive" onClick={handlePrintWB}>Print Waybill</Button>
            case 'LF': return <Button primary size="massive" onClick={handlePrintLab}>Print Laboratory Referral Form</Button>
            default: return <></>
        }
    }

    return (
        <div className="print"> 
            {renderInput()}
            {validateTid() && renderPrintButton()}
            {validateTid() && renderPrint()}         
        </div>
    )
}

export default Print