import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useUserStore } from '../store/useUserStore'
import './SignIn.css'

const SignIn = () => {
  const navigate = useNavigate()
  const { setSession } = useUserStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
    }
    try {
      const data = await api.loginUser(credentials)
      setSession(data)
      navigate('/')
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.error || 'Не удалось войти')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Вход</h1>
        <p className="auth-subtitle">Войдите в свой аккаунт</p>
      </div>

      {error && (
        <div className="alert alert-error active" id="error-alert">
          {error}
        </div>
      )}

      <form id="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Имя пользователя
          </label>
          <input
            type="text"
            className="form-input"
            id="username"
            name="username"
            placeholder="Введите имя пользователя"
            required
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Пароль
          </label>
          <input
            type="password"
            className="form-input"
            id="password"
            name="password"
            placeholder="Введите пароль"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>
      </form>

      <div className="auth-divider">или</div>

      <div className="auth-link">
        Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
      </div>
    </div>
  )
}

export default SignIn