import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Checkbox, Dropdown, Form, Header } from 'semantic-ui-react';
import appSlice, { getApp } from '../store/slice/app.slice';
import { months, days, years, brgys } from '../utils/constants'

const FormToFill = ({
    handleSubmit,
    code,
    isMed,
    handleTick
}) => {
    const dispatch = useDispatch();
    const { data } = useSelector(getApp)

      useEffect(()=>{
        if(data.BDAY_YEAR){
            dispatch(appSlice.actions.setData({
                ...data,
                BDAY_AGE: 2024 - parseInt(data.BDAY_YEAR)
            }))
        }
      },[data.BDAY_YEAR])

      const handleFormChange = (e) => {
        const { value, name } = e.target
        
        dispatch(appSlice.actions.setData({
          ...data,
          [name]: value.toUpperCase()
        }))
      }
    
      const handleDropdownChange = (e, {name, value}) => {
        dispatch(appSlice.actions.setData({
          ...data,
          [name]: value
        }))
      }

      const renderHeader = () => {
        const headerText = code === 'A' ? 'Student Information' : 
        code === 'B' ? 'Patient Information' :
        code === 'C' ? 'Beneficiary Information' :
        code === 'D' ? 'Requester Information' :
        code === 'E' ? 'Requester Information' : ''

        return (
          <Header as='h2'>
            <Header.Content>{headerText}</Header.Content>
          </Header>
        )
      }

      const renderBday = () => {
        if(code === 'D' || code === 'E'){
          return <></>
        }else{
          return (
            <Form.Group>
            <Form.Field>
            <label>Birthdate</label>
            <Dropdown placeholder='Month' search selection options={months} onChange={handleDropdownChange} name="BDAY_MONTH"/>
            </Form.Field>
  
            <Form.Field>
            <label><br/></label>
            <Dropdown placeholder='Day' search selection options={days} onChange={handleDropdownChange} name="BDAY_DAY"/>
            </Form.Field>
  
            <Form.Field>
            <label><br/></label>
            <Dropdown placeholder='Year' search selection options={years} onChange={handleDropdownChange} name="BDAY_YEAR"/>
            </Form.Field>
  
            <Form.Field>
            <label>Age</label>
            <input autoComplete="off" disabled value={data.BDAY_AGE}/>
            </Form.Field>
            </Form.Group>
          )
        }

      }

      const renderName = () => {
        return (
          <Form.Group widths='equal'>
          <Form.Field>
          <label>First Name</label>
          <input autoComplete="off" placeholder='First Name' value={data.NAME_FIRST} onChange={handleFormChange} name="NAME_FIRST"/>
          </Form.Field>
          
          <Form.Field>
          <label>Middle Name</label>
          <input autoComplete="off" placeholder='Middle Name' value={data.NAME_MIDDLE} onChange={handleFormChange} name="NAME_MIDDLE"/>
          </Form.Field>
  
          <Form.Field>
          <label>Last Name</label>
          <input autoComplete="off" placeholder='Last Name' value={data.NAME_LAST} onChange={handleFormChange} name="NAME_LAST"/>
          </Form.Field>
          </Form.Group>
        )
      }

    const renderContactInfo = () => {
      return (
        <>
          <Header as='h2'>
            <Header.Content>Contact Information</Header.Content>
          </Header>

          <Form.Group widths="equal">

          <Form.Field>
          <label>Contact Number</label>
          <input autoComplete="off" placeholder='Contact Number' value={data.CONTACT_NO} onChange={handleFormChange} name="CONTACT_NO"/>
          </Form.Field>

          <Form.Field>
          <label>Baranggay </label>
          <Dropdown placeholder='Brgy' search selection options={brgys} onChange={handleDropdownChange} name="ADDRESS_BRGY"/>
          </Form.Field>

          </Form.Group>
        </>
      )
    }

    const renderAdditionalInfo = () => {
        return (
        <>
          <Header as='h2'>
            <Header.Content>Additional Information</Header.Content>
          </Header>

          <Form.Group widths='equal'>
          <Form.Field>
          <label>Organization</label>
          <input autoComplete="off" placeholder='Name of Organization' value={data.OTHER_ORG} onChange={handleFormChange} name="OTHER_ORG"/>
          </Form.Field>
          
          <Form.Field>
          <label>Chapter</label>
          <input autoComplete="off" placeholder='Chapter of Organization' value={data.OTHER_CHAPTER} onChange={handleFormChange} name="OTHER_CHAPTER"/>
          </Form.Field>

          </Form.Group>
        </>
        )
      }

    return (
        
        <Form className="form-page" id="RAWR">

        {renderHeader()}
        
        { code === 'B' && 
          <Checkbox label={{ children: 'Tick checkbox if requesting for medicine' }} style={{marginBottom: '1rem'}} onClick={handleTick} checked={isMed}/>
        }

        {renderName()}

        {renderBday()}

        {renderContactInfo()}
        
        { code === 'D' && 
        renderAdditionalInfo()
        }

        <Button type='submit' color={'yellow'} className="submit" onClick={handleSubmit} size="massive">
          Submit
        </Button>

        
        </Form>
    )
}

export default FormToFill