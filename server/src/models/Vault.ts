import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface VaultAttributes {
  id: string;
  userId: string;
  teamId?: string;
  name: string;
  description?: string;
  type: 'personal' | 'shared';
  icon?: string;
  color?: string;
  isFavorite: boolean;
  lastAccessedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface VaultCreationAttributes extends Optional<VaultAttributes, 'id'> {}

class Vault extends Model<VaultAttributes, VaultCreationAttributes> implements VaultAttributes {
  public id!: string;
  public userId!: string;
  public teamId?: string;
  public name!: string;
  public description?: string;
  public type!: 'personal' | 'shared';
  public icon?: string;
  public color?: string;
  public isFavorite!: boolean;
  public lastAccessedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Vault.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    teamId: {
      type: DataTypes.UUID,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.ENUM('personal', 'shared'),
      defaultValue: 'personal'
    },
    icon: {
      type: DataTypes.STRING(50)
    },
    color: {
      type: DataTypes.STRING(50)
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastAccessedAt: {
      type: DataTypes.DATE
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
    tableName: 'vaults',
    paranoid: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['teamId'] },
      { fields: ['type'] },
      { fields: ['lastAccessedAt'] }
    ]
  }
);

export default Vault;
