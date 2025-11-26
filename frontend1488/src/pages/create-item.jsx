<body>
    <div class="page-header">
        <h1>Создать новый товар</h1>
    </div>

    <div class="form-container">
        <form id="create-item-form">
            <div class="form-group">
                <label class="form-label">
                    Название товара <span class="required">*</span>
                </label>
                <Input 
                    type="text" 
                    class="form-input" 
                    name="title"
                    placeholder="Например: iPhone 14 Pro 256GB"
                    maxlength="100"
                    required
                >
                <div class="char-counter">
                    <span class="current">0</span> / 100
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Описание <span class="required">*</span>
                </label>
                <textarea 
                    class="form-textarea" 
                    name="description"
                    placeholder="Подробно опишите товар, его состояние, характеристики..."
                    maxlength="1000"
                    required
                ></textarea>
                <div class="char-counter">
                    <span class="current">0</span> / 1000
                </div>
                <div class="form-hint">
                    Чем подробнее описание, тем больше шансов продать товар
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    Начальная цена <span class="required">*</span>
                </label>
                <div class="input-group">
                    <input 
                        type="number" 
                        class="form-input with-prefix" 
                        name="price"
                        placeholder="5000"
                        min="1"
                        step="100"
                        required
                    >
                    <span class="input-prefix">₽</span>
                </div>
                <div class="form-hint">
                    Укажите минимальную цену, с которой начнутся торги
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">
                    URL изображения
                </label>
                <input 
                    type="url" 
                    class="form-input" 
                    name="imageUrl"
                    placeholder="https://example.com/image.jpg"
                >
                <div class="form-hint">
                    Вставьте ссылку на изображение товара (опционально)
                </div>
                <div class="image-preview" id="image-preview">
                    <img src="" alt="Предпросмотр">
                </div>
            </div>

            <div class="form-actions">
                <a href="/" class="btn-cancel">Отмена</a>
                <button type="submit" class="btn-submit">Создать товар</button>
            </div>
        </form>
    </div>
</body>