import { useEffect, useRef } from "react";
import "./styles.css";
import polygon from './assets/polygon.png'
import exitBtn from './assets/exit-btn.svg'
import editBtn from './assets/edit-btn.svg'
import header_home_context from '../../../context/context';
import { useContext } from "react";
import { clearItems } from '../../../utils/storage'
import { useNavigate } from 'react-router-dom'

const MenuBalloon = () => {
    const date = useContext(header_home_context)
    const postitionBallon = useRef('')
    const navigate = useNavigate();
    function position() {
        postitionBallon.current.style.top = `${date.buttonArrowRef.target.offsetTop + 30}px`
        postitionBallon.current.style.left = `${date.buttonArrowRef.target.offsetLeft - 5}px`
    }
    function logout() {
        clearItems()
        return navigate('/')
    }

    useEffect(() => {
        if (date.buttonArrowRef) {
            position()
            window.addEventListener('resize', position)            
        }
    },)

    return (
        <div className={date.modalBallon ? "container_balloon" : 'hide'} ref={postitionBallon}>
            <img className="poligon" src={polygon} alt="polígono" />
            <div className="menu-balloon">
                <img src={editBtn} onClick={date.handleOpenModal} alt="editar" />
                <img src={exitBtn} onClick={logout} alt="sair" />
            </div>
        </div>
    );
};

export default MenuBalloon;
