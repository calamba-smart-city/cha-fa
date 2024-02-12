import React from 'react';
import LogoCha from '../assets/logo.png'
import { Header, Image, Table, Icon } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';

export const MBSPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        TID,
        BDAY_AGE,
        MEDICINE,        
        OTHER_DATE
    } = printData

    const formWhole = {"width":"5.83in","height":"8.27in","border":"1px solid gray","fontFamily":"Lato"}
    const logoCha = {"width":"5.5rem","margin":"0rem 2rem", "right":"0"}
    const head = {"marginTop": "1rem", "marginBottom": '2rem'}
    const r = {"textAlign":"center","marginTop":"-5rem"}
    const fieldRow = { "textAlign":"left", "marginLeft": "1rem"}
    const fieldRowX = { "textAlign":"left", "marginRight": "1rem", "marginLeft":"auto"}
    const fieldA = {"fontSize":"15px","fontWeight":"bolder"}
    const flex = {"display":"flex"}
    const tb = {"width":"95%","margin": "1rem 1rem"}

    const formatDate = (d) => {
        // For dates that have time
        if(d && d.length >= 10){
            return d
        }else{
            return d ? d.substring(0, d.indexOf(' ')) : ''
        }
    }

    const renderRFForm = () =>{
        return (
            <>
            <div className="head" style={head}>
                <Image src={LogoCha} className="logo-calamba" style={logoCha}></Image>
                <Header as="h3" className="r" style={r}>
                    MEDICINE BILLABLE SHEET (MBS)
                    <Header.Subheader>
                        INTERNAL DOCUMENT OF <br/>
                        DISTRICT OFFICE OF CALAMBA 
                    </Header.Subheader>
                </Header>
            </div>
            <div className="body">
                
                <div className="flex" style={flex}>
                    <div className="field-row" style={fieldRow}>
                        <div className="field-a" style={fieldA}>{`${NAME_LAST}, ${NAME_FIRST} ${NAME_MIDDLE}, ${BDAY_AGE}`}</div>
                        <div className="field-q">{`${TID}`}</div>
                    </div>

                    <div className="field-row" style={fieldRowX}>
                        <div className="field-a" style={fieldA}>{formatDate(OTHER_DATE)}</div>
                    </div>
                </div>
                {renderMedRequestTable()}
            </div> 

            <br></br>
            <div style={flex}>
                <div style={{marginLeft:'1rem'}}>
                <i>Medicine Provider</i>
                <br></br><br></br>
                ________________________________________
                </div>
                <div className="field-row" style={fieldRowX}>
                    <div className="field-a" style={fieldA}>{`Total Amount`}</div>
                    <br></br>
                ______________________
                </div>
            </div>
            
            </>
        )
    }

    const renderMedRequestTable = () => {
        if(MEDICINE && MEDICINE.length !== 0){
            return (
                <Table basic='very' celled collapsing style={tb}>
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
                            MEDICINE.map((i,k)=>{
                                return (
                                    <Table.Row>
                                        <Table.Cell>{k+1}</Table.Cell>
                                        <Table.Cell>{i.MEDICINE}</Table.Cell>
                                        <Table.Cell>{i.TYPE}</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>
                                )
                            })
                        }
                    </Table.Body>
                </Table>
            )
        }
    }

    return (
        <div style={formWhole} id="intshtz" ref={ref} >
            {renderRFForm()}
        </div>
    );
  });