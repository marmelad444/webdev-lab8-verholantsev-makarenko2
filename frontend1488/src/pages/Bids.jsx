import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useItemStore } from '../store/useItemStore'
import { useUserStore } from '../store/useUserStore'
import './Bids.css'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const Bids = () => {
  const { session } = useUserStore()
  const { myBids, fetchMyBids } = useItemStore()

  useEffect(() => {
    if (session?.token) {
      fetchMyBids()
    }
  }, [session?.token, fetchMyBids])

  if (!session?.token) {
    return (
      <div className="no-bids">
        <div className="no-bids-icon">🔐</div>
        <h2>Войдите в аккаунт</h2>
        <p>История ставок доступна только авторизованным пользователям.</p>
        <Link className="btn-browse" to="/signin">
          Войти
        </Link>
      </div>
    )
  }

  const totalAmount = myBids.reduce((sum, bid) => sum + bid.amount, 0)
  const winningCount = myBids.filter((bid) => bid.isWinning).length

  return (
    <section>
      <div className="page-header">
        <h1>Мои ставки</h1>
        <p className="page-subtitle">История ваших ставок на товары</p>
      </div>

      <div className="bids-summary">
        <div className="summary-card">
          <span className="summary-value">{myBids.length}</span>
          <span className="summary-label">Всего ставок</span>
        </div>
        <div className="summary-card winning">
          <span className="summary-value">{winningCount}</span>
          <span className="summary-label">Лидирующих ставок</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{currencyFormatter.format(totalAmount)}</span>
          <span className="summary-label">Общая сумма</span>
        </div>
      </div>

      {myBids.length === 0 ? (
        <div className="no-bids">
          <div className="no-bids-icon">💸</div>
          <h2>Вы еще не делали ставок</h2>
          <p>Просмотрите доступные товары и сделайте первую ставку!</p>
          <Link className="btn-browse" to="/">
            Посмотреть товары
          </Link>
        </div>
      ) : (
        <div className="bids-list">
          {myBids.map((bid) => (
            <div key={bid.id} className={`bid-item ${bid.isWinning ? 'winning' : ''}`}>
              <img
                src={`https://placehold.co/80x80/2c3e50/FFF?text=${encodeURIComponent(
                  bid.itemTitle.slice(0, 4),
                )}`}
                alt={bid.itemTitle}
                className="bid-item-image"
              />
              <div className="bid-item-content">
                <div className="bid-item-header">
                  <Link to={`/items/${bid.itemId}`} className="bid-item-title">
                    {bid.itemTitle}
                  </Link>
                  {bid.isWinning ? (
                    <span className="winning-badge">🏆 Лидирую</span>
                  ) : (
                    <span className="outbid-badge">Перебита</span>
                  )}
                </div>
                <div className="bid-item-meta">
                  <span>⏰ {new Date(bid.createdAt).toLocaleString('ru-RU')}</span>
                </div>
              </div>
              <div className="bid-item-amount">
                <span className="bid-amount">{currencyFormatter.format(bid.amount)}</span>
                <span className="bid-status">Моя ставка</span>
                {!bid.isWinning && <div className="current-highest">Ставка перебита</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Bids