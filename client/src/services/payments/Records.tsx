import { API } from "@/src/constants/apiEndpoints";
import api from "../api";
import axios from "axios";

const Records = async () => {
    try{
        const res = await axios.post(API.PAYMENTS.RECORDS)
        console.log("Data Response from Records section: ", res.data)
        console.log("Stati Response from Records section: ", res.data)
        if (res.status === 201){
            return
        }
    } catch (err) {
        console.log("Error occured!", err)
    }
}

export default Records