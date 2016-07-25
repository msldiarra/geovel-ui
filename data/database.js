import Sequelize from 'sequelize';

const DB = new Sequelize(
    'geovel',
    'postgres',
    '1234',
    {
      dialect: 'postgres',
      host: 'localhost'
    }
);

const Owner = DB.define('owner', {
      name: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

const Contact =  DB.define('contact', {
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
    } , {timestamps: false, freezeTableName: true,}
);

const Login = DB.define('login', {
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN
    } , {timestamps: false, freezeTableName: true,}
);

const ContactInfo = DB.define('contactInfo', {
      phonenumber: Sequelize.STRING
    } , {timestamps: false, freezeTableName: true,}
);

const OwnerContact = DB.define('ownercontact', {
      ownerid: Sequelize.INTEGER,
      contactid: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

const ContactLogin = DB.define('contactlogin', {
      contactid: Sequelize.INTEGER,
      loginid: Sequelize.INTEGER
    } , {timestamps: false, freezeTableName: true,}
);

const CarPosition = DB.define('carposition', {
        reference: Sequelize.INTEGER,
        locationid: Sequelize.INTEGER,
        time: Sequelize.TIME
    } , {timestamps: false, freezeTableName: true,}
);

const CarLocation = DB.define('carlocation', {
        carid: Sequelize.INTEGER,
        locationid: Sequelize.INTEGER,
    } , {timestamps: false, freezeTableName: true,}
);

const Location = DB.define('location', {
        latitude: Sequelize.FLOAT,
        longitude: Sequelize.FLOAT,
    } , {timestamps: false, freezeTableName: true,}
);

Owner.belongsToMany(Contact, { through: OwnerContact, foreignKey: 'ownerid' });
Contact.belongsToMany(Owner, { through: OwnerContact, foreignKey: 'contactid' });

Contact.belongsToMany(Login, { through: ContactLogin, foreignKey: 'contactid' });
Login.belongsToMany(Contact, { through: ContactLogin, foreignKey: 'loginid' });

/*
 * User view for UI display need
 * */
DB.define('user', {
      firstname: Sequelize.STRING,
      lastname: Sequelize.STRING,
      login: Sequelize.STRING,
      password: Sequelize.STRING,
      phonenumber: Sequelize.STRING,
      enabled: Sequelize.BOOLEAN,
      company: Sequelize.STRING
    } , {timestamps: false, tableName: 'users'}
);


DB.sync({force: false});

export default DB;
