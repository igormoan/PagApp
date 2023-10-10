import './styles.css';
import DashboardTable from "./components/DashboardTable";
import Menu from '../../components/Sidebar';
import Header from '../../components/Header';
import DashboardLabel from './components/DashboardLabel';
import { reactQueryHooks } from '../../services/reactquery';
import SuccessMessage from '../../components/SuccessMessage'


export default function Home() {

    const transactionsQuery = reactQueryHooks.getTransactions();
    if (transactionsQuery.isLoading) return;
    if (transactionsQuery.isError) return;

    const dashboard = transactionsQuery.data.data;

    function getCategory(variant) {
        let localrow;
        let status;

        if (variant === 'paid' || variant === 'payable' || variant === 'overdue') {
            localrow = dashboard.billing;
            if (variant === 'paid') status = 'Paga';
            if (variant === 'payable') status = 'Pendente';
            if (variant === 'overdue') status = 'Vencida';
        }
        if (variant === 'ok' || variant === 'late') {
            localrow = dashboard.customers
            if (variant === 'ok') status = 'Em dia';
            if (variant === 'late') status = 'Inadimplente';
        }

        const result = localrow.filter(row => row.status === status);
        return result;
    }

    return (
        <div className='home-container'>
            <Header />
            <div className='hero-section'>
                <Menu />
                <div className="container-content">
                    <div className="tables-row">
                        {dashboard && <DashboardLabel variant='paid' value={dashboard.sums.paid} />}
                        {dashboard && <DashboardLabel variant='overdue'value={dashboard.sums.late} />}
                        {dashboard && <DashboardLabel variant='payable'value={dashboard.sums.payable} />}
                    </div>

                    <div className="tables-row">
                        {dashboard && <DashboardTable variant='overdue' entries={getCategory('overdue')}/>}
                        {dashboard && <DashboardTable variant='payable' entries={getCategory('payable')}/>}
                        {dashboard && <DashboardTable variant='paid' entries={getCategory('paid')}/>}
                    </div>

                    <div className="tables-row">
                        {dashboard && <DashboardTable variant='late' entries={getCategory('late')}/>}
                        {dashboard && <DashboardTable variant='ok' entries={getCategory('ok')}/>}
                    </div>
                </div>
            </div>
            <SuccessMessage/>
        </div>
    );

}
