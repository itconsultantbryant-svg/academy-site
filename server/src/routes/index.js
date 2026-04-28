import { Router } from 'express'
import { healthRouter } from './health.routes.js'
import { authRouter } from './auth.routes.js'
import { adminRouter } from './admin.routes.js'
import { courseRouter } from './course.routes.js'
import { postRouter } from './post.routes.js'
import { certificateRouter } from './certificate.routes.js'
import { contentRouter } from './content.routes.js'
import { subscriberRouter } from './subscriber.routes.js'
import { registrationRouter } from './registration.routes.js'

export const apiRouter = Router()

apiRouter.use(healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/admin', adminRouter)
apiRouter.use('/courses', courseRouter)
apiRouter.use('/posts', postRouter)
apiRouter.use('/certificates', certificateRouter)
apiRouter.use('/content', contentRouter)
apiRouter.use('/subscribers', subscriberRouter)
apiRouter.use('/registrations', registrationRouter)
