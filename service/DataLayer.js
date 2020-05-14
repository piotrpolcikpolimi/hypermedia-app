const { serviceDbSetup } = require('./ServiceService');
const { donateDbSetup } = require('./DonateService');
const { contactDbSetup } = require('./ContactService');
const { eventDbSetup } = require('./EventService');
const { newsletterDbSetup } = require('./NewsletterService'); 
const { personDbSetup } = require('./PersonService'); 
const { locationDbSetup } = require('./LocationService');
const { utilsDbSetup } = require('./Utils'); 

const sqlDbFactory = require('knex');

let sqlDb = sqlDbFactory({
    debug: true,
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: false
});


function setupDataLayer() {
    return [
        utilsDbSetup(sqlDb),
        locationDbSetup(sqlDb),
        personDbSetup(sqlDb),
        newsletterDbSetup(sqlDb),
        eventDbSetup(sqlDb),
        contactDbSetup(sqlDb),
        donateDbSetup(sqlDb),
        serviceDbSetup(sqlDb)
    ]
}

module.exports = {
    database: sqlDb,
    setupDataLayer
}