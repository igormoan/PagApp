import './style.css';
import AddClient from '../AddClient';
import { useState, useContext } from 'react';
import { UserContext } from '../../../../context/dashboard_context'

export default function CustomersHandle({ filterCustomersName }) {

    const [modalOpen, setModalOpen] = useState(false);
    const {
        successMessageContent, setSuccessMessageContent,
        openSuccessMessage, setOpenSuccessMessage
    } = useContext(UserContext);

    const [inputSearch, setInputSearch] = useState('');
    const handleOnSearch = () => filterCustomersName(inputSearch);
    const handleOnChange = (e) => setInputSearch(e.target.value);
    
    return (
        <>
        {modalOpen && <AddClient setModalOpen={setModalOpen} setOpenSuccessMessage={setOpenSuccessMessage}/>}
        <div className="main-container-customers-handle">
            <div className='container-customers-title'>
                <img src="/customer-icon.svg" alt="icon-customer" />
                <h2> Clientes</h2>
            </div>
            <div className='container-customers-right'>
                <button className='add-customer-button' onClick={() => setModalOpen(true)}> + Adicionar cliente</button>
                <img className='customers-filter' src="/customer-filter.svg" alt="filter" />
                <div className='container-customers-input'>
                    <input 
                    placeholder='Pesquisa' 
                    type="text"
                    value={inputSearch}
                    onKeyUp={handleOnSearch}
                    onChange={handleOnChange} />
                    <img onClick={handleOnSearch} src="/search-input.svg" alt="" />
                </div>
            </div>
        </div>
        </>
    )
}