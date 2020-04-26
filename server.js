`use strict`;

require('dotenv').config()
const express =require('express');
const superagent =require('superagent');
const app = express();
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
const PORT =process.env.PORT || 3030 ;
const  methodOverride = require('method-override');



app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static('./public')); 
app.set('view engine', 'ejs');



////////////////////////////////////
app.get('/',homepage);
app.post('/new',getAPIdata);

app.get('/book',inserData);

app.post('/details/:task_id',viewDetails);

app.put('/update/:task_id' ,updataData)

function homepage(req,res){
res.redirect('faveroit')

}



function updataData(req ,res){

    let {name, image ,level } =req.body ;

    let SQL =`UPDATE carton SET name=$1, image=$2 ,level=$3 WHERE id =$4;`;
    let saveValue =[name, image ,level,req.params.task_id];
    return client.query(SQL ,saveValue)
    .then(result =>{


        res.redirect(`/details/${req.params.task_id}`);
    })





}


function viewDetails(req ,res){

let SQL = 'SELECT * FROM carton WHERE id=$1 ;';
let saveValue =[req.params.task_id];
return client.query(SQL,saveValue)
.then(result=>{

   res.redirect('details') 
})


}







function inserData(req ,res){
let {name ,image ,level }=req.body;
let SQL = 'INSERT INTO carton (name ,image ,level) VALUES($1,$2,$3);';
let saveValue = [name ,image ,level] ;
return client.query(SQL,saveValue)
.then(result=>{

res.redirect('/')

})

}












 function getAPIdata(req ,res){

    let url ='https://digimon-api.herokuapp.com/api/digimon';
    return superagent.get(url)
     .then(result =>{

let appData =result.body ;

let array =appData.map(val=>{
    return new Digimon(val);

})
console.log(array);
res.render('index' ,{data:array});


     })
     .catch(erorr=>{
res.render('erorr');
     })
 }


 function Digimon(data){

    this.name =data.name;
    this.image=data.img;
    this.level=data.level;
}




client.connect()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`listen to port ${PORT}`)
    })



})