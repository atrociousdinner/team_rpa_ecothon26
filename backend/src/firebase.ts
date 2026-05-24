
import * as admin from 'firebase-admin'
import * as path from 'path'

const serviceAccount = require(path.resolve(__dirname, '../config/firebase-private-key.json'))

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
export default admin
