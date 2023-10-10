import style from './style.module.scss';
import icon_client from './assets/icon_person.svg';
import close from './assets/close.png';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';

export default function EditClient({ setOpenModal, fetchEditCustomer, customerData }) {

    const [formClient, setFormClient] = useState({
        id: "",
        name: "",
        email: "",
        cpf: "",
        phone: "",
        zip: "",
        address: "",
        complement: "",
        district: "",
        city: "",
        state: "",
      });

      function handleInputClick(event) {
        event.target.setSelectionRange(0,0);
        event.target.focus();
      }

    useEffect(() =>{
        setFormClient(customerData);
    }, []) 

    function valuesInputs(e) {
        setFormClient({ ...formClient, [e.target.name]: e.target.value })
    }

    async function handleOnSubmitEditCustomer(e){
        e.preventDefault();
        
        const { name, email, cpf, phone} = formClient;
        if (!name, !email, !cpf, !phone) return alert('preencha os campos obrigatórios');

        try {
            const response = await fetchEditCustomer(formClient);
        } catch (error) {
        }
    }

    return (
        <div className={style.container_modal_edit}>
            <div className={style.fade}></div>
            <div className={style.modal}>
                <div className={style.title}>
                    <div>
                        <img src={icon_client} alt="icone" />
                        <h1>Editar Cliente</h1>
                    </div>
                    <img src={close} onClick={() => setOpenModal(false)} className={style.closebtn} alt="fechar" />
                </div>
                <form onSubmit={handleOnSubmitEditCustomer}>
                    <label htmlFor="name">Nome*
                        <input name='name' onChange={valuesInputs} value={formClient.name ?? ''} type="text" id='name' />
                    </label>
                    <label htmlFor="email">E-mail*
                        <input name='email' onChange={valuesInputs} value={formClient.email ?? ''} type="email" id='email' />
                    </label>

                    <div className={style.cpf_phone}>
                        <label htmlFor="cpf">CPF*
                        <InputMask
                                mask='999.999.999-99' name='cpf' id='cpf'
                                onChange={valuesInputs} required
                                placeholder='___.___.___-__' value={formClient.cpf ?? ''}
                                onClick={handleInputClick}
                            />
                        </label>
                        <label htmlFor="phone">Telefone*
                            <InputMask
                                mask='+55 (99) 99999-9999' name='phone' id='phone'
                                onChange={valuesInputs} required
                                placeholder='+55 (    ) _____-____'
                                value={formClient.phone ?? ''}
                            />
                        </label>
                    </div>
                    <label htmlFor="street">Endereço
                        <input name='address' onChange={valuesInputs} value={formClient.address ?? ''} type="text" id='address' />
                    </label>
                    <label htmlFor="complement">Complemento
                        <input name='complement' onChange={valuesInputs} value={formClient.complement ?? ''} type="text" id='complement' />
                    </label>
                    <div className={style.cep_neighborhood}>
                        <label htmlFor="zip">CEP
                            <InputMask
                                mask='99999-999' name='zip' id='zip'
                                onChange={valuesInputs}
                                placeholder='_____-___'
                                value={formClient.zip ?? ''}
                            />
                        </label>
                        <label htmlFor="district">Bairro
                            <input name='district' onChange={valuesInputs} value={formClient.district ?? ''} type="text" id='district' />
                        </label>
                    </div>
                    <div className={style.city_UF}>
                        <label htmlFor="city" className={style.city}>Cidade
                            <input name='city' onChange={valuesInputs} value={formClient.city ?? ''} type="text" id='city' />
                        </label>
                        <label htmlFor="state" className={style.uf}>UF
                            <input name='state' onChange={valuesInputs} value={formClient.state ?? ''} type="text" id='state' />
                        </label>
                    </div>
                    <div className={style.buttons_editClient}>
                        <button onClick={ () => setOpenModal(false)} type='button' className={style.cancel}>Cancelar</button>
                        <button type='submit' onSubmit={handleOnSubmitEditCustomer} className={style.apply}>Aplicar</button>
                    </div>
                </form>
            </div >
        </div >
        )
}