import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useItemStore } from '../store/useItemStore'
import { useUserStore } from '../store/useUserStore'
import './item-detail.css'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const ItemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { session } = useUserStore()
  const {
    currentItem,
    itemBids,
    loadingItem,
    actionInProgress,
    error,
    fetchItem,
    fetchItemBids,
    createBid,
    deleteItem,
    resetItemState,
  } = useItemStore()

  const [bidAmount, setBidAmount] = useState('')
  const [bidError, setBidError] = useState('')

  useEffect(() => {
    fetchItem(id)
    fetchItemBids(id)
    return () => resetItemState()
  }, [fetchItem, fetchItemBids, id, resetItemState])

  const isOwner = session?.user?.id === currentItem?.userId

  const handleBidSubmit = async (event) => {
    event.preventDefault()
    if (!session?.token) {
      setBidError('Только авторизованные пользователи могут делать ставки')
      return
    }
    const numericValue = Number(bidAmount)
    if (!numericValue || numericValue <= 0) {
      setBidError('Введите корректную сумму')
      return
    }
    try {
      await createBid(Number(id), numericValue)
      setBidAmount('')
      setBidError('')
    } catch (submitError) {
      setBidError(submitError.response?.data?.error || 'Не удалось сделать ставку')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Удалить товар? Действие нельзя отменить.')) return
    try {
      await deleteItem(Number(id))
      navigate('/')
    } catch (deleteError) {
      console.error(deleteError)
      window.alert(deleteError.response?.data?.error || 'Не удалось удалить товар')
    }
  }

  const bestBidId = useMemo(() => {
    if (!itemBids.length) {
      return undefined
    }
    return itemBids.reduce((best, bid) => (bid.amount > best.amount ? bid : best), itemBids[0]).id
  }, [itemBids])

  if (loadingItem && !currentItem) {
    return <p>Загрузка товара...</p>
  }

  if (error && !currentItem) {
    return (
      <div className="no-items">
        <p>{error}</p>
        <Link className="btn-primary" to="/">
          Вернуться к списку
        </Link>
      </div>
    )
  }

  if (!currentItem) {
    return null
  }

  return (
    <section>
      <Link className="back-link" to="/">
        ← Назад к списку
      </Link>

      <article className="item-detail">
        <div className="item-header">
          <img
            src={
              currentItem.imageUrl ||
              `https://placehold.co/800x600/2c3e50/FFF?text=${encodeURIComponent(
                currentItem.title.slice(0, 18),
              )}`
            }
            alt={currentItem.title}
            className="item-image-large"
          />
          <div className="item-info">
            <span className="item-status">
              {currentItem.status === 'active' ? 'Активно' : 'Завершено'}
            </span>
            <h1 className="item-title-large">{currentItem.title}</h1>
            <div className="item-seller-info">
              <div className="seller-avatar">
                {currentItem.username?.slice(0, 2).toUpperCase()}
              </div>
              <div className="seller-details">
                <div className="seller-name">@{currentItem.username}</div>
                <div className="seller-date">
                  Создано {new Date(currentItem.createdAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </div>
            <p className="item-description-full">{currentItem.description}</p>
            <div className="price-section">
              <div className="starting-price">Начальная цена</div>
              <div className="current-price">{currencyFormatter.format(currentItem.price)}</div>
              <div className="highest-bid">
                Текущая ставка:{' '}
                {currentItem.highestBid
                  ? currencyFormatter.format(currentItem.highestBid)
                  : 'нет ставок'}
              </div>

              {session?.token ? (
                <form className="bid-form" onSubmit={handleBidSubmit}>
                  <input
                    className="bid-input"
                    type="number"
                    name="amount"
                    min="1"
                    placeholder="Введите сумму"
                    value={bidAmount}
                    onChange={(event) => setBidAmount(event.target.value)}
                  />
                  {bidError && <div className="form-error">{bidError}</div>}
                  <button className="btn-bid" type="submit" disabled={actionInProgress}>
                    Сделать ставку
                  </button>
                </form>
              ) : (
                <p>
                  Чтобы делать ставки, <Link to="/signin">войдите</Link> в аккаунт.
                </p>
              )}

              {isOwner && (
                <button className="btn-delete" onClick={handleDelete} disabled={actionInProgress}>
                  Удалить товар
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bids-section">
          <div className="bids-header">
            <h2 className="bids-title">Ставки</h2>
            <span className="bids-count">{currentItem.bidCount || 0}</span>
          </div>
          {itemBids.length === 0 ? (
            <div className="no-bids">Ставок пока нет</div>
          ) : (
            <div className="bids-list">
              {itemBids.map((bid) => (
                <div
                  key={bid.id}
                  className={`bid-item ${bid.id === bestBidId ? 'highest-bid-item' : ''}`}
                >
                  <div className="bid-user">
                    <div className="bid-avatar">{bid.username.slice(0, 2).toUpperCase()}</div>
                    <div className="bid-details">
                      <span className="bid-username">@{bid.username}</span>
                      <span className="bid-time">
                        {new Date(bid.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="bid-amount">{currencyFormatter.format(bid.amount)}</span>
                    {bid.id === bestBidId && <span className="highest-badge">Лидирует</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  )
}

export default ItemDetail
