import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { dateFunctions } from '../../../../../utils/date';
import './style.css';
import { Button } from '@mui/material';
import { useState } from 'react'
import ChargeCustomer from '../../../../../components/ChargeCustomer';
import DeleteBilling from '../../../../../components/BillingDelete'
import DetailsBilling from '../../../../../components/DetailsBilling'
import formatBRL from '../../../../../utils/currency';

const buttonStyle= {
  width: '18rem',
  backgroundColor: "var(--principais-rosa-normal)",
  color: "var(--cinzas-cinza-8, #F8F8F9)",
  fontFamily: "'Nunito', sans-serif",
  fontSize: "1.1rem",
  fontWeight: 400,
  borderRadius: "1rem",
  textAlign: "center",
  textTransform: "none"
}

const cellStyles = {
    color: '#747488',
    fontWeight: 400,
    lineHeight: '40px',
    fontSize: '14px',
    fontFamily: 'Nunito, sans-serif',
  };

  const cellStatusRow = {
    color: '#747488',
    fontWeight: 400,
    fontFamily: 'Nunito, sans-serif',
    position: 'relative',
    width: '8rem',
  }
  
  const cellStatusStyles = {
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.9rem',
    fontFamily: 'Nunito, sans-serif',
    borderRadius: '1rem',
    width: '100%'
  }

  const headerStyles = {
    color: '#3F3F55',
    fontWeight: 700,
    lineHeight: '50px',
    fontSize: '16px',
    fontFamily: 'Nunito, sans-serif',
  };

export default function TableCharges({ charges, setAddChargeOpen, sortChargesId, sortChargesDate, customer }) {

    const [chargeModalOpen, setChargeModalOpen] = useState(false);
    const [currentCharge, setCurrentCharge] = useState();
    const [modalDelete, setModaldelete] = useState(false);
    const [modalDetailsBilling, setModaldetailsBilling] = useState(false);
    

    function openModalDelete(charge) {
      setModaldelete(true);
      setCurrentCharge(charge)

    }
    function openEditCharge(charge) {
      setChargeModalOpen(true);
      setCurrentCharge(charge)
    }

    function openDetails(charge) {
      setCurrentCharge(charge)
      setModaldetailsBilling(true)
    }

    return (
        <>
        
    { charges && <TableContainer component={Paper} sx={{ borderRadius: '30px', overflow: 'hidden', padding: '3rem', marginTop: '24px'}}>
          <div className='container-add-charge'>
                <h2> Cobranças do  Cliente</h2>
                <Button sx={buttonStyle} variant='contained' onClick={() => setAddChargeOpen(true)}> + Nova cobrança</Button>
            </div>
          <Table sx={{ minWidth: 650, marginTop: 4 }} aria-label="simple table">
            <TableHead>
              <TableRow>
              <TableCell onClick={sortChargesId} sx={{...headerStyles, cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='updown-icon'/>
                    ID Cob.
                  </div>
                </TableCell>
                <TableCell onClick={sortChargesDate} align="left" sx={{...headerStyles, cursor: 'pointer'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='updown-icon'/>
                    Data venc.
                  </div>
                </TableCell>
                <TableCell align="left" sx={headerStyles}>Valor</TableCell>
                <TableCell align="center" sx={headerStyles}>Status</TableCell>
                <TableCell align="center" sx={headerStyles}>Descrição</TableCell>
                <TableCell align="center" sx={headerStyles}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {charges.map((charge) => (
                <TableRow
                  key={charge.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className='table-row'
                >
                  <TableCell onClick={() => openDetails(charge)}component="th" scope="row" sx={{...cellStyles, cursor: 'pointer'}}>
                  {charge.id}
                  </TableCell>
                  <TableCell align="left" sx={cellStyles}>{dateFunctions.convertDateFormat(charge.due_date)}</TableCell>
                  <TableCell align="left" sx={cellStyles}>{formatBRL(charge.value)}</TableCell>
                  <TableCell align="left" sx={cellStatusRow}>
                    <div style={cellStatusStyles} className={charge.status === 'Paga' ? 'client-status-paid' : charge.status === 'Vencida' ? 'client-status-expired' : 'client-status-pendent'}>
                          {charge.status}
                    </div>
                    </TableCell>
                  <TableCell align="left" sx={cellStyles}>
                    {charge.description}
                    </TableCell>
                    <TableCell>
                      <div className='edit-table-cell'>
                        <div onClick={() => openEditCharge(charge)}>
                          <img src="/icon-edit-charge.svg" alt="icon-edit" />
                          <span style={{color: 'var(--cinca-cinza-3)'}}>Editar</span>
                        </div>
                        <div onClick={() => openModalDelete(charge)}>
                          <img src="/icon-delete-charge.svg" alt="icon-delete" />
                          <span style={{color: 'var(--feedback-erro-dark)'}}>Excluir</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
          </Table>
          {charges.length === 0 &&
              <div style={{width: '100%', marginTop: '40px'}}>
                <h1 style={{fontFamily: 'Nunito', textAlign: 'center'}}>Não há cobranças registradas para este cliente</h1>
              </div>
              }
        </TableContainer>}
        {modalDelete &&
        <DeleteBilling
         close={()=>setModaldelete(false)}
         id={currentCharge.id}/>}
         {chargeModalOpen &&
        <ChargeCustomer
          mode='edit'
          charge={{...currentCharge, paid: currentCharge.status === 'Paga' ? true : false, name: customer.name}}
          customer={customer}
          close={() => setChargeModalOpen(false)} />}
                {modalDetailsBilling && 
        <DetailsBilling
        close={() => setModaldetailsBilling(false)}
        charge={{...currentCharge, name: customer.name}} />}
        </>
      );
    }