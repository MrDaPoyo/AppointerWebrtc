const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/create_meeting', (req, res) => {
    const meetingId = uuidv4();
    res.redirect(`/meeting/${meetingId}`);
});

app.get('/meeting/:meetingId', (req, res) => {
    const meetingId = req.params.meetingId;
    res.send(`<h1>Meeting ID: ${meetingId}</h1>`);
});

io.on('connection', (socket) => {
    console.log('a user connected');
});
// Okay, I was just wondering cuz I cant integrate the chat with the accounts
// yea I know, but I ment the existing server code
// let me spin up that instance
app.listen(port, () => {
    console.log(`Appointer Meeting Server listening at http://localhost:${port}`);
});