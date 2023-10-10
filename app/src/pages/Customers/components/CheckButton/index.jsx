import './styles.css'
import ArrowWhite from '../../../../assets/arrow-white.svg';

// eslint-disable-next-line react/prop-types
export default function CheckButton({ status }) {
    return (
        <>
            <div className={`bollBox ${status ? "full" : ""}`}>
                {status ? <img src={ArrowWhite} alt="Imagem" /> : ""}
            </div>
        </>
    );
}



