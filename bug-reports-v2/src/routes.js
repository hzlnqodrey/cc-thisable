const { addReports, getAllReport } = require('./handler')

const routes = [
    // [Route 1] - Create
    {
        method: 'POST',
        path: '/report',
        config: { auth: 'jwt' },
        handler: addReports
    },
    // [Route 2] - Read
    {
        method: 'GET',
        path: '/report',
        config: { auth: 'jwt' },
        handler: getAllReport
    },
    {
        method: 'GET',
        path: '/',
        config: { auth: false },
        handler: function(request, h) {
            return {text: 'Token not required', data: 'No data'}
        }
    }
]

module.exports = routes