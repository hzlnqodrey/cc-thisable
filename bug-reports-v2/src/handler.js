// Referensi [Connect to Firestore with Firebase Admin Config] = https://www.youtube.com/watch?v=7ryA594RAmw
var admin = require("firebase-admin");
var serviceAccount = require("../serviceAccountKey.json");
// NanoID to generate new random ID
const { nanoid } = require('nanoid')
const { toIsoString } = require('./modal/function-handler')

// Firebase Admin Credentials Config
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
const db = admin.firestore()

// [Handler 1 - Add Bug Reports]
const addReports = async (request, h) => {
    // data yg dikirim dari MD nama, email, dan isi (payload)
    const { name, email, message } = request.payload
    const ID_DocumentReport = nanoid(16)
    
    // date gmt+7 config
    const date = new Date()
    const createdAt = toIsoString(date)

    const newReport = {
        name,
        email,
        message,
        ID_DocumentReport,
        createdAt
    }  

    // Payload Data write to Firestore collection "bugreports" and generate new random ID
    db.collection("bugreports").doc(ID_DocumentReport).set(newReport)

    const CheckDatabase = db.collection("bugreports").doc(ID_DocumentReport)

    if (CheckDatabase) {
        const response = h.response({
            status: 'success',
            error: false,
            message: 'Report is successfully added to Firestore',
            date: createdAt,
            data: {
                reportId: ID_DocumentReport
            }
        })
        response.code(201)
        response.header("Authorization", request.headers.authorization)
        response.type('application/json')
        return response
    }

    // if failed
    const response = h.response({
        status: 'failed',
        message: 'Report is failed to be added'
    })
    response.code(500) // 500 Internal Server Error
    return response
}

const getAllReport = async (request, h) => {
    const getDataFromFirestore = []
    const reportRef = db.collection('bugreports');
    const snapshot = await reportRef.get();
    snapshot.forEach(doc => {
        getDataFromFirestore.push({
            ...doc.data(), // spread operator
            key: doc.id // 'id' is given to function by firebase
        })
    })
    
    const response = h.response({
        status: "success",
        error: false,
        data: {
           getDataFromFirestore
        }
    })
    response.code(200)
    return response
}

module.exports = { addReports, getAllReport }