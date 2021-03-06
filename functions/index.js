const functions = require('firebase-functions');
const admin=require('firebase-admin');
const express=require('express');

const app=express();
admin.initializeApp();
//Route to get all screams
app.get('/screams',(req,res)=>{
  admin.firestore().collection('screams').orderBy('createdAt','desc').get()
  .then(data => {
    let screams=[];
    data.forEach(doc => {
      screams.push({
        screamId:doc.id,
        body:doc.data().body,
        userHandler:doc.data().userHandler,
        createdAt:doc.data().createdAt
      });
    });
    return res.json(screams);
  })
  .catch(err=>res.json(err));
})

//Route to create scream

app.post('/scream',(req,res)=>{
    const newScream={
    body:req.body.body,
    userHandler:req.body.userHandler,
    createdAt:new Date().toISOString()
  };
  admin.firestore().collection('screams').add(newScream)
  .then(doc=>{
    res.json({message:`document ${doc.id} created successfully `});
  })
  .catch(err=>{
    res.status(500).json({error:'something went wrong'});
    console.error(err);
  });
});

exports.api=functions.https.onRequest(app);