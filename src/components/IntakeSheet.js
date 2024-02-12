import firebase from '../firebase'
import React, { useEffect, useState, useRef } from 'react';
import { Button, Dimmer, Dropdown, Form, Header, Icon, Input, Loader, Modal, Table, Accordion } from 'semantic-ui-react';
import { months, days, years, brgys, status, getDateTimeNow } from '../utils/constants'
import { useAuth } from "../contexts/AuthContext"

const IntakeSheet = () => {
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
        MEDICINE: []
    }
    const [ data, setData ] = useState(def)
    const [tid, setTID] = useState()
    const [loader, setLoader] = useState(false)
    const [found, setNotFound] = useState(false)
    const [retrieved, setRetrieved] = useState(def)
    const [checkChange, setCheckChange] = useState(true)
    const [saveModal, setSaveModal] = useState(false)
    const [mbsModal, setMbsModal] = useState(false)
    const { currentUser } = useAuth()
    const [ userDetails, setUserDetails ] = useState({
        name: '',
        role: '',
        img: ''
    })
    const [showAddMedicineModal, setShowAddMedicineModal] = useState(false)
    const [setToAdd, setSetToAdd] = useState({
        MEDICINE: '',
        TYPE: ''
    }) 
    const [name, setName] = useState('')
    const [medList, setMedList] = useState([])
    const [deliveryTypes, setDeliveryTypes] = useState([
        {
            key: 0,
            text: 'DOOR TO DOOR',
            value: 'DOOR TO DOOR',
        },
        {
            key: 1,
            text: 'BRGY HALL PICK-UP',
            value: 'BRGY HALL PICK-UP',
        },
        {
            key: 2,
            text: 'PICK-UP',
            value: 'PICK-UP',
        }
    ])
    const [medTypesOptions, setMedTypesOptions] = useState([
        {
            key: 0,
            text: 'BRANDED',
            value: 'BRANDED',
        },
        {
            key: 1,
            text: 'GENERIC',
            value: 'GENERIC',
        }
    ])
    const [optionLoad, setOptionLoad] = useState(false)
    const [hospitals, setHospitals] = useState([])

    // USEFFECTS
    useEffect(()=>{
        document.getElementById("myAnchor").focus();
        getMedicineData()
        getHospitalData()
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        //compare retrieved and changed
        let isSame = JSON.stringify(data) === JSON.stringify(retrieved) 
        setCheckChange(isSame)
        getUser(data.STATUS_USER)
    },[data]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(()=>{
        if(data.BDAY_YEAR){
            setData({
                ...data,
                BDAY_AGE: 2024 - parseInt(data.BDAY_YEAR)
            })
        }
    },[data.BDAY_YEAR]) // eslint-disable-line react-hooks/exhaustive-deps

    // HANDLERS

    const handleFormChange = (e) => {
        const { value, name } = e.target
        
        setData({
          ...data,
          [name]: value.toUpperCase()
        })
    }

    const handleAddition = async(e, {name, value}) => {
        console.log('value',value)
        setOptionLoad(true)
        const db = await firebase.firestore();
        var med = db.collection("medicines");        

        med.doc().set({
            MEDICINE_NAME: value
        })

        setTimeout(()=>{
            getMedicineData()
        },2000)

        setTimeout(()=>{
            setOptionLoad(false)
        },1000)
    }

    const handleDropdownChange = (e, {name, value}) => {
        setData({
            ...data,
            [name]: value.toUpperCase()
        })
    }

    const handleChangeOfHospital = async(e, props) => {
        const selected = props.options.filter((f)=>{
            return f.value === props.value
        })

        if(selected[0]){
            setData({
                ...data,
                LAB_HOS_NAME: selected[0].text,
                LAB_HOS_CODE: selected[0].text == 'N/A' ? '' : selected[0].code
            })
        }
    }

    const handleSave = async() => {
        if(tid.length === 9){
            setSaveModal(true)
            const db = await firebase.firestore();
            var applicationLogs = db.collection("application-logs");
    
            applicationLogs.doc(tid).set({
                ...data,
                STATUS_USER: currentUser.uid,
                OTHER_DATE: getDateTimeNow().d,
                OTHER_TIME: getDateTimeNow().t,
            })
        }else{
            alert('no entries')
        }
    }

    const handleScan = (e) => {
        const { value } = e.target
        setTID(value.toUpperCase())
        find(value.toUpperCase())
    }

    const handleModalSave = () => {
        setSaveModal(!saveModal)
    }

    const handleAddMedicineModal = () => {
        setShowAddMedicineModal(!showAddMedicineModal)
    }

    const handleEncodeMBSModal = () => {
        setMbsModal(!mbsModal)
    }

    const handleDropdownMedicine = (e, {name, value}) => {
        console.log('xx',name, value)
        setSetToAdd({
            ...setToAdd,
            [name]: value.toUpperCase()
        })
    }

    const handleSaveAddMedicine = () => {
        const meds = data.MEDICINE && data.MEDICINE.length !== 0 ? data.MEDICINE : []
        meds.push(setToAdd)
        setData({
            ...data,
            MEDICINE: [...meds]
        })

        setSetToAdd({
            MEDICINE: '',
            TYPE: ''
        })

        handleAddMedicineModal()
        handleSave()
    }

    const handleSaveMBS = () => {
        handleEncodeMBSModal()
        handleSave()
    }

    const handleRemoveMedicine = (i) => {
        const meds = data.MEDICINE
        meds.splice(i, 1)

        setData({
            ...data,
            MEDICINE: [...meds]
        })
        handleSave()
    }

    const handleFormChangeMedicineBillable = (e, k) => {
        const { value, name } = e.target
        const objectToChange = data.MEDICINE[k]
        const objectNew = {
            ...objectToChange,
            [name]: value
        }
        const arrayToChange = data.MEDICINE
        arrayToChange[k] = { ...objectNew }

        setData({
            ...data,
            MEDICINE: arrayToChange
        })

        compute()
    }

    // FUNCTIONS

    const checkIfMed = () => {
        return data.TID.substring(0,3) === 'MED'
    }

    const checkIfNoData = () => {
        return data.TID === 0 
    }

    const find = async(value) => {
        if(value.length === 9){
            setNotFound(false)
            setLoader(true)
            setData(def)
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
                        setNotFound(false)
                        setLoader(false)
                        setRetrieved(values[0])
                        setData(values[0])
                    },500)
                }else{
                    setNotFound(true)
                    setLoader(false)
                }
            });
        }
    }

    const getMedicineData = async() => {
        const m = await firebase.firestore().collection('medicines').get()
        const list = m.docs.map(doc => doc.data());
        const meds = list.map((h,i)=>{
            return {
                key: i,
                text: h.MEDICINE_NAME,
                value: h.MEDICINE_NAME
            }
        })

        setMedList(meds)
    }

    const getHospitalData = async() => {
        const hosp = await firebase.firestore().collection('hospitals').get()
        const list = hosp.docs.map(doc => doc.data());
        const hospitals = list.map((h,i)=>{
            return {
                key: i,
                text: h.HOSPITAL_NAME,
                value: h.HOSPITAL_NAME,
                code: h.HOSPITAL_CODE
            }
        })
        hospitals.push({
            key: 'i',
            text: 'N/A',
            value: 'N/A'
        })
        setHospitals(hospitals)
    }

    const getUser = async(code) => {
        if(code){
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
    }

    const compute = () => {
        const newMeds = data.MEDICINE.map((i)=>{
            let value = i.QUANTITY * i.UNIT_PRICE
            return {
                ...i,
                AMOUNT: isNaN(value) ? 0 : value
            }
        })

        let total = 0
        newMeds.map((i)=>{ total = total + i.AMOUNT })

        setData({
            ...data,
            MEDICINE: [...newMeds],
            MEDICINE_TOTAL: total
        })
    }

    // RENDERS

    const renderPrefilled1 = () => {
        return (
            <div className="prefilled1">
                <Header as='h4'>
                    <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                    <Header.Content>Applicant Info</Header.Content>
                </Header>

                <Form.Field>
                <label>Last Name</label>
                <Input autoComplete="off" placeholder='Last Name' value={data.NAME_LAST} onChange={handleFormChange} name="NAME_LAST" error={!(checkIfNoData() || data.NAME_LAST)} />
                </Form.Field>

                <Form.Field>
                <label>First Name</label>
                <Input autoComplete="off" placeholder='First Name' value={data.NAME_FIRST} onChange={handleFormChange} name="NAME_FIRST" error={!(checkIfNoData() || data.NAME_FIRST)} />
                </Form.Field>

                <Form.Field>
                <label>Middle Name</label>
                <Input autoComplete="off" placeholder='Middle Name' value={data.NAME_MIDDLE} onChange={handleFormChange} name="NAME_MIDDLE" error={!(checkIfNoData() || data.NAME_MIDDLE)} />
                </Form.Field>

                <Form.Field>
                <label>Birthdate</label>
                <Dropdown placeholder='Month' search selection options={months} onChange={handleDropdownChange} value={data.BDAY_MONTH} name="BDAY_MONTH" error={!(checkIfNoData() || data.BDAY_MONTH)} />
                </Form.Field>

                <Form.Field>
                <Dropdown className="resize-dd" placeholder='Day' search selection options={days} onChange={handleDropdownChange} value={data.BDAY_DAY} name="BDAY_DAY" error={!(checkIfNoData() || data.BDAY_DAY)} />
                </Form.Field>
                
                <Form.Field>
                <Dropdown className="resize-dd" placeholder='Year' search selection options={years} onChange={handleDropdownChange} value={data.BDAY_YEAR} name="BDAY_YEAR" error={!(checkIfNoData() || data.BDAY_YEAR)} />
                </Form.Field>

                <Form.Field>
                <label>Age</label>
                <Input autoComplete="off" disabled value={data.BDAY_AGE} error={!(checkIfNoData() || data.BDAY_AGE)} />
                </Form.Field>

            </div>
        )
    }

    const renderPrefilled2 = () => {
        let renderHeader = () => {
            return <Header as='h4'>
                <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                <Header.Content>Other Info</Header.Content>
            </Header>
        }

        return (
            <div className="prefilled2">
                <Header as='h4'>
                    <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                    <Header.Content>Contact Info</Header.Content>
                </Header>

                <Form.Field>
                <label>Contact Number</label>
                <Input autoComplete="off" placeholder='Contact Number' value={data.CONTACT_NO} onChange={handleFormChange} name="CONTACT_NO" error={!(checkIfNoData() || data.CONTACT_NO)} />
                </Form.Field>

                <Form.Field>
                <label>Brgy</label>
                <Dropdown placeholder='Brgy' search selection options={brgys} onChange={handleDropdownChange} value={data.ADDRESS_BRGY} name="ADDRESS_BRGY" error={!(checkIfNoData() || data.ADDRESS_BRGY)} />
                </Form.Field>
                
                {
                    data.ASSISTANCE.code === 'A' ? (
                        <></>
                    ) : data.ASSISTANCE.code === 'B' ? (
                        <>
                        {renderHeader()}
                        {renderAppliedByRelationRemarks()}
                        </>
                    ) : data.ASSISTANCE.code === 'C' ? (
                        <>
                        {renderAppliedByRelationRemarks()}
                        </>
                    ) : data.ASSISTANCE.code === 'D' ? (
                        <></>
                    ) : data.ASSISTANCE.code === 'E' ? (
                        <>
                        {renderHeader()}
                        {renderPurposeRemarks()}
                        </>
                    ) : (
                        <></>
                    )
                }

            </div>
        )
    }

    const renderAccordionInToFill = () => {
        const panels = [
        {
            key: 'general-referral-form',
            title: 'General Referral Form Info',
            content: {
                content: (renderReferralInfo())
            },
        },
        {
            key: 'laboratory-referral-form',
            title: 'Laboratory Referral Form Info',
            content: {
                content: (renderLaboratoryReferralInfo())
            },
        },
        {
            key: 'cash-in-kind-form',
            title: 'Cash or In-Kind Information',
            content: {
                content: (renderCashInKindInformation())
            }
        },
        ]

        return <Accordion defaultActiveIndex={0} panels={panels} />
    }

    const renderToFill = () => {
        return (
            <div className="tofill">
                {
                    data.ASSISTANCE.code === 'A' ? (
                        <>
                        {renderEduc()}
                        </>
                    ) : data.ASSISTANCE.code === 'B' ? (
                            checkIfMed() ? (
                            <>
                            {renderMedicineRequestInformation()}
                            </>
                            ) : (
                            <>
                            {renderAccordionInToFill()}
                            </>
                            )
                    ) : data.ASSISTANCE.code === 'C' ? (
                        <>
                        {renderCashInKindInformation()}
                        </>
                    ) : data.ASSISTANCE.code === 'D' ? (
                        <>
                        {renderCashInKindInformation()}
                        </>
                    ) : data.ASSISTANCE.code === 'E' ? (
                        <></>
                    ) : (
                        <></>
                    )
                }
            </div>
        )
    }

    const renderMedRequestTable = () => {
        if(data.MEDICINE && data.MEDICINE.length !== 0){
            return (
                <Table basic='very' celled collapsing style={{width: '100%'}}>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Medicine</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
    
                    <Table.Body>
                        {
                            data.MEDICINE.map((i,k)=>{
                                return (
                                    <Table.Row>
                                        <Table.Cell>
                                        <Header as='h4' >
                                            <Header.Content>
                                            <Icon name="minus square outline" onClick={() => handleRemoveMedicine(i)}></Icon>
                                            {i.MEDICINE}
                                            <Header.Subheader>{`${i.TYPE}`}</Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            )
        }
    }

    const renderMedicineRequestInformation = () => {
        return (
            <>
                <Header as='h4'>
                    <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                    <Header.Content>Medicine Request Info</Header.Content>
                </Header>
                
                {
                    <>
                    <Button icon labelPosition='left' color="yellow" onClick={handleAddMedicineModal} compact>
                        <Icon name='plus' />
                        Add Medicine Request
                    </Button>
                    {
                        (currentUser.uid === 'ky2gZ2IfpONnAGDoBWiAuHQWXyx1' || 
                        currentUser.uid === 'u67L7ELKxpWfHraWZbISl2EKxg42' || 
                        currentUser.uid === 'NTq4wqMUFHdoLi5j4WU3e7uRuY43') && 
                        <Button icon labelPosition='left' onClick={handleEncodeMBSModal} style={{marginTop: "0.5rem"}} compact>
                            <Icon name='pencil alternate' />
                            Encode MBS
                        </Button>
                    }
                    {renderMedRequestTable()}
                    </>
                }
            </>
        )
    }

    const renderEduc = () => {
        return (
            <>
                <Form.Field>
                <label>School</label>
                <Input autoComplete="off" placeholder='School' onChange={handleFormChange} name="OTHER_SCHOOL" value={data.OTHER_SCHOOL} error={!(checkIfNoData() || data.OTHER_SCHOOL)} />
                </Form.Field>

                <Form.Field>
                <label>Year</label>
                <Input autoComplete="off" placeholder='Year' onChange={handleFormChange} name="OTHER_YEAR" value={data.OTHER_YEAR} error={!(checkIfNoData() || data.OTHER_YEAR)} />
                </Form.Field>

                <Form.Field>
                <label>Course</label>
                <Input autoComplete="off" placeholder='Course' onChange={handleFormChange} name="OTHER_COURSE" value={data.OTHER_COURSE} error={!(checkIfNoData() || data.OTHER_COURSE)} />
                </Form.Field>

                <Form.Field>
                <label>Source of Income</label>
                <Input autoComplete="off" placeholder='Source of Income' onChange={handleFormChange} name="OTHER_SOURCE_INCOME" value={data.OTHER_SOURCE_INCOME} error={!(checkIfNoData() || data.OTHER_SOURCE_INCOME)} />
                </Form.Field>

                <Form.Field>
                <label>Parent's Occupation / Income</label>
                <Input autoComplete="off" placeholder='Parent`s Occupation / Income' onChange={handleFormChange} name="OTHER_PARENTS" value={data.OTHER_PARENTS} error={!(checkIfNoData() || data.OTHER_PARENTS)} />
                </Form.Field>
            </>
        )
    }

    const renderReferralInfo = () => {
        return (
            <>
                <Form.Field>
                <label>Hospital Name</label>
                <Input autoComplete="off" placeholder='Hospital Name' onChange={handleFormChange} name="OUTPUT_HOSPITAL_NAME" value={data.OUTPUT_HOSPITAL_NAME} error={!(checkIfNoData() || data.OUTPUT_HOSPITAL_NAME)} />
                </Form.Field>

                <Form.Field>
                <label>Referral Amount</label>
                <Input autoComplete="off" placeholder='Referral Amount' onChange={handleFormChange} name="OUTPUT_REFERRAL_AMOUNT" value={data.OUTPUT_REFERRAL_AMOUNT} error={!(checkIfNoData() || data.OUTPUT_REFERRAL_AMOUNT)} />
                </Form.Field>

                <Form.Field>
                <label>DOH Code</label>
                <Input autoComplete="off" placeholder='DOH Code' onChange={handleFormChange} name="OUTPUT_REFERRAL_DOH_CODE" value={data.OUTPUT_REFERRAL_DOH_CODE} error={!(checkIfNoData() || data.OUTPUT_REFERRAL_DOH_CODE)} />
                </Form.Field>
            </>
        )
    }

    const renderLaboratoryReferralInfo = () => {
        return (
            <>
                <Form.Field>
                <label>Laboratory Hospital Name</label>
                 <Dropdown placeholder='Hospitals' search selection options={hospitals} onChange={handleChangeOfHospital} name="LAB_HOS_NAME" value={data.LAB_HOS_NAME}/>
                </Form.Field>

                <Form.Field>
                <label>Laboratory Referral Amount</label>
                <Input autoComplete="off" placeholder='Laboratory Referral Amount' onChange={handleFormChange} name="LAB_HOS_AMOUNT" value={data.LAB_HOS_AMOUNT} error={!(checkIfNoData() || data.LAB_HOS_AMOUNT)} /> 
                </Form.Field>

                <Form.Field>
                <label>Laboratory Referral Code</label>
                <Input label={data.LAB_HOS_CODE} autoComplete="off" placeholder='Laboratory Referral Code' onChange={handleFormChange} name="LAB_HOS_REF_CODE" value={data.LAB_HOS_REF_CODE} error={!(checkIfNoData() || data.LAB_HOS_REF_CODE)} /> 
                </Form.Field>
            </>
        )
    }

    const renderCashInKindInformation = () => {
        return (
            <>
                <Form.Field>
                <label>Cash Amount</label>
                <Input autoComplete="off" placeholder='Cash Amount' onChange={handleFormChange} name="OUTPUT_CASH" value={data.OUTPUT_CASH} error={!(checkIfNoData() || data.OUTPUT_CASH)} />
                </Form.Field>

                <Form.Field>
                <label>In-kind</label>
                <Input autoComplete="off" placeholder='In-kind' onChange={handleFormChange} name="OUTPUT_IN_KIND" value={data.OUTPUT_IN_KIND} error={!(checkIfNoData() || data.OUTPUT_IN_KIND)} />
                </Form.Field>
            </>
        )
    }

    const renderPurposeRemarks = () => {
        return (
            <>
                <Form.Field>
                <label>Purpose</label>
                <Input autoComplete="off" placeholder='Purpose' onChange={handleFormChange} name="OTHER_PURPOSE" value={data.OTHER_PURPOSE} error={!(checkIfNoData() || data.OTHER_PURPOSE)} />
                </Form.Field>

                <Form.Field>
                <label>Remarks</label>
                <Input autoComplete="off" placeholder='Remarks' onChange={handleFormChange} name="OTHER_REMARKS" value={data.OTHER_REMARKS} error={!(checkIfNoData() || data.OTHER_REMARKS)} />
                </Form.Field>
            </>
        )
    }

    const renderAppliedByRelationRemarks = () => {
        return (
            <>
                {
                    checkIfMed() && (
                        <>
                        <Form.Field>
                        <label>Exact Address</label>
                        <Input autoComplete="off" placeholder='Exact Address' onChange={handleFormChange} name="OTHER_EXACT_ADDRESS" value={data.OTHER_EXACT_ADDRESS} error={!(checkIfNoData() || data.OTHER_EXACT_ADDRESS)} />
                        </Form.Field>
        
                        <Form.Field>
                        <label>Landmark</label>
                        <Input autoComplete="off" placeholder='Landmark' onChange={handleFormChange} name="OTHER_LANDMARK" value={data.OTHER_LANDMARK} error={!(checkIfNoData() || data.OTHER_LANDMARK)} />
                        </Form.Field>
                        
                        <Form.Field>
                        <label>Delivery Type</label>
                        <Dropdown placeholder='Delivery Type' selection options={deliveryTypes} onChange={handleDropdownChange} value={data.DELIVERY_TYPE} name="DELIVERY_TYPE" error={!(checkIfNoData() || data.DELIVERY_TYPE)} />
                        </Form.Field>
                        </>
                    )
                }

                <Form.Field>
                <label>Applied by</label>
                <Input autoComplete="off" placeholder='Applied by' onChange={handleFormChange} name="OTHER_APPLY_NAME" value={data.OTHER_APPLY_NAME} error={!(checkIfNoData() || data.OTHER_APPLY_NAME)} />
                </Form.Field>

                <Form.Field>
                <label>Relation to Beneficiary</label>
                <Input autoComplete="off" placeholder='Relation to Beneficiary' onChange={handleFormChange} name="OTHER_RELATION_BENEFICIARY" value={data.OTHER_RELATION_BENEFICIARY} error={!(checkIfNoData() || data.OTHER_RELATION_BENEFICIARY)} />
                </Form.Field>

                {
                    !checkIfMed() && (
                        <Form.Field>
                        <label>Remarks</label>
                        <Input autoComplete="off" placeholder='Remarks' onChange={handleFormChange} name="OTHER_REMARKS" value={data.OTHER_REMARKS} error={!(checkIfNoData() || data.OTHER_REMARKS)} />
                        </Form.Field>
                    )
                }
            </>
        )
    }

    const renderStatus = () => {
        return (
            <div className="stats">
                <Input
                    className="inputTID"
                    iconPosition='left'
                    error={found}
                    disabled={retrieved.TID !== 0}
                    placeholder='Search'
                    size='massive'
                    value={tid}
                    onChange={handleScan}
                    id="myAnchor"
                    name="TID"
                    autoComplete="off"
                    maxLength={"9"}
                    loading={loader}
                />
                <Header as='h4'>
                    <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                    <Header.Content>Assistance</Header.Content>
                    <Header.Subheader>
                    {
                        data.ASSISTANCE.name ?
                        data.ASSISTANCE.name : 
                        "-"
                    }
                    </Header.Subheader>
                </Header>
                <Header as='h4'>
                    <Icon name="play" style={{"fontSize": "0.5em"}}></Icon>
                    <Header.Content>Status</Header.Content>
                </Header>

                <Form.Field>
                <Dropdown placeholder='Status' selection options={status} onChange={handleDropdownChange} value={data.STATUS} name="STATUS" error={!(checkIfNoData() || data.STATUS)} />
                </Form.Field>

                <Form.Field>
                    <label>Date of Application</label>
                    <p>{`${data.DATE ? data.DATE : "-"} ${data.TIME ? data.TIME : "-"}`}</p>
                </Form.Field>

                <Form.Field>
                    <label>Last Update</label>
                    <p>{`${data.OTHER_DATE ? data.OTHER_DATE : "-"} ${data.OTHER_TIME ? data.OTHER_TIME : "-"}`}</p>
                </Form.Field>

                <Form.Field>
                    <label>Last Updated by:</label>
                    <p>{data.STATUS_USER && userDetails ? userDetails.name : "-"}</p>
                </Form.Field>

                {renderActions()}

                <h5>Version 4.7</h5>
            </div>
        )
    }

    const renderActions = () => {
        return (
            <div className="actions">
                <Button type='submit' color={'yellow'} className="submit" onClick={handleSave} size="medium" disabled={checkChange} style={{width: "100%", height:"5rem"}}>Save</Button>
            </div>
        )
    }

    const renderAddMedicineModal = () => {
        return (
            <Form>
            <Form.Group>
                <Form.Field>
                    <label>Medicine</label>
                    <Dropdown placeholder='MEDICINE' loading={optionLoad} search selection options={medList} onChange={handleDropdownMedicine} name="MEDICINE" value={setToAdd.MEDICINE} allowAdditions onAddItem={handleAddition}/>
                    <Dropdown placeholder='TYPE' search selection options={medTypesOptions} onChange={handleDropdownMedicine} name="TYPE" value={setToAdd.TYPE} style={{marginTop: '1rem'}}/>
                </Form.Field>
            </Form.Group>
            </Form>
        )
    }

    const renderMbsModal = () => {
        if(data.MEDICINE && data.MEDICINE.length !== 0){
            return (
                <>
                <Table basic='very' celled style={{width: '100%'}} compact>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Medicine</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
                        <Table.HeaderCell>Unit Price</Table.HeaderCell>
                        <Table.HeaderCell>Amount</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>
    
                    <Table.Body>
                        {
                            data.MEDICINE.map((i,k)=>{
                                return (
                                    <Table.Row>
                                        <Table.Cell> {k+1} </Table.Cell>
                                        <Table.Cell> {i.MEDICINE} </Table.Cell>
                                        <Table.Cell> {i.TYPE} </Table.Cell>
                                        <Table.Cell>
                                            <Form size={'tiny'}>
                                                <Input
                                                    autoComplete="off"
                                                    placeholder='Quantity'
                                                    onChange={(e) => handleFormChangeMedicineBillable(e, k)}
                                                    name="QUANTITY"
                                                    value={data.MEDICINE[k].QUANTITY}
                                                    compact
                                                />
                                            </Form>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form size={'tiny'}>
                                                <Input
                                                    autoComplete="off"
                                                    placeholder='Unit Price'
                                                    onChange={(e) => handleFormChangeMedicineBillable(e, k)}
                                                    name="UNIT_PRICE"
                                                    value={data.MEDICINE[k].UNIT_PRICE}
                                                    compact
                                                />
                                            </Form>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Form size={'tiny'}>
                                                <Input
                                                    autoComplete="off"
                                                    placeholder='Amount'
                                                    disabled
                                                    name="AMOUNT"
                                                    value={data.MEDICINE[k].AMOUNT}
                                                    compact
                                                />
                                            </Form>
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
                <Header as="h4" textAlign="right">{`Total Amount = ${data.MEDICINE_TOTAL}`}</Header>
                </>
            )
        }
    }

    const renderModals = () => {
        return <>
            {saveModal &&
            <Modal
                size={'mini'}
                open={saveModal}
                onClose={handleModalSave}
            >
                <Modal.Header>Data has been updated!</Modal.Header>
                <Modal.Actions>
                <Button primary onClick={handleModalSave}>
                    OK
                </Button>
                </Modal.Actions>
            </Modal>
            }

            {showAddMedicineModal &&
            <Modal
                size={'mini'}
                open={showAddMedicineModal}
                onClose={handleAddMedicineModal}
            >
                <Modal.Header>Add Medicine</Modal.Header>
                <Modal.Content>
                {renderAddMedicineModal()}
                </Modal.Content>
                <Modal.Actions>
                <Button primary onClick={handleSaveAddMedicine}>
                    ADD
                </Button>
                </Modal.Actions>
            </Modal>
            }

            {mbsModal &&
            <Modal
                size={'small'}
                open={mbsModal}
                onClose={handleEncodeMBSModal}
            >
                <Modal.Header>Encode Medicine Billables (MBS)</Modal.Header>
                <Modal.Content>
                {renderMbsModal()}
                </Modal.Content>
                <Modal.Actions>
                <Button primary onClick={handleSaveMBS}>
                    Save
                </Button>
                </Modal.Actions>
            </Modal>
            }

        </>
    }

    const renderContent = () => {
        return (
            <div className="intake-sheet">
                <div className="content">
                    <Form className="form-page" id="RAWR">
                        {renderPrefilled1()}
                        {renderPrefilled2()}
                        {renderToFill()}
                        {renderStatus()}
                    </Form>
                </div>
                {renderModals()}
            </div>
        )
    }

    return (
        <>
        <Dimmer active={loader}><Loader /></Dimmer>
        {renderContent()}
        </>
    )
}

export default IntakeSheet