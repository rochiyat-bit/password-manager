import User from './User';
import Team from './Team';
import UserTeam from './UserTeam';
import Vault from './Vault';
import SharedVaultAccess from './SharedVaultAccess';
import Password from './Password';
import PasswordHistory from './PasswordHistory';
import Session from './Session';
import AuditLog from './AuditLog';
import ExportHistory from './ExportHistory';
import ImportHistory from './ImportHistory';
import SecurityPolicy from './SecurityPolicy';

// Define associations

// User associations
User.hasMany(Vault, { foreignKey: 'userId', as: 'vaults' });
User.hasMany(Password, { foreignKey: 'createdBy', as: 'passwords' });
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
User.belongsToMany(Team, { through: UserTeam, foreignKey: 'userId', as: 'teams' });
User.hasMany(SharedVaultAccess, { foreignKey: 'userId', as: 'sharedVaultAccess' });

// Team associations
Team.belongsToMany(User, { through: UserTeam, foreignKey: 'teamId', as: 'members' });
Team.hasMany(Vault, { foreignKey: 'teamId', as: 'vaults' });
Team.hasOne(SecurityPolicy, { foreignKey: 'teamId', as: 'securityPolicy' });
Team.hasMany(AuditLog, { foreignKey: 'teamId', as: 'auditLogs' });

// Vault associations
Vault.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Vault.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });
Vault.hasMany(Password, { foreignKey: 'vaultId', as: 'passwords' });
Vault.hasMany(SharedVaultAccess, { foreignKey: 'vaultId', as: 'sharedAccess' });

// Password associations
Password.belongsTo(Vault, { foreignKey: 'vaultId', as: 'vault' });
Password.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Password.hasMany(PasswordHistory, { foreignKey: 'passwordId', as: 'history' });

// Password History associations
PasswordHistory.belongsTo(Password, { foreignKey: 'passwordId', as: 'password' });

// Session associations
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// SharedVaultAccess associations
SharedVaultAccess.belongsTo(Vault, { foreignKey: 'vaultId', as: 'vault' });
SharedVaultAccess.belongsTo(User, { foreignKey: 'userId', as: 'user' });
SharedVaultAccess.belongsTo(User, { foreignKey: 'sharedBy', as: 'sharer' });

// AuditLog associations
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AuditLog.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

// ExportHistory associations
ExportHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ImportHistory associations
ImportHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ImportHistory.belongsTo(Vault, { foreignKey: 'vaultId', as: 'vault' });

// SecurityPolicy associations
SecurityPolicy.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

export {
  User,
  Team,
  UserTeam,
  Vault,
  SharedVaultAccess,
  Password,
  PasswordHistory,
  Session,
  AuditLog,
  ExportHistory,
  ImportHistory,
  SecurityPolicy
};
