import '../style.css'
import { Link } from 'react-router-dom'
import dateRegister from '../context/CadastroContext'
import { useContext } from 'react'

export default function Register_1() {
    const date = useContext(dateRegister)
    return (
        <>
            <h1>Adicione seus dados</h1>

            <label htmlFor='nome' className='label'>Nome*
                <input type="text" name='name' value={date.sendForm.name} onClick={() => date.setHideText(false)} onChange={date.inputChange} placeholder='Digite seu nome' id={date.hideText && date.error_validation.name ? 'error_nome' : 'nome'} />
                <span className={date.hideText && date.error_validation.name ? 'feedback error_nome' : 'hide'}>{date.textAlert}</span>
            </label>

            <label htmlFor='email' className='label'>E-mail*
                <input type='email' name='email' value={date.sendForm.email} onClick={() => date.setHideText(false)} onChange={date.inputChange} placeholder='Digite seu e-mail' id={date.hideText && date.error_validation.email ? 'error_email' : 'email'} />
                <span className={date.hideText && date.error_validation.email ? 'feedback error_email' : 'hide'}>{date.textAlert}</span>
            </label>

            <button onClick={date.renderStage} type={date.typeButton}>{date.textButton}</button>
            <p>Já possui uma conta? <Link to={'/'} className='link_login'>Faça o Login</Link></p>
        </>
    )
}