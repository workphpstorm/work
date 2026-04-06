# 🚀 Project NyanKat

## 🧩 Core стек

- [NestJS](https://nestjs.com)
- [Redis](https://redis.io)
- [PostgreSQL](https://www.postgresql.org)

---

## 🛠 Допоміжні тулзи

- [Grafana](https://grafana.com)
- [Prometheus](https://prometheus.io)
- [PG admin](https://www.pgadmin.org/)

---

## 🔄 Оркестрація черг

- [BullMQ](https://docs.bullmq.io)

## 🐳 Встановлення через Docker
**Потрібна версія Docker:** 20.10 або новіша
### 📦 Передумови

Переконайтесь, що у вас встановлено:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### 🚀 Запуск проєкту

1. Клонувати репозиторій:

```bash
git clone https://github.com/workphpstorm/work.git
cd work
```

2. Створити .env файл:
```bash
cp .env.example .env
```

3. Запустити всі сервіси:
```bash
docker compose up --build
```
- 3.1 Tip 
```
При старті докера також стартує сервіс k6 який проводть тестування навантаження
```
### 🧩Встановлені сервіси
- [NestJS](http://localhost:3002) просто лінк апки
- [Prometheus](http://localhost:9090) 
- [Prometheus targets](http://localhost:9090/targets) лінки де промс збирає метрики
- [Postgres](http://localhost:8080) ui для перегляду бази данних встановити тестовий ключ пароль від локальноі бд - password
- [Bull board](http://localhost:3002/queues) ui для керування чергами
- [Grafana](http://localhost:3003/dashboards)  ui для перегляду графіків по метрикам admin/admin та встановити власний пароль

### 📝Метрики 
- [NestJS metrics](http://localhost:3002/metrics)
- [Redis metrics](http://localhost:9121/metrics)

### 💻 Корисне
 - Якщо є запит тестування навантеження то можна спробувати [K6](https://grafana.com/docs/k6/latest/set-up/install-k6/) 
 -  в папці K6 в root директоріі лежить скрипт [test.js](k6/test.js)
 - запустити
``` bash
docker compose run k6
```
- Запуск тестів 
```bash
npm run test
```
### http запит для тестування черги 

```curl
curl --location 'http://localhost:3002/api/produce' \
--header 'Content-Type: application/json' \
--data-raw '{
  "channel": "email",
  "payload": {
    "to": "user@example.com",
    "subject": "Підтвердження замовлення",
    "body": "Ваше замовлення #123 прийнято",
    "metadata": {
      "orderId": "123",
      "status": "placed"
    }
  }
}'
```
### have a nice day ✌🏻