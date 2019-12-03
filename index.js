const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
var path = require('path')
const app = express();

const building = require('./controllers/api/BuildingApi');
const course = require('./controllers/api/CourseApi');


//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./config/connectDB');


//passport
// app.use(passport.initialize());
//passport config
// require('./config/passport')(passport);

app.use('/api/building', building);
app.use('/api/course', course);

app.use('/pdfFile', express.static(__dirname + '/pdfFile'))


const port = process.env.PORT || 1234;

app.listen(port, () => console.log(`Server đang khởi động ${port}`));