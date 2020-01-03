//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Connect to Mongo DB.
mongoose.connect("mongodb+srv://admin-matthew:8jlmHYX6^@cluster0-4r8nx.mongodb.net/todolistDB", {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false });

//Create new schema.
const itemsSchema = {
  name : String
};

//Declare new collection
const Item = mongoose.model("Item", itemsSchema);

//Add example items.
const item1 = new Item({
  name: "Buy Amazon Prime."
});

const item2 = new Item({
  name: "Ensure you have a Chromecast."
});

const item3 = new Item({
  name: "Place Chromecast in living room."
});

//Add default items to the default Items array
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

  if (foundItems.length === 0){
    //Insert defaultItems to the items collection
    Item.insertMany(defaultItems, function(err){
      if(err){
        console.log(err);
      }
      else{
        Console.log("Upload Successful.");
      }
    });
    //Refresh to home directiory to display items.
    res.redirect("/");
  } else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
   }
  });
});

//Add new items to the mongo db.
app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log("Succssfully deleted checked item.")
    }
  })
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
