import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from 'graphql';

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
} from 'graphql-relay';

import DB from './database';


var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {
      var {type, id} = fromGlobalId(globalId);
      if (type === 'User') { return DB.models.user.findOne({where: {id: id}}); }
      if (type === 'Contact') { return DB.models.contact.findOne({where: {id: id}}); }
      if (type === 'ContactInfo') { return  DB.models.contactInfo.findOne({where: {id: id}}); }
      if (type === 'Login') { return DB.models.login.findOne({where: {id: id}}); }
      if (type === 'CarPosition') { return DB.models.carPosition.findOne({where: {id: id}}); }
      if (type === 'Location') { return DB.models.location.findOne({where: {id: id}}); }
      else if (type === 'Owner') { return DB.models.owner.findOne({where: {id: id}}); }
      else { return null; }
    },
    (obj) => {
      if (obj instanceof User) { return userType; }
      else if (obj instanceof Contact) { return contactType; }
      else if (obj instanceof Login) { return loginType; }
      else if (obj instanceof ContactInfo) { return contactInfoType; }
      else if (obj instanceof Owner) { return ownerType; }
      else if (obj instanceof CarPosition) { return carPositionType; }
      else if (obj instanceof Location) { return locationType; }
      else { return null; }
    }
);

/**
 * Define your own types here
 */


const userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => {
    return {
      id: globalIdField('User'),
      credentials: { type: loginType, resolve(user) { return user.login } },
      contact: { type: contactType, resolve(user) { return user.login } },
      info: { type: contactInfoType, resolve(user) { return user.login } },
      company: { type: ownerType, resolve(user) { return user.company }} ,
      cars: {
        type: carPositionConnection,
        description: "Where are my cars?",
        args: connectionArgs,
        resolve: (user, args) => connectionFromPromisedArray(DB.models.carposition.findAll({where : {company: user.company}}), args)
      },}
  },
  interfaces: [nodeInterface]
});

const carPositionType = new GraphQLObjectType({
  name: 'CarPosition',
  description: 'Latest car position',
  fields: () => {
    return {
      id: globalIdField('CarPosition'),
      reference: { type: GraphQLString, resolve(carposition) { return carposition.reference } },
      time: { type: GraphQLString, resolve(carposition) { return carposition.time } },
      location: { type: locationType, resolve(carposition) { return DB.models.location.findOne({where: {id: carposition.locationid}})  } },
    }
  },
  interfaces: [nodeInterface]
})


const locationType = new GraphQLObjectType({
  name: 'Location',
  description: 'A car geo location',
  fields: () => {
    return {
      id: globalIdField('Location'),
      latitude: { type: GraphQLFloat, resolve(carlocation) { return carlocation.latitude } },
      longitude: { type: GraphQLFloat, resolve(carlocation) { return carlocation.longitude } },
    }
  },
  interfaces: [nodeInterface]
});

const ownerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => {
    return {
      id: globalIdField('Owner'),
      name: { type: GraphQLString, resolve(customer) { return customer.name } },
      contacts: { type: new GraphQLList(contactType), resolve(customer) { return customer.getContacts() } }
    }
  },
  interfaces: [nodeInterface]
});

const contactType = new GraphQLObjectType({
  name: 'Contact',
  fields: () => {
    return {
      id: globalIdField('Contact'),
      firstName: { type: GraphQLString, resolve(contact) { return contact.firstname } },
      lastName: { type: GraphQLString, resolve(contact) { return contact.lastname } },
      credentials: { type: new GraphQLList(loginType), resolve(contact) { return contact.getLogins() } }
    }
  },
  interfaces: [nodeInterface]
});

const loginType = new GraphQLObjectType({
  name: 'Login',
  fields: () => {
    return {
      id: globalIdField('Login'),
      login: { type: GraphQLString, resolve(login) { return login.login } },
      password: { type: GraphQLString, resolve(login) { return login.password } },
      enabled: { type: GraphQLBoolean, resolve(login) { return login.enabled } }
    }
  },
  interfaces: [nodeInterface]
});

const contactInfoType = new GraphQLObjectType({
  name: 'ContactInfo',
  fields: () => {
    return {
      id: globalIdField('ContactInfo'),
      email: { type: GraphQLString, resolve(contactInfo) { return contactInfo.email } }
    }
  },
  interfaces: [nodeInterface]
});



/**
 * Define your own connection types here
 */

export var {connectionType: carPositionConnection, edgeType : carPositionEdge} =
    connectionDefinitions({name: 'CarPositions', nodeType: carPositionType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      args: {
        userID: {
          name: 'userID',
          type: new GraphQLNonNull(GraphQLInt)
        }
      },
      resolve: (root, {userID}) => DB.models.user.findOne({where: {id: userID}}),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
