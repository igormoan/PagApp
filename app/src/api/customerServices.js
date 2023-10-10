import { api } from "../services/api";

const addCustomer = async (data, config) => await api.post(`/customer`, data, config);
const sendCustomer = async (id, config) => await api.get(`/customer/${id}`, config);
const sendCustomers = async (config) => await api.get(`/customers`, config);
const editCustomer = async (data, config) => await api.put('/customer', data, config);


export const customersServices = {
    addCustomer,
    sendCustomer,
    editCustomer,
    sendCustomers
}