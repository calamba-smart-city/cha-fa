import firebase from '../firebase'
import React, { useEffect, useState } from 'react';
import Notif from '../assets/notif.mp3';
import useSound from 'use-sound';
import Logo from '../assets/logo.png'
import Banner from '../assets/banner.jpeg'
import { Card, Dimmer, Form, Grid, Header, Icon, Image, Loader, Transition, TransitionGroup } from 'semantic-ui-react';
import FormToFill from './FormToFill';
import { useDispatch, useSelector } from 'react-redux';
import appSlice, { getApp } from '../store/slice/app.slice';
import EDU from '../assets/cha1.png';
import HEA from '../assets/cha2.png';
import BUR from '../assets/cha3.png'; 
import SOL from '../assets/cha4.png';
import COC from '../assets/cha5.png';
import { getDateTimeNow } from '../utils/constants';

const Kiosk = () => {
    const dispatch = useDispatch();
    const { data } = useSelector(getApp)
    const [queueNum, setQueueNum] = useState(0)
    const [visible, setvisible] = useState(true)
    const [formVisible, setFormVisible] = useState(true)
    const [assistance, setAssistance] = useState({})
    const [load, setLoad] = useState(false)
    const [isMed, setIsMed] = useState(false)

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

    const getPrefix = (code) => {
        const prefix = code === 'A' ? 'EDU' : 
        code === 'B' ? (isMed ? 'MED' : 'HLT') :
        code === 'C' ? 'BUR' :
        code === 'D' ? 'SOL' :
        code === 'E' ? 'CRC' : ''

        return prefix
    }

    const handleSubmit = async() => {
        setLoad(true)
        const db = await firebase.firestore();
        var kiosk = db.collection("kiosk");
        var applicationLogs = db.collection("application-logs");

        // READ APPLICATION
        var application = kiosk.doc('_APPLICATION').get().then((fields) => {
            return fields.data().CURRENT
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        // READ QUEUE
        var queue = kiosk.doc('_QUEUE').get().then((fields) => {
            return fields.data().CURRENT
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        Promise.all([application, queue]).then((values) => {
            let TID = (`${getPrefix(assistance.code)}${values[0]}`)
            let QID = values[1]

            kiosk.doc("QUEUE").set({
                [QID]: TID
            },{ merge: true })

            kiosk.doc("_QUEUE").set({
                CURRENT: QID + 1
            })

            kiosk.doc("_APPLICATION").set({
                CURRENT: values[0] + 1
            })

            dispatch(appSlice.actions.setData({
                ...data,
                DATE: getDateTimeNow().d,
                TIME: getDateTimeNow().t,
                QID: QID
            }))

            applicationLogs.doc(TID).set({
                ...data,
                DATE: getDateTimeNow().d,
                TIME: getDateTimeNow().t,
                TID: TID,
                QID: QID,
                STATUS: 'FOR UPDATING'
            })

            setTimeout(()=>{
                print(TID, QID, getDateTimeNow().d, getDateTimeNow().t)
            },3000)     
        });
    }

    const print = (tid, qid, d, t) => {
        var link = `${`my.bluetoothprint.scheme://`}${`https://cong-cha.000webhostapp.com?`}${`A=`}${qid}${`&B=`}${tid}${`&C=`}${data.ASSISTANCE.code}${`&D=`}${data.NAME_LAST}${`&E=`}${data.NAME_FIRST}${`&F=`}${data.NAME_MIDDLE}${`&G=`}${data.BDAY_AGE}${`&H=`}${data.CONTACT_NO}${`&I=`}${data.ADDRESS_BRGY}${`&J=`}${d}${`&K=`}${t}`
        window.location.href = link

        setTimeout(()=>{
            window.location.reload();
        },8000)
    }

    const handleStart = () => {
        setvisible(false)
    }

    const handleTick = () => {
        setIsMed(!isMed)
    }

    const handleBack = () => {
        setvisible(false)
        setFormVisible(true)
    }

    const renderFlashScreen = () => {
        return (
            <div className="flash-screen" onClick={handleStart}>
                <Transition.Group animation={'scale'} duration={1300}>
                { visible && (
                    <Image src={Logo} className="fs-logo"/>
                )}
                </Transition.Group>
            </div>
        )
    }

    const handleCardChoice = (selected) => {
        setAssistance(selected)
        dispatch(appSlice.actions.setData({
            ...data,
            ASSISTANCE: selected
        }))
        setFormVisible(false)
    }

    const renderCard = (arr) => {
        const jsx = arr.map((a,r)=>{
            return (
                <Grid.Row key={r}>
                    <Image src={a.img} wrapped ui={false} onClick={() => handleCardChoice(a)}/>
                </Grid.Row>
            )
        })

        return jsx
    }

    const renderChoices = () => {
        return (
            <>
            <div className="list-of-choices">
                <Grid columns="equal" className="grid-equal">
                        {
                            renderCard([
                                {
                                    name: 'EDUCATION',
                                    code: 'A',
                                    img: EDU
                                },
                                {
                                    name: 'HEALTH',
                                    code: 'B',
                                    img: HEA
                                },
                                {
                                    name: 'BURIAL',
                                    code: 'C',
                                    img: BUR
                                },
                                {
                                    name: 'SOLICITATION',
                                    code: 'D',
                                    img: SOL
                                },
                                {
                                    name: 'COURTESY CALL',
                                    code: 'E',
                                    img: COC
                                }
                            ])
                        }
                </Grid>
            </div>
            </>
        )
    }

    const renderChoicesForm = () => {
        return (
            <Transition.Group animation={'fade'} duration={1300}>
                { !visible && <img src={Banner} className="banner-img"/> }
                { !visible && formVisible && (
                    <div className="choices" onClick={handleStart}>
                        {renderChoices()}
                    </div>
                )}
            </Transition.Group>
        )
    }

    const renderFormToFill = () => {
        return (
            <>
            <Header as='h2'>
                <Header.Content>
                    Applying For
                </Header.Content>
                <Header.Subheader style={{ marginTop: '1rem'}}>
                <Icon name="chevron circle left" onClick={handleBack}/> 
                    {data.ASSISTANCE.name}
                </Header.Subheader>
            </Header>
            
            <FormToFill
                handleSubmit={handleSubmit}
                code={data.ASSISTANCE.code}
                isMed={isMed}
                handleTick={handleTick}/>
            </>
        )
    }

    const renderForm = () => {
        return (
            <Transition.Group animation={'fade'} duration={1300}>
                { !visible && !formVisible && (
                    <div className="form-to-fill">
                        {renderFormToFill()}
                    </div>
                )}
            </Transition.Group>
        )
    }

    const renderLoader = () => {
        return load && (
            <Dimmer active>
            <Loader />
            </Dimmer>
        )
    }

    return (
        <div className="kiosk" id="kioski">
            {renderChoicesForm()}
            {renderFlashScreen()}
            {renderForm()}
            {renderLoader()}
        </div>
    )
}

export default Kiosk