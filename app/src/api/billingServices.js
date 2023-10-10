import { api } from "../services/api";

const sendAllCharges = async (config) => await api.get('/charges', config);
const sendAllChargesPage = async (data, config) => await api.get(`/charges`, data, config);
const addCharge = async (data,config) => await api.post('/charge', data, config);
const editCharge = async (data, config) => await api.put(`/billing/${data.id}`, data, config);
const deleteCharge = async (id, config) => await api.delete(`/billing/${id}`, config);

export const billingServices = {
    sendAllCharges,
    sendAllChargesPage,
    addCharge,
    editCharge,
    deleteCharge
}