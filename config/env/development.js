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
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole']
        },
        {
            name: 'visitor',
            id: 3,
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole']
        },
        {
            name: 'exponent',
            id: 2,
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole']
        },
        {
            name: 'organizer',
            id: 1,
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole', '/user/buyPremium']
        },
        {
            name: 'admin',
            id: 5,
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole']
        }
    ],
    premiumAvailable: true,
    premiumCost: 3,
    commission: 200
};
