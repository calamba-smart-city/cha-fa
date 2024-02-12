import React from 'react';
import { Header, Image, Table } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getApp } from '../store/slice/app.slice';
import { inWords } from '../utils/towords';

export const SC2Print = React.forwardRef((props, ref) => {
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

    const render3 = () => {
        return (
            <>
            <p style={sectionHeader}>III. PROBLEM PRESENTED</p>
            <p>{`Mr. ${NAME_LAST} prompted, to seek Social Case Study Report that will be utilized as reference in the office of the DEPARTMENT OF HEALTH in seeking financial assistance for his sons' medical needs that will costs Php 17,463.00`}</p>
            </>
        )
    }

    const render4 = () => {
        return (
            <>
            <br/>
            <p style={sectionHeader}>IV. BRIEF BACKGROUND</p>
            <p>{`Mr. ${NAME_LAST} prompted, to seek Social Case Study Report that will be utilized as reference in the office of the DEPARTMENT OF HEALTH in seeking financial assistance for his sons' medical needs that will costs Php 17,463.00`}</p>
            </>
        )
    }

    const sectionHeader = { fontWeight: 'bolder', fontSize: '12px', }
    const whole = { width: '210mm', height: "297mm", fontSize: '10px', padding: '2rem 3rem' }

    return (
        <div ref={ref} style={whole}>
            <div>{render3()}</div>
            <div>{render4()}</div>
        </div>
    );
  });