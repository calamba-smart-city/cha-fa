import firebase from '../firebase';
import React, { useEffect, useState } from 'react';
import Notif from '../assets/notif.mp3';
import useSound from 'use-sound';
import { Button, Header, Icon, Image, Item, Label, Modal } from 'semantic-ui-react';
import Logo from '../assets/logo.png';

const Controller = () => {
    const [queue, setQueue] = useState([]);
    const [object, setObject] = useState();
    const [modalSettingsOpen, setModalSettingsOpen] = useState(false);
    const [window1, setWindow1] = useState('');
    const [window2, setWindow2] = useState('');
    const [window3, setWindow3] = useState('');

    useEffect(async() => {
        const db = await firebase.firestore();
        db.collection("kiosk").doc('QUEUE').onSnapshot(snapshot => {
            const data = []
            const obj = snapshot.data()
            setObject(obj)
            
            Object.keys(obj).map((keyName) => {
                data.push({
                    queueNum: keyName,
                    tid: obj[keyName]
                })
            })
            
            setQueue(data)
        })

        db.collection("kiosk").doc('WINDOW1').onSnapshot(snapshot => {
            setWindow1(snapshot.data().CURRENT)
        })

        db.collection("kiosk").doc('WINDOW2').onSnapshot(snapshot => {
            setWindow2(snapshot.data().CURRENT)
        })

        db.collection("kiosk").doc('WINDOW3').onSnapshot(snapshot => {
            setWindow3(snapshot.data().CURRENT)
        })
    }, []);

    const handleBreak = async(window) => {
        const db = await firebase.firestore();

        db.collection("kiosk").doc(`WINDOW${window}`).set({
            CURRENT: parseInt(0)
        })
    }

    const handleNext = async(window) => {
        const db = await firebase.firestore();

        // POP QUEUE
        const latest = queue[0].queueNum
        const latestTid = queue[0].tid

        console.log(queue)

        queue.shift()
        const parsedObj = parseToObject()
        console.log(parsedObj)
        db.collection("kiosk").doc("QUEUE").set(parsedObj)

        // ADD TO CORRESPONDING WINDOW

        db.collection("kiosk").doc(`WINDOW${window}`).set({
            CURRENT: parseInt(latest),
            TID: latestTid
        })
    }

    const parseToObject = () => {
        let obj = {}
        queue.map((q) => {
            obj = {
                ...obj,
                [q.queueNum]: q.tid
            }
        })

        return obj
    }

    const handleModal = () => {
        setModalSettingsOpen(!modalSettingsOpen)
    }

    const handleReset = async() => {
        const db = await firebase.firestore();

        // Clear Queue
        db.collection("kiosk").doc(`QUEUE`).set({ })

        // Set all windows to 0
        db.collection("kiosk").doc(`WINDOW1`).set({ CURRENT: 0 })
        db.collection("kiosk").doc(`WINDOW2`).set({ CURRENT: 0 })
        db.collection("kiosk").doc(`WINDOW3`).set({ CURRENT: 0 })

        // Reset Queue Reference to 1
        db.collection("kiosk").doc(`_QUEUE`).set({ CURRENT: 1 })
        setModalSettingsOpen(!modalSettingsOpen)
    }

    const renderQueueCurrent = () => {
        return (
            <div className="queue-current">
                <Header as='h2' className="header-current">
                    <Header.Subheader>
                        UP NEXT
                    </Header.Subheader>
                    {queue.length !== 0 ? queue[0].queueNum : '-'}
                    <Header.Subheader>
                        { queue.length !== 0 ? queue[0].tid : '-'}
                    </Header.Subheader>
                </Header>
            </div>
        )
    }

    const renderButtons = () => {
        return (
            <Item.Group divided className="btns">
                <Item>
                    <Item.Content>
                        <Item.Header as='a' className="window-text">Window 1</Item.Header>
                        <Item.Meta>
                            <Header as='h2' className="header-current">
                                {window1 === 0 ? '-' : window1}
                                <Header.Subheader>
                                    Currently Serving
                                </Header.Subheader>
                            </Header>
                        </Item.Meta>
                        <Item.Extra>
                            <Button disabled={queue.length === 0} primary floated='right' size="large" onClick={() => handleNext(1)}>
                                Next
                                <Icon name='right chevron' />
                            </Button>
                            <Button floated='right' size="large" onClick={() => handleBreak(1)}>
                                Break
                            </Button>
                        </Item.Extra>
                    </Item.Content>
                </Item>
                <Item>
                    <Item.Content>
                        <Item.Header as='a' className="window-text">Window 2</Item.Header>
                        <Item.Meta>
                            <Header as='h2' className="header-current">
                                {window2 === 0 ? '-' : window2}
                                <Header.Subheader>
                                    Currently Serving
                                </Header.Subheader>
                            </Header>
                        </Item.Meta>
                        <Item.Extra>
                            <Button disabled={queue.length === 0} primary floated='right' size="large" onClick={() => handleNext(2)}>
                                Next
                                <Icon name='right chevron' />
                            </Button>
                            <Button floated='right' size="large" onClick={() => handleBreak(2)}>
                                Break
                            </Button>
                        </Item.Extra>
                    </Item.Content>
                </Item>
                <Item>
                    <Item.Content>
                        <Item.Header as='a' className="window-text">Window 3</Item.Header>
                        <Item.Meta>
                            <Header as='h2' className="header-current">
                                {window3 === 0 ? '-' : window3}
                                <Header.Subheader>
                                    Currently Serving
                                </Header.Subheader>
                            </Header>
                        </Item.Meta>
                        <Item.Extra>
                            <Button disabled={queue.length === 0} primary floated='right' size="large" onClick={() => handleNext(3)}>
                                Next
                                <Icon name='right chevron' />
                            </Button>
                            <Button floated='right' size="large" onClick={() => handleBreak(3)}>
                                Break
                            </Button>
                        </Item.Extra>
                    </Item.Content>
                </Item>
            </Item.Group>
        )
    }

    const renderLogo = () => {
        return (
            <div className="logo">
                <Image src={Logo} size='small'/>
            </div>
        )
    }

    const renderSettings = () => {
        return (
            <div className="btn-settings">
            <Button size="large" onClick={handleModal}>
                <Icon name='settings'/>
            </Button>
            </div>
        )
    }

    const renderModal = () => {
        return (
            <Modal
            size={'tiny'}
            open={modalSettingsOpen}
            onClose={handleModal}
            >
                <Modal.Header>MOPAC Queue Controller</Modal.Header>
                <Modal.Content>
                <p>Are you sure you want to reset the queue</p>
                </Modal.Content>
                <Modal.Actions>
                <Button onClick={handleModal}>
                    No
                </Button>
                <Button primary onClick={handleReset}>
                    Yes
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }

    return (
        <div className="controller">
            {renderLogo()}
            {renderQueueCurrent()}
            {renderButtons()}
            {renderSettings()}
            {renderModal()}
        </div>
    )
}

export default Controller