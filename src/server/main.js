import 'dotenv/config'
import express from "express";
import ViteExpress from "vite-express";
import {MongoClient} from 'mongodb';

const app = express();
const appdata = []
let gpa = 0.0
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient( uri )
app.use( express.json() )

app.get( '/read', async ( req, res ) => {
  const formEntry = client.db("finalProject").collection('entries')
  const allEntries = await formEntry.find({}).toArray()
  return res.json(allEntries)

})

app.post( '/add', ( req,res ) => {
  const {yourname, assignmenttype, gradeletter, cmts} = req.body
  const formEntry = client.db("finalProject").collection('entries')
  const user = client.db("finalProject").collection('users')
  let newGPA = 0.0
  if (gradeletter == "a"){
    newGPA = 4.0
  } else if (gradeletter == "b"){
    newGPA = 3.0
  } else if (gradeletter == "c"){
    newGPA = 2.0
  } else if (gradeletter == 'd'){
    newGPA = 1.0
  }
  if (gpa == 0.0){
    gpa = newGPA
  } else {
    gpa = (newGPA + gpa) / 2
  }
  const newEntry = {
    yourname: yourname,
    assignmenttype: assignmenttype,
    gradeletter: gradeletter,
    cmts: cmts,
  }
  formEntry.insertOne(newEntry)
  if (user.findOne({yourname:yourname})){
    user.updateOne(
      {yourname: yourname},
      {$set: {GPA: gpa}}
    )
  } else{
    user.insertOne({yourname: yourname, GPA: gpa})
  }
  res.json({
    entries: appdata,
    updatedGPA: gpa 
  })
})

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
