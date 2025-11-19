import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ExportHistoryAttributes {
  id: string;
  userId: string;
  format: 'json' | 'csv';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  itemCount: number;
  filePath?: string;
  fileSize?: number;
  expiresAt?: Date;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExportHistoryCreationAttributes extends Optional<ExportHistoryAttributes, 'id'> {}

class ExportHistory extends Model<ExportHistoryAttributes, ExportHistoryCreationAttributes> implements ExportHistoryAttributes {
  public id!: string;
  public userId!: string;
  public format!: 'json' | 'csv';
  public status!: 'pending' | 'processing' | 'completed' | 'failed';
  public itemCount!: number;
  public filePath?: string;
  public fileSize?: number;
  public expiresAt?: Date;
  public errorMessage?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ExportHistory.init(
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
    format: {
      type: DataTypes.ENUM('json', 'csv'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      defaultValue: 'pending'
    },
    itemCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    filePath: {
      type: DataTypes.STRING(500)
    },
    fileSize: {
      type: DataTypes.INTEGER
    },
    expiresAt: {
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
    tableName: 'export_history',
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default ExportHistory;
