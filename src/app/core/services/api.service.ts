import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string) {
    return this.http.get<T>(`${API_BASE_URL}${url}`);
  }

  post<T>(url: string, body: any) {
    return this.http.post<T>(`${API_BASE_URL}${url}`, body);
  }

  put<T>(url: string, body: any) {
    return this.http.put<T>(`${API_BASE_URL}${url}`, body);
  }

  patch<T>(url: string, body: any) {
    return this.http.patch<T>(`${API_BASE_URL}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<T>(`${API_BASE_URL}${url}`);
  }
}