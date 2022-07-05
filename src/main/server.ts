import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper'
import { processEnv } from './config/env'

MongoHelper.connect(processEnv.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(processEnv.port, () => console.log(`Server running at http://localhost:${processEnv.port}`))
  })
  .catch((error) => {
    console.log(error)
  })
