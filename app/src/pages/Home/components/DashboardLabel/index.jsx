import './styles.css';
import formatBRL from '../../../../utils/currency';
import  CountUp from 'react-countup';

export default function DashboardLabel( { variant, value } ) {

    return (

          <div className={`dashboard-label-container dashboard-label-${variant}`}>
            <div className='dashboard-label-content'>
              <div className={`dashboard-label-${variant}-icon dashboard-label-icon`} />
              <div>
                <p>
                  {
                    variant === 'paid' ? 'Cobranças Pagas'
                    : variant === 'overdue' ? 'Cobranças Vencidas'
                    : variant === 'payable' ? 'Cobranças Previstas'
                    : ''
                  }
                </p>
                <p className='dashboard-label-value'>
                  <CountUp style ={{fontFamily: 'Montserrat'}}start={0} end={value} duration={1.4} decimals={2} formattingFn={formatBRL}/>
                </p>
              </div>
            </div>
          </div>
    );
}
