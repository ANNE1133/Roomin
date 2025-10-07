const express = require ( 'express' ); 
// const router = require ('./backend/routers/users.js')
const app = express ();
// const path = require('path');
const { readdirSync } = require('fs')
const cors = require('cors');
const morgan = require('morgan');

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

readdirSync('./backend/routers')
  .forEach((c) => app.use('/api', require('./backend/routers/' + c)));



// app.set('views',path.join(__dirname,'views'))
// app.set('view engine','ejs')
// app.use(router)
// app.use(express.static(path.join(__dirname,'public')))


const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
