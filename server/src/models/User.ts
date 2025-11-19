import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: string;
  email: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  masterPasswordHash: string;
  salt: string;
  kdfIterations: number;
  encryptedPrivateKey?: string;
  privateKeyIv?: string;
  privateKeyTag?: string;
  publicKey?: string;
  totpSecret?: string;
  isTotpEnabled: boolean;
  backupCodes?: string[];
  sessionSalt: string;
  lastPasswordChange?: Date;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  failedLoginAttempts: number;
  lockedUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  preferences: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public emailVerified!: boolean;
  public emailVerificationToken?: string;
  public masterPasswordHash!: string;
  public salt!: string;
  public kdfIterations!: number;
  public encryptedPrivateKey?: string;
  public privateKeyIv?: string;
  public privateKeyTag?: string;
  public publicKey?: string;
  public totpSecret?: string;
  public isTotpEnabled!: boolean;
  public backupCodes?: string[];
  public sessionSalt!: string;
  public lastPasswordChange?: Date;
  public firstName?: string;
  public lastName?: string;
  public avatarUrl?: string;
  public failedLoginAttempts!: number;
  public lockedUntil?: Date;
  public lastLoginAt?: Date;
  public lastLoginIp?: string;
  public preferences!: Record<string, any>;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255)
    },
    masterPasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    kdfIterations: {
      type: DataTypes.INTEGER,
      defaultValue: 100000
    },
    encryptedPrivateKey: {
      type: DataTypes.TEXT
    },
    privateKeyIv: {
      type: DataTypes.STRING(255)
    },
    privateKeyTag: {
      type: DataTypes.STRING(255)
    },
    publicKey: {
      type: DataTypes.TEXT
    },
    totpSecret: {
      type: DataTypes.STRING(255)
    },
    isTotpEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    backupCodes: {
      type: DataTypes.JSONB
    },
    sessionSalt: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lastPasswordChange: {
      type: DataTypes.DATE
    },
    firstName: {
      type: DataTypes.STRING(100)
    },
    lastName: {
      type: DataTypes.STRING(100)
    },
    avatarUrl: {
      type: DataTypes.STRING(500)
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lockedUntil: {
      type: DataTypes.DATE
    },
    lastLoginAt: {
      type: DataTypes.DATE
    },
    lastLoginIp: {
      type: DataTypes.STRING(45)
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
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
    tableName: 'users',
    paranoid: true,
    indexes: [
      { fields: ['email'], unique: true },
      { fields: ['sessionSalt'] },
      { fields: ['lastLoginAt'] }
    ]
  }
);

export default User;
