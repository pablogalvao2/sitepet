const express = require("express");
const app = express();

const Pagamento = require("./models/Pagamento")
const Usuario = require("./models/Usuario")
const path=require ('path');//enderço de cada rota
const router=express.Router();// trabalha com as rotas
const moment = require('moment');
const handlebars = require("express-handlebars");


app.engine('handlebars', handlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {
        formatDate: (date) => {
            return moment(date).format('DD/MM/YYYY')
        }
    }
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Rotas
router.get('/login', function(req, res){
    res.sendFile(path.join(__dirname+'/login.html'));
});

router.get('/sobre', function(req, res){
    res.sendFile(path.join(__dirname+'/sobre.html'));
});

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

router.post('/status', function(req, res){
    
    Pagamento.create({
        nome: req.body.nome,
        valor: req.body.valor
    }).then(function(){
        res.redirect('/status')
       
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
    })
     
});
router.get('/lista', function(req, res){
    Usuario.findAll().then(function(usuario){
        res.render('usuario', {usuario: usuario});
    })
    
});

router.get('/edit-pet/:id', function(req, res){
    Usuario.findByPk (req.params.id).then(function(usuario){
        res.render('editar', {usuario: usuario});
    })
});	
// login usuario
router.post('/loginuser', function(req, res){
    Usuario.findOne  ( {where: { 'email': req.body.email, 'senha': req.body.senha}}).then(function(result){
    
    if (result===null){
        res.redirect('/');
    }
    
    else{
        res.redirect('/listausuario');
    }
})
    
});	

//essa rota vai pegar o arquivo usuario.handlebars para lista os usuarios cadastrados
router.get('/listausuario', function(req, res){
    Usuario.findAll().then(function(usuario){
        res.render('usuario', {usuario: usuario});
    })

});

router.get('/del-usuario/:id', function(req, res){
    Usuario.destroy({
        where: {'id': req.params.id}
    }).then(function(){
        res.redirect('/');
        /*res.send("Usuario apagado com sucesso!");*/
    }).catch(function(erro){
        res.send("Usuario não apgado com sucesso!");
    })
});

router.post('/edit-pet/:id', function(req, res){
    Usuario.update(   
    {   id: req.body.id,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nome_pet: req.body.nome_pet},
    {where: {'id': req.params.id}}
    ).then(function(){
        res.redirect('/lista')
       
    }).catch(function(erro){
        res.send("Erro: Pagamento não foi cadastrado com sucesso!" + erro)
    })
     
});

//Rotas

router.get('/usuario', function(req, res){
    res.sendFile(path.join(__dirname+'/usuario.html'));
});

router.get('/Status', function(req, res){
    res.sendFile(path.join(__dirname+'/status.html'));
});


router.post('/usuario', function(req, res){
    
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        nome_pet: req.body.nome_pet
    }).then(function(){
        res.redirect('/')
       
    }).catch(function(erro){
        res.send("Erro: Usuario não foi cadastrado com sucesso!" + erro)
    })
     
});



console.log('Now the server is running in url: http://127.0.0.1:3333');
	
app.use('/',router);
app.use('/loginuser',router);
app.use('/sobre',router);
app.use('/usuario',router);
app.use('/listausuario',router);
app.use('/Status',router);
app.use('/login',router);
app.use('/lista',router);
app.use('/del-usuario/:id',router);
app.use('/edit-pet/:id',router);
app.use('/del-pagamento/:id',router);
app.use('/edit-pagamento/:id',router);
app.use(express.static(__dirname + '/public'));



app.listen(8080);