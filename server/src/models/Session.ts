import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SessionAttributes {
  id: string;
  userId: string;
  refreshToken: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string;
  isTrusted: boolean;
  lastActivityAt: Date;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: string;
  public userId!: string;
  public refreshToken!: string;
  public deviceId?: string;
  public deviceName?: string;
  public deviceType?: string;
  public browser?: string;
  public os?: string;
  public ipAddress?: string;
  public location?: string;
  public isTrusted!: boolean;
  public lastActivityAt!: Date;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Session.init(
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
      },
      onDelete: 'CASCADE'
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deviceId: {
      type: DataTypes.STRING(255)
    },
    deviceName: {
      type: DataTypes.STRING(255)
    },
    deviceType: {
      type: DataTypes.STRING(50)
    },
    browser: {
      type: DataTypes.STRING(100)
    },
    os: {
      type: DataTypes.STRING(100)
    },
    ipAddress: {
      type: DataTypes.STRING(45)
    },
    location: {
      type: DataTypes.STRING(255)
    },
    isTrusted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastActivityAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'sessions',
    indexes: [
      { fields: ['userId'] },
      { fields: ['refreshToken'] },
      { fields: ['deviceId'] },
      { fields: ['expiresAt'] }
    ]
  }
);

export default Session;
