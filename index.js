const express = require("express");
const jwt = require ("jsonwebtoken");
const path = require("path");
const JWT_SECRET = ("shivampandey1607 ")
const app = express ();
app.use(express.json());
app.use(express.static('public'));
const users = [];

function logger (req,res,next){
    console.log(req.method+"  request came to " +req.url);
    next();
}
//local host:3000 , to avoid some complexity such as CORS 
app.get("/" ,function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
})
app.post( "/signup", logger ,function (req,res ){
    const username =req.body.username;
    const password =req.body.password;


    if (username.length<5){
        res.json({
            message : "no , your username is very small"
        })
        return ;
    }
    

    
     users.push ({
        username :username,
        password : password
     })

    res.json({
        message :"hey you are signed in"
    })
})
//so this below end point is to generate the jwt
app.post("/signin", logger ,function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    
    let foundUser = null;
    for (let i=0; i<users.length; i++){
        if(users[i].username === username && users[i].password === password){
            foundUser = users[i]
        }
    }
    if(!foundUser){
        res.json({
            message : "credential are invalid",
        });
        return;
    }else {
         const token =jwt.sign({
            username
         },JWT_SECRET);
         res.header("jwt",token);
        //res.header("random",);
         
         res.json({
            token:token,
         })
    }
})

function auth (req,res,next){        //this auth middleware is added to authenticate the me endpoint and all the todos
  const token =req.headers.token;
  const decodedData = jwt.verify(token,JWT_SECRET);
  if(decodedData.username){
    req.username = decodedData.username;
    next()
  }else{
    res.json("you are not logged in")
  }
}


//and this below end point is to verify the jwt
app.get("/me",logger , auth ,function(req,res){
    //const token = req.token;  
    //const decodedData = jwt.verify(token,JWT_SECRET);  //
    let foundUser = null;
    //if(decodedData.username){  //
    //    let foundUser= null;   //

        for (let i=0; i<users.length; i++){
            if(users[i].username === req.username){
                foundUser = users[i];
                
            }
        }if(foundUser){
            res.json({
                username: foundUser.username,
                //password:foundUser.password
        
            });
          }else{
            res.status(404).json({
                message:"you are not logged in "
            });
        }
        
    }
    

    
);
/*
app.get("/todos",auth ,function(req,res){

})
app.post("/todos",auth,function(req,res){
    
})
app.delete("/todos",auth,function(req,res){
    
})
*/
app.listen(3000);
