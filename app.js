//Basics
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

//Mongoose dependency
const mongoose = require('mongoose');
const article = require("./models/article");
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

//Models
require('./models/article');
const articleModel = mongoose.model("article");

//Define app
const app = express();

//View model
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.route('/articles')
    .get(async (req,res) =>{
        try{
            const articles = await articleModel.find({});

            if(articles.length > 0){
                res.render('home', {
                    articles: articles
                });
            }
            else{
                res.render('home', {
                    articles: []
                });
            }
        }
        catch (err){
            res.send("Failure");
            console.log(err);
        }        
    })
    .post(async (req,res) => {
        const title = req.body.articleTitle;
        const body = req.body.articleBody;
        console.log(title);
        console.log(req.body.articleTitle);
        console.log(body);
        console.log(req.body.articleBody);
        try{
            const newArticle = new articleModel({
                title : title,
                content : body
            });
            await newArticle.save();
            res.redirect("/articles");
        }catch(err){
            res.send(err);
            console.log(err);
        }

    })
    .delete(async(req,res) =>{
        try{
            await articleModel.deleteMany({});
            res.redirect("/articles");
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    });

app.route('/articles/:articleTitle')
    .get(async (req,res) =>{
        try{
            const title = req.params.articleTitle
            const article = await articleModel.findOne({title: title});

            if(article){
                // res.render('home', {
                //     article: article
                // });
                res.send(article);
            }
            else{
                res.send({});
            }
        }
        catch (err){
            res.send("Failure");
            console.log(err);
        }        
    })
    .put(async (req,res) => {
        try{
            const newTitle = req.body.articleTitle;
            const body = req.body.articleBody;
            const title = req.params.articleTitle;
            await articleModel.replaceOne({title : title},{title: newTitle, content: body}, {overwrite : true});
            res.redirect("/articles");
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    })
    .patch(async (req,res) => {
        try{
            const newTitle = req.body.articleTitle;
            const body = req.body.articleBody;
            const title = req.params.articleTitle;
            await articleModel.updateOne({title : title},{title: newTitle, content: body});
            res.redirect("/articles");
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    }).
    delete(async (req,res) => {
        try{
            const title = req.params.articleTitle;
            await articleModel.deleteOne({title: title});
            res.redirect("/articles");
        }
        catch(err){
            res.send(err);
            console.log(err);
        }
    });


app.listen(3000, function() {
    console.log("Server started on port 3000");
});