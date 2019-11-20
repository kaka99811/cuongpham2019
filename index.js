const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

const building = require('./controllers/api/BuildingApi');
const course = require('./controllers/api/CourseApi');


//Body-Parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

require('./config/connectDB');


//passport
// app.use(passport.initialize());
//passport config
// require('./config/passport')(passport);

app.use('/api/building', building);
app.use('/api/course', course);


const port = process.env.PORT || 1234;

app.listen(port, () => console.log(`Server đang khởi động ${port}`));