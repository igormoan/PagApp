import { useState } from "react";
import "./styles.css";
import ArrowDown from "../../assets/arrow-down.svg";
import MenuBalloon from "./menu-ballon/index";
import header_home_context from '../../context/context'
import ModalEditUser from "./ModalEditUser";
import { reactQueryHooks } from "../../services/reactquery";

export default function Header() {
    const userQuery = reactQueryHooks.getUserData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalBallon, setModalBallon] = useState(false);
    const [buttonArrowRef, setButtonArrowref] = useState();
    
    const handleOpenModal = async () => {
        openClosedModal();
        setModalOpen(true);
    }

    function openClosedModal(e) {
        setButtonArrowref(e)
        if (!modalBallon) {
            setModalBallon(true)

        } else {
            setModalBallon(false)
        }
    }

    function returnNameandInitials() {
        const names = user.name.split(' ');
        const initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
        return [names[0], initials];
    }

    if (userQuery.isLoading) return;
    if (userQuery.isError) return;
    const user = userQuery.data.data.user;

    return (
        <header_home_context.Provider value={{ setModalOpen, isModalOpen, buttonArrowRef, modalBallon, setModalBallon, handleOpenModal }}>
            <div className="container_cabecalho">
                <h2>Resumo de Cobranças</h2>

                <div className="avatar-name">
                    <div className="radius">
                        <li className="avatar">{returnNameandInitials()[1]}</li>
                    </div>
                    <li className="header-username">{returnNameandInitials()[0]}</li>
                    <img
                        src={ArrowDown}
                        alt="menu"
                        onClick={openClosedModal}
                    />
                </div>
            </div>
            <MenuBalloon />
            <ModalEditUser />
        </header_home_context.Provider>
    );
}
