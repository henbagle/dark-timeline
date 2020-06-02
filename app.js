//////////////////
// MODULES
//////////////////

const   express         = require("express"),
        mongoose        = require("mongoose"),
        dotEnv          = require("dotenv"),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        handlebars      = require("express-handlebars");

if (process.env.NODE_ENV !== 'production') {
	dotEnv.config();
}

//////////////////
// ROUTES
//////////////////

const   chartRouter     = require("./rCharts"),
        editRouter      = require("./rEdit"),
        darkHelper      = require("./helpers");



//////////////////
// INIT APP
//////////////////
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "handlebars");
app.use(methodOverride("_method"))

app.engine('handlebars', handlebars({
    layoutsDir: __dirname + '/views/layouts',
    }))

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

//////////////////
// ROUTES
//////////////////

app.use(chartRouter);
app.use(editRouter);


//////////////////
// START APP
//////////////////

if(process.env.NODE_ENV !== "production"){
	app.listen(3000, function(){
		console.log("Dark timeline testing server running on port 3000!")
	})
}
else{
	app.listen(process.env.PORT || 5000, process.env.IP, function(){
		console.log("Dark timeline production server running!")
	})
}