/**
 * Created by bosone on 2/3/16.
 */
module.exports = {
    db: 'mongodb://expotest:expotest@ds059155.mlab.com:59155/expotest',
    privateKey: 'SECRETKEY',
    roles: [
        {
            name: 'anonymous',
            id: 0,
            permissions: ['/auth/login', '/auth/signup', '/auth/me', '/api/createOrUpdate', '/api/expositions', '/exposition', '/favicon.ico', '/auth/hasRole', '/tags']
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
    commission: 200,
    tags: [
        {name: "Авиакосмическая промышленность", type: 1},
        {name: "Автомобили и мотоциклы", type: 1},
        {name: "Анализ, измерение и контроль", type: 1},
        {name: "Безопасность", type: 1},
        {name: "Бизнес, инвестиции, финансы", type: 1},
        {name: "Вино, алкоголь, табак", type: 1},
        {name: "Городское хозяйство", type: 1},
        {name: "Гостиничное, ресторанное дело", type: 1},
        {name: "Детские товары и игрушки", type: 1},
        {name: "Животные. Ветеринария.", type: 1},
        {name: "ИТ, коммуникации, связь", type: 1},
        {name: "ИТ: Интернет-маркетинг", type: 1},
        {name: "ИТ: Интернет-технологии", type: 1},
        {name: "ИТ: Информационная безопасность", type: 1},
        {name: "ИТ: Моделирование, компьютерная графика и анимация", type: 1},
        {name: "Индустрия развлечений, шоу, СМИ", type: 1},
        {name: "Катера, яхты, судостроение", type: 1},
        {name: "Косметика и парфюмерия", type: 1},
        {name: "Культура, искусство, церковь", type: 1},
        {name: "Ландшафтный дизайн, сад", type: 1},
        {name: "Легкая промышленность", type: 1},
        {name: "Лес, деревообработка, бумага", type: 1},
        {name: "Маркетинг, реклама, PR", type: 1},
        {name: "Машиностроение, автоматизация, робототехника", type: 1},
        {name: "Мебель, интерьер, декор", type: 1},
        {name: "Медицина", type: 1},
        {name: "Металлургия, металлообработка, материаловедение", type: 1},
        {name: "Многоотраслевые события", type: 1},
        {name: "Мода, одежда, обувь, аксессуары", type: 1},
        {name: "Наука и инновации", type: 1},
        {name: "Недвижимость", type: 1},
        {name: "Нефть, газ, горное дело", type: 1},
        {name: "Образование", type: 1},
        {name: "Организация мероприятий", type: 1},
        {name: "Полиграфия, издательское дело", type: 1},
        {name: "Потребительские товары", type: 1},
        {name: "Продукты. Пищевая индустрия", type: 1},
        {name: "Промышленность", type: 1},
        {name: "Сельское хозяйство", type: 1},
        {name: "Строительство", type: 1},
        {name: "Тара и упаковка, этикетки", type: 1},
        {name: "Телекоммуникации", type: 1},
        {name: "Технологии торговли и ритейла", type: 1},
        {name: "Товары для дома и подарки", type: 1},
        {name: "Транспорт, склад, логистика", type: 1},
        {name: "Туризм, спорт, отдых, хобби", type: 1},
        {name: "Химия, краски, пластмасса, резина", type: 1},
        {name: "Экология, очистка, утилизация", type: 1},
        {name: "Электроника, электротехника", type: 1},
        {name: "Энергетика, рeсурсосбережение", type: 1},
        {name: "Ювелирное дело, антиквариат", type: 1}
    ]

};
