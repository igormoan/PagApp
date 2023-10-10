import '../style.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import dateRegister from '../context/CadastroContext'
import { BarLoader } from 'react-spinners'

export default function Register_2() {
    const date = useContext(dateRegister)
    return (
        <>
            {date.loading ? <BarLoader width={400} loading={date.loading} color='#0E8750'>
            </BarLoader> : <>{date.erroServ ? <>
                <h1 className='title_erro'>Oops! Ocorreu um erro!</h1>
                <p className='message_erro'>"Fique tranquilo,estamos cientes e trabalhando na correção."</p>
                <p className='end_text_erro'>Tente novamente mais tarde!</p>
            </> : <><h1>Escolha sua senha</h1>
                <label htmlFor='password' className='label'>Senha*
                    <input type="password" name='password' onChange={date.inputChange} onClick={() => date.setHideText(false)} value={date.sendForm.password} id={date.hideText && date.error_validation.password ? 'error_password' : 'password'} minLength={8} maxLength={25} />
                    <span className={date.hideText && date.error_validation.password ? 'feedback' : 'hide'}>{date.textAlert}</span>
                </label>
                <label htmlFor='confirmacao_password' className='label'>Repita a senha*
                    <input type="password" value={date.confirm_password} onClick={() => date.setHideText(false)} onChange={(e) => date.setconfirm_password(e.target.value)} id={date.hideText && date.error_validation.confirmPass ? 'error_password_2' : 'confirmacao_password'} minLength={8} maxLength={25} />
                    <span className={date.hideText && date.error_validation.confirmPass ? 'feedback' : 'hide'}>{date.textAlert}</span>
                </label>
                <button onClick={date.renderStage} type={date.typeButton}>{date.textButton}</button>
                <p>Já possui uma conta? <Link to={'/'} className='link_login'>Faça o Login</Link></p></>}
            </>}
        </>
    )
}