import http from 'k6/http'
import { sleep } from 'k6'
export const options = {
  vus: 10,
  duration: '5m',
}
export default function () {
  http.get('http://arch.homework/users')
  http.get('http://arch.homework/chaos?delayMs=500')
  if (Math.random() < 0.1) {
    http.get('http://arch.homework/chaos?fail=true')
  }
  sleep(0.2)
}