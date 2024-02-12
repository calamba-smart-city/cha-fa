import firebase from '../firebase'
import React, { useEffect, useRef, useState } from 'react';
import { Button, Segment, Input } from 'semantic-ui-react';
import { getDateTimeNow } from '../utils/constants'
import ReactToPrint from 'react-to-print';
import { useDispatch } from 'react-redux';
import appSlice from '../store/slice/app.slice';
import { SCPrint } from './SCPrint';
import { SC2Print } from './SC2Print';
import { useReactToPrint } from 'react-to-print';

const SocialCase = () => {
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
    const componentRefSocialCase = useRef();
    const componentRefSocialCase2 = useRef();
    const dispatch = useDispatch();

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
        return(
            <div style={{ display: 'flex' }}>
            <SCPrint ref={componentRefSocialCase} />
            <SC2Print ref={componentRefSocialCase2} />
            </div>
        )
    } 

    const pstyle = `
        @media all {
            #page-break {
                display: none;
            }
        }
        
        @media print {
            html, body { 
                height: initial !important;
                overflow: initial !important;
                margin: 0;
            }

            @page{
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }
        }
        
        @media print {
            .page-break {
                clear: both;
                break-after: page !important;
            }
        }`
    
    const handlePrint = useReactToPrint({
        pageStyle: pstyle,
        content: () => componentRefSocialCase.current
    });

    const handlePrint2 = useReactToPrint({
        pageStyle: pstyle,
        content: () => componentRefSocialCase2.current
    });

    return (
        <div className="social-case"> 
            {renderInput()}
            <Button primary size="massive" onClick={handlePrint}>Print First Page</Button>
            <Button primary size="massive" onClick={handlePrint2}>Print Second Page</Button>
            {validateTid() && renderPrint()}      
        </div>
    )
}

export default SocialCase