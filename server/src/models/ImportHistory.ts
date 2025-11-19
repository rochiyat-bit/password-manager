import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ImportHistoryAttributes {
  id: string;
  userId: string;
  vaultId: string;
  format: 'json' | 'csv' | 'lastpass' | 'bitwarden' | '1password';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  errors?: any[];
  completedAt?: Date;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ImportHistoryCreationAttributes extends Optional<ImportHistoryAttributes, 'id'> {}

class ImportHistory extends Model<ImportHistoryAttributes, ImportHistoryCreationAttributes> implements ImportHistoryAttributes {
  public id!: string;
  public userId!: string;
  public vaultId!: string;
  public format!: 'json' | 'csv' | 'lastpass' | 'bitwarden' | '1password';
  public status!: 'pending' | 'processing' | 'completed' | 'failed';
  public totalItems!: number;
  public successfulItems!: number;
  public failedItems!: number;
  public errors?: any[];
  public completedAt?: Date;
  public errorMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ImportHistory.init(
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
    vaultId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vaults',
        key: 'id'
      }
    },
    format: {
      type: DataTypes.ENUM('json', 'csv', 'lastpass', 'bitwarden', '1password'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    totalItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    successfulItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    failedItems: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    errors: {
      type: DataTypes.JSONB
    },
    completedAt: {
      type: DataTypes.DATE
    },
    errorMessage: {
      type: DataTypes.TEXT
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
    tableName: 'import_history',
    indexes: [
      { fields: ['userId'] },
      { fields: ['vaultId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default ImportHistory;
