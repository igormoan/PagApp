import { TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customersServices } from '../../../../api/customerServices';
import ChargeCustomer from '../../../../components/ChargeCustomer';
import { getItem } from '../../../../utils/storage';
import './styles.css';
import NotFoundError from '../../../../components/NotFoundError';


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

export default function CustomersTable({ customersFilter, sortCustomers }) {

  const [addChargeOpen, setAddChargeOpen] = useState(false);
  const [customer, setCustomer] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  
  function formatCPF(string){
    return string.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  async function handleAddCharge(id) {
    try {
      const token = getItem('token');
      const config = {
          headers: { 'Authorization': `Bearer ${token}`}
        }
      const response = await customersServices.sendCustomer(id, config);
      setCustomer(response.data.customer[0]);
      return setAddChargeOpen(true);

    } catch (error) {
      alert(error)
    }
  }
 
  if (!customersFilter) return null;

  return (
    <>
      {customersFilter.length === 0 ?
      <NotFoundError/>
     : 
      <TableContainer component={Paper} sx={{ borderRadius: '30px', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{...headerStyles, cursor: 'pointer'}} onClick={sortCustomers}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div className='updown-icon' />
                  Cliente
                </div>
              </TableCell>
              <TableCell align="left" sx={headerStyles}>CPF</TableCell>
              <TableCell align="left" sx={headerStyles}>E-mail</TableCell>
              <TableCell align="left" sx={headerStyles}>Telefone</TableCell>
              <TableCell align="left" sx={headerStyles}>Status</TableCell>
              <TableCell align="left" sx={headerStyles}>Criar Cobrança</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customersFilter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
              <TableRow
                key={customer.name + customer.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                className='table-row'
              >
                <TableCell onClick={() => navigate(`/clientes/${customer.id}`)} component="th" scope="row" sx={{...cellStyles, cursor: 'pointer'}}>
                  <span>{customer.name}</span>
                </TableCell>
                <TableCell align="left" sx={cellStyles}>{formatCPF(customer.cpf)}</TableCell>
                <TableCell align="left" sx={cellStyles}>{customer.email}</TableCell>
                <TableCell align="left" sx={cellStyles}>{customer.phone}</TableCell>
                <TableCell align="center" sx={cellStyles}>
                  <div className={`clienttable-tag clienttable-${customer.status === 'Em dia' ? 'ok' : 'late'}-tag`}>
                    {customer.status}
                  </div>
                </TableCell>
                <TableCell align="left" sx={cellStyles}>
                  <div className='charge-icon'
                    onClick={() => handleAddCharge(customer.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
        component="div"
        count={customersFilter.length}
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
      </TableContainer> }

      {addChargeOpen && <ChargeCustomer mode='add' close={() => {setAddChargeOpen(false)}} customer={customer} />}
    </>
  );
}