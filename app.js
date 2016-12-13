var mongodb = require('mongodb')
var jade = require('jade')
var path = require('path')
var express = require('express')
var app = express()

app.set('views','./views')
app.set('view engine','jade')
app.use(express.static(path.join(__dirname, '/static')))
app.listen(3000)
console.log('server is listening...')

var articles = []

app.get('/',function(req,res,next){

	res.render('index', {title:'Home Town',articles:articles})

})

mongodb.connect("mongodb://127.0.0.1:27017/movie",function(err,db){

	var result = db.collection('movietbl').find()
	result.forEach(function(item,err){

		articles.push(item.title)

	},function(){

		db.close()

	})

})


