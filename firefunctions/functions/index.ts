import 'core-js'
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import * as cors from 'cors'
import * as express from 'express'

admin.initializeApp(functions.config().firebase)
var contactsRef: admin.database.Reference = admin.database().ref('/contacts')

exports.addContact = functions.https.onRequest((request: any, response: any) => {
        cors()(request, response, () => {
            contactsRef.push({
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                phone: request.body.phone,
                email: request.body.email
            })
        })
        response.send({'msg': 'Done', 'data': {
                firstname: request.body.firstname,
                lastname: request.body.lastname,
                phone: request.body.phone,
                email: request.body.email
        }});
})

exports.getContactList = functions.https.onRequest((request: any, response: any) => {
    contactsRef.once('value', (data) => {
        response.send({
            'res': data.val()
        })
    })
})

const app: express.Application = express();

app.use(cors({origin: true}))

app.put('/:id', (req: any, res: any, next: any) => {
    admin.database().ref('/contacts/' + req.params.id).update({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        email: req.body.email
    })
    res.send(req.body)
    next()
})

app.delete('/:id', (req: any, res: any, next: any) => {
    admin.database().ref('/contacts/' + req.params.id).remove()
    res.send(req.params.id)
    next()
})

app.get('/:id', (req: any, res: any, next: any) => {
    admin.database().ref('/contacts/' + req.params.id).once('value', (data) => {
        var sn = data.val()
        res.send({
            'res': sn
        })
        next()
    },(err: any) => res.send({res: err})
    )
})
exports.getContact = functions.https.onRequest((request: any, response: any) => {
    return app(request, response)
})
exports.updateContact = functions.https.onRequest((request: any, response: any) => {
    return app(request, response)
})

exports.deleteContact = functions.https.onRequest((request: any, response: any) => {
    return app(request, response)
})
