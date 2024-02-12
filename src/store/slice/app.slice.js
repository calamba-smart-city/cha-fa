
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {
        QID: 0,
        TID: 0,
        ASSISTANCE: [],
        NAME_FIRST: '',
        NAME_MIDDLE: '',
        NAME_LAST: '',
        BDAY_MONTH: '',
        BDAY_DAY: '',
        BDAY_YEAR: '',
        BDAY_AGE: '',
        CONTACT_NO: '',
        ADDRESS_BRGY: '',
    },
    printData: {}
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setData: (state, action) => ({ ...state, data: action.payload }),
        setPrintData: (state, action) => ({ ...state, printData: action.payload })
    }
})

export const getApp = (state) => state.app;
export default appSlice;
