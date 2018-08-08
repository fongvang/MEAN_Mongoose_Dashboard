const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static/css')));
app.set('views', path.join(__dirname, "./views"));
app.set("view engine", "ejs");

// ----------MONGOOSE SCHEMA -------------------
mongoose.connect('mongodb://localhost:27017/mongoose_dashboard', { useNewUrlParser: true });
mongoose.Promise = global.Promise;

var AnimalSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 1},
    type: {type: String, required: true, minlength: 1},
    diet: {type: String, required: true, minlength: 1},
    life: {type: Number, required: true, minlength: 1},
    image: {type: String, required: true, minlength: 1},
}, {timestamps: true})

mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal');

// ---------- ROUTES AND LOCATIONS BELOW ---------------
app.get('/', function(req, res){
    Animal.find({}, function(err, animals){
        if (err){
            console.log("something went wrong here");
            res.redirect('/');
        }
        else {
            res.render('index', {animals});
        }
    })
});

app.get('/new', function(req, res){
    res.render('new');
});

app.post('/add', function(req, res){
    console.log("Post Data", req.body);
    var animal = new Animal({name: req.body.name, type: req.body.type, diet: req.body.diet, life: req.body.life, image: req.body.image});
    animal.save(function(err){
        if(err){
            console.log("Something went wrong while handling data");
            res.redirect('/');

        } else{
            console.log("Animal successfully stored!");
            res.redirect('/')
        }
    })
});


app.get('/:id', function(req, res){
    // Animal.findById({_id: req.params.id}, function(err, animals){
    Animal.find({_id: req.params.id}, function(err, animals){
        if (err){
            console.log("something went wrong with the ID");
        }
        else {
            res.render('show', {animal: animals[0]});
        }
    })
});

app.get('/:id/edit', function(req, res){
    Animal.find({_id: req.params.id}, function(err, animal){
        if(err){
            console.log(err);
        }
        else{
            res.render('edit', {animal: animal[0]});
        }
    })
});

app.post('/update/:id', function(req, res){
    Animal.update({ _id: req.params.id }, req.body, function(err, animal){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});

app.post('/:id/destroy', function(req, res){
	Animal.remove({ _id: req.params.id }, function(err, result){
		if (err){
			console.log(err);
		} else {
			res.redirect('/')
		}
	});
});


// ---------- PORT LISTENER --------------------
app.listen(8000,()=> 
console.log("Now serving on localhost:8000")
);