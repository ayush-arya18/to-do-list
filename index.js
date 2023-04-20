//requiring modules
const express=require("express");
const bodyParser=require("body-parser");
//const date=require(__dirname + "/date.js");
const mongoose=require('mongoose');
const _=require('lodash');
mongoose.connect('mongodb+srv://admin_ayushsingh1872:lCqvgokxl57RSvsA@cluster0.hnsq2um.mongodb.net/to-do-list?retryWrites=true&w=majority');

//declarations
const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');
app.use(express.static("public"));

//detabase schema,model,documents creation
const itemsSchema=new mongoose.Schema({
    name:String
});
const data=mongoose.model('data',itemsSchema);

const listSchema=new mongoose.Schema({
    name:String,
    items:[itemsSchema]
});
const list=mongoose.model('list',listSchema);
const item1=new data({
    name:"hi welcome to your to do list"
});
const item2=new data({
    name:"click + to add new items"
});
const item3=new data({
    name:"<--- press this to delete an item"
});
var defaultItems=[item1,item2,item3];

//handling root get request
app.get("/" , function(req,res){

    data.find().then(found=>{
        if(found.length===0){
        data.insertMany(defaultItems);
        res.redirect("/");
        }
        else{
            res.render("list",{tday:"Today",itemd:found});  
        }
    });      
});
//handling custom get request
app.get("/:userCustomRoute",function(req,res){
    const userRoute=_.capitalize(req.params.userCustomRoute);
    list.findOne({name:userRoute}).then(found=>{
        if(!found){
            const lst=new list({
                name:userRoute,
                items:defaultItems
            });
            lst.save();
            res.redirect("/"+userRoute);
        }
        else{
            res.render('list',{tday:found.name,itemd:found.items});
        }
    });
});

//handling different post request
app.post("/",function(req,res){
    const usrRoute=req.body.btn1;
    var item=new data({
        name:req.body.field1
    });
    if(usrRoute === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        list.findOne({name:usrRoute}).then(found=>{
            found.items.push(item);
            found.save();
            res.redirect("/"+usrRoute);
        });
    }
});
//handling post request to delete an item
app.post("/delete",function(req,res){
    var idToDelete=req.body.check;
    var listName=req.body.listName;
    if(listName==="Today"){
        data.deleteOne({_id:idToDelete}).exec();
        res.redirect("/");
    }
    else{
        list.findOne({name:listName}).then(found=>{
            found.items.pull(idToDelete);
            found.save();
            res.redirect("/"+listName);
        });
    }
});

//starting the server
app.listen(4000, function(){
    console.log("server sarted listening on port no 3000");
});