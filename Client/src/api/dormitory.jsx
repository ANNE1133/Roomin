import axios from 'axios'

export const createDormitory = async(form)=> {
    return axios.post('http://localhost:3000/api/dormitory/createDormitory',form,{

    })
}