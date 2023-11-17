import { type Connection } from 'mysql2'
import { CreateUserMysql } from '@infrastructure/db/mysql/user/create-user.mysql'
import { User } from '@domain/user/entity/user'
import { mockCreateUserParams } from '@tests/data/mocks/user/create-user.params'
import { MysqlDatabaseConnection } from '@infrastructure/db/mysql/MysqlDatabaseConnection'

jest.mock('@infrastructure/db/mysql/MysqlDatabaseConnection', () => {
  return {
    __esModule: true,
    MysqlDatabaseConnection: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      getConnection: () => {
        return (global as any).db
      }
    }))
  }
})

describe('Create User Repository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const connection: Connection = (global as any).db
    connection.query('DELETE FROM user')
  })

  it('should create a user', async () => {
    const mockMysqlDatabaseConnection = new MysqlDatabaseConnection('', 0, '', '', '')

    const userRepo = new CreateUserMysql(mockMysqlDatabaseConnection)

    const userMock = mockCreateUserParams()

    const user = await userRepo.create(userMock)

    expect(user).toBeTruthy()
    expect(user).toBeInstanceOf(User)

    expect(user.getId()).toBeTruthy()
    expect(user.getName()).toBe(userMock.name)
    expect(user.getEmail()).toBe(userMock.email)
    expect(user.getPassword()).toBe(userMock.password)
  })

  it('should create user db', (done) => {
    const mockMysqlDatabaseConnection = new MysqlDatabaseConnection('', 0, '', '', '')

    const userRepo = new CreateUserMysql(mockMysqlDatabaseConnection)

    const userMock = mockCreateUserParams()

    const connection = (global as any).db

    userRepo.create(userMock).then((user) => {
      connection.query('SELECT * FROM user WHERE id = ?', [user.getId()], (err: any, result: string | any[]) => {
        expect(err).toBeFalsy()
        expect(result).toBeTruthy()
        expect(result.length).toBe(1)
        expect(result[0].name).toBe(userMock.name)
        expect(result[0].email).toBe(userMock.email)
        expect(result[0].password).toBe(userMock.password)
        done()
      })
    }).catch(() => {

    })
  })
})
