import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";

const Privacy = async () => {
    console.log("Reached to Privacy!!!");
    console.log("Privacy URL:", API.PAYMENTS.RECORDS);
    try{
        const res = await api.post(API.PRIVACY.USERSPRIVACY)
        console.log("Data Response from Privacy section: ", res.data)
        console.log("Status Response from Privacy section: ", res.status)
        if (res.status === 201){
            return
        }
    } catch (e) {
        console.log("Error occured in Privacy section!", e)
        if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;
        console.log("Error Status in Privacy section: ", status);
        console.log("Error Response in Privacy section: ", response);
      }
    }
}

export default Privacy