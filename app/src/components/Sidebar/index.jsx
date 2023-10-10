import React from "react"
import "./styles.css";
import logoHome from "../../assets/logo-home.svg"
import logoClient from "../../assets/logo-contact.svg"
import logoCharge from "../../assets/logo-charge.svg"
import { NavLink } from "react-router-dom";

export default function Sidebar() {

    return (
        <div className="container_divisao">
            <div className="area-divisao">
                <NavLink
                    className='navigation-menu-link' 
                    to='/home'
                    >
                <div className={`icon-menu`}>
                    <img className="img" src={logoHome} alt="home" />
                    <ul className="description-menu">Home</ul>
                </div>
                </NavLink>
                <NavLink
                    className='navigation-menu-link' 
                    to='/clientes'
                    >
                <div className={`icon-menu`}>
                    <img className="img" src={logoClient} alt="client" />
                    <ul className="description-menu">Clientes</ul>
                </div>
                </NavLink>
                <NavLink
                    className='navigation-menu-link' 
                    to='/cobrancas'
                    >
                <div className={`icon-menu`}>
                    <img className="img" src={logoCharge} alt="cobranças" />
                    <ul className="description-menu">Cobranças</ul>
                </div>
                </NavLink>
            </div>
        </div>
    );
}