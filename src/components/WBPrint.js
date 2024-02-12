import React from 'react';
import LogoCha from '../assets/logo.png'
import { Image, Table } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import Barcode from 'react-barcode';

export const WBPrint = React.forwardRef((props, ref) => {
    const { printData } = useSelector(getApp)
    const {
        NAME_LAST,
        NAME_FIRST,
        NAME_MIDDLE,
        CONTACT_NO,
        DELIVERY_TYPE,
        ADDRESS_BRGY,
        OTHER_EXACT_ADDRESS,
        OTHER_LANDMARK,
        TID,
        MEDICINE,        
        OTHER_DATE
    } = printData

    const formWhole = {"width":"4.1in","height":"5.8in","border":"1px solid gray","fontFamily":"Lato"}
    const logoCha = {"width":"4.8rem","margin":"0rem 2rem", "right":"0", "marginTop":"-4rem", "marginLeft": "1rem"}
    const SA = {"width":"4.1in","height":"0.7in","borderBottom":"1px solid gray","paddingLeft": "2rem"}
    const SB = {"width":"4.1in","height":"0.5in","borderBottom":"1px solid gray", "display":"flex"}
        const SB1 = {"width":"3in","height":"0.5in","borderRight":"1px solid gray", "textAlign":"center","paddingTop":"3px", "fontWeight":"bolder"}
        const SB2 = {"width":"1.1in","height":"0.5in", "paddingLeft":"3px", "fontWeight":"bolder", "textAlign": "center", "paddingRight":"5px"}
    const SC = {"width":"4.1in","height":"0.25in","borderBottom":"1px solid gray", "display":"flex"}
        const SC1 = {"width":"1.37in","height":"0.25in","borderRight":"1px solid gray", "paddingLeft":"8px"}
        const SC2 = {"width":"1.37in","height":"0.25in","borderRight":"1px solid gray", "paddingLeft":"3px"}
        const SC3 = {"width":"1.37in","height":"0.25in", "paddingLeft":"3px"}
    const SD = {"width":"4.1in","height":"0.25in","borderBottom":"1px solid gray", "display":"flex"}
        const SD1 = {"width":"2.05in","height":"0.25in","borderRight":"1px solid gray", "paddingLeft":"8px"}
        const SD2 = {"width":"2.05in","height":"0.25in", "paddingLeft":"8px"}
    const SE = {"width":"4.1in","height":"0.5in","borderBottom":"1px solid gray", "display":"flex", "paddingLeft":"8px"}
    const SF = {"width":"4.1in","height":"0.5in","borderBottom":"1px solid gray", "display":"flex", "paddingLeft":"8px"}
    const SG = {"width":"4.1in","height":"2.8in","borderBottom":"1px solid gray", "display":"flex"}
    const SH = {"width":"4.1in","height":"0.3in", "textAlign":"center","paddingTop":"3px", "fontWeight":"bolder"}
    const TB = {"padding": "0.5rem 1rem"}

    const formatDate = (d) => {
        // For dates that have time
        if(d && d.length >= 10){
            return d
        }else{
            return d ? d.substring(0, d.indexOf(' ')) : ''
        }
    }

    const renderForm = () =>{
        return (
            <>
                <div className="form-whole" style={formWhole}>
                    <div style={SA}>
                    <Barcode value={TID} 
                        format="CODE128" 
                        className="ss" 
                        displayValue={true} 
                        width="2"
                        height="33"
                        fontSize="10"
                    />
                    </div>
                    <div style={SB}>
                        <div style={SB1}>PONDO NG DISTRITO, <br></br>DAMA NG CALAMBEÑO</div>
                        <div style={SB2}>
                            <Image src={LogoCha} style={logoCha}></Image>
                            {formatDate(OTHER_DATE)}
                        </div>
                    </div>
                    <div style={SC}>
                        <div style={SC1}>{NAME_LAST}</div>
                        <div style={SC2}>{NAME_FIRST}</div>
                        <div style={SC3}>{NAME_MIDDLE}</div>
                    </div>
                    <div style={SD}>
                        <div style={SD1}>{CONTACT_NO}</div>
                        <div style={SD2}>{DELIVERY_TYPE}</div>
                    </div>
                    <div style={SE}>
                        {`${OTHER_EXACT_ADDRESS}, ${ADDRESS_BRGY}`}
                    </div>
                    <div style={SF}>
                        {OTHER_LANDMARK}
                    </div>
                    <div style={SG}>
                        {renderMedRequestTable()}
                    </div>
                    <div style={SH}>
                        MEDICINE DELIVERY HANDLE WITH CARE
                    </div>
                </div>
            </>
        )
    }

    const renderMedRequestTable = () => {
        if(MEDICINE && MEDICINE.length !== 0){
            return (
                <Table basic='very' celled style={TB}>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>No</Table.HeaderCell>
                        <Table.HeaderCell>Medicine</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Quantity</Table.HeaderCell>
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
                                        <Table.Cell>{i.QUANTITY}</Table.Cell>
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
            {renderForm()}
        </div>
    );
  });