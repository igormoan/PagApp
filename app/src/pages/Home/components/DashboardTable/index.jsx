import './styles.css';
import { Link } from 'react-router-dom';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import formatBRL from '../../../../utils/currency';

const cellStyles = {
    color: '#747488',
    fontWeight: 400,
    lineHeight: '40px',
    fontSize: '14px',
    fontFamily: 'Nunito, sans-serif',
    width: '33.3%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  
  const headerStyles = {
    color: '#3F3F55',
    fontWeight: 700,
    lineHeight: '50px',
    fontSize: '16px',
    fontFamily: 'Nunito, sans-serif',
  };

export default function DashboardTable({ variant, entries }) {

    function formatCPF(string) {
        return string.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    function getTitleFromVariant() {
        switch (variant) {
            case 'overdue': return 'Cobranças Vencidas';
            case 'payable': return 'Cobranças Previstas';
            case 'paid': return 'Cobranças Pagas';
            case 'late': return 'Clientes Inadimplentes';
            case 'ok': return 'Clientes em dia';
            default: return '-';
        }
    }

    function getLabelClassFromVariant() {
        if (variant === 'overdue' || variant === 'late') return 'bad';
        if (variant === 'payable') return 'medium';
        return 'good';
    }

    return (
        <Paper elevation={1} style={{ borderRadius: '30px', overflow: 'hidden', margin: '0.5rem 1rem', width: '100%', minWidth: '360px'}}>
            <div className={`dashboard-table-title`}>
                <div className={`table-icon client-${variant}`}>
                    <span className='dashboard-title-text'>
                        {getTitleFromVariant()}
                    </span>
                </div>
                <div className={`dashboard-table-label label-${getLabelClassFromVariant()}`}>
                    {entries.length}
                </div>
            </div>

            <Table className='dashboard-table'>
                <TableHead>
                    <TableRow>
                        {['ok', 'late'].includes(variant) ? (
                            <>
                                <TableCell className='dashboard-table-item flex2' style={headerStyles} >Clientes</TableCell>
                                <TableCell className='dashboard-table-item tac' style={headerStyles} align="center">ID do clie.</TableCell>
                                <TableCell className='dashboard-table-item tar' style={headerStyles} align="right">CPF</TableCell>
                            </>
                        ) : (
                            ['overdue', 'payable', 'paid'].includes(variant) && (
                                <>
                                    <TableCell className='dashboard-table-item flex2' style={headerStyles}>Cliente</TableCell>
                                    <TableCell className='dashboard-table-item tac' style={headerStyles}align="center">ID da cob.</TableCell>
                                    <TableCell className='dashboard-table-item tar' style={headerStyles}align="right">Valor</TableCell>
                                </>
                            )
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {entries.slice(0, 4).map(row => (
                        <TableRow key={`${variant}id${row.id}`} style={{height: '56px important'}} className='table-row'>
                            <TableCell style={cellStyles} >
                                <div style={{...cellStyles}} className='dynamic-width-div'>
                                    {row.name}
                                </div>
                            </TableCell>
                            <TableCell style={cellStyles} align="center">{row.id}</TableCell>
                            <TableCell style={cellStyles} align="right">
                                {['overdue', 'payable', 'paid'].includes(variant) 
                                    ? formatBRL(row.value)
                                    : ['late', 'ok'].includes(variant)
                                    ? `${formatCPF(row.cpf)}` 
                                    : ''}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='dashboard-table-footer'>
                <Link to={
                    variant === 'overdue' ? {pathname: '/cobrancas', search: '?status=Vencida'}
                    : variant === 'payable' ? {pathname: '/cobrancas', search: '?status=Pendente'}
                    : variant === 'paid' ? {pathname: '/cobrancas', search: '?status=Paga'}
                    : variant === 'late' ? {pathname: '/clientes', search: '?status=Inadimplente'}
                    : {pathname: '/clientes', search: '?status=Ok'}
                } className='see-all-link'>Ver todos</Link>
            </div>
        </Paper>
    );
}