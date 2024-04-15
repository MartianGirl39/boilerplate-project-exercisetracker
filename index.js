const express = require('express')
const app = express();
const cors = require('cors')
const { connectDB } = require('./db')
const user_router = require('./routes/user.route');
const dotenv = require('dotenv').config()

const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());
app.use(express.static('public'));

app.use(cors())
app.use(express.static('public'))

connectDB();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/api/users', user_router);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
