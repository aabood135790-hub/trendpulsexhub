import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { SupabaseClient } from '@supabase/supabase-js';
import { GameCharacter, GameRace, GameRank, WorldHouse, GameChatMessage } from '../types';

// Territoriy definitions matching world coordinate layout
export const TERRITORY_ZONES = [
  {
    id: 'human_sanctum',
    name: 'Kingdom of Valoria',
    race: 'Human' as GameRace,
    crystalName: 'Sanctum Crystal',
    centerX: 550,
    centerY: 550,
    radius: 380,
    color: '#38bdf8',
    accentColor: '#1d4ed8',
    description: 'The ancient golden-azure bastion of humanity, guarded by the Sanctum Crystal barrier.',
  },
  {
    id: 'elf_glade',
    name: 'Sylvaen Glade',
    race: 'Elf' as GameRace,
    crystalName: 'Eldertree Crystal',
    centerX: 1850,
    centerY: 550,
    radius: 380,
    color: '#34d399',
    accentColor: '#059669',
    description: 'Enchanted evergreen sanctuary infused with ancient nature mana and luminous flora.',
  },
  {
    id: 'dwarf_peaks',
    name: 'Ironhold Peaks',
    race: 'Dwarf' as GameRace,
    crystalName: 'Forgefire Crystal',
    centerX: 550,
    centerY: 1850,
    radius: 380,
    color: '#fbbf24',
    accentColor: '#d97706',
    description: 'Subterranean stone citadel and roaring magma forges fortified within the mountain.',
  },
  {
    id: 'demon_abyss',
    name: 'Nether Abyss',
    race: 'Demon' as GameRace,
    crystalName: 'Abyssal Crystal',
    centerX: 1850,
    centerY: 1850,
    radius: 380,
    color: '#f43f5e',
    accentColor: '#9333ea',
    description: 'Dark obsidian rift bathed in violet flames and raw abyssal power.',
  },
];

// Weighted random rank generator on character creation
export function rollStartingRank(): GameRank {
  const rand = Math.random() * 100;
  if (rand < 1) return 'SS'; // 1%
  if (rand < 5) return 'S';  // 4%
  if (rand < 13) return 'A'; // 8%
  if (rand < 25) return 'B'; // 12%
  if (rand < 42) return 'C'; // 17%
  if (rand < 62) return 'D'; // 20%
  if (rand < 82) return 'E'; // 20%
  return 'F';                // 18%
}

export function getSpawnForRace(race: GameRace): { x: number; y: number; houseX: number; houseY: number } {
  switch (race) {
    case 'Human':
      return {
        x: 550 + (Math.random() * 60 - 30),
        y: 590 + (Math.random() * 60 - 30),
        houseX: 430 + Math.floor(Math.random() * 160),
        houseY: 430 + Math.floor(Math.random() * 160),
      };
    case 'Elf':
      return {
        x: 1850 + (Math.random() * 60 - 30),
        y: 590 + (Math.random() * 60 - 30),
        houseX: 1730 + Math.floor(Math.random() * 160),
        houseY: 430 + Math.floor(Math.random() * 160),
      };
    case 'Dwarf':
      return {
        x: 550 + (Math.random() * 60 - 30),
        y: 1890 + (Math.random() * 60 - 30),
        houseX: 430 + Math.floor(Math.random() * 160),
        houseY: 1730 + Math.floor(Math.random() * 160),
      };
    case 'Demon':
      return {
        x: 1850 + (Math.random() * 60 - 30),
        y: 1890 + (Math.random() * 60 - 30),
        houseX: 1730 + Math.floor(Math.random() * 160),
        houseY: 1730 + Math.floor(Math.random() * 160),
      };
    default:
      return { x: 550, y: 550, houseX: 450, houseY: 450 };
  }
}

// In-memory active players, characters, houses, and chat messages
export class GameServerEngine {
  private characters = new Map<string, GameCharacter>(); // userId -> Character
  private houses = new Map<string, WorldHouse>(); // houseId -> House
  private activeSockets = new Map<string, { socket: WebSocket; characterId: string; lastPing: number }>();
  private chatHistory: GameChatMessage[] = [];
  private supabase: SupabaseClient | null = null;
  private wss: WebSocketServer | null = null;

  constructor() {
    // Seed initial demo houses and world state
    this.seedInitialWorld();
  }

  public setSupabase(client: SupabaseClient | null) {
    this.supabase = client;
    this.loadPersistedData();
  }

  private seedInitialWorld() {
    // Add default template houses in each quadrant
    const seedHouses: WorldHouse[] = [
      { id: 'h_human_1', owner_id: 'seed_human', owner_username: 'SirValiant', race: 'Human', x: 440, y: 440, is_destroyed: false },
      { id: 'h_elf_1', owner_id: 'seed_elf', owner_username: 'AerithMoon', race: 'Elf', x: 1760, y: 440, is_destroyed: false },
      { id: 'h_dwarf_1', owner_id: 'seed_dwarf', owner_username: 'BromStoneforge', race: 'Dwarf', x: 440, y: 1760, is_destroyed: false },
      { id: 'h_demon_1', owner_id: 'seed_demon', owner_username: 'MalakorVoid', race: 'Demon', x: 1760, y: 1760, is_destroyed: false },
    ];
    seedHouses.forEach((h) => this.houses.set(h.id, h));
  }

  private async loadPersistedData() {
    if (!this.supabase) return;
    try {
      // 1. Try loading characters from site_settings or game_characters table
      const { data, error } = await this.supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'pulseworld_characters_store')
        .maybeSingle();

      if (!error && data?.value && typeof data.value === 'object') {
        const storedChars = Object.values(data.value) as GameCharacter[];
        storedChars.forEach((char) => {
          this.characters.set(char.user_id, char);
          if (char.house_name) {
            const hId = `house_${char.user_id}`;
            this.houses.set(hId, {
              id: hId,
              owner_id: char.user_id,
              owner_username: char.username,
              race: char.race,
              x: char.house_x,
              y: char.house_y,
              is_destroyed: char.house_destroyed,
            });
          }
        });
        console.log(`[Game Engine] Loaded ${this.characters.size} persisted characters.`);
      }
    } catch (err: any) {
      console.warn('[Game Engine] Error loading stored characters:', err?.message);
    }
  }

  public async savePersistedData() {
    if (!this.supabase) return;
    try {
      const charObj: Record<string, GameCharacter> = {};
      this.characters.forEach((v, k) => {
        charObj[k] = v;
      });

      await this.supabase.from('site_settings').upsert(
        {
          key: 'pulseworld_characters_store',
          value: charObj,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      );
    } catch (err: any) {
      console.warn('[Game Engine] Error saving persisted data:', err?.message);
    }
  }

  // Check unique username
  public isUsernameTaken(username: string, excludeUserId?: string): boolean {
    const clean = username.trim().toLowerCase();
    for (const [userId, char] of this.characters.entries()) {
      if (excludeUserId && userId === excludeUserId) continue;
      if (char.username.trim().toLowerCase() === clean) {
        return true;
      }
    }
    return false;
  }

  public getCharacterByUserId(userId: string): GameCharacter | undefined {
    return this.characters.get(userId);
  }

  public getAllHouses(): WorldHouse[] {
    return Array.from(this.houses.values());
  }

  public getAllOnlineCharacters(): GameCharacter[] {
    const now = Date.now();
    const result: GameCharacter[] = [];
    
    // Include all active socket characters or recently active within 30s
    for (const char of this.characters.values()) {
      const lastSeenTime = new Date(char.last_seen || 0).getTime();
      if (now - lastSeenTime < 60000 || this.isPlayerOnline(char.user_id)) {
        result.push(char);
      }
    }
    return result;
  }

  public isPlayerOnline(userId: string): boolean {
    return this.activeSockets.has(userId);
  }

  public createCharacter(params: {
    userId: string;
    username: string;
    displayName: string;
    race: GameRace;
    age?: number;
    avatar_url?: string | null;
  }): { success: boolean; character?: GameCharacter; error?: string } {
    const { userId, username, displayName, race, age, avatar_url } = params;
    const cleanUsername = username.trim();

    if (!cleanUsername || cleanUsername.length < 3 || cleanUsername.length > 16) {
      return { success: false, error: 'Username must be between 3 and 16 characters.' };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return { success: false, error: 'Username can only contain letters, numbers, and underscores.' };
    }

    if (this.isUsernameTaken(cleanUsername, userId)) {
      return { success: false, error: 'This username is already claimed by another warrior. Please choose another.' };
    }

    const rank = rollStartingRank();
    const spawn = getSpawnForRace(race);
    const nowIso = new Date().toISOString();

    const character: GameCharacter = {
      id: `char_${userId}`,
      user_id: userId,
      username: cleanUsername,
      display_name: (displayName || cleanUsername).trim(),
      avatar_url: avatar_url || null,
      age: typeof age === 'number' && age > 0 ? age : 18,
      race,
      rank,
      level: 1,
      xp: 0,
      max_xp: 100,
      hp: 100,
      max_hp: 100,
      mp: 50,
      max_mp: 50,
      gold: 500,
      aura_active: false,
      house_name: `${cleanUsername}'s House`,
      house_x: spawn.houseX,
      house_y: spawn.houseY,
      house_destroyed: false,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      facing: 'down',
      is_moving: false,
      last_chat: null,
      last_seen: nowIso,
      created_at: nowIso,
      updated_at: nowIso,
    };

    // Store character & house
    this.characters.set(userId, character);
    
    const houseId = `house_${userId}`;
    this.houses.set(houseId, {
      id: houseId,
      owner_id: userId,
      owner_username: cleanUsername,
      race,
      x: spawn.houseX,
      y: spawn.houseY,
      is_destroyed: false,
    });

    this.savePersistedData();
    console.log(`[Game Engine] New Character created: ${cleanUsername} [${race} | Rank ${rank}]`);

    return { success: true, character };
  }

  public updatePlayerPosition(userId: string, data: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    facing: 'left' | 'right' | 'up' | 'down';
    is_moving: boolean;
    hp?: number;
    mp?: number;
    gold?: number;
  }): GameCharacter | null {
    const char = this.characters.get(userId);
    if (!char) return null;

    char.x = data.x;
    char.y = data.y;
    char.vx = data.vx;
    char.vy = data.vy;
    char.facing = data.facing;
    char.is_moving = data.is_moving;
    if (data.hp !== undefined) char.hp = data.hp;
    if (data.mp !== undefined) char.mp = data.mp;
    if (data.gold !== undefined) char.gold = data.gold;
    char.last_seen = new Date().toISOString();

    return char;
  }

  public addChatMessage(userId: string, messageText: string): GameChatMessage | null {
    const char = this.characters.get(userId);
    if (!char) return null;

    const cleanMsg = messageText.trim().slice(0, 120);
    if (!cleanMsg) return null;

    const chatItem: GameChatMessage = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender_id: userId,
      sender_username: char.username,
      race: char.race,
      rank: char.rank,
      message: cleanMsg,
      timestamp: Date.now(),
      x: char.x,
      y: char.y,
    };

    char.last_chat = { message: cleanMsg, timestamp: Date.now() };
    this.chatHistory.unshift(chatItem);
    if (this.chatHistory.length > 50) {
      this.chatHistory.pop();
    }

    // Broadcast chat to all sockets
    this.broadcast({
      type: 'chat_broadcast',
      chat: chatItem,
    });

    return chatItem;
  }

  public transferGold(fromUserId: string, toUserId: string, amount: number): { success: boolean; error?: string; fromGold?: number; toGold?: number } {
    if (amount <= 0 || !Number.isInteger(amount)) {
      return { success: false, error: 'Invalid gold amount.' };
    }

    const fromChar = this.characters.get(fromUserId);
    const toChar = this.characters.get(toUserId);

    if (!fromChar || !toChar) {
      return { success: false, error: 'Player character not found.' };
    }

    if (fromChar.gold < amount) {
      return { success: false, error: `Insufficient Gold. You have ${fromChar.gold} Gold, but tried to send ${amount}.` };
    }

    fromChar.gold -= amount;
    toChar.gold += amount;
    this.savePersistedData();

    // Broadcast notification
    this.broadcast({
      type: 'gold_transferred',
      from: fromChar.username,
      to: toChar.username,
      amount,
    });

    return { success: true, fromGold: fromChar.gold, toGold: toChar.gold };
  }

  public getRecentChat(): GameChatMessage[] {
    return this.chatHistory.slice(0, 25);
  }

  // WebSocket Server Setup
  public setupWebSocket(server: http.Server) {
    this.wss = new WebSocketServer({ server, path: '/ws/game' });

    this.wss.on('connection', (socket: WebSocket) => {
      let currentUserId = '';

      socket.on('message', (rawData) => {
        try {
          const data = JSON.parse(rawData.toString());

          if (data.type === 'join') {
            currentUserId = data.userId;
            const char = this.characters.get(currentUserId);
            if (char) {
              char.last_seen = new Date().toISOString();
              this.activeSockets.set(currentUserId, { socket, characterId: currentUserId, lastPing: Date.now() });

              // Send initial state back to joining client
              socket.send(
                JSON.stringify({
                  type: 'init_world',
                  character: char,
                  otherPlayers: this.getAllOnlineCharacters().filter((p) => p.user_id !== currentUserId),
                  houses: this.getAllHouses(),
                  recentChat: this.getRecentChat(),
                  territories: TERRITORY_ZONES,
                })
              );

              // Broadcast player_joined to everyone else
              this.broadcast(
                {
                  type: 'player_joined',
                  character: char,
                },
                currentUserId
              );
            }
          } else if (data.type === 'move') {
            if (currentUserId && data.x !== undefined && data.y !== undefined) {
              const updated = this.updatePlayerPosition(currentUserId, data);
              if (updated) {
                // Broadcast movement delta to all other players
                this.broadcast(
                  {
                    type: 'player_moved',
                    userId: currentUserId,
                    x: updated.x,
                    y: updated.y,
                    vx: updated.vx,
                    vy: updated.vy,
                    facing: updated.facing,
                    is_moving: updated.is_moving,
                    hp: updated.hp,
                  },
                  currentUserId
                );
              }
            }
          } else if (data.type === 'chat') {
            if (currentUserId && data.message) {
              this.addChatMessage(currentUserId, data.message);
            }
          } else if (data.type === 'ping') {
            const rec = this.activeSockets.get(currentUserId);
            if (rec) rec.lastPing = Date.now();
            socket.send(JSON.stringify({ type: 'pong', time: Date.now() }));
          }
        } catch (e) {
          console.warn('[Game WS Message Error]:', e);
        }
      });

      socket.on('close', () => {
        if (currentUserId) {
          this.activeSockets.delete(currentUserId);
          const char = this.characters.get(currentUserId);
          if (char) {
            char.is_moving = false;
            char.last_seen = new Date().toISOString();
          }
          this.broadcast({
            type: 'player_left',
            userId: currentUserId,
          });
        }
      });

      socket.on('error', (err) => {
        console.warn('[Game WS Error]:', err);
      });
    });

    // World state broadcast heartbeat (every 100ms / 10Hz)
    setInterval(() => {
      if (this.activeSockets.size > 0) {
        const players = this.getAllOnlineCharacters();
        this.broadcast({
          type: 'sync_world',
          players,
          serverTime: Date.now(),
        });
      }
    }, 100);

    // Idle socket cleanup every 20s
    setInterval(() => {
      const now = Date.now();
      for (const [uid, item] of this.activeSockets.entries()) {
        if (now - item.lastPing > 45000) {
          item.socket.close();
          this.activeSockets.delete(uid);
        }
      }
    }, 20000);

    console.log('[Game Server Engine] WebSocket Server mounted at /ws/game');
  }

  public broadcast(payload: any, excludeUserId?: string) {
    const msg = JSON.stringify(payload);
    for (const [userId, item] of this.activeSockets.entries()) {
      if (excludeUserId && userId === excludeUserId) continue;
      if (item.socket.readyState === WebSocket.OPEN) {
        item.socket.send(msg);
      }
    }
  }
}

export const gameServerEngine = new GameServerEngine();
