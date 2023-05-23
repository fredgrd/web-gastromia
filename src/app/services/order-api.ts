import axios, { AxiosError } from "axios";
import {
  areOrders,
  CreateOrderData,
  CreateOrderResponse,
  isCreateOrderResponse,
  Order,
} from "../../models/order";
import { ApiOperation } from "../../models/api-operation";

const baseUrl = "https://api-gastromia.fly.dev";

export const createOrder = async (
  data: CreateOrderData
): Promise<CreateOrderResponse | null> => {
  try {
    const response = await axios.post(
      baseUrl + "/order/checkout",
      {
        ...data,
      },
      {
        withCredentials: true,
      }
    );
    const createOrderResponse: any = response.data;

    if (createOrderResponse && isCreateOrderResponse(createOrderResponse)) {
      return createOrderResponse;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `CreateOrder error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};

export const updatePaidOrder = async (
  id: string,
  orderId: string
): Promise<ApiOperation> => {
  try {
    const response = await axios.patch(
      baseUrl + "/order/paidorder",
      { id: id, order_id: orderId },
      { withCredentials: true }
    );

    return {
      success: true,
      status: 200,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `UpdatePaidOrder error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return {
      success: false,
      status: axiosError.response?.status,
    };
  }
};

export const fetchOrders = async (): Promise<Order[] | null> => {
  try {
    const response = await axios.get(baseUrl + "/order/orders", {
      withCredentials: true,
    });
    const orders: any = response.data.orders;

    if (orders && areOrders(orders)) {
      return orders;
    } else {
      return null;
    }
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log(
      `FetchOrders error: ${
        (axiosError.response?.status, axiosError.response?.statusText)
      }`
    );
    return null;
  }
};
