//Sending email here
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nodemailer = require('nodemailer'),
//creds = require('./creds'),
transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'java2java2019@gmail.com',
        pass: 'Test@1234',
    },
}),
EmailTemplate = require('email-templates').EmailTemplate,
path = require('path'),
Promise = require('bluebird'); // Promise API 


// let cdata = [
//     {
//         vendorName: 'Nagendra',
//         email: 'nagendra.synergisticit@gmail.com',
//         vendorId: 'V9292922',
//         cemail: 'nagendra.synergisticit@gmail.com',
//         companyName: 'SynergisticIT TECH',
//     },
//     {
//         vendorName: 'Nagendra',
//         email: 'nagendra.synergisticit@gmail.com',
//         vendorId: 'V9292922',
//         cemail: 'nagendra.synergisticit@gmail.com',
//         companyName: 'SynergisticIT TECH',
//     },
// ];


//This will just send email for obj data
function sendEmail (obj) {
    console.log("=================transporter===================");
    console.log(obj);
    console.log("=================transporter===================");
    return transporter.sendMail(obj);
}

/**
 * This method is used to load your 
 * @param {*} templateName - this is template name 
 * @param {*} contexts  -  data which has to merge
 * Loading html template and merging data 
 */
var count=1;
function loadTemplate (templateName, contexts) {

   
    
    console.log("Loading template.....................");
    console.log("Loading template.....................");
    console.log("Loading template.....................");
    console.log("Loading template.....................");
    
    console.log(contexts);

    console.log("Loading template.....................");
    console.log("Loading template.....................");
    console.log("Loading template.....................");
    

    //console.log(templateName);
    console.log(contexts);
    let template = new EmailTemplate(path.join(appRoot, 'templates', templateName));

    return Promise.all(contexts.map((context) => {
        return new Promise((resolve, reject) => {
            template.render(context, (err, result) => {
                if (err) reject(err);
                else resolve({
                    email: result,
                    context,
                });
            });
        });
    }));
}

var sendVendorEmail=function(cdata){
    console.log("1.Sending email...........................");
    console.log(cdata);
    console.log("2.Sending email...........................");
     loadTemplate('vendor', cdata).then((results) => {
    return Promise.all(results.map((result) => {
        sendEmail({
            to: result.context.email,
            from: 'Shopping Cart!!!!!!!!',
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
        });
    }));
}).then(() => {
    console.log('Hey Your email has been sent successfully!');
});
};
module.exports.sendEmail=sendVendorEmail;

sendOrderEmail=function(cdata){
    console.log("Order Sending email...........................");
    console.log(cdata);
    console.log("2.Sending email...........................");
     loadTemplate('order-confirmation', cdata).then((results) => {
    return Promise.all(results.map((result) => {
        sendEmail({
            to: result.context.email,
            from: 'Shopping Cart!!!!!!!!',
            subject: result.email.subject,
            html: result.email.html,
            text: result.email.text,
        });
    }));
}).then(() => {
    console.log('Hey Your email has been sent successfully!');
});
};
module.exports.sendOrderEmail=sendOrderEmail;