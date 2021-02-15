const express = require('express')
const port = process.env.PORT || 8080;
const app = express()
let auth_user = process.env.AUTH_USER;
let auth_pass = process.env.AUTH_PASS;
let email_from = process.env.EMAIL_FROM;
let email_to = process.env.EMAIL_TO;

const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const nodemailer = require('nodemailer')

//template engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('views engine', 'handlebars')

//body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



// arquivos estáticos
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views/images'));



//sessão
app.use(session({
    secret: "site",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

// middleware
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// rotas
// index
app.get('/', function (req, res) {
    res.render('../views/Home.handlebars');
})

app.get('/about', function (req, res) {
    res.render('../views/About.handlebars');
})

app.get('/laudo', function (req, res) {
    res.render('../views/Laudo.handlebars');
})
app.get('/manutencao', function (req, res) {
    res.render('../views/Manutencao.handlebars');
})
app.get('/projeto', function (req, res) {
    res.render('../views/Projeto.handlebars');
})

app.get('/contact', function (req, res) {
    res.render('../views/Contact.handlebars');
})
app.post('/contact', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var topic = req.body.topic;
    var message = req.body.message;

    const transporter = nodemailer.createTransport({
        //host: "",
        //port: 993,
        //secure: false, // true for 465, false for other ports
        service: 'gmail',
        auth: {
            user: auth_user,
            pass: auth_pass
        },
        //tls: { rejectUnauthorized: false }
    });

    const mailOptions = {
        from: email_from,
        to: email_to,
        subject: 'Site: '+ topic,
        text: 'Nome: ' + name + '\nemail: ' + email + '\nTelefone: ' + phone + '\nmensagem: \n' + message
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            req.flash("error", "Sua mensagem não foi enviada, por favor tente novamente.")
            res.redirect('/contact')
        } else {

            console.log('Email enviado: ' + info.response);
            req.flash("success", "Sua mensagem foi enviada, logo entraremos em contato.")
            res.redirect('/contact')

        }
    });
})




////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () => {
    console.log('server running on http://localhost:' + port)
    console.log(__dirname);
})

