import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AuditLogAttributes {
  id: string;
  userId?: string;
  teamId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  createdAt?: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id'> {}

class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public userId?: string;
  public teamId?: string;
  public action!: string;
  public resource!: string;
  public resourceId?: string;
  public details!: Record<string, any>;
  public ipAddress?: string;
  public userAgent?: string;
  public status!: 'success' | 'failure';
  public errorMessage?: string;
  public readonly createdAt!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
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
    action: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    resource: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    resourceId: {
      type: DataTypes.UUID
    },
    details: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    ipAddress: {
      type: DataTypes.STRING(45)
    },
    userAgent: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.ENUM('success', 'failure'),
      defaultValue: 'success'
    },
    errorMessage: {
      type: DataTypes.TEXT
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'audit_logs',
    timestamps: false,
    indexes: [
      { fields: ['userId'] },
      { fields: ['teamId'] },
      { fields: ['action'] },
      { fields: ['resource'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default AuditLog;
