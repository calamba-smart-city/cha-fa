import firebase from '../firebase'
import React, { useEffect, useState } from 'react';
import Notif from '../assets/notif.mp3';
import useSound from 'use-sound';
import Banner from '../assets/banner.jpeg'
import Logo from '../assets/logo.png'
import { Header, Label } from 'semantic-ui-react';

const Window = () => {
    const [queue, setQueue] = useState([]);
    const [window1, setWindow1] = useState('');
    const [window2, setWindow2] = useState('');
    const [window3, setWindow3] = useState('');

    const [play] = useSound(
        Notif,
        { volume: 0.25 }
    );

    useEffect(()=>{
        play();
    },[window1,window2,window3])

    useEffect(async() => {
        const db = await firebase.firestore();
        db.collection("kiosk").doc('QUEUE').onSnapshot(snapshot => {
            const data = []
            const obj = snapshot.data()
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

    const renderQueueList = () => {
        const jsx = queue.map((q,i) => {
            return (
                <div className="list" key={i}>
                    <Header as='h1' className="text">
                        {q.queueNum}
                        <Header.Subheader>{q.tid}</Header.Subheader>
                    </Header>
                </div>
            )
        })

        return jsx
    }

    return (
        <div className="window1">
            <div className="upper">
                <div className="up-next">
                    
                    <div className="logo-header">
                    <div className="logo-up-next">
                            <p className="y">UP NEXT</p>
                            <p className="h">{queue.length !== 0 && queue[0].queueNum}</p>
                            <p className="t">{queue.length !== 0 && queue[0].tid}</p>
                        </div>
                        <div className="logo-logo">
                            <img src={Logo} className="logo-next"></img>
                        </div>

                    </div>

                    <div className="windows">
                        <div className="window one">
                            <div className="header">DESK 1</div>
                            <div className="content">
                                {window1 === 0 ? '-' : window1}
                            </div>
                        </div>
                        <div className="window two">
                            <div className="header">DESK 2</div>
                            <div className="content">
                                {window2 === 0 ? '-' : window2}
                            </div>
                        </div>
                        <div className="window three">
                            <div className="header">DESK 3</div>
                            <div className="content">
                                {window3 === 0 ? '-' : window3}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="numbers">
                    <div className="queue-list">
                        {renderQueueList()}
                    </div>
                </div>
            </div>
            <div className="logo">
                <img src={Banner} className="banner"></img>
                <img src={Banner} className="banner"></img>
            </div>
            <div className="video">
            <iframe width="950" height="420" src="https://www.youtube.com/embed/7BmopgJvLqg?playlist=7BmopgJvLqg&loop=1&controls=0&autoplay=1&mute=1" style={{border:'none'}}></iframe>
            </div>
        </div>
    )
}

export default Window