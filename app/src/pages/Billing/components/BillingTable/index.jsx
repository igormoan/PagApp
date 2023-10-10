import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import './styles.css';
import { format } from 'date-fns';
import { TablePagination } from '@mui/material';
import NotFoundError from '../../../../components/NotFoundError';
import ChargeCustomer from '../../../../components/ChargeCustomer';
import DeleteBilling from '../../../../components/BillingDelete';
import DetailsBilling from '../../../../components/DetailsBilling';
import formatBRL from '../../../../utils/currency';
const cellStyles = {
  color: '#747488',
  fontWeight: 400,
  lineHeight: '40px',
  fontSize: '14px',
  fontFamily: 'Nunito, sans-serif',
};

const headerStyles = {
  color: '#3F3F55',
  fontWeight: 700,
  lineHeight: '50px',
  fontSize: '16px',
  fontFamily: 'Nunito, sans-serif',
};

export default function BillingTable({ chargesFilter, handleSortChargesCustomer, handleSortChargesId }) {


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [chargeModalOpen, setChargeModalOpen] = useState(false);
  const [currentCharge, setCurrentCharge] = useState();
  const [modalDelete, setModaldelete] = useState(false)
  const [modalDetailsBilling, setModaldetailsBilling] = useState(false)


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

  if (!chargesFilter) return null;
  return (
    <>

      {chargesFilter.length === 0 ?
        <NotFoundError />
        :
        <TableContainer component={Paper} sx={{ borderRadius: '30px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell onClick={handleSortChargesCustomer} sx={{...headerStyles, cursor: 'pointer'}}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='updown-icon' />
                    Cliente
                  </div>
                </TableCell>
                <TableCell onClick={handleSortChargesId} align="left" sx={{...headerStyles, cursor: 'pointer'}}><div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className='updown-icon' />
                  ID Cob.
                </div></TableCell>
                <TableCell align="left" sx={headerStyles}>Valor</TableCell>
                <TableCell align="left" sx={headerStyles}>Data de venc.</TableCell>
                <TableCell align="left" sx={headerStyles}>Status</TableCell>
                <TableCell align="left" sx={headerStyles}>Descrição</TableCell>
                <TableCell align="left" sx={headerStyles}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chargesFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(charge => (
                <TableRow
                  key={charge.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  className='table-row'
                >
                  <TableCell component="th" scope="row" sx={{...cellStyles, cursor: 'pointer'}} onClick={() => openDetails(charge)}>
                    {charge.name}
                  </TableCell>
                  <TableCell align="left" sx={cellStyles}>{charge.id}</TableCell>
                  <TableCell align="left" sx={cellStyles}>{formatBRL(charge.value)}</TableCell>
                  <TableCell align="left" sx={cellStyles}>{format(new Date(charge.due_date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell align="center" sx={cellStyles}>
                    <div className={`billingtable-tag billingtable-${charge.status === 'Paga' ? 'paid'
                      : charge.status === 'Vencida' ? 'overdue'
                        : 'payable'}-tag`}>

                      {charge.status}
                    </div>
                  </TableCell>
                  <TableCell align="left" sx={cellStyles}>
                    {charge.description}
                  </TableCell>
                  <TableCell align="left" sx={cellStyles}>
                    <div style={{ display: 'flex' }}>
                      <div className='edit-icon'
                        onClick={() => openEditCharge(charge)}
                      />
                      <div className='delete-icon'
                        onClick={() => openModalDelete(charge)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={chargesFilter.length}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={event => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>}
      {chargeModalOpen &&
        <ChargeCustomer
          mode='edit'
          charge={currentCharge}
          customer={{ id: currentCharge.client_id }}
          close={() => setChargeModalOpen(false)} />}
      {modalDelete &&
        <DeleteBilling
          close={() => setModaldelete(false)}
          id={currentCharge.id} />}
      {modalDetailsBilling && 
        <DetailsBilling
        close={() => setModaldetailsBilling(false)}
        charge={currentCharge} />}
    </>
  );
}