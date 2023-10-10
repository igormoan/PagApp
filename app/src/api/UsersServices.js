import { api } from "../services/api";

const loginUser = async (data) => await api.post('login', data);
const editUser = async (data, config) => await api.put('user', data, config);
const getUser = async (config) => await api.get('user', config);
const addCustomer = async (data, config) => await api.post(`customer`, data, config);
const getDashboardData = async (config) => await api.get(`dashboard`, config);
const getCharges = async (config) => await api.get('charges', config);
const getCustomer = async (config, id) => await api.get(`/customer/${id}`, config);
const getAllCustomers = async(page, config) => await api.get(`customers/${page}`, config);

export const UsersServices = {
    loginUser,
    editUser,
    getUser,
    addCustomer,
    getDashboardData,
    getCharges,
    getCustomer,
    getAllCustomers
}