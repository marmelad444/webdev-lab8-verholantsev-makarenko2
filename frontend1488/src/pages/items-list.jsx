import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ItemCard from '../components/ItemCard'
import { useItemStore } from '../store/useItemStore'
import './item-list.css'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

const ItemsList = () => {
  const { items=[], stats, loadingItems, error, fetchItems, fetchStats } = useItemStore()

  useEffect(() => {
    fetchItems()
    fetchStats()
  }, [fetchItems, fetchStats])

  return (
    <section>
      <div className="page-header">
        <h1>Все товары</h1>
        <Link className="btn-primary" to="/create-item">
          + Добавить товар
        </Link>
      </div>

      {stats && (
        <div className="stats">
          <div className="stat-item">
            <span className="stat-value">{stats.totalItems}</span>
            <span className="stat-label">Товаров</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalBids}</span>
            <span className="stat-label">Ставок</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.activeItems}</span>
            <span className="stat-label">Активных</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              {currencyFormatter.format(stats.averageItemPrice || 0)}
            </span>
            <span className="stat-label">Средняя цена</span>
          </div>
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {loadingItems ? (
        <p>Загружаем товары...</p>
      ) : !items || items.length === 0 ? (
        <div className="no-items">
          <div className="no-items-icon">📦</div>
          <h2>Товаров пока нет</h2>
          <p>Станьте первым, кто разместит товар на продажу!</p>
          <Link className="btn-primary" to="/create-item">
            Создать товар
          </Link>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ItemsList
