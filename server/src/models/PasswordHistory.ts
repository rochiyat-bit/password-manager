import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PasswordHistoryAttributes {
  id: string;
  passwordId: string;
  encryptedPassword: string;
  passwordIv: string;
  passwordTag: string;
  strength: number;
  createdAt?: Date;
}

interface PasswordHistoryCreationAttributes extends Optional<PasswordHistoryAttributes, 'id'> {}

class PasswordHistory extends Model<PasswordHistoryAttributes, PasswordHistoryCreationAttributes> implements PasswordHistoryAttributes {
  public id!: string;
  public passwordId!: string;
  public encryptedPassword!: string;
  public passwordIv!: string;
  public passwordTag!: string;
  public strength!: number;
  public readonly createdAt!: Date;
}

PasswordHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    passwordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'passwords',
        key: 'id'
      },
      onDelete: 'CASCADE'
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
    strength: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'password_history',
    timestamps: false,
    indexes: [
      { fields: ['passwordId'] },
      { fields: ['createdAt'] }
    ]
  }
);

export default PasswordHistory;
