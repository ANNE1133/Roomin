//download
https://nodejs.org/en/download/package-manager/current
https://www.postman.com/downloads/

-----------Server---------------
npm init -y
npm install express morgan cors nodemon bcryptjs jsonwebtoken

npm install prisma
npx prisma init
npm install @prisma/client

// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล
npx prisma migrate dev --name ecom

//
อัพเดต Prisma schema
npx prisma migrate dev

//ก่อนเริ่มทำ เชื่อม prisma ด้วยจ้า
npx prisma generate

------------เพื่อนทำแค่นี้พอ-------------
npm install
npx prisma generate
npm run dev

----------- run -------------
เปิด terminal 2 อัน
1 Backend Folder \Roomin --> npm start
2 Front \Roomin\Front --> npm run dev