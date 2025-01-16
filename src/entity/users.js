import {EntitySchema} from 'typeorm';

const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    username: {
      type: 'varchar',
    },
    email: {
      type: 'varchar',
    },
    role: {
      type: 'varchar',
    },
  },
  relations: {
    tasks: {
      type: 'one-to-many',
      target: 'Task',
      inverseSide: 'user',
    },
  },
});

export default UserEntity;