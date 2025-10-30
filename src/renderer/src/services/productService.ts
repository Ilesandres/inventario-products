import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { Product } from '../types/Product'

// Convertir documento de Firestore a Product - CORREGIDO
function docToProduct(doc: any): Product {
  const data = doc.data()
  console.log('Convirtiendo documento:', doc.id, data)
  
  // CORRECCIÓN: Manejar correctamente el Timestamp de Firebase
  let createdAt: Date
  if (data.createdAt && data.createdAt.toDate) {
    createdAt = data.createdAt.toDate() // Si es un Timestamp de Firebase
  } else if (data.createdAt instanceof Date) {
    createdAt = data.createdAt // Si ya es un Date
  } else {
    createdAt = new Date() // Fallback
  }
  
  return {
    id: doc.id,
    name: data.name || '',
    category: data.category || '',
    stock: data.stock || 0,
    price: data.price || 0,
    image: data.image || '',
    createdAt: createdAt,
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    console.log('🔍 Obteniendo productos de Firestore...')
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    console.log('📄 Documentos encontrados:', querySnapshot.size)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      try {
        console.log('📋 Procesando documento:', doc.id)
        const product = docToProduct(doc)
        products.push(product)
      } catch (error) {
        console.error('❌ Error procesando documento:', doc.id, error)
      }
    })
    
    console.log('✅ Productos cargados:', products.length)
    return products
  } catch (error) {
    console.error('❌ Error getting products:', error)
    throw new Error('No se pudieron cargar los productos: ' + error)
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()
    return products.find(p => p.id === id) || null
  } catch (error) {
    console.error('Error getting product:', error)
    return null
  }
}

export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt'>,
): Promise<Product> {
  try {
    console.log('🆕 Creando producto:', product)
    
    const productData = {
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      image: product.image || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    console.log('📤 Enviando a Firestore:', productData)
    
    const docRef = await addDoc(collection(db, 'products'), productData)
    console.log('✅ Producto creado con ID:', docRef.id)

    const newProduct: Product = {
      id: docRef.id,
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      image: product.image || '',
      createdAt: new Date(),
    }
    
    return newProduct
  } catch (error) {
    console.error('❌ Error creating product:', error)
    throw new Error('No se pudo crear el producto: ' + error)
  }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    console.log('✏️ Actualizando producto:', product.id)
    
    const productRef = doc(db, 'products', product.id)
    const updateData = {
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      image: product.image || '',
      updatedAt: serverTimestamp(),
    }
    
    console.log('📤 Actualizando en Firestore:', updateData)
    await updateDoc(productRef, updateData)
    console.log('✅ Producto actualizado')

    return product
  } catch (error) {
    console.error('❌ Error updating product:', error)
    throw new Error('No se pudo actualizar el producto: ' + error)
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    console.log('🗑️ Eliminando producto:', id)
    await deleteDoc(doc(db, 'products', id))
    console.log('✅ Producto eliminado')
    return true
  } catch (error) {
    console.error('❌ Error deleting product:', error)
    throw new Error('No se pudo eliminar el producto: ' + error)
  }
}

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

export default productService