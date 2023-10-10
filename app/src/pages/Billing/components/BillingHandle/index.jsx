import { useState } from 'react';
import './style.css';

export default function BillingHandle({filterCharges}) {

    const [chargeSearch, setChargeSearch] = useState();
    const handleOnChangeSearch = (e) => setChargeSearch(e.target.value);
    const handleFilterCharges = () => filterCharges(chargeSearch);

    return (
        <> 
        <div className="main-container-billing-handle">
            <div className='container-billing-title'>
                <img src="/billing-icon.svg" alt="icon-billing" />
                <h2> Cobranças</h2>
            </div>
            <div className='container-billing-right'>
                <div className='container-billing-input'>
                    <input onKeyUp={handleFilterCharges} onChange={handleOnChangeSearch} value={chargeSearch} placeholder='Pesquisa' type="text" />
                    <img onClick={handleFilterCharges} src="/search-input.svg" alt="" />
                </div>
                <img className='billing-icon' src="/customer-filter.svg" alt="filter" />
            </div>
        </div>
        </>
    )
}