import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { Product } from '../types/Product'

// Función para subir imagen al Storage
export async function uploadImage(file: File): Promise<string> {
  try {
    
    
    // Crear referencia única para la imagen
    const timestamp = Date.now()
    const fileName = `products/${timestamp}_${file.name}`
    const storageRef = ref(storage, fileName)
    
    // Subir el archivo
    const snapshot = await uploadBytes(storageRef, file)
  
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    
    return downloadURL
  } catch (error) {
   
    throw new Error('No se pudo subir la imagen: ' + error)
  }
}

// Función para eliminar imagen del Storage
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    if (!imageUrl) return
    
    
    
    // Extraer la referencia del storage desde la URL
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
    
   
  } catch (error) {
  }
}

// Convertir documento de Firestore a Product
function docToProduct(doc: any): Product {
  const data = doc.data()
  
  let createdAt: Date
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    createdAt = data.createdAt.toDate()
  } else if (data.createdAt) {
    createdAt = new Date(data.createdAt)
  } else {
    createdAt = new Date()
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
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      products.push(docToProduct(doc))
    })
    
    return products
  } catch (error) {
    console.error('Error getting products:', error)
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
    const productData = {
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      image: product.image || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    const docRef = await addDoc(collection(db, 'products'), productData)

    const newProduct: Product = {
      id: docRef.id,
      ...product,
      createdAt: new Date(),
    }
    
    return newProduct
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('No se pudo crear el producto: ' + error)
  }
}

export async function updateProduct(product: Product): Promise<Product | null> {
  try {
    const productRef = doc(db, 'products', product.id)
    const updateData = {
      name: product.name,
      category: product.category,
      stock: Number(product.stock),
      price: Number(product.price),
      image: product.image || '',
      updatedAt: serverTimestamp(),
    }
    
    await updateDoc(productRef, updateData)
    return product
  } catch (error) {
    console.error('Error updating product:', error)
    throw new Error('No se pudo actualizar el producto: ' + error)
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Primero obtener el producto para eliminar su imagen si existe
    const products = await getAllProducts()
    const product = products.find(p => p.id === id)
    
    if (product && product.image) {
      await deleteImage(product.image)
    }
    
    // Luego eliminar el documento
    await deleteDoc(doc(db, 'products', id))
    return true
  } catch (error) {
    console.error('Error deleting product:', error)
    throw new Error('No se pudo eliminar el producto: ' + error)
  }
}

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
}

export default productService