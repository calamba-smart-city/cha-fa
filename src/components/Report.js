import firebase from '../firebase'
import React, { useEffect, useRef, useState } from 'react';
import { Button, Segment, Table } from 'semantic-ui-react';
import { getDateTimeNow } from '../utils/constants'
import ReactToPrint from 'react-to-print';
import { useDispatch } from 'react-redux';
import appSlice from '../store/slice/app.slice';

const Report = () => {
    const [printingQueue, setPrintingQueue] = useState([]);


    // useEffect(() => {
    //     fetchData()
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async() => {
        const db = await firebase.firestore();
        db.collection("application-logs").where("LAST_NAME","=","HERNANDEZ")
        
    }

    return (
        <div className="report"> 
            {/* {
                printingQueue.length !== 0 ? 
                renderTable() : 
                renderNothingToPrint()
            } */}
        </div>
    )
}

export default Report