var mongoose = require('mongoose')
var jade = require('jade')
var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var port = 3000

app.set('views','./views')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, '/static')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port)
console.log('server is listening on port' + port)

mongoose.connect('mongodb://localhost:27017/hometown')
var db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function (callback) {
  console.log('db service connected.')
})

//set schema
var blogSchema = new mongoose.Schema({
	article_id: {type:Number,default:0},
  	title: String,
  	detail: String,
  	img: String,
  	view: {type:Number,default:0}
})
//pub model
var blogModel = db.model('towntrip',blogSchema)

//index page
app.get('/',function(req,res,next){

	blogModel.find(function(err,articles){
	    res.render('index', {title:'Home Town',articles:articles})
	})
})

//article page
app.get('/article/:id',function(req,res,next){

	var id = req.params.id

	blogModel.find({article_id:id},function(err,articles){ //update view number +1

		//update view number
		blogModel.update({article_id:id},{$inc:{view:1}},function(err){

			//render aiticle page
			res.render('article', {title:'Home Town',articles:articles})

		})
			
	})

})

//admin_list page
app.get('/admin',function(req,res,next){

	blogModel.find(function(err,articles){
	    res.render('admin_list', {title:'Home Town',articles:articles})
	})
})

//admin_edit page
app.get('/edit/:id',function(req,res,next){

	var id = req.params.id

	blogModel.find({article_id:id},function(err,articles){
		articles.forEach(function(item,err){

			res.render('admin_edit', {title:'Home Town',article:item})

		})
	})
})

//admin_gotowrite page
app.get('/write',function(req,res,next){

    res.render('admin_edit', {title:'Home Town',article:{article_id:'undefind',title:'',detail:''}})

})

//admin_edit_submit process
app.post('/editSubmit',function(req,res,next){

	var id = req.body.article_id
	var title = req.body.title
	var detail = req.body.detail

	if(id !== 'undefind'){ //update

		blogModel.update({article_id:id},{$set:{title:title,detail:detail}},function(err){

			//render aiticle page
			res.redirect('/admin')

		})

	}else{ //new add

		var data = new blogModel({
			title:title,
			detail:detail,
			img:'upload/img/a3.jpg',
			article_id:7 //debugger
		})
		data.save()

		//render admin page
		res.redirect('/admin')

	}
	
})

//admin_delete process
app.get('/delete/:id',function(req,res,next){

	var id = req.params.id
	
	blogModel.remove({article_id:id},function(err){
		
		//render admin page
		res.redirect('/admin')
	})
})





