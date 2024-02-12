import firebase from '../firebase'
import React, { useEffect, useState } from 'react';
import { Button, Dimmer, Divider, Form, Loader } from 'semantic-ui-react';

const Medicine = () => {
    const [medicines, setMedicines] = useState([])
    const [toAdd, setToAdd] = useState({
        HNAME: ''
    })
    const [load, setLoad] = useState(false)

    useEffect(()=>{
        getMedicineData()
    },[])

    const removeHospital = async(k) => {
        setLoad(true)

        const db = await firebase.firestore();
        var hospitals = db.collection("medicines");        

        hospitals.doc(k).delete().then(() => {
            console.log("Document successfully deleted!");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });

        setTimeout(()=>{
            window.location.reload()
        },1000)
    }

    const getMedicineData = async() => {
        const arr = []
        await firebase.firestore().collection('medicines').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                arr.push({
                    key: doc.id,
                    text: doc.data().MEDICINE_NAME,
                    value: doc.data().MEDICINE_NAME
                })
            });
        });
        setMedicines(arr)
    }

    const renderMedicines = () => {
        return (
            <div className="list-medicine">
                <Form>
                {
                    medicines.map((h,k)=>{
                        return <>
                        <Form.Group widths='equal' key={k}>
                          <Form.Input
                            fluid
                            id={`HN-${k}`}
                            label='Medicine Name'
                            placeholder='Medicine Name'
                            value={h.value}
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
        var med = db.collection("medicines");        

        med.doc().set({
            MEDICINE_NAME: toAdd.HNAME
        })

        setTimeout(()=>{
            window.location.reload()
        },1000)
    }

    const handleFormChange = (e) => {
        const { value, name } = e.target

        setToAdd({HNAME: value.toUpperCase()})
    }

    const renderAddMedicine = () => {
        return (
            <div className="add-form">
            <Form size={'huge'}>
            <Form.Group widths='equal'>
              <Form.Field
                label='Medicine Name'
                control='input'
                placeholder='Medicine Name'
                onChange={handleFormChange}
                name={"HNAME"}
                value={toAdd.HNAME}
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
        <div className="meds">
            {renderLoader()}
            {renderAddMedicine()}
            {renderMedicines()}
        </div>
    )
}

export default Medicine