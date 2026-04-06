import http from 'k6/http';
import { check, sleep } from 'k6';

// Налаштування тесту
export let options = {
  vus: 10, // кількість віртуальних користувачів
  duration: '30s', // тривалість тесту
};

// Масив каналів доставки
const channels = ['email', 'http', 'internal', 'test', 'test2'];

// Генеруємо випадковий payload для тесту
function randomPayload(channel) {
  return {
    channel,
    payload: {
      to: Math.floor(Math.random() * channel.length),
      text: `Test message for ${channel}`,
      timestamp: new Date().toISOString(),
    },
  };
}

export default function () {
  // Вибираємо випадковий канал
  const channel = channels[Math.floor(Math.random() * channels.length)];
  const payload = JSON.stringify(randomPayload(channel));

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  // Надсилаємо POST-запит на API, який створює deliver job
  const res = http.post('http://app:3002/api/produce', payload, params);

  check(res, {
    'status 201 or 200': (r) => r.status === 201 || r.status === 200,
  });

  sleep(1);
}
