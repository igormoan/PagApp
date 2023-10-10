import TableCharges from './TableCharges'
import './style.css';
import { useState } from 'react';
import ChargeCustomer from '../../../../components/ChargeCustomer';
import SuccessMessage from '../../../../components/SuccessMessage';
import ErrorMessage from '../../../../components/ErrorMessage';

export default function CustomersCharges({ charges, customer, sortChargesId, sortChargesDate }) {
    const [addChargeOpen, setAddChargeOpen] = useState(false);

    return(
        <div>
            <TableCharges
                charges={charges}
                setAddChargeOpen={setAddChargeOpen}
                sortChargesId={sortChargesId}
                sortChargesDate={sortChargesDate}
                customer={customer}
                />
            {addChargeOpen &&
            <ChargeCustomer
                close={() => {setAddChargeOpen(false)}}
                customer={customer}
                mode='add'
                />}
            <SuccessMessage/>
            <ErrorMessage/>
        </div>
    )
}