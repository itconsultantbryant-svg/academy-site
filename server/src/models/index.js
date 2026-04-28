/**
 * Re-exports data access from `db/orm.js` (shared with migrations).
 * Add query-layer models here as the API grows.
 */
export {
  User,
  Category,
  Course,
  Post,
  Certificate,
  SiteContent,
} from '../../db/orm.js'
