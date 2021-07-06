import * as BusinessDB from './BusinessDB'
// import * as DTOData from './dto'

const models = {
    // ...asyncStorage,
    ...BusinessDB,
    // ...DTOData,
}

export { models, BusinessDB }