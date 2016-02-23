/**
 * Created by bosone on 2/3/16.
 */
module.exports = {
    db: 'mongodb://expotest:expotest@ds059155.mongolab.com:59155/expotest',
    privateKey: 'SECRETKEY',
    roles: [
        {
            name: 'anonymous',
            id: 0,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        {
            name: 'visitor',
            id: 3,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        {
            name: 'exponent',
            id: 2,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        {
            name: 'organizer',
            id: 1,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        }
    ]
};
