import { useNavigate } from 'react-router-dom'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export const ItemCard = ({ item }) => {
  const navigate = useNavigate()
  const {
    id,
    title,
    description,
    price,
    highestBid,
    bidCount,
    username,
    imageUrl,
    status,
  } = item

  const goToDetails = () => navigate(`/items/${id}`)
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      goToDetails()
    }
  }

  return (
    <article
      className="item-card"
      role="button"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={handleKeyDown}
    >
      <img
        className="item-image"
        src={
          imageUrl ||
          `https://placehold.co/600x400/2c3e50/FFF?text=${encodeURIComponent(title.slice(0, 18))}`
        }
        alt={title}
        loading="lazy"
      />
      <div className="item-content">
        <span className={`status-badge ${status === 'active' ? 'status-active' : ''}`}>
          {status === 'active' ? 'Активно' : 'Завершено'}
        </span>
        <h3 className="item-title">{title}</h3>
        <p className="item-description">{description}</p>
        <div className="item-footer">
          <div>
            <div className="item-price">{currencyFormatter.format(price)}</div>
            <div className="bid-info">
              Текущая ставка: {highestBid ? currencyFormatter.format(highestBid) : 'нет ставок'}
              <span className="bid-count">{bidCount || 0}</span>
            </div>
          </div>
          <div className="item-meta">
            <span className="item-seller">Продавец: {username}</span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ItemCard
