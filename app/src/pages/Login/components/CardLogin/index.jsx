import './styles.css';
import { Link } from "react-router-dom";
import { useState } from 'react';
import { Button } from '@mui/material';

const buttonStyle = {
    marginTop: "1rem",
    cursor: "pointer",
    position: "relative",
    backgroundColor: "var(--principais-rosa-normal)",
    borderRadius: "0.8rem",
    boxShadow: "rgb(121, 18, 111) 0px 4px 0px 0px",
    padding: "1.3rem",
    backgroundRepeat: "no-repeat",
    boxSizing: "border-box",
    width: "9rem",
    height: "1.5rem",
    color: "#fff",
    border: "none",
    fontSize: "0.8rem",
    opacity: '0.9',
    transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
    overflow: "hidden",
    '&::before':{
        content: "''",
        position: "absolute",
        inset: "0",
        margin: "auto",
        width: "6rem",
        height: "6rem",
        scale: "0",
        zIndex: -1,
        backgroundColor: '#008000',
        transition: "all 0.6s cubic-bezier(0.23, 1, 0.320, 1)"
    },

    '&:hover::before':{
        scale: '3'
    },

    '&:hover': {
        backgroundColor: '#008000',
        scale: '1.1',
        opacity: '1',
        boxShadow: "rgb(0, 51, 0) 0px 4px 0px 0px",
    },
    '&:active': {
        scale: '1',
    },
  }
export default function CardLogin({ handleOnSubmit, loginError, setLoginError }) {

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [showPass, setShowPass] = useState(false);
    const [borderColor, setBorderColor] = useState('1px solid gray');
    const [errorMessage, setErrorMessage] = useState('');

    function handleOnChangeForm(e) {
        const { name, value } = e.target;
        
        setForm({...form, [name]: value});
    }

    function handleOnClick() {
        setShowPass(!showPass);
    }

    function handleSubmit(e){
        e.preventDefault();

        if (!form.email) {
            setLoginError('');
            setBorderColor('1px solid red');
            return setErrorMessage('Por favor preencha o campo de email!');
        }

        if (!form.password) {
            setLoginError('');
            setBorderColor('1px solid red');
            return setErrorMessage('Por favor preencha o campo de senha!')
        }

        setErrorMessage('');
        setLoginError('');

        setBorderColor('1px solid gray');   
        handleOnSubmit(form);
    }

    return(
        <form onSubmit={handleSubmit} className='login-container-form'>
            <h2> Faça seu login!</h2>
            <div>
                <label htmlFor="email"> E-mail</label>
                <input 
                type="text" 
                id="email" 
                placeholder='Digite seu e-mail'
                value={form.email}
                name='email'
                onChange={handleOnChangeForm}
                style={{ border: !form.email ? borderColor : '1px solid gray' }}
                />
            </div>
            <div>
                <label htmlFor="password"> Senha </label>
                <input
                type={ showPass ? "text" : "password"} 
                id='password' 
                placeholder='Digite sua senha'
                name='password'
                value={form.password}
                onChange={handleOnChangeForm}
                style={{ border: !form.password ? borderColor : '1px solid gray' }}
                />
                <img 
                src={ !showPass ? '/eye-close-pass.png' : '/eye-open-pass.png'} 
                className='eye-image'
                onClick={handleOnClick}
                />
                <Link className='link-forget-pass'>Esqueceu a senha?</Link>
            </div>
            { errorMessage &&
                <span className='login-error-message'> {errorMessage}</span>
            }
            { loginError &&
                <span className='login-error-message'> {loginError}</span>
            }
            <Button className='button-enter' sx={buttonStyle} type='submit'> Entrar </Button>
            <span className='sign-up-span'> Ainda não possui uma conta? <Link className='link-sign-up' to={`/cadastro`}> Cadastre-se</Link> </span>
        </form>
    )
}