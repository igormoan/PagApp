import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import './styles.css';
import BillingTable from './components/BillingTable';
import BillingHandle from './components/BillingHandle';
import { useState, useEffect } from 'react';
import { verifyInputSearch } from '../../utils/userData';
import { reactQueryHooks } from '../../services/reactquery';
import SuccessMessage from '../../components/SuccessMessage';
import ErrorMessage from '../../components/ErrorMessage';
import { useLocation } from 'react-router-dom';


export default function Billing() {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const statusFilter = params.get('status');


    const [hasSorted, setHasSorted] = useState(false);
    const chargesQuery = reactQueryHooks.getCharges();
    const [chargesFilter, setChargesFilter] = useState(chargesQuery.data?.data.allCharges || []);
    
    const allCharges = chargesQuery.data?.data.allCharges;

    function filterByStatus(charges, status) {
      if (!status || !charges) return charges;  
      return charges.filter(charge => charge.status === status);
  }

  useEffect(() => {
    const filteredCharges = statusFilter ? filterByStatus(allCharges, statusFilter) : allCharges || [];
    setChargesFilter(filteredCharges);
  }, [chargesQuery.data, statusFilter]);
  
    if (chargesQuery.isLoading) return;
    if (chargesQuery.isError) return;
    

    function filterCharges(chargeSearched) {
      const chargesFiltered = allCharges.filter((charge) => 
        verifyInputSearch(charge.name.toLowerCase(), chargeSearched.toLowerCase()) ||
        `${charge.id}`.indexOf(chargeSearched) >= 0
        )

      const filteredSortedCharges = (chargesFiltered.sort((a, b) => {
        const indexA = a.name.toLowerCase().indexOf(chargeSearched.toLowerCase());
        const indexB = b.name.toLowerCase().indexOf(chargeSearched.toLowerCase());
        if (indexA < indexB) return -1;
        if (indexA > indexB) return 1;
        return 0;  
        }));
      setChargesFilter(filteredSortedCharges);
      return filteredSortedCharges;
    }

    const handleSortChargesCustomer = () => {
      if (!hasSorted) {
          chargesFilter.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        setHasSorted(true);
      } else {
        chargesFilter.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          if (nameA > nameB) return -1;
          if (nameA < nameB) return 1;
          return 0;
        });
        setHasSorted(false);
      }
    }

    const handleSortChargesId = () => {
      if (!hasSorted) {
        chargesFilter.sort((a, b) => {
        const nameA = a.id;
        const nameB = b.id;
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      setHasSorted(true);
    } else {
      chargesFilter.sort((a, b) => {
        const nameA = a.id;
        const nameB = b.id;
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
        return 0;
      });
      setHasSorted(false);
    }
  }



    return (
        <div className='home-container'>
            <Header />
            <div className='hero-section'>
                <Sidebar />
                <div className="container-content">
                   <BillingHandle
                   filterCharges={filterCharges}/>
                   <BillingTable
                   allCharges={allCharges}
                   chargesFilter={chargesFilter}
                   handleSortChargesCustomer={handleSortChargesCustomer}
                   handleSortChargesId={handleSortChargesId}
                   />
                   <SuccessMessage/>
                   <ErrorMessage/>
                </div>
            </div>
        </div>
    );

}
