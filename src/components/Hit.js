import firebase from '../firebase'
import React, { useEffect, useState } from 'react';
import { Button, Dimmer, Image, Input, List, Loader, Modal, Select, Accordion, Icon, Table, Label } from 'semantic-ui-react';
import Logo from '../assets/logo.png';
import moment from 'moment';
import { getDateTimeNow } from '../utils/constants';

const Hit = () => {

    const [load,setLoad] = useState(false)
    const [modal, setModal] = useState(false)
    const [searchValueFirst, setSearchValueFirst] = useState('')
    const [searchValueLast, setSearchValueLast] = useState('')
    
    const [res, setRes] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)

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

    const handleInputFirst = (e) => {
        const { value } = e.target

        setSearchValueFirst(value.toUpperCase())
    }

    const handleInputLast= (e) => {
        const { value } = e.target

        setSearchValueLast(value.toUpperCase())
    }

    const handleModal = () => {
        setModal(!modal)
    }

    const handleSearch = async() => {
        const db = await firebase.firestore();
        await db.collection("application-logs")
        .where("NAME_LAST", "==", searchValueLast)
        .where("NAME_FIRST", "==", searchValueFirst)
        .get()
        .then((querySnapshot) => {
            let res = []
            querySnapshot.forEach((doc) => {
                res.push(doc.data())
            });

            res.reverse()

            setRes(res)
            setModal(true)
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    }

    const handleClick = (k) => {
        setActiveIndex(k)
    }

    const checkIfPast = (date) => {
        var todayDate = moment(getDateTimeNow().d)
        var pastDate = moment(date)

        console.log(date)

        var dDiff = todayDate.diff(pastDate,'months',true);

        if (dDiff > 6) {
            return false
        }else{
            return true
        }
    }

    const renderRemarks = (i,k,j) => {
        if(i){
            return `${i} Cash Assistance`
        }else if(k){
            return `${k} Referral Form`
        }else if(j.includes('MED')){
            return `Provided Medical Assistance`
        }else{
            return ''
        }
    }

    const renderAccordionItem = ({
        NAME_FIRST,
        NAME_LAST,
        NAME_MIDDLE,
        OTHER_DATE,
        STATUS,
        TID,
        DATE,
        OUTPUT_CASH,
        OUTPUT_REFERRAL_AMOUNT,
        OTHER_REMARKS
    }, k) => {
        return (
            <Table.Row key={k}>
                <Table.Cell>{`${NAME_LAST}, ${NAME_FIRST} ${NAME_MIDDLE}`}</Table.Cell>
                <Table.Cell>{TID}</Table.Cell>
                <Table.Cell>{DATE}</Table.Cell>
                <Table.Cell>{OTHER_DATE}</Table.Cell>
                <Table.Cell>{OTHER_REMARKS}</Table.Cell>
                <Table.Cell>{renderRemarks(OUTPUT_CASH, OUTPUT_REFERRAL_AMOUNT, TID)}</Table.Cell>
                <Table.Cell>{STATUS}</Table.Cell>
                <Table.Cell><Label circular color={checkIfPast(OTHER_DATE) ? 'red' : 'black'} empty key={k} /> {
                    checkIfPast(OTHER_DATE) ? 'NO' : 'YES'
                } </Table.Cell>
            </Table.Row>
        )
    }

    return (
        <div className="hit" >
            <div className="cont-body">
                <h3>First Name</h3>
                <Input
                    load
                    placeholder='Search...'
                    size="massive"
                    className="search-last-name"
                    value={searchValueFirst}
                    onChange={handleInputFirst}
                />
                <h3>Last Name</h3>
                <Input
                    load
                    placeholder='Search...'
                    size="massive"
                    className="search-last-name"
                    value={searchValueLast}
                    onChange={handleInputLast}
                />
                <Button
                    size="massive"
                    color="yellow"
                    className="btn-srch"
                    onClick={handleSearch}
                >
                    SEARCH
                </Button>
            </div>
            <Modal
                size={'large'}
                open={modal}
                onClose={handleModal}
            >
                <Modal.Header>
                    {`${res.length} Search Result Found`}
                </Modal.Header>
                <Modal.Content>
                <Table basic='very' celled collapsing compact >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Transaction ID</Table.HeaderCell>
                            <Table.HeaderCell>Date Applied</Table.HeaderCell>
                            <Table.HeaderCell>Last Transaction</Table.HeaderCell>
                            <Table.HeaderCell>REMARKS</Table.HeaderCell>
                            <Table.HeaderCell>SERVICE PROVIDED</Table.HeaderCell>
                            <Table.HeaderCell>STATUS</Table.HeaderCell>
                            <Table.HeaderCell>ELIGIBILITY</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {
                            res.map((i,k)=>{
                                return renderAccordionItem(i, k)
                            })
                        }
                    </Table.Body>
                </Table>

                </Modal.Content>
                <Modal.Actions>
                <Button onClick={handleModal}>
                    Search again
                </Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
}

export default Hit