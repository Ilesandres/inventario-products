import React, { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Asigna nombre al perfil
      await updateProfile(user, { displayName: name })

      // Crea documento en Firestore con su rol
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        name,
        email,
        role: 'user', 
        createdAt: serverTimestamp(),
      })

      setSuccess('Usuario registrado correctamente. Ahora puedes iniciar sesión.')
      setName('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      console.error(err)
      setError('Error al registrar el usuario: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page"> { }
      <div className="auth-container">
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
          <div style={{ width: '320px', textAlign: 'center' }}>
            <h2>Registro</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
            <p style={{ marginTop: '1rem' }}>
              ¿Ya tienes una cuenta? <a href="#/login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
