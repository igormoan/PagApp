import "./styles.css";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import React, { useContext, useState } from "react";
import EditClient from "./components/EditCostumer";
import { UserContext } from "../../context/dashboard_context";
import { customersServices } from "../../api/customerServices";
import { useParams } from "react-router-dom";
import CustomerCharges from './components/CustomersCharges';
import { reactQueryHooks } from "../../services/reactquery";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import SuccessMessage from "../../components/SuccessMessage";

export default function ClientsDetails() {
  const [hasSorted, setHasSort] = useState(false);
  const [hasSortedDate, setHasSortDate] = useState(false);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { setOpenSuccessMessage, setSuccessMessageContent } = useContext(UserContext);
  const [openModal, setOpenModal] = useState(false);

  const customerQuery = reactQueryHooks.sendCustomer(id);


  const editCustomerMutation = useMutation(data => customersServices.editCustomer(data, reactQueryHooks.apiHeaders()), {
    onSuccess: () => queryClient.invalidateQueries(['transactions'])
});

if (customerQuery.isLoading) return;
if (customerQuery.isError) return;
const charges = customerQuery.data.data.billing;
const customerData = customerQuery.data.data.customer[0];


  async function fetchEditCustomer(dataClient) {
    try {
        const response = await editCustomerMutation.mutateAsync(dataClient);
        setOpenSuccessMessage(true);
        setSuccessMessageContent('Edições de cadastro concluídas com sucesso');
        setOpenModal(false);
        
        } catch (error) {
        setOpenSuccessMessage(false);
    }
  }

  const sortChargesId = () => {
    if (!hasSorted) {
      charges.sort((a, b) => {
      const idA = a.id;
      const idB = b.id;

      if(idA > idB) return 1
      if (idA <idB) return -1
      return 0
    })
    setHasSort(true);
    } else {
      charges.sort((a,b) => {
        const idA = a.id;
        const idB = b.id;
  
        if(idA > idB) return -1
        if (idA <idB) return 1
        return 0
      })
      setHasSort(false);
    }
  }

  const sortChargesDate = () => {
    if (!hasSortedDate) {
      charges.sort((a, b) => {
      const dateA = a.due_date;
      const dateB = b.due_date;

      if (dateA > dateB) return 1
      if (dateA < dateB) return -1
      return 0
    })
    setHasSortDate(true);
    } else {
      charges.sort((a,b) => {
        const dateA = a.due_date;
        const dateB = b.due_date;

        if (dateA > dateB) return -1
        if (dateA < dateB) return 1
        return 0
      })
      setHasSortDate(false);
    }
  }

 

  return (

    <div className="home-container">
      <Header />
      <div className="hero-section">
        <Sidebar />
        
        <div className="container-content">
                      <div className='container-customers-title' style={{marginBottom: '24px'}}>
                <img src="/customer-icon.svg" alt="icon-customer" />
                <h2> {customerData.name}</h2>
            </div>
          <div className="client-content">
            <div className="info-edit-line">
              <h2 id="data">Dados do Cliente</h2>
              <h2 id="edit" style={{cursor: 'pointer'}} onClick={() => setOpenModal(true)}><img src={'/edit-client-btn.svg'}/>Editar Cliente</h2>
            </div>
            { openModal && <EditClient fetchEditCustomer={fetchEditCustomer} setOpenModal={setOpenModal} customerData={customerData} />}
            <div className="info-client-line-one">
              <h3 className="info-client">
                E-mail
                <p>{customerData.email} </p>
              </h3>
              <h3 className="info-client">
                Telefone
                <p>{customerData.phone} </p>
              </h3>
              <h3 className="info-client">
                CPF
                <p>{customerData.cpf} </p>
              </h3>
            </div>

            <div className="info-client-line-two">
              <h3 className="info-client">
                Endereço
                <p>{customerData.adress} </p>
              </h3>
              <h3 className="info-client">
                Bairro
                <p>{customerData.district}  </p>
              </h3>
              <h3 className="info-client">
                Complemento
                <p>{customerData.complement} </p>
              </h3>
              <h3 className="info-client">
                CEP
                <p>{customerData.zip} </p>
              </h3>
              <h3 className="info-client">
                Cidade
                <p>{customerData.city} </p>
              </h3>
              <h3 className="info-client">
                UF
                <p>{customerData.state} </p>
              </h3>
            </div>
          </div>
          <CustomerCharges sortChargesDate={sortChargesDate} sortChargesId={sortChargesId} charges={charges} customer={customerData}/>
        </div>
        <SuccessMessage/>
      </div>
    </div>
  );
}
