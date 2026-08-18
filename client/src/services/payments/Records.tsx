import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";

const Records = async () => {
    console.log("Reached to Records!!!");
    console.log("Records URL:", API.PAYMENTS.RECORDS);
    try{
        const res = await api.post(API.PAYMENTS.RECORDS)
        console.log("Data Response from Records section: ", res.data)
        console.log("Status Response from Records section: ", res.status)
        if (res.status === 201){
            return
        }
    } catch (e) {
        console.log("Error occured in Records section!", e)
        if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const response = e.response?.data;
        console.log("Error Status in Records section: ", status);
        console.log("Error Response in Records section: ", response);
      }
    }
}

export default Records