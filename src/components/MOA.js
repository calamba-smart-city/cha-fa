import firebase from '../firebase'
import React, { useEffect, useState } from 'react';
import { Button, Dimmer, Divider, Form, Loader } from 'semantic-ui-react';

const MOA = () => {
    const [hospitals, setHospitals] = useState([])
    const [toAdd, setToAdd] = useState({
        HNAME: '',
        HCOUNT: '',
        HCODE: ''
    })
    const [load, setLoad] = useState(false)

    useEffect(()=>{
        getHospitalData()
    },[])

    const removeHospital = async(k) => {
        setLoad(true)

        const db = await firebase.firestore();
        var hospitals = db.collection("hospitals");        

        hospitals.doc(k).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        setTimeout(()=>{
            window.location.reload()
        },1000)
    }

    const getHospitalData = async() => {
        const arr = []
        await firebase.firestore().collection('hospitals').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                arr.push({
                    key: doc.id,
                    name: doc.data().HOSPITAL_NAME,
                    code: doc.data().HOSPITAL_CODE,
                    count: doc.data().HOSPITAL_COUNT
                })
            });
        });
        setHospitals(arr)
    }

    const renderHospitals = () => {
        return (
            <div className="hospitals">
                <Form>
                {
                    hospitals.map((h,k)=>{
                        return <>
                        <Form.Group widths='equal' key={k}>
                          <Form.Input
                            fluid
                            id={`HN-${k}`}
                            label='Hospital Name'
                            placeholder='Hospital Name'
                            value={h.name}
                            readOnly={true}
                          />
                          <Form.Input
                            fluid
                            id={`HC-${k}`}
                            label='Hospital Code'
                            placeholder='Hospital Code'
                            value={h.code}
                            readOnly={true}
                          />
                          <Form.Input
                            fluid
                            id={`HC-${k}`}
                            label='Hospital Count'
                            placeholder='Hospital Count'
                            value={h.count}
                            readOnly={true}
                          />
                           <Button circular icon='remove' compact style={{height:"2rem"}} negative onClick={() => removeHospital(h.key)}/>
                        </Form.Group>
                        </>
                    })
                }
                </Form>
            </div>
        )
    }

    const handleSubmitMOA = async() => {
        setLoad(true)

        const db = await firebase.firestore();
        var hospitals = db.collection("hospitals");        

        hospitals.doc(toAdd.HCODE).set({
            HOSPITAL_NAME: toAdd.HNAME,
            HOSPITAL_CODE: toAdd.HCODE,
            HOSPITAL_COUNT: toAdd.HCOUNT
        })

        setTimeout(()=>{
            window.location.reload()
        },1000)
    }

    const handleFormChange = (e) => {
        const { value, name } = e.target
        
        setToAdd({
          ...toAdd,
          [name]: value
        })
    }

    const renderAddHospital = () => {
        return (
            <div className="add-form">
            <Form size={'huge'}>
            <Form.Group widths='equal'>
              <Form.Field
                label='Hospital Name'
                control='input'
                placeholder='Hospital Name'
                onChange={handleFormChange}
                name={"HNAME"}
                value={toAdd.HNAME}
              />
              <Form.Field
                label='Hospital Code'
                control='input'
                placeholder='Hospital Code'
                onChange={handleFormChange}
                name={"HCODE"}
                value={toAdd.HCODE}
              />
             <Form.Field
                label='Hospital Count'
                control='input'
                placeholder='Hospital Count'
                onChange={handleFormChange}
                name={"HCOUNT"}
                value={toAdd.HCOUNT}
              />
            </Form.Group>
            <Button type='submit' positive onClick={handleSubmitMOA}>Add</Button>
            <Divider hidden />
            </Form>
            </div>
        )
    }

    const renderLoader = () => {
        return load && (
            <Dimmer active={load}>
            <Loader active/>
            </Dimmer>
        )
    }

    return (
        <div className="moa">
            {renderLoader()}
            {renderAddHospital()}
            {renderHospitals()}
        </div>
    )
}

export default MOA