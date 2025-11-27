import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/api'
import { useUserStore } from '../store/useUserStore'
import './SignUp.css'

const SignUp = () => {
  const navigate = useNavigate()
  const { setSession } = useUserStore()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)

    if (formData.get('password') !== formData.get('confirmPassword')) {
      setError('Пароли не совпадают')
      return
    }

    const payload = {
      username: formData.get('username'),
      email: formData.get('email') || undefined,
      password: formData.get('password'),
    }

    setLoading(true)
    try {
      const data = await api.registerUser(payload)
      setSession(data)
      navigate('/')
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.response?.data?.error || 'Не удалось зарегистрироваться')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-icon">👤</div>
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-subtitle">Создайте новый аккаунт</p>
      </div>

      {error && (
        <div className="alert alert-error active" id="error-alert">
          {error}
        </div>
      )}

      <form id="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-username">
            Имя пользователя
          </label>
          <input
            type="text"
            className="form-input"
            id="signup-username"
            name="username"
            placeholder="Введите имя пользователя"
            minLength={3}
            required
            autoComplete="username"
          />
          <div className="form-hint">Минимум 3 символа</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">
            Email <span className="optional">(необязательно)</span>
          </label>
          <input
            type="email"
            className="form-input"
            id="signup-email"
            name="email"
            placeholder="example@email.com"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">
            Пароль
          </label>
          <input
            type="password"
            className="form-input"
            id="signup-password"
            name="password"
            placeholder="Введите пароль"
            minLength={6}
            required
            autoComplete="new-password"
          />
          <div className="form-hint">Минимум 6 символов</div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-password-confirm">
            Подтверждение пароля
          </label>
          <input
            type="password"
            className="form-input"
            id="signup-password-confirm"
            name="confirmPassword"
            placeholder="Повторите пароль"
            required
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Создаем...' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="auth-divider">или</div>

      <div className="auth-link">
        Уже есть аккаунт? <Link to="/signin">Войти</Link>
      </div>
    </div>
  )
}

export default SignUp
