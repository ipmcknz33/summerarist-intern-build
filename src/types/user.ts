export interface User {
  uid: string
  email: string | null
  subscription: "free" | "pro"
}