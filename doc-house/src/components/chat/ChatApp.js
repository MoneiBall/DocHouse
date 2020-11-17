import React, {useEffect, useState} from 'react'
import "../../App.css";
import Sidebar from './Sidebar';
import Chat from './Chat';
import axios from '../../axios';
import Navbar from '../general/Navbar';
import UserContext from '../../context/userContext';

function ChatApp() {
    const [user, setUser] = useState({});
    // console.log(user);

    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        // console.log(token);
        const checkAuth = async () => {
            const userRes = await axios.post("http://localhost:5000/general/tokenIsValid",null, {
                headers: { "x-auth-token": token },
            });
            setUser({...userRes.data.result, type: userRes.data.type});
        }
        
        checkAuth();
    }, []);

    return (
        <UserContext.Provider value = {{user}}>
            <div> 
                <Navbar />
                <div className="app"> 
                    <div className="app__body">
                        <Sidebar/>
                        <Chat/>
                    </div>
                </div>
            </div>
        </UserContext.Provider>
    )
}

export default ChatApp