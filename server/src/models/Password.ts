import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PasswordAttributes {
  id: string;
  vaultId: string;
  title: string;
  encryptedUsername?: string;
  usernameIv?: string;
  usernameTag?: string;
  encryptedPassword: string;
  passwordIv: string;
  passwordTag: string;
  encryptedUrl?: string;
  urlIv?: string;
  urlTag?: string;
  encryptedNotes?: string;
  notesIv?: string;
  notesTag?: string;
  encryptedCustomFields?: string;
  customFieldsIv?: string;
  customFieldsTag?: string;
  category?: string;
  tags: string[];
  icon?: string;
  color?: string;
  strength: number;
  isCompromised: boolean;
  lastUsedAt?: Date;
  usageCount: number;
  expiresAt?: Date;
  notifyBefore?: number;
  isFavorite: boolean;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PasswordCreationAttributes extends Optional<PasswordAttributes, 'id'> {}

class Password extends Model<PasswordAttributes, PasswordCreationAttributes> implements PasswordAttributes {
  public id!: string;
  public vaultId!: string;
  public title!: string;
  public encryptedUsername?: string;
  public usernameIv?: string;
  public usernameTag?: string;
  public encryptedPassword!: string;
  public passwordIv!: string;
  public passwordTag!: string;
  public encryptedUrl?: string;
  public urlIv?: string;
  public urlTag?: string;
  public encryptedNotes?: string;
  public notesIv?: string;
  public notesTag?: string;
  public encryptedCustomFields?: string;
  public customFieldsIv?: string;
  public customFieldsTag?: string;
  public category?: string;
  public tags!: string[];
  public icon?: string;
  public color?: string;
  public strength!: number;
  public isCompromised!: boolean;
  public lastUsedAt?: Date;
  public usageCount!: number;
  public expiresAt?: Date;
  public notifyBefore?: number;
  public isFavorite!: boolean;
  public createdBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
}

Password.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    vaultId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vaults',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    encryptedUsername: {
      type: DataTypes.TEXT
    },
    usernameIv: {
      type: DataTypes.STRING(255)
    },
    usernameTag: {
      type: DataTypes.STRING(255)
    },
    encryptedPassword: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    passwordIv: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    passwordTag: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    encryptedUrl: {
      type: DataTypes.TEXT
    },
    urlIv: {
      type: DataTypes.STRING(255)
    },
    urlTag: {
      type: DataTypes.STRING(255)
    },
    encryptedNotes: {
      type: DataTypes.TEXT
    },
    notesIv: {
      type: DataTypes.STRING(255)
    },
    notesTag: {
      type: DataTypes.STRING(255)
    },
    encryptedCustomFields: {
      type: DataTypes.TEXT
    },
    customFieldsIv: {
      type: DataTypes.STRING(255)
    },
    customFieldsTag: {
      type: DataTypes.STRING(255)
    },
    category: {
      type: DataTypes.STRING(50)
    },
    tags: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    icon: {
      type: DataTypes.STRING(50)
    },
    color: {
      type: DataTypes.STRING(50)
    },
    strength: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isCompromised: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastUsedAt: {
      type: DataTypes.DATE
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    expiresAt: {
      type: DataTypes.DATE
    },
    notifyBefore: {
      type: DataTypes.INTEGER
    },
    isFavorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
    tableName: 'passwords',
    paranoid: true,
    indexes: [
      { fields: ['vaultId'] },
      { fields: ['createdBy'] },
      { fields: ['category'] },
      { fields: ['isCompromised'] },
      { fields: ['expiresAt'] },
      { fields: ['lastUsedAt'] }
    ]
  }
);

export default Password;
