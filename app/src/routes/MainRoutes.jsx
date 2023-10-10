import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';
import Customers from '../pages/Customers';
import Login from '../pages/Login';
import Billing from '../pages/Billing'
import { clearItems, getItem } from '../utils/storage';
import { useEffect, useState } from 'react';
import Register from '../pages/Register';
import { api } from '../services/api'
import { UserContext } from '../context/dashboard_context';
import ClientsDetails from '../pages/ClientsDetails';
import SuccessMessage from '../components/SuccessMessage';
import ErrorMessage from '../components/ErrorMessage';

export default function MainRoutes(){
    const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
    const [successMessageContent, setSuccessMessageContent] = useState('');
    const [openErrorMessage, setOpenErrorMessage] = useState(false);
    const [errorMessageContent, setErrorMessageContent] = useState('');

    const navigate = useNavigate();
        
    async function getAuth() {
        const token = getItem('token');
        if (!token) return makeLogout();
        try {
            const response = await api.get('/user', { headers: { Authorization: `Bearer ${token}` } });
            if (response.data.user) {
                const {id, name, email, phone, cpf} = response.data.user;
                return setUser({ id, name, email, phone, cpf });
            }
    
        } catch (error) {
            makeLogout();
        }
        return;
    }
    
    function makeLogout() {
        clearItems();
        navigate('/')
        return setUser(null);
    }    

    const [user, setUser] = useState(false);


    useEffect(() => {
        getAuth();
    }, []);

    function CommonRoutes({ redirectTo = '/' }) {         
        const token  = getItem('token');
        return !token ? <Navigate to={redirectTo} /> : <Outlet/> 
    }

    function AuthenticatedRoutes({ redirectTo = '/home' }) {         
        const token  = getItem('token');
        return token ? <Navigate to={redirectTo} />
        :   <div>
                <SuccessMessage/>
                <ErrorMessage/>
                <Outlet/> 
            </div>
    }
    
    return (
      <UserContext.Provider value={{ user, setUser, openSuccessMessage, setOpenSuccessMessage, successMessageContent, setSuccessMessageContent, openErrorMessage, setOpenErrorMessage, errorMessageContent, setErrorMessageContent }}>
            <Routes>
                <Route element={<AuthenticatedRoutes />}>
                    <Route path='/' element={<Login />} />
                    <Route path='/cadastro' element={<Register />} />
                </Route>
                <Route element={(<CommonRoutes />)}>
                    <Route path='/home' element={<Home />} />
                    <Route path='/clientes' element={<Customers />}/>
                    <Route path='/clientes/:id' element={<ClientsDetails/>}/>
                    <Route path='/cobrancas' element={<Billing />} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}