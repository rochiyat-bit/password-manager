import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TeamAttributes {
  id: string;
  name: string;
  slug: string;
  description?: string;
  planType: 'free' | 'pro' | 'enterprise';
  maxMembers: number;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface TeamCreationAttributes extends Optional<TeamAttributes, 'id'> {}

class Team extends Model<TeamAttributes, TeamCreationAttributes> implements TeamAttributes {
  public id!: string;
  public name!: string;
  public slug!: string;
  public description?: string;
  public planType!: 'free' | 'pro' | 'enterprise';
  public maxMembers!: number;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Team.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT
    },
    planType: {
      type: DataTypes.ENUM('free', 'pro', 'enterprise'),
      defaultValue: 'free'
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'teams',
    paranoid: true,
    indexes: [
      { fields: ['slug'], unique: true },
      { fields: ['createdBy'] }
    ]
  }
);

export default Team;
