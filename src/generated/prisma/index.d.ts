
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model EventType
 * 
 */
export type EventType = $Result.DefaultSelection<Prisma.$EventTypePayload>
/**
 * Model Booking
 * 
 */
export type Booking = $Result.DefaultSelection<Prisma.$BookingPayload>
/**
 * Model Schedule
 * 
 */
export type Schedule = $Result.DefaultSelection<Prisma.$SchedulePayload>
/**
 * Model Availability
 * 
 */
export type Availability = $Result.DefaultSelection<Prisma.$AvailabilityPayload>
/**
 * Model DateOverride
 * 
 */
export type DateOverride = $Result.DefaultSelection<Prisma.$DateOverridePayload>
/**
 * Model Team
 * 
 */
export type Team = $Result.DefaultSelection<Prisma.$TeamPayload>
/**
 * Model TeamMember
 * 
 */
export type TeamMember = $Result.DefaultSelection<Prisma.$TeamMemberPayload>
/**
 * Model CalendarConnection
 * 
 */
export type CalendarConnection = $Result.DefaultSelection<Prisma.$CalendarConnectionPayload>
/**
 * Model Webhook
 * 
 */
export type Webhook = $Result.DefaultSelection<Prisma.$WebhookPayload>
/**
 * Model WebhookDelivery
 * 
 */
export type WebhookDelivery = $Result.DefaultSelection<Prisma.$WebhookDeliveryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const BookingStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
  RESCHEDULED: 'RESCHEDULED'
};

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]


export const SchedulingType: {
  ROUND_ROBIN: 'ROUND_ROBIN',
  COLLECTIVE: 'COLLECTIVE'
};

export type SchedulingType = (typeof SchedulingType)[keyof typeof SchedulingType]


export const TeamRole: {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER'
};

export type TeamRole = (typeof TeamRole)[keyof typeof TeamRole]

}

export type BookingStatus = $Enums.BookingStatus

export const BookingStatus: typeof $Enums.BookingStatus

export type SchedulingType = $Enums.SchedulingType

export const SchedulingType: typeof $Enums.SchedulingType

export type TeamRole = $Enums.TeamRole

export const TeamRole: typeof $Enums.TeamRole

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.eventType`: Exposes CRUD operations for the **EventType** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EventTypes
    * const eventTypes = await prisma.eventType.findMany()
    * ```
    */
  get eventType(): Prisma.EventTypeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.booking`: Exposes CRUD operations for the **Booking** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bookings
    * const bookings = await prisma.booking.findMany()
    * ```
    */
  get booking(): Prisma.BookingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.schedule`: Exposes CRUD operations for the **Schedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Schedules
    * const schedules = await prisma.schedule.findMany()
    * ```
    */
  get schedule(): Prisma.ScheduleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.availability`: Exposes CRUD operations for the **Availability** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Availabilities
    * const availabilities = await prisma.availability.findMany()
    * ```
    */
  get availability(): Prisma.AvailabilityDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dateOverride`: Exposes CRUD operations for the **DateOverride** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DateOverrides
    * const dateOverrides = await prisma.dateOverride.findMany()
    * ```
    */
  get dateOverride(): Prisma.DateOverrideDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.team`: Exposes CRUD operations for the **Team** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Teams
    * const teams = await prisma.team.findMany()
    * ```
    */
  get team(): Prisma.TeamDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.teamMember`: Exposes CRUD operations for the **TeamMember** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TeamMembers
    * const teamMembers = await prisma.teamMember.findMany()
    * ```
    */
  get teamMember(): Prisma.TeamMemberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.calendarConnection`: Exposes CRUD operations for the **CalendarConnection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CalendarConnections
    * const calendarConnections = await prisma.calendarConnection.findMany()
    * ```
    */
  get calendarConnection(): Prisma.CalendarConnectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.webhook`: Exposes CRUD operations for the **Webhook** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Webhooks
    * const webhooks = await prisma.webhook.findMany()
    * ```
    */
  get webhook(): Prisma.WebhookDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.webhookDelivery`: Exposes CRUD operations for the **WebhookDelivery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebhookDeliveries
    * const webhookDeliveries = await prisma.webhookDelivery.findMany()
    * ```
    */
  get webhookDelivery(): Prisma.WebhookDeliveryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Session: 'Session',
    User: 'User',
    EventType: 'EventType',
    Booking: 'Booking',
    Schedule: 'Schedule',
    Availability: 'Availability',
    DateOverride: 'DateOverride',
    Team: 'Team',
    TeamMember: 'TeamMember',
    CalendarConnection: 'CalendarConnection',
    Webhook: 'Webhook',
    WebhookDelivery: 'WebhookDelivery'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "account" | "session" | "user" | "eventType" | "booking" | "schedule" | "availability" | "dateOverride" | "team" | "teamMember" | "calendarConnection" | "webhook" | "webhookDelivery"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      EventType: {
        payload: Prisma.$EventTypePayload<ExtArgs>
        fields: Prisma.EventTypeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EventTypeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EventTypeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          findFirst: {
            args: Prisma.EventTypeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EventTypeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          findMany: {
            args: Prisma.EventTypeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>[]
          }
          create: {
            args: Prisma.EventTypeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          createMany: {
            args: Prisma.EventTypeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EventTypeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>[]
          }
          delete: {
            args: Prisma.EventTypeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          update: {
            args: Prisma.EventTypeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          deleteMany: {
            args: Prisma.EventTypeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EventTypeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EventTypeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>[]
          }
          upsert: {
            args: Prisma.EventTypeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EventTypePayload>
          }
          aggregate: {
            args: Prisma.EventTypeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEventType>
          }
          groupBy: {
            args: Prisma.EventTypeGroupByArgs<ExtArgs>
            result: $Utils.Optional<EventTypeGroupByOutputType>[]
          }
          count: {
            args: Prisma.EventTypeCountArgs<ExtArgs>
            result: $Utils.Optional<EventTypeCountAggregateOutputType> | number
          }
        }
      }
      Booking: {
        payload: Prisma.$BookingPayload<ExtArgs>
        fields: Prisma.BookingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BookingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BookingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findFirst: {
            args: Prisma.BookingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BookingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          findMany: {
            args: Prisma.BookingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          create: {
            args: Prisma.BookingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          createMany: {
            args: Prisma.BookingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BookingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          delete: {
            args: Prisma.BookingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          update: {
            args: Prisma.BookingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          deleteMany: {
            args: Prisma.BookingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BookingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BookingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>[]
          }
          upsert: {
            args: Prisma.BookingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BookingPayload>
          }
          aggregate: {
            args: Prisma.BookingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBooking>
          }
          groupBy: {
            args: Prisma.BookingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BookingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BookingCountArgs<ExtArgs>
            result: $Utils.Optional<BookingCountAggregateOutputType> | number
          }
        }
      }
      Schedule: {
        payload: Prisma.$SchedulePayload<ExtArgs>
        fields: Prisma.ScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findFirst: {
            args: Prisma.ScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          findMany: {
            args: Prisma.ScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          create: {
            args: Prisma.ScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          createMany: {
            args: Prisma.ScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          delete: {
            args: Prisma.ScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          update: {
            args: Prisma.ScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          deleteMany: {
            args: Prisma.ScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ScheduleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>[]
          }
          upsert: {
            args: Prisma.ScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SchedulePayload>
          }
          aggregate: {
            args: Prisma.ScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSchedule>
          }
          groupBy: {
            args: Prisma.ScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<ScheduleCountAggregateOutputType> | number
          }
        }
      }
      Availability: {
        payload: Prisma.$AvailabilityPayload<ExtArgs>
        fields: Prisma.AvailabilityFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AvailabilityFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AvailabilityFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          findFirst: {
            args: Prisma.AvailabilityFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AvailabilityFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          findMany: {
            args: Prisma.AvailabilityFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>[]
          }
          create: {
            args: Prisma.AvailabilityCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          createMany: {
            args: Prisma.AvailabilityCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AvailabilityCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>[]
          }
          delete: {
            args: Prisma.AvailabilityDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          update: {
            args: Prisma.AvailabilityUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          deleteMany: {
            args: Prisma.AvailabilityDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AvailabilityUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AvailabilityUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>[]
          }
          upsert: {
            args: Prisma.AvailabilityUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AvailabilityPayload>
          }
          aggregate: {
            args: Prisma.AvailabilityAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAvailability>
          }
          groupBy: {
            args: Prisma.AvailabilityGroupByArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityGroupByOutputType>[]
          }
          count: {
            args: Prisma.AvailabilityCountArgs<ExtArgs>
            result: $Utils.Optional<AvailabilityCountAggregateOutputType> | number
          }
        }
      }
      DateOverride: {
        payload: Prisma.$DateOverridePayload<ExtArgs>
        fields: Prisma.DateOverrideFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DateOverrideFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DateOverrideFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          findFirst: {
            args: Prisma.DateOverrideFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DateOverrideFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          findMany: {
            args: Prisma.DateOverrideFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>[]
          }
          create: {
            args: Prisma.DateOverrideCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          createMany: {
            args: Prisma.DateOverrideCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DateOverrideCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>[]
          }
          delete: {
            args: Prisma.DateOverrideDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          update: {
            args: Prisma.DateOverrideUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          deleteMany: {
            args: Prisma.DateOverrideDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DateOverrideUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DateOverrideUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>[]
          }
          upsert: {
            args: Prisma.DateOverrideUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DateOverridePayload>
          }
          aggregate: {
            args: Prisma.DateOverrideAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDateOverride>
          }
          groupBy: {
            args: Prisma.DateOverrideGroupByArgs<ExtArgs>
            result: $Utils.Optional<DateOverrideGroupByOutputType>[]
          }
          count: {
            args: Prisma.DateOverrideCountArgs<ExtArgs>
            result: $Utils.Optional<DateOverrideCountAggregateOutputType> | number
          }
        }
      }
      Team: {
        payload: Prisma.$TeamPayload<ExtArgs>
        fields: Prisma.TeamFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findFirst: {
            args: Prisma.TeamFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          findMany: {
            args: Prisma.TeamFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          create: {
            args: Prisma.TeamCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          createMany: {
            args: Prisma.TeamCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          delete: {
            args: Prisma.TeamDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          update: {
            args: Prisma.TeamUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          deleteMany: {
            args: Prisma.TeamDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>[]
          }
          upsert: {
            args: Prisma.TeamUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamPayload>
          }
          aggregate: {
            args: Prisma.TeamAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeam>
          }
          groupBy: {
            args: Prisma.TeamGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamCountArgs<ExtArgs>
            result: $Utils.Optional<TeamCountAggregateOutputType> | number
          }
        }
      }
      TeamMember: {
        payload: Prisma.$TeamMemberPayload<ExtArgs>
        fields: Prisma.TeamMemberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TeamMemberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TeamMemberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findFirst: {
            args: Prisma.TeamMemberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TeamMemberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          findMany: {
            args: Prisma.TeamMemberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          create: {
            args: Prisma.TeamMemberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          createMany: {
            args: Prisma.TeamMemberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TeamMemberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          delete: {
            args: Prisma.TeamMemberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          update: {
            args: Prisma.TeamMemberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          deleteMany: {
            args: Prisma.TeamMemberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TeamMemberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TeamMemberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>[]
          }
          upsert: {
            args: Prisma.TeamMemberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TeamMemberPayload>
          }
          aggregate: {
            args: Prisma.TeamMemberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTeamMember>
          }
          groupBy: {
            args: Prisma.TeamMemberGroupByArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberGroupByOutputType>[]
          }
          count: {
            args: Prisma.TeamMemberCountArgs<ExtArgs>
            result: $Utils.Optional<TeamMemberCountAggregateOutputType> | number
          }
        }
      }
      CalendarConnection: {
        payload: Prisma.$CalendarConnectionPayload<ExtArgs>
        fields: Prisma.CalendarConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CalendarConnectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CalendarConnectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          findFirst: {
            args: Prisma.CalendarConnectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CalendarConnectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          findMany: {
            args: Prisma.CalendarConnectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>[]
          }
          create: {
            args: Prisma.CalendarConnectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          createMany: {
            args: Prisma.CalendarConnectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CalendarConnectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>[]
          }
          delete: {
            args: Prisma.CalendarConnectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          update: {
            args: Prisma.CalendarConnectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          deleteMany: {
            args: Prisma.CalendarConnectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CalendarConnectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CalendarConnectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>[]
          }
          upsert: {
            args: Prisma.CalendarConnectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalendarConnectionPayload>
          }
          aggregate: {
            args: Prisma.CalendarConnectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCalendarConnection>
          }
          groupBy: {
            args: Prisma.CalendarConnectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CalendarConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CalendarConnectionCountArgs<ExtArgs>
            result: $Utils.Optional<CalendarConnectionCountAggregateOutputType> | number
          }
        }
      }
      Webhook: {
        payload: Prisma.$WebhookPayload<ExtArgs>
        fields: Prisma.WebhookFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          findFirst: {
            args: Prisma.WebhookFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          findMany: {
            args: Prisma.WebhookFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>[]
          }
          create: {
            args: Prisma.WebhookCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          createMany: {
            args: Prisma.WebhookCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>[]
          }
          delete: {
            args: Prisma.WebhookDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          update: {
            args: Prisma.WebhookUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          deleteMany: {
            args: Prisma.WebhookDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebhookUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>[]
          }
          upsert: {
            args: Prisma.WebhookUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookPayload>
          }
          aggregate: {
            args: Prisma.WebhookAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhook>
          }
          groupBy: {
            args: Prisma.WebhookGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookCountAggregateOutputType> | number
          }
        }
      }
      WebhookDelivery: {
        payload: Prisma.$WebhookDeliveryPayload<ExtArgs>
        fields: Prisma.WebhookDeliveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookDeliveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          findFirst: {
            args: Prisma.WebhookDeliveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookDeliveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          findMany: {
            args: Prisma.WebhookDeliveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>[]
          }
          create: {
            args: Prisma.WebhookDeliveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          createMany: {
            args: Prisma.WebhookDeliveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookDeliveryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>[]
          }
          delete: {
            args: Prisma.WebhookDeliveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          update: {
            args: Prisma.WebhookDeliveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          deleteMany: {
            args: Prisma.WebhookDeliveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookDeliveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebhookDeliveryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>[]
          }
          upsert: {
            args: Prisma.WebhookDeliveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookDeliveryPayload>
          }
          aggregate: {
            args: Prisma.WebhookDeliveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhookDelivery>
          }
          groupBy: {
            args: Prisma.WebhookDeliveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookDeliveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookDeliveryCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookDeliveryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    account?: AccountOmit
    session?: SessionOmit
    user?: UserOmit
    eventType?: EventTypeOmit
    booking?: BookingOmit
    schedule?: ScheduleOmit
    availability?: AvailabilityOmit
    dateOverride?: DateOverrideOmit
    team?: TeamOmit
    teamMember?: TeamMemberOmit
    calendarConnection?: CalendarConnectionOmit
    webhook?: WebhookOmit
    webhookDelivery?: WebhookDeliveryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
    eventTypes: number
    bookings: number
    schedules: number
    teamMemberships: number
    calendarConnections: number
    webhooks: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    eventTypes?: boolean | UserCountOutputTypeCountEventTypesArgs
    bookings?: boolean | UserCountOutputTypeCountBookingsArgs
    schedules?: boolean | UserCountOutputTypeCountSchedulesArgs
    teamMemberships?: boolean | UserCountOutputTypeCountTeamMembershipsArgs
    calendarConnections?: boolean | UserCountOutputTypeCountCalendarConnectionsArgs
    webhooks?: boolean | UserCountOutputTypeCountWebhooksArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountEventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTypeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSchedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTeamMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCalendarConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalendarConnectionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWebhooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookWhereInput
  }


  /**
   * Count Type EventTypeCountOutputType
   */

  export type EventTypeCountOutputType = {
    bookings: number
  }

  export type EventTypeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    bookings?: boolean | EventTypeCountOutputTypeCountBookingsArgs
  }

  // Custom InputTypes
  /**
   * EventTypeCountOutputType without action
   */
  export type EventTypeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventTypeCountOutputType
     */
    select?: EventTypeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * EventTypeCountOutputType without action
   */
  export type EventTypeCountOutputTypeCountBookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
  }


  /**
   * Count Type ScheduleCountOutputType
   */

  export type ScheduleCountOutputType = {
    availabilities: number
    dateOverrides: number
    eventTypes: number
  }

  export type ScheduleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    availabilities?: boolean | ScheduleCountOutputTypeCountAvailabilitiesArgs
    dateOverrides?: boolean | ScheduleCountOutputTypeCountDateOverridesArgs
    eventTypes?: boolean | ScheduleCountOutputTypeCountEventTypesArgs
  }

  // Custom InputTypes
  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScheduleCountOutputType
     */
    select?: ScheduleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeCountAvailabilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityWhereInput
  }

  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeCountDateOverridesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DateOverrideWhereInput
  }

  /**
   * ScheduleCountOutputType without action
   */
  export type ScheduleCountOutputTypeCountEventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTypeWhereInput
  }


  /**
   * Count Type TeamCountOutputType
   */

  export type TeamCountOutputType = {
    members: number
    eventTypes: number
  }

  export type TeamCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | TeamCountOutputTypeCountMembersArgs
    eventTypes?: boolean | TeamCountOutputTypeCountEventTypesArgs
  }

  // Custom InputTypes
  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamCountOutputType
     */
    select?: TeamCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountMembersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
  }

  /**
   * TeamCountOutputType without action
   */
  export type TeamCountOutputTypeCountEventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTypeWhereInput
  }


  /**
   * Count Type WebhookCountOutputType
   */

  export type WebhookCountOutputType = {
    deliveries: number
  }

  export type WebhookCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveries?: boolean | WebhookCountOutputTypeCountDeliveriesArgs
  }

  // Custom InputTypes
  /**
   * WebhookCountOutputType without action
   */
  export type WebhookCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookCountOutputType
     */
    select?: WebhookCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WebhookCountOutputType without action
   */
  export type WebhookCountOutputTypeCountDeliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookDeliveryWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expiresAt: number | null
  }

  export type AccountSumAggregateOutputType = {
    expiresAt: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refreshToken: number
    accessToken: number
    expiresAt: number
    tokenType: number
    scope: number
    idToken: number
    sessionState: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expiresAt?: true
  }

  export type AccountSumAggregateInputType = {
    expiresAt?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refreshToken?: true
    accessToken?: true
    expiresAt?: true
    tokenType?: true
    scope?: true
    idToken?: true
    sessionState?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken: string | null
    accessToken: string | null
    expiresAt: number | null
    tokenType: string | null
    scope: string | null
    idToken: string | null
    sessionState: string | null
    createdAt: Date
    updatedAt: Date
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refreshToken?: boolean
    accessToken?: boolean
    expiresAt?: boolean
    tokenType?: boolean
    scope?: boolean
    idToken?: boolean
    sessionState?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "type" | "provider" | "providerAccountId" | "refreshToken" | "accessToken" | "expiresAt" | "tokenType" | "scope" | "idToken" | "sessionState" | "createdAt" | "updatedAt", ExtArgs["result"]["account"]>
  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refreshToken: string | null
      accessToken: string | null
      expiresAt: number | null
      tokenType: string | null
      scope: string | null
      idToken: string | null
      sessionState: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts and returns the data updated in the database.
     * @param {AccountUpdateManyAndReturnArgs} args - Arguments to update many Accounts.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AccountUpdateManyAndReturnArgs>(args: SelectSubset<T, AccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refreshToken: FieldRef<"Account", 'String'>
    readonly accessToken: FieldRef<"Account", 'String'>
    readonly expiresAt: FieldRef<"Account", 'Int'>
    readonly tokenType: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly idToken: FieldRef<"Account", 'String'>
    readonly sessionState: FieldRef<"Account", 'String'>
    readonly createdAt: FieldRef<"Account", 'DateTime'>
    readonly updatedAt: FieldRef<"Account", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
  }

  /**
   * Account updateManyAndReturn
   */
  export type AccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
    /**
     * Limit how many Accounts to delete.
     */
    limit?: number
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    createdAt: Date
    updatedAt: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sessionToken" | "userId" | "expires" | "createdAt" | "updatedAt", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions and returns the data updated in the database.
     * @param {SessionUpdateManyAndReturnArgs} args - Arguments to update many Sessions.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SessionUpdateManyAndReturnArgs>(args: SelectSubset<T, SessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
    readonly createdAt: FieldRef<"Session", 'DateTime'>
    readonly updatedAt: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session updateManyAndReturn
   */
  export type SessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    weekStart: number | null
  }

  export type UserSumAggregateOutputType = {
    weekStart: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    image: string | null
    timezone: string | null
    weekStart: number | null
    bio: string | null
    theme: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    name: string | null
    image: string | null
    timezone: string | null
    weekStart: number | null
    bio: string | null
    theme: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    name: number
    image: number
    timezone: number
    weekStart: number
    bio: number
    theme: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    weekStart?: true
  }

  export type UserSumAggregateInputType = {
    weekStart?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    image?: true
    timezone?: true
    weekStart?: true
    bio?: true
    theme?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    image?: true
    timezone?: true
    weekStart?: true
    bio?: true
    theme?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    name?: true
    image?: true
    timezone?: true
    weekStart?: true
    bio?: true
    theme?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string | null
    name: string | null
    image: string | null
    timezone: string
    weekStart: number
    bio: string | null
    theme: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    image?: boolean
    timezone?: boolean
    weekStart?: boolean
    bio?: boolean
    theme?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    eventTypes?: boolean | User$eventTypesArgs<ExtArgs>
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    schedules?: boolean | User$schedulesArgs<ExtArgs>
    teamMemberships?: boolean | User$teamMembershipsArgs<ExtArgs>
    calendarConnections?: boolean | User$calendarConnectionsArgs<ExtArgs>
    webhooks?: boolean | User$webhooksArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    image?: boolean
    timezone?: boolean
    weekStart?: boolean
    bio?: boolean
    theme?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    image?: boolean
    timezone?: boolean
    weekStart?: boolean
    bio?: boolean
    theme?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    name?: boolean
    image?: boolean
    timezone?: boolean
    weekStart?: boolean
    bio?: boolean
    theme?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "passwordHash" | "name" | "image" | "timezone" | "weekStart" | "bio" | "theme" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    eventTypes?: boolean | User$eventTypesArgs<ExtArgs>
    bookings?: boolean | User$bookingsArgs<ExtArgs>
    schedules?: boolean | User$schedulesArgs<ExtArgs>
    teamMemberships?: boolean | User$teamMembershipsArgs<ExtArgs>
    calendarConnections?: boolean | User$calendarConnectionsArgs<ExtArgs>
    webhooks?: boolean | User$webhooksArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
      eventTypes: Prisma.$EventTypePayload<ExtArgs>[]
      bookings: Prisma.$BookingPayload<ExtArgs>[]
      schedules: Prisma.$SchedulePayload<ExtArgs>[]
      teamMemberships: Prisma.$TeamMemberPayload<ExtArgs>[]
      calendarConnections: Prisma.$CalendarConnectionPayload<ExtArgs>[]
      webhooks: Prisma.$WebhookPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string | null
      name: string | null
      image: string | null
      timezone: string
      weekStart: number
      bio: string | null
      theme: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    eventTypes<T extends User$eventTypesArgs<ExtArgs> = {}>(args?: Subset<T, User$eventTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    bookings<T extends User$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, User$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    schedules<T extends User$schedulesArgs<ExtArgs> = {}>(args?: Subset<T, User$schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    teamMemberships<T extends User$teamMembershipsArgs<ExtArgs> = {}>(args?: Subset<T, User$teamMembershipsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calendarConnections<T extends User$calendarConnectionsArgs<ExtArgs> = {}>(args?: Subset<T, User$calendarConnectionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    webhooks<T extends User$webhooksArgs<ExtArgs> = {}>(args?: Subset<T, User$webhooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly image: FieldRef<"User", 'String'>
    readonly timezone: FieldRef<"User", 'String'>
    readonly weekStart: FieldRef<"User", 'Int'>
    readonly bio: FieldRef<"User", 'String'>
    readonly theme: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Account
     */
    omit?: AccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User.eventTypes
   */
  export type User$eventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    where?: EventTypeWhereInput
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    cursor?: EventTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * User.bookings
   */
  export type User$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * User.schedules
   */
  export type User$schedulesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    cursor?: ScheduleWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * User.teamMemberships
   */
  export type User$teamMembershipsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * User.calendarConnections
   */
  export type User$calendarConnectionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    where?: CalendarConnectionWhereInput
    orderBy?: CalendarConnectionOrderByWithRelationInput | CalendarConnectionOrderByWithRelationInput[]
    cursor?: CalendarConnectionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalendarConnectionScalarFieldEnum | CalendarConnectionScalarFieldEnum[]
  }

  /**
   * User.webhooks
   */
  export type User$webhooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    where?: WebhookWhereInput
    orderBy?: WebhookOrderByWithRelationInput | WebhookOrderByWithRelationInput[]
    cursor?: WebhookWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebhookScalarFieldEnum | WebhookScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model EventType
   */

  export type AggregateEventType = {
    _count: EventTypeCountAggregateOutputType | null
    _avg: EventTypeAvgAggregateOutputType | null
    _sum: EventTypeSumAggregateOutputType | null
    _min: EventTypeMinAggregateOutputType | null
    _max: EventTypeMaxAggregateOutputType | null
  }

  export type EventTypeAvgAggregateOutputType = {
    duration: number | null
    price: number | null
    minimumNotice: number | null
    beforeBuffer: number | null
    afterBuffer: number | null
    slotInterval: number | null
    maxBookingsPerDay: number | null
    maxBookingsPerWeek: number | null
    futureLimit: number | null
  }

  export type EventTypeSumAggregateOutputType = {
    duration: number | null
    price: number | null
    minimumNotice: number | null
    beforeBuffer: number | null
    afterBuffer: number | null
    slotInterval: number | null
    maxBookingsPerDay: number | null
    maxBookingsPerWeek: number | null
    futureLimit: number | null
  }

  export type EventTypeMinAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    description: string | null
    duration: number | null
    isActive: boolean | null
    requiresConfirmation: boolean | null
    price: number | null
    currency: string | null
    minimumNotice: number | null
    beforeBuffer: number | null
    afterBuffer: number | null
    slotInterval: number | null
    maxBookingsPerDay: number | null
    maxBookingsPerWeek: number | null
    futureLimit: number | null
    color: string | null
    recurringEnabled: boolean | null
    recurringFrequency: string | null
    schedulingType: $Enums.SchedulingType | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    scheduleId: string | null
    teamId: string | null
  }

  export type EventTypeMaxAggregateOutputType = {
    id: string | null
    title: string | null
    slug: string | null
    description: string | null
    duration: number | null
    isActive: boolean | null
    requiresConfirmation: boolean | null
    price: number | null
    currency: string | null
    minimumNotice: number | null
    beforeBuffer: number | null
    afterBuffer: number | null
    slotInterval: number | null
    maxBookingsPerDay: number | null
    maxBookingsPerWeek: number | null
    futureLimit: number | null
    color: string | null
    recurringEnabled: boolean | null
    recurringFrequency: string | null
    schedulingType: $Enums.SchedulingType | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    scheduleId: string | null
    teamId: string | null
  }

  export type EventTypeCountAggregateOutputType = {
    id: number
    title: number
    slug: number
    description: number
    duration: number
    isActive: number
    requiresConfirmation: number
    price: number
    currency: number
    minimumNotice: number
    beforeBuffer: number
    afterBuffer: number
    slotInterval: number
    maxBookingsPerDay: number
    maxBookingsPerWeek: number
    futureLimit: number
    color: number
    customQuestions: number
    recurringEnabled: number
    recurringFrequency: number
    schedulingType: number
    createdAt: number
    updatedAt: number
    userId: number
    scheduleId: number
    teamId: number
    _all: number
  }


  export type EventTypeAvgAggregateInputType = {
    duration?: true
    price?: true
    minimumNotice?: true
    beforeBuffer?: true
    afterBuffer?: true
    slotInterval?: true
    maxBookingsPerDay?: true
    maxBookingsPerWeek?: true
    futureLimit?: true
  }

  export type EventTypeSumAggregateInputType = {
    duration?: true
    price?: true
    minimumNotice?: true
    beforeBuffer?: true
    afterBuffer?: true
    slotInterval?: true
    maxBookingsPerDay?: true
    maxBookingsPerWeek?: true
    futureLimit?: true
  }

  export type EventTypeMinAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    duration?: true
    isActive?: true
    requiresConfirmation?: true
    price?: true
    currency?: true
    minimumNotice?: true
    beforeBuffer?: true
    afterBuffer?: true
    slotInterval?: true
    maxBookingsPerDay?: true
    maxBookingsPerWeek?: true
    futureLimit?: true
    color?: true
    recurringEnabled?: true
    recurringFrequency?: true
    schedulingType?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    scheduleId?: true
    teamId?: true
  }

  export type EventTypeMaxAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    duration?: true
    isActive?: true
    requiresConfirmation?: true
    price?: true
    currency?: true
    minimumNotice?: true
    beforeBuffer?: true
    afterBuffer?: true
    slotInterval?: true
    maxBookingsPerDay?: true
    maxBookingsPerWeek?: true
    futureLimit?: true
    color?: true
    recurringEnabled?: true
    recurringFrequency?: true
    schedulingType?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    scheduleId?: true
    teamId?: true
  }

  export type EventTypeCountAggregateInputType = {
    id?: true
    title?: true
    slug?: true
    description?: true
    duration?: true
    isActive?: true
    requiresConfirmation?: true
    price?: true
    currency?: true
    minimumNotice?: true
    beforeBuffer?: true
    afterBuffer?: true
    slotInterval?: true
    maxBookingsPerDay?: true
    maxBookingsPerWeek?: true
    futureLimit?: true
    color?: true
    customQuestions?: true
    recurringEnabled?: true
    recurringFrequency?: true
    schedulingType?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    scheduleId?: true
    teamId?: true
    _all?: true
  }

  export type EventTypeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventType to aggregate.
     */
    where?: EventTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EventTypes
    **/
    _count?: true | EventTypeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventTypeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventTypeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventTypeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventTypeMaxAggregateInputType
  }

  export type GetEventTypeAggregateType<T extends EventTypeAggregateArgs> = {
        [P in keyof T & keyof AggregateEventType]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEventType[P]>
      : GetScalarType<T[P], AggregateEventType[P]>
  }




  export type EventTypeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EventTypeWhereInput
    orderBy?: EventTypeOrderByWithAggregationInput | EventTypeOrderByWithAggregationInput[]
    by: EventTypeScalarFieldEnum[] | EventTypeScalarFieldEnum
    having?: EventTypeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventTypeCountAggregateInputType | true
    _avg?: EventTypeAvgAggregateInputType
    _sum?: EventTypeSumAggregateInputType
    _min?: EventTypeMinAggregateInputType
    _max?: EventTypeMaxAggregateInputType
  }

  export type EventTypeGroupByOutputType = {
    id: string
    title: string
    slug: string
    description: string | null
    duration: number
    isActive: boolean
    requiresConfirmation: boolean
    price: number | null
    currency: string
    minimumNotice: number
    beforeBuffer: number
    afterBuffer: number
    slotInterval: number | null
    maxBookingsPerDay: number | null
    maxBookingsPerWeek: number | null
    futureLimit: number | null
    color: string
    customQuestions: JsonValue | null
    recurringEnabled: boolean
    recurringFrequency: string | null
    schedulingType: $Enums.SchedulingType | null
    createdAt: Date
    updatedAt: Date
    userId: string | null
    scheduleId: string | null
    teamId: string | null
    _count: EventTypeCountAggregateOutputType | null
    _avg: EventTypeAvgAggregateOutputType | null
    _sum: EventTypeSumAggregateOutputType | null
    _min: EventTypeMinAggregateOutputType | null
    _max: EventTypeMaxAggregateOutputType | null
  }

  type GetEventTypeGroupByPayload<T extends EventTypeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EventTypeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventTypeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventTypeGroupByOutputType[P]>
            : GetScalarType<T[P], EventTypeGroupByOutputType[P]>
        }
      >
    >


  export type EventTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    duration?: boolean
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: boolean
    currency?: boolean
    minimumNotice?: boolean
    beforeBuffer?: boolean
    afterBuffer?: boolean
    slotInterval?: boolean
    maxBookingsPerDay?: boolean
    maxBookingsPerWeek?: boolean
    futureLimit?: boolean
    color?: boolean
    customQuestions?: boolean
    recurringEnabled?: boolean
    recurringFrequency?: boolean
    schedulingType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    scheduleId?: boolean
    teamId?: boolean
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
    bookings?: boolean | EventType$bookingsArgs<ExtArgs>
    _count?: boolean | EventTypeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["eventType"]>

  export type EventTypeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    duration?: boolean
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: boolean
    currency?: boolean
    minimumNotice?: boolean
    beforeBuffer?: boolean
    afterBuffer?: boolean
    slotInterval?: boolean
    maxBookingsPerDay?: boolean
    maxBookingsPerWeek?: boolean
    futureLimit?: boolean
    color?: boolean
    customQuestions?: boolean
    recurringEnabled?: boolean
    recurringFrequency?: boolean
    schedulingType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    scheduleId?: boolean
    teamId?: boolean
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
  }, ExtArgs["result"]["eventType"]>

  export type EventTypeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    duration?: boolean
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: boolean
    currency?: boolean
    minimumNotice?: boolean
    beforeBuffer?: boolean
    afterBuffer?: boolean
    slotInterval?: boolean
    maxBookingsPerDay?: boolean
    maxBookingsPerWeek?: boolean
    futureLimit?: boolean
    color?: boolean
    customQuestions?: boolean
    recurringEnabled?: boolean
    recurringFrequency?: boolean
    schedulingType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    scheduleId?: boolean
    teamId?: boolean
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
  }, ExtArgs["result"]["eventType"]>

  export type EventTypeSelectScalar = {
    id?: boolean
    title?: boolean
    slug?: boolean
    description?: boolean
    duration?: boolean
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: boolean
    currency?: boolean
    minimumNotice?: boolean
    beforeBuffer?: boolean
    afterBuffer?: boolean
    slotInterval?: boolean
    maxBookingsPerDay?: boolean
    maxBookingsPerWeek?: boolean
    futureLimit?: boolean
    color?: boolean
    customQuestions?: boolean
    recurringEnabled?: boolean
    recurringFrequency?: boolean
    schedulingType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    scheduleId?: boolean
    teamId?: boolean
  }

  export type EventTypeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "slug" | "description" | "duration" | "isActive" | "requiresConfirmation" | "price" | "currency" | "minimumNotice" | "beforeBuffer" | "afterBuffer" | "slotInterval" | "maxBookingsPerDay" | "maxBookingsPerWeek" | "futureLimit" | "color" | "customQuestions" | "recurringEnabled" | "recurringFrequency" | "schedulingType" | "createdAt" | "updatedAt" | "userId" | "scheduleId" | "teamId", ExtArgs["result"]["eventType"]>
  export type EventTypeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
    bookings?: boolean | EventType$bookingsArgs<ExtArgs>
    _count?: boolean | EventTypeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type EventTypeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
  }
  export type EventTypeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | EventType$userArgs<ExtArgs>
    schedule?: boolean | EventType$scheduleArgs<ExtArgs>
    team?: boolean | EventType$teamArgs<ExtArgs>
  }

  export type $EventTypePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EventType"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
      schedule: Prisma.$SchedulePayload<ExtArgs> | null
      team: Prisma.$TeamPayload<ExtArgs> | null
      bookings: Prisma.$BookingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      slug: string
      description: string | null
      duration: number
      isActive: boolean
      requiresConfirmation: boolean
      price: number | null
      currency: string
      minimumNotice: number
      beforeBuffer: number
      afterBuffer: number
      slotInterval: number | null
      maxBookingsPerDay: number | null
      maxBookingsPerWeek: number | null
      futureLimit: number | null
      color: string
      customQuestions: Prisma.JsonValue | null
      recurringEnabled: boolean
      recurringFrequency: string | null
      schedulingType: $Enums.SchedulingType | null
      createdAt: Date
      updatedAt: Date
      userId: string | null
      scheduleId: string | null
      teamId: string | null
    }, ExtArgs["result"]["eventType"]>
    composites: {}
  }

  type EventTypeGetPayload<S extends boolean | null | undefined | EventTypeDefaultArgs> = $Result.GetResult<Prisma.$EventTypePayload, S>

  type EventTypeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EventTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EventTypeCountAggregateInputType | true
    }

  export interface EventTypeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EventType'], meta: { name: 'EventType' } }
    /**
     * Find zero or one EventType that matches the filter.
     * @param {EventTypeFindUniqueArgs} args - Arguments to find a EventType
     * @example
     * // Get one EventType
     * const eventType = await prisma.eventType.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EventTypeFindUniqueArgs>(args: SelectSubset<T, EventTypeFindUniqueArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EventType that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EventTypeFindUniqueOrThrowArgs} args - Arguments to find a EventType
     * @example
     * // Get one EventType
     * const eventType = await prisma.eventType.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EventTypeFindUniqueOrThrowArgs>(args: SelectSubset<T, EventTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventType that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeFindFirstArgs} args - Arguments to find a EventType
     * @example
     * // Get one EventType
     * const eventType = await prisma.eventType.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EventTypeFindFirstArgs>(args?: SelectSubset<T, EventTypeFindFirstArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EventType that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeFindFirstOrThrowArgs} args - Arguments to find a EventType
     * @example
     * // Get one EventType
     * const eventType = await prisma.eventType.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EventTypeFindFirstOrThrowArgs>(args?: SelectSubset<T, EventTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EventTypes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EventTypes
     * const eventTypes = await prisma.eventType.findMany()
     * 
     * // Get first 10 EventTypes
     * const eventTypes = await prisma.eventType.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const eventTypeWithIdOnly = await prisma.eventType.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EventTypeFindManyArgs>(args?: SelectSubset<T, EventTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EventType.
     * @param {EventTypeCreateArgs} args - Arguments to create a EventType.
     * @example
     * // Create one EventType
     * const EventType = await prisma.eventType.create({
     *   data: {
     *     // ... data to create a EventType
     *   }
     * })
     * 
     */
    create<T extends EventTypeCreateArgs>(args: SelectSubset<T, EventTypeCreateArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EventTypes.
     * @param {EventTypeCreateManyArgs} args - Arguments to create many EventTypes.
     * @example
     * // Create many EventTypes
     * const eventType = await prisma.eventType.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EventTypeCreateManyArgs>(args?: SelectSubset<T, EventTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EventTypes and returns the data saved in the database.
     * @param {EventTypeCreateManyAndReturnArgs} args - Arguments to create many EventTypes.
     * @example
     * // Create many EventTypes
     * const eventType = await prisma.eventType.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EventTypes and only return the `id`
     * const eventTypeWithIdOnly = await prisma.eventType.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EventTypeCreateManyAndReturnArgs>(args?: SelectSubset<T, EventTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EventType.
     * @param {EventTypeDeleteArgs} args - Arguments to delete one EventType.
     * @example
     * // Delete one EventType
     * const EventType = await prisma.eventType.delete({
     *   where: {
     *     // ... filter to delete one EventType
     *   }
     * })
     * 
     */
    delete<T extends EventTypeDeleteArgs>(args: SelectSubset<T, EventTypeDeleteArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EventType.
     * @param {EventTypeUpdateArgs} args - Arguments to update one EventType.
     * @example
     * // Update one EventType
     * const eventType = await prisma.eventType.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EventTypeUpdateArgs>(args: SelectSubset<T, EventTypeUpdateArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EventTypes.
     * @param {EventTypeDeleteManyArgs} args - Arguments to filter EventTypes to delete.
     * @example
     * // Delete a few EventTypes
     * const { count } = await prisma.eventType.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EventTypeDeleteManyArgs>(args?: SelectSubset<T, EventTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EventTypes
     * const eventType = await prisma.eventType.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EventTypeUpdateManyArgs>(args: SelectSubset<T, EventTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EventTypes and returns the data updated in the database.
     * @param {EventTypeUpdateManyAndReturnArgs} args - Arguments to update many EventTypes.
     * @example
     * // Update many EventTypes
     * const eventType = await prisma.eventType.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EventTypes and only return the `id`
     * const eventTypeWithIdOnly = await prisma.eventType.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EventTypeUpdateManyAndReturnArgs>(args: SelectSubset<T, EventTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EventType.
     * @param {EventTypeUpsertArgs} args - Arguments to update or create a EventType.
     * @example
     * // Update or create a EventType
     * const eventType = await prisma.eventType.upsert({
     *   create: {
     *     // ... data to create a EventType
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EventType we want to update
     *   }
     * })
     */
    upsert<T extends EventTypeUpsertArgs>(args: SelectSubset<T, EventTypeUpsertArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EventTypes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeCountArgs} args - Arguments to filter EventTypes to count.
     * @example
     * // Count the number of EventTypes
     * const count = await prisma.eventType.count({
     *   where: {
     *     // ... the filter for the EventTypes we want to count
     *   }
     * })
    **/
    count<T extends EventTypeCountArgs>(
      args?: Subset<T, EventTypeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventTypeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EventType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventTypeAggregateArgs>(args: Subset<T, EventTypeAggregateArgs>): Prisma.PrismaPromise<GetEventTypeAggregateType<T>>

    /**
     * Group by EventType.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventTypeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventTypeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventTypeGroupByArgs['orderBy'] }
        : { orderBy?: EventTypeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EventType model
   */
  readonly fields: EventTypeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EventType.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EventTypeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends EventType$userArgs<ExtArgs> = {}>(args?: Subset<T, EventType$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    schedule<T extends EventType$scheduleArgs<ExtArgs> = {}>(args?: Subset<T, EventType$scheduleArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    team<T extends EventType$teamArgs<ExtArgs> = {}>(args?: Subset<T, EventType$teamArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    bookings<T extends EventType$bookingsArgs<ExtArgs> = {}>(args?: Subset<T, EventType$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EventType model
   */
  interface EventTypeFieldRefs {
    readonly id: FieldRef<"EventType", 'String'>
    readonly title: FieldRef<"EventType", 'String'>
    readonly slug: FieldRef<"EventType", 'String'>
    readonly description: FieldRef<"EventType", 'String'>
    readonly duration: FieldRef<"EventType", 'Int'>
    readonly isActive: FieldRef<"EventType", 'Boolean'>
    readonly requiresConfirmation: FieldRef<"EventType", 'Boolean'>
    readonly price: FieldRef<"EventType", 'Int'>
    readonly currency: FieldRef<"EventType", 'String'>
    readonly minimumNotice: FieldRef<"EventType", 'Int'>
    readonly beforeBuffer: FieldRef<"EventType", 'Int'>
    readonly afterBuffer: FieldRef<"EventType", 'Int'>
    readonly slotInterval: FieldRef<"EventType", 'Int'>
    readonly maxBookingsPerDay: FieldRef<"EventType", 'Int'>
    readonly maxBookingsPerWeek: FieldRef<"EventType", 'Int'>
    readonly futureLimit: FieldRef<"EventType", 'Int'>
    readonly color: FieldRef<"EventType", 'String'>
    readonly customQuestions: FieldRef<"EventType", 'Json'>
    readonly recurringEnabled: FieldRef<"EventType", 'Boolean'>
    readonly recurringFrequency: FieldRef<"EventType", 'String'>
    readonly schedulingType: FieldRef<"EventType", 'SchedulingType'>
    readonly createdAt: FieldRef<"EventType", 'DateTime'>
    readonly updatedAt: FieldRef<"EventType", 'DateTime'>
    readonly userId: FieldRef<"EventType", 'String'>
    readonly scheduleId: FieldRef<"EventType", 'String'>
    readonly teamId: FieldRef<"EventType", 'String'>
  }
    

  // Custom InputTypes
  /**
   * EventType findUnique
   */
  export type EventTypeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter, which EventType to fetch.
     */
    where: EventTypeWhereUniqueInput
  }

  /**
   * EventType findUniqueOrThrow
   */
  export type EventTypeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter, which EventType to fetch.
     */
    where: EventTypeWhereUniqueInput
  }

  /**
   * EventType findFirst
   */
  export type EventTypeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter, which EventType to fetch.
     */
    where?: EventTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTypes.
     */
    cursor?: EventTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTypes.
     */
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * EventType findFirstOrThrow
   */
  export type EventTypeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter, which EventType to fetch.
     */
    where?: EventTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EventTypes.
     */
    cursor?: EventTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTypes.
     */
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * EventType findMany
   */
  export type EventTypeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter, which EventTypes to fetch.
     */
    where?: EventTypeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EventTypes to fetch.
     */
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EventTypes.
     */
    cursor?: EventTypeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EventTypes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EventTypes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EventTypes.
     */
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * EventType create
   */
  export type EventTypeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * The data needed to create a EventType.
     */
    data: XOR<EventTypeCreateInput, EventTypeUncheckedCreateInput>
  }

  /**
   * EventType createMany
   */
  export type EventTypeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EventTypes.
     */
    data: EventTypeCreateManyInput | EventTypeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EventType createManyAndReturn
   */
  export type EventTypeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * The data used to create many EventTypes.
     */
    data: EventTypeCreateManyInput | EventTypeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventType update
   */
  export type EventTypeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * The data needed to update a EventType.
     */
    data: XOR<EventTypeUpdateInput, EventTypeUncheckedUpdateInput>
    /**
     * Choose, which EventType to update.
     */
    where: EventTypeWhereUniqueInput
  }

  /**
   * EventType updateMany
   */
  export type EventTypeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EventTypes.
     */
    data: XOR<EventTypeUpdateManyMutationInput, EventTypeUncheckedUpdateManyInput>
    /**
     * Filter which EventTypes to update
     */
    where?: EventTypeWhereInput
    /**
     * Limit how many EventTypes to update.
     */
    limit?: number
  }

  /**
   * EventType updateManyAndReturn
   */
  export type EventTypeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * The data used to update EventTypes.
     */
    data: XOR<EventTypeUpdateManyMutationInput, EventTypeUncheckedUpdateManyInput>
    /**
     * Filter which EventTypes to update
     */
    where?: EventTypeWhereInput
    /**
     * Limit how many EventTypes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EventType upsert
   */
  export type EventTypeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * The filter to search for the EventType to update in case it exists.
     */
    where: EventTypeWhereUniqueInput
    /**
     * In case the EventType found by the `where` argument doesn't exist, create a new EventType with this data.
     */
    create: XOR<EventTypeCreateInput, EventTypeUncheckedCreateInput>
    /**
     * In case the EventType was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventTypeUpdateInput, EventTypeUncheckedUpdateInput>
  }

  /**
   * EventType delete
   */
  export type EventTypeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    /**
     * Filter which EventType to delete.
     */
    where: EventTypeWhereUniqueInput
  }

  /**
   * EventType deleteMany
   */
  export type EventTypeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EventTypes to delete
     */
    where?: EventTypeWhereInput
    /**
     * Limit how many EventTypes to delete.
     */
    limit?: number
  }

  /**
   * EventType.user
   */
  export type EventType$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * EventType.schedule
   */
  export type EventType$scheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    where?: ScheduleWhereInput
  }

  /**
   * EventType.team
   */
  export type EventType$teamArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    where?: TeamWhereInput
  }

  /**
   * EventType.bookings
   */
  export type EventType$bookingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    cursor?: BookingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * EventType without action
   */
  export type EventTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
  }


  /**
   * Model Booking
   */

  export type AggregateBooking = {
    _count: BookingCountAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  export type BookingMinAggregateOutputType = {
    id: string | null
    uid: string | null
    title: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.BookingStatus | null
    attendeeName: string | null
    attendeeEmail: string | null
    attendeeTimezone: string | null
    attendeeNotes: string | null
    meetingUrl: string | null
    location: string | null
    cancellationReason: string | null
    recurringEventId: string | null
    calendarEventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    eventTypeId: string | null
  }

  export type BookingMaxAggregateOutputType = {
    id: string | null
    uid: string | null
    title: string | null
    startTime: Date | null
    endTime: Date | null
    status: $Enums.BookingStatus | null
    attendeeName: string | null
    attendeeEmail: string | null
    attendeeTimezone: string | null
    attendeeNotes: string | null
    meetingUrl: string | null
    location: string | null
    cancellationReason: string | null
    recurringEventId: string | null
    calendarEventId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    eventTypeId: string | null
  }

  export type BookingCountAggregateOutputType = {
    id: number
    uid: number
    title: number
    startTime: number
    endTime: number
    status: number
    attendeeName: number
    attendeeEmail: number
    attendeeTimezone: number
    attendeeNotes: number
    meetingUrl: number
    location: number
    responses: number
    cancellationReason: number
    recurringEventId: number
    calendarEventId: number
    createdAt: number
    updatedAt: number
    userId: number
    eventTypeId: number
    _all: number
  }


  export type BookingMinAggregateInputType = {
    id?: true
    uid?: true
    title?: true
    startTime?: true
    endTime?: true
    status?: true
    attendeeName?: true
    attendeeEmail?: true
    attendeeTimezone?: true
    attendeeNotes?: true
    meetingUrl?: true
    location?: true
    cancellationReason?: true
    recurringEventId?: true
    calendarEventId?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    eventTypeId?: true
  }

  export type BookingMaxAggregateInputType = {
    id?: true
    uid?: true
    title?: true
    startTime?: true
    endTime?: true
    status?: true
    attendeeName?: true
    attendeeEmail?: true
    attendeeTimezone?: true
    attendeeNotes?: true
    meetingUrl?: true
    location?: true
    cancellationReason?: true
    recurringEventId?: true
    calendarEventId?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    eventTypeId?: true
  }

  export type BookingCountAggregateInputType = {
    id?: true
    uid?: true
    title?: true
    startTime?: true
    endTime?: true
    status?: true
    attendeeName?: true
    attendeeEmail?: true
    attendeeTimezone?: true
    attendeeNotes?: true
    meetingUrl?: true
    location?: true
    responses?: true
    cancellationReason?: true
    recurringEventId?: true
    calendarEventId?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    eventTypeId?: true
    _all?: true
  }

  export type BookingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Booking to aggregate.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bookings
    **/
    _count?: true | BookingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BookingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BookingMaxAggregateInputType
  }

  export type GetBookingAggregateType<T extends BookingAggregateArgs> = {
        [P in keyof T & keyof AggregateBooking]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBooking[P]>
      : GetScalarType<T[P], AggregateBooking[P]>
  }




  export type BookingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BookingWhereInput
    orderBy?: BookingOrderByWithAggregationInput | BookingOrderByWithAggregationInput[]
    by: BookingScalarFieldEnum[] | BookingScalarFieldEnum
    having?: BookingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BookingCountAggregateInputType | true
    _min?: BookingMinAggregateInputType
    _max?: BookingMaxAggregateInputType
  }

  export type BookingGroupByOutputType = {
    id: string
    uid: string
    title: string
    startTime: Date
    endTime: Date
    status: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes: string | null
    meetingUrl: string | null
    location: string | null
    responses: JsonValue | null
    cancellationReason: string | null
    recurringEventId: string | null
    calendarEventId: string | null
    createdAt: Date
    updatedAt: Date
    userId: string
    eventTypeId: string
    _count: BookingCountAggregateOutputType | null
    _min: BookingMinAggregateOutputType | null
    _max: BookingMaxAggregateOutputType | null
  }

  type GetBookingGroupByPayload<T extends BookingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BookingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BookingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BookingGroupByOutputType[P]>
            : GetScalarType<T[P], BookingGroupByOutputType[P]>
        }
      >
    >


  export type BookingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    title?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    attendeeName?: boolean
    attendeeEmail?: boolean
    attendeeTimezone?: boolean
    attendeeNotes?: boolean
    meetingUrl?: boolean
    location?: boolean
    responses?: boolean
    cancellationReason?: boolean
    recurringEventId?: boolean
    calendarEventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    eventTypeId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    title?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    attendeeName?: boolean
    attendeeEmail?: boolean
    attendeeTimezone?: boolean
    attendeeNotes?: boolean
    meetingUrl?: boolean
    location?: boolean
    responses?: boolean
    cancellationReason?: boolean
    recurringEventId?: boolean
    calendarEventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    eventTypeId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uid?: boolean
    title?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    attendeeName?: boolean
    attendeeEmail?: boolean
    attendeeTimezone?: boolean
    attendeeNotes?: boolean
    meetingUrl?: boolean
    location?: boolean
    responses?: boolean
    cancellationReason?: boolean
    recurringEventId?: boolean
    calendarEventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    eventTypeId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["booking"]>

  export type BookingSelectScalar = {
    id?: boolean
    uid?: boolean
    title?: boolean
    startTime?: boolean
    endTime?: boolean
    status?: boolean
    attendeeName?: boolean
    attendeeEmail?: boolean
    attendeeTimezone?: boolean
    attendeeNotes?: boolean
    meetingUrl?: boolean
    location?: boolean
    responses?: boolean
    cancellationReason?: boolean
    recurringEventId?: boolean
    calendarEventId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    eventTypeId?: boolean
  }

  export type BookingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uid" | "title" | "startTime" | "endTime" | "status" | "attendeeName" | "attendeeEmail" | "attendeeTimezone" | "attendeeNotes" | "meetingUrl" | "location" | "responses" | "cancellationReason" | "recurringEventId" | "calendarEventId" | "createdAt" | "updatedAt" | "userId" | "eventTypeId", ExtArgs["result"]["booking"]>
  export type BookingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }
  export type BookingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }
  export type BookingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    eventType?: boolean | EventTypeDefaultArgs<ExtArgs>
  }

  export type $BookingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Booking"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      eventType: Prisma.$EventTypePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      uid: string
      title: string
      startTime: Date
      endTime: Date
      status: $Enums.BookingStatus
      attendeeName: string
      attendeeEmail: string
      attendeeTimezone: string
      attendeeNotes: string | null
      meetingUrl: string | null
      location: string | null
      responses: Prisma.JsonValue | null
      cancellationReason: string | null
      recurringEventId: string | null
      calendarEventId: string | null
      createdAt: Date
      updatedAt: Date
      userId: string
      eventTypeId: string
    }, ExtArgs["result"]["booking"]>
    composites: {}
  }

  type BookingGetPayload<S extends boolean | null | undefined | BookingDefaultArgs> = $Result.GetResult<Prisma.$BookingPayload, S>

  type BookingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BookingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BookingCountAggregateInputType | true
    }

  export interface BookingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Booking'], meta: { name: 'Booking' } }
    /**
     * Find zero or one Booking that matches the filter.
     * @param {BookingFindUniqueArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BookingFindUniqueArgs>(args: SelectSubset<T, BookingFindUniqueArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Booking that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BookingFindUniqueOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BookingFindUniqueOrThrowArgs>(args: SelectSubset<T, BookingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BookingFindFirstArgs>(args?: SelectSubset<T, BookingFindFirstArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Booking that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindFirstOrThrowArgs} args - Arguments to find a Booking
     * @example
     * // Get one Booking
     * const booking = await prisma.booking.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BookingFindFirstOrThrowArgs>(args?: SelectSubset<T, BookingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bookings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bookings
     * const bookings = await prisma.booking.findMany()
     * 
     * // Get first 10 Bookings
     * const bookings = await prisma.booking.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bookingWithIdOnly = await prisma.booking.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BookingFindManyArgs>(args?: SelectSubset<T, BookingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Booking.
     * @param {BookingCreateArgs} args - Arguments to create a Booking.
     * @example
     * // Create one Booking
     * const Booking = await prisma.booking.create({
     *   data: {
     *     // ... data to create a Booking
     *   }
     * })
     * 
     */
    create<T extends BookingCreateArgs>(args: SelectSubset<T, BookingCreateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bookings.
     * @param {BookingCreateManyArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BookingCreateManyArgs>(args?: SelectSubset<T, BookingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Bookings and returns the data saved in the database.
     * @param {BookingCreateManyAndReturnArgs} args - Arguments to create many Bookings.
     * @example
     * // Create many Bookings
     * const booking = await prisma.booking.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BookingCreateManyAndReturnArgs>(args?: SelectSubset<T, BookingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Booking.
     * @param {BookingDeleteArgs} args - Arguments to delete one Booking.
     * @example
     * // Delete one Booking
     * const Booking = await prisma.booking.delete({
     *   where: {
     *     // ... filter to delete one Booking
     *   }
     * })
     * 
     */
    delete<T extends BookingDeleteArgs>(args: SelectSubset<T, BookingDeleteArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Booking.
     * @param {BookingUpdateArgs} args - Arguments to update one Booking.
     * @example
     * // Update one Booking
     * const booking = await prisma.booking.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BookingUpdateArgs>(args: SelectSubset<T, BookingUpdateArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bookings.
     * @param {BookingDeleteManyArgs} args - Arguments to filter Bookings to delete.
     * @example
     * // Delete a few Bookings
     * const { count } = await prisma.booking.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BookingDeleteManyArgs>(args?: SelectSubset<T, BookingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BookingUpdateManyArgs>(args: SelectSubset<T, BookingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bookings and returns the data updated in the database.
     * @param {BookingUpdateManyAndReturnArgs} args - Arguments to update many Bookings.
     * @example
     * // Update many Bookings
     * const booking = await prisma.booking.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Bookings and only return the `id`
     * const bookingWithIdOnly = await prisma.booking.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends BookingUpdateManyAndReturnArgs>(args: SelectSubset<T, BookingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Booking.
     * @param {BookingUpsertArgs} args - Arguments to update or create a Booking.
     * @example
     * // Update or create a Booking
     * const booking = await prisma.booking.upsert({
     *   create: {
     *     // ... data to create a Booking
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Booking we want to update
     *   }
     * })
     */
    upsert<T extends BookingUpsertArgs>(args: SelectSubset<T, BookingUpsertArgs<ExtArgs>>): Prisma__BookingClient<$Result.GetResult<Prisma.$BookingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bookings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingCountArgs} args - Arguments to filter Bookings to count.
     * @example
     * // Count the number of Bookings
     * const count = await prisma.booking.count({
     *   where: {
     *     // ... the filter for the Bookings we want to count
     *   }
     * })
    **/
    count<T extends BookingCountArgs>(
      args?: Subset<T, BookingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BookingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BookingAggregateArgs>(args: Subset<T, BookingAggregateArgs>): Prisma.PrismaPromise<GetBookingAggregateType<T>>

    /**
     * Group by Booking.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BookingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BookingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BookingGroupByArgs['orderBy'] }
        : { orderBy?: BookingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BookingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBookingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Booking model
   */
  readonly fields: BookingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Booking.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BookingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    eventType<T extends EventTypeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, EventTypeDefaultArgs<ExtArgs>>): Prisma__EventTypeClient<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Booking model
   */
  interface BookingFieldRefs {
    readonly id: FieldRef<"Booking", 'String'>
    readonly uid: FieldRef<"Booking", 'String'>
    readonly title: FieldRef<"Booking", 'String'>
    readonly startTime: FieldRef<"Booking", 'DateTime'>
    readonly endTime: FieldRef<"Booking", 'DateTime'>
    readonly status: FieldRef<"Booking", 'BookingStatus'>
    readonly attendeeName: FieldRef<"Booking", 'String'>
    readonly attendeeEmail: FieldRef<"Booking", 'String'>
    readonly attendeeTimezone: FieldRef<"Booking", 'String'>
    readonly attendeeNotes: FieldRef<"Booking", 'String'>
    readonly meetingUrl: FieldRef<"Booking", 'String'>
    readonly location: FieldRef<"Booking", 'String'>
    readonly responses: FieldRef<"Booking", 'Json'>
    readonly cancellationReason: FieldRef<"Booking", 'String'>
    readonly recurringEventId: FieldRef<"Booking", 'String'>
    readonly calendarEventId: FieldRef<"Booking", 'String'>
    readonly createdAt: FieldRef<"Booking", 'DateTime'>
    readonly updatedAt: FieldRef<"Booking", 'DateTime'>
    readonly userId: FieldRef<"Booking", 'String'>
    readonly eventTypeId: FieldRef<"Booking", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Booking findUnique
   */
  export type BookingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findUniqueOrThrow
   */
  export type BookingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking findFirst
   */
  export type BookingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findFirstOrThrow
   */
  export type BookingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Booking to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking findMany
   */
  export type BookingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter, which Bookings to fetch.
     */
    where?: BookingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bookings to fetch.
     */
    orderBy?: BookingOrderByWithRelationInput | BookingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bookings.
     */
    cursor?: BookingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bookings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bookings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bookings.
     */
    distinct?: BookingScalarFieldEnum | BookingScalarFieldEnum[]
  }

  /**
   * Booking create
   */
  export type BookingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to create a Booking.
     */
    data: XOR<BookingCreateInput, BookingUncheckedCreateInput>
  }

  /**
   * Booking createMany
   */
  export type BookingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Booking createManyAndReturn
   */
  export type BookingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to create many Bookings.
     */
    data: BookingCreateManyInput | BookingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking update
   */
  export type BookingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The data needed to update a Booking.
     */
    data: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
    /**
     * Choose, which Booking to update.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking updateMany
   */
  export type BookingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
  }

  /**
   * Booking updateManyAndReturn
   */
  export type BookingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * The data used to update Bookings.
     */
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyInput>
    /**
     * Filter which Bookings to update
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Booking upsert
   */
  export type BookingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * The filter to search for the Booking to update in case it exists.
     */
    where: BookingWhereUniqueInput
    /**
     * In case the Booking found by the `where` argument doesn't exist, create a new Booking with this data.
     */
    create: XOR<BookingCreateInput, BookingUncheckedCreateInput>
    /**
     * In case the Booking was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BookingUpdateInput, BookingUncheckedUpdateInput>
  }

  /**
   * Booking delete
   */
  export type BookingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
    /**
     * Filter which Booking to delete.
     */
    where: BookingWhereUniqueInput
  }

  /**
   * Booking deleteMany
   */
  export type BookingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bookings to delete
     */
    where?: BookingWhereInput
    /**
     * Limit how many Bookings to delete.
     */
    limit?: number
  }

  /**
   * Booking without action
   */
  export type BookingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Booking
     */
    select?: BookingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Booking
     */
    omit?: BookingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BookingInclude<ExtArgs> | null
  }


  /**
   * Model Schedule
   */

  export type AggregateSchedule = {
    _count: ScheduleCountAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  export type ScheduleMinAggregateOutputType = {
    id: string | null
    name: string | null
    isDefault: boolean | null
    timezone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ScheduleMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isDefault: boolean | null
    timezone: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type ScheduleCountAggregateOutputType = {
    id: number
    name: number
    isDefault: number
    timezone: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type ScheduleMinAggregateInputType = {
    id?: true
    name?: true
    isDefault?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ScheduleMaxAggregateInputType = {
    id?: true
    name?: true
    isDefault?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type ScheduleCountAggregateInputType = {
    id?: true
    name?: true
    isDefault?: true
    timezone?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type ScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedule to aggregate.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Schedules
    **/
    _count?: true | ScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ScheduleMaxAggregateInputType
  }

  export type GetScheduleAggregateType<T extends ScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSchedule[P]>
      : GetScalarType<T[P], AggregateSchedule[P]>
  }




  export type ScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ScheduleWhereInput
    orderBy?: ScheduleOrderByWithAggregationInput | ScheduleOrderByWithAggregationInput[]
    by: ScheduleScalarFieldEnum[] | ScheduleScalarFieldEnum
    having?: ScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ScheduleCountAggregateInputType | true
    _min?: ScheduleMinAggregateInputType
    _max?: ScheduleMaxAggregateInputType
  }

  export type ScheduleGroupByOutputType = {
    id: string
    name: string
    isDefault: boolean
    timezone: string
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: ScheduleCountAggregateOutputType | null
    _min: ScheduleMinAggregateOutputType | null
    _max: ScheduleMaxAggregateOutputType | null
  }

  type GetScheduleGroupByPayload<T extends ScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], ScheduleGroupByOutputType[P]>
        }
      >
    >


  export type ScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isDefault?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    availabilities?: boolean | Schedule$availabilitiesArgs<ExtArgs>
    dateOverrides?: boolean | Schedule$dateOverridesArgs<ExtArgs>
    eventTypes?: boolean | Schedule$eventTypesArgs<ExtArgs>
    _count?: boolean | ScheduleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isDefault?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isDefault?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["schedule"]>

  export type ScheduleSelectScalar = {
    id?: boolean
    name?: boolean
    isDefault?: boolean
    timezone?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type ScheduleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "isDefault" | "timezone" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["schedule"]>
  export type ScheduleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    availabilities?: boolean | Schedule$availabilitiesArgs<ExtArgs>
    dateOverrides?: boolean | Schedule$dateOverridesArgs<ExtArgs>
    eventTypes?: boolean | Schedule$eventTypesArgs<ExtArgs>
    _count?: boolean | ScheduleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ScheduleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type ScheduleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Schedule"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      availabilities: Prisma.$AvailabilityPayload<ExtArgs>[]
      dateOverrides: Prisma.$DateOverridePayload<ExtArgs>[]
      eventTypes: Prisma.$EventTypePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isDefault: boolean
      timezone: string
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["schedule"]>
    composites: {}
  }

  type ScheduleGetPayload<S extends boolean | null | undefined | ScheduleDefaultArgs> = $Result.GetResult<Prisma.$SchedulePayload, S>

  type ScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ScheduleCountAggregateInputType | true
    }

  export interface ScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Schedule'], meta: { name: 'Schedule' } }
    /**
     * Find zero or one Schedule that matches the filter.
     * @param {ScheduleFindUniqueArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScheduleFindUniqueArgs>(args: SelectSubset<T, ScheduleFindUniqueArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Schedule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScheduleFindUniqueOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, ScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Schedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScheduleFindFirstArgs>(args?: SelectSubset<T, ScheduleFindFirstArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Schedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindFirstOrThrowArgs} args - Arguments to find a Schedule
     * @example
     * // Get one Schedule
     * const schedule = await prisma.schedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, ScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Schedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Schedules
     * const schedules = await prisma.schedule.findMany()
     * 
     * // Get first 10 Schedules
     * const schedules = await prisma.schedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const scheduleWithIdOnly = await prisma.schedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ScheduleFindManyArgs>(args?: SelectSubset<T, ScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Schedule.
     * @param {ScheduleCreateArgs} args - Arguments to create a Schedule.
     * @example
     * // Create one Schedule
     * const Schedule = await prisma.schedule.create({
     *   data: {
     *     // ... data to create a Schedule
     *   }
     * })
     * 
     */
    create<T extends ScheduleCreateArgs>(args: SelectSubset<T, ScheduleCreateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Schedules.
     * @param {ScheduleCreateManyArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ScheduleCreateManyArgs>(args?: SelectSubset<T, ScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Schedules and returns the data saved in the database.
     * @param {ScheduleCreateManyAndReturnArgs} args - Arguments to create many Schedules.
     * @example
     * // Create many Schedules
     * const schedule = await prisma.schedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Schedules and only return the `id`
     * const scheduleWithIdOnly = await prisma.schedule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, ScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Schedule.
     * @param {ScheduleDeleteArgs} args - Arguments to delete one Schedule.
     * @example
     * // Delete one Schedule
     * const Schedule = await prisma.schedule.delete({
     *   where: {
     *     // ... filter to delete one Schedule
     *   }
     * })
     * 
     */
    delete<T extends ScheduleDeleteArgs>(args: SelectSubset<T, ScheduleDeleteArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Schedule.
     * @param {ScheduleUpdateArgs} args - Arguments to update one Schedule.
     * @example
     * // Update one Schedule
     * const schedule = await prisma.schedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ScheduleUpdateArgs>(args: SelectSubset<T, ScheduleUpdateArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Schedules.
     * @param {ScheduleDeleteManyArgs} args - Arguments to filter Schedules to delete.
     * @example
     * // Delete a few Schedules
     * const { count } = await prisma.schedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ScheduleDeleteManyArgs>(args?: SelectSubset<T, ScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Schedules
     * const schedule = await prisma.schedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ScheduleUpdateManyArgs>(args: SelectSubset<T, ScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Schedules and returns the data updated in the database.
     * @param {ScheduleUpdateManyAndReturnArgs} args - Arguments to update many Schedules.
     * @example
     * // Update many Schedules
     * const schedule = await prisma.schedule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Schedules and only return the `id`
     * const scheduleWithIdOnly = await prisma.schedule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ScheduleUpdateManyAndReturnArgs>(args: SelectSubset<T, ScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Schedule.
     * @param {ScheduleUpsertArgs} args - Arguments to update or create a Schedule.
     * @example
     * // Update or create a Schedule
     * const schedule = await prisma.schedule.upsert({
     *   create: {
     *     // ... data to create a Schedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Schedule we want to update
     *   }
     * })
     */
    upsert<T extends ScheduleUpsertArgs>(args: SelectSubset<T, ScheduleUpsertArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Schedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleCountArgs} args - Arguments to filter Schedules to count.
     * @example
     * // Count the number of Schedules
     * const count = await prisma.schedule.count({
     *   where: {
     *     // ... the filter for the Schedules we want to count
     *   }
     * })
    **/
    count<T extends ScheduleCountArgs>(
      args?: Subset<T, ScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ScheduleAggregateArgs>(args: Subset<T, ScheduleAggregateArgs>): Prisma.PrismaPromise<GetScheduleAggregateType<T>>

    /**
     * Group by Schedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ScheduleGroupByArgs['orderBy'] }
        : { orderBy?: ScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Schedule model
   */
  readonly fields: ScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Schedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    availabilities<T extends Schedule$availabilitiesArgs<ExtArgs> = {}>(args?: Subset<T, Schedule$availabilitiesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dateOverrides<T extends Schedule$dateOverridesArgs<ExtArgs> = {}>(args?: Subset<T, Schedule$dateOverridesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    eventTypes<T extends Schedule$eventTypesArgs<ExtArgs> = {}>(args?: Subset<T, Schedule$eventTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Schedule model
   */
  interface ScheduleFieldRefs {
    readonly id: FieldRef<"Schedule", 'String'>
    readonly name: FieldRef<"Schedule", 'String'>
    readonly isDefault: FieldRef<"Schedule", 'Boolean'>
    readonly timezone: FieldRef<"Schedule", 'String'>
    readonly createdAt: FieldRef<"Schedule", 'DateTime'>
    readonly updatedAt: FieldRef<"Schedule", 'DateTime'>
    readonly userId: FieldRef<"Schedule", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Schedule findUnique
   */
  export type ScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findUniqueOrThrow
   */
  export type ScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule findFirst
   */
  export type ScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findFirstOrThrow
   */
  export type ScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedule to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule findMany
   */
  export type ScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter, which Schedules to fetch.
     */
    where?: ScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Schedules to fetch.
     */
    orderBy?: ScheduleOrderByWithRelationInput | ScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Schedules.
     */
    cursor?: ScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Schedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Schedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Schedules.
     */
    distinct?: ScheduleScalarFieldEnum | ScheduleScalarFieldEnum[]
  }

  /**
   * Schedule create
   */
  export type ScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to create a Schedule.
     */
    data: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
  }

  /**
   * Schedule createMany
   */
  export type ScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Schedule createManyAndReturn
   */
  export type ScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * The data used to create many Schedules.
     */
    data: ScheduleCreateManyInput | ScheduleCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Schedule update
   */
  export type ScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The data needed to update a Schedule.
     */
    data: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
    /**
     * Choose, which Schedule to update.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule updateMany
   */
  export type ScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Schedules.
     */
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyInput>
    /**
     * Filter which Schedules to update
     */
    where?: ScheduleWhereInput
    /**
     * Limit how many Schedules to update.
     */
    limit?: number
  }

  /**
   * Schedule updateManyAndReturn
   */
  export type ScheduleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * The data used to update Schedules.
     */
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyInput>
    /**
     * Filter which Schedules to update
     */
    where?: ScheduleWhereInput
    /**
     * Limit how many Schedules to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Schedule upsert
   */
  export type ScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * The filter to search for the Schedule to update in case it exists.
     */
    where: ScheduleWhereUniqueInput
    /**
     * In case the Schedule found by the `where` argument doesn't exist, create a new Schedule with this data.
     */
    create: XOR<ScheduleCreateInput, ScheduleUncheckedCreateInput>
    /**
     * In case the Schedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ScheduleUpdateInput, ScheduleUncheckedUpdateInput>
  }

  /**
   * Schedule delete
   */
  export type ScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
    /**
     * Filter which Schedule to delete.
     */
    where: ScheduleWhereUniqueInput
  }

  /**
   * Schedule deleteMany
   */
  export type ScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Schedules to delete
     */
    where?: ScheduleWhereInput
    /**
     * Limit how many Schedules to delete.
     */
    limit?: number
  }

  /**
   * Schedule.availabilities
   */
  export type Schedule$availabilitiesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    where?: AvailabilityWhereInput
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    cursor?: AvailabilityWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Schedule.dateOverrides
   */
  export type Schedule$dateOverridesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    where?: DateOverrideWhereInput
    orderBy?: DateOverrideOrderByWithRelationInput | DateOverrideOrderByWithRelationInput[]
    cursor?: DateOverrideWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DateOverrideScalarFieldEnum | DateOverrideScalarFieldEnum[]
  }

  /**
   * Schedule.eventTypes
   */
  export type Schedule$eventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    where?: EventTypeWhereInput
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    cursor?: EventTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * Schedule without action
   */
  export type ScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Schedule
     */
    select?: ScheduleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Schedule
     */
    omit?: ScheduleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ScheduleInclude<ExtArgs> | null
  }


  /**
   * Model Availability
   */

  export type AggregateAvailability = {
    _count: AvailabilityCountAggregateOutputType | null
    _avg: AvailabilityAvgAggregateOutputType | null
    _sum: AvailabilitySumAggregateOutputType | null
    _min: AvailabilityMinAggregateOutputType | null
    _max: AvailabilityMaxAggregateOutputType | null
  }

  export type AvailabilityAvgAggregateOutputType = {
    day: number | null
  }

  export type AvailabilitySumAggregateOutputType = {
    day: number | null
  }

  export type AvailabilityMinAggregateOutputType = {
    id: string | null
    day: number | null
    startTime: string | null
    endTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
    scheduleId: string | null
  }

  export type AvailabilityMaxAggregateOutputType = {
    id: string | null
    day: number | null
    startTime: string | null
    endTime: string | null
    createdAt: Date | null
    updatedAt: Date | null
    scheduleId: string | null
  }

  export type AvailabilityCountAggregateOutputType = {
    id: number
    day: number
    startTime: number
    endTime: number
    createdAt: number
    updatedAt: number
    scheduleId: number
    _all: number
  }


  export type AvailabilityAvgAggregateInputType = {
    day?: true
  }

  export type AvailabilitySumAggregateInputType = {
    day?: true
  }

  export type AvailabilityMinAggregateInputType = {
    id?: true
    day?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
  }

  export type AvailabilityMaxAggregateInputType = {
    id?: true
    day?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
  }

  export type AvailabilityCountAggregateInputType = {
    id?: true
    day?: true
    startTime?: true
    endTime?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
    _all?: true
  }

  export type AvailabilityAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Availability to aggregate.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Availabilities
    **/
    _count?: true | AvailabilityCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AvailabilityAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AvailabilitySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AvailabilityMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AvailabilityMaxAggregateInputType
  }

  export type GetAvailabilityAggregateType<T extends AvailabilityAggregateArgs> = {
        [P in keyof T & keyof AggregateAvailability]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAvailability[P]>
      : GetScalarType<T[P], AggregateAvailability[P]>
  }




  export type AvailabilityGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AvailabilityWhereInput
    orderBy?: AvailabilityOrderByWithAggregationInput | AvailabilityOrderByWithAggregationInput[]
    by: AvailabilityScalarFieldEnum[] | AvailabilityScalarFieldEnum
    having?: AvailabilityScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AvailabilityCountAggregateInputType | true
    _avg?: AvailabilityAvgAggregateInputType
    _sum?: AvailabilitySumAggregateInputType
    _min?: AvailabilityMinAggregateInputType
    _max?: AvailabilityMaxAggregateInputType
  }

  export type AvailabilityGroupByOutputType = {
    id: string
    day: number
    startTime: string
    endTime: string
    createdAt: Date
    updatedAt: Date
    scheduleId: string
    _count: AvailabilityCountAggregateOutputType | null
    _avg: AvailabilityAvgAggregateOutputType | null
    _sum: AvailabilitySumAggregateOutputType | null
    _min: AvailabilityMinAggregateOutputType | null
    _max: AvailabilityMaxAggregateOutputType | null
  }

  type GetAvailabilityGroupByPayload<T extends AvailabilityGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AvailabilityGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AvailabilityGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AvailabilityGroupByOutputType[P]>
            : GetScalarType<T[P], AvailabilityGroupByOutputType[P]>
        }
      >
    >


  export type AvailabilitySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    day?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availability"]>

  export type AvailabilitySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    day?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availability"]>

  export type AvailabilitySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    day?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["availability"]>

  export type AvailabilitySelectScalar = {
    id?: boolean
    day?: boolean
    startTime?: boolean
    endTime?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
  }

  export type AvailabilityOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "day" | "startTime" | "endTime" | "createdAt" | "updatedAt" | "scheduleId", ExtArgs["result"]["availability"]>
  export type AvailabilityInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }
  export type AvailabilityIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }
  export type AvailabilityIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }

  export type $AvailabilityPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Availability"
    objects: {
      schedule: Prisma.$SchedulePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      day: number
      startTime: string
      endTime: string
      createdAt: Date
      updatedAt: Date
      scheduleId: string
    }, ExtArgs["result"]["availability"]>
    composites: {}
  }

  type AvailabilityGetPayload<S extends boolean | null | undefined | AvailabilityDefaultArgs> = $Result.GetResult<Prisma.$AvailabilityPayload, S>

  type AvailabilityCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AvailabilityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AvailabilityCountAggregateInputType | true
    }

  export interface AvailabilityDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Availability'], meta: { name: 'Availability' } }
    /**
     * Find zero or one Availability that matches the filter.
     * @param {AvailabilityFindUniqueArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AvailabilityFindUniqueArgs>(args: SelectSubset<T, AvailabilityFindUniqueArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Availability that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AvailabilityFindUniqueOrThrowArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AvailabilityFindUniqueOrThrowArgs>(args: SelectSubset<T, AvailabilityFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Availability that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindFirstArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AvailabilityFindFirstArgs>(args?: SelectSubset<T, AvailabilityFindFirstArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Availability that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindFirstOrThrowArgs} args - Arguments to find a Availability
     * @example
     * // Get one Availability
     * const availability = await prisma.availability.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AvailabilityFindFirstOrThrowArgs>(args?: SelectSubset<T, AvailabilityFindFirstOrThrowArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Availabilities that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Availabilities
     * const availabilities = await prisma.availability.findMany()
     * 
     * // Get first 10 Availabilities
     * const availabilities = await prisma.availability.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const availabilityWithIdOnly = await prisma.availability.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AvailabilityFindManyArgs>(args?: SelectSubset<T, AvailabilityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Availability.
     * @param {AvailabilityCreateArgs} args - Arguments to create a Availability.
     * @example
     * // Create one Availability
     * const Availability = await prisma.availability.create({
     *   data: {
     *     // ... data to create a Availability
     *   }
     * })
     * 
     */
    create<T extends AvailabilityCreateArgs>(args: SelectSubset<T, AvailabilityCreateArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Availabilities.
     * @param {AvailabilityCreateManyArgs} args - Arguments to create many Availabilities.
     * @example
     * // Create many Availabilities
     * const availability = await prisma.availability.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AvailabilityCreateManyArgs>(args?: SelectSubset<T, AvailabilityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Availabilities and returns the data saved in the database.
     * @param {AvailabilityCreateManyAndReturnArgs} args - Arguments to create many Availabilities.
     * @example
     * // Create many Availabilities
     * const availability = await prisma.availability.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Availabilities and only return the `id`
     * const availabilityWithIdOnly = await prisma.availability.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AvailabilityCreateManyAndReturnArgs>(args?: SelectSubset<T, AvailabilityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Availability.
     * @param {AvailabilityDeleteArgs} args - Arguments to delete one Availability.
     * @example
     * // Delete one Availability
     * const Availability = await prisma.availability.delete({
     *   where: {
     *     // ... filter to delete one Availability
     *   }
     * })
     * 
     */
    delete<T extends AvailabilityDeleteArgs>(args: SelectSubset<T, AvailabilityDeleteArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Availability.
     * @param {AvailabilityUpdateArgs} args - Arguments to update one Availability.
     * @example
     * // Update one Availability
     * const availability = await prisma.availability.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AvailabilityUpdateArgs>(args: SelectSubset<T, AvailabilityUpdateArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Availabilities.
     * @param {AvailabilityDeleteManyArgs} args - Arguments to filter Availabilities to delete.
     * @example
     * // Delete a few Availabilities
     * const { count } = await prisma.availability.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AvailabilityDeleteManyArgs>(args?: SelectSubset<T, AvailabilityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Availabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Availabilities
     * const availability = await prisma.availability.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AvailabilityUpdateManyArgs>(args: SelectSubset<T, AvailabilityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Availabilities and returns the data updated in the database.
     * @param {AvailabilityUpdateManyAndReturnArgs} args - Arguments to update many Availabilities.
     * @example
     * // Update many Availabilities
     * const availability = await prisma.availability.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Availabilities and only return the `id`
     * const availabilityWithIdOnly = await prisma.availability.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AvailabilityUpdateManyAndReturnArgs>(args: SelectSubset<T, AvailabilityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Availability.
     * @param {AvailabilityUpsertArgs} args - Arguments to update or create a Availability.
     * @example
     * // Update or create a Availability
     * const availability = await prisma.availability.upsert({
     *   create: {
     *     // ... data to create a Availability
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Availability we want to update
     *   }
     * })
     */
    upsert<T extends AvailabilityUpsertArgs>(args: SelectSubset<T, AvailabilityUpsertArgs<ExtArgs>>): Prisma__AvailabilityClient<$Result.GetResult<Prisma.$AvailabilityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Availabilities.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityCountArgs} args - Arguments to filter Availabilities to count.
     * @example
     * // Count the number of Availabilities
     * const count = await prisma.availability.count({
     *   where: {
     *     // ... the filter for the Availabilities we want to count
     *   }
     * })
    **/
    count<T extends AvailabilityCountArgs>(
      args?: Subset<T, AvailabilityCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AvailabilityCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Availability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AvailabilityAggregateArgs>(args: Subset<T, AvailabilityAggregateArgs>): Prisma.PrismaPromise<GetAvailabilityAggregateType<T>>

    /**
     * Group by Availability.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AvailabilityGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AvailabilityGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AvailabilityGroupByArgs['orderBy'] }
        : { orderBy?: AvailabilityGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AvailabilityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAvailabilityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Availability model
   */
  readonly fields: AvailabilityFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Availability.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AvailabilityClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    schedule<T extends ScheduleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ScheduleDefaultArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Availability model
   */
  interface AvailabilityFieldRefs {
    readonly id: FieldRef<"Availability", 'String'>
    readonly day: FieldRef<"Availability", 'Int'>
    readonly startTime: FieldRef<"Availability", 'String'>
    readonly endTime: FieldRef<"Availability", 'String'>
    readonly createdAt: FieldRef<"Availability", 'DateTime'>
    readonly updatedAt: FieldRef<"Availability", 'DateTime'>
    readonly scheduleId: FieldRef<"Availability", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Availability findUnique
   */
  export type AvailabilityFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability findUniqueOrThrow
   */
  export type AvailabilityFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability findFirst
   */
  export type AvailabilityFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Availabilities.
     */
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability findFirstOrThrow
   */
  export type AvailabilityFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availability to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Availabilities.
     */
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability findMany
   */
  export type AvailabilityFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter, which Availabilities to fetch.
     */
    where?: AvailabilityWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Availabilities to fetch.
     */
    orderBy?: AvailabilityOrderByWithRelationInput | AvailabilityOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Availabilities.
     */
    cursor?: AvailabilityWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Availabilities from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Availabilities.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Availabilities.
     */
    distinct?: AvailabilityScalarFieldEnum | AvailabilityScalarFieldEnum[]
  }

  /**
   * Availability create
   */
  export type AvailabilityCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to create a Availability.
     */
    data: XOR<AvailabilityCreateInput, AvailabilityUncheckedCreateInput>
  }

  /**
   * Availability createMany
   */
  export type AvailabilityCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Availabilities.
     */
    data: AvailabilityCreateManyInput | AvailabilityCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Availability createManyAndReturn
   */
  export type AvailabilityCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * The data used to create many Availabilities.
     */
    data: AvailabilityCreateManyInput | AvailabilityCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Availability update
   */
  export type AvailabilityUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The data needed to update a Availability.
     */
    data: XOR<AvailabilityUpdateInput, AvailabilityUncheckedUpdateInput>
    /**
     * Choose, which Availability to update.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability updateMany
   */
  export type AvailabilityUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Availabilities.
     */
    data: XOR<AvailabilityUpdateManyMutationInput, AvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which Availabilities to update
     */
    where?: AvailabilityWhereInput
    /**
     * Limit how many Availabilities to update.
     */
    limit?: number
  }

  /**
   * Availability updateManyAndReturn
   */
  export type AvailabilityUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * The data used to update Availabilities.
     */
    data: XOR<AvailabilityUpdateManyMutationInput, AvailabilityUncheckedUpdateManyInput>
    /**
     * Filter which Availabilities to update
     */
    where?: AvailabilityWhereInput
    /**
     * Limit how many Availabilities to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Availability upsert
   */
  export type AvailabilityUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * The filter to search for the Availability to update in case it exists.
     */
    where: AvailabilityWhereUniqueInput
    /**
     * In case the Availability found by the `where` argument doesn't exist, create a new Availability with this data.
     */
    create: XOR<AvailabilityCreateInput, AvailabilityUncheckedCreateInput>
    /**
     * In case the Availability was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AvailabilityUpdateInput, AvailabilityUncheckedUpdateInput>
  }

  /**
   * Availability delete
   */
  export type AvailabilityDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
    /**
     * Filter which Availability to delete.
     */
    where: AvailabilityWhereUniqueInput
  }

  /**
   * Availability deleteMany
   */
  export type AvailabilityDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Availabilities to delete
     */
    where?: AvailabilityWhereInput
    /**
     * Limit how many Availabilities to delete.
     */
    limit?: number
  }

  /**
   * Availability without action
   */
  export type AvailabilityDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Availability
     */
    select?: AvailabilitySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Availability
     */
    omit?: AvailabilityOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AvailabilityInclude<ExtArgs> | null
  }


  /**
   * Model DateOverride
   */

  export type AggregateDateOverride = {
    _count: DateOverrideCountAggregateOutputType | null
    _min: DateOverrideMinAggregateOutputType | null
    _max: DateOverrideMaxAggregateOutputType | null
  }

  export type DateOverrideMinAggregateOutputType = {
    id: string | null
    date: Date | null
    startTime: string | null
    endTime: string | null
    isUnavailable: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    scheduleId: string | null
  }

  export type DateOverrideMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    startTime: string | null
    endTime: string | null
    isUnavailable: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    scheduleId: string | null
  }

  export type DateOverrideCountAggregateOutputType = {
    id: number
    date: number
    startTime: number
    endTime: number
    isUnavailable: number
    createdAt: number
    updatedAt: number
    scheduleId: number
    _all: number
  }


  export type DateOverrideMinAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    isUnavailable?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
  }

  export type DateOverrideMaxAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    isUnavailable?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
  }

  export type DateOverrideCountAggregateInputType = {
    id?: true
    date?: true
    startTime?: true
    endTime?: true
    isUnavailable?: true
    createdAt?: true
    updatedAt?: true
    scheduleId?: true
    _all?: true
  }

  export type DateOverrideAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DateOverride to aggregate.
     */
    where?: DateOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DateOverrides to fetch.
     */
    orderBy?: DateOverrideOrderByWithRelationInput | DateOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DateOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DateOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DateOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DateOverrides
    **/
    _count?: true | DateOverrideCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DateOverrideMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DateOverrideMaxAggregateInputType
  }

  export type GetDateOverrideAggregateType<T extends DateOverrideAggregateArgs> = {
        [P in keyof T & keyof AggregateDateOverride]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDateOverride[P]>
      : GetScalarType<T[P], AggregateDateOverride[P]>
  }




  export type DateOverrideGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DateOverrideWhereInput
    orderBy?: DateOverrideOrderByWithAggregationInput | DateOverrideOrderByWithAggregationInput[]
    by: DateOverrideScalarFieldEnum[] | DateOverrideScalarFieldEnum
    having?: DateOverrideScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DateOverrideCountAggregateInputType | true
    _min?: DateOverrideMinAggregateInputType
    _max?: DateOverrideMaxAggregateInputType
  }

  export type DateOverrideGroupByOutputType = {
    id: string
    date: Date
    startTime: string | null
    endTime: string | null
    isUnavailable: boolean
    createdAt: Date
    updatedAt: Date
    scheduleId: string
    _count: DateOverrideCountAggregateOutputType | null
    _min: DateOverrideMinAggregateOutputType | null
    _max: DateOverrideMaxAggregateOutputType | null
  }

  type GetDateOverrideGroupByPayload<T extends DateOverrideGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DateOverrideGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DateOverrideGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DateOverrideGroupByOutputType[P]>
            : GetScalarType<T[P], DateOverrideGroupByOutputType[P]>
        }
      >
    >


  export type DateOverrideSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    isUnavailable?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dateOverride"]>

  export type DateOverrideSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    isUnavailable?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dateOverride"]>

  export type DateOverrideSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    isUnavailable?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dateOverride"]>

  export type DateOverrideSelectScalar = {
    id?: boolean
    date?: boolean
    startTime?: boolean
    endTime?: boolean
    isUnavailable?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    scheduleId?: boolean
  }

  export type DateOverrideOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "startTime" | "endTime" | "isUnavailable" | "createdAt" | "updatedAt" | "scheduleId", ExtArgs["result"]["dateOverride"]>
  export type DateOverrideInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }
  export type DateOverrideIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }
  export type DateOverrideIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    schedule?: boolean | ScheduleDefaultArgs<ExtArgs>
  }

  export type $DateOverridePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DateOverride"
    objects: {
      schedule: Prisma.$SchedulePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      startTime: string | null
      endTime: string | null
      isUnavailable: boolean
      createdAt: Date
      updatedAt: Date
      scheduleId: string
    }, ExtArgs["result"]["dateOverride"]>
    composites: {}
  }

  type DateOverrideGetPayload<S extends boolean | null | undefined | DateOverrideDefaultArgs> = $Result.GetResult<Prisma.$DateOverridePayload, S>

  type DateOverrideCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DateOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DateOverrideCountAggregateInputType | true
    }

  export interface DateOverrideDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DateOverride'], meta: { name: 'DateOverride' } }
    /**
     * Find zero or one DateOverride that matches the filter.
     * @param {DateOverrideFindUniqueArgs} args - Arguments to find a DateOverride
     * @example
     * // Get one DateOverride
     * const dateOverride = await prisma.dateOverride.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DateOverrideFindUniqueArgs>(args: SelectSubset<T, DateOverrideFindUniqueArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DateOverride that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DateOverrideFindUniqueOrThrowArgs} args - Arguments to find a DateOverride
     * @example
     * // Get one DateOverride
     * const dateOverride = await prisma.dateOverride.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DateOverrideFindUniqueOrThrowArgs>(args: SelectSubset<T, DateOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DateOverride that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideFindFirstArgs} args - Arguments to find a DateOverride
     * @example
     * // Get one DateOverride
     * const dateOverride = await prisma.dateOverride.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DateOverrideFindFirstArgs>(args?: SelectSubset<T, DateOverrideFindFirstArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DateOverride that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideFindFirstOrThrowArgs} args - Arguments to find a DateOverride
     * @example
     * // Get one DateOverride
     * const dateOverride = await prisma.dateOverride.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DateOverrideFindFirstOrThrowArgs>(args?: SelectSubset<T, DateOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DateOverrides that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DateOverrides
     * const dateOverrides = await prisma.dateOverride.findMany()
     * 
     * // Get first 10 DateOverrides
     * const dateOverrides = await prisma.dateOverride.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dateOverrideWithIdOnly = await prisma.dateOverride.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DateOverrideFindManyArgs>(args?: SelectSubset<T, DateOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DateOverride.
     * @param {DateOverrideCreateArgs} args - Arguments to create a DateOverride.
     * @example
     * // Create one DateOverride
     * const DateOverride = await prisma.dateOverride.create({
     *   data: {
     *     // ... data to create a DateOverride
     *   }
     * })
     * 
     */
    create<T extends DateOverrideCreateArgs>(args: SelectSubset<T, DateOverrideCreateArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DateOverrides.
     * @param {DateOverrideCreateManyArgs} args - Arguments to create many DateOverrides.
     * @example
     * // Create many DateOverrides
     * const dateOverride = await prisma.dateOverride.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DateOverrideCreateManyArgs>(args?: SelectSubset<T, DateOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DateOverrides and returns the data saved in the database.
     * @param {DateOverrideCreateManyAndReturnArgs} args - Arguments to create many DateOverrides.
     * @example
     * // Create many DateOverrides
     * const dateOverride = await prisma.dateOverride.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DateOverrides and only return the `id`
     * const dateOverrideWithIdOnly = await prisma.dateOverride.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DateOverrideCreateManyAndReturnArgs>(args?: SelectSubset<T, DateOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DateOverride.
     * @param {DateOverrideDeleteArgs} args - Arguments to delete one DateOverride.
     * @example
     * // Delete one DateOverride
     * const DateOverride = await prisma.dateOverride.delete({
     *   where: {
     *     // ... filter to delete one DateOverride
     *   }
     * })
     * 
     */
    delete<T extends DateOverrideDeleteArgs>(args: SelectSubset<T, DateOverrideDeleteArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DateOverride.
     * @param {DateOverrideUpdateArgs} args - Arguments to update one DateOverride.
     * @example
     * // Update one DateOverride
     * const dateOverride = await prisma.dateOverride.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DateOverrideUpdateArgs>(args: SelectSubset<T, DateOverrideUpdateArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DateOverrides.
     * @param {DateOverrideDeleteManyArgs} args - Arguments to filter DateOverrides to delete.
     * @example
     * // Delete a few DateOverrides
     * const { count } = await prisma.dateOverride.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DateOverrideDeleteManyArgs>(args?: SelectSubset<T, DateOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DateOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DateOverrides
     * const dateOverride = await prisma.dateOverride.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DateOverrideUpdateManyArgs>(args: SelectSubset<T, DateOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DateOverrides and returns the data updated in the database.
     * @param {DateOverrideUpdateManyAndReturnArgs} args - Arguments to update many DateOverrides.
     * @example
     * // Update many DateOverrides
     * const dateOverride = await prisma.dateOverride.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DateOverrides and only return the `id`
     * const dateOverrideWithIdOnly = await prisma.dateOverride.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DateOverrideUpdateManyAndReturnArgs>(args: SelectSubset<T, DateOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DateOverride.
     * @param {DateOverrideUpsertArgs} args - Arguments to update or create a DateOverride.
     * @example
     * // Update or create a DateOverride
     * const dateOverride = await prisma.dateOverride.upsert({
     *   create: {
     *     // ... data to create a DateOverride
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DateOverride we want to update
     *   }
     * })
     */
    upsert<T extends DateOverrideUpsertArgs>(args: SelectSubset<T, DateOverrideUpsertArgs<ExtArgs>>): Prisma__DateOverrideClient<$Result.GetResult<Prisma.$DateOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DateOverrides.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideCountArgs} args - Arguments to filter DateOverrides to count.
     * @example
     * // Count the number of DateOverrides
     * const count = await prisma.dateOverride.count({
     *   where: {
     *     // ... the filter for the DateOverrides we want to count
     *   }
     * })
    **/
    count<T extends DateOverrideCountArgs>(
      args?: Subset<T, DateOverrideCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DateOverrideCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DateOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DateOverrideAggregateArgs>(args: Subset<T, DateOverrideAggregateArgs>): Prisma.PrismaPromise<GetDateOverrideAggregateType<T>>

    /**
     * Group by DateOverride.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DateOverrideGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DateOverrideGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DateOverrideGroupByArgs['orderBy'] }
        : { orderBy?: DateOverrideGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DateOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDateOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DateOverride model
   */
  readonly fields: DateOverrideFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DateOverride.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DateOverrideClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    schedule<T extends ScheduleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ScheduleDefaultArgs<ExtArgs>>): Prisma__ScheduleClient<$Result.GetResult<Prisma.$SchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DateOverride model
   */
  interface DateOverrideFieldRefs {
    readonly id: FieldRef<"DateOverride", 'String'>
    readonly date: FieldRef<"DateOverride", 'DateTime'>
    readonly startTime: FieldRef<"DateOverride", 'String'>
    readonly endTime: FieldRef<"DateOverride", 'String'>
    readonly isUnavailable: FieldRef<"DateOverride", 'Boolean'>
    readonly createdAt: FieldRef<"DateOverride", 'DateTime'>
    readonly updatedAt: FieldRef<"DateOverride", 'DateTime'>
    readonly scheduleId: FieldRef<"DateOverride", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DateOverride findUnique
   */
  export type DateOverrideFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter, which DateOverride to fetch.
     */
    where: DateOverrideWhereUniqueInput
  }

  /**
   * DateOverride findUniqueOrThrow
   */
  export type DateOverrideFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter, which DateOverride to fetch.
     */
    where: DateOverrideWhereUniqueInput
  }

  /**
   * DateOverride findFirst
   */
  export type DateOverrideFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter, which DateOverride to fetch.
     */
    where?: DateOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DateOverrides to fetch.
     */
    orderBy?: DateOverrideOrderByWithRelationInput | DateOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DateOverrides.
     */
    cursor?: DateOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DateOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DateOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DateOverrides.
     */
    distinct?: DateOverrideScalarFieldEnum | DateOverrideScalarFieldEnum[]
  }

  /**
   * DateOverride findFirstOrThrow
   */
  export type DateOverrideFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter, which DateOverride to fetch.
     */
    where?: DateOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DateOverrides to fetch.
     */
    orderBy?: DateOverrideOrderByWithRelationInput | DateOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DateOverrides.
     */
    cursor?: DateOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DateOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DateOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DateOverrides.
     */
    distinct?: DateOverrideScalarFieldEnum | DateOverrideScalarFieldEnum[]
  }

  /**
   * DateOverride findMany
   */
  export type DateOverrideFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter, which DateOverrides to fetch.
     */
    where?: DateOverrideWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DateOverrides to fetch.
     */
    orderBy?: DateOverrideOrderByWithRelationInput | DateOverrideOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DateOverrides.
     */
    cursor?: DateOverrideWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DateOverrides from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DateOverrides.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DateOverrides.
     */
    distinct?: DateOverrideScalarFieldEnum | DateOverrideScalarFieldEnum[]
  }

  /**
   * DateOverride create
   */
  export type DateOverrideCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * The data needed to create a DateOverride.
     */
    data: XOR<DateOverrideCreateInput, DateOverrideUncheckedCreateInput>
  }

  /**
   * DateOverride createMany
   */
  export type DateOverrideCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DateOverrides.
     */
    data: DateOverrideCreateManyInput | DateOverrideCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DateOverride createManyAndReturn
   */
  export type DateOverrideCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * The data used to create many DateOverrides.
     */
    data: DateOverrideCreateManyInput | DateOverrideCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DateOverride update
   */
  export type DateOverrideUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * The data needed to update a DateOverride.
     */
    data: XOR<DateOverrideUpdateInput, DateOverrideUncheckedUpdateInput>
    /**
     * Choose, which DateOverride to update.
     */
    where: DateOverrideWhereUniqueInput
  }

  /**
   * DateOverride updateMany
   */
  export type DateOverrideUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DateOverrides.
     */
    data: XOR<DateOverrideUpdateManyMutationInput, DateOverrideUncheckedUpdateManyInput>
    /**
     * Filter which DateOverrides to update
     */
    where?: DateOverrideWhereInput
    /**
     * Limit how many DateOverrides to update.
     */
    limit?: number
  }

  /**
   * DateOverride updateManyAndReturn
   */
  export type DateOverrideUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * The data used to update DateOverrides.
     */
    data: XOR<DateOverrideUpdateManyMutationInput, DateOverrideUncheckedUpdateManyInput>
    /**
     * Filter which DateOverrides to update
     */
    where?: DateOverrideWhereInput
    /**
     * Limit how many DateOverrides to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DateOverride upsert
   */
  export type DateOverrideUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * The filter to search for the DateOverride to update in case it exists.
     */
    where: DateOverrideWhereUniqueInput
    /**
     * In case the DateOverride found by the `where` argument doesn't exist, create a new DateOverride with this data.
     */
    create: XOR<DateOverrideCreateInput, DateOverrideUncheckedCreateInput>
    /**
     * In case the DateOverride was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DateOverrideUpdateInput, DateOverrideUncheckedUpdateInput>
  }

  /**
   * DateOverride delete
   */
  export type DateOverrideDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
    /**
     * Filter which DateOverride to delete.
     */
    where: DateOverrideWhereUniqueInput
  }

  /**
   * DateOverride deleteMany
   */
  export type DateOverrideDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DateOverrides to delete
     */
    where?: DateOverrideWhereInput
    /**
     * Limit how many DateOverrides to delete.
     */
    limit?: number
  }

  /**
   * DateOverride without action
   */
  export type DateOverrideDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DateOverride
     */
    select?: DateOverrideSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DateOverride
     */
    omit?: DateOverrideOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DateOverrideInclude<ExtArgs> | null
  }


  /**
   * Model Team
   */

  export type AggregateTeam = {
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  export type TeamMinAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    logoUrl: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamMaxAggregateOutputType = {
    id: string | null
    name: string | null
    slug: string | null
    logoUrl: string | null
    bio: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TeamCountAggregateOutputType = {
    id: number
    name: number
    slug: number
    logoUrl: number
    bio: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TeamMinAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logoUrl?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamMaxAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logoUrl?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TeamCountAggregateInputType = {
    id?: true
    name?: true
    slug?: true
    logoUrl?: true
    bio?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TeamAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Team to aggregate.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Teams
    **/
    _count?: true | TeamCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMaxAggregateInputType
  }

  export type GetTeamAggregateType<T extends TeamAggregateArgs> = {
        [P in keyof T & keyof AggregateTeam]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeam[P]>
      : GetScalarType<T[P], AggregateTeam[P]>
  }




  export type TeamGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamWhereInput
    orderBy?: TeamOrderByWithAggregationInput | TeamOrderByWithAggregationInput[]
    by: TeamScalarFieldEnum[] | TeamScalarFieldEnum
    having?: TeamScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamCountAggregateInputType | true
    _min?: TeamMinAggregateInputType
    _max?: TeamMaxAggregateInputType
  }

  export type TeamGroupByOutputType = {
    id: string
    name: string
    slug: string
    logoUrl: string | null
    bio: string | null
    createdAt: Date
    updatedAt: Date
    _count: TeamCountAggregateOutputType | null
    _min: TeamMinAggregateOutputType | null
    _max: TeamMaxAggregateOutputType | null
  }

  type GetTeamGroupByPayload<T extends TeamGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamGroupByOutputType[P]>
            : GetScalarType<T[P], TeamGroupByOutputType[P]>
        }
      >
    >


  export type TeamSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    logoUrl?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    members?: boolean | Team$membersArgs<ExtArgs>
    eventTypes?: boolean | Team$eventTypesArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["team"]>

  export type TeamSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    logoUrl?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    slug?: boolean
    logoUrl?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["team"]>

  export type TeamSelectScalar = {
    id?: boolean
    name?: boolean
    slug?: boolean
    logoUrl?: boolean
    bio?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TeamOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "slug" | "logoUrl" | "bio" | "createdAt" | "updatedAt", ExtArgs["result"]["team"]>
  export type TeamInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    members?: boolean | Team$membersArgs<ExtArgs>
    eventTypes?: boolean | Team$eventTypesArgs<ExtArgs>
    _count?: boolean | TeamCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TeamIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TeamIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TeamPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Team"
    objects: {
      members: Prisma.$TeamMemberPayload<ExtArgs>[]
      eventTypes: Prisma.$EventTypePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      slug: string
      logoUrl: string | null
      bio: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["team"]>
    composites: {}
  }

  type TeamGetPayload<S extends boolean | null | undefined | TeamDefaultArgs> = $Result.GetResult<Prisma.$TeamPayload, S>

  type TeamCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamCountAggregateInputType | true
    }

  export interface TeamDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Team'], meta: { name: 'Team' } }
    /**
     * Find zero or one Team that matches the filter.
     * @param {TeamFindUniqueArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamFindUniqueArgs>(args: SelectSubset<T, TeamFindUniqueArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Team that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamFindUniqueOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamFindFirstArgs>(args?: SelectSubset<T, TeamFindFirstArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Team that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindFirstOrThrowArgs} args - Arguments to find a Team
     * @example
     * // Get one Team
     * const team = await prisma.team.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Teams that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Teams
     * const teams = await prisma.team.findMany()
     * 
     * // Get first 10 Teams
     * const teams = await prisma.team.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamWithIdOnly = await prisma.team.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamFindManyArgs>(args?: SelectSubset<T, TeamFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Team.
     * @param {TeamCreateArgs} args - Arguments to create a Team.
     * @example
     * // Create one Team
     * const Team = await prisma.team.create({
     *   data: {
     *     // ... data to create a Team
     *   }
     * })
     * 
     */
    create<T extends TeamCreateArgs>(args: SelectSubset<T, TeamCreateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Teams.
     * @param {TeamCreateManyArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamCreateManyArgs>(args?: SelectSubset<T, TeamCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Teams and returns the data saved in the database.
     * @param {TeamCreateManyAndReturnArgs} args - Arguments to create many Teams.
     * @example
     * // Create many Teams
     * const team = await prisma.team.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Team.
     * @param {TeamDeleteArgs} args - Arguments to delete one Team.
     * @example
     * // Delete one Team
     * const Team = await prisma.team.delete({
     *   where: {
     *     // ... filter to delete one Team
     *   }
     * })
     * 
     */
    delete<T extends TeamDeleteArgs>(args: SelectSubset<T, TeamDeleteArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Team.
     * @param {TeamUpdateArgs} args - Arguments to update one Team.
     * @example
     * // Update one Team
     * const team = await prisma.team.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamUpdateArgs>(args: SelectSubset<T, TeamUpdateArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Teams.
     * @param {TeamDeleteManyArgs} args - Arguments to filter Teams to delete.
     * @example
     * // Delete a few Teams
     * const { count } = await prisma.team.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamDeleteManyArgs>(args?: SelectSubset<T, TeamDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamUpdateManyArgs>(args: SelectSubset<T, TeamUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Teams and returns the data updated in the database.
     * @param {TeamUpdateManyAndReturnArgs} args - Arguments to update many Teams.
     * @example
     * // Update many Teams
     * const team = await prisma.team.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Teams and only return the `id`
     * const teamWithIdOnly = await prisma.team.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Team.
     * @param {TeamUpsertArgs} args - Arguments to update or create a Team.
     * @example
     * // Update or create a Team
     * const team = await prisma.team.upsert({
     *   create: {
     *     // ... data to create a Team
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Team we want to update
     *   }
     * })
     */
    upsert<T extends TeamUpsertArgs>(args: SelectSubset<T, TeamUpsertArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Teams.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamCountArgs} args - Arguments to filter Teams to count.
     * @example
     * // Count the number of Teams
     * const count = await prisma.team.count({
     *   where: {
     *     // ... the filter for the Teams we want to count
     *   }
     * })
    **/
    count<T extends TeamCountArgs>(
      args?: Subset<T, TeamCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamAggregateArgs>(args: Subset<T, TeamAggregateArgs>): Prisma.PrismaPromise<GetTeamAggregateType<T>>

    /**
     * Group by Team.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamGroupByArgs['orderBy'] }
        : { orderBy?: TeamGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Team model
   */
  readonly fields: TeamFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Team.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    members<T extends Team$membersArgs<ExtArgs> = {}>(args?: Subset<T, Team$membersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    eventTypes<T extends Team$eventTypesArgs<ExtArgs> = {}>(args?: Subset<T, Team$eventTypesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EventTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Team model
   */
  interface TeamFieldRefs {
    readonly id: FieldRef<"Team", 'String'>
    readonly name: FieldRef<"Team", 'String'>
    readonly slug: FieldRef<"Team", 'String'>
    readonly logoUrl: FieldRef<"Team", 'String'>
    readonly bio: FieldRef<"Team", 'String'>
    readonly createdAt: FieldRef<"Team", 'DateTime'>
    readonly updatedAt: FieldRef<"Team", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Team findUnique
   */
  export type TeamFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findUniqueOrThrow
   */
  export type TeamFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team findFirst
   */
  export type TeamFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findFirstOrThrow
   */
  export type TeamFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Team to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team findMany
   */
  export type TeamFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter, which Teams to fetch.
     */
    where?: TeamWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Teams to fetch.
     */
    orderBy?: TeamOrderByWithRelationInput | TeamOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Teams.
     */
    cursor?: TeamWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Teams from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Teams.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Teams.
     */
    distinct?: TeamScalarFieldEnum | TeamScalarFieldEnum[]
  }

  /**
   * Team create
   */
  export type TeamCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to create a Team.
     */
    data: XOR<TeamCreateInput, TeamUncheckedCreateInput>
  }

  /**
   * Team createMany
   */
  export type TeamCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team createManyAndReturn
   */
  export type TeamCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to create many Teams.
     */
    data: TeamCreateManyInput | TeamCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Team update
   */
  export type TeamUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The data needed to update a Team.
     */
    data: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
    /**
     * Choose, which Team to update.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team updateMany
   */
  export type TeamUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team updateManyAndReturn
   */
  export type TeamUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * The data used to update Teams.
     */
    data: XOR<TeamUpdateManyMutationInput, TeamUncheckedUpdateManyInput>
    /**
     * Filter which Teams to update
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to update.
     */
    limit?: number
  }

  /**
   * Team upsert
   */
  export type TeamUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * The filter to search for the Team to update in case it exists.
     */
    where: TeamWhereUniqueInput
    /**
     * In case the Team found by the `where` argument doesn't exist, create a new Team with this data.
     */
    create: XOR<TeamCreateInput, TeamUncheckedCreateInput>
    /**
     * In case the Team was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamUpdateInput, TeamUncheckedUpdateInput>
  }

  /**
   * Team delete
   */
  export type TeamDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
    /**
     * Filter which Team to delete.
     */
    where: TeamWhereUniqueInput
  }

  /**
   * Team deleteMany
   */
  export type TeamDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Teams to delete
     */
    where?: TeamWhereInput
    /**
     * Limit how many Teams to delete.
     */
    limit?: number
  }

  /**
   * Team.members
   */
  export type Team$membersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    cursor?: TeamMemberWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * Team.eventTypes
   */
  export type Team$eventTypesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EventType
     */
    select?: EventTypeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EventType
     */
    omit?: EventTypeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EventTypeInclude<ExtArgs> | null
    where?: EventTypeWhereInput
    orderBy?: EventTypeOrderByWithRelationInput | EventTypeOrderByWithRelationInput[]
    cursor?: EventTypeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EventTypeScalarFieldEnum | EventTypeScalarFieldEnum[]
  }

  /**
   * Team without action
   */
  export type TeamDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Team
     */
    select?: TeamSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Team
     */
    omit?: TeamOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamInclude<ExtArgs> | null
  }


  /**
   * Model TeamMember
   */

  export type AggregateTeamMember = {
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  export type TeamMemberMinAggregateOutputType = {
    id: string | null
    role: $Enums.TeamRole | null
    accepted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    teamId: string | null
  }

  export type TeamMemberMaxAggregateOutputType = {
    id: string | null
    role: $Enums.TeamRole | null
    accepted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
    teamId: string | null
  }

  export type TeamMemberCountAggregateOutputType = {
    id: number
    role: number
    accepted: number
    createdAt: number
    updatedAt: number
    userId: number
    teamId: number
    _all: number
  }


  export type TeamMemberMinAggregateInputType = {
    id?: true
    role?: true
    accepted?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    teamId?: true
  }

  export type TeamMemberMaxAggregateInputType = {
    id?: true
    role?: true
    accepted?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    teamId?: true
  }

  export type TeamMemberCountAggregateInputType = {
    id?: true
    role?: true
    accepted?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    teamId?: true
    _all?: true
  }

  export type TeamMemberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMember to aggregate.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TeamMembers
    **/
    _count?: true | TeamMemberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TeamMemberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TeamMemberMaxAggregateInputType
  }

  export type GetTeamMemberAggregateType<T extends TeamMemberAggregateArgs> = {
        [P in keyof T & keyof AggregateTeamMember]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTeamMember[P]>
      : GetScalarType<T[P], AggregateTeamMember[P]>
  }




  export type TeamMemberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TeamMemberWhereInput
    orderBy?: TeamMemberOrderByWithAggregationInput | TeamMemberOrderByWithAggregationInput[]
    by: TeamMemberScalarFieldEnum[] | TeamMemberScalarFieldEnum
    having?: TeamMemberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TeamMemberCountAggregateInputType | true
    _min?: TeamMemberMinAggregateInputType
    _max?: TeamMemberMaxAggregateInputType
  }

  export type TeamMemberGroupByOutputType = {
    id: string
    role: $Enums.TeamRole
    accepted: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
    teamId: string
    _count: TeamMemberCountAggregateOutputType | null
    _min: TeamMemberMinAggregateOutputType | null
    _max: TeamMemberMaxAggregateOutputType | null
  }

  type GetTeamMemberGroupByPayload<T extends TeamMemberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TeamMemberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TeamMemberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
            : GetScalarType<T[P], TeamMemberGroupByOutputType[P]>
        }
      >
    >


  export type TeamMemberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    accepted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    teamId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    accepted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    teamId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    role?: boolean
    accepted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    teamId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["teamMember"]>

  export type TeamMemberSelectScalar = {
    id?: boolean
    role?: boolean
    accepted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    teamId?: boolean
  }

  export type TeamMemberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "role" | "accepted" | "createdAt" | "updatedAt" | "userId" | "teamId", ExtArgs["result"]["teamMember"]>
  export type TeamMemberInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }
  export type TeamMemberIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    team?: boolean | TeamDefaultArgs<ExtArgs>
  }

  export type $TeamMemberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TeamMember"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      team: Prisma.$TeamPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      role: $Enums.TeamRole
      accepted: boolean
      createdAt: Date
      updatedAt: Date
      userId: string
      teamId: string
    }, ExtArgs["result"]["teamMember"]>
    composites: {}
  }

  type TeamMemberGetPayload<S extends boolean | null | undefined | TeamMemberDefaultArgs> = $Result.GetResult<Prisma.$TeamMemberPayload, S>

  type TeamMemberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TeamMemberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TeamMemberCountAggregateInputType | true
    }

  export interface TeamMemberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TeamMember'], meta: { name: 'TeamMember' } }
    /**
     * Find zero or one TeamMember that matches the filter.
     * @param {TeamMemberFindUniqueArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TeamMemberFindUniqueArgs>(args: SelectSubset<T, TeamMemberFindUniqueArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TeamMember that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TeamMemberFindUniqueOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TeamMemberFindUniqueOrThrowArgs>(args: SelectSubset<T, TeamMemberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TeamMemberFindFirstArgs>(args?: SelectSubset<T, TeamMemberFindFirstArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TeamMember that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindFirstOrThrowArgs} args - Arguments to find a TeamMember
     * @example
     * // Get one TeamMember
     * const teamMember = await prisma.teamMember.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TeamMemberFindFirstOrThrowArgs>(args?: SelectSubset<T, TeamMemberFindFirstOrThrowArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TeamMembers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TeamMembers
     * const teamMembers = await prisma.teamMember.findMany()
     * 
     * // Get first 10 TeamMembers
     * const teamMembers = await prisma.teamMember.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TeamMemberFindManyArgs>(args?: SelectSubset<T, TeamMemberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TeamMember.
     * @param {TeamMemberCreateArgs} args - Arguments to create a TeamMember.
     * @example
     * // Create one TeamMember
     * const TeamMember = await prisma.teamMember.create({
     *   data: {
     *     // ... data to create a TeamMember
     *   }
     * })
     * 
     */
    create<T extends TeamMemberCreateArgs>(args: SelectSubset<T, TeamMemberCreateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TeamMembers.
     * @param {TeamMemberCreateManyArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TeamMemberCreateManyArgs>(args?: SelectSubset<T, TeamMemberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TeamMembers and returns the data saved in the database.
     * @param {TeamMemberCreateManyAndReturnArgs} args - Arguments to create many TeamMembers.
     * @example
     * // Create many TeamMembers
     * const teamMember = await prisma.teamMember.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TeamMemberCreateManyAndReturnArgs>(args?: SelectSubset<T, TeamMemberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TeamMember.
     * @param {TeamMemberDeleteArgs} args - Arguments to delete one TeamMember.
     * @example
     * // Delete one TeamMember
     * const TeamMember = await prisma.teamMember.delete({
     *   where: {
     *     // ... filter to delete one TeamMember
     *   }
     * })
     * 
     */
    delete<T extends TeamMemberDeleteArgs>(args: SelectSubset<T, TeamMemberDeleteArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TeamMember.
     * @param {TeamMemberUpdateArgs} args - Arguments to update one TeamMember.
     * @example
     * // Update one TeamMember
     * const teamMember = await prisma.teamMember.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TeamMemberUpdateArgs>(args: SelectSubset<T, TeamMemberUpdateArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TeamMembers.
     * @param {TeamMemberDeleteManyArgs} args - Arguments to filter TeamMembers to delete.
     * @example
     * // Delete a few TeamMembers
     * const { count } = await prisma.teamMember.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TeamMemberDeleteManyArgs>(args?: SelectSubset<T, TeamMemberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TeamMemberUpdateManyArgs>(args: SelectSubset<T, TeamMemberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TeamMembers and returns the data updated in the database.
     * @param {TeamMemberUpdateManyAndReturnArgs} args - Arguments to update many TeamMembers.
     * @example
     * // Update many TeamMembers
     * const teamMember = await prisma.teamMember.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TeamMembers and only return the `id`
     * const teamMemberWithIdOnly = await prisma.teamMember.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TeamMemberUpdateManyAndReturnArgs>(args: SelectSubset<T, TeamMemberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TeamMember.
     * @param {TeamMemberUpsertArgs} args - Arguments to update or create a TeamMember.
     * @example
     * // Update or create a TeamMember
     * const teamMember = await prisma.teamMember.upsert({
     *   create: {
     *     // ... data to create a TeamMember
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TeamMember we want to update
     *   }
     * })
     */
    upsert<T extends TeamMemberUpsertArgs>(args: SelectSubset<T, TeamMemberUpsertArgs<ExtArgs>>): Prisma__TeamMemberClient<$Result.GetResult<Prisma.$TeamMemberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TeamMembers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberCountArgs} args - Arguments to filter TeamMembers to count.
     * @example
     * // Count the number of TeamMembers
     * const count = await prisma.teamMember.count({
     *   where: {
     *     // ... the filter for the TeamMembers we want to count
     *   }
     * })
    **/
    count<T extends TeamMemberCountArgs>(
      args?: Subset<T, TeamMemberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TeamMemberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TeamMemberAggregateArgs>(args: Subset<T, TeamMemberAggregateArgs>): Prisma.PrismaPromise<GetTeamMemberAggregateType<T>>

    /**
     * Group by TeamMember.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TeamMemberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TeamMemberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TeamMemberGroupByArgs['orderBy'] }
        : { orderBy?: TeamMemberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TeamMemberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeamMemberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TeamMember model
   */
  readonly fields: TeamMemberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TeamMember.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TeamMemberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    team<T extends TeamDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TeamDefaultArgs<ExtArgs>>): Prisma__TeamClient<$Result.GetResult<Prisma.$TeamPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TeamMember model
   */
  interface TeamMemberFieldRefs {
    readonly id: FieldRef<"TeamMember", 'String'>
    readonly role: FieldRef<"TeamMember", 'TeamRole'>
    readonly accepted: FieldRef<"TeamMember", 'Boolean'>
    readonly createdAt: FieldRef<"TeamMember", 'DateTime'>
    readonly updatedAt: FieldRef<"TeamMember", 'DateTime'>
    readonly userId: FieldRef<"TeamMember", 'String'>
    readonly teamId: FieldRef<"TeamMember", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TeamMember findUnique
   */
  export type TeamMemberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findUniqueOrThrow
   */
  export type TeamMemberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember findFirst
   */
  export type TeamMemberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findFirstOrThrow
   */
  export type TeamMemberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMember to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember findMany
   */
  export type TeamMemberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter, which TeamMembers to fetch.
     */
    where?: TeamMemberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TeamMembers to fetch.
     */
    orderBy?: TeamMemberOrderByWithRelationInput | TeamMemberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TeamMembers.
     */
    cursor?: TeamMemberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TeamMembers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TeamMembers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TeamMembers.
     */
    distinct?: TeamMemberScalarFieldEnum | TeamMemberScalarFieldEnum[]
  }

  /**
   * TeamMember create
   */
  export type TeamMemberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to create a TeamMember.
     */
    data: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
  }

  /**
   * TeamMember createMany
   */
  export type TeamMemberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TeamMember createManyAndReturn
   */
  export type TeamMemberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to create many TeamMembers.
     */
    data: TeamMemberCreateManyInput | TeamMemberCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember update
   */
  export type TeamMemberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The data needed to update a TeamMember.
     */
    data: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
    /**
     * Choose, which TeamMember to update.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember updateMany
   */
  export type TeamMemberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
  }

  /**
   * TeamMember updateManyAndReturn
   */
  export type TeamMemberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * The data used to update TeamMembers.
     */
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyInput>
    /**
     * Filter which TeamMembers to update
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TeamMember upsert
   */
  export type TeamMemberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * The filter to search for the TeamMember to update in case it exists.
     */
    where: TeamMemberWhereUniqueInput
    /**
     * In case the TeamMember found by the `where` argument doesn't exist, create a new TeamMember with this data.
     */
    create: XOR<TeamMemberCreateInput, TeamMemberUncheckedCreateInput>
    /**
     * In case the TeamMember was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TeamMemberUpdateInput, TeamMemberUncheckedUpdateInput>
  }

  /**
   * TeamMember delete
   */
  export type TeamMemberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
    /**
     * Filter which TeamMember to delete.
     */
    where: TeamMemberWhereUniqueInput
  }

  /**
   * TeamMember deleteMany
   */
  export type TeamMemberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TeamMembers to delete
     */
    where?: TeamMemberWhereInput
    /**
     * Limit how many TeamMembers to delete.
     */
    limit?: number
  }

  /**
   * TeamMember without action
   */
  export type TeamMemberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TeamMember
     */
    select?: TeamMemberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TeamMember
     */
    omit?: TeamMemberOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TeamMemberInclude<ExtArgs> | null
  }


  /**
   * Model CalendarConnection
   */

  export type AggregateCalendarConnection = {
    _count: CalendarConnectionCountAggregateOutputType | null
    _min: CalendarConnectionMinAggregateOutputType | null
    _max: CalendarConnectionMaxAggregateOutputType | null
  }

  export type CalendarConnectionMinAggregateOutputType = {
    id: string | null
    provider: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    email: string | null
    isPrimary: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type CalendarConnectionMaxAggregateOutputType = {
    id: string | null
    provider: string | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: Date | null
    email: string | null
    isPrimary: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type CalendarConnectionCountAggregateOutputType = {
    id: number
    provider: number
    accessToken: number
    refreshToken: number
    expiresAt: number
    email: number
    isPrimary: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type CalendarConnectionMinAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    email?: true
    isPrimary?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type CalendarConnectionMaxAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    email?: true
    isPrimary?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type CalendarConnectionCountAggregateInputType = {
    id?: true
    provider?: true
    accessToken?: true
    refreshToken?: true
    expiresAt?: true
    email?: true
    isPrimary?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type CalendarConnectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CalendarConnection to aggregate.
     */
    where?: CalendarConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarConnections to fetch.
     */
    orderBy?: CalendarConnectionOrderByWithRelationInput | CalendarConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CalendarConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CalendarConnections
    **/
    _count?: true | CalendarConnectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CalendarConnectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CalendarConnectionMaxAggregateInputType
  }

  export type GetCalendarConnectionAggregateType<T extends CalendarConnectionAggregateArgs> = {
        [P in keyof T & keyof AggregateCalendarConnection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalendarConnection[P]>
      : GetScalarType<T[P], AggregateCalendarConnection[P]>
  }




  export type CalendarConnectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalendarConnectionWhereInput
    orderBy?: CalendarConnectionOrderByWithAggregationInput | CalendarConnectionOrderByWithAggregationInput[]
    by: CalendarConnectionScalarFieldEnum[] | CalendarConnectionScalarFieldEnum
    having?: CalendarConnectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CalendarConnectionCountAggregateInputType | true
    _min?: CalendarConnectionMinAggregateInputType
    _max?: CalendarConnectionMaxAggregateInputType
  }

  export type CalendarConnectionGroupByOutputType = {
    id: string
    provider: string
    accessToken: string
    refreshToken: string | null
    expiresAt: Date | null
    email: string
    isPrimary: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: CalendarConnectionCountAggregateOutputType | null
    _min: CalendarConnectionMinAggregateOutputType | null
    _max: CalendarConnectionMaxAggregateOutputType | null
  }

  type GetCalendarConnectionGroupByPayload<T extends CalendarConnectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CalendarConnectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CalendarConnectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalendarConnectionGroupByOutputType[P]>
            : GetScalarType<T[P], CalendarConnectionGroupByOutputType[P]>
        }
      >
    >


  export type CalendarConnectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    email?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calendarConnection"]>

  export type CalendarConnectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    email?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calendarConnection"]>

  export type CalendarConnectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    email?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calendarConnection"]>

  export type CalendarConnectionSelectScalar = {
    id?: boolean
    provider?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    expiresAt?: boolean
    email?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type CalendarConnectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "provider" | "accessToken" | "refreshToken" | "expiresAt" | "email" | "isPrimary" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["calendarConnection"]>
  export type CalendarConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CalendarConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type CalendarConnectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $CalendarConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CalendarConnection"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      provider: string
      accessToken: string
      refreshToken: string | null
      expiresAt: Date | null
      email: string
      isPrimary: boolean
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["calendarConnection"]>
    composites: {}
  }

  type CalendarConnectionGetPayload<S extends boolean | null | undefined | CalendarConnectionDefaultArgs> = $Result.GetResult<Prisma.$CalendarConnectionPayload, S>

  type CalendarConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CalendarConnectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CalendarConnectionCountAggregateInputType | true
    }

  export interface CalendarConnectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CalendarConnection'], meta: { name: 'CalendarConnection' } }
    /**
     * Find zero or one CalendarConnection that matches the filter.
     * @param {CalendarConnectionFindUniqueArgs} args - Arguments to find a CalendarConnection
     * @example
     * // Get one CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CalendarConnectionFindUniqueArgs>(args: SelectSubset<T, CalendarConnectionFindUniqueArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CalendarConnection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CalendarConnectionFindUniqueOrThrowArgs} args - Arguments to find a CalendarConnection
     * @example
     * // Get one CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CalendarConnectionFindUniqueOrThrowArgs>(args: SelectSubset<T, CalendarConnectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CalendarConnection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionFindFirstArgs} args - Arguments to find a CalendarConnection
     * @example
     * // Get one CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CalendarConnectionFindFirstArgs>(args?: SelectSubset<T, CalendarConnectionFindFirstArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CalendarConnection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionFindFirstOrThrowArgs} args - Arguments to find a CalendarConnection
     * @example
     * // Get one CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CalendarConnectionFindFirstOrThrowArgs>(args?: SelectSubset<T, CalendarConnectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CalendarConnections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CalendarConnections
     * const calendarConnections = await prisma.calendarConnection.findMany()
     * 
     * // Get first 10 CalendarConnections
     * const calendarConnections = await prisma.calendarConnection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const calendarConnectionWithIdOnly = await prisma.calendarConnection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CalendarConnectionFindManyArgs>(args?: SelectSubset<T, CalendarConnectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CalendarConnection.
     * @param {CalendarConnectionCreateArgs} args - Arguments to create a CalendarConnection.
     * @example
     * // Create one CalendarConnection
     * const CalendarConnection = await prisma.calendarConnection.create({
     *   data: {
     *     // ... data to create a CalendarConnection
     *   }
     * })
     * 
     */
    create<T extends CalendarConnectionCreateArgs>(args: SelectSubset<T, CalendarConnectionCreateArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CalendarConnections.
     * @param {CalendarConnectionCreateManyArgs} args - Arguments to create many CalendarConnections.
     * @example
     * // Create many CalendarConnections
     * const calendarConnection = await prisma.calendarConnection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CalendarConnectionCreateManyArgs>(args?: SelectSubset<T, CalendarConnectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CalendarConnections and returns the data saved in the database.
     * @param {CalendarConnectionCreateManyAndReturnArgs} args - Arguments to create many CalendarConnections.
     * @example
     * // Create many CalendarConnections
     * const calendarConnection = await prisma.calendarConnection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CalendarConnections and only return the `id`
     * const calendarConnectionWithIdOnly = await prisma.calendarConnection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CalendarConnectionCreateManyAndReturnArgs>(args?: SelectSubset<T, CalendarConnectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CalendarConnection.
     * @param {CalendarConnectionDeleteArgs} args - Arguments to delete one CalendarConnection.
     * @example
     * // Delete one CalendarConnection
     * const CalendarConnection = await prisma.calendarConnection.delete({
     *   where: {
     *     // ... filter to delete one CalendarConnection
     *   }
     * })
     * 
     */
    delete<T extends CalendarConnectionDeleteArgs>(args: SelectSubset<T, CalendarConnectionDeleteArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CalendarConnection.
     * @param {CalendarConnectionUpdateArgs} args - Arguments to update one CalendarConnection.
     * @example
     * // Update one CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CalendarConnectionUpdateArgs>(args: SelectSubset<T, CalendarConnectionUpdateArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CalendarConnections.
     * @param {CalendarConnectionDeleteManyArgs} args - Arguments to filter CalendarConnections to delete.
     * @example
     * // Delete a few CalendarConnections
     * const { count } = await prisma.calendarConnection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CalendarConnectionDeleteManyArgs>(args?: SelectSubset<T, CalendarConnectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CalendarConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CalendarConnections
     * const calendarConnection = await prisma.calendarConnection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CalendarConnectionUpdateManyArgs>(args: SelectSubset<T, CalendarConnectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CalendarConnections and returns the data updated in the database.
     * @param {CalendarConnectionUpdateManyAndReturnArgs} args - Arguments to update many CalendarConnections.
     * @example
     * // Update many CalendarConnections
     * const calendarConnection = await prisma.calendarConnection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CalendarConnections and only return the `id`
     * const calendarConnectionWithIdOnly = await prisma.calendarConnection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CalendarConnectionUpdateManyAndReturnArgs>(args: SelectSubset<T, CalendarConnectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CalendarConnection.
     * @param {CalendarConnectionUpsertArgs} args - Arguments to update or create a CalendarConnection.
     * @example
     * // Update or create a CalendarConnection
     * const calendarConnection = await prisma.calendarConnection.upsert({
     *   create: {
     *     // ... data to create a CalendarConnection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CalendarConnection we want to update
     *   }
     * })
     */
    upsert<T extends CalendarConnectionUpsertArgs>(args: SelectSubset<T, CalendarConnectionUpsertArgs<ExtArgs>>): Prisma__CalendarConnectionClient<$Result.GetResult<Prisma.$CalendarConnectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CalendarConnections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionCountArgs} args - Arguments to filter CalendarConnections to count.
     * @example
     * // Count the number of CalendarConnections
     * const count = await prisma.calendarConnection.count({
     *   where: {
     *     // ... the filter for the CalendarConnections we want to count
     *   }
     * })
    **/
    count<T extends CalendarConnectionCountArgs>(
      args?: Subset<T, CalendarConnectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalendarConnectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CalendarConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CalendarConnectionAggregateArgs>(args: Subset<T, CalendarConnectionAggregateArgs>): Prisma.PrismaPromise<GetCalendarConnectionAggregateType<T>>

    /**
     * Group by CalendarConnection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalendarConnectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CalendarConnectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CalendarConnectionGroupByArgs['orderBy'] }
        : { orderBy?: CalendarConnectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CalendarConnectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCalendarConnectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CalendarConnection model
   */
  readonly fields: CalendarConnectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CalendarConnection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CalendarConnectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CalendarConnection model
   */
  interface CalendarConnectionFieldRefs {
    readonly id: FieldRef<"CalendarConnection", 'String'>
    readonly provider: FieldRef<"CalendarConnection", 'String'>
    readonly accessToken: FieldRef<"CalendarConnection", 'String'>
    readonly refreshToken: FieldRef<"CalendarConnection", 'String'>
    readonly expiresAt: FieldRef<"CalendarConnection", 'DateTime'>
    readonly email: FieldRef<"CalendarConnection", 'String'>
    readonly isPrimary: FieldRef<"CalendarConnection", 'Boolean'>
    readonly createdAt: FieldRef<"CalendarConnection", 'DateTime'>
    readonly updatedAt: FieldRef<"CalendarConnection", 'DateTime'>
    readonly userId: FieldRef<"CalendarConnection", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CalendarConnection findUnique
   */
  export type CalendarConnectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CalendarConnection to fetch.
     */
    where: CalendarConnectionWhereUniqueInput
  }

  /**
   * CalendarConnection findUniqueOrThrow
   */
  export type CalendarConnectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CalendarConnection to fetch.
     */
    where: CalendarConnectionWhereUniqueInput
  }

  /**
   * CalendarConnection findFirst
   */
  export type CalendarConnectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CalendarConnection to fetch.
     */
    where?: CalendarConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarConnections to fetch.
     */
    orderBy?: CalendarConnectionOrderByWithRelationInput | CalendarConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CalendarConnections.
     */
    cursor?: CalendarConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CalendarConnections.
     */
    distinct?: CalendarConnectionScalarFieldEnum | CalendarConnectionScalarFieldEnum[]
  }

  /**
   * CalendarConnection findFirstOrThrow
   */
  export type CalendarConnectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CalendarConnection to fetch.
     */
    where?: CalendarConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarConnections to fetch.
     */
    orderBy?: CalendarConnectionOrderByWithRelationInput | CalendarConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CalendarConnections.
     */
    cursor?: CalendarConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CalendarConnections.
     */
    distinct?: CalendarConnectionScalarFieldEnum | CalendarConnectionScalarFieldEnum[]
  }

  /**
   * CalendarConnection findMany
   */
  export type CalendarConnectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter, which CalendarConnections to fetch.
     */
    where?: CalendarConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CalendarConnections to fetch.
     */
    orderBy?: CalendarConnectionOrderByWithRelationInput | CalendarConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CalendarConnections.
     */
    cursor?: CalendarConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CalendarConnections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CalendarConnections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CalendarConnections.
     */
    distinct?: CalendarConnectionScalarFieldEnum | CalendarConnectionScalarFieldEnum[]
  }

  /**
   * CalendarConnection create
   */
  export type CalendarConnectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a CalendarConnection.
     */
    data: XOR<CalendarConnectionCreateInput, CalendarConnectionUncheckedCreateInput>
  }

  /**
   * CalendarConnection createMany
   */
  export type CalendarConnectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CalendarConnections.
     */
    data: CalendarConnectionCreateManyInput | CalendarConnectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CalendarConnection createManyAndReturn
   */
  export type CalendarConnectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * The data used to create many CalendarConnections.
     */
    data: CalendarConnectionCreateManyInput | CalendarConnectionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * CalendarConnection update
   */
  export type CalendarConnectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * The data needed to update a CalendarConnection.
     */
    data: XOR<CalendarConnectionUpdateInput, CalendarConnectionUncheckedUpdateInput>
    /**
     * Choose, which CalendarConnection to update.
     */
    where: CalendarConnectionWhereUniqueInput
  }

  /**
   * CalendarConnection updateMany
   */
  export type CalendarConnectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CalendarConnections.
     */
    data: XOR<CalendarConnectionUpdateManyMutationInput, CalendarConnectionUncheckedUpdateManyInput>
    /**
     * Filter which CalendarConnections to update
     */
    where?: CalendarConnectionWhereInput
    /**
     * Limit how many CalendarConnections to update.
     */
    limit?: number
  }

  /**
   * CalendarConnection updateManyAndReturn
   */
  export type CalendarConnectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * The data used to update CalendarConnections.
     */
    data: XOR<CalendarConnectionUpdateManyMutationInput, CalendarConnectionUncheckedUpdateManyInput>
    /**
     * Filter which CalendarConnections to update
     */
    where?: CalendarConnectionWhereInput
    /**
     * Limit how many CalendarConnections to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * CalendarConnection upsert
   */
  export type CalendarConnectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * The filter to search for the CalendarConnection to update in case it exists.
     */
    where: CalendarConnectionWhereUniqueInput
    /**
     * In case the CalendarConnection found by the `where` argument doesn't exist, create a new CalendarConnection with this data.
     */
    create: XOR<CalendarConnectionCreateInput, CalendarConnectionUncheckedCreateInput>
    /**
     * In case the CalendarConnection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CalendarConnectionUpdateInput, CalendarConnectionUncheckedUpdateInput>
  }

  /**
   * CalendarConnection delete
   */
  export type CalendarConnectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
    /**
     * Filter which CalendarConnection to delete.
     */
    where: CalendarConnectionWhereUniqueInput
  }

  /**
   * CalendarConnection deleteMany
   */
  export type CalendarConnectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CalendarConnections to delete
     */
    where?: CalendarConnectionWhereInput
    /**
     * Limit how many CalendarConnections to delete.
     */
    limit?: number
  }

  /**
   * CalendarConnection without action
   */
  export type CalendarConnectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CalendarConnection
     */
    select?: CalendarConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CalendarConnection
     */
    omit?: CalendarConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalendarConnectionInclude<ExtArgs> | null
  }


  /**
   * Model Webhook
   */

  export type AggregateWebhook = {
    _count: WebhookCountAggregateOutputType | null
    _min: WebhookMinAggregateOutputType | null
    _max: WebhookMaxAggregateOutputType | null
  }

  export type WebhookMinAggregateOutputType = {
    id: string | null
    url: string | null
    active: boolean | null
    secret: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type WebhookMaxAggregateOutputType = {
    id: string | null
    url: string | null
    active: boolean | null
    secret: string | null
    createdAt: Date | null
    updatedAt: Date | null
    userId: string | null
  }

  export type WebhookCountAggregateOutputType = {
    id: number
    url: number
    eventTriggers: number
    active: number
    secret: number
    createdAt: number
    updatedAt: number
    userId: number
    _all: number
  }


  export type WebhookMinAggregateInputType = {
    id?: true
    url?: true
    active?: true
    secret?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type WebhookMaxAggregateInputType = {
    id?: true
    url?: true
    active?: true
    secret?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
  }

  export type WebhookCountAggregateInputType = {
    id?: true
    url?: true
    eventTriggers?: true
    active?: true
    secret?: true
    createdAt?: true
    updatedAt?: true
    userId?: true
    _all?: true
  }

  export type WebhookAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Webhook to aggregate.
     */
    where?: WebhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Webhooks to fetch.
     */
    orderBy?: WebhookOrderByWithRelationInput | WebhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Webhooks
    **/
    _count?: true | WebhookCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookMaxAggregateInputType
  }

  export type GetWebhookAggregateType<T extends WebhookAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhook]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhook[P]>
      : GetScalarType<T[P], AggregateWebhook[P]>
  }




  export type WebhookGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookWhereInput
    orderBy?: WebhookOrderByWithAggregationInput | WebhookOrderByWithAggregationInput[]
    by: WebhookScalarFieldEnum[] | WebhookScalarFieldEnum
    having?: WebhookScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookCountAggregateInputType | true
    _min?: WebhookMinAggregateInputType
    _max?: WebhookMaxAggregateInputType
  }

  export type WebhookGroupByOutputType = {
    id: string
    url: string
    eventTriggers: string[]
    active: boolean
    secret: string
    createdAt: Date
    updatedAt: Date
    userId: string
    _count: WebhookCountAggregateOutputType | null
    _min: WebhookMinAggregateOutputType | null
    _max: WebhookMaxAggregateOutputType | null
  }

  type GetWebhookGroupByPayload<T extends WebhookGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookGroupByOutputType[P]>
        }
      >
    >


  export type WebhookSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    eventTriggers?: boolean
    active?: boolean
    secret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    deliveries?: boolean | Webhook$deliveriesArgs<ExtArgs>
    _count?: boolean | WebhookCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhook"]>

  export type WebhookSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    eventTriggers?: boolean
    active?: boolean
    secret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhook"]>

  export type WebhookSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    eventTriggers?: boolean
    active?: boolean
    secret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhook"]>

  export type WebhookSelectScalar = {
    id?: boolean
    url?: boolean
    eventTriggers?: boolean
    active?: boolean
    secret?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userId?: boolean
  }

  export type WebhookOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "eventTriggers" | "active" | "secret" | "createdAt" | "updatedAt" | "userId", ExtArgs["result"]["webhook"]>
  export type WebhookInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    deliveries?: boolean | Webhook$deliveriesArgs<ExtArgs>
    _count?: boolean | WebhookCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WebhookIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type WebhookIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $WebhookPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Webhook"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      deliveries: Prisma.$WebhookDeliveryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      eventTriggers: string[]
      active: boolean
      secret: string
      createdAt: Date
      updatedAt: Date
      userId: string
    }, ExtArgs["result"]["webhook"]>
    composites: {}
  }

  type WebhookGetPayload<S extends boolean | null | undefined | WebhookDefaultArgs> = $Result.GetResult<Prisma.$WebhookPayload, S>

  type WebhookCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebhookFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebhookCountAggregateInputType | true
    }

  export interface WebhookDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Webhook'], meta: { name: 'Webhook' } }
    /**
     * Find zero or one Webhook that matches the filter.
     * @param {WebhookFindUniqueArgs} args - Arguments to find a Webhook
     * @example
     * // Get one Webhook
     * const webhook = await prisma.webhook.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookFindUniqueArgs>(args: SelectSubset<T, WebhookFindUniqueArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Webhook that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebhookFindUniqueOrThrowArgs} args - Arguments to find a Webhook
     * @example
     * // Get one Webhook
     * const webhook = await prisma.webhook.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Webhook that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookFindFirstArgs} args - Arguments to find a Webhook
     * @example
     * // Get one Webhook
     * const webhook = await prisma.webhook.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookFindFirstArgs>(args?: SelectSubset<T, WebhookFindFirstArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Webhook that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookFindFirstOrThrowArgs} args - Arguments to find a Webhook
     * @example
     * // Get one Webhook
     * const webhook = await prisma.webhook.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Webhooks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Webhooks
     * const webhooks = await prisma.webhook.findMany()
     * 
     * // Get first 10 Webhooks
     * const webhooks = await prisma.webhook.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookWithIdOnly = await prisma.webhook.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookFindManyArgs>(args?: SelectSubset<T, WebhookFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Webhook.
     * @param {WebhookCreateArgs} args - Arguments to create a Webhook.
     * @example
     * // Create one Webhook
     * const Webhook = await prisma.webhook.create({
     *   data: {
     *     // ... data to create a Webhook
     *   }
     * })
     * 
     */
    create<T extends WebhookCreateArgs>(args: SelectSubset<T, WebhookCreateArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Webhooks.
     * @param {WebhookCreateManyArgs} args - Arguments to create many Webhooks.
     * @example
     * // Create many Webhooks
     * const webhook = await prisma.webhook.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookCreateManyArgs>(args?: SelectSubset<T, WebhookCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Webhooks and returns the data saved in the database.
     * @param {WebhookCreateManyAndReturnArgs} args - Arguments to create many Webhooks.
     * @example
     * // Create many Webhooks
     * const webhook = await prisma.webhook.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Webhooks and only return the `id`
     * const webhookWithIdOnly = await prisma.webhook.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Webhook.
     * @param {WebhookDeleteArgs} args - Arguments to delete one Webhook.
     * @example
     * // Delete one Webhook
     * const Webhook = await prisma.webhook.delete({
     *   where: {
     *     // ... filter to delete one Webhook
     *   }
     * })
     * 
     */
    delete<T extends WebhookDeleteArgs>(args: SelectSubset<T, WebhookDeleteArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Webhook.
     * @param {WebhookUpdateArgs} args - Arguments to update one Webhook.
     * @example
     * // Update one Webhook
     * const webhook = await prisma.webhook.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookUpdateArgs>(args: SelectSubset<T, WebhookUpdateArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Webhooks.
     * @param {WebhookDeleteManyArgs} args - Arguments to filter Webhooks to delete.
     * @example
     * // Delete a few Webhooks
     * const { count } = await prisma.webhook.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookDeleteManyArgs>(args?: SelectSubset<T, WebhookDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Webhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Webhooks
     * const webhook = await prisma.webhook.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookUpdateManyArgs>(args: SelectSubset<T, WebhookUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Webhooks and returns the data updated in the database.
     * @param {WebhookUpdateManyAndReturnArgs} args - Arguments to update many Webhooks.
     * @example
     * // Update many Webhooks
     * const webhook = await prisma.webhook.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Webhooks and only return the `id`
     * const webhookWithIdOnly = await prisma.webhook.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebhookUpdateManyAndReturnArgs>(args: SelectSubset<T, WebhookUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Webhook.
     * @param {WebhookUpsertArgs} args - Arguments to update or create a Webhook.
     * @example
     * // Update or create a Webhook
     * const webhook = await prisma.webhook.upsert({
     *   create: {
     *     // ... data to create a Webhook
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Webhook we want to update
     *   }
     * })
     */
    upsert<T extends WebhookUpsertArgs>(args: SelectSubset<T, WebhookUpsertArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Webhooks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookCountArgs} args - Arguments to filter Webhooks to count.
     * @example
     * // Count the number of Webhooks
     * const count = await prisma.webhook.count({
     *   where: {
     *     // ... the filter for the Webhooks we want to count
     *   }
     * })
    **/
    count<T extends WebhookCountArgs>(
      args?: Subset<T, WebhookCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Webhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookAggregateArgs>(args: Subset<T, WebhookAggregateArgs>): Prisma.PrismaPromise<GetWebhookAggregateType<T>>

    /**
     * Group by Webhook.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookGroupByArgs['orderBy'] }
        : { orderBy?: WebhookGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Webhook model
   */
  readonly fields: WebhookFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Webhook.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    deliveries<T extends Webhook$deliveriesArgs<ExtArgs> = {}>(args?: Subset<T, Webhook$deliveriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Webhook model
   */
  interface WebhookFieldRefs {
    readonly id: FieldRef<"Webhook", 'String'>
    readonly url: FieldRef<"Webhook", 'String'>
    readonly eventTriggers: FieldRef<"Webhook", 'String[]'>
    readonly active: FieldRef<"Webhook", 'Boolean'>
    readonly secret: FieldRef<"Webhook", 'String'>
    readonly createdAt: FieldRef<"Webhook", 'DateTime'>
    readonly updatedAt: FieldRef<"Webhook", 'DateTime'>
    readonly userId: FieldRef<"Webhook", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Webhook findUnique
   */
  export type WebhookFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter, which Webhook to fetch.
     */
    where: WebhookWhereUniqueInput
  }

  /**
   * Webhook findUniqueOrThrow
   */
  export type WebhookFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter, which Webhook to fetch.
     */
    where: WebhookWhereUniqueInput
  }

  /**
   * Webhook findFirst
   */
  export type WebhookFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter, which Webhook to fetch.
     */
    where?: WebhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Webhooks to fetch.
     */
    orderBy?: WebhookOrderByWithRelationInput | WebhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Webhooks.
     */
    cursor?: WebhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Webhooks.
     */
    distinct?: WebhookScalarFieldEnum | WebhookScalarFieldEnum[]
  }

  /**
   * Webhook findFirstOrThrow
   */
  export type WebhookFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter, which Webhook to fetch.
     */
    where?: WebhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Webhooks to fetch.
     */
    orderBy?: WebhookOrderByWithRelationInput | WebhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Webhooks.
     */
    cursor?: WebhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Webhooks.
     */
    distinct?: WebhookScalarFieldEnum | WebhookScalarFieldEnum[]
  }

  /**
   * Webhook findMany
   */
  export type WebhookFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter, which Webhooks to fetch.
     */
    where?: WebhookWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Webhooks to fetch.
     */
    orderBy?: WebhookOrderByWithRelationInput | WebhookOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Webhooks.
     */
    cursor?: WebhookWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Webhooks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Webhooks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Webhooks.
     */
    distinct?: WebhookScalarFieldEnum | WebhookScalarFieldEnum[]
  }

  /**
   * Webhook create
   */
  export type WebhookCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * The data needed to create a Webhook.
     */
    data: XOR<WebhookCreateInput, WebhookUncheckedCreateInput>
  }

  /**
   * Webhook createMany
   */
  export type WebhookCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Webhooks.
     */
    data: WebhookCreateManyInput | WebhookCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Webhook createManyAndReturn
   */
  export type WebhookCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * The data used to create many Webhooks.
     */
    data: WebhookCreateManyInput | WebhookCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Webhook update
   */
  export type WebhookUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * The data needed to update a Webhook.
     */
    data: XOR<WebhookUpdateInput, WebhookUncheckedUpdateInput>
    /**
     * Choose, which Webhook to update.
     */
    where: WebhookWhereUniqueInput
  }

  /**
   * Webhook updateMany
   */
  export type WebhookUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Webhooks.
     */
    data: XOR<WebhookUpdateManyMutationInput, WebhookUncheckedUpdateManyInput>
    /**
     * Filter which Webhooks to update
     */
    where?: WebhookWhereInput
    /**
     * Limit how many Webhooks to update.
     */
    limit?: number
  }

  /**
   * Webhook updateManyAndReturn
   */
  export type WebhookUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * The data used to update Webhooks.
     */
    data: XOR<WebhookUpdateManyMutationInput, WebhookUncheckedUpdateManyInput>
    /**
     * Filter which Webhooks to update
     */
    where?: WebhookWhereInput
    /**
     * Limit how many Webhooks to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Webhook upsert
   */
  export type WebhookUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * The filter to search for the Webhook to update in case it exists.
     */
    where: WebhookWhereUniqueInput
    /**
     * In case the Webhook found by the `where` argument doesn't exist, create a new Webhook with this data.
     */
    create: XOR<WebhookCreateInput, WebhookUncheckedCreateInput>
    /**
     * In case the Webhook was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookUpdateInput, WebhookUncheckedUpdateInput>
  }

  /**
   * Webhook delete
   */
  export type WebhookDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
    /**
     * Filter which Webhook to delete.
     */
    where: WebhookWhereUniqueInput
  }

  /**
   * Webhook deleteMany
   */
  export type WebhookDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Webhooks to delete
     */
    where?: WebhookWhereInput
    /**
     * Limit how many Webhooks to delete.
     */
    limit?: number
  }

  /**
   * Webhook.deliveries
   */
  export type Webhook$deliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    where?: WebhookDeliveryWhereInput
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    cursor?: WebhookDeliveryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * Webhook without action
   */
  export type WebhookDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Webhook
     */
    select?: WebhookSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Webhook
     */
    omit?: WebhookOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookInclude<ExtArgs> | null
  }


  /**
   * Model WebhookDelivery
   */

  export type AggregateWebhookDelivery = {
    _count: WebhookDeliveryCountAggregateOutputType | null
    _avg: WebhookDeliveryAvgAggregateOutputType | null
    _sum: WebhookDeliverySumAggregateOutputType | null
    _min: WebhookDeliveryMinAggregateOutputType | null
    _max: WebhookDeliveryMaxAggregateOutputType | null
  }

  export type WebhookDeliveryAvgAggregateOutputType = {
    statusCode: number | null
  }

  export type WebhookDeliverySumAggregateOutputType = {
    statusCode: number | null
  }

  export type WebhookDeliveryMinAggregateOutputType = {
    id: string | null
    event: string | null
    statusCode: number | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
    webhookId: string | null
  }

  export type WebhookDeliveryMaxAggregateOutputType = {
    id: string | null
    event: string | null
    statusCode: number | null
    error: string | null
    createdAt: Date | null
    updatedAt: Date | null
    webhookId: string | null
  }

  export type WebhookDeliveryCountAggregateOutputType = {
    id: number
    event: number
    payload: number
    statusCode: number
    error: number
    createdAt: number
    updatedAt: number
    webhookId: number
    _all: number
  }


  export type WebhookDeliveryAvgAggregateInputType = {
    statusCode?: true
  }

  export type WebhookDeliverySumAggregateInputType = {
    statusCode?: true
  }

  export type WebhookDeliveryMinAggregateInputType = {
    id?: true
    event?: true
    statusCode?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    webhookId?: true
  }

  export type WebhookDeliveryMaxAggregateInputType = {
    id?: true
    event?: true
    statusCode?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    webhookId?: true
  }

  export type WebhookDeliveryCountAggregateInputType = {
    id?: true
    event?: true
    payload?: true
    statusCode?: true
    error?: true
    createdAt?: true
    updatedAt?: true
    webhookId?: true
    _all?: true
  }

  export type WebhookDeliveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookDelivery to aggregate.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebhookDeliveries
    **/
    _count?: true | WebhookDeliveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WebhookDeliveryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WebhookDeliverySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookDeliveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookDeliveryMaxAggregateInputType
  }

  export type GetWebhookDeliveryAggregateType<T extends WebhookDeliveryAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhookDelivery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhookDelivery[P]>
      : GetScalarType<T[P], AggregateWebhookDelivery[P]>
  }




  export type WebhookDeliveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookDeliveryWhereInput
    orderBy?: WebhookDeliveryOrderByWithAggregationInput | WebhookDeliveryOrderByWithAggregationInput[]
    by: WebhookDeliveryScalarFieldEnum[] | WebhookDeliveryScalarFieldEnum
    having?: WebhookDeliveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookDeliveryCountAggregateInputType | true
    _avg?: WebhookDeliveryAvgAggregateInputType
    _sum?: WebhookDeliverySumAggregateInputType
    _min?: WebhookDeliveryMinAggregateInputType
    _max?: WebhookDeliveryMaxAggregateInputType
  }

  export type WebhookDeliveryGroupByOutputType = {
    id: string
    event: string
    payload: JsonValue
    statusCode: number | null
    error: string | null
    createdAt: Date
    updatedAt: Date
    webhookId: string
    _count: WebhookDeliveryCountAggregateOutputType | null
    _avg: WebhookDeliveryAvgAggregateOutputType | null
    _sum: WebhookDeliverySumAggregateOutputType | null
    _min: WebhookDeliveryMinAggregateOutputType | null
    _max: WebhookDeliveryMaxAggregateOutputType | null
  }

  type GetWebhookDeliveryGroupByPayload<T extends WebhookDeliveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookDeliveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookDeliveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookDeliveryGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookDeliveryGroupByOutputType[P]>
        }
      >
    >


  export type WebhookDeliverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event?: boolean
    payload?: boolean
    statusCode?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    webhookId?: boolean
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookDelivery"]>

  export type WebhookDeliverySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event?: boolean
    payload?: boolean
    statusCode?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    webhookId?: boolean
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookDelivery"]>

  export type WebhookDeliverySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    event?: boolean
    payload?: boolean
    statusCode?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    webhookId?: boolean
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookDelivery"]>

  export type WebhookDeliverySelectScalar = {
    id?: boolean
    event?: boolean
    payload?: boolean
    statusCode?: boolean
    error?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    webhookId?: boolean
  }

  export type WebhookDeliveryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "event" | "payload" | "statusCode" | "error" | "createdAt" | "updatedAt" | "webhookId", ExtArgs["result"]["webhookDelivery"]>
  export type WebhookDeliveryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }
  export type WebhookDeliveryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }
  export type WebhookDeliveryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    webhook?: boolean | WebhookDefaultArgs<ExtArgs>
  }

  export type $WebhookDeliveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebhookDelivery"
    objects: {
      webhook: Prisma.$WebhookPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      event: string
      payload: Prisma.JsonValue
      statusCode: number | null
      error: string | null
      createdAt: Date
      updatedAt: Date
      webhookId: string
    }, ExtArgs["result"]["webhookDelivery"]>
    composites: {}
  }

  type WebhookDeliveryGetPayload<S extends boolean | null | undefined | WebhookDeliveryDefaultArgs> = $Result.GetResult<Prisma.$WebhookDeliveryPayload, S>

  type WebhookDeliveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebhookDeliveryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebhookDeliveryCountAggregateInputType | true
    }

  export interface WebhookDeliveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebhookDelivery'], meta: { name: 'WebhookDelivery' } }
    /**
     * Find zero or one WebhookDelivery that matches the filter.
     * @param {WebhookDeliveryFindUniqueArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookDeliveryFindUniqueArgs>(args: SelectSubset<T, WebhookDeliveryFindUniqueArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WebhookDelivery that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebhookDeliveryFindUniqueOrThrowArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookDeliveryFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookDelivery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindFirstArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookDeliveryFindFirstArgs>(args?: SelectSubset<T, WebhookDeliveryFindFirstArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookDelivery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindFirstOrThrowArgs} args - Arguments to find a WebhookDelivery
     * @example
     * // Get one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookDeliveryFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookDeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WebhookDeliveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebhookDeliveries
     * const webhookDeliveries = await prisma.webhookDelivery.findMany()
     * 
     * // Get first 10 WebhookDeliveries
     * const webhookDeliveries = await prisma.webhookDelivery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookDeliveryWithIdOnly = await prisma.webhookDelivery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookDeliveryFindManyArgs>(args?: SelectSubset<T, WebhookDeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WebhookDelivery.
     * @param {WebhookDeliveryCreateArgs} args - Arguments to create a WebhookDelivery.
     * @example
     * // Create one WebhookDelivery
     * const WebhookDelivery = await prisma.webhookDelivery.create({
     *   data: {
     *     // ... data to create a WebhookDelivery
     *   }
     * })
     * 
     */
    create<T extends WebhookDeliveryCreateArgs>(args: SelectSubset<T, WebhookDeliveryCreateArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WebhookDeliveries.
     * @param {WebhookDeliveryCreateManyArgs} args - Arguments to create many WebhookDeliveries.
     * @example
     * // Create many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookDeliveryCreateManyArgs>(args?: SelectSubset<T, WebhookDeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebhookDeliveries and returns the data saved in the database.
     * @param {WebhookDeliveryCreateManyAndReturnArgs} args - Arguments to create many WebhookDeliveries.
     * @example
     * // Create many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebhookDeliveries and only return the `id`
     * const webhookDeliveryWithIdOnly = await prisma.webhookDelivery.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookDeliveryCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookDeliveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WebhookDelivery.
     * @param {WebhookDeliveryDeleteArgs} args - Arguments to delete one WebhookDelivery.
     * @example
     * // Delete one WebhookDelivery
     * const WebhookDelivery = await prisma.webhookDelivery.delete({
     *   where: {
     *     // ... filter to delete one WebhookDelivery
     *   }
     * })
     * 
     */
    delete<T extends WebhookDeliveryDeleteArgs>(args: SelectSubset<T, WebhookDeliveryDeleteArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WebhookDelivery.
     * @param {WebhookDeliveryUpdateArgs} args - Arguments to update one WebhookDelivery.
     * @example
     * // Update one WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookDeliveryUpdateArgs>(args: SelectSubset<T, WebhookDeliveryUpdateArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WebhookDeliveries.
     * @param {WebhookDeliveryDeleteManyArgs} args - Arguments to filter WebhookDeliveries to delete.
     * @example
     * // Delete a few WebhookDeliveries
     * const { count } = await prisma.webhookDelivery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookDeliveryDeleteManyArgs>(args?: SelectSubset<T, WebhookDeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookDeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookDeliveryUpdateManyArgs>(args: SelectSubset<T, WebhookDeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookDeliveries and returns the data updated in the database.
     * @param {WebhookDeliveryUpdateManyAndReturnArgs} args - Arguments to update many WebhookDeliveries.
     * @example
     * // Update many WebhookDeliveries
     * const webhookDelivery = await prisma.webhookDelivery.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WebhookDeliveries and only return the `id`
     * const webhookDeliveryWithIdOnly = await prisma.webhookDelivery.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebhookDeliveryUpdateManyAndReturnArgs>(args: SelectSubset<T, WebhookDeliveryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WebhookDelivery.
     * @param {WebhookDeliveryUpsertArgs} args - Arguments to update or create a WebhookDelivery.
     * @example
     * // Update or create a WebhookDelivery
     * const webhookDelivery = await prisma.webhookDelivery.upsert({
     *   create: {
     *     // ... data to create a WebhookDelivery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebhookDelivery we want to update
     *   }
     * })
     */
    upsert<T extends WebhookDeliveryUpsertArgs>(args: SelectSubset<T, WebhookDeliveryUpsertArgs<ExtArgs>>): Prisma__WebhookDeliveryClient<$Result.GetResult<Prisma.$WebhookDeliveryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WebhookDeliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryCountArgs} args - Arguments to filter WebhookDeliveries to count.
     * @example
     * // Count the number of WebhookDeliveries
     * const count = await prisma.webhookDelivery.count({
     *   where: {
     *     // ... the filter for the WebhookDeliveries we want to count
     *   }
     * })
    **/
    count<T extends WebhookDeliveryCountArgs>(
      args?: Subset<T, WebhookDeliveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookDeliveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebhookDelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookDeliveryAggregateArgs>(args: Subset<T, WebhookDeliveryAggregateArgs>): Prisma.PrismaPromise<GetWebhookDeliveryAggregateType<T>>

    /**
     * Group by WebhookDelivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookDeliveryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookDeliveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookDeliveryGroupByArgs['orderBy'] }
        : { orderBy?: WebhookDeliveryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookDeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookDeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebhookDelivery model
   */
  readonly fields: WebhookDeliveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebhookDelivery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookDeliveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    webhook<T extends WebhookDefaultArgs<ExtArgs> = {}>(args?: Subset<T, WebhookDefaultArgs<ExtArgs>>): Prisma__WebhookClient<$Result.GetResult<Prisma.$WebhookPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebhookDelivery model
   */
  interface WebhookDeliveryFieldRefs {
    readonly id: FieldRef<"WebhookDelivery", 'String'>
    readonly event: FieldRef<"WebhookDelivery", 'String'>
    readonly payload: FieldRef<"WebhookDelivery", 'Json'>
    readonly statusCode: FieldRef<"WebhookDelivery", 'Int'>
    readonly error: FieldRef<"WebhookDelivery", 'String'>
    readonly createdAt: FieldRef<"WebhookDelivery", 'DateTime'>
    readonly updatedAt: FieldRef<"WebhookDelivery", 'DateTime'>
    readonly webhookId: FieldRef<"WebhookDelivery", 'String'>
  }
    

  // Custom InputTypes
  /**
   * WebhookDelivery findUnique
   */
  export type WebhookDeliveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery findUniqueOrThrow
   */
  export type WebhookDeliveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery findFirst
   */
  export type WebhookDeliveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookDeliveries.
     */
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery findFirstOrThrow
   */
  export type WebhookDeliveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter, which WebhookDelivery to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookDeliveries.
     */
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery findMany
   */
  export type WebhookDeliveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter, which WebhookDeliveries to fetch.
     */
    where?: WebhookDeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookDeliveries to fetch.
     */
    orderBy?: WebhookDeliveryOrderByWithRelationInput | WebhookDeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebhookDeliveries.
     */
    cursor?: WebhookDeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookDeliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookDeliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookDeliveries.
     */
    distinct?: WebhookDeliveryScalarFieldEnum | WebhookDeliveryScalarFieldEnum[]
  }

  /**
   * WebhookDelivery create
   */
  export type WebhookDeliveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * The data needed to create a WebhookDelivery.
     */
    data: XOR<WebhookDeliveryCreateInput, WebhookDeliveryUncheckedCreateInput>
  }

  /**
   * WebhookDelivery createMany
   */
  export type WebhookDeliveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebhookDeliveries.
     */
    data: WebhookDeliveryCreateManyInput | WebhookDeliveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookDelivery createManyAndReturn
   */
  export type WebhookDeliveryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * The data used to create many WebhookDeliveries.
     */
    data: WebhookDeliveryCreateManyInput | WebhookDeliveryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebhookDelivery update
   */
  export type WebhookDeliveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * The data needed to update a WebhookDelivery.
     */
    data: XOR<WebhookDeliveryUpdateInput, WebhookDeliveryUncheckedUpdateInput>
    /**
     * Choose, which WebhookDelivery to update.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery updateMany
   */
  export type WebhookDeliveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebhookDeliveries.
     */
    data: XOR<WebhookDeliveryUpdateManyMutationInput, WebhookDeliveryUncheckedUpdateManyInput>
    /**
     * Filter which WebhookDeliveries to update
     */
    where?: WebhookDeliveryWhereInput
    /**
     * Limit how many WebhookDeliveries to update.
     */
    limit?: number
  }

  /**
   * WebhookDelivery updateManyAndReturn
   */
  export type WebhookDeliveryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * The data used to update WebhookDeliveries.
     */
    data: XOR<WebhookDeliveryUpdateManyMutationInput, WebhookDeliveryUncheckedUpdateManyInput>
    /**
     * Filter which WebhookDeliveries to update
     */
    where?: WebhookDeliveryWhereInput
    /**
     * Limit how many WebhookDeliveries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebhookDelivery upsert
   */
  export type WebhookDeliveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * The filter to search for the WebhookDelivery to update in case it exists.
     */
    where: WebhookDeliveryWhereUniqueInput
    /**
     * In case the WebhookDelivery found by the `where` argument doesn't exist, create a new WebhookDelivery with this data.
     */
    create: XOR<WebhookDeliveryCreateInput, WebhookDeliveryUncheckedCreateInput>
    /**
     * In case the WebhookDelivery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookDeliveryUpdateInput, WebhookDeliveryUncheckedUpdateInput>
  }

  /**
   * WebhookDelivery delete
   */
  export type WebhookDeliveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
    /**
     * Filter which WebhookDelivery to delete.
     */
    where: WebhookDeliveryWhereUniqueInput
  }

  /**
   * WebhookDelivery deleteMany
   */
  export type WebhookDeliveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookDeliveries to delete
     */
    where?: WebhookDeliveryWhereInput
    /**
     * Limit how many WebhookDeliveries to delete.
     */
    limit?: number
  }

  /**
   * WebhookDelivery without action
   */
  export type WebhookDeliveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookDelivery
     */
    select?: WebhookDeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookDelivery
     */
    omit?: WebhookDeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookDeliveryInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refreshToken: 'refreshToken',
    accessToken: 'accessToken',
    expiresAt: 'expiresAt',
    tokenType: 'tokenType',
    scope: 'scope',
    idToken: 'idToken',
    sessionState: 'sessionState',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    name: 'name',
    image: 'image',
    timezone: 'timezone',
    weekStart: 'weekStart',
    bio: 'bio',
    theme: 'theme',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const EventTypeScalarFieldEnum: {
    id: 'id',
    title: 'title',
    slug: 'slug',
    description: 'description',
    duration: 'duration',
    isActive: 'isActive',
    requiresConfirmation: 'requiresConfirmation',
    price: 'price',
    currency: 'currency',
    minimumNotice: 'minimumNotice',
    beforeBuffer: 'beforeBuffer',
    afterBuffer: 'afterBuffer',
    slotInterval: 'slotInterval',
    maxBookingsPerDay: 'maxBookingsPerDay',
    maxBookingsPerWeek: 'maxBookingsPerWeek',
    futureLimit: 'futureLimit',
    color: 'color',
    customQuestions: 'customQuestions',
    recurringEnabled: 'recurringEnabled',
    recurringFrequency: 'recurringFrequency',
    schedulingType: 'schedulingType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    scheduleId: 'scheduleId',
    teamId: 'teamId'
  };

  export type EventTypeScalarFieldEnum = (typeof EventTypeScalarFieldEnum)[keyof typeof EventTypeScalarFieldEnum]


  export const BookingScalarFieldEnum: {
    id: 'id',
    uid: 'uid',
    title: 'title',
    startTime: 'startTime',
    endTime: 'endTime',
    status: 'status',
    attendeeName: 'attendeeName',
    attendeeEmail: 'attendeeEmail',
    attendeeTimezone: 'attendeeTimezone',
    attendeeNotes: 'attendeeNotes',
    meetingUrl: 'meetingUrl',
    location: 'location',
    responses: 'responses',
    cancellationReason: 'cancellationReason',
    recurringEventId: 'recurringEventId',
    calendarEventId: 'calendarEventId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    eventTypeId: 'eventTypeId'
  };

  export type BookingScalarFieldEnum = (typeof BookingScalarFieldEnum)[keyof typeof BookingScalarFieldEnum]


  export const ScheduleScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isDefault: 'isDefault',
    timezone: 'timezone',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type ScheduleScalarFieldEnum = (typeof ScheduleScalarFieldEnum)[keyof typeof ScheduleScalarFieldEnum]


  export const AvailabilityScalarFieldEnum: {
    id: 'id',
    day: 'day',
    startTime: 'startTime',
    endTime: 'endTime',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    scheduleId: 'scheduleId'
  };

  export type AvailabilityScalarFieldEnum = (typeof AvailabilityScalarFieldEnum)[keyof typeof AvailabilityScalarFieldEnum]


  export const DateOverrideScalarFieldEnum: {
    id: 'id',
    date: 'date',
    startTime: 'startTime',
    endTime: 'endTime',
    isUnavailable: 'isUnavailable',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    scheduleId: 'scheduleId'
  };

  export type DateOverrideScalarFieldEnum = (typeof DateOverrideScalarFieldEnum)[keyof typeof DateOverrideScalarFieldEnum]


  export const TeamScalarFieldEnum: {
    id: 'id',
    name: 'name',
    slug: 'slug',
    logoUrl: 'logoUrl',
    bio: 'bio',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TeamScalarFieldEnum = (typeof TeamScalarFieldEnum)[keyof typeof TeamScalarFieldEnum]


  export const TeamMemberScalarFieldEnum: {
    id: 'id',
    role: 'role',
    accepted: 'accepted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
    teamId: 'teamId'
  };

  export type TeamMemberScalarFieldEnum = (typeof TeamMemberScalarFieldEnum)[keyof typeof TeamMemberScalarFieldEnum]


  export const CalendarConnectionScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    expiresAt: 'expiresAt',
    email: 'email',
    isPrimary: 'isPrimary',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type CalendarConnectionScalarFieldEnum = (typeof CalendarConnectionScalarFieldEnum)[keyof typeof CalendarConnectionScalarFieldEnum]


  export const WebhookScalarFieldEnum: {
    id: 'id',
    url: 'url',
    eventTriggers: 'eventTriggers',
    active: 'active',
    secret: 'secret',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId'
  };

  export type WebhookScalarFieldEnum = (typeof WebhookScalarFieldEnum)[keyof typeof WebhookScalarFieldEnum]


  export const WebhookDeliveryScalarFieldEnum: {
    id: 'id',
    event: 'event',
    payload: 'payload',
    statusCode: 'statusCode',
    error: 'error',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    webhookId: 'webhookId'
  };

  export type WebhookDeliveryScalarFieldEnum = (typeof WebhookDeliveryScalarFieldEnum)[keyof typeof WebhookDeliveryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'SchedulingType'
   */
  export type EnumSchedulingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SchedulingType'>
    


  /**
   * Reference to a field of type 'SchedulingType[]'
   */
  export type ListEnumSchedulingTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SchedulingType[]'>
    


  /**
   * Reference to a field of type 'BookingStatus'
   */
  export type EnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus'>
    


  /**
   * Reference to a field of type 'BookingStatus[]'
   */
  export type ListEnumBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BookingStatus[]'>
    


  /**
   * Reference to a field of type 'TeamRole'
   */
  export type EnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole'>
    


  /**
   * Reference to a field of type 'TeamRole[]'
   */
  export type ListEnumTeamRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TeamRole[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    tokenType?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    sessionState?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    accessToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    tokenType?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    idToken?: SortOrderInput | SortOrder
    sessionState?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    accessToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expiresAt?: IntNullableWithAggregatesFilter<"Account"> | number | null
    tokenType?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    idToken?: StringNullableWithAggregatesFilter<"Account"> | string | null
    sessionState?: StringNullableWithAggregatesFilter<"Account"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Account"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    timezone?: StringFilter<"User"> | string
    weekStart?: IntFilter<"User"> | number
    bio?: StringNullableFilter<"User"> | string | null
    theme?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    eventTypes?: EventTypeListRelationFilter
    bookings?: BookingListRelationFilter
    schedules?: ScheduleListRelationFilter
    teamMemberships?: TeamMemberListRelationFilter
    calendarConnections?: CalendarConnectionListRelationFilter
    webhooks?: WebhookListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    timezone?: SortOrder
    weekStart?: SortOrder
    bio?: SortOrderInput | SortOrder
    theme?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
    eventTypes?: EventTypeOrderByRelationAggregateInput
    bookings?: BookingOrderByRelationAggregateInput
    schedules?: ScheduleOrderByRelationAggregateInput
    teamMemberships?: TeamMemberOrderByRelationAggregateInput
    calendarConnections?: CalendarConnectionOrderByRelationAggregateInput
    webhooks?: WebhookOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringNullableFilter<"User"> | string | null
    name?: StringNullableFilter<"User"> | string | null
    image?: StringNullableFilter<"User"> | string | null
    timezone?: StringFilter<"User"> | string
    weekStart?: IntFilter<"User"> | number
    bio?: StringNullableFilter<"User"> | string | null
    theme?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
    eventTypes?: EventTypeListRelationFilter
    bookings?: BookingListRelationFilter
    schedules?: ScheduleListRelationFilter
    teamMemberships?: TeamMemberListRelationFilter
    calendarConnections?: CalendarConnectionListRelationFilter
    webhooks?: WebhookListRelationFilter
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    timezone?: SortOrder
    weekStart?: SortOrder
    bio?: SortOrderInput | SortOrder
    theme?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringNullableWithAggregatesFilter<"User"> | string | null
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
    timezone?: StringWithAggregatesFilter<"User"> | string
    weekStart?: IntWithAggregatesFilter<"User"> | number
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    theme?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type EventTypeWhereInput = {
    AND?: EventTypeWhereInput | EventTypeWhereInput[]
    OR?: EventTypeWhereInput[]
    NOT?: EventTypeWhereInput | EventTypeWhereInput[]
    id?: StringFilter<"EventType"> | string
    title?: StringFilter<"EventType"> | string
    slug?: StringFilter<"EventType"> | string
    description?: StringNullableFilter<"EventType"> | string | null
    duration?: IntFilter<"EventType"> | number
    isActive?: BoolFilter<"EventType"> | boolean
    requiresConfirmation?: BoolFilter<"EventType"> | boolean
    price?: IntNullableFilter<"EventType"> | number | null
    currency?: StringFilter<"EventType"> | string
    minimumNotice?: IntFilter<"EventType"> | number
    beforeBuffer?: IntFilter<"EventType"> | number
    afterBuffer?: IntFilter<"EventType"> | number
    slotInterval?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerDay?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerWeek?: IntNullableFilter<"EventType"> | number | null
    futureLimit?: IntNullableFilter<"EventType"> | number | null
    color?: StringFilter<"EventType"> | string
    customQuestions?: JsonNullableFilter<"EventType">
    recurringEnabled?: BoolFilter<"EventType"> | boolean
    recurringFrequency?: StringNullableFilter<"EventType"> | string | null
    schedulingType?: EnumSchedulingTypeNullableFilter<"EventType"> | $Enums.SchedulingType | null
    createdAt?: DateTimeFilter<"EventType"> | Date | string
    updatedAt?: DateTimeFilter<"EventType"> | Date | string
    userId?: StringNullableFilter<"EventType"> | string | null
    scheduleId?: StringNullableFilter<"EventType"> | string | null
    teamId?: StringNullableFilter<"EventType"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    schedule?: XOR<ScheduleNullableScalarRelationFilter, ScheduleWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    bookings?: BookingListRelationFilter
  }

  export type EventTypeOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrder
    isActive?: SortOrder
    requiresConfirmation?: SortOrder
    price?: SortOrderInput | SortOrder
    currency?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrderInput | SortOrder
    maxBookingsPerDay?: SortOrderInput | SortOrder
    maxBookingsPerWeek?: SortOrderInput | SortOrder
    futureLimit?: SortOrderInput | SortOrder
    color?: SortOrder
    customQuestions?: SortOrderInput | SortOrder
    recurringEnabled?: SortOrder
    recurringFrequency?: SortOrderInput | SortOrder
    schedulingType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    scheduleId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    schedule?: ScheduleOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
    bookings?: BookingOrderByRelationAggregateInput
  }

  export type EventTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_slug?: EventTypeUserIdSlugCompoundUniqueInput
    AND?: EventTypeWhereInput | EventTypeWhereInput[]
    OR?: EventTypeWhereInput[]
    NOT?: EventTypeWhereInput | EventTypeWhereInput[]
    title?: StringFilter<"EventType"> | string
    slug?: StringFilter<"EventType"> | string
    description?: StringNullableFilter<"EventType"> | string | null
    duration?: IntFilter<"EventType"> | number
    isActive?: BoolFilter<"EventType"> | boolean
    requiresConfirmation?: BoolFilter<"EventType"> | boolean
    price?: IntNullableFilter<"EventType"> | number | null
    currency?: StringFilter<"EventType"> | string
    minimumNotice?: IntFilter<"EventType"> | number
    beforeBuffer?: IntFilter<"EventType"> | number
    afterBuffer?: IntFilter<"EventType"> | number
    slotInterval?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerDay?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerWeek?: IntNullableFilter<"EventType"> | number | null
    futureLimit?: IntNullableFilter<"EventType"> | number | null
    color?: StringFilter<"EventType"> | string
    customQuestions?: JsonNullableFilter<"EventType">
    recurringEnabled?: BoolFilter<"EventType"> | boolean
    recurringFrequency?: StringNullableFilter<"EventType"> | string | null
    schedulingType?: EnumSchedulingTypeNullableFilter<"EventType"> | $Enums.SchedulingType | null
    createdAt?: DateTimeFilter<"EventType"> | Date | string
    updatedAt?: DateTimeFilter<"EventType"> | Date | string
    userId?: StringNullableFilter<"EventType"> | string | null
    scheduleId?: StringNullableFilter<"EventType"> | string | null
    teamId?: StringNullableFilter<"EventType"> | string | null
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    schedule?: XOR<ScheduleNullableScalarRelationFilter, ScheduleWhereInput> | null
    team?: XOR<TeamNullableScalarRelationFilter, TeamWhereInput> | null
    bookings?: BookingListRelationFilter
  }, "id" | "userId_slug">

  export type EventTypeOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrderInput | SortOrder
    duration?: SortOrder
    isActive?: SortOrder
    requiresConfirmation?: SortOrder
    price?: SortOrderInput | SortOrder
    currency?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrderInput | SortOrder
    maxBookingsPerDay?: SortOrderInput | SortOrder
    maxBookingsPerWeek?: SortOrderInput | SortOrder
    futureLimit?: SortOrderInput | SortOrder
    color?: SortOrder
    customQuestions?: SortOrderInput | SortOrder
    recurringEnabled?: SortOrder
    recurringFrequency?: SortOrderInput | SortOrder
    schedulingType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrderInput | SortOrder
    scheduleId?: SortOrderInput | SortOrder
    teamId?: SortOrderInput | SortOrder
    _count?: EventTypeCountOrderByAggregateInput
    _avg?: EventTypeAvgOrderByAggregateInput
    _max?: EventTypeMaxOrderByAggregateInput
    _min?: EventTypeMinOrderByAggregateInput
    _sum?: EventTypeSumOrderByAggregateInput
  }

  export type EventTypeScalarWhereWithAggregatesInput = {
    AND?: EventTypeScalarWhereWithAggregatesInput | EventTypeScalarWhereWithAggregatesInput[]
    OR?: EventTypeScalarWhereWithAggregatesInput[]
    NOT?: EventTypeScalarWhereWithAggregatesInput | EventTypeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"EventType"> | string
    title?: StringWithAggregatesFilter<"EventType"> | string
    slug?: StringWithAggregatesFilter<"EventType"> | string
    description?: StringNullableWithAggregatesFilter<"EventType"> | string | null
    duration?: IntWithAggregatesFilter<"EventType"> | number
    isActive?: BoolWithAggregatesFilter<"EventType"> | boolean
    requiresConfirmation?: BoolWithAggregatesFilter<"EventType"> | boolean
    price?: IntNullableWithAggregatesFilter<"EventType"> | number | null
    currency?: StringWithAggregatesFilter<"EventType"> | string
    minimumNotice?: IntWithAggregatesFilter<"EventType"> | number
    beforeBuffer?: IntWithAggregatesFilter<"EventType"> | number
    afterBuffer?: IntWithAggregatesFilter<"EventType"> | number
    slotInterval?: IntNullableWithAggregatesFilter<"EventType"> | number | null
    maxBookingsPerDay?: IntNullableWithAggregatesFilter<"EventType"> | number | null
    maxBookingsPerWeek?: IntNullableWithAggregatesFilter<"EventType"> | number | null
    futureLimit?: IntNullableWithAggregatesFilter<"EventType"> | number | null
    color?: StringWithAggregatesFilter<"EventType"> | string
    customQuestions?: JsonNullableWithAggregatesFilter<"EventType">
    recurringEnabled?: BoolWithAggregatesFilter<"EventType"> | boolean
    recurringFrequency?: StringNullableWithAggregatesFilter<"EventType"> | string | null
    schedulingType?: EnumSchedulingTypeNullableWithAggregatesFilter<"EventType"> | $Enums.SchedulingType | null
    createdAt?: DateTimeWithAggregatesFilter<"EventType"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"EventType"> | Date | string
    userId?: StringNullableWithAggregatesFilter<"EventType"> | string | null
    scheduleId?: StringNullableWithAggregatesFilter<"EventType"> | string | null
    teamId?: StringNullableWithAggregatesFilter<"EventType"> | string | null
  }

  export type BookingWhereInput = {
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    id?: StringFilter<"Booking"> | string
    uid?: StringFilter<"Booking"> | string
    title?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    attendeeName?: StringFilter<"Booking"> | string
    attendeeEmail?: StringFilter<"Booking"> | string
    attendeeTimezone?: StringFilter<"Booking"> | string
    attendeeNotes?: StringNullableFilter<"Booking"> | string | null
    meetingUrl?: StringNullableFilter<"Booking"> | string | null
    location?: StringNullableFilter<"Booking"> | string | null
    responses?: JsonNullableFilter<"Booking">
    cancellationReason?: StringNullableFilter<"Booking"> | string | null
    recurringEventId?: StringNullableFilter<"Booking"> | string | null
    calendarEventId?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    userId?: StringFilter<"Booking"> | string
    eventTypeId?: StringFilter<"Booking"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    eventType?: XOR<EventTypeScalarRelationFilter, EventTypeWhereInput>
  }

  export type BookingOrderByWithRelationInput = {
    id?: SortOrder
    uid?: SortOrder
    title?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    attendeeName?: SortOrder
    attendeeEmail?: SortOrder
    attendeeTimezone?: SortOrder
    attendeeNotes?: SortOrderInput | SortOrder
    meetingUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    responses?: SortOrderInput | SortOrder
    cancellationReason?: SortOrderInput | SortOrder
    recurringEventId?: SortOrderInput | SortOrder
    calendarEventId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    eventTypeId?: SortOrder
    user?: UserOrderByWithRelationInput
    eventType?: EventTypeOrderByWithRelationInput
  }

  export type BookingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    uid?: string
    AND?: BookingWhereInput | BookingWhereInput[]
    OR?: BookingWhereInput[]
    NOT?: BookingWhereInput | BookingWhereInput[]
    title?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    attendeeName?: StringFilter<"Booking"> | string
    attendeeEmail?: StringFilter<"Booking"> | string
    attendeeTimezone?: StringFilter<"Booking"> | string
    attendeeNotes?: StringNullableFilter<"Booking"> | string | null
    meetingUrl?: StringNullableFilter<"Booking"> | string | null
    location?: StringNullableFilter<"Booking"> | string | null
    responses?: JsonNullableFilter<"Booking">
    cancellationReason?: StringNullableFilter<"Booking"> | string | null
    recurringEventId?: StringNullableFilter<"Booking"> | string | null
    calendarEventId?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    userId?: StringFilter<"Booking"> | string
    eventTypeId?: StringFilter<"Booking"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    eventType?: XOR<EventTypeScalarRelationFilter, EventTypeWhereInput>
  }, "id" | "uid">

  export type BookingOrderByWithAggregationInput = {
    id?: SortOrder
    uid?: SortOrder
    title?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    attendeeName?: SortOrder
    attendeeEmail?: SortOrder
    attendeeTimezone?: SortOrder
    attendeeNotes?: SortOrderInput | SortOrder
    meetingUrl?: SortOrderInput | SortOrder
    location?: SortOrderInput | SortOrder
    responses?: SortOrderInput | SortOrder
    cancellationReason?: SortOrderInput | SortOrder
    recurringEventId?: SortOrderInput | SortOrder
    calendarEventId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    eventTypeId?: SortOrder
    _count?: BookingCountOrderByAggregateInput
    _max?: BookingMaxOrderByAggregateInput
    _min?: BookingMinOrderByAggregateInput
  }

  export type BookingScalarWhereWithAggregatesInput = {
    AND?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    OR?: BookingScalarWhereWithAggregatesInput[]
    NOT?: BookingScalarWhereWithAggregatesInput | BookingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Booking"> | string
    uid?: StringWithAggregatesFilter<"Booking"> | string
    title?: StringWithAggregatesFilter<"Booking"> | string
    startTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    endTime?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    status?: EnumBookingStatusWithAggregatesFilter<"Booking"> | $Enums.BookingStatus
    attendeeName?: StringWithAggregatesFilter<"Booking"> | string
    attendeeEmail?: StringWithAggregatesFilter<"Booking"> | string
    attendeeTimezone?: StringWithAggregatesFilter<"Booking"> | string
    attendeeNotes?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    meetingUrl?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    location?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    responses?: JsonNullableWithAggregatesFilter<"Booking">
    cancellationReason?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    recurringEventId?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    calendarEventId?: StringNullableWithAggregatesFilter<"Booking"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Booking"> | Date | string
    userId?: StringWithAggregatesFilter<"Booking"> | string
    eventTypeId?: StringWithAggregatesFilter<"Booking"> | string
  }

  export type ScheduleWhereInput = {
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    id?: StringFilter<"Schedule"> | string
    name?: StringFilter<"Schedule"> | string
    isDefault?: BoolFilter<"Schedule"> | boolean
    timezone?: StringFilter<"Schedule"> | string
    createdAt?: DateTimeFilter<"Schedule"> | Date | string
    updatedAt?: DateTimeFilter<"Schedule"> | Date | string
    userId?: StringFilter<"Schedule"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    availabilities?: AvailabilityListRelationFilter
    dateOverrides?: DateOverrideListRelationFilter
    eventTypes?: EventTypeListRelationFilter
  }

  export type ScheduleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isDefault?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    availabilities?: AvailabilityOrderByRelationAggregateInput
    dateOverrides?: DateOverrideOrderByRelationAggregateInput
    eventTypes?: EventTypeOrderByRelationAggregateInput
  }

  export type ScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ScheduleWhereInput | ScheduleWhereInput[]
    OR?: ScheduleWhereInput[]
    NOT?: ScheduleWhereInput | ScheduleWhereInput[]
    name?: StringFilter<"Schedule"> | string
    isDefault?: BoolFilter<"Schedule"> | boolean
    timezone?: StringFilter<"Schedule"> | string
    createdAt?: DateTimeFilter<"Schedule"> | Date | string
    updatedAt?: DateTimeFilter<"Schedule"> | Date | string
    userId?: StringFilter<"Schedule"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    availabilities?: AvailabilityListRelationFilter
    dateOverrides?: DateOverrideListRelationFilter
    eventTypes?: EventTypeListRelationFilter
  }, "id">

  export type ScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isDefault?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: ScheduleCountOrderByAggregateInput
    _max?: ScheduleMaxOrderByAggregateInput
    _min?: ScheduleMinOrderByAggregateInput
  }

  export type ScheduleScalarWhereWithAggregatesInput = {
    AND?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    OR?: ScheduleScalarWhereWithAggregatesInput[]
    NOT?: ScheduleScalarWhereWithAggregatesInput | ScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Schedule"> | string
    name?: StringWithAggregatesFilter<"Schedule"> | string
    isDefault?: BoolWithAggregatesFilter<"Schedule"> | boolean
    timezone?: StringWithAggregatesFilter<"Schedule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Schedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Schedule"> | Date | string
    userId?: StringWithAggregatesFilter<"Schedule"> | string
  }

  export type AvailabilityWhereInput = {
    AND?: AvailabilityWhereInput | AvailabilityWhereInput[]
    OR?: AvailabilityWhereInput[]
    NOT?: AvailabilityWhereInput | AvailabilityWhereInput[]
    id?: StringFilter<"Availability"> | string
    day?: IntFilter<"Availability"> | number
    startTime?: StringFilter<"Availability"> | string
    endTime?: StringFilter<"Availability"> | string
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
    scheduleId?: StringFilter<"Availability"> | string
    schedule?: XOR<ScheduleScalarRelationFilter, ScheduleWhereInput>
  }

  export type AvailabilityOrderByWithRelationInput = {
    id?: SortOrder
    day?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
    schedule?: ScheduleOrderByWithRelationInput
  }

  export type AvailabilityWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AvailabilityWhereInput | AvailabilityWhereInput[]
    OR?: AvailabilityWhereInput[]
    NOT?: AvailabilityWhereInput | AvailabilityWhereInput[]
    day?: IntFilter<"Availability"> | number
    startTime?: StringFilter<"Availability"> | string
    endTime?: StringFilter<"Availability"> | string
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
    scheduleId?: StringFilter<"Availability"> | string
    schedule?: XOR<ScheduleScalarRelationFilter, ScheduleWhereInput>
  }, "id">

  export type AvailabilityOrderByWithAggregationInput = {
    id?: SortOrder
    day?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
    _count?: AvailabilityCountOrderByAggregateInput
    _avg?: AvailabilityAvgOrderByAggregateInput
    _max?: AvailabilityMaxOrderByAggregateInput
    _min?: AvailabilityMinOrderByAggregateInput
    _sum?: AvailabilitySumOrderByAggregateInput
  }

  export type AvailabilityScalarWhereWithAggregatesInput = {
    AND?: AvailabilityScalarWhereWithAggregatesInput | AvailabilityScalarWhereWithAggregatesInput[]
    OR?: AvailabilityScalarWhereWithAggregatesInput[]
    NOT?: AvailabilityScalarWhereWithAggregatesInput | AvailabilityScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Availability"> | string
    day?: IntWithAggregatesFilter<"Availability"> | number
    startTime?: StringWithAggregatesFilter<"Availability"> | string
    endTime?: StringWithAggregatesFilter<"Availability"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Availability"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Availability"> | Date | string
    scheduleId?: StringWithAggregatesFilter<"Availability"> | string
  }

  export type DateOverrideWhereInput = {
    AND?: DateOverrideWhereInput | DateOverrideWhereInput[]
    OR?: DateOverrideWhereInput[]
    NOT?: DateOverrideWhereInput | DateOverrideWhereInput[]
    id?: StringFilter<"DateOverride"> | string
    date?: DateTimeFilter<"DateOverride"> | Date | string
    startTime?: StringNullableFilter<"DateOverride"> | string | null
    endTime?: StringNullableFilter<"DateOverride"> | string | null
    isUnavailable?: BoolFilter<"DateOverride"> | boolean
    createdAt?: DateTimeFilter<"DateOverride"> | Date | string
    updatedAt?: DateTimeFilter<"DateOverride"> | Date | string
    scheduleId?: StringFilter<"DateOverride"> | string
    schedule?: XOR<ScheduleScalarRelationFilter, ScheduleWhereInput>
  }

  export type DateOverrideOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    isUnavailable?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
    schedule?: ScheduleOrderByWithRelationInput
  }

  export type DateOverrideWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DateOverrideWhereInput | DateOverrideWhereInput[]
    OR?: DateOverrideWhereInput[]
    NOT?: DateOverrideWhereInput | DateOverrideWhereInput[]
    date?: DateTimeFilter<"DateOverride"> | Date | string
    startTime?: StringNullableFilter<"DateOverride"> | string | null
    endTime?: StringNullableFilter<"DateOverride"> | string | null
    isUnavailable?: BoolFilter<"DateOverride"> | boolean
    createdAt?: DateTimeFilter<"DateOverride"> | Date | string
    updatedAt?: DateTimeFilter<"DateOverride"> | Date | string
    scheduleId?: StringFilter<"DateOverride"> | string
    schedule?: XOR<ScheduleScalarRelationFilter, ScheduleWhereInput>
  }, "id">

  export type DateOverrideOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrderInput | SortOrder
    endTime?: SortOrderInput | SortOrder
    isUnavailable?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
    _count?: DateOverrideCountOrderByAggregateInput
    _max?: DateOverrideMaxOrderByAggregateInput
    _min?: DateOverrideMinOrderByAggregateInput
  }

  export type DateOverrideScalarWhereWithAggregatesInput = {
    AND?: DateOverrideScalarWhereWithAggregatesInput | DateOverrideScalarWhereWithAggregatesInput[]
    OR?: DateOverrideScalarWhereWithAggregatesInput[]
    NOT?: DateOverrideScalarWhereWithAggregatesInput | DateOverrideScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DateOverride"> | string
    date?: DateTimeWithAggregatesFilter<"DateOverride"> | Date | string
    startTime?: StringNullableWithAggregatesFilter<"DateOverride"> | string | null
    endTime?: StringNullableWithAggregatesFilter<"DateOverride"> | string | null
    isUnavailable?: BoolWithAggregatesFilter<"DateOverride"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"DateOverride"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DateOverride"> | Date | string
    scheduleId?: StringWithAggregatesFilter<"DateOverride"> | string
  }

  export type TeamWhereInput = {
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    id?: StringFilter<"Team"> | string
    name?: StringFilter<"Team"> | string
    slug?: StringFilter<"Team"> | string
    logoUrl?: StringNullableFilter<"Team"> | string | null
    bio?: StringNullableFilter<"Team"> | string | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
    eventTypes?: EventTypeListRelationFilter
  }

  export type TeamOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    members?: TeamMemberOrderByRelationAggregateInput
    eventTypes?: EventTypeOrderByRelationAggregateInput
  }

  export type TeamWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: TeamWhereInput | TeamWhereInput[]
    OR?: TeamWhereInput[]
    NOT?: TeamWhereInput | TeamWhereInput[]
    name?: StringFilter<"Team"> | string
    logoUrl?: StringNullableFilter<"Team"> | string | null
    bio?: StringNullableFilter<"Team"> | string | null
    createdAt?: DateTimeFilter<"Team"> | Date | string
    updatedAt?: DateTimeFilter<"Team"> | Date | string
    members?: TeamMemberListRelationFilter
    eventTypes?: EventTypeListRelationFilter
  }, "id" | "slug">

  export type TeamOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrderInput | SortOrder
    bio?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TeamCountOrderByAggregateInput
    _max?: TeamMaxOrderByAggregateInput
    _min?: TeamMinOrderByAggregateInput
  }

  export type TeamScalarWhereWithAggregatesInput = {
    AND?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    OR?: TeamScalarWhereWithAggregatesInput[]
    NOT?: TeamScalarWhereWithAggregatesInput | TeamScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Team"> | string
    name?: StringWithAggregatesFilter<"Team"> | string
    slug?: StringWithAggregatesFilter<"Team"> | string
    logoUrl?: StringNullableWithAggregatesFilter<"Team"> | string | null
    bio?: StringNullableWithAggregatesFilter<"Team"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Team"> | Date | string
  }

  export type TeamMemberWhereInput = {
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    accepted?: BoolFilter<"TeamMember"> | boolean
    createdAt?: DateTimeFilter<"TeamMember"> | Date | string
    updatedAt?: DateTimeFilter<"TeamMember"> | Date | string
    userId?: StringFilter<"TeamMember"> | string
    teamId?: StringFilter<"TeamMember"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }

  export type TeamMemberOrderByWithRelationInput = {
    id?: SortOrder
    role?: SortOrder
    accepted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    teamId?: SortOrder
    user?: UserOrderByWithRelationInput
    team?: TeamOrderByWithRelationInput
  }

  export type TeamMemberWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_teamId?: TeamMemberUserIdTeamIdCompoundUniqueInput
    AND?: TeamMemberWhereInput | TeamMemberWhereInput[]
    OR?: TeamMemberWhereInput[]
    NOT?: TeamMemberWhereInput | TeamMemberWhereInput[]
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    accepted?: BoolFilter<"TeamMember"> | boolean
    createdAt?: DateTimeFilter<"TeamMember"> | Date | string
    updatedAt?: DateTimeFilter<"TeamMember"> | Date | string
    userId?: StringFilter<"TeamMember"> | string
    teamId?: StringFilter<"TeamMember"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    team?: XOR<TeamScalarRelationFilter, TeamWhereInput>
  }, "id" | "userId_teamId">

  export type TeamMemberOrderByWithAggregationInput = {
    id?: SortOrder
    role?: SortOrder
    accepted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    teamId?: SortOrder
    _count?: TeamMemberCountOrderByAggregateInput
    _max?: TeamMemberMaxOrderByAggregateInput
    _min?: TeamMemberMinOrderByAggregateInput
  }

  export type TeamMemberScalarWhereWithAggregatesInput = {
    AND?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    OR?: TeamMemberScalarWhereWithAggregatesInput[]
    NOT?: TeamMemberScalarWhereWithAggregatesInput | TeamMemberScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TeamMember"> | string
    role?: EnumTeamRoleWithAggregatesFilter<"TeamMember"> | $Enums.TeamRole
    accepted?: BoolWithAggregatesFilter<"TeamMember"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"TeamMember"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TeamMember"> | Date | string
    userId?: StringWithAggregatesFilter<"TeamMember"> | string
    teamId?: StringWithAggregatesFilter<"TeamMember"> | string
  }

  export type CalendarConnectionWhereInput = {
    AND?: CalendarConnectionWhereInput | CalendarConnectionWhereInput[]
    OR?: CalendarConnectionWhereInput[]
    NOT?: CalendarConnectionWhereInput | CalendarConnectionWhereInput[]
    id?: StringFilter<"CalendarConnection"> | string
    provider?: StringFilter<"CalendarConnection"> | string
    accessToken?: StringFilter<"CalendarConnection"> | string
    refreshToken?: StringNullableFilter<"CalendarConnection"> | string | null
    expiresAt?: DateTimeNullableFilter<"CalendarConnection"> | Date | string | null
    email?: StringFilter<"CalendarConnection"> | string
    isPrimary?: BoolFilter<"CalendarConnection"> | boolean
    createdAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    userId?: StringFilter<"CalendarConnection"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type CalendarConnectionOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    email?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type CalendarConnectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CalendarConnectionWhereInput | CalendarConnectionWhereInput[]
    OR?: CalendarConnectionWhereInput[]
    NOT?: CalendarConnectionWhereInput | CalendarConnectionWhereInput[]
    provider?: StringFilter<"CalendarConnection"> | string
    accessToken?: StringFilter<"CalendarConnection"> | string
    refreshToken?: StringNullableFilter<"CalendarConnection"> | string | null
    expiresAt?: DateTimeNullableFilter<"CalendarConnection"> | Date | string | null
    email?: StringFilter<"CalendarConnection"> | string
    isPrimary?: BoolFilter<"CalendarConnection"> | boolean
    createdAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    userId?: StringFilter<"CalendarConnection"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type CalendarConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    email?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: CalendarConnectionCountOrderByAggregateInput
    _max?: CalendarConnectionMaxOrderByAggregateInput
    _min?: CalendarConnectionMinOrderByAggregateInput
  }

  export type CalendarConnectionScalarWhereWithAggregatesInput = {
    AND?: CalendarConnectionScalarWhereWithAggregatesInput | CalendarConnectionScalarWhereWithAggregatesInput[]
    OR?: CalendarConnectionScalarWhereWithAggregatesInput[]
    NOT?: CalendarConnectionScalarWhereWithAggregatesInput | CalendarConnectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CalendarConnection"> | string
    provider?: StringWithAggregatesFilter<"CalendarConnection"> | string
    accessToken?: StringWithAggregatesFilter<"CalendarConnection"> | string
    refreshToken?: StringNullableWithAggregatesFilter<"CalendarConnection"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"CalendarConnection"> | Date | string | null
    email?: StringWithAggregatesFilter<"CalendarConnection"> | string
    isPrimary?: BoolWithAggregatesFilter<"CalendarConnection"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"CalendarConnection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CalendarConnection"> | Date | string
    userId?: StringWithAggregatesFilter<"CalendarConnection"> | string
  }

  export type WebhookWhereInput = {
    AND?: WebhookWhereInput | WebhookWhereInput[]
    OR?: WebhookWhereInput[]
    NOT?: WebhookWhereInput | WebhookWhereInput[]
    id?: StringFilter<"Webhook"> | string
    url?: StringFilter<"Webhook"> | string
    eventTriggers?: StringNullableListFilter<"Webhook">
    active?: BoolFilter<"Webhook"> | boolean
    secret?: StringFilter<"Webhook"> | string
    createdAt?: DateTimeFilter<"Webhook"> | Date | string
    updatedAt?: DateTimeFilter<"Webhook"> | Date | string
    userId?: StringFilter<"Webhook"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    deliveries?: WebhookDeliveryListRelationFilter
  }

  export type WebhookOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    eventTriggers?: SortOrder
    active?: SortOrder
    secret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    user?: UserOrderByWithRelationInput
    deliveries?: WebhookDeliveryOrderByRelationAggregateInput
  }

  export type WebhookWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WebhookWhereInput | WebhookWhereInput[]
    OR?: WebhookWhereInput[]
    NOT?: WebhookWhereInput | WebhookWhereInput[]
    url?: StringFilter<"Webhook"> | string
    eventTriggers?: StringNullableListFilter<"Webhook">
    active?: BoolFilter<"Webhook"> | boolean
    secret?: StringFilter<"Webhook"> | string
    createdAt?: DateTimeFilter<"Webhook"> | Date | string
    updatedAt?: DateTimeFilter<"Webhook"> | Date | string
    userId?: StringFilter<"Webhook"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    deliveries?: WebhookDeliveryListRelationFilter
  }, "id">

  export type WebhookOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    eventTriggers?: SortOrder
    active?: SortOrder
    secret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    _count?: WebhookCountOrderByAggregateInput
    _max?: WebhookMaxOrderByAggregateInput
    _min?: WebhookMinOrderByAggregateInput
  }

  export type WebhookScalarWhereWithAggregatesInput = {
    AND?: WebhookScalarWhereWithAggregatesInput | WebhookScalarWhereWithAggregatesInput[]
    OR?: WebhookScalarWhereWithAggregatesInput[]
    NOT?: WebhookScalarWhereWithAggregatesInput | WebhookScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Webhook"> | string
    url?: StringWithAggregatesFilter<"Webhook"> | string
    eventTriggers?: StringNullableListFilter<"Webhook">
    active?: BoolWithAggregatesFilter<"Webhook"> | boolean
    secret?: StringWithAggregatesFilter<"Webhook"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Webhook"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Webhook"> | Date | string
    userId?: StringWithAggregatesFilter<"Webhook"> | string
  }

  export type WebhookDeliveryWhereInput = {
    AND?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    OR?: WebhookDeliveryWhereInput[]
    NOT?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    id?: StringFilter<"WebhookDelivery"> | string
    event?: StringFilter<"WebhookDelivery"> | string
    payload?: JsonFilter<"WebhookDelivery">
    statusCode?: IntNullableFilter<"WebhookDelivery"> | number | null
    error?: StringNullableFilter<"WebhookDelivery"> | string | null
    createdAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    updatedAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    webhookId?: StringFilter<"WebhookDelivery"> | string
    webhook?: XOR<WebhookScalarRelationFilter, WebhookWhereInput>
  }

  export type WebhookDeliveryOrderByWithRelationInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    statusCode?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    webhookId?: SortOrder
    webhook?: WebhookOrderByWithRelationInput
  }

  export type WebhookDeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    OR?: WebhookDeliveryWhereInput[]
    NOT?: WebhookDeliveryWhereInput | WebhookDeliveryWhereInput[]
    event?: StringFilter<"WebhookDelivery"> | string
    payload?: JsonFilter<"WebhookDelivery">
    statusCode?: IntNullableFilter<"WebhookDelivery"> | number | null
    error?: StringNullableFilter<"WebhookDelivery"> | string | null
    createdAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    updatedAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    webhookId?: StringFilter<"WebhookDelivery"> | string
    webhook?: XOR<WebhookScalarRelationFilter, WebhookWhereInput>
  }, "id">

  export type WebhookDeliveryOrderByWithAggregationInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    statusCode?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    webhookId?: SortOrder
    _count?: WebhookDeliveryCountOrderByAggregateInput
    _avg?: WebhookDeliveryAvgOrderByAggregateInput
    _max?: WebhookDeliveryMaxOrderByAggregateInput
    _min?: WebhookDeliveryMinOrderByAggregateInput
    _sum?: WebhookDeliverySumOrderByAggregateInput
  }

  export type WebhookDeliveryScalarWhereWithAggregatesInput = {
    AND?: WebhookDeliveryScalarWhereWithAggregatesInput | WebhookDeliveryScalarWhereWithAggregatesInput[]
    OR?: WebhookDeliveryScalarWhereWithAggregatesInput[]
    NOT?: WebhookDeliveryScalarWhereWithAggregatesInput | WebhookDeliveryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebhookDelivery"> | string
    event?: StringWithAggregatesFilter<"WebhookDelivery"> | string
    payload?: JsonWithAggregatesFilter<"WebhookDelivery">
    statusCode?: IntNullableWithAggregatesFilter<"WebhookDelivery"> | number | null
    error?: StringNullableWithAggregatesFilter<"WebhookDelivery"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WebhookDelivery"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WebhookDelivery"> | Date | string
    webhookId?: StringWithAggregatesFilter<"WebhookDelivery"> | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventTypeCreateInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutEventTypesInput
    schedule?: ScheduleCreateNestedOneWithoutEventTypesInput
    team?: TeamCreateNestedOneWithoutEventTypesInput
    bookings?: BookingCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeUncheckedCreateInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    scheduleId?: string | null
    teamId?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEventTypesNestedInput
    schedule?: ScheduleUpdateOneWithoutEventTypesNestedInput
    team?: TeamUpdateOneWithoutEventTypesNestedInput
    bookings?: BookingUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeCreateManyInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    scheduleId?: string | null
    teamId?: string | null
  }

  export type EventTypeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventTypeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingCreateInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBookingsInput
    eventType: EventTypeCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    eventTypeId: string
  }

  export type BookingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput
    eventType?: EventTypeUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingCreateManyInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    eventTypeId: string
  }

  export type BookingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleCreateInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSchedulesInput
    availabilities?: AvailabilityCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    availabilities?: AvailabilityUncheckedCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideUncheckedCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSchedulesNestedInput
    availabilities?: AvailabilityUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    availabilities?: AvailabilityUncheckedUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUncheckedUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleCreateManyInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type ScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AvailabilityCreateInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
    schedule: ScheduleCreateNestedOneWithoutAvailabilitiesInput
  }

  export type AvailabilityUncheckedCreateInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId: string
  }

  export type AvailabilityUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule?: ScheduleUpdateOneRequiredWithoutAvailabilitiesNestedInput
  }

  export type AvailabilityUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: StringFieldUpdateOperationsInput | string
  }

  export type AvailabilityCreateManyInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId: string
  }

  export type AvailabilityUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: StringFieldUpdateOperationsInput | string
  }

  export type DateOverrideCreateInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    schedule: ScheduleCreateNestedOneWithoutDateOverridesInput
  }

  export type DateOverrideUncheckedCreateInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId: string
  }

  export type DateOverrideUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule?: ScheduleUpdateOneRequiredWithoutDateOverridesNestedInput
  }

  export type DateOverrideUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: StringFieldUpdateOperationsInput | string
  }

  export type DateOverrideCreateManyInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId: string
  }

  export type DateOverrideUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DateOverrideUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: StringFieldUpdateOperationsInput | string
  }

  export type TeamCreateInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
    eventTypes?: EventTypeCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
    eventTypes?: EventTypeUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type TeamCreateManyInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberCreateInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeamMembershipsInput
    team: TeamCreateNestedOneWithoutMembersInput
  }

  export type TeamMemberUncheckedCreateInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    teamId: string
  }

  export type TeamMemberUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeamMembershipsNestedInput
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type TeamMemberCreateManyInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    teamId: string
  }

  export type TeamMemberUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type CalendarConnectionCreateInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCalendarConnectionsInput
  }

  export type CalendarConnectionUncheckedCreateInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type CalendarConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCalendarConnectionsNestedInput
  }

  export type CalendarConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type CalendarConnectionCreateManyInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type CalendarConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookCreateInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWebhooksInput
    deliveries?: WebhookDeliveryCreateNestedManyWithoutWebhookInput
  }

  export type WebhookUncheckedCreateInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    deliveries?: WebhookDeliveryUncheckedCreateNestedManyWithoutWebhookInput
  }

  export type WebhookUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWebhooksNestedInput
    deliveries?: WebhookDeliveryUpdateManyWithoutWebhookNestedInput
  }

  export type WebhookUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    deliveries?: WebhookDeliveryUncheckedUpdateManyWithoutWebhookNestedInput
  }

  export type WebhookCreateManyInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type WebhookUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookDeliveryCreateInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    webhook: WebhookCreateNestedOneWithoutDeliveriesInput
  }

  export type WebhookDeliveryUncheckedCreateInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    webhookId: string
  }

  export type WebhookDeliveryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhook?: WebhookUpdateOneRequiredWithoutDeliveriesNestedInput
  }

  export type WebhookDeliveryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhookId?: StringFieldUpdateOperationsInput | string
  }

  export type WebhookDeliveryCreateManyInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    webhookId: string
  }

  export type WebhookDeliveryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookDeliveryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhookId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expiresAt?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refreshToken?: SortOrder
    accessToken?: SortOrder
    expiresAt?: SortOrder
    tokenType?: SortOrder
    scope?: SortOrder
    idToken?: SortOrder
    sessionState?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expiresAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type EventTypeListRelationFilter = {
    every?: EventTypeWhereInput
    some?: EventTypeWhereInput
    none?: EventTypeWhereInput
  }

  export type BookingListRelationFilter = {
    every?: BookingWhereInput
    some?: BookingWhereInput
    none?: BookingWhereInput
  }

  export type ScheduleListRelationFilter = {
    every?: ScheduleWhereInput
    some?: ScheduleWhereInput
    none?: ScheduleWhereInput
  }

  export type TeamMemberListRelationFilter = {
    every?: TeamMemberWhereInput
    some?: TeamMemberWhereInput
    none?: TeamMemberWhereInput
  }

  export type CalendarConnectionListRelationFilter = {
    every?: CalendarConnectionWhereInput
    some?: CalendarConnectionWhereInput
    none?: CalendarConnectionWhereInput
  }

  export type WebhookListRelationFilter = {
    every?: WebhookWhereInput
    some?: WebhookWhereInput
    none?: WebhookWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventTypeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BookingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScheduleOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TeamMemberOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CalendarConnectionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WebhookOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    image?: SortOrder
    timezone?: SortOrder
    weekStart?: SortOrder
    bio?: SortOrder
    theme?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    weekStart?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    image?: SortOrder
    timezone?: SortOrder
    weekStart?: SortOrder
    bio?: SortOrder
    theme?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    name?: SortOrder
    image?: SortOrder
    timezone?: SortOrder
    weekStart?: SortOrder
    bio?: SortOrder
    theme?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    weekStart?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumSchedulingTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SchedulingType | EnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel> | $Enums.SchedulingType | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type ScheduleNullableScalarRelationFilter = {
    is?: ScheduleWhereInput | null
    isNot?: ScheduleWhereInput | null
  }

  export type TeamNullableScalarRelationFilter = {
    is?: TeamWhereInput | null
    isNot?: TeamWhereInput | null
  }

  export type EventTypeUserIdSlugCompoundUniqueInput = {
    userId: string
    slug: string
  }

  export type EventTypeCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    isActive?: SortOrder
    requiresConfirmation?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrder
    maxBookingsPerDay?: SortOrder
    maxBookingsPerWeek?: SortOrder
    futureLimit?: SortOrder
    color?: SortOrder
    customQuestions?: SortOrder
    recurringEnabled?: SortOrder
    recurringFrequency?: SortOrder
    schedulingType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    teamId?: SortOrder
  }

  export type EventTypeAvgOrderByAggregateInput = {
    duration?: SortOrder
    price?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrder
    maxBookingsPerDay?: SortOrder
    maxBookingsPerWeek?: SortOrder
    futureLimit?: SortOrder
  }

  export type EventTypeMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    isActive?: SortOrder
    requiresConfirmation?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrder
    maxBookingsPerDay?: SortOrder
    maxBookingsPerWeek?: SortOrder
    futureLimit?: SortOrder
    color?: SortOrder
    recurringEnabled?: SortOrder
    recurringFrequency?: SortOrder
    schedulingType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    teamId?: SortOrder
  }

  export type EventTypeMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    description?: SortOrder
    duration?: SortOrder
    isActive?: SortOrder
    requiresConfirmation?: SortOrder
    price?: SortOrder
    currency?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrder
    maxBookingsPerDay?: SortOrder
    maxBookingsPerWeek?: SortOrder
    futureLimit?: SortOrder
    color?: SortOrder
    recurringEnabled?: SortOrder
    recurringFrequency?: SortOrder
    schedulingType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    scheduleId?: SortOrder
    teamId?: SortOrder
  }

  export type EventTypeSumOrderByAggregateInput = {
    duration?: SortOrder
    price?: SortOrder
    minimumNotice?: SortOrder
    beforeBuffer?: SortOrder
    afterBuffer?: SortOrder
    slotInterval?: SortOrder
    maxBookingsPerDay?: SortOrder
    maxBookingsPerWeek?: SortOrder
    futureLimit?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumSchedulingTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SchedulingType | EnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSchedulingTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SchedulingType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel>
  }

  export type EnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type EventTypeScalarRelationFilter = {
    is?: EventTypeWhereInput
    isNot?: EventTypeWhereInput
  }

  export type BookingCountOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    title?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    attendeeName?: SortOrder
    attendeeEmail?: SortOrder
    attendeeTimezone?: SortOrder
    attendeeNotes?: SortOrder
    meetingUrl?: SortOrder
    location?: SortOrder
    responses?: SortOrder
    cancellationReason?: SortOrder
    recurringEventId?: SortOrder
    calendarEventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    eventTypeId?: SortOrder
  }

  export type BookingMaxOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    title?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    attendeeName?: SortOrder
    attendeeEmail?: SortOrder
    attendeeTimezone?: SortOrder
    attendeeNotes?: SortOrder
    meetingUrl?: SortOrder
    location?: SortOrder
    cancellationReason?: SortOrder
    recurringEventId?: SortOrder
    calendarEventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    eventTypeId?: SortOrder
  }

  export type BookingMinOrderByAggregateInput = {
    id?: SortOrder
    uid?: SortOrder
    title?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    status?: SortOrder
    attendeeName?: SortOrder
    attendeeEmail?: SortOrder
    attendeeTimezone?: SortOrder
    attendeeNotes?: SortOrder
    meetingUrl?: SortOrder
    location?: SortOrder
    cancellationReason?: SortOrder
    recurringEventId?: SortOrder
    calendarEventId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    eventTypeId?: SortOrder
  }

  export type EnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type AvailabilityListRelationFilter = {
    every?: AvailabilityWhereInput
    some?: AvailabilityWhereInput
    none?: AvailabilityWhereInput
  }

  export type DateOverrideListRelationFilter = {
    every?: DateOverrideWhereInput
    some?: DateOverrideWhereInput
    none?: DateOverrideWhereInput
  }

  export type AvailabilityOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DateOverrideOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isDefault?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isDefault?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isDefault?: SortOrder
    timezone?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type ScheduleScalarRelationFilter = {
    is?: ScheduleWhereInput
    isNot?: ScheduleWhereInput
  }

  export type AvailabilityCountOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type AvailabilityAvgOrderByAggregateInput = {
    day?: SortOrder
  }

  export type AvailabilityMaxOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type AvailabilityMinOrderByAggregateInput = {
    id?: SortOrder
    day?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type AvailabilitySumOrderByAggregateInput = {
    day?: SortOrder
  }

  export type DateOverrideCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isUnavailable?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type DateOverrideMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isUnavailable?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type DateOverrideMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    startTime?: SortOrder
    endTime?: SortOrder
    isUnavailable?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    scheduleId?: SortOrder
  }

  export type TeamCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TeamMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    logoUrl?: SortOrder
    bio?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole
  }

  export type TeamScalarRelationFilter = {
    is?: TeamWhereInput
    isNot?: TeamWhereInput
  }

  export type TeamMemberUserIdTeamIdCompoundUniqueInput = {
    userId: string
    teamId: string
  }

  export type TeamMemberCountOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    accepted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    teamId?: SortOrder
  }

  export type TeamMemberMaxOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    accepted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    teamId?: SortOrder
  }

  export type TeamMemberMinOrderByAggregateInput = {
    id?: SortOrder
    role?: SortOrder
    accepted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
    teamId?: SortOrder
  }

  export type EnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamRoleFilter<$PrismaModel>
    _max?: NestedEnumTeamRoleFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type CalendarConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type CalendarConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type CalendarConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    expiresAt?: SortOrder
    email?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type WebhookDeliveryListRelationFilter = {
    every?: WebhookDeliveryWhereInput
    some?: WebhookDeliveryWhereInput
    none?: WebhookDeliveryWhereInput
  }

  export type WebhookDeliveryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WebhookCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    eventTriggers?: SortOrder
    active?: SortOrder
    secret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type WebhookMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    active?: SortOrder
    secret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }

  export type WebhookMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    active?: SortOrder
    secret?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userId?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type WebhookScalarRelationFilter = {
    is?: WebhookWhereInput
    isNot?: WebhookWhereInput
  }

  export type WebhookDeliveryCountOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    payload?: SortOrder
    statusCode?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    webhookId?: SortOrder
  }

  export type WebhookDeliveryAvgOrderByAggregateInput = {
    statusCode?: SortOrder
  }

  export type WebhookDeliveryMaxOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    statusCode?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    webhookId?: SortOrder
  }

  export type WebhookDeliveryMinOrderByAggregateInput = {
    id?: SortOrder
    event?: SortOrder
    statusCode?: SortOrder
    error?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    webhookId?: SortOrder
  }

  export type WebhookDeliverySumOrderByAggregateInput = {
    statusCode?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type EventTypeCreateNestedManyWithoutUserInput = {
    create?: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput> | EventTypeCreateWithoutUserInput[] | EventTypeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutUserInput | EventTypeCreateOrConnectWithoutUserInput[]
    createMany?: EventTypeCreateManyUserInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type BookingCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type ScheduleCreateNestedManyWithoutUserInput = {
    create?: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput> | ScheduleCreateWithoutUserInput[] | ScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutUserInput | ScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ScheduleCreateManyUserInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type TeamMemberCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type CalendarConnectionCreateNestedManyWithoutUserInput = {
    create?: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput> | CalendarConnectionCreateWithoutUserInput[] | CalendarConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CalendarConnectionCreateOrConnectWithoutUserInput | CalendarConnectionCreateOrConnectWithoutUserInput[]
    createMany?: CalendarConnectionCreateManyUserInputEnvelope
    connect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
  }

  export type WebhookCreateNestedManyWithoutUserInput = {
    create?: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput> | WebhookCreateWithoutUserInput[] | WebhookUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebhookCreateOrConnectWithoutUserInput | WebhookCreateOrConnectWithoutUserInput[]
    createMany?: WebhookCreateManyUserInputEnvelope
    connect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type EventTypeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput> | EventTypeCreateWithoutUserInput[] | EventTypeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutUserInput | EventTypeCreateOrConnectWithoutUserInput[]
    createMany?: EventTypeCreateManyUserInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type ScheduleUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput> | ScheduleCreateWithoutUserInput[] | ScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutUserInput | ScheduleCreateOrConnectWithoutUserInput[]
    createMany?: ScheduleCreateManyUserInputEnvelope
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type CalendarConnectionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput> | CalendarConnectionCreateWithoutUserInput[] | CalendarConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CalendarConnectionCreateOrConnectWithoutUserInput | CalendarConnectionCreateOrConnectWithoutUserInput[]
    createMany?: CalendarConnectionCreateManyUserInputEnvelope
    connect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
  }

  export type WebhookUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput> | WebhookCreateWithoutUserInput[] | WebhookUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebhookCreateOrConnectWithoutUserInput | WebhookCreateOrConnectWithoutUserInput[]
    createMany?: WebhookCreateManyUserInputEnvelope
    connect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type EventTypeUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput> | EventTypeCreateWithoutUserInput[] | EventTypeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutUserInput | EventTypeCreateOrConnectWithoutUserInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutUserInput | EventTypeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventTypeCreateManyUserInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutUserInput | EventTypeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutUserInput | EventTypeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type BookingUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type ScheduleUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput> | ScheduleCreateWithoutUserInput[] | ScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutUserInput | ScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutUserInput | ScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScheduleCreateManyUserInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutUserInput | ScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutUserInput | ScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type TeamMemberUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type CalendarConnectionUpdateManyWithoutUserNestedInput = {
    create?: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput> | CalendarConnectionCreateWithoutUserInput[] | CalendarConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CalendarConnectionCreateOrConnectWithoutUserInput | CalendarConnectionCreateOrConnectWithoutUserInput[]
    upsert?: CalendarConnectionUpsertWithWhereUniqueWithoutUserInput | CalendarConnectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CalendarConnectionCreateManyUserInputEnvelope
    set?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    disconnect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    delete?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    connect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    update?: CalendarConnectionUpdateWithWhereUniqueWithoutUserInput | CalendarConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CalendarConnectionUpdateManyWithWhereWithoutUserInput | CalendarConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CalendarConnectionScalarWhereInput | CalendarConnectionScalarWhereInput[]
  }

  export type WebhookUpdateManyWithoutUserNestedInput = {
    create?: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput> | WebhookCreateWithoutUserInput[] | WebhookUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebhookCreateOrConnectWithoutUserInput | WebhookCreateOrConnectWithoutUserInput[]
    upsert?: WebhookUpsertWithWhereUniqueWithoutUserInput | WebhookUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WebhookCreateManyUserInputEnvelope
    set?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    disconnect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    delete?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    connect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    update?: WebhookUpdateWithWhereUniqueWithoutUserInput | WebhookUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WebhookUpdateManyWithWhereWithoutUserInput | WebhookUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WebhookScalarWhereInput | WebhookScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type EventTypeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput> | EventTypeCreateWithoutUserInput[] | EventTypeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutUserInput | EventTypeCreateOrConnectWithoutUserInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutUserInput | EventTypeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: EventTypeCreateManyUserInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutUserInput | EventTypeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutUserInput | EventTypeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput> | BookingCreateWithoutUserInput[] | BookingUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutUserInput | BookingCreateOrConnectWithoutUserInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutUserInput | BookingUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BookingCreateManyUserInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutUserInput | BookingUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutUserInput | BookingUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type ScheduleUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput> | ScheduleCreateWithoutUserInput[] | ScheduleUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ScheduleCreateOrConnectWithoutUserInput | ScheduleCreateOrConnectWithoutUserInput[]
    upsert?: ScheduleUpsertWithWhereUniqueWithoutUserInput | ScheduleUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ScheduleCreateManyUserInputEnvelope
    set?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    disconnect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    delete?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    connect?: ScheduleWhereUniqueInput | ScheduleWhereUniqueInput[]
    update?: ScheduleUpdateWithWhereUniqueWithoutUserInput | ScheduleUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ScheduleUpdateManyWithWhereWithoutUserInput | ScheduleUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput> | TeamMemberCreateWithoutUserInput[] | TeamMemberUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutUserInput | TeamMemberCreateOrConnectWithoutUserInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutUserInput | TeamMemberUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TeamMemberCreateManyUserInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutUserInput | TeamMemberUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutUserInput | TeamMemberUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput> | CalendarConnectionCreateWithoutUserInput[] | CalendarConnectionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CalendarConnectionCreateOrConnectWithoutUserInput | CalendarConnectionCreateOrConnectWithoutUserInput[]
    upsert?: CalendarConnectionUpsertWithWhereUniqueWithoutUserInput | CalendarConnectionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CalendarConnectionCreateManyUserInputEnvelope
    set?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    disconnect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    delete?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    connect?: CalendarConnectionWhereUniqueInput | CalendarConnectionWhereUniqueInput[]
    update?: CalendarConnectionUpdateWithWhereUniqueWithoutUserInput | CalendarConnectionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CalendarConnectionUpdateManyWithWhereWithoutUserInput | CalendarConnectionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CalendarConnectionScalarWhereInput | CalendarConnectionScalarWhereInput[]
  }

  export type WebhookUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput> | WebhookCreateWithoutUserInput[] | WebhookUncheckedCreateWithoutUserInput[]
    connectOrCreate?: WebhookCreateOrConnectWithoutUserInput | WebhookCreateOrConnectWithoutUserInput[]
    upsert?: WebhookUpsertWithWhereUniqueWithoutUserInput | WebhookUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: WebhookCreateManyUserInputEnvelope
    set?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    disconnect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    delete?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    connect?: WebhookWhereUniqueInput | WebhookWhereUniqueInput[]
    update?: WebhookUpdateWithWhereUniqueWithoutUserInput | WebhookUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: WebhookUpdateManyWithWhereWithoutUserInput | WebhookUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: WebhookScalarWhereInput | WebhookScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutEventTypesInput = {
    create?: XOR<UserCreateWithoutEventTypesInput, UserUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventTypesInput
    connect?: UserWhereUniqueInput
  }

  export type ScheduleCreateNestedOneWithoutEventTypesInput = {
    create?: XOR<ScheduleCreateWithoutEventTypesInput, ScheduleUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutEventTypesInput
    connect?: ScheduleWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutEventTypesInput = {
    create?: XOR<TeamCreateWithoutEventTypesInput, TeamUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutEventTypesInput
    connect?: TeamWhereUniqueInput
  }

  export type BookingCreateNestedManyWithoutEventTypeInput = {
    create?: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput> | BookingCreateWithoutEventTypeInput[] | BookingUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutEventTypeInput | BookingCreateOrConnectWithoutEventTypeInput[]
    createMany?: BookingCreateManyEventTypeInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type BookingUncheckedCreateNestedManyWithoutEventTypeInput = {
    create?: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput> | BookingCreateWithoutEventTypeInput[] | BookingUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutEventTypeInput | BookingCreateOrConnectWithoutEventTypeInput[]
    createMany?: BookingCreateManyEventTypeInputEnvelope
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableEnumSchedulingTypeFieldUpdateOperationsInput = {
    set?: $Enums.SchedulingType | null
  }

  export type UserUpdateOneWithoutEventTypesNestedInput = {
    create?: XOR<UserCreateWithoutEventTypesInput, UserUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: UserCreateOrConnectWithoutEventTypesInput
    upsert?: UserUpsertWithoutEventTypesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutEventTypesInput, UserUpdateWithoutEventTypesInput>, UserUncheckedUpdateWithoutEventTypesInput>
  }

  export type ScheduleUpdateOneWithoutEventTypesNestedInput = {
    create?: XOR<ScheduleCreateWithoutEventTypesInput, ScheduleUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutEventTypesInput
    upsert?: ScheduleUpsertWithoutEventTypesInput
    disconnect?: ScheduleWhereInput | boolean
    delete?: ScheduleWhereInput | boolean
    connect?: ScheduleWhereUniqueInput
    update?: XOR<XOR<ScheduleUpdateToOneWithWhereWithoutEventTypesInput, ScheduleUpdateWithoutEventTypesInput>, ScheduleUncheckedUpdateWithoutEventTypesInput>
  }

  export type TeamUpdateOneWithoutEventTypesNestedInput = {
    create?: XOR<TeamCreateWithoutEventTypesInput, TeamUncheckedCreateWithoutEventTypesInput>
    connectOrCreate?: TeamCreateOrConnectWithoutEventTypesInput
    upsert?: TeamUpsertWithoutEventTypesInput
    disconnect?: TeamWhereInput | boolean
    delete?: TeamWhereInput | boolean
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutEventTypesInput, TeamUpdateWithoutEventTypesInput>, TeamUncheckedUpdateWithoutEventTypesInput>
  }

  export type BookingUpdateManyWithoutEventTypeNestedInput = {
    create?: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput> | BookingCreateWithoutEventTypeInput[] | BookingUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutEventTypeInput | BookingCreateOrConnectWithoutEventTypeInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutEventTypeInput | BookingUpsertWithWhereUniqueWithoutEventTypeInput[]
    createMany?: BookingCreateManyEventTypeInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutEventTypeInput | BookingUpdateWithWhereUniqueWithoutEventTypeInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutEventTypeInput | BookingUpdateManyWithWhereWithoutEventTypeInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type BookingUncheckedUpdateManyWithoutEventTypeNestedInput = {
    create?: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput> | BookingCreateWithoutEventTypeInput[] | BookingUncheckedCreateWithoutEventTypeInput[]
    connectOrCreate?: BookingCreateOrConnectWithoutEventTypeInput | BookingCreateOrConnectWithoutEventTypeInput[]
    upsert?: BookingUpsertWithWhereUniqueWithoutEventTypeInput | BookingUpsertWithWhereUniqueWithoutEventTypeInput[]
    createMany?: BookingCreateManyEventTypeInputEnvelope
    set?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    disconnect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    delete?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    connect?: BookingWhereUniqueInput | BookingWhereUniqueInput[]
    update?: BookingUpdateWithWhereUniqueWithoutEventTypeInput | BookingUpdateWithWhereUniqueWithoutEventTypeInput[]
    updateMany?: BookingUpdateManyWithWhereWithoutEventTypeInput | BookingUpdateManyWithWhereWithoutEventTypeInput[]
    deleteMany?: BookingScalarWhereInput | BookingScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBookingsInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    connect?: UserWhereUniqueInput
  }

  export type EventTypeCreateNestedOneWithoutBookingsInput = {
    create?: XOR<EventTypeCreateWithoutBookingsInput, EventTypeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: EventTypeCreateOrConnectWithoutBookingsInput
    connect?: EventTypeWhereUniqueInput
  }

  export type EnumBookingStatusFieldUpdateOperationsInput = {
    set?: $Enums.BookingStatus
  }

  export type UserUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBookingsInput
    upsert?: UserUpsertWithoutBookingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBookingsInput, UserUpdateWithoutBookingsInput>, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type EventTypeUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: XOR<EventTypeCreateWithoutBookingsInput, EventTypeUncheckedCreateWithoutBookingsInput>
    connectOrCreate?: EventTypeCreateOrConnectWithoutBookingsInput
    upsert?: EventTypeUpsertWithoutBookingsInput
    connect?: EventTypeWhereUniqueInput
    update?: XOR<XOR<EventTypeUpdateToOneWithWhereWithoutBookingsInput, EventTypeUpdateWithoutBookingsInput>, EventTypeUncheckedUpdateWithoutBookingsInput>
  }

  export type UserCreateNestedOneWithoutSchedulesInput = {
    create?: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSchedulesInput
    connect?: UserWhereUniqueInput
  }

  export type AvailabilityCreateNestedManyWithoutScheduleInput = {
    create?: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput> | AvailabilityCreateWithoutScheduleInput[] | AvailabilityUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutScheduleInput | AvailabilityCreateOrConnectWithoutScheduleInput[]
    createMany?: AvailabilityCreateManyScheduleInputEnvelope
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
  }

  export type DateOverrideCreateNestedManyWithoutScheduleInput = {
    create?: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput> | DateOverrideCreateWithoutScheduleInput[] | DateOverrideUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DateOverrideCreateOrConnectWithoutScheduleInput | DateOverrideCreateOrConnectWithoutScheduleInput[]
    createMany?: DateOverrideCreateManyScheduleInputEnvelope
    connect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
  }

  export type EventTypeCreateNestedManyWithoutScheduleInput = {
    create?: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput> | EventTypeCreateWithoutScheduleInput[] | EventTypeUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutScheduleInput | EventTypeCreateOrConnectWithoutScheduleInput[]
    createMany?: EventTypeCreateManyScheduleInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type AvailabilityUncheckedCreateNestedManyWithoutScheduleInput = {
    create?: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput> | AvailabilityCreateWithoutScheduleInput[] | AvailabilityUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutScheduleInput | AvailabilityCreateOrConnectWithoutScheduleInput[]
    createMany?: AvailabilityCreateManyScheduleInputEnvelope
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
  }

  export type DateOverrideUncheckedCreateNestedManyWithoutScheduleInput = {
    create?: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput> | DateOverrideCreateWithoutScheduleInput[] | DateOverrideUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DateOverrideCreateOrConnectWithoutScheduleInput | DateOverrideCreateOrConnectWithoutScheduleInput[]
    createMany?: DateOverrideCreateManyScheduleInputEnvelope
    connect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
  }

  export type EventTypeUncheckedCreateNestedManyWithoutScheduleInput = {
    create?: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput> | EventTypeCreateWithoutScheduleInput[] | EventTypeUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutScheduleInput | EventTypeCreateOrConnectWithoutScheduleInput[]
    createMany?: EventTypeCreateManyScheduleInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutSchedulesNestedInput = {
    create?: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    connectOrCreate?: UserCreateOrConnectWithoutSchedulesInput
    upsert?: UserUpsertWithoutSchedulesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSchedulesInput, UserUpdateWithoutSchedulesInput>, UserUncheckedUpdateWithoutSchedulesInput>
  }

  export type AvailabilityUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput> | AvailabilityCreateWithoutScheduleInput[] | AvailabilityUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutScheduleInput | AvailabilityCreateOrConnectWithoutScheduleInput[]
    upsert?: AvailabilityUpsertWithWhereUniqueWithoutScheduleInput | AvailabilityUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: AvailabilityCreateManyScheduleInputEnvelope
    set?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    disconnect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    delete?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    update?: AvailabilityUpdateWithWhereUniqueWithoutScheduleInput | AvailabilityUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: AvailabilityUpdateManyWithWhereWithoutScheduleInput | AvailabilityUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
  }

  export type DateOverrideUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput> | DateOverrideCreateWithoutScheduleInput[] | DateOverrideUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DateOverrideCreateOrConnectWithoutScheduleInput | DateOverrideCreateOrConnectWithoutScheduleInput[]
    upsert?: DateOverrideUpsertWithWhereUniqueWithoutScheduleInput | DateOverrideUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: DateOverrideCreateManyScheduleInputEnvelope
    set?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    disconnect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    delete?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    connect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    update?: DateOverrideUpdateWithWhereUniqueWithoutScheduleInput | DateOverrideUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: DateOverrideUpdateManyWithWhereWithoutScheduleInput | DateOverrideUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: DateOverrideScalarWhereInput | DateOverrideScalarWhereInput[]
  }

  export type EventTypeUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput> | EventTypeCreateWithoutScheduleInput[] | EventTypeUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutScheduleInput | EventTypeCreateOrConnectWithoutScheduleInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutScheduleInput | EventTypeUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: EventTypeCreateManyScheduleInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutScheduleInput | EventTypeUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutScheduleInput | EventTypeUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type AvailabilityUncheckedUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput> | AvailabilityCreateWithoutScheduleInput[] | AvailabilityUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: AvailabilityCreateOrConnectWithoutScheduleInput | AvailabilityCreateOrConnectWithoutScheduleInput[]
    upsert?: AvailabilityUpsertWithWhereUniqueWithoutScheduleInput | AvailabilityUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: AvailabilityCreateManyScheduleInputEnvelope
    set?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    disconnect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    delete?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    connect?: AvailabilityWhereUniqueInput | AvailabilityWhereUniqueInput[]
    update?: AvailabilityUpdateWithWhereUniqueWithoutScheduleInput | AvailabilityUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: AvailabilityUpdateManyWithWhereWithoutScheduleInput | AvailabilityUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
  }

  export type DateOverrideUncheckedUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput> | DateOverrideCreateWithoutScheduleInput[] | DateOverrideUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: DateOverrideCreateOrConnectWithoutScheduleInput | DateOverrideCreateOrConnectWithoutScheduleInput[]
    upsert?: DateOverrideUpsertWithWhereUniqueWithoutScheduleInput | DateOverrideUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: DateOverrideCreateManyScheduleInputEnvelope
    set?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    disconnect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    delete?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    connect?: DateOverrideWhereUniqueInput | DateOverrideWhereUniqueInput[]
    update?: DateOverrideUpdateWithWhereUniqueWithoutScheduleInput | DateOverrideUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: DateOverrideUpdateManyWithWhereWithoutScheduleInput | DateOverrideUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: DateOverrideScalarWhereInput | DateOverrideScalarWhereInput[]
  }

  export type EventTypeUncheckedUpdateManyWithoutScheduleNestedInput = {
    create?: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput> | EventTypeCreateWithoutScheduleInput[] | EventTypeUncheckedCreateWithoutScheduleInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutScheduleInput | EventTypeCreateOrConnectWithoutScheduleInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutScheduleInput | EventTypeUpsertWithWhereUniqueWithoutScheduleInput[]
    createMany?: EventTypeCreateManyScheduleInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutScheduleInput | EventTypeUpdateWithWhereUniqueWithoutScheduleInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutScheduleInput | EventTypeUpdateManyWithWhereWithoutScheduleInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type ScheduleCreateNestedOneWithoutAvailabilitiesInput = {
    create?: XOR<ScheduleCreateWithoutAvailabilitiesInput, ScheduleUncheckedCreateWithoutAvailabilitiesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutAvailabilitiesInput
    connect?: ScheduleWhereUniqueInput
  }

  export type ScheduleUpdateOneRequiredWithoutAvailabilitiesNestedInput = {
    create?: XOR<ScheduleCreateWithoutAvailabilitiesInput, ScheduleUncheckedCreateWithoutAvailabilitiesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutAvailabilitiesInput
    upsert?: ScheduleUpsertWithoutAvailabilitiesInput
    connect?: ScheduleWhereUniqueInput
    update?: XOR<XOR<ScheduleUpdateToOneWithWhereWithoutAvailabilitiesInput, ScheduleUpdateWithoutAvailabilitiesInput>, ScheduleUncheckedUpdateWithoutAvailabilitiesInput>
  }

  export type ScheduleCreateNestedOneWithoutDateOverridesInput = {
    create?: XOR<ScheduleCreateWithoutDateOverridesInput, ScheduleUncheckedCreateWithoutDateOverridesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutDateOverridesInput
    connect?: ScheduleWhereUniqueInput
  }

  export type ScheduleUpdateOneRequiredWithoutDateOverridesNestedInput = {
    create?: XOR<ScheduleCreateWithoutDateOverridesInput, ScheduleUncheckedCreateWithoutDateOverridesInput>
    connectOrCreate?: ScheduleCreateOrConnectWithoutDateOverridesInput
    upsert?: ScheduleUpsertWithoutDateOverridesInput
    connect?: ScheduleWhereUniqueInput
    update?: XOR<XOR<ScheduleUpdateToOneWithWhereWithoutDateOverridesInput, ScheduleUpdateWithoutDateOverridesInput>, ScheduleUncheckedUpdateWithoutDateOverridesInput>
  }

  export type TeamMemberCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type EventTypeCreateNestedManyWithoutTeamInput = {
    create?: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput> | EventTypeCreateWithoutTeamInput[] | EventTypeUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutTeamInput | EventTypeCreateOrConnectWithoutTeamInput[]
    createMany?: EventTypeCreateManyTeamInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type TeamMemberUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
  }

  export type EventTypeUncheckedCreateNestedManyWithoutTeamInput = {
    create?: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput> | EventTypeCreateWithoutTeamInput[] | EventTypeUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutTeamInput | EventTypeCreateOrConnectWithoutTeamInput[]
    createMany?: EventTypeCreateManyTeamInputEnvelope
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
  }

  export type TeamMemberUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type EventTypeUpdateManyWithoutTeamNestedInput = {
    create?: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput> | EventTypeCreateWithoutTeamInput[] | EventTypeUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutTeamInput | EventTypeCreateOrConnectWithoutTeamInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutTeamInput | EventTypeUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: EventTypeCreateManyTeamInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutTeamInput | EventTypeUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutTeamInput | EventTypeUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput> | TeamMemberCreateWithoutTeamInput[] | TeamMemberUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: TeamMemberCreateOrConnectWithoutTeamInput | TeamMemberCreateOrConnectWithoutTeamInput[]
    upsert?: TeamMemberUpsertWithWhereUniqueWithoutTeamInput | TeamMemberUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: TeamMemberCreateManyTeamInputEnvelope
    set?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    disconnect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    delete?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    connect?: TeamMemberWhereUniqueInput | TeamMemberWhereUniqueInput[]
    update?: TeamMemberUpdateWithWhereUniqueWithoutTeamInput | TeamMemberUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: TeamMemberUpdateManyWithWhereWithoutTeamInput | TeamMemberUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
  }

  export type EventTypeUncheckedUpdateManyWithoutTeamNestedInput = {
    create?: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput> | EventTypeCreateWithoutTeamInput[] | EventTypeUncheckedCreateWithoutTeamInput[]
    connectOrCreate?: EventTypeCreateOrConnectWithoutTeamInput | EventTypeCreateOrConnectWithoutTeamInput[]
    upsert?: EventTypeUpsertWithWhereUniqueWithoutTeamInput | EventTypeUpsertWithWhereUniqueWithoutTeamInput[]
    createMany?: EventTypeCreateManyTeamInputEnvelope
    set?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    disconnect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    delete?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    connect?: EventTypeWhereUniqueInput | EventTypeWhereUniqueInput[]
    update?: EventTypeUpdateWithWhereUniqueWithoutTeamInput | EventTypeUpdateWithWhereUniqueWithoutTeamInput[]
    updateMany?: EventTypeUpdateManyWithWhereWithoutTeamInput | EventTypeUpdateManyWithWhereWithoutTeamInput[]
    deleteMany?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTeamMembershipsInput = {
    create?: XOR<UserCreateWithoutTeamMembershipsInput, UserUncheckedCreateWithoutTeamMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamMembershipsInput
    connect?: UserWhereUniqueInput
  }

  export type TeamCreateNestedOneWithoutMembersInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    connect?: TeamWhereUniqueInput
  }

  export type EnumTeamRoleFieldUpdateOperationsInput = {
    set?: $Enums.TeamRole
  }

  export type UserUpdateOneRequiredWithoutTeamMembershipsNestedInput = {
    create?: XOR<UserCreateWithoutTeamMembershipsInput, UserUncheckedCreateWithoutTeamMembershipsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTeamMembershipsInput
    upsert?: UserUpsertWithoutTeamMembershipsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTeamMembershipsInput, UserUpdateWithoutTeamMembershipsInput>, UserUncheckedUpdateWithoutTeamMembershipsInput>
  }

  export type TeamUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    connectOrCreate?: TeamCreateOrConnectWithoutMembersInput
    upsert?: TeamUpsertWithoutMembersInput
    connect?: TeamWhereUniqueInput
    update?: XOR<XOR<TeamUpdateToOneWithWhereWithoutMembersInput, TeamUpdateWithoutMembersInput>, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type UserCreateNestedOneWithoutCalendarConnectionsInput = {
    create?: XOR<UserCreateWithoutCalendarConnectionsInput, UserUncheckedCreateWithoutCalendarConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCalendarConnectionsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutCalendarConnectionsNestedInput = {
    create?: XOR<UserCreateWithoutCalendarConnectionsInput, UserUncheckedCreateWithoutCalendarConnectionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCalendarConnectionsInput
    upsert?: UserUpsertWithoutCalendarConnectionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCalendarConnectionsInput, UserUpdateWithoutCalendarConnectionsInput>, UserUncheckedUpdateWithoutCalendarConnectionsInput>
  }

  export type WebhookCreateeventTriggersInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<UserCreateWithoutWebhooksInput, UserUncheckedCreateWithoutWebhooksInput>
    connectOrCreate?: UserCreateOrConnectWithoutWebhooksInput
    connect?: UserWhereUniqueInput
  }

  export type WebhookDeliveryCreateNestedManyWithoutWebhookInput = {
    create?: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput> | WebhookDeliveryCreateWithoutWebhookInput[] | WebhookDeliveryUncheckedCreateWithoutWebhookInput[]
    connectOrCreate?: WebhookDeliveryCreateOrConnectWithoutWebhookInput | WebhookDeliveryCreateOrConnectWithoutWebhookInput[]
    createMany?: WebhookDeliveryCreateManyWebhookInputEnvelope
    connect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
  }

  export type WebhookDeliveryUncheckedCreateNestedManyWithoutWebhookInput = {
    create?: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput> | WebhookDeliveryCreateWithoutWebhookInput[] | WebhookDeliveryUncheckedCreateWithoutWebhookInput[]
    connectOrCreate?: WebhookDeliveryCreateOrConnectWithoutWebhookInput | WebhookDeliveryCreateOrConnectWithoutWebhookInput[]
    createMany?: WebhookDeliveryCreateManyWebhookInputEnvelope
    connect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
  }

  export type WebhookUpdateeventTriggersInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UserUpdateOneRequiredWithoutWebhooksNestedInput = {
    create?: XOR<UserCreateWithoutWebhooksInput, UserUncheckedCreateWithoutWebhooksInput>
    connectOrCreate?: UserCreateOrConnectWithoutWebhooksInput
    upsert?: UserUpsertWithoutWebhooksInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWebhooksInput, UserUpdateWithoutWebhooksInput>, UserUncheckedUpdateWithoutWebhooksInput>
  }

  export type WebhookDeliveryUpdateManyWithoutWebhookNestedInput = {
    create?: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput> | WebhookDeliveryCreateWithoutWebhookInput[] | WebhookDeliveryUncheckedCreateWithoutWebhookInput[]
    connectOrCreate?: WebhookDeliveryCreateOrConnectWithoutWebhookInput | WebhookDeliveryCreateOrConnectWithoutWebhookInput[]
    upsert?: WebhookDeliveryUpsertWithWhereUniqueWithoutWebhookInput | WebhookDeliveryUpsertWithWhereUniqueWithoutWebhookInput[]
    createMany?: WebhookDeliveryCreateManyWebhookInputEnvelope
    set?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    disconnect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    delete?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    connect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    update?: WebhookDeliveryUpdateWithWhereUniqueWithoutWebhookInput | WebhookDeliveryUpdateWithWhereUniqueWithoutWebhookInput[]
    updateMany?: WebhookDeliveryUpdateManyWithWhereWithoutWebhookInput | WebhookDeliveryUpdateManyWithWhereWithoutWebhookInput[]
    deleteMany?: WebhookDeliveryScalarWhereInput | WebhookDeliveryScalarWhereInput[]
  }

  export type WebhookDeliveryUncheckedUpdateManyWithoutWebhookNestedInput = {
    create?: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput> | WebhookDeliveryCreateWithoutWebhookInput[] | WebhookDeliveryUncheckedCreateWithoutWebhookInput[]
    connectOrCreate?: WebhookDeliveryCreateOrConnectWithoutWebhookInput | WebhookDeliveryCreateOrConnectWithoutWebhookInput[]
    upsert?: WebhookDeliveryUpsertWithWhereUniqueWithoutWebhookInput | WebhookDeliveryUpsertWithWhereUniqueWithoutWebhookInput[]
    createMany?: WebhookDeliveryCreateManyWebhookInputEnvelope
    set?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    disconnect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    delete?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    connect?: WebhookDeliveryWhereUniqueInput | WebhookDeliveryWhereUniqueInput[]
    update?: WebhookDeliveryUpdateWithWhereUniqueWithoutWebhookInput | WebhookDeliveryUpdateWithWhereUniqueWithoutWebhookInput[]
    updateMany?: WebhookDeliveryUpdateManyWithWhereWithoutWebhookInput | WebhookDeliveryUpdateManyWithWhereWithoutWebhookInput[]
    deleteMany?: WebhookDeliveryScalarWhereInput | WebhookDeliveryScalarWhereInput[]
  }

  export type WebhookCreateNestedOneWithoutDeliveriesInput = {
    create?: XOR<WebhookCreateWithoutDeliveriesInput, WebhookUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: WebhookCreateOrConnectWithoutDeliveriesInput
    connect?: WebhookWhereUniqueInput
  }

  export type WebhookUpdateOneRequiredWithoutDeliveriesNestedInput = {
    create?: XOR<WebhookCreateWithoutDeliveriesInput, WebhookUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: WebhookCreateOrConnectWithoutDeliveriesInput
    upsert?: WebhookUpsertWithoutDeliveriesInput
    connect?: WebhookWhereUniqueInput
    update?: XOR<XOR<WebhookUpdateToOneWithWhereWithoutDeliveriesInput, WebhookUpdateWithoutDeliveriesInput>, WebhookUncheckedUpdateWithoutDeliveriesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumSchedulingTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SchedulingType | EnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel> | $Enums.SchedulingType | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumSchedulingTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SchedulingType | EnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.SchedulingType[] | ListEnumSchedulingTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumSchedulingTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.SchedulingType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumSchedulingTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumBookingStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusFilter<$PrismaModel> | $Enums.BookingStatus
  }

  export type NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BookingStatus | EnumBookingStatusFieldRefInput<$PrismaModel>
    in?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.BookingStatus[] | ListEnumBookingStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumBookingStatusWithAggregatesFilter<$PrismaModel> | $Enums.BookingStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBookingStatusFilter<$PrismaModel>
    _max?: NestedEnumBookingStatusFilter<$PrismaModel>
  }

  export type NestedEnumTeamRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleFilter<$PrismaModel> | $Enums.TeamRole
  }

  export type NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TeamRole | EnumTeamRoleFieldRefInput<$PrismaModel>
    in?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.TeamRole[] | ListEnumTeamRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumTeamRoleWithAggregatesFilter<$PrismaModel> | $Enums.TeamRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTeamRoleFilter<$PrismaModel>
    _max?: NestedEnumTeamRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type EventTypeCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    schedule?: ScheduleCreateNestedOneWithoutEventTypesInput
    team?: TeamCreateNestedOneWithoutEventTypesInput
    bookings?: BookingCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId?: string | null
    teamId?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeCreateOrConnectWithoutUserInput = {
    where: EventTypeWhereUniqueInput
    create: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput>
  }

  export type EventTypeCreateManyUserInputEnvelope = {
    data: EventTypeCreateManyUserInput | EventTypeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BookingCreateWithoutUserInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventType: EventTypeCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutUserInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventTypeId: string
  }

  export type BookingCreateOrConnectWithoutUserInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingCreateManyUserInputEnvelope = {
    data: BookingCreateManyUserInput | BookingCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type ScheduleCreateWithoutUserInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    availabilities?: AvailabilityCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    availabilities?: AvailabilityUncheckedCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideUncheckedCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleCreateOrConnectWithoutUserInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput>
  }

  export type ScheduleCreateManyUserInputEnvelope = {
    data: ScheduleCreateManyUserInput | ScheduleCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberCreateWithoutUserInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    team: TeamCreateNestedOneWithoutMembersInput
  }

  export type TeamMemberUncheckedCreateWithoutUserInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    teamId: string
  }

  export type TeamMemberCreateOrConnectWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberCreateManyUserInputEnvelope = {
    data: TeamMemberCreateManyUserInput | TeamMemberCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type CalendarConnectionCreateWithoutUserInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarConnectionUncheckedCreateWithoutUserInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalendarConnectionCreateOrConnectWithoutUserInput = {
    where: CalendarConnectionWhereUniqueInput
    create: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput>
  }

  export type CalendarConnectionCreateManyUserInputEnvelope = {
    data: CalendarConnectionCreateManyUserInput | CalendarConnectionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type WebhookCreateWithoutUserInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: WebhookDeliveryCreateNestedManyWithoutWebhookInput
  }

  export type WebhookUncheckedCreateWithoutUserInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deliveries?: WebhookDeliveryUncheckedCreateNestedManyWithoutWebhookInput
  }

  export type WebhookCreateOrConnectWithoutUserInput = {
    where: WebhookWhereUniqueInput
    create: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput>
  }

  export type WebhookCreateManyUserInputEnvelope = {
    data: WebhookCreateManyUserInput | WebhookCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refreshToken?: StringNullableFilter<"Account"> | string | null
    accessToken?: StringNullableFilter<"Account"> | string | null
    expiresAt?: IntNullableFilter<"Account"> | number | null
    tokenType?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    idToken?: StringNullableFilter<"Account"> | string | null
    sessionState?: StringNullableFilter<"Account"> | string | null
    createdAt?: DateTimeFilter<"Account"> | Date | string
    updatedAt?: DateTimeFilter<"Account"> | Date | string
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    createdAt?: DateTimeFilter<"Session"> | Date | string
    updatedAt?: DateTimeFilter<"Session"> | Date | string
  }

  export type EventTypeUpsertWithWhereUniqueWithoutUserInput = {
    where: EventTypeWhereUniqueInput
    update: XOR<EventTypeUpdateWithoutUserInput, EventTypeUncheckedUpdateWithoutUserInput>
    create: XOR<EventTypeCreateWithoutUserInput, EventTypeUncheckedCreateWithoutUserInput>
  }

  export type EventTypeUpdateWithWhereUniqueWithoutUserInput = {
    where: EventTypeWhereUniqueInput
    data: XOR<EventTypeUpdateWithoutUserInput, EventTypeUncheckedUpdateWithoutUserInput>
  }

  export type EventTypeUpdateManyWithWhereWithoutUserInput = {
    where: EventTypeScalarWhereInput
    data: XOR<EventTypeUpdateManyMutationInput, EventTypeUncheckedUpdateManyWithoutUserInput>
  }

  export type EventTypeScalarWhereInput = {
    AND?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
    OR?: EventTypeScalarWhereInput[]
    NOT?: EventTypeScalarWhereInput | EventTypeScalarWhereInput[]
    id?: StringFilter<"EventType"> | string
    title?: StringFilter<"EventType"> | string
    slug?: StringFilter<"EventType"> | string
    description?: StringNullableFilter<"EventType"> | string | null
    duration?: IntFilter<"EventType"> | number
    isActive?: BoolFilter<"EventType"> | boolean
    requiresConfirmation?: BoolFilter<"EventType"> | boolean
    price?: IntNullableFilter<"EventType"> | number | null
    currency?: StringFilter<"EventType"> | string
    minimumNotice?: IntFilter<"EventType"> | number
    beforeBuffer?: IntFilter<"EventType"> | number
    afterBuffer?: IntFilter<"EventType"> | number
    slotInterval?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerDay?: IntNullableFilter<"EventType"> | number | null
    maxBookingsPerWeek?: IntNullableFilter<"EventType"> | number | null
    futureLimit?: IntNullableFilter<"EventType"> | number | null
    color?: StringFilter<"EventType"> | string
    customQuestions?: JsonNullableFilter<"EventType">
    recurringEnabled?: BoolFilter<"EventType"> | boolean
    recurringFrequency?: StringNullableFilter<"EventType"> | string | null
    schedulingType?: EnumSchedulingTypeNullableFilter<"EventType"> | $Enums.SchedulingType | null
    createdAt?: DateTimeFilter<"EventType"> | Date | string
    updatedAt?: DateTimeFilter<"EventType"> | Date | string
    userId?: StringNullableFilter<"EventType"> | string | null
    scheduleId?: StringNullableFilter<"EventType"> | string | null
    teamId?: StringNullableFilter<"EventType"> | string | null
  }

  export type BookingUpsertWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
    create: XOR<BookingCreateWithoutUserInput, BookingUncheckedCreateWithoutUserInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutUserInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutUserInput, BookingUncheckedUpdateWithoutUserInput>
  }

  export type BookingUpdateManyWithWhereWithoutUserInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutUserInput>
  }

  export type BookingScalarWhereInput = {
    AND?: BookingScalarWhereInput | BookingScalarWhereInput[]
    OR?: BookingScalarWhereInput[]
    NOT?: BookingScalarWhereInput | BookingScalarWhereInput[]
    id?: StringFilter<"Booking"> | string
    uid?: StringFilter<"Booking"> | string
    title?: StringFilter<"Booking"> | string
    startTime?: DateTimeFilter<"Booking"> | Date | string
    endTime?: DateTimeFilter<"Booking"> | Date | string
    status?: EnumBookingStatusFilter<"Booking"> | $Enums.BookingStatus
    attendeeName?: StringFilter<"Booking"> | string
    attendeeEmail?: StringFilter<"Booking"> | string
    attendeeTimezone?: StringFilter<"Booking"> | string
    attendeeNotes?: StringNullableFilter<"Booking"> | string | null
    meetingUrl?: StringNullableFilter<"Booking"> | string | null
    location?: StringNullableFilter<"Booking"> | string | null
    responses?: JsonNullableFilter<"Booking">
    cancellationReason?: StringNullableFilter<"Booking"> | string | null
    recurringEventId?: StringNullableFilter<"Booking"> | string | null
    calendarEventId?: StringNullableFilter<"Booking"> | string | null
    createdAt?: DateTimeFilter<"Booking"> | Date | string
    updatedAt?: DateTimeFilter<"Booking"> | Date | string
    userId?: StringFilter<"Booking"> | string
    eventTypeId?: StringFilter<"Booking"> | string
  }

  export type ScheduleUpsertWithWhereUniqueWithoutUserInput = {
    where: ScheduleWhereUniqueInput
    update: XOR<ScheduleUpdateWithoutUserInput, ScheduleUncheckedUpdateWithoutUserInput>
    create: XOR<ScheduleCreateWithoutUserInput, ScheduleUncheckedCreateWithoutUserInput>
  }

  export type ScheduleUpdateWithWhereUniqueWithoutUserInput = {
    where: ScheduleWhereUniqueInput
    data: XOR<ScheduleUpdateWithoutUserInput, ScheduleUncheckedUpdateWithoutUserInput>
  }

  export type ScheduleUpdateManyWithWhereWithoutUserInput = {
    where: ScheduleScalarWhereInput
    data: XOR<ScheduleUpdateManyMutationInput, ScheduleUncheckedUpdateManyWithoutUserInput>
  }

  export type ScheduleScalarWhereInput = {
    AND?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    OR?: ScheduleScalarWhereInput[]
    NOT?: ScheduleScalarWhereInput | ScheduleScalarWhereInput[]
    id?: StringFilter<"Schedule"> | string
    name?: StringFilter<"Schedule"> | string
    isDefault?: BoolFilter<"Schedule"> | boolean
    timezone?: StringFilter<"Schedule"> | string
    createdAt?: DateTimeFilter<"Schedule"> | Date | string
    updatedAt?: DateTimeFilter<"Schedule"> | Date | string
    userId?: StringFilter<"Schedule"> | string
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
    create: XOR<TeamMemberCreateWithoutUserInput, TeamMemberUncheckedCreateWithoutUserInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutUserInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutUserInput, TeamMemberUncheckedUpdateWithoutUserInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutUserInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutUserInput>
  }

  export type TeamMemberScalarWhereInput = {
    AND?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    OR?: TeamMemberScalarWhereInput[]
    NOT?: TeamMemberScalarWhereInput | TeamMemberScalarWhereInput[]
    id?: StringFilter<"TeamMember"> | string
    role?: EnumTeamRoleFilter<"TeamMember"> | $Enums.TeamRole
    accepted?: BoolFilter<"TeamMember"> | boolean
    createdAt?: DateTimeFilter<"TeamMember"> | Date | string
    updatedAt?: DateTimeFilter<"TeamMember"> | Date | string
    userId?: StringFilter<"TeamMember"> | string
    teamId?: StringFilter<"TeamMember"> | string
  }

  export type CalendarConnectionUpsertWithWhereUniqueWithoutUserInput = {
    where: CalendarConnectionWhereUniqueInput
    update: XOR<CalendarConnectionUpdateWithoutUserInput, CalendarConnectionUncheckedUpdateWithoutUserInput>
    create: XOR<CalendarConnectionCreateWithoutUserInput, CalendarConnectionUncheckedCreateWithoutUserInput>
  }

  export type CalendarConnectionUpdateWithWhereUniqueWithoutUserInput = {
    where: CalendarConnectionWhereUniqueInput
    data: XOR<CalendarConnectionUpdateWithoutUserInput, CalendarConnectionUncheckedUpdateWithoutUserInput>
  }

  export type CalendarConnectionUpdateManyWithWhereWithoutUserInput = {
    where: CalendarConnectionScalarWhereInput
    data: XOR<CalendarConnectionUpdateManyMutationInput, CalendarConnectionUncheckedUpdateManyWithoutUserInput>
  }

  export type CalendarConnectionScalarWhereInput = {
    AND?: CalendarConnectionScalarWhereInput | CalendarConnectionScalarWhereInput[]
    OR?: CalendarConnectionScalarWhereInput[]
    NOT?: CalendarConnectionScalarWhereInput | CalendarConnectionScalarWhereInput[]
    id?: StringFilter<"CalendarConnection"> | string
    provider?: StringFilter<"CalendarConnection"> | string
    accessToken?: StringFilter<"CalendarConnection"> | string
    refreshToken?: StringNullableFilter<"CalendarConnection"> | string | null
    expiresAt?: DateTimeNullableFilter<"CalendarConnection"> | Date | string | null
    email?: StringFilter<"CalendarConnection"> | string
    isPrimary?: BoolFilter<"CalendarConnection"> | boolean
    createdAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    updatedAt?: DateTimeFilter<"CalendarConnection"> | Date | string
    userId?: StringFilter<"CalendarConnection"> | string
  }

  export type WebhookUpsertWithWhereUniqueWithoutUserInput = {
    where: WebhookWhereUniqueInput
    update: XOR<WebhookUpdateWithoutUserInput, WebhookUncheckedUpdateWithoutUserInput>
    create: XOR<WebhookCreateWithoutUserInput, WebhookUncheckedCreateWithoutUserInput>
  }

  export type WebhookUpdateWithWhereUniqueWithoutUserInput = {
    where: WebhookWhereUniqueInput
    data: XOR<WebhookUpdateWithoutUserInput, WebhookUncheckedUpdateWithoutUserInput>
  }

  export type WebhookUpdateManyWithWhereWithoutUserInput = {
    where: WebhookScalarWhereInput
    data: XOR<WebhookUpdateManyMutationInput, WebhookUncheckedUpdateManyWithoutUserInput>
  }

  export type WebhookScalarWhereInput = {
    AND?: WebhookScalarWhereInput | WebhookScalarWhereInput[]
    OR?: WebhookScalarWhereInput[]
    NOT?: WebhookScalarWhereInput | WebhookScalarWhereInput[]
    id?: StringFilter<"Webhook"> | string
    url?: StringFilter<"Webhook"> | string
    eventTriggers?: StringNullableListFilter<"Webhook">
    active?: BoolFilter<"Webhook"> | boolean
    secret?: StringFilter<"Webhook"> | string
    createdAt?: DateTimeFilter<"Webhook"> | Date | string
    updatedAt?: DateTimeFilter<"Webhook"> | Date | string
    userId?: StringFilter<"Webhook"> | string
  }

  export type UserCreateWithoutEventTypesInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutEventTypesInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutEventTypesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutEventTypesInput, UserUncheckedCreateWithoutEventTypesInput>
  }

  export type ScheduleCreateWithoutEventTypesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSchedulesInput
    availabilities?: AvailabilityCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateWithoutEventTypesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    availabilities?: AvailabilityUncheckedCreateNestedManyWithoutScheduleInput
    dateOverrides?: DateOverrideUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleCreateOrConnectWithoutEventTypesInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutEventTypesInput, ScheduleUncheckedCreateWithoutEventTypesInput>
  }

  export type TeamCreateWithoutEventTypesInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutEventTypesInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    members?: TeamMemberUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutEventTypesInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutEventTypesInput, TeamUncheckedCreateWithoutEventTypesInput>
  }

  export type BookingCreateWithoutEventTypeInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutBookingsInput
  }

  export type BookingUncheckedCreateWithoutEventTypeInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type BookingCreateOrConnectWithoutEventTypeInput = {
    where: BookingWhereUniqueInput
    create: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput>
  }

  export type BookingCreateManyEventTypeInputEnvelope = {
    data: BookingCreateManyEventTypeInput | BookingCreateManyEventTypeInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutEventTypesInput = {
    update: XOR<UserUpdateWithoutEventTypesInput, UserUncheckedUpdateWithoutEventTypesInput>
    create: XOR<UserCreateWithoutEventTypesInput, UserUncheckedCreateWithoutEventTypesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutEventTypesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutEventTypesInput, UserUncheckedUpdateWithoutEventTypesInput>
  }

  export type UserUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ScheduleUpsertWithoutEventTypesInput = {
    update: XOR<ScheduleUpdateWithoutEventTypesInput, ScheduleUncheckedUpdateWithoutEventTypesInput>
    create: XOR<ScheduleCreateWithoutEventTypesInput, ScheduleUncheckedCreateWithoutEventTypesInput>
    where?: ScheduleWhereInput
  }

  export type ScheduleUpdateToOneWithWhereWithoutEventTypesInput = {
    where?: ScheduleWhereInput
    data: XOR<ScheduleUpdateWithoutEventTypesInput, ScheduleUncheckedUpdateWithoutEventTypesInput>
  }

  export type ScheduleUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSchedulesNestedInput
    availabilities?: AvailabilityUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    availabilities?: AvailabilityUncheckedUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type TeamUpsertWithoutEventTypesInput = {
    update: XOR<TeamUpdateWithoutEventTypesInput, TeamUncheckedUpdateWithoutEventTypesInput>
    create: XOR<TeamCreateWithoutEventTypesInput, TeamUncheckedCreateWithoutEventTypesInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutEventTypesInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutEventTypesInput, TeamUncheckedUpdateWithoutEventTypesInput>
  }

  export type TeamUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutEventTypesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    members?: TeamMemberUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type BookingUpsertWithWhereUniqueWithoutEventTypeInput = {
    where: BookingWhereUniqueInput
    update: XOR<BookingUpdateWithoutEventTypeInput, BookingUncheckedUpdateWithoutEventTypeInput>
    create: XOR<BookingCreateWithoutEventTypeInput, BookingUncheckedCreateWithoutEventTypeInput>
  }

  export type BookingUpdateWithWhereUniqueWithoutEventTypeInput = {
    where: BookingWhereUniqueInput
    data: XOR<BookingUpdateWithoutEventTypeInput, BookingUncheckedUpdateWithoutEventTypeInput>
  }

  export type BookingUpdateManyWithWhereWithoutEventTypeInput = {
    where: BookingScalarWhereInput
    data: XOR<BookingUpdateManyMutationInput, BookingUncheckedUpdateManyWithoutEventTypeInput>
  }

  export type UserCreateWithoutBookingsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutBookingsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutBookingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
  }

  export type EventTypeCreateWithoutBookingsInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutEventTypesInput
    schedule?: ScheduleCreateNestedOneWithoutEventTypesInput
    team?: TeamCreateNestedOneWithoutEventTypesInput
  }

  export type EventTypeUncheckedCreateWithoutBookingsInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    scheduleId?: string | null
    teamId?: string | null
  }

  export type EventTypeCreateOrConnectWithoutBookingsInput = {
    where: EventTypeWhereUniqueInput
    create: XOR<EventTypeCreateWithoutBookingsInput, EventTypeUncheckedCreateWithoutBookingsInput>
  }

  export type UserUpsertWithoutBookingsInput = {
    update: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
    create: XOR<UserCreateWithoutBookingsInput, UserUncheckedCreateWithoutBookingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBookingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBookingsInput, UserUncheckedUpdateWithoutBookingsInput>
  }

  export type UserUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type EventTypeUpsertWithoutBookingsInput = {
    update: XOR<EventTypeUpdateWithoutBookingsInput, EventTypeUncheckedUpdateWithoutBookingsInput>
    create: XOR<EventTypeCreateWithoutBookingsInput, EventTypeUncheckedCreateWithoutBookingsInput>
    where?: EventTypeWhereInput
  }

  export type EventTypeUpdateToOneWithWhereWithoutBookingsInput = {
    where?: EventTypeWhereInput
    data: XOR<EventTypeUpdateWithoutBookingsInput, EventTypeUncheckedUpdateWithoutBookingsInput>
  }

  export type EventTypeUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEventTypesNestedInput
    schedule?: ScheduleUpdateOneWithoutEventTypesNestedInput
    team?: TeamUpdateOneWithoutEventTypesNestedInput
  }

  export type EventTypeUncheckedUpdateWithoutBookingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateWithoutSchedulesInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSchedulesInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSchedulesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
  }

  export type AvailabilityCreateWithoutScheduleInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityUncheckedCreateWithoutScheduleInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AvailabilityCreateOrConnectWithoutScheduleInput = {
    where: AvailabilityWhereUniqueInput
    create: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput>
  }

  export type AvailabilityCreateManyScheduleInputEnvelope = {
    data: AvailabilityCreateManyScheduleInput | AvailabilityCreateManyScheduleInput[]
    skipDuplicates?: boolean
  }

  export type DateOverrideCreateWithoutScheduleInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DateOverrideUncheckedCreateWithoutScheduleInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DateOverrideCreateOrConnectWithoutScheduleInput = {
    where: DateOverrideWhereUniqueInput
    create: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput>
  }

  export type DateOverrideCreateManyScheduleInputEnvelope = {
    data: DateOverrideCreateManyScheduleInput | DateOverrideCreateManyScheduleInput[]
    skipDuplicates?: boolean
  }

  export type EventTypeCreateWithoutScheduleInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutEventTypesInput
    team?: TeamCreateNestedOneWithoutEventTypesInput
    bookings?: BookingCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeUncheckedCreateWithoutScheduleInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    teamId?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeCreateOrConnectWithoutScheduleInput = {
    where: EventTypeWhereUniqueInput
    create: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput>
  }

  export type EventTypeCreateManyScheduleInputEnvelope = {
    data: EventTypeCreateManyScheduleInput | EventTypeCreateManyScheduleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSchedulesInput = {
    update: XOR<UserUpdateWithoutSchedulesInput, UserUncheckedUpdateWithoutSchedulesInput>
    create: XOR<UserCreateWithoutSchedulesInput, UserUncheckedCreateWithoutSchedulesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSchedulesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSchedulesInput, UserUncheckedUpdateWithoutSchedulesInput>
  }

  export type UserUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSchedulesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AvailabilityUpsertWithWhereUniqueWithoutScheduleInput = {
    where: AvailabilityWhereUniqueInput
    update: XOR<AvailabilityUpdateWithoutScheduleInput, AvailabilityUncheckedUpdateWithoutScheduleInput>
    create: XOR<AvailabilityCreateWithoutScheduleInput, AvailabilityUncheckedCreateWithoutScheduleInput>
  }

  export type AvailabilityUpdateWithWhereUniqueWithoutScheduleInput = {
    where: AvailabilityWhereUniqueInput
    data: XOR<AvailabilityUpdateWithoutScheduleInput, AvailabilityUncheckedUpdateWithoutScheduleInput>
  }

  export type AvailabilityUpdateManyWithWhereWithoutScheduleInput = {
    where: AvailabilityScalarWhereInput
    data: XOR<AvailabilityUpdateManyMutationInput, AvailabilityUncheckedUpdateManyWithoutScheduleInput>
  }

  export type AvailabilityScalarWhereInput = {
    AND?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
    OR?: AvailabilityScalarWhereInput[]
    NOT?: AvailabilityScalarWhereInput | AvailabilityScalarWhereInput[]
    id?: StringFilter<"Availability"> | string
    day?: IntFilter<"Availability"> | number
    startTime?: StringFilter<"Availability"> | string
    endTime?: StringFilter<"Availability"> | string
    createdAt?: DateTimeFilter<"Availability"> | Date | string
    updatedAt?: DateTimeFilter<"Availability"> | Date | string
    scheduleId?: StringFilter<"Availability"> | string
  }

  export type DateOverrideUpsertWithWhereUniqueWithoutScheduleInput = {
    where: DateOverrideWhereUniqueInput
    update: XOR<DateOverrideUpdateWithoutScheduleInput, DateOverrideUncheckedUpdateWithoutScheduleInput>
    create: XOR<DateOverrideCreateWithoutScheduleInput, DateOverrideUncheckedCreateWithoutScheduleInput>
  }

  export type DateOverrideUpdateWithWhereUniqueWithoutScheduleInput = {
    where: DateOverrideWhereUniqueInput
    data: XOR<DateOverrideUpdateWithoutScheduleInput, DateOverrideUncheckedUpdateWithoutScheduleInput>
  }

  export type DateOverrideUpdateManyWithWhereWithoutScheduleInput = {
    where: DateOverrideScalarWhereInput
    data: XOR<DateOverrideUpdateManyMutationInput, DateOverrideUncheckedUpdateManyWithoutScheduleInput>
  }

  export type DateOverrideScalarWhereInput = {
    AND?: DateOverrideScalarWhereInput | DateOverrideScalarWhereInput[]
    OR?: DateOverrideScalarWhereInput[]
    NOT?: DateOverrideScalarWhereInput | DateOverrideScalarWhereInput[]
    id?: StringFilter<"DateOverride"> | string
    date?: DateTimeFilter<"DateOverride"> | Date | string
    startTime?: StringNullableFilter<"DateOverride"> | string | null
    endTime?: StringNullableFilter<"DateOverride"> | string | null
    isUnavailable?: BoolFilter<"DateOverride"> | boolean
    createdAt?: DateTimeFilter<"DateOverride"> | Date | string
    updatedAt?: DateTimeFilter<"DateOverride"> | Date | string
    scheduleId?: StringFilter<"DateOverride"> | string
  }

  export type EventTypeUpsertWithWhereUniqueWithoutScheduleInput = {
    where: EventTypeWhereUniqueInput
    update: XOR<EventTypeUpdateWithoutScheduleInput, EventTypeUncheckedUpdateWithoutScheduleInput>
    create: XOR<EventTypeCreateWithoutScheduleInput, EventTypeUncheckedCreateWithoutScheduleInput>
  }

  export type EventTypeUpdateWithWhereUniqueWithoutScheduleInput = {
    where: EventTypeWhereUniqueInput
    data: XOR<EventTypeUpdateWithoutScheduleInput, EventTypeUncheckedUpdateWithoutScheduleInput>
  }

  export type EventTypeUpdateManyWithWhereWithoutScheduleInput = {
    where: EventTypeScalarWhereInput
    data: XOR<EventTypeUpdateManyMutationInput, EventTypeUncheckedUpdateManyWithoutScheduleInput>
  }

  export type ScheduleCreateWithoutAvailabilitiesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSchedulesInput
    dateOverrides?: DateOverrideCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateWithoutAvailabilitiesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    dateOverrides?: DateOverrideUncheckedCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleCreateOrConnectWithoutAvailabilitiesInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutAvailabilitiesInput, ScheduleUncheckedCreateWithoutAvailabilitiesInput>
  }

  export type ScheduleUpsertWithoutAvailabilitiesInput = {
    update: XOR<ScheduleUpdateWithoutAvailabilitiesInput, ScheduleUncheckedUpdateWithoutAvailabilitiesInput>
    create: XOR<ScheduleCreateWithoutAvailabilitiesInput, ScheduleUncheckedCreateWithoutAvailabilitiesInput>
    where?: ScheduleWhereInput
  }

  export type ScheduleUpdateToOneWithWhereWithoutAvailabilitiesInput = {
    where?: ScheduleWhereInput
    data: XOR<ScheduleUpdateWithoutAvailabilitiesInput, ScheduleUncheckedUpdateWithoutAvailabilitiesInput>
  }

  export type ScheduleUpdateWithoutAvailabilitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSchedulesNestedInput
    dateOverrides?: DateOverrideUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutAvailabilitiesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    dateOverrides?: DateOverrideUncheckedUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleCreateWithoutDateOverridesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutSchedulesInput
    availabilities?: AvailabilityCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleUncheckedCreateWithoutDateOverridesInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
    availabilities?: AvailabilityUncheckedCreateNestedManyWithoutScheduleInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutScheduleInput
  }

  export type ScheduleCreateOrConnectWithoutDateOverridesInput = {
    where: ScheduleWhereUniqueInput
    create: XOR<ScheduleCreateWithoutDateOverridesInput, ScheduleUncheckedCreateWithoutDateOverridesInput>
  }

  export type ScheduleUpsertWithoutDateOverridesInput = {
    update: XOR<ScheduleUpdateWithoutDateOverridesInput, ScheduleUncheckedUpdateWithoutDateOverridesInput>
    create: XOR<ScheduleCreateWithoutDateOverridesInput, ScheduleUncheckedCreateWithoutDateOverridesInput>
    where?: ScheduleWhereInput
  }

  export type ScheduleUpdateToOneWithWhereWithoutDateOverridesInput = {
    where?: ScheduleWhereInput
    data: XOR<ScheduleUpdateWithoutDateOverridesInput, ScheduleUncheckedUpdateWithoutDateOverridesInput>
  }

  export type ScheduleUpdateWithoutDateOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSchedulesNestedInput
    availabilities?: AvailabilityUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutDateOverridesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
    availabilities?: AvailabilityUncheckedUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type TeamMemberCreateWithoutTeamInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTeamMembershipsInput
  }

  export type TeamMemberUncheckedCreateWithoutTeamInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type TeamMemberCreateOrConnectWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberCreateManyTeamInputEnvelope = {
    data: TeamMemberCreateManyTeamInput | TeamMemberCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type EventTypeCreateWithoutTeamInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user?: UserCreateNestedOneWithoutEventTypesInput
    schedule?: ScheduleCreateNestedOneWithoutEventTypesInput
    bookings?: BookingCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeUncheckedCreateWithoutTeamInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    scheduleId?: string | null
    bookings?: BookingUncheckedCreateNestedManyWithoutEventTypeInput
  }

  export type EventTypeCreateOrConnectWithoutTeamInput = {
    where: EventTypeWhereUniqueInput
    create: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput>
  }

  export type EventTypeCreateManyTeamInputEnvelope = {
    data: EventTypeCreateManyTeamInput | EventTypeCreateManyTeamInput[]
    skipDuplicates?: boolean
  }

  export type TeamMemberUpsertWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    update: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
    create: XOR<TeamMemberCreateWithoutTeamInput, TeamMemberUncheckedCreateWithoutTeamInput>
  }

  export type TeamMemberUpdateWithWhereUniqueWithoutTeamInput = {
    where: TeamMemberWhereUniqueInput
    data: XOR<TeamMemberUpdateWithoutTeamInput, TeamMemberUncheckedUpdateWithoutTeamInput>
  }

  export type TeamMemberUpdateManyWithWhereWithoutTeamInput = {
    where: TeamMemberScalarWhereInput
    data: XOR<TeamMemberUpdateManyMutationInput, TeamMemberUncheckedUpdateManyWithoutTeamInput>
  }

  export type EventTypeUpsertWithWhereUniqueWithoutTeamInput = {
    where: EventTypeWhereUniqueInput
    update: XOR<EventTypeUpdateWithoutTeamInput, EventTypeUncheckedUpdateWithoutTeamInput>
    create: XOR<EventTypeCreateWithoutTeamInput, EventTypeUncheckedCreateWithoutTeamInput>
  }

  export type EventTypeUpdateWithWhereUniqueWithoutTeamInput = {
    where: EventTypeWhereUniqueInput
    data: XOR<EventTypeUpdateWithoutTeamInput, EventTypeUncheckedUpdateWithoutTeamInput>
  }

  export type EventTypeUpdateManyWithWhereWithoutTeamInput = {
    where: EventTypeScalarWhereInput
    data: XOR<EventTypeUpdateManyMutationInput, EventTypeUncheckedUpdateManyWithoutTeamInput>
  }

  export type UserCreateWithoutTeamMembershipsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTeamMembershipsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTeamMembershipsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTeamMembershipsInput, UserUncheckedCreateWithoutTeamMembershipsInput>
  }

  export type TeamCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventTypes?: EventTypeCreateNestedManyWithoutTeamInput
  }

  export type TeamUncheckedCreateWithoutMembersInput = {
    id?: string
    name: string
    slug: string
    logoUrl?: string | null
    bio?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutTeamInput
  }

  export type TeamCreateOrConnectWithoutMembersInput = {
    where: TeamWhereUniqueInput
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
  }

  export type UserUpsertWithoutTeamMembershipsInput = {
    update: XOR<UserUpdateWithoutTeamMembershipsInput, UserUncheckedUpdateWithoutTeamMembershipsInput>
    create: XOR<UserCreateWithoutTeamMembershipsInput, UserUncheckedCreateWithoutTeamMembershipsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTeamMembershipsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTeamMembershipsInput, UserUncheckedUpdateWithoutTeamMembershipsInput>
  }

  export type UserUpdateWithoutTeamMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTeamMembershipsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type TeamUpsertWithoutMembersInput = {
    update: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
    create: XOR<TeamCreateWithoutMembersInput, TeamUncheckedCreateWithoutMembersInput>
    where?: TeamWhereInput
  }

  export type TeamUpdateToOneWithWhereWithoutMembersInput = {
    where?: TeamWhereInput
    data: XOR<TeamUpdateWithoutMembersInput, TeamUncheckedUpdateWithoutMembersInput>
  }

  export type TeamUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTypes?: EventTypeUpdateManyWithoutTeamNestedInput
  }

  export type TeamUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTypes?: EventTypeUncheckedUpdateManyWithoutTeamNestedInput
  }

  export type UserCreateWithoutCalendarConnectionsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    webhooks?: WebhookCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCalendarConnectionsInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    webhooks?: WebhookUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCalendarConnectionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCalendarConnectionsInput, UserUncheckedCreateWithoutCalendarConnectionsInput>
  }

  export type UserUpsertWithoutCalendarConnectionsInput = {
    update: XOR<UserUpdateWithoutCalendarConnectionsInput, UserUncheckedUpdateWithoutCalendarConnectionsInput>
    create: XOR<UserCreateWithoutCalendarConnectionsInput, UserUncheckedCreateWithoutCalendarConnectionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCalendarConnectionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCalendarConnectionsInput, UserUncheckedUpdateWithoutCalendarConnectionsInput>
  }

  export type UserUpdateWithoutCalendarConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCalendarConnectionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    webhooks?: WebhookUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutWebhooksInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeCreateNestedManyWithoutUserInput
    bookings?: BookingCreateNestedManyWithoutUserInput
    schedules?: ScheduleCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutWebhooksInput = {
    id?: string
    email: string
    username: string
    passwordHash?: string | null
    name?: string | null
    image?: string | null
    timezone?: string
    weekStart?: number
    bio?: string | null
    theme?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
    eventTypes?: EventTypeUncheckedCreateNestedManyWithoutUserInput
    bookings?: BookingUncheckedCreateNestedManyWithoutUserInput
    schedules?: ScheduleUncheckedCreateNestedManyWithoutUserInput
    teamMemberships?: TeamMemberUncheckedCreateNestedManyWithoutUserInput
    calendarConnections?: CalendarConnectionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutWebhooksInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWebhooksInput, UserUncheckedCreateWithoutWebhooksInput>
  }

  export type WebhookDeliveryCreateWithoutWebhookInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WebhookDeliveryUncheckedCreateWithoutWebhookInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WebhookDeliveryCreateOrConnectWithoutWebhookInput = {
    where: WebhookDeliveryWhereUniqueInput
    create: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput>
  }

  export type WebhookDeliveryCreateManyWebhookInputEnvelope = {
    data: WebhookDeliveryCreateManyWebhookInput | WebhookDeliveryCreateManyWebhookInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutWebhooksInput = {
    update: XOR<UserUpdateWithoutWebhooksInput, UserUncheckedUpdateWithoutWebhooksInput>
    create: XOR<UserCreateWithoutWebhooksInput, UserUncheckedCreateWithoutWebhooksInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWebhooksInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWebhooksInput, UserUncheckedUpdateWithoutWebhooksInput>
  }

  export type UserUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUpdateManyWithoutUserNestedInput
    bookings?: BookingUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    timezone?: StringFieldUpdateOperationsInput | string
    weekStart?: IntFieldUpdateOperationsInput | number
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    theme?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutUserNestedInput
    bookings?: BookingUncheckedUpdateManyWithoutUserNestedInput
    schedules?: ScheduleUncheckedUpdateManyWithoutUserNestedInput
    teamMemberships?: TeamMemberUncheckedUpdateManyWithoutUserNestedInput
    calendarConnections?: CalendarConnectionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type WebhookDeliveryUpsertWithWhereUniqueWithoutWebhookInput = {
    where: WebhookDeliveryWhereUniqueInput
    update: XOR<WebhookDeliveryUpdateWithoutWebhookInput, WebhookDeliveryUncheckedUpdateWithoutWebhookInput>
    create: XOR<WebhookDeliveryCreateWithoutWebhookInput, WebhookDeliveryUncheckedCreateWithoutWebhookInput>
  }

  export type WebhookDeliveryUpdateWithWhereUniqueWithoutWebhookInput = {
    where: WebhookDeliveryWhereUniqueInput
    data: XOR<WebhookDeliveryUpdateWithoutWebhookInput, WebhookDeliveryUncheckedUpdateWithoutWebhookInput>
  }

  export type WebhookDeliveryUpdateManyWithWhereWithoutWebhookInput = {
    where: WebhookDeliveryScalarWhereInput
    data: XOR<WebhookDeliveryUpdateManyMutationInput, WebhookDeliveryUncheckedUpdateManyWithoutWebhookInput>
  }

  export type WebhookDeliveryScalarWhereInput = {
    AND?: WebhookDeliveryScalarWhereInput | WebhookDeliveryScalarWhereInput[]
    OR?: WebhookDeliveryScalarWhereInput[]
    NOT?: WebhookDeliveryScalarWhereInput | WebhookDeliveryScalarWhereInput[]
    id?: StringFilter<"WebhookDelivery"> | string
    event?: StringFilter<"WebhookDelivery"> | string
    payload?: JsonFilter<"WebhookDelivery">
    statusCode?: IntNullableFilter<"WebhookDelivery"> | number | null
    error?: StringNullableFilter<"WebhookDelivery"> | string | null
    createdAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    updatedAt?: DateTimeFilter<"WebhookDelivery"> | Date | string
    webhookId?: StringFilter<"WebhookDelivery"> | string
  }

  export type WebhookCreateWithoutDeliveriesInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutWebhooksInput
  }

  export type WebhookUncheckedCreateWithoutDeliveriesInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type WebhookCreateOrConnectWithoutDeliveriesInput = {
    where: WebhookWhereUniqueInput
    create: XOR<WebhookCreateWithoutDeliveriesInput, WebhookUncheckedCreateWithoutDeliveriesInput>
  }

  export type WebhookUpsertWithoutDeliveriesInput = {
    update: XOR<WebhookUpdateWithoutDeliveriesInput, WebhookUncheckedUpdateWithoutDeliveriesInput>
    create: XOR<WebhookCreateWithoutDeliveriesInput, WebhookUncheckedCreateWithoutDeliveriesInput>
    where?: WebhookWhereInput
  }

  export type WebhookUpdateToOneWithWhereWithoutDeliveriesInput = {
    where?: WebhookWhereInput
    data: XOR<WebhookUpdateWithoutDeliveriesInput, WebhookUncheckedUpdateWithoutDeliveriesInput>
  }

  export type WebhookUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutWebhooksNestedInput
  }

  export type WebhookUncheckedUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refreshToken?: string | null
    accessToken?: string | null
    expiresAt?: number | null
    tokenType?: string | null
    scope?: string | null
    idToken?: string | null
    sessionState?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventTypeCreateManyUserInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    scheduleId?: string | null
    teamId?: string | null
  }

  export type BookingCreateManyUserInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    eventTypeId: string
  }

  export type ScheduleCreateManyUserInput = {
    id?: string
    name: string
    isDefault?: boolean
    timezone?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TeamMemberCreateManyUserInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    teamId: string
  }

  export type CalendarConnectionCreateManyUserInput = {
    id?: string
    provider: string
    accessToken: string
    refreshToken?: string | null
    expiresAt?: Date | string | null
    email: string
    isPrimary?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WebhookCreateManyUserInput = {
    id?: string
    url: string
    eventTriggers?: WebhookCreateeventTriggersInput | string[]
    active?: boolean
    secret: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableIntFieldUpdateOperationsInput | number | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    idToken?: NullableStringFieldUpdateOperationsInput | string | null
    sessionState?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventTypeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    schedule?: ScheduleUpdateOneWithoutEventTypesNestedInput
    team?: TeamUpdateOneWithoutEventTypesNestedInput
    bookings?: BookingUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BookingUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: EventTypeUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventTypeId?: StringFieldUpdateOperationsInput | string
  }

  export type ScheduleUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availabilities?: AvailabilityUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    availabilities?: AvailabilityUncheckedUpdateManyWithoutScheduleNestedInput
    dateOverrides?: DateOverrideUncheckedUpdateManyWithoutScheduleNestedInput
    eventTypes?: EventTypeUncheckedUpdateManyWithoutScheduleNestedInput
  }

  export type ScheduleUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    timezone?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TeamMemberUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    team?: TeamUpdateOneRequiredWithoutMembersNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    teamId?: StringFieldUpdateOperationsInput | string
  }

  export type CalendarConnectionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarConnectionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalendarConnectionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    accessToken?: StringFieldUpdateOperationsInput | string
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    email?: StringFieldUpdateOperationsInput | string
    isPrimary?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: WebhookDeliveryUpdateManyWithoutWebhookNestedInput
  }

  export type WebhookUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveries?: WebhookDeliveryUncheckedUpdateManyWithoutWebhookNestedInput
  }

  export type WebhookUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    eventTriggers?: WebhookUpdateeventTriggersInput | string[]
    active?: BoolFieldUpdateOperationsInput | boolean
    secret?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BookingCreateManyEventTypeInput = {
    id?: string
    uid?: string
    title: string
    startTime: Date | string
    endTime: Date | string
    status?: $Enums.BookingStatus
    attendeeName: string
    attendeeEmail: string
    attendeeTimezone: string
    attendeeNotes?: string | null
    meetingUrl?: string | null
    location?: string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: string | null
    recurringEventId?: string | null
    calendarEventId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type BookingUpdateWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutBookingsNestedInput
  }

  export type BookingUncheckedUpdateWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type BookingUncheckedUpdateManyWithoutEventTypeInput = {
    id?: StringFieldUpdateOperationsInput | string
    uid?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    startTime?: DateTimeFieldUpdateOperationsInput | Date | string
    endTime?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumBookingStatusFieldUpdateOperationsInput | $Enums.BookingStatus
    attendeeName?: StringFieldUpdateOperationsInput | string
    attendeeEmail?: StringFieldUpdateOperationsInput | string
    attendeeTimezone?: StringFieldUpdateOperationsInput | string
    attendeeNotes?: NullableStringFieldUpdateOperationsInput | string | null
    meetingUrl?: NullableStringFieldUpdateOperationsInput | string | null
    location?: NullableStringFieldUpdateOperationsInput | string | null
    responses?: NullableJsonNullValueInput | InputJsonValue
    cancellationReason?: NullableStringFieldUpdateOperationsInput | string | null
    recurringEventId?: NullableStringFieldUpdateOperationsInput | string | null
    calendarEventId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type AvailabilityCreateManyScheduleInput = {
    id?: string
    day: number
    startTime: string
    endTime: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DateOverrideCreateManyScheduleInput = {
    id?: string
    date: Date | string
    startTime?: string | null
    endTime?: string | null
    isUnavailable?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type EventTypeCreateManyScheduleInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    teamId?: string | null
  }

  export type AvailabilityUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AvailabilityUncheckedUpdateManyWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    day?: IntFieldUpdateOperationsInput | number
    startTime?: StringFieldUpdateOperationsInput | string
    endTime?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DateOverrideUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DateOverrideUncheckedUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DateOverrideUncheckedUpdateManyWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    startTime?: NullableStringFieldUpdateOperationsInput | string | null
    endTime?: NullableStringFieldUpdateOperationsInput | string | null
    isUnavailable?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EventTypeUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEventTypesNestedInput
    team?: TeamUpdateOneWithoutEventTypesNestedInput
    bookings?: BookingUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateManyWithoutScheduleInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    teamId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TeamMemberCreateManyTeamInput = {
    id?: string
    role?: $Enums.TeamRole
    accepted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    userId: string
  }

  export type EventTypeCreateManyTeamInput = {
    id?: string
    title: string
    slug: string
    description?: string | null
    duration: number
    isActive?: boolean
    requiresConfirmation?: boolean
    price?: number | null
    currency?: string
    minimumNotice?: number
    beforeBuffer?: number
    afterBuffer?: number
    slotInterval?: number | null
    maxBookingsPerDay?: number | null
    maxBookingsPerWeek?: number | null
    futureLimit?: number | null
    color?: string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: boolean
    recurringFrequency?: string | null
    schedulingType?: $Enums.SchedulingType | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userId?: string | null
    scheduleId?: string | null
  }

  export type TeamMemberUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTeamMembershipsNestedInput
  }

  export type TeamMemberUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type TeamMemberUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: EnumTeamRoleFieldUpdateOperationsInput | $Enums.TeamRole
    accepted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: StringFieldUpdateOperationsInput | string
  }

  export type EventTypeUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutEventTypesNestedInput
    schedule?: ScheduleUpdateOneWithoutEventTypesNestedInput
    bookings?: BookingUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
    bookings?: BookingUncheckedUpdateManyWithoutEventTypeNestedInput
  }

  export type EventTypeUncheckedUpdateManyWithoutTeamInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    requiresConfirmation?: BoolFieldUpdateOperationsInput | boolean
    price?: NullableIntFieldUpdateOperationsInput | number | null
    currency?: StringFieldUpdateOperationsInput | string
    minimumNotice?: IntFieldUpdateOperationsInput | number
    beforeBuffer?: IntFieldUpdateOperationsInput | number
    afterBuffer?: IntFieldUpdateOperationsInput | number
    slotInterval?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerDay?: NullableIntFieldUpdateOperationsInput | number | null
    maxBookingsPerWeek?: NullableIntFieldUpdateOperationsInput | number | null
    futureLimit?: NullableIntFieldUpdateOperationsInput | number | null
    color?: StringFieldUpdateOperationsInput | string
    customQuestions?: NullableJsonNullValueInput | InputJsonValue
    recurringEnabled?: BoolFieldUpdateOperationsInput | boolean
    recurringFrequency?: NullableStringFieldUpdateOperationsInput | string | null
    schedulingType?: NullableEnumSchedulingTypeFieldUpdateOperationsInput | $Enums.SchedulingType | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    scheduleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type WebhookDeliveryCreateManyWebhookInput = {
    id?: string
    event: string
    payload: JsonNullValueInput | InputJsonValue
    statusCode?: number | null
    error?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WebhookDeliveryUpdateWithoutWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookDeliveryUncheckedUpdateWithoutWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookDeliveryUncheckedUpdateManyWithoutWebhookInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    payload?: JsonNullValueInput | InputJsonValue
    statusCode?: NullableIntFieldUpdateOperationsInput | number | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}