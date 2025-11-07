# ใช้ Node 24 บน Alpine (ขนาดเล็ก)
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# รัน Vite ให้เข้าถึงได้จากเครื่องภายนอก
CMD ["npm", "run", "dev", "--", "--host"]
