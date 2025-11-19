import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface SecurityPolicyAttributes {
  id: string;
  teamId: string;
  minPasswordLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  passwordExpiryDays?: number;
  enforce2FA: boolean;
  sessionTimeout: number;
  allowExport: boolean;
  allowSharing: boolean;
  ipWhitelist?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface SecurityPolicyCreationAttributes extends Optional<SecurityPolicyAttributes, 'id'> {}

class SecurityPolicy extends Model<SecurityPolicyAttributes, SecurityPolicyCreationAttributes> implements SecurityPolicyAttributes {
  public id!: string;
  public teamId!: string;
  public minPasswordLength!: number;
  public requireUppercase!: boolean;
  public requireLowercase!: boolean;
  public requireNumbers!: boolean;
  public requireSymbols!: boolean;
  public passwordExpiryDays?: number;
  public enforce2FA!: boolean;
  public sessionTimeout!: number;
  public allowExport!: boolean;
  public allowSharing!: boolean;
  public ipWhitelist?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SecurityPolicy.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    teamId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    minPasswordLength: {
      type: DataTypes.INTEGER,
      defaultValue: 12
    },
    requireUppercase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    requireLowercase: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    requireNumbers: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    requireSymbols: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    passwordExpiryDays: {
      type: DataTypes.INTEGER
    },
    enforce2FA: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sessionTimeout: {
      type: DataTypes.INTEGER,
      defaultValue: 900000 // 15 minutes
    },
    allowExport: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    allowSharing: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ipWhitelist: {
      type: DataTypes.JSONB
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
    tableName: 'security_policies',
    indexes: [
      { fields: ['teamId'], unique: true }
    ]
  }
);

export default SecurityPolicy;
