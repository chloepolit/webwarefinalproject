import 'dotenv/config'
import express from "express";
import ViteExpress from "vite-express";
import {MongoClient} from 'mongodb';
import bcrypt from "bcrypt";

const app = express();
const appdata = []
let gpa = 0.0
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@${process.env.HOST}`
const client = new MongoClient( uri )
app.use( express.json() )

app.post( '/read', async ( req, res ) => {
  const {userId} = req.body
  const formEntry = client.db("finalProject").collection('entries')
  const userGPA = client.db("finalProject").collection('gpa')

  const allEntries = await formEntry.find({id: userId}).toArray()
  const gpaRecord = await userGPA.findOne({id: userId})
  
  return res.json({
    entries: allEntries,
    gpa: gpaRecord
  })

})

app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = client.db("finalProject").collection("users");

    const existingUser = await users.findOne({ username });

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      username,
      password: hashedPassword,
    });

    res.json({
      success: true,
      userId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Could not create account.",
    });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const users = client.db("finalProject").collection("users");

    const user = await users.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    console.log("Password matches:", passwordMatches);

    if (!passwordMatches) {
      return res.json({
        success: false,
        message: "Incorrect username or password.",
      });
    }

    res.json({
      success: true,
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Could not log in.",
    });
  }
})

app.post( '/add', async ( req,res ) => {
  const {userId, assignmenttype, gradeletter, cmts} = req.body
  const formEntry = client.db("finalProject").collection('entries')
  const userGPA = client.db("finalProject").collection('gpa')
  let newGPA = 0.0

  const newEntry = {
    id: userId,
    assignmenttype: assignmenttype,
    gradeletter: gradeletter,
    cmts: cmts,
  }
  await formEntry.insertOne(newEntry)
  const userEntries = await formEntry.find({ id: userId }).toArray()
  if (gpa == 0.0){
    if (gradeletter == "a"){
      newGPA = 4.0
    } else if (gradeletter == "b"){
      newGPA = 3.0
    } else if (gradeletter == "c"){
      newGPA = 2.0
    } else if (gradeletter == 'd'){
      newGPA = 1.0
    }
    gpa = newGPA
  } else {
    userEntries.forEach( entry => {
      const grade = entry.gradeletter
      if (grade == "a"){
        newGPA += 4.0
      } else if (grade == "b"){
        newGPA += 3.0
      } else if (grade == "c"){
        newGPA += 2.0
      } else if (grade == 'd'){
        newGPA += 1.0
      }
    })
    gpa = (newGPA / userEntries.length).toFixed(2)
  }
  if (await userGPA.findOne({id: userId})){
    await userGPA.updateOne( 
      {id: userId},
      {$set:{GPA: gpa}}
    )
  } else{
    await userGPA.insertOne({id: userId, GPA: gpa})
  }
  res.json({
    entries: userEntries,
    updatedGPA: gpa 
  })
})

app.get("/hello", (req, res) => {
  res.send("Hello Vite + React!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
