import "./styles.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import CustomersTable from "./components/CustomersTable";
import CustomersHandle from "./components/CustomersHandle";
import SuccessMessage from "../../components/SuccessMessage";
import { useState, useEffect } from "react";
import { verifyInputSearch } from "../../utils/userData";
import { reactQueryHooks } from "../../services/reactquery";
import { useLocation } from "react-router-dom";

export default function Customers() {

  const location = useLocation();
const params = new URLSearchParams(location.search);
const statusFilter = params.get('status');


  const [hasSorted, setHasSort] = useState(false);
  const transactionsQuery = reactQueryHooks.getTransactions();
  const [customersFilter, setCustomersFilter] = useState(transactionsQuery.data?.data.customers || []);
  
  useEffect(() => {
    if (transactionsQuery.data) {
      const filteredCustomers = filterByStatus(statusFilter, transactionsQuery.data.data.customers);
      setCustomersFilter(filteredCustomers);
    }
  }, [transactionsQuery.data, statusFilter]);

function filterByStatus(status, customersData) {
  switch (status) {
    case 'Ok':
      return customersData.filter(customer => customer.status === 'Em dia');
    case 'Inadimplente':
      return customersData.filter(customer => customer.status === 'Inadimplente');
    default:
      return customersData;
  }
}

  if (transactionsQuery.isLoading) return;
  if (transactionsQuery.isError) return;

  const customersData = transactionsQuery.data.data.customers;

  function filterCustomersName(customerSearched) {
    const filterCustomers = customersData.filter((customer) => 
      verifyInputSearch(customer.name.toLowerCase(), customerSearched.toLowerCase()) ||
      verifyInputSearch(customer.email.toLowerCase(), customerSearched.toLowerCase()) ||
      verifyInputSearch(customer.cpf.toLowerCase(), customerSearched.toLowerCase())
      )
      
      setCustomersFilter(filterCustomers.sort((a, b) => {
        const indexA = a.name.toLowerCase().indexOf(customerSearched.toLowerCase());
        const indexB = b.name.toLowerCase().indexOf(customerSearched.toLowerCase());
        
        if (indexA < indexB) return -1;
        if (indexA > indexB) return 1;
        return 0;  
      }));
  }

  const sortCustomers = () => {
    if (!hasSorted) {
        customersFilter.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      setHasSort(true);
    } else {
      customersFilter.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA > nameB) return -1;
        if (nameA < nameB) return 1;
        return 0;
      });
      setHasSort(false);
    }
  }
  
  return (
    <div className="home-container">
      <Header />
      <div className="hero-section">
        <Sidebar />
        <div className="container-content">
          <SuccessMessage />
          <CustomersHandle
          filterCustomersName={filterCustomersName}
          />
          <CustomersTable
          customersData={customersData}
          customersFilter={customersFilter}
          sortCustomers={sortCustomers}
          />
        </div>
      </div>
    </div>
  );
}
