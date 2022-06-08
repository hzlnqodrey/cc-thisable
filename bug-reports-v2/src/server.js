const Hapi = require('@hapi/hapi')
const routes = require('./routes')

// AUTH JWT Dependencies
const hapiAuthJWT = require('../lib')
const JWT = require('jsonwebtoken')
const secret = require('./auth/secret-key-jwt')

// Create User Validation
const users = {
    1: {
      id: 1,
      name: 'Hazlan Muhammad Qodri'
    }
}

// Generate Token
const token = JWT.sign(users[1], secret)
console.log(token)

// Validate User
const validate = async function (decoded, request, h) {
    if (!users[decoded.id]) {
      return { isValid: false }
    }
    else {
      return { isValid: true }
    }
}

const init = async () => {
    // Server Config
    const server = Hapi.server({
        port: 5000,
        host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
        routes: {
          cors: {
              origin: ['*'] // Allow-Cross-Origin
          }
        }
    })

    // Server Register Plugin
    await server.register(hapiAuthJWT)

    // JWT Auth Strategy (Param1: Strategy, Param2: Scheme, Param3: scheme requirements)
    server.auth.strategy('jwt', 'jwt', {
        key: secret,
        validate,
        verifyOptions: { ignoreExpiration: true }
    })
    server.auth.default('jwt')

    // Server Routing
    server.route(routes)

    // Server Start
    await server.start()
    console.log(`Server is running on ${server.info.uri}`)
}
init()