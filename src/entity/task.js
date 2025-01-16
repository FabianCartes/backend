import { EntitySchema } from 'typeorm';

const TaskEntity = new EntitySchema({
  name: 'Task',
  tableName: 'tasks',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    title: {
      type: 'varchar',
    },
    description: {
      type: 'varchar',
    },
    completed: {
      type: 'boolean',
    },
    user_id: {
      type: 'int',
    },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      inverseSide: 'tasks',
      joinColumn: { name: 'user_id' },
    },
  },
});

export default { TaskEntity };