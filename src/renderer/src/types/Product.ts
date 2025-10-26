export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  image?: string;
  createdAt: Date;
}
