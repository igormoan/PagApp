import './style.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import small_ok from './assets/small_ok.png'
import Register_1 from './components/register_1'
import Register_2 from './components/register_2'
import Register_3 from './components/register_3'
import { api } from '../../services/api'
import dateRegister from './context/CadastroContext'
export default function Register() {
    const [loading, setLoading] = useState(false)
    const [erroServ, setErroServ] = useState(false)
    const [stage, setstage] = useState(false)
    const [stageTwo, setstageTwo] = useState(false)
    const [stageEnd, setstageEnd] = useState(false)
    const [textAlert, setTextAlert] = useState(false)
    const [typeButton, setTypeButton] = useState('button')
    const [textButton, setTextButton] = useState('Continuar')
    const [confirm_password, setconfirm_password] = useState('')
    const [hideText, setHideText] = useState(false)
    const [error_validation, setErrorValidation] = useState({ name: false, email: false, password: false, confirmPass: false })
    const [sendForm, setSendForm] = useState({
        name: '', email: '', password: ''
    })
    const navigate = useNavigate()

    async function requestRegister() {
        try {
            const response = await api.post('/signup', sendForm)
            if (response.status === 200) {
                setstageTwo(false)
                setstageEnd(true)
                setTimeout(() => {
                    navigate('/')
                }, 3000);
            }
        } catch (error) {
            if (error.message === 'Network Error') {
                setErroServ(true)
            }
            if (error.response.status === 400) {
                setstage(false)
                setstageTwo(false)
                setTextButton('Continue')
                setTypeButton('button')
                setSendForm({ ...sendForm, password: '' })
                setconfirm_password('')
                setErrorValidation({ email: true })
                setHideText(true)
                setTextAlert('E-mail já cadastrado.')
            }
        }
    }

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email)
    }
    function inputChange(e) {
        setSendForm({ ...sendForm, [e.target.name]: e.target.value })
    }
    function renderStage() {
        if (sendForm.name === '' && sendForm.email === '') {
            setErrorValidation({ email: true, name: true })
            setHideText(true)
            setTextAlert('Todos os campos são obrigatórios')
        }
        if (sendForm.name === '' && sendForm.email !== '') {
            setErrorValidation({ name: true, email: false })
            setHideText(true)
            setTextAlert('Nome é obrigatório')
        }
        if (sendForm.name !== '' && sendForm.email === '') {
            setErrorValidation({ email: true, name: false })
            setHideText(true)
            setTextAlert('E-mail é obrigatório')
        }
        if (sendForm.email !== '') {
            if (!validateEmail(sendForm.email)) {
                setErrorValidation({ email: true, name: false })
                setHideText(true)
                setTextAlert('Insira um email válido, exemplo: "email@email.com"')
            }
        }
        if (sendForm.email !== '' && sendForm.name !== '') {
            if (validateEmail(sendForm.email)) {
                setstage(true)
                setstageTwo(true)
                setTextButton('Finalizar cadastro')
            }
        }
        if (stageTwo) {
            if (sendForm.password === '' || confirm_password === '') {
                setErrorValidation({ password: true, confirmPass: true })
                setHideText(true)
                setTextAlert('Campo de senhas vazios')
            }
            if (sendForm.password !== '' && confirm_password === '') {
                setErrorValidation({ password: false, confirmPass: true })
                setHideText(true)
                setTextAlert('Digite sua senha novamente')
            }
            if (sendForm.password === '' && confirm_password !== '') {
                setErrorValidation({ password: true, confirmPass: false })
                setHideText(true)
                setTextAlert('Digite aqui sua senha')
            }
            if (sendForm.password !== '') {
                if (sendForm.password.length < 8) {
                    setErrorValidation({ password: true, confirmPass: true })
                    setHideText(true)
                    setTextAlert('Senha precisa ter no mínimo 8 dígitos')
                }
            }
            if (sendForm.password !== '' && confirm_password !== '') {
                if (sendForm.password !== confirm_password) {
                    setErrorValidation({ password: true, confirmPass: true })
                    setHideText(true)
                    setTextAlert('As senhas não coincidem')
                }
            }
            if (sendForm.password === confirm_password) {
                if (sendForm.password !== '') {
                    if (sendForm.password.length >= 8 && confirm_password.length >= 8) {
                        setLoading(true)
                        setTypeButton('submit')
                        requestRegister()
                    }
                }
            }
        }
        setTimeout(() => {
            setLoading(false)
        }, 2500);
    }
    return (
        <dateRegister.Provider value={{ stage, setstage, stageTwo, setstageTwo, stageEnd, setstageEnd, typeButton, setTypeButton, textButton, setTextButton, sendForm, setSendForm, requestRegister, renderStage, inputChange, setconfirm_password, confirm_password, textAlert, hideText, setHideText, error_validation, setErrorValidation, loading, erroServ }}>
            <div className='container_register'>
                <div className='container_stages'>
                    <div className='stages'>
                        <div className='checkeds'>
                            <span className='checked_1'>
                                {stage ? <img src={small_ok} alt="OK" /> : <span className='checked_2'></span>}
                            </span>
                            <span className='line'></span>
                            <span className={stage ? 'checked_1' : 'no_checked'}>
                                {stageEnd ? <img src={small_ok} alt="Ok" /> : <span className={stage ? 'checked_2' : 'no_checked_2'}></span>}
                            </span>
                            <span className='line'></span>
                            <span className={stageEnd ? 'checked_1' : 'no_checked'}>
                                {stageEnd ? <img src={small_ok} alt="OK" /> : <span className='no_checked_2'></span>}
                            </span>
                        </div>
                        <div className='info_stages'>
                            <div>
                                <p>Cadastre-se</p>
                                <span>Por favor, escreva seu nome e e-mail</span>
                            </div>
                            <div>
                                <p>Escolha uma senha</p>
                                <span>Escolha uma senha segura</span>
                            </div>
                            <div>
                                <p>Cadastro realizado com sucesso</p>
                                <span>E-mail e senha cadastrados com sucesso</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={stageEnd ? 'container_form_end' : 'forms'} >
                    <form className={!stageEnd ? 'form' : 'form_end'} onSubmit={(e) => e.preventDefault()}>
                        {!stage ? <Register_1 /> : ''}
                        {stage && stageTwo ? <Register_2 /> : ''}
                        {stageEnd ? <Register_3 /> : ''}
                    </form>
                    <div className='line_hori'>
                        <span className={!stage ? 'current_stage' : 'span'}></span>
                        <span className={stageTwo ? 'current_stage' : 'span'}></span>
                        <span className={stageEnd ? 'current_stage' : 'span'}></span>
                    </div>
                </div>
            </div>
        </dateRegister.Provider>
    )
}