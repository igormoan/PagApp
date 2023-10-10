import { useContext, useRef, useState } from "react";
import CheckButton from "../../pages/Customers/components/CheckButton";
import CloseIcon from "../../assets/icon-close.svg"
import LogoCharge from '../../assets/logo-charge.svg';
import "./styles.css";
import { billingServices } from "../../api/billingServices";
import { parse } from 'date-fns';
import { UserContext } from "../../context/dashboard_context";
import { reactQueryHooks } from "../../services/reactquery";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';


export default function ChargeCustomer({ close, customer, charge, mode }) {

    const [paid, setPaid] = useState(charge?.paid);
    const statusPaid = useRef(null);
    const name = useRef(null);
    const description = useRef(null);
    const vencimento = useRef(null);
    const [maskedValue, setMaskedValue] = useState(charge?.value);
    const [unmaskedValue, setUnmaskedValue] = useState(charge?.value);
    const moneyValue = useRef(null)
    const stateValue = useRef(null)
    const [validMessage, setValidMessage] = useState({
        state: false,
        description: false,
        maturity: false,
        value: false,
        conflit: false
    })
    const [textError, setTextError] = useState('')
    const queryClient = useQueryClient();

    const addChargeMutation = useMutation(data => billingServices.addCharge(data, reactQueryHooks.apiHeaders()), {
        onSuccess: () => queryClient.invalidateQueries(['transactions'])
    });

    const editChargeMutation = useMutation(data => billingServices.editCharge(data, reactQueryHooks.apiHeaders()), {
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['charges']);
        }
    });


    const handleValueChange = (e) => {
        let rawValue = e.target.value.replace(/\D/g, '');

        if (!rawValue) {
            setMaskedValue('');
            setUnmaskedValue(0);
            return;
        }

        const numericValue = parseFloat(rawValue) / 100;
        setUnmaskedValue(numericValue);

        const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue);
        setMaskedValue(formattedValue);
    };

    const { setSuccessMessageContent, setOpenSuccessMessage} = useContext(UserContext);

    const handleChangeStatus = ({ target }) => {
        if (target.id === "pago") {
            setPaid(true)
        }
        if (target.id === "devendo") {
            setPaid(false)
        }
        stateValue.current.style.border = 'none'
        setValidMessage({ state: false })
    };
    
    function borderInput(e) {
        e.target.style.border = '1px solid #DEDEE9'
        setValidMessage({ state: false, description: false, maturity: false, value: false })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = {
            id: charge?.id,
            client_id: customer.id,
            name: name.current.value,
            description: description.current.value,
            due_date: parse(vencimento.current.value, 'yyyy-MM-dd', new Date()),
            value: unmaskedValue,
            paid,
        };
        const operation = mode === 'add' ? addChargeMutation : editChargeMutation;
        try {
            const response = await operation.mutateAsync(form);
            setSuccessMessageContent('Cobrança cadastrada com sucesso');
            setOpenSuccessMessage(true);
            return close();
        } catch (error) {
            if (error.response.data.mensagem.includes('descrição')) {
                description.current.style.border = '1px solid red'
                setValidMessage({ description: true })
                setTextError(error.response.data.mensagem)
            }
            if (error.response.data.mensagem.includes('data')) {
                vencimento.current.style.border = '1px solid red'
                setValidMessage({ maturity: true })
                setTextError(error.response.data.mensagem)
            }
            if (error.response.data.mensagem.includes('valor')) {
                moneyValue.current.style.border = '1px solid red'
                setValidMessage({ value: true })
                setTextError(error.response.data.mensagem)
            }
            if (error.response.data.mensagem.includes('(pago/pendente)')) {
                stateValue.current.style.border = '1px solid red'
                setValidMessage({ state: true })
                setTextError(error.response.data.mensagem)
            }
            if (error.response.data.mensagem.includes('passado')) {
                setValidMessage({ conflit: true })
                setTextError(error.response.data.mensagem)
            }
        }
    };

    return (
        <div className="modal centerFlex" onClick={close} onSubmit={handleSubmit}>
            <div className="modalBox" onClick={(e) => e.stopPropagation()}>
                <div className="titleBox">
                    <h2 className="title">
                        <img src={LogoCharge} alt="LogoCharge" className="iconLogoCharge" />
                        {mode === 'add' ? 'Cadastro de Cobrança' : 'Edição de Cobrança'}
                    </h2>
                    <span className="icon" onClick={close}>
                        <img className="buttonClose" src={CloseIcon} alt="iconClose" />

                    </span>
                </div>
                <div className="content">
                    <form className="flex">
                        <label htmlFor="name">
                            <p className="inputDescription">Nome*</p>
                            <input onClick={borderInput} type="text" ref={name} id="name" value={charge ? charge.name : customer.name} readOnly={true} />
                        </label>

                        <label htmlFor="description">
                            <p className="inputDescription">Descrição*</p>
                            <textarea onClick={borderInput}
                                type="text"
                                ref={description}
                                id="description"
                                defaultValue={charge ? charge.description : ''}
                            ></textarea>
                            <span className={validMessage.description ? "alert_text" : 'hide'}>{textError}</span>
                        </label>
                        <div className="flexDoubleInLine">
                            <label htmlFor="">
                                <p className="inputDescription">Vencimento*</p>
                                <input onClick={borderInput} type="date" ref={vencimento} defaultValue={charge ? format(parseISO(charge.due_date), 'yyyy-MM-dd') : ''}/>
                                <span className={validMessage.maturity ? "alert_text" : 'hide'}>{textError}</span>
                            </label>
                            <label htmlFor="">
                                <p className="inputDescription">Valor*</p>
                                <input type="text" value={maskedValue} maxLength={13} onClick={borderInput}
                                    ref={moneyValue} onChange={handleValueChange}
                                    placeholder="R$0,00" />
                                <span className={validMessage.value ? "alert_text" : 'hide'}>{textError}</span>
                            </label>
                        </div>

                        <div className="specialDiv" >
                            <p className="inputDescription">Status*</p>

                            <div className="radiosFlexGroup" ref={stateValue}>
                                <label className="radioFlex" htmlFor="pago" ref={statusPaid} >
                                    <input
                                        type="radio"
                                        onClick={handleChangeStatus}
                                        name="status"
                                        id="pago"
                                    />
                                    <CheckButton status={paid === true} />
                                    <p className="status">Cobrança Paga</p>
                                </label>

                                <label className="radioFlex" htmlFor="devendo">
                                    <input
                                        type="radio"
                                        onClick={handleChangeStatus}
                                        name="status"
                                        id="devendo"
                                    />
                                    <CheckButton status={paid === false} />
                                    <p className="status">Cobrança Pendente</p>
                                </label>
                            </div>
                            <span className={validMessage.state ? 'alert_text' : 'hide'}>{textError}</span>
                        </div>
                        <span className={validMessage.conflit ? "alert_text" : 'hide'}>{textError}</span>
                        <div className="options">
                            <button className="button outline" onClick={close}>
                                Cancelar
                            </button>
                            <button className="button filled">Aplicar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}