import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserTeamAttributes {
  id: string;
  userId: string;
  teamId: string;
  role: 'super_admin' | 'admin' | 'manager' | 'member' | 'viewer';
  status: 'pending' | 'active' | 'suspended';
  invitedBy?: string;
  invitedAt?: Date;
  joinedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserTeamCreationAttributes extends Optional<UserTeamAttributes, 'id'> {}

class UserTeam extends Model<UserTeamAttributes, UserTeamCreationAttributes> implements UserTeamAttributes {
  public id!: string;
  public userId!: string;
  public teamId!: string;
  public role!: 'super_admin' | 'admin' | 'manager' | 'member' | 'viewer';
  public status!: 'pending' | 'active' | 'suspended';
  public invitedBy?: string;
  public invitedAt?: Date;
  public joinedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserTeam.init(
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
      allowNull: false,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'manager', 'member', 'viewer'),
      defaultValue: 'member'
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'suspended'),
      defaultValue: 'pending'
    },
    invitedBy: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    invitedAt: {
      type: DataTypes.DATE
    },
    joinedAt: {
      type: DataTypes.DATE
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
    tableName: 'user_teams',
    indexes: [
      { fields: ['userId', 'teamId'], unique: true },
      { fields: ['teamId'] },
      { fields: ['status'] }
    ]
  }
);

export default UserTeam;
