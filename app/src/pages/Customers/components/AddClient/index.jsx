import './style.css';
import icon_person from './assets/icon_person.png';
import close from './assets/close.png';
import { useState, useRef, useContext } from 'react';
import { customersServices } from '../../../../api/customerServices';
import { getItem } from '../../../../utils/storage';
import { UserContext } from '../../../../context/dashboard_context';
import InputMask from 'react-input-mask';
import { reactQueryHooks } from '../../../../services/reactquery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { formatCep } from '../../../../utils/userData';

export default function AddClient({ setModalOpen, setSuccessMessageOpen }) {

    const queryClient = useQueryClient();
    const { setOpenSuccessMessage, setSuccessMessageContent } = useContext(UserContext);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',  
        cpf: '',
        phone: '',
        address: '',
        complement: '',
        zip: '',
        district: '',
        city: '',
        state: ''
    });

    const handleCepBlur = () => {
        const formattedCep = formatCep(newCustomer.zip);
        if (formattedCep.length === 8) {
          axios.get(`https://viacep.com.br/ws/${formattedCep}/json/`)
            .then(response => {
              const data = response.data;
              if (!data.erro) {
                setNewCustomer({...newCustomer, city: data.localidade, district: data.bairro, state: data.uf})
              }
            })
            .catch(error => {
              return null;
            });
        }
      };

    const states_acronym = ["AC", "AL", "AP", "AM", "BA", "CE", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ]

    const [errorMessage, setErrorMessage] = useState('');
    const [errorState, setErrorState] = useState({ cpf: false, phone: false })

    const nameRef = useRef();
    const emailRef = useRef();

    const addCustomerMutation = useMutation(data => customersServices.addCustomer(data, reactQueryHooks.apiHeaders()), {
        onSuccess: () => queryClient.invalidateQueries(['transactions'])
    });
    

    const allRefs = [nameRef, emailRef];

    function handleInput(event) {
        event.preventDefault();
        setNewCustomer({ ...newCustomer, [event.target.name]: event.target.value })
    }

    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email)
    }

    function borderSubmit(e) {
        e.target.style.border = '1px solid #D0D5DD'
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage('');
        const newErrorState = { cpf: false, phone: false };
        allRefs.forEach(ref => ref.current.style.borderColor = '#D0D5DD');

        if (newCustomer.name.length < 3) {
            nameRef.current.style.border = '1px solid red';
            return setErrorMessage('O nome é obrigatório e precisa ter pelo menos 3 caracteres');
        }
        if (!newCustomer.email) {
            emailRef.current.style.border = '1px solid red';
            return setErrorMessage('O email é obrigatório');
        }

        if (newCustomer.email !== '') {
            if (!validateEmail(newCustomer.email)) {
                emailRef.current.style.border = '1px solid red';
                return setErrorMessage('Insira um email válido');
            }
        }

        if (newCustomer.cpf.replace('_', '').length < 14) {
            setErrorState({ ...newErrorState, cpf: true })
            return setErrorMessage('O CPF é obrigatório');
        }

        if (newCustomer.phone.replace('_', '').length < 19) {
            setErrorState({ ...newErrorState, phone: true })
            return setErrorMessage('O telefone é obrigatório');
        }

        try {
            const data = { ...newCustomer, user_id: JSON.parse(getItem('user')).id, zip: newCustomer.zip.replace('-', '').replace('_', '') };
            const response = await addCustomerMutation.mutateAsync(data);
            handleClose(event);
            setSuccessMessageContent('Cadastro concluído com sucesso')
            setOpenSuccessMessage(true);

        } catch (error) {
            if (error.response.data.code === '23505') {
                if (error.response.data.detail.includes('email')) {
                    emailRef.current.style.border = '1px solid red';
                    setErrorMessage('Email informado já existe!');
                    return
                }
                if (error.response.data.detail.includes('cpf')) {
                    setErrorState({ ...newErrorState, cpf: true })
                    setErrorMessage('CPF informado já existe!');
                    return
                }
            }
        }
    }

    function handleClose(event) {
        event.stopPropagation();
        setModalOpen(false);
    }

    return (

        <div className='container_modal_client'>
            <div className='fade_modal_client' onClick={handleClose} />
            <div className='modal_client_add' onClick={(e) => e.stopPropagation()}>
                <img className='button_close_client' onClick={handleClose} src={close} alt="fechar" style={{ cursor: 'pointer' }} />
                <div className='title_modal_client'>
                    <img src={icon_person} alt="person" />
                    <h3>Cadastro do Cliente</h3>
                </div>
                <form className='form_client'>
                    <label htmlFor="name">Nome*
                        <input type="text" name='name' onClick={borderSubmit} ref={nameRef} onChange={handleInput} required />
                    </label>
                    <label htmlFor="email">E-mail*
                        <input type="email" name='email' onClick={borderSubmit} ref={emailRef} onChange={handleInput} required />
                    </label>
                    <div className='inputs_cpf_phone'>
                        <label htmlFor="cpf">CPF*
                            <InputMask className={errorState.cpf ? 'addclienterror' : ''}
                                mask='999.999.999-99' name='cpf'
                                onChange={handleInput} required
                                placeholder='___.___.___-__'
                            />
                        </label>
                        <label htmlFor="phone">Telefone*
                            <InputMask className={errorState.phone ? 'addclienterror' : ''}
                                mask='+55 (99) 99999-9999' name='phone'
                                onChange={handleInput} required
                                placeholder='+55 (    ) _____-____'
                            />
                        </label>
                    </div>
                    <label htmlFor="address">Endereço
                        <input type="text" name='address' onChange={handleInput} />
                    </label>
                    <label htmlFor="complement">Complemento
                        <input type="text" name='complement' onChange={handleInput} />
                    </label>
                    <div className='inputs_cep_district'>
                        <label htmlFor="zip">CEP
                            <InputMask
                                value={newCustomer.zip}
                                onBlur={handleCepBlur}
                                mask='99999-999' name='zip'
                                onChange={handleInput}
                                placeholder='_____-___'
                            />
                        </label>
                        <label htmlFor="district">Bairro
                            <input value={newCustomer.district} type="text" name='district' onChange={handleInput} />
                        </label>
                    </div>
                    <div className='inputs_city_state'>
                        <label htmlFor="city">Cidade
                            <input value={newCustomer.city} type="text" id='city' name='city' onChange={handleInput} />
                        </label>
                        <label htmlFor="state">UF
                            <select value={newCustomer.state} onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value.replaceAll(',', '') })} name="state" id="state">
                                {states_acronym.map((uf) => 
                                    (
                                    <option key={uf} value={uf}> {uf} </option>
                                    )
                                )}
                            </select>

                        </label>
                    </div>
                    <div className='buttons_modal_client'>
                        <button type='button' className='cancel_register_client' onClick={handleClose}>Cancelar</button>
                        <button type='submit' className='apply_register_client' onClick={handleSubmit}>Aplicar</button>
                    </div>
                    <div
                        style={
                            {
                                color: 'red', textAlign: 'center',
                                position: 'absolute', bottom: '20px',
                                left: '0%', width: '100%'
                            }}>
                        <strong >{errorMessage}</strong>
                    </div>
                </form>
            </div>
        </div>
    )
}