// src/lib/chatStorage.js
// IndexedDB Chat Storage Service - Persistent Chat History

const DB_NAME = 'RockMyAuction_ChatDB';
const DB_VERSION = 1;
const STORE_NAME = 'chatSessions';

class ChatStorage {
  constructor() {
    this.db = null;
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('title', 'title', { unique: false });
        }
      };
    });
  }

  // Ensure DB is initialized
  async ensureDB() {
    if (!this.db) {
      await this.init();
    }
  }

  // Create new chat session
  async createSession(title = 'New Chat') {
    await this.ensureDB();
    
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title,
      messages: [],
      timestamp: Date.now(),
      lastUpdated: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(session);

      request.onsuccess = () => resolve(session);
      request.onerror = () => reject(request.error);
    });
  }

  // Get all chat sessions
  async getAllSessions() {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const sessions = request.result;
        // Sort by lastUpdated, newest first
        sessions.sort((a, b) => b.lastUpdated - a.lastUpdated);
        resolve(sessions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Get specific session
  async getSession(sessionId) {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(sessionId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Update session (add messages, update title)
  async updateSession(sessionId, updates) {
    await this.ensureDB();

    return new Promise(async (resolve, reject) => {
      const session = await this.getSession(sessionId);
      if (!session) {
        reject(new Error('Session not found'));
        return;
      }

      const updatedSession = {
        ...session,
        ...updates,
        lastUpdated: Date.now()
      };

      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updatedSession);

      request.onsuccess = () => resolve(updatedSession);
      request.onerror = () => reject(request.error);
    });
  }

  // Add message to session
  async addMessage(sessionId, message) {
    const session = await this.getSession(sessionId);
    if (!session) throw new Error('Session not found');

    const messages = [...session.messages, message];
    
    // Auto-generate title from first user message
    let title = session.title;
    if (messages.length === 1 && message.role === 'user') {
      title = message.text.substring(0, 30) + (message.text.length > 30 ? '...' : '');
    }

    return await this.updateSession(sessionId, { messages, title });
  }

  // Delete session
  async deleteSession(sessionId) {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(sessionId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete all sessions
  async clearAll() {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Get last 5-10 messages for context
  getRecentMessages(messages, count = 10) {
    return messages.slice(-count);
  }
}

// Export singleton instance
const chatStorage = new ChatStorage();
export default chatStorage;
