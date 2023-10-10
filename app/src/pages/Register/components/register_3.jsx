import '../style.css'
import big_ok from '../assets/big_ok.png'
import { Link } from 'react-router-dom'
export default function Register_3() {
    return (
        <>
            <div className='sucess'>
                <img src={big_ok} alt="OK" />
                <p>Cadastro realizado com sucesso</p>
            </div>
            
        </>
    )
}