import { API } from "@/src/constants/apiEndpoints";
import api from "../api";

export const fetchSemanticMatches = async () => {
  const res = await api.get(API.PROFILE.MATCHES);
  return res.data?.data ?? [];
};

export const fetchSubscriptionStatus = async () => {
  const res = await api.get(API.PAYMENTS.SUBSCRIPTION);
  return res.data;
};

export const createSubscription = async (body: {
  package_type: string;
  transaction_id: number;
  package_amount: number;
  paid_via: string;
  payment_status: string;
  package_status: string;
}) => {
  const res = await api.post(API.PAYMENTS.SUBSCRIPTION, body);
  return res.data;
};
