import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItem } from '../utils/storage';
import { UsersServices } from '../api/UsersServices';
import { customersServices } from '../api/customerServices';

function apiHeaders() {
    return {
        headers: { 'Authorization': `Bearer ${getItem('token')}` }
    }
}

function getTransactions() {   
    return useQuery({
        queryKey: ['transactions'],
        queryFn: () => UsersServices.getDashboardData(apiHeaders())
    })
}

function getCharges() {   
    return useQuery({
        queryKey: ['charges'],
        queryFn: () => UsersServices.getCharges(apiHeaders())
    })
}

function getUserData() {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => UsersServices.getUser(apiHeaders())
    })
}

function editUserData(data) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => UsersServices.editUser(data, apiHeaders()),
        onSuccess: () => queryClient.invalidateQueries(['user'])
    })
}

function addCustomer(data) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => customersServices.addCustomer(data, apiHeaders()),
        onSuccess: () => queryClient.invalidateQueries(['transactions'])
    })
}

function editCustomer(data) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => customersServices.editCustomer(data, apiHeaders()),
        onSuccess: () => queryClient.invalidateQueries(['transactions'])
    })
}

function sendCustomer(id) {
    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => customersServices.sendCustomer(id, apiHeaders()),
    })
}


export const reactQueryHooks = {
    apiHeaders,
    getTransactions,
    getUserData,
    editUserData,
    getCharges,
    addCustomer,
    editCustomer,
    sendCustomer,

}