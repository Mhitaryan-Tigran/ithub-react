export interface User {
  id: number
  email: string
  name: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface OrderItem {
  product_id: number
  title: string
  quantity: number
  price: number
}

export interface Order {
  id: number
  total: number
  created_at: string
  items: OrderItem[]
}
