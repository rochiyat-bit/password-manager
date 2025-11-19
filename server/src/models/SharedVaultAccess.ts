import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SharedVaultAccessAttributes {
  id: string;
  vaultId: string;
  userId: string;
  permission: 'read' | 'write' | 'admin';
  encryptedVaultKey: string;
  vaultKeyIv: string;
  vaultKeyTag: string;
  sharedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SharedVaultAccessCreationAttributes extends Optional<SharedVaultAccessAttributes, 'id'> {}

class SharedVaultAccess extends Model<SharedVaultAccessAttributes, SharedVaultAccessCreationAttributes> implements SharedVaultAccessAttributes {
  public id!: string;
  public vaultId!: string;
  public userId!: string;
  public permission!: 'read' | 'write' | 'admin';
  public encryptedVaultKey!: string;
  public vaultKeyIv!: string;
  public vaultKeyTag!: string;
  public sharedBy!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SharedVaultAccess.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    permission: {
      type: DataTypes.ENUM('read', 'write', 'admin'),
      defaultValue: 'read'
    },
    encryptedVaultKey: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    vaultKeyIv: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    vaultKeyTag: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sharedBy: {
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
    }
  },
  {
    sequelize,
    tableName: 'shared_vault_access',
    indexes: [
      { fields: ['vaultId', 'userId'], unique: true },
      { fields: ['userId'] },
      { fields: ['sharedBy'] }
    ]
  }
);

export default SharedVaultAccess;
