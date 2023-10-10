import './style.css'
import closeIcon from './assets/close.png'
import icon_page from './assets/page.png'
import { format } from 'date-fns'
import formatBRL from '../../utils/currency'

export default function DetailsBilling({ close, charge }) {
    return (
        <>
            <div className="fade">
                <div className="modal_details_billing">
                    <div className="close_button_details_modal">
                        <img className='close_details_billing' onClick={close} src={closeIcon} alt="Botão fechar" />
                    </div>
                    <div className="icon_title">
                        <img src={icon_page} alt="icone de página" />
                        <h4 className='text_title'>Detalhe da Cobrança</h4>
                    </div>
                    <div className="name_details_billing">
                        <h4 className='topic'>Nome</h4>
                        <span className='text_name'>{charge.name}</span>
                    </div>
                    <div className="description_details_billing">
                        <h4 className='topic'>Descrição</h4>
                        <span className='text_description'>{charge.description || 'N/A'}</span>
                    </div>
                    <div className="maturity_value">
                        <div className="maturity">
                            <h4 className='topic'>Vencimento</h4>
                            <span className='date_maturity'>{format(new Date(charge.due_date), 'dd/MM/yyyy')}</span>
                        </div>
                        <div className='value'>
                            <h4 className='topic'>Valor</h4>
                            <span className='value_billing'>{formatBRL(charge.value)}</span>
                        </div>

                    </div>
                    <div className="id_status">
                        <div className="id">
                            <h4 className='topic'>ID Cobranças</h4>
                            <span className='value_id_billing'>{charge.id}</span>
                        </div>
                        <div className="status_billing">
                            <h4 className='topic'>Status</h4>
                            <div className={`billingtable-tag billingtable-${charge.status === 'Paga' ? 'paid'
                      : charge.status === 'Vencida' ? 'overdue'
                        : 'payable'}-tag`}>

                      {charge.status}
                    </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}