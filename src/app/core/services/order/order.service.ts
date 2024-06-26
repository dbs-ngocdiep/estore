import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { DeliveryAddress } from "../../models/interface/cart.interface";
import {
  Order,
  OrderDetail,
  OrderItem,
  PastOrder,
} from "../../models/interface/order.interface";
import { CartStoreItem } from "../cart/cart.storeItem";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  token: string | null = localStorage.getItem("token");
  constructor(
    private httpClient: HttpClient,
    private cartStore: CartStoreItem
  ) {}

  saveOrder(
    deliveryAddress: DeliveryAddress,
    userEmail: string
  ): Observable<any> {
    const url: string = `${environment.apiBaseUrl}/orders/create`;
    const orderDetails: OrderItem[] = [];

    this.cartStore.cart.products.forEach((product) => {
      const orderItem: OrderItem = {
        productId: product.product.id,
        price: product.product.price,
        qty: product.quantity,
        amount: product.amount,
      };
      orderDetails.push(orderItem);
    });

    const order: Order = {
      userName: deliveryAddress.userName,
      address: deliveryAddress.address,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pin: deliveryAddress.pin,
      total: this.cartStore.cart.totalAmount,
      userEmail: userEmail,
      orderDetails: orderDetails,
    };
    return this.httpClient.post(url, order, {
      headers: {
        authorization: this.token !== null ? JSON.parse(this.token) : null,
      },
    });
  }

  getOrders(userEmail: string): Observable<PastOrder[]> {
    const url: string = `${environment.apiBaseUrl}/orders/all-orders?userEmail=${userEmail}`;
    return this.httpClient.get<PastOrder[]>(url, {
      headers: {
        authorization: this.token !== null ? JSON.parse(this.token) : null,
      },
    });
  }

  getOrderProducts(orderId: number): Observable<OrderDetail[]> {
    const url: string = `${environment.apiBaseUrl}/orders/order-product?orderId=${orderId}`;
    return this.httpClient.get<OrderDetail[]>(url, {
      headers: {
        authorization: this.token !== null ? JSON.parse(this.token) : null,
      },
    });
  }
}
