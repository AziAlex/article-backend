import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entitys.ts/user.entity'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async userByIdOrEmail(idOrEmail: string, seePassword: boolean = false) {
    const isEmail = idOrEmail.includes('@')
    const key = isEmail ? 'email' : 'id'

    const user = await this.usersRepository.findOne({
      where: { [key]: idOrEmail },
      select: seePassword
        ? ['id', 'mail', 'password', 'createdAt', 'updatedAt']
        : ['id', 'mail', 'createdAt', 'updatedAt'],
    })

    return user
  }

  public async allUsers() {
    const users = await this.usersRepository.find()
    return users
  }

  public async delleteUserById(id: string) {
    await this.usersRepository.delete(id)
  }
}
