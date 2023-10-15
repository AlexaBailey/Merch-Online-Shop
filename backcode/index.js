const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const session=require("express-session")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const app = express();

const multer = require('multer');



const { S3Client } = require('@aws-sdk/client-s3');
    
const multerS3 = require('multer-s3');


let s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: `${YOUR_API_KEY}`,
    secretAccessKey: `${YOUR_SECRET_API_KEY}`
  },
 
});
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'orionbucket1',
    acl:'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        'labspace/' + Date.now().toString() + '-' + file.originalname
      );
    },
  }),
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST","DELETE"],
    credentials: true,
  })
);
/*const io = new Server(server, {
  
  cors: {
    origin: "http://localhost:3000/chat",
    methods: ["GET", "POST"],
    credentials:true,
  },
});
*/




app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);




const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "alexa",
  database: "labspace",
  multipleStatements:true
});

app.post('/login',function(req,res){
    const user_name = req.body.nickname;
    const user_password = req.body.password;
    console.log(user_password);
    if(user_name && user_password)
    {
        query = `
        SELECT * FROM users
        WHERE username = "${user_name}"
        `;
        
        db.query(query, function(error, data){
          console.log(data)
          
  
            if(data.length > 0)
            {
            
                    if(data[0].password)
                    {
                      console.log(data[0].password, user_password)
                 
                      
                      bcrypt.compare(user_password,data[0].password,function(err,result){
                      if (result){
                       
                        const {password, ...other} = data[0] 
                        const token = jwt.sign(other, 'develop', { expiresIn: "2h" });
                        console.log(token)
                        superid = token.sid
                        res.send(token);
                                      
                      
  
                      }
                     else if (err){
                      console.log("wrong password")
                      return res.sendStatus(401).json(err);
                      
                    
                     
                     }
  
                    });
                  }
                }
                else{
                  return res.status(401).json(error);
                }
            
             
                
              })
            
            }
          })
          
  app.post("/signup", (req, res) => {
    console.log(1)
    const username = req.body.nickname;
    const password = req.body.password;
    const email = req.body.email
    console.log(username)
    const fio = req.body.fio


    console.log(password)
    console.log(email)
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "INSERT INTO users (`username`,`email`, `password`,`fio`) VALUES (?,?,?,?)",
        [username, email, hash,fio],
        (err, result) => {
          if (err){
            console.log(err)
          }
          else{
            const jwtData = {result};
      const token = jwt.sign(jwtData, 'CODEBLESSYOU', { expiresIn: "2h" });
      res.send(token);
          }
          
        }
      );
    });
   
  });
  
  
app.post('/upload', upload.single('file'), (req, res, next) => {
  const name = req.body.name  
  const author = req.body.author  
  const user = req.body.user     
   
   

  const disc = req.body.disc
  var linki;
  var comments;
  var image;
  const publish = req.body.publish

  if (req.body.comments){
    comments = req.body.comments

  }


  if (req.file){
   image = req.file.location

  }
  else if (req.body.linki){
    image = req.body.linki

  }
  else{
    image=''
  }

  
  console.log("Info: ", disc,image,publish,linki)


 
  

     
  const q= `insert into repository(usid,authors, pname,project, discipline,publish, comments) values ('${user}','${author}','${name}','${image}','${disc}','${publish}','${comments}')`




db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }
  return res.json(data);

});
})

app.post('/edit/:pid', upload.single('file'), (req, res, next) => {
  const pid=req.params.pid
  const name = req.body.name  
  const author = req.body.author  
  const user = req.body.user     
   
   

  const disc = req.body.disc
  var linki;
  var comments;
  var image;
  const publish = req.body.publish

  if (req.body.comments){
    comments = req.body.comments

  }

 
  
  console.log("Info: ",name,author,user, disc,publish,linki)


 
  

     


  var q = `update repository set `;
 const conditionsArr = []; 
 if (user){
  conditionsArr.push(  `usid='${user}'`);
 }

 
 if (author){
    conditionsArr.push(  ` authors='${author}'`);


 }
 if(disc){
      conditionsArr.push(  `discipline='${disc}'`);


 }
 if(publish){
  conditionsArr.push(  ` publish='${publish}'`);


}
if(comments){
  conditionsArr.push(  ` comments='${comments}'`);


}
if (req.file){
  image = req.file.location
  conditionsArr.push( ` project= '${image}'`)

 }
 else if (req.body.linki){
   image = req.body.linki
   conditionsArr.push( ` project= '${image}'`)


 }

q += conditionsArr.join(', '); 

 
   q+=` where pid=${pid}`
console.log(q)


db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }
  return res.json(data);

});
})
app.get('/likes/:id/:userid', (req, res, next) => {  
  const id = req.params.id
  const userid = req.params.userid
  var q;
   q=`Select count(lid) as num  from loved where projectid=${id} `
    console.log(q)
    db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err)
      ;
    }
   
      return res.json(data);

 
  
   
  
  });
  })
  app.post('/liked/:id/:userid/:authorid', (req, res, next) => {  
    const id = req.params.id
    const userid = req.params.userid
    const authorid = req.params.authorid

 
    console.log(id,userid)
    var q;
    
   q=`Insert into loved ( userid,projectid,authorid) values (${userid}, ${id},${authorid})`


          


 


    console.log(q)
  
    
      db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err)
        ;
      }
    
      return res.json(data);
    
    });
    })
    
  app.post('/disliked/:id/:userid', (req, res, next) => {  
    const id = req.params.id
    const userid = req.params.userid
    console.log(id,userid)
    var q;
    


          
   q=`delete from loved where projectid=${id} and userid=${userid}`


 


    console.log(q)
  
    
      db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err)
        ;
      }
    
      return res.json(data);
    
    });
    })
 
app.get('/materials/:id', (req, res, next) => { 
  const id=req.params.id 
var q;
 q=`Select * from repository;select * from repository,  users, loved where userid=users.id and projectid=pid and userid=${id};`

  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})
app.get('/mymaterials/:id', (req, res, next) => { 
  const id=req.params.id 
var q;
 q=`Select * from repository where usid=${id} ;select * from repository,  users, loved where userid=users.id and projectid=pid and userid=${id} and usid=${id};`

  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})
app.get('/favourite/:id', (req, res, next) => {  
  const id=req.params.id
  var q;
   q=`select * from repository,  users, loved where userid=users.id and projectid=pid and users.id=${id}`
  
    db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err)
      ;
    }
  
    return res.json(data);
  
  });
  })
  app.post('/favourite/:id', (req, res, next) => {  
    const id=req.params.id
    const name=req.body.name
    var q;
     q=`select * from repository,  users, loved where userid=users.id and projectid=pid and users.id=${id}`
    if (name){
      q+=` and pname='${name}'`
    }
      db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err)
        ;
      }
    
      return res.json(data);
    
    });
    })
  
app.get('/edit/:pid', (req, res, next) => {  
  const pid=(req.params.pid)
  var q;
   q=`select * from repository where pid=${pid}`
  
    db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err)
      ;
    }
  
    return res.json(data[0]);
  
  });
  })
app.post('/materials', (req, res, next) => {  

  const discipline=req.body.disc
  
  
  var q=`Select * from repository `
  if (discipline){
    q+=` where discipline='${discipline}'`
  }
  
  q+=`;select * from repository,  users, loved where userid=users.id and projectid=pid `
  if (discipline){
    q+=` and discipline='${discipline}'`
  }
  


  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})
app.post('/searchmymaterials/:id', (req, res, next) => {  
  const id=req.params.id
  const discipline=req.body.disc
  
  
  var q=`Select * from repository where usid=${id}`
  if (discipline){
    q+=` and discipline='${discipline}'`
  }
  
  q+=`;select * from repository,  users, loved where userid=users.id and projectid=pid and usid=${id} `
  if (discipline){
    q+=` and discipline='${discipline}'`
  }
  


  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})
app.post('/materials/:name', (req, res, next) => {  

  const name=req.params.name
  
  
  var q=`Select * from repository `
  if (name){
    q+=` where pname='${name}'`
  }
  
  q+=`;select * from repository,  users, loved where userid=users.id and projectid=pid `
  if (name){
    q+=` and pname='${name}'`
  }


  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})

app.post('/mymaterials/:id', (req, res, next) => {  
const id=req.params.id
  const name=req.body.name
  
  
  var q=`Select * from repository where usid=${id}`
  if (name){
    q+=` and pname='${name}'`
  }
  
  q+=`;select * from repository,  users, loved where userid=users.id and projectid=pid `
  if (name){
    q+=` and pname='${name}'`
  }

console.log(q)
  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})
app.delete('/materials/:pid', (req, res, next) => {  
  console.log(1)
  const pid=req.params.pid
  
  var q =`delete from repository where pid=${pid}`
  console.log(q)
  db.query(q, (err, data) => {
  if (err) {
    console.log(err);
    return res.json(err)
    ;
  }

  return res.json(data);

});
})

app.get("/profile/details/:id", (req, res) => {
    const id = req.params.id
    console.log(id)
  
    const q = `SELECT * from users where id = ${id}`;
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      console.log(data)
      return res.json(data);
    });
  });
  
  app.post("/profile/:userid", (req, res) => {
    const id = req.params.userid
  
    const fio=req.body.fio
  
    const username=req.body.username
  
  
    const email=req.body.email
    const bio=req.body.bio
  
  
  
    console.log(id)
  
    var q = `update users set`;
   const conditionsArr = []; 
   if (email){
    conditionsArr.push(  ` email='${email}'`);
   }
  
   
   if (fio){
      conditionsArr.push(  ` fio='${fio}'`);
  
  
   }
   if(username){
        conditionsArr.push(  ` username='${username}'`);
  
  
   }
   if (bio){
        conditionsArr.push(  ` bio='${bio}'`);
  
  
   }
   
  q += conditionsArr.join(', '); 
  
  q += ` WHERE id = ${id}`;
    db.query(q, (err, data) => {
      if (err) {
        console.log(err);
        return res.json(err);
      }
      console.log(data)
      return res.json(data);
    });
  });
  app.listen(8800, () => {
    console.log("running server");
  });
 
  