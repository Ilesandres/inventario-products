export interface Product {
	id: string
	name: string
	description?: string
	price: number
	quantity: number
	imageUrl?: string
	createdAt: string
	updatedAt?: string
}

// Datos simulados en memoria
let products: Product[] = [
	{
		id: 'prod_1',
		name: 'Camiseta básica',
		description: 'Camiseta de algodón, color blanco',
		price: 12.99,
		quantity: 42,
		imageUrl: '',
		createdAt: new Date().toISOString(),
	},
	{
		id: 'prod_2',
		name: 'Auriculares inalámbricos',
		description: 'Auriculares bluetooth con cancelación de ruido',
		price: 59.99,
		quantity: 18,
		imageUrl: '',
		createdAt: new Date().toISOString(),
	},
	{
		id: 'prod_3',
		name: 'Mochila urbana',
		description: 'Mochila resistente al agua, 20L',
		price: 34.5,
		quantity: 9,
		imageUrl: '',
		createdAt: new Date().toISOString(),
	},
]

function generateId() {
	return 'prod_' + Math.random().toString(36).slice(2, 9)
}

export async function getAllProducts(): Promise<Product[]> {
	// Retornar copia para evitar mutaciones externas
	return products.map((p) => ({ ...p }))
}

export async function getProductById(id: string): Promise<Product | null> {
	const p = products.find((x) => x.id === id)
	return p ? { ...p } : null
}

export async function createProduct(
	product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Product> {
	const now = new Date().toISOString()
	const newProduct: Product = {
		id: generateId(),
		createdAt: now,
		updatedAt: now,
		...product,
	}
	products.push(newProduct)
	return { ...newProduct }
}

export async function updateProduct(product: Product): Promise<Product | null> {
	const idx = products.findIndex((p) => p.id === product.id)
	if (idx === -1) return null
	const updated: Product = {
		...products[idx],
		...product,
		updatedAt: new Date().toISOString(),
	}
	products[idx] = updated
	return { ...updated }
}

export async function deleteProduct(id: string): Promise<boolean> {
	const idx = products.findIndex((p) => p.id === id)
	if (idx === -1) return false
	products.splice(idx, 1)
	return true
}

const productService = {
	getAllProducts,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
}

export default productService

