'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/dashboard/rh')
        router.refresh()
      }
    } catch (err) {
      setError('An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 my-16">
      <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: '#0056D2' }}>
        Sign In to Your Account
      </h1>
      <p className="mb-8 text-gray-500 text-center">Start your journey</p>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#0056D2' }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="example@email.com"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#0056D2' }}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#0056D2' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: '#0056D2' }}
            required
            disabled={isLoading}
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-lg transition disabled:opacity-50"
          style={{ backgroundColor: '#0056D2' }}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <a href="/register" className="hover:underline" style={{ color: '#0056D2' }}>
          Sign up
        </a>
      </div>
    </div>
  )
}