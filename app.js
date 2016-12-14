var mongoose = require('mongoose')
var jade = require('jade')
var path = require('path')
var express = require('express')
var app = express()
var port = 3000

app.set('views','./views')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, '/static')))
app.listen(port)
console.log('server is listening on port' + port)

mongoose.connect('mongodb://localhost:27017/hometown');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('db service connected.')
});

//set schema
var blogSchema = new mongoose.Schema({
	article_id: {type:Number,default:0},
  	title: String,
  	detail: String,
  	img: String,
  	view: {type:Number,default:0}
});
//pub model
var blogModel = db.model('towntrip',blogSchema);

//add data
//var data = new blogModel({title:'Guanyin Mountain',detail:'With history culture,Guanyin Mountain is known for so many years.',img:'upload/img/a2.jpg',view:0})
//data.save()

//update data
//blogModel.update({_id:'5850c66834d5c51918f04d4c'},{$set:{view:1}},function(err){});

//index page
app.get('/',function(req,res,next){

	blogModel.find(function(err,articles){
	    res.render('index', {title:'Home Town',articles:articles})
	})
})

//article page
app.get('/article/:id',function(req,res,next){

	var id = req.params.id
	var view

	blogModel.find({article_id:id},function(err,articles){ //get view number and ++
		articles.forEach(function(item,err){
			view = item.view + 1
			//update view number
			blogModel.update({article_id:id},{$set:{view:view}},function(err){

				//render aiticle page
				res.render('article', {title:'Home Town',articles:articles})

			});
			
		})
	})

})




