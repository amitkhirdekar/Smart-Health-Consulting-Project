var express   			= require("express"),
	app	      			= express(),
	path				= require("path"),
	passport  			= require("passport"),
	LocalStrategy		= require("passport-local"),
	bodyParser			= require("body-parser"),
	User				= require("./models/user"),
	flash				= require("connect-flash"),
	methodOverride		= require("method-override"),
	favicon 			= require("serve-favicon"),
  mongoose			= require("mongoose")
  const http = require('http');
  const server = http.createServer(app);
  const socketio = require('socket.io');
  const io = socketio(server);
  const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');
const formatMessage = require('./utils/messages');
	
//Requiring Routes
var patientRoutes 		= require("./routes/patient");
var indexRoutes			= require("./routes/index");
var adminRoutes     	= require("./routes/admin");
var medicalRecordRoutes	= require("./routes/medicalrecords");
var doctorRoutes		= require("./routes/doctor");
var appointmentRoutes	= require("./routes/appointment");
var db              	= require("./config/keys").mongoURI;

mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
  mongoose.Promise = global.Promise;
  mongoose.set('useFindAndModify', false);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(favicon(path.join(__dirname,'public','favicon.ico')));



//Passport Config
app.use(require("express-session")({
	secret : "Secret KEY",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser 	= req.user;
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	next();
});


app.use("/", indexRoutes);
app.use("/patient/",patientRoutes);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);

app.use('/patient/:id/appointment/', appointmentRoutes);

app.use('/patient/:id/MedicalRecords/', medicalRecordRoutes);

const botName = 'Chat Bot';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Consult Room!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat!`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);
    // console.log(msg, user)
    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});


const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log(`Server started on port ${PORT}`));

