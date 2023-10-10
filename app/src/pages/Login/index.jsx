import './styles.css';
import CardLogin from './components/CardLogin';
import { UsersServices } from '../../api/UsersServices';
import { setItem } from '../../utils/storage';
import { useState } from 'react';
import LoginAnimation from './components/LoginAnimation';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState('');
    const [openLoading, setOpenLoading] = useState(false);

    const handleCloseLoading = () => {
      setOpenLoading(false);
    };

    const handleOpenLoading = () => {
      setOpenLoading(true);
    };

    async function handleOnSubmit(form) {
       
        try {
            handleOpenLoading();
            const { data } = await UsersServices.loginUser(form);
            const token = data.token;
            setItem('token', token);

            navigate('/home');

            const userDataJSON = JSON.stringify(data.user);
            setItem('user', userDataJSON);

            handleCloseLoading();
        } catch (error) {
            handleCloseLoading();
            setLoginError('Credenciais inválidas!');
        }
    }

    return (
        <div className='login-container-main'>
            <LoginAnimation
            handleOpenLoading={handleOpenLoading}
            handleCloseLoading={handleCloseLoading}
            openLoading={openLoading}
            />
            <div className='login-container-left'>
                <span>
                Gerencie todos os pagamentos
                <br/>da sua empresa em um só
                <br/>
                 lugar.
                </span>
            </div>
            <CardLogin
            handleOnSubmit={handleOnSubmit}
            loginError={loginError}
            setLoginError={setLoginError}
            />
        </div>
    )
}