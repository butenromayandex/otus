# ДЗ: Паттерны декомпозиции микросервисов

Кейс: сеть сэндвич-шопов, раньше только факс, теперь онлайн-заказы (ката BLT).

---

## 0. Паттерн декомпозиции

Взял **Decompose by Business Capability** — режу по зонам бизнеса (меню, магазины, заказ, оплата, доставка, уведомления), не по UI/DB.

Переход со старого — **Strangler**: не выкидываем всё сразу.

1. Menu + Store
2. Order (самовывоз) + Identity
3. Payment
4. Delivery
5. Notification

Факс/старый канал постепенно отключается.

Gateway, Identity и Message Broker — скорее инфраструктура, но без них схема кривая, оставил.

---

## 1. Пользовательские сценарии

**UC-1. Самовывоз** — выбрать магазин → меню/акции → заказ → оплата online или на месте → время готовности + маршрут (Яндекс Карты).

**UC-2. Доставка** — как UC-1 + адрес; проверка что у точки есть delivery; статусы готовится / в пути / доставлен.

**UC-3. Акции** — national + local для магазина.

**UC-4. Оплата при получении** — без online; на точке или у курьера → paid.

**UC-5. Мобильный** — тот же бэкенд, другой клиент через gateway.

---

## 2. C4 Container

`diagrams/c4-containers.puml` (или картинка `./c4-containers.png`)

```
Клиент / сотрудник / курьер
        ↓
   API Gateway
        ├→ Identity
        ├→ Menu → Store → Яндекс Карты
        ├→ Store
        ├→ Order → Menu, Store, Identity, Payment
        ├→ Payment → Платёжный шлюз
        └→ Delivery → Store
        ↓
  Message Broker
        ├↔ Order, Payment, Delivery
        └→ Notification → Identity, каналы (push/SMS/email)
```

---

## 3. Сервисы (canvas)

По шаблону с доски — 4 поля.

### Identity

| Service Name: Identity | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| — | `GET /users/{id}`, `POST /auth/login`, `POST /users` |
| **Event Subscriptions** | **Events Published** |
| — | — |

### Menu

| Service Name: Menu | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Store (`storeId`) | `GET /menus`, `GET /promotions`, CRUD items |
| **Event Subscriptions** | **Events Published** |
| — | — |

### Store

| Service Name: Store | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Яндекс Карты | `GET /stores`, `GET /stores/{id}/directions` |
| **Event Subscriptions** | **Events Published** |
| — | — |

### Order

| Service Name: Order | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Menu, Store, Identity, Payment; Delivery через события | `GET /orders/{id}`, `POST /orders`, `PATCH .../status` |
| **Event Subscriptions** | **Events Published** |
| `PaymentCompleted`, `DeliveryAssigned`, `DeliveryCompleted` | `OrderConfirmed`, `OrderReady` |

### Payment

| Service Name: Payment | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Платёжный шлюз | `GET /payments/{id}`, `POST /payments` |
| **Event Subscriptions** | **Events Published** |
| `OrderConfirmed` (опц.) | `PaymentCompleted`, `PaymentFailed` |

### Delivery

| Service Name: Delivery | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Store (зона) | `GET /deliveries/{id}`, `PATCH .../status` |
| **Event Subscriptions** | **Events Published** |
| `OrderReady` | `DeliveryAssigned`, `DeliveryCompleted` |

### Notification

| Service Name: Notification | |
|---|---|
| **Service Dependencies** | **Queries and Commands** |
| Identity, каналы push/SMS/email | — (только по событиям) |
| **Event Subscriptions** | **Events Published** |
| Order / Payment / Delivery события | — |

Gateway и Message Broker — на C4, отдельный canvas не делал.

---

## 4. Как сервисы общаются

- **REST** — нужен ответ сразу
- **События** — можно узнать потом

Типичный самовывоз:

```
Клиент → Gateway → Order
                     ├ REST → Menu, Store, Identity
                     └ REST → Payment → шлюз

Payment шлёт событие → Order
Notification слушает события → пишет клиенту
```

Доставка: то же + `OrderReady` → Delivery.

Пример `POST /orders`:

```json
{
  "userId": "u-123",
  "storeId": "s-45",
  "type": "pickup",
  "items": [{"sku": "blt", "qty": 2}],
  "paymentMethod": "online"
}
```

Стрелки целиком — на C4.

---

## 5. Сомнения

- Акции отдельным Promotion? пока в Menu
- Cart отдельно? пока на клиенте / в Order
- Order слишком связан со всеми — для первой итерации норм
- Delivery только по `OrderReady`, без sync к Order
- Notification без своей БД — ок на старте?
