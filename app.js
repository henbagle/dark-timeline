//////////////////
// MODULES
//////////////////

const   express         = require("express"),
        mongoose        = require("mongoose"),
        dotEnv          = require("dotenv"),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        handlebars      = require("handlebars"),
        eHandlebars     = require("express-handlebars"),
        {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

if (process.env.NODE_ENV !== 'production') {
	dotEnv.config();
}

//////////////////
// ROUTES
//////////////////

const   chartRouter     = require("./rCharts"),
        editRouter      = require("./rEdit")



//////////////////
// INIT APP
//////////////////
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "hbs");
app.use(methodOverride("_method"))

app.engine('hbs', eHandlebars({
    layoutsDir: __dirname + '/views/layouts',
    extname: "hbs",
    defaultLayout: 'chart',
    partialsDir: __dirname + '/views/partials/',
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true,
    handlebars: allowInsecurePrototypeAccess(handlebars)
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