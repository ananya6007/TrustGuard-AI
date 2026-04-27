import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const encryptionKey = process.env.ENCRYPTION_KEY || 'trustguard-super-secret-key-32chars';

const users = new Map();
const assets = new Map();
const violations = new Map();
const activityLogs = new Map();

function hashPassword(password) {
  return CryptoJS.SHA256(password + encryptionKey).toString();
}

export function createUser(email, password, name) {
  if (users.has(email)) throw new Error('User already exists');
  const id = uuidv4();
  const user = { id, email, name: name || email.split('@')[0], createdAt: new Date().toISOString() };
  users.set(email, { ...user, password: hashPassword(password) });
  return user;
}

export function loginUser(email, password) {
  const user = users.get(email);
  if (!user || user.password !== hashPassword(password)) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export function userExists(email) {
  return users.has(email);
}

export function createAsset(userId, data) {
  const id = uuidv4();
  const fileHash = uuidv4().substring(0, 8);
  const asset = { id, userId, title: data.title, assetType: data.assetType || 'image', fileUrl: data.fileUrl || '', fileHash, fileSize: data.fileSize || 0, industry: data.industry || 'Media & Entertainment', description: data.description || '', createdAt: new Date().toISOString() };
  assets.set(id, asset);
  return asset;
}

export function getUserAssets(userId) {
  return Array.from(assets.values()).filter(a => a.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getAsset(id) {
  return assets.get(id) || null;
}

export function deleteAsset(id) {
  assets.delete(id);
}

export function createViolation(assetId, data) {
  const id = uuidv4();
  const violation = { id, assetId, platform: data.platform || '', sourceUrl: data.sourceUrl || '', matchConfidence: data.matchConfidence || 0, severity: data.severity || 'medium', detectedAt: new Date().toISOString() };
  violations.set(id, violation);
  return id;
}

export function getAssetViolations(assetId) {
  return Array.from(violations.values()).filter(v => v.assetId === assetId).sort((a, b) => new Date(b.detectedAt) - new Date(a.detectedAt));
}

export function logActivity(userId, action, details) {
  const id = uuidv4();
  activityLogs.set(id, { id, userId, action, details, timestamp: new Date().toISOString() });
}

export function getActivityLogs(userId) {
  return Array.from(activityLogs.values()).filter(l => l.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100);
}

export function getAllAssets() {
  return Array.from(assets.values());
}

export function getAllViolations() {
  return Array.from(violations.values());
}