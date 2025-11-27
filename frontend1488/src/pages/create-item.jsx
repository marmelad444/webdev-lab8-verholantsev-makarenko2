import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useItemStore } from '../store/useItemStore'
import { useUserStore } from '../store/useUserStore'
import './create-item.css'

const initialFormState = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
}

const CreateItem = () => {
  const navigate = useNavigate()
  const { session } = useUserStore()
  const { createItem, actionInProgress, error } = useItemStore()
  const [formState, setFormState] = useState(initialFormState)
  const [previewError, setPreviewError] = useState(false)
  const [localError, setLocalError] = useState('')

  if (!session?.token) {
    return (
      <div className="no-items">
        <div className="no-items-icon">🔐</div>
        <h2>Только для авторизованных пользователей</h2>
        <p>Войдите, чтобы разместить свой товар.</p>
        <Link className="btn-primary" to="/signin">
          Войти
        </Link>
      </div>
    )
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'imageUrl') {
      setPreviewError(false)
    }
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLocalError('')
    if (!formState.title.trim() || !formState.description.trim()) {
      setLocalError('Заполните название и описание')
      return
    }
    const numericPrice = Number(formState.price)
    if (!numericPrice || numericPrice <= 0) {
      setLocalError('Укажите корректную цену')
      return
    }
    try {
      const payload = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        price: numericPrice,
        imageUrl: formState.imageUrl.trim() || undefined,
      }
      const created = await createItem(payload)
      setFormState(initialFormState)
      setPreviewError(false)
      navigate(`/items/${created.id}`)
    } catch (requestError) {
      setLocalError(requestError.response?.data?.error || 'Ошибка при создании товара')
    }
  }

  return (
    <section>
      <div className="page-header">
        <h1>Создать новый товар</h1>
      </div>

      <div className="form-container">
        <form id="create-item-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Название товара <span className="required">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              name="title"
              placeholder="Например: iPhone 14 Pro 256GB"
              maxLength={100}
              value={formState.title}
              onChange={handleChange}
              required
            />
            <div className="char-counter">{formState.title.length} / 100</div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Описание <span className="required">*</span>
            </label>
            <textarea
              className="form-textarea"
              name="description"
              placeholder="Подробно опишите товар, его состояние, характеристики..."
              maxLength={1000}
              value={formState.description}
              onChange={handleChange}
              required
            />
            <div className="char-counter">{formState.description.length} / 1000</div>
            <div className="form-hint">Чем подробнее описание, тем больше шансов продать товар</div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Начальная цена <span className="required">*</span>
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-input with-prefix"
                name="price"
                placeholder="5000"
                min="1"
                step="100"
                value={formState.price}
                onChange={handleChange}
                required
              />
              <span className="input-prefix">₽</span>
            </div>
            <div className="form-hint">Укажите минимальную цену, с которой начнутся торги</div>
          </div>

          <div className="form-group">
            <label className="form-label">URL изображения</label>
            <input
              type="url"
              className="form-input"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={formState.imageUrl}
              onChange={handleChange}
            />
            <div className="form-hint">Вставьте ссылку на изображение товара (опционально)</div>
            {formState.imageUrl && !previewError && (
              <div className="image-preview active" id="image-preview">
                <img
                  src={formState.imageUrl}
                  alt="Предпросмотр"
                  onError={() => setPreviewError(true)}
                />
              </div>
            )}
          </div>

          {(localError || error) && <div className="form-error">{localError || error}</div>}

          <div className="form-actions">
            <Link to="/" className="btn-cancel">
              Отмена
            </Link>
            <button type="submit" className="btn-submit" disabled={actionInProgress}>
              Создать товар
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default CreateItem