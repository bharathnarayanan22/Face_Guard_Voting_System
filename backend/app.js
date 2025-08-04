const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const partyRoutes = require('./routes/partyRoutes');
const voterRoutes = require('./routes/voterRoutes');
const regionRoutes = require('./routes/regionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/Face_Guard_Voting_System', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB connected and server is running.");
});

app.use('/', partyRoutes);
app.use('/', voterRoutes);
app.use('/', regionRoutes);

const Port = 3000;

// Start the Server
app.listen(Port, () => {
    console.log(`Server started on PORT:${Port}`);
});

