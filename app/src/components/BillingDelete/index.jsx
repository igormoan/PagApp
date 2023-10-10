import './style.css'
import warning from './assets/warning.png'
import closeImg from './assets/close.png'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { billingServices } from '../../api/billingServices';
import { reactQueryHooks } from '../../services/reactquery';
import { UserContext } from '../../context/dashboard_context';
import { useContext } from 'react';

export default function DeleteBilling({ close, id }) {
    const queryClient = useQueryClient();
    const deleteChargeMutation = useMutation(id => billingServices.deleteCharge(id, reactQueryHooks.apiHeaders()), {
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['charges']);
        }
    });
    const {setErrorMessageContent, setOpenErrorMessage, setSuccessMessageContent, setOpenSuccessMessage} = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await deleteChargeMutation.mutateAsync(id);
            setSuccessMessageContent('Cobrança excluída com sucesso');
            setOpenSuccessMessage(true);
            return close();
        } catch (error) {
            setErrorMessageContent(error.response.data.mensagem)
            setOpenErrorMessage(true);
            return close();
        }

    }

    return (
        <>
            <div className='fade'>
                <div className='modal_delete_billing'>
                    <div className='button_close_modal_delete'>
                        <img src={closeImg} alt="Fechar modal" onClick={close} />
                    </div>
                    <img className='img_warning' src={warning} alt="Aviso" />
                    <p className='question_delete'>Tem certeza que deseja excluir esta cobrança?</p>
                    <div className='container_button_question'>
                        <button className='button_dontDelete' onClick={close}>Não</button>
                        <button type='submit' className='button_deleteBilling' onClick={handleSubmit}>Sim</button>
                    </div>
                </div>
            </div>
        </>
    )
}