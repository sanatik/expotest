/**
 * Created by bosone on 2/3/16.
 */
module.exports = {
    db: 'mongodb://expotest:expotest@ds059155.mongolab.com:59155/expotest',
    privateKey: 'SECRETKEY',
    roles: [{
        anonymous: {
            id: -1,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        visitor: {
            id: 3,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        exponent: {
            id: 1,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        organizer: {
            id: 2,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition', '/exposition/create']
        },
        moderator: {
            id: 3,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        },
        admin: {
            id: 4,
            permissions: ['/auth/login', '/auth/signup', '/api/createOrUpdate', '/api/expositions', '/exposition']
        }
    }]
};
