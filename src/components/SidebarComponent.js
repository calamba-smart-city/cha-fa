import React, {useEffect, useState}from 'react';
import { Sidebar, Menu, Header, Image, Icon } from 'semantic-ui-react';
import { useAuth } from "../contexts/AuthContext"
import firebase from '../firebase'
import { PAGES } from '../utils/constants';

const SidebarComponent = ({
    children,
    visible,
    handleSideBar
}) => {
    const { currentUser, logout } = useAuth()
    const [ userDetails, setUserDetails ] = useState({
        name: '',
        role: '',
        img: ''
    })
    const menu = [
        {
            text: 'Helpdesk',
            icon: 'users',
            link: PAGES.FRONTDESK
        },
        {
            text: 'Printing',
            icon: 'print',
            link: PAGES.PRINTING
        },
        {
            text: 'Social Case Study',
            icon: 'file alternate outline',
            link: PAGES.SOCIAL
        },
        {
            text: 'Cash Logs',
            icon: 'money',
            link: PAGES.LOGS
        }
    ]

    useEffect(()=>{
        if(currentUser){
            getUser(currentUser.uid)
        }
    },[]) // eslint-disable-line react-hooks/exhaustive-deps

    const getUser = async(code) => {
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

    const handleLogout = () => {
        logout()
        window.location.reload()
    }

    const renderMenu = () => {
        const jsx = menu.map((a,k)=>{
            return (
                <Menu.Item as='a' key={k} onClick={() => {
                    window.location.href=`${window.location.origin}${a.link}`
                }}>
                <Icon name={a.icon}/>{a.text}
                </Menu.Item>
            )
        })

        return jsx
    }

    const renderSideBar = () => {
        return (
            <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            onHide={handleSideBar}
            vertical
            visible={visible}
            width='thin'
            className="sidebarx"
            style={{backgroundColor: '#11708f'}}
            >
                <Header as='h4' icon textAlign='center' className="headtext">
                    <Header.Content>
                        {userDetails.name}
                        <Header.Subheader>
                            <i>{userDetails.role}</i>
                        </Header.Subheader>
                    </Header.Content>
                </Header>

                {renderMenu()}

                <Menu.Item as='a' className="last" onClick={handleLogout}>
                <Icon name="sign-out"/>
                Logout
                </Menu.Item>
                
            </Sidebar>
        )
    }

    return (
        <Sidebar.Pushable>
        {renderSideBar()}
        <Sidebar.Pusher dimmed={visible} style={{height: '100vh'}}>
            {children}
        </Sidebar.Pusher>
        </Sidebar.Pushable> 
    )
}

export default SidebarComponent