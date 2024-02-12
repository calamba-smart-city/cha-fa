import React from 'react';
import { Header, Image, Table } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { inWords } from '../utils/towords';

export const SCPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        BDAY_MONTH,
        BDAY_DAY,
        BDAY_YEAR,
        BDAY_AGE,
        ADDRESS_BRGY,
        CONTACT_NO,
        TID,
        OUTPUT_CASH,
        OTHER_DATE
    } = printData

    // const formWhole = {"width":"210mm","height":"297mm","border":"1px solid gray","fontFamily":"Lato"}
    // const formBreak = {"break-after": "page"}

    const formatDate = (d) => {
        // For dates that have time
        if(d && d.length >= 10){
            return d
        }else{
            return d ? d.substring(0, d.indexOf(' ')) : ''
        }
    }

    const render1 = () => {
        return (
            <>
            <p style={sectionHeader}>I. IDENTIFYING INFORMATION</p>
            <Table fixed basic="very" compact>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Name</Table.Cell>
                        <Table.Cell>{`:  ${NAME_FIRST} ${NAME_MIDDLE} ${NAME_LAST}`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Date of Birth</Table.Cell>
                        <Table.Cell>{`:  ${BDAY_MONTH} ${BDAY_DAY}, ${BDAY_YEAR}`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Age</Table.Cell>
                        <Table.Cell>{`:  ${BDAY_AGE}`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Sex</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Civil Status</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Case Category</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Address</Table.Cell>
                        <Table.Cell>{`:  ${ADDRESS_BRGY}`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Educational Attainment</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Occupation</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Average Monthly Income</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Contact Number</Table.Cell>
                        <Table.Cell>{`:  ${CONTACT_NO}`}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Name of Patients</Table.Cell>
                        <Table.Cell>{`:  -`}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            </>
        )
    }

    const render2 = () => {
        return (
            <>
            <br/>
            <p style={sectionHeader}>II. FAMILY COMPOSITION</p>
            <Table fixed basic="very" compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Age</Table.HeaderCell>
                        <Table.HeaderCell>Relation to the client</Table.HeaderCell>
                        <Table.HeaderCell>Civil Status</Table.HeaderCell>
                        <Table.HeaderCell>Sex</Table.HeaderCell>
                        <Table.HeaderCell>Educational Attainment</Table.HeaderCell>
                        <Table.HeaderCell>Occupation</Table.HeaderCell>
                        <Table.HeaderCell>Average Monthly Income</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Mark A. Mamino</Table.Cell>
                        <Table.Cell>23</Table.Cell>
                        <Table.Cell>Client</Table.Cell>
                        <Table.Cell>Single</Table.Cell>
                        <Table.Cell>Male</Table.Cell>
                        <Table.Cell>College Graduate</Table.Cell>
                        <Table.Cell>Supervisor</Table.Cell>
                        <Table.Cell>Php 16,000.00</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
            </>
        )
    }

    const whole = { width: '210mm', height: "297mm", fontSize: '10px', padding: '2rem 3rem' }
    const date = { fontSize: '12px', textAlign: 'right', fontWeight: 'bolder' }
    const titleHead = { textAlign: 'center' }
    const sectionHeader = { fontWeight: 'bolder', fontSize: '12px' }

    return (
        <div ref={ref} style={whole}>
            <h3 style={titleHead}>SOCIAL CASE STUDY REPORT</h3>
            <p style={date}>Date: {formatDate(OTHER_DATE)}</p>
            <div>{render1()}</div>
            <div>{render2()}</div>
        </div>
    );
  });