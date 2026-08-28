import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Users, Shield, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePageSEO } from '../lib/seo';
import { GameCharacter, TerritoryZone, WorldHouse, GameChatMessage, GameRace, GameRank } from '../types';
import { getGameCharacter, sendGameChatMessage } from '../lib/supabase';
import { CharacterCreationModal } from '../components/game/CharacterCreationModal';
import { PlayerInteractionModal } from '../components/game/PlayerInteractionModal';
import { GameHUD } from '../components/game/GameHUD';
import { GameMiniMap } from '../components/game/GameMiniMap';

const WORLD_SIZE = 2400;

// Territory configurations
const TERRITORIES: TerritoryZone[] = [
  {
    id: 'human_sanctum',
    name: 'Kingdom of Valoria',
    race: 'Human',
    crystalName: 'Sanctum Crystal',
    centerX: 550,
    centerY: 550,
    radius: 380,
    color: '#38bdf8',
    accentColor: '#1d4ed8',
    description: 'The golden-azure stronghold of mankind protected by the Sanctum Crystal barrier.',
  },
  {
    id: 'elf_glade',
    name: 'Sylvaen Glade',
    race: 'Elf',
    crystalName: 'Eldertree Crystal',
    centerX: 1850,
    centerY: 550,
    radius: 380,
    color: '#34d399',
    accentColor: '#059669',
    description: 'Enchanted evergreen forest sanctuary imbued with ancient nature mana.',
  },
  {
    id: 'dwarf_peaks',
    name: 'Ironhold Peaks',
    race: 'Dwarf',
    crystalName: 'Forgefire Crystal',
    centerX: 550,
    centerY: 1850,
    radius: 380,
    color: '#fbbf24',
    accentColor: '#d97706',
    description: 'Subterranean stone citadels and molten magma forges.',
  },
  {
    id: 'demon_abyss',
    name: 'Nether Abyss',
    race: 'Demon',
    crystalName: 'Abyssal Crystal',
    centerX: 1850,
    centerY: 1850,
    radius: 380,
    color: '#f43f5e',
    accentColor: '#9333ea',
    description: 'Volcanic obsidian rifts shrouded in violet dark flame.',
  },
];

export function GamePlay() {
  const { user, profile, isAuthenticated, openAuthModal } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Core Game State
  const [character, setCharacter] = useState<GameCharacter | null>(null);
  const [loadingCharacter, setLoadingCharacter] = useState(true);
  const [needsCharacterCreation, setNeedsCharacterCreation] = useState(false);
  const [otherPlayers, setOtherPlayers] = useState<Map<string, GameCharacter>>(new Map());
  const [houses, setHouses] = useState<WorldHouse[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<GameCharacter | null>(null);

  // HUD & UI state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [fps, setFps] = useState(60);
  const [ping, setPing] = useState(18);
  const [onlineCount, setOnlineCount] = useState(1);
  const [auraActive, setAuraActive] = useState(false);
  const [currentZone, setCurrentZone] = useState<{ isSafe: boolean; territoryName: string; crystalName?: string }>({
    isSafe: true,
    territoryName: 'Kingdom of Valoria',
    crystalName: 'Sanctum Crystal',
  });

  // Local movement physics ref
  const playerStateRef = useRef({
    x: 550,
    y: 590,
    vx: 0,
    vy: 0,
    speed: 5.0,
    facing: 'down' as 'left' | 'right' | 'up' | 'down',
    isMoving: false,
    trail: [] as { x: number; y: number; alpha: number }[],
  });

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const joystickTouchRef = useRef<{ active: boolean; startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const otherPlayersRef = useRef<Map<string, GameCharacter>>(new Map());
  const housesRef = useRef<WorldHouse[]>([]);
  const characterRef = useRef<GameCharacter | null>(null);

  usePageSEO({
    title: 'Play PulseWorld Arena 2D | Online Browser Game | TrendPulseXhub',
    description: 'Real-time 2D browser multiplayer arena on TrendPulseXhub. Choose your race, explore 4 crystal territories, build your house, and battle.',
  });

  // Keep references updated for canvas animation loop
  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  useEffect(() => {
    otherPlayersRef.current = otherPlayers;
  }, [otherPlayers]);

  useEffect(() => {
    housesRef.current = houses;
  }, [houses]);

  // Load Character or show Creation Modal
  useEffect(() => {
    let isMounted = true;
    const initPlayer = async () => {
      setLoadingCharacter(true);
      const userId = user?.id || (profile?.id ? String(profile.id) : 'guest_' + Math.random().toString(36).substring(2, 8));

      try {
        const char = await getGameCharacter(userId);
        if (isMounted) {
          if (char) {
            setCharacter(char);
            playerStateRef.current.x = char.x || 550;
            playerStateRef.current.y = char.y || 590;
            setNeedsCharacterCreation(false);
          } else {
            setNeedsCharacterCreation(true);
          }
        }
      } catch (err) {
        if (isMounted) setNeedsCharacterCreation(true);
      } finally {
        if (isMounted) setLoadingCharacter(false);
      }
    };

    initPlayer();
    return () => {
      isMounted = false;
    };
  }, [user, profile]);

  // Connect WebSocket & fallback HTTP Sync
  useEffect(() => {
    if (!character) return;

    let ws: WebSocket | null = null;
    let fallbackInterval: NodeJS.Timeout | null = null;
    let pingInterval: NodeJS.Timeout | null = null;

    const connectWS = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws/game`;

      try {
        ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setPing(14);
          ws?.send(
            JSON.stringify({
              type: 'join',
              userId: character.user_id,
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'init_world') {
              if (data.houses) setHouses(data.houses);
              if (Array.isArray(data.otherPlayers)) {
                const map = new Map<string, GameCharacter>();
                data.otherPlayers.forEach((p: GameCharacter) => map.set(p.user_id, p));
                setOtherPlayers(map);
                setOnlineCount(map.size + 1);
              }
            } else if (data.type === 'sync_world') {
              if (Array.isArray(data.players)) {
                const map = new Map<string, GameCharacter>();
                data.players.forEach((p: GameCharacter) => {
                  if (p.user_id !== character.user_id) {
                    map.set(p.user_id, p);
                  }
                });
                setOtherPlayers(map);
                setOnlineCount(map.size + 1);
              }
            } else if (data.type === 'player_joined') {
              if (data.character && data.character.user_id !== character.user_id) {
                setOtherPlayers((prev) => {
                  const updated = new Map(prev);
                  updated.set(data.character.user_id, data.character);
                  return updated;
                });
              }
            } else if (data.type === 'player_moved') {
              if (data.userId && data.userId !== character.user_id) {
                setOtherPlayers((prev) => {
                  const existing = prev.get(data.userId);
                  if (existing) {
                    const updated = new Map(prev);
                    updated.set(data.userId, {
                      ...existing,
                      x: data.x,
                      y: data.y,
                      vx: data.vx,
                      vy: data.vy,
                      facing: data.facing,
                      is_moving: data.is_moving,
                    });
                    return updated;
                  }
                  return prev;
                });
              }
            } else if (data.type === 'chat_broadcast') {
              if (data.chat) {
                const senderId = data.chat.sender_id;
                if (senderId === character.user_id) {
                  setCharacter((prev) => (prev ? { ...prev, last_chat: { message: data.chat.message, timestamp: data.chat.timestamp } } : null));
                } else {
                  setOtherPlayers((prev) => {
                    const existing = prev.get(senderId);
                    if (existing) {
                      const updated = new Map(prev);
                      updated.set(senderId, {
                        ...existing,
                        last_chat: { message: data.chat.message, timestamp: data.chat.timestamp },
                      });
                      return updated;
                    }
                    return prev;
                  });
                }
              }
            } else if (data.type === 'player_left') {
              setOtherPlayers((prev) => {
                const updated = new Map(prev);
                updated.delete(data.userId);
                return updated;
              });
            }
          } catch (e) {}
        };

        ws.onerror = () => {};
        ws.onclose = () => {
          socketRef.current = null;
        };
      } catch (err) {
        console.warn('WS fallback to HTTP sync');
      }
    };

    connectWS();

    // Regular position push to server via WS or HTTP
    const positionSyncInterval = setInterval(() => {
      const p = playerStateRef.current;
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: 'move',
            x: p.x,
            y: p.y,
            vx: p.vx,
            vy: p.vy,
            facing: p.facing,
            is_moving: p.isMoving,
          })
        );
      } else {
        // Fallback HTTP Sync
        fetch('/api/game/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: character.user_id,
            x: p.x,
            y: p.y,
            vx: p.vx,
            vy: p.vy,
            facing: p.facing,
            is_moving: p.isMoving,
            gold: character.gold,
          }),
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.success && Array.isArray(res.players)) {
              const map = new Map<string, GameCharacter>();
              res.players.forEach((other: GameCharacter) => {
                if (other.user_id !== character.user_id) map.set(other.user_id, other);
              });
              setOtherPlayers(map);
              setOnlineCount(map.size + 1);
              if (res.houses) setHouses(res.houses);
            }
          })
          .catch(() => {});
      }
    }, 100);

    // Heartbeat ping
    pingInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        const t0 = Date.now();
        socketRef.current.send(JSON.stringify({ type: 'ping', time: t0 }));
      }
    }, 5000);

    return () => {
      clearInterval(positionSyncInterval);
      if (pingInterval) clearInterval(pingInterval);
      if (ws) ws.close();
    };
  }, [character]);

  // Keyboard Event Listeners for WASD / Arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when user is typing in chat/input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      keysRef.current[e.key.toLowerCase()] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Safe Zone Calculation helper
  const checkZoneState = (px: number, py: number) => {
    for (const t of TERRITORIES) {
      const dx = px - t.centerX;
      const dy = py - t.centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= t.radius) {
        return { isSafe: true, territoryName: t.name, crystalName: t.crystalName };
      }
    }
    return { isSafe: false, territoryName: 'Wilderness Crossroads' };
  };

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Send Chat message
  const handleSendChat = (message: string) => {
    if (!character || !message.trim()) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: 'chat',
          message: message.trim(),
        })
      );
    } else {
      sendGameChatMessage(character.user_id, message.trim());
    }

    // Set local immediate chat bubble
    setCharacter((prev) => (prev ? { ...prev, last_chat: { message: message.trim(), timestamp: Date.now() } } : null));
  };

  // Main 2D Canvas Game Render Loop (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    // Floating ambient mana particles
    const ambientParticles: Array<{ x: number; y: number; size: number; alpha: number; speed: number }> = [];
    for (let i = 0; i < 80; i++) {
      ambientParticles.push({
        x: Math.random() * WORLD_SIZE,
        y: Math.random() * WORLD_SIZE,
        size: Math.random() * 2.5 + 1,
        alpha: Math.random() * 0.4 + 0.2,
        speed: Math.random() * 0.4 + 0.1,
      });
    }

    const render = (time: number) => {
      frameCount++;
      if (time - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = time;
      }

      // Responsive Canvas resize
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const screenWidth = canvas.width;
      const screenHeight = canvas.height;
      const p = playerStateRef.current;

      // 1. Calculate Player Movement Velocity from Keys or Touch Joystick
      let moveX = 0;
      let moveY = 0;

      if (keysRef.current['w'] || keysRef.current['arrowup']) moveY -= 1;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) moveY += 1;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) moveX -= 1;
      if (keysRef.current['d'] || keysRef.current['arrowright']) moveX += 1;

      // Touch Joystick Vector
      if (joystickTouchRef.current && joystickTouchRef.current.active) {
        const joy = joystickTouchRef.current;
        const jdx = joy.currentX - joy.startX;
        const jdy = joy.currentY - joy.startY;
        const dist = Math.sqrt(jdx * jdx + jdy * jdy);
        if (dist > 10) {
          moveX = jdx / dist;
          moveY = jdy / dist;
        }
      } else if (moveX !== 0 && moveY !== 0) {
        // Normalize keyboard diagonal movement
        moveX *= 0.7071;
        moveY *= 0.7071;
      }

      p.vx = moveX * p.speed;
      p.vy = moveY * p.speed;
      p.isMoving = moveX !== 0 || moveY !== 0;

      if (p.isMoving) {
        if (Math.abs(moveX) > Math.abs(moveY)) {
          p.facing = moveX > 0 ? 'right' : 'left';
        } else {
          p.facing = moveY > 0 ? 'down' : 'up';
        }
      }

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Clamp within 2400x2400 world bounds
      p.x = Math.max(30, Math.min(WORLD_SIZE - 30, p.x));
      p.y = Math.max(30, Math.min(WORLD_SIZE - 30, p.y));

      // Player Movement Trail
      if (p.isMoving) {
        p.trail.unshift({ x: p.x, y: p.y, alpha: 0.5 });
        if (p.trail.length > 10) p.trail.pop();
      } else if (p.trail.length > 0) {
        p.trail.pop();
      }

      // Check zone
      const zone = checkZoneState(p.x, p.y);
      setCurrentZone((prev) => {
        if (prev.isSafe !== zone.isSafe || prev.territoryName !== zone.territoryName) {
          return zone;
        }
        return prev;
      });

      // 2. Camera Viewport Calculation (Smooth follow)
      let camX = p.x - screenWidth / 2;
      let camY = p.y - screenHeight / 2;

      // Clamp camera
      camX = Math.max(0, Math.min(WORLD_SIZE - screenWidth, camX));
      camY = Math.max(0, Math.min(WORLD_SIZE - screenHeight, camY));

      ctx.save();
      // Translate canvas coordinate space to camera
      ctx.translate(-camX, -camY);

      // -------------------------------------------------------------
      // 3. RENDER WORLD TERRAIN & QUADRANTS
      // -------------------------------------------------------------
      
      // Base dark ground
      ctx.fillStyle = '#0b1120';
      ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

      // Human Territory Ground (NW)
      ctx.fillStyle = 'rgba(30, 58, 138, 0.12)';
      ctx.fillRect(0, 0, 1200, 1200);

      // Elf Territory Ground (NE)
      ctx.fillStyle = 'rgba(6, 78, 59, 0.12)';
      ctx.fillRect(1200, 0, 1200, 1200);

      // Dwarf Territory Ground (SW)
      ctx.fillStyle = 'rgba(120, 53, 15, 0.12)';
      ctx.fillRect(0, 1200, 1200, 1200);

      // Demon Territory Ground (SE)
      ctx.fillStyle = 'rgba(88, 28, 135, 0.14)';
      ctx.fillRect(1200, 1200, 1200, 1200);

      // World Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < WORLD_SIZE; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_SIZE);
        ctx.stroke();
      }
      for (let y = 0; y < WORLD_SIZE; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_SIZE, y);
        ctx.stroke();
      }

      // Crossroads Paths connecting the 4 realms
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 40;
      ctx.beginPath();
      ctx.moveTo(550, 550);
      ctx.lineTo(1200, 1200);
      ctx.lineTo(1850, 550);
      ctx.moveTo(550, 1850);
      ctx.lineTo(1200, 1200);
      ctx.lineTo(1850, 1850);
      ctx.stroke();

      // Central Arena Monument at (1200, 1200)
      ctx.beginPath();
      ctx.arc(1200, 1200, 160, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚔️ Central Arena (Wilderness PvP)', 1200, 1205);

      // -------------------------------------------------------------
      // 4. RENDER 4 CRYSTAL TERRITORIES & SAFE BARRIERS
      // -------------------------------------------------------------
      TERRITORIES.forEach((t) => {
        const pulse = Math.sin(time / 400) * 8;
        
        // Protective Forcefield Barrier Area
        const barrierGlow = ctx.createRadialGradient(t.centerX, t.centerY, t.radius - 80, t.centerX, t.centerY, t.radius);
        barrierGlow.addColorStop(0, `${t.color}05`);
        barrierGlow.addColorStop(1, `${t.color}25`);
        ctx.fillStyle = barrierGlow;
        ctx.beginPath();
        ctx.arc(t.centerX, t.centerY, t.radius + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Shimmering Forcefield Ring
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([12, 8]);
        ctx.lineDashOffset = -time / 50;
        ctx.stroke();
        ctx.setLineDash([]); // Reset dash

        // Central Crystal Shrine Base
        ctx.beginPath();
        ctx.arc(t.centerX, t.centerY, 48, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fill();
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glowing Crystal Gem (Rotated Diamond)
        const gemPulse = Math.sin(time / 250) * 5;
        ctx.save();
        ctx.translate(t.centerX, t.centerY);
        ctx.rotate(time / 1200);

        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.moveTo(0, -26 - gemPulse);
        ctx.lineTo(18 + gemPulse, 0);
        ctx.lineTo(0, 26 + gemPulse);
        ctx.lineTo(-18 - gemPulse, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Crystal Name Banner
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = t.color;
        ctx.textAlign = 'center';
        ctx.fillText(`💎 ${t.crystalName}`, t.centerX, t.centerY - 64);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '10px sans-serif';
        ctx.fillText(`[SAFE ZONE: ${t.name}]`, t.centerX, t.centerY + 68);
      });

      // -------------------------------------------------------------
      // 5. RENDER PLAYER HOUSES
      // -------------------------------------------------------------
      const allHouses = housesRef.current;
      allHouses.forEach((house) => {
        const isOwner = characterRef.current && house.owner_id === characterRef.current.user_id;

        // House Body
        ctx.fillStyle = isOwner ? '#1e293b' : '#0f172a';
        ctx.fillRect(house.x - 22, house.y - 18, 44, 36);

        // House Roof
        ctx.beginPath();
        ctx.moveTo(house.x - 28, house.y - 18);
        ctx.lineTo(house.x, house.y - 40);
        ctx.lineTo(house.x + 28, house.y - 18);
        ctx.closePath();
        ctx.fillStyle = isOwner ? '#0284c7' : '#475569';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Door
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(house.x - 6, house.y, 12, 18);

        // Owner Name Signplate
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = isOwner ? '#38bdf8' : '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(`🏠 ${house.owner_username}'s House`, house.x, house.y - 46);
      });

      // -------------------------------------------------------------
      // 6. RENDER OTHER ONLINE PLAYERS (Multiplayer)
      // -------------------------------------------------------------
      const others = otherPlayersRef.current;
      others.forEach((other) => {
        const size = 18;
        const color =
          other.race === 'Human'
            ? '#38bdf8'
            : other.race === 'Elf'
            ? '#34d399'
            : other.race === 'Dwarf'
            ? '#fbbf24'
            : '#f43f5e';

        // Remote Player Body
        ctx.beginPath();
        ctx.arc(other.x, other.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nameplate & Rank
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        const otherAgeText = other.age ? ` · ${other.age}` : ' · 18';
        ctx.fillText(`[${other.rank}] ${other.username}${otherAgeText}`, other.x, other.y - size - 8);

        // Remote Player Speech Bubble (Chat)
        if (other.last_chat && Date.now() - other.last_chat.timestamp < 6000) {
          const age = Date.now() - other.last_chat.timestamp;
          const alpha = Math.max(0, 1 - (age - 4500) / 1500);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.font = 'bold 11px sans-serif';
          const textWidth = ctx.measureText(other.last_chat.message).width;
          const bubbleW = textWidth + 18;
          const bubbleH = 22;
          const bubbleX = other.x - bubbleW / 2;
          const bubbleY = other.y - size - 36;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(`💬 ${other.last_chat.message}`, other.x, bubbleY + 15);
          ctx.restore();
        }
      });

      // -------------------------------------------------------------
      // 7. RENDER LOCAL PLAYER CHARACTER
      // -------------------------------------------------------------
      const localChar = characterRef.current;
      const playerColor =
        localChar?.race === 'Human'
          ? '#38bdf8'
          : localChar?.race === 'Elf'
          ? '#34d399'
          : localChar?.race === 'Dwarf'
          ? '#fbbf24'
          : '#f43f5e';

      const playerSize = 19;

      // Player Movement Trail
      p.trail.forEach((t, index) => {
        const decay = 1 - index / p.trail.length;
        ctx.fillStyle = `${playerColor}${Math.floor(decay * 70).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.arc(t.x, t.y, playerSize * 0.8 * decay, 0, Math.PI * 2);
        ctx.fill();
      });

      // Active Aura Glow effect
      if (auraActive) {
        const auraPulse = Math.sin(time / 150) * 8;
        const auraGradient = ctx.createRadialGradient(p.x, p.y, 5, p.x, p.y, playerSize * 2.5 + auraPulse);
        auraGradient.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        auraGradient.addColorStop(0.6, 'rgba(147, 51, 234, 0.3)');
        auraGradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, playerSize * 2.5 + auraPulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player Base Aura Disc
      const pGlow = ctx.createRadialGradient(p.x, p.y, 4, p.x, p.y, playerSize * 1.5);
      pGlow.addColorStop(0, `${playerColor}66`);
      pGlow.addColorStop(1, `${playerColor}00`);
      ctx.fillStyle = pGlow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, playerSize * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Main Player Disc
      ctx.beginPath();
      ctx.arc(p.x, p.y, playerSize, 0, Math.PI * 2);
      ctx.fillStyle = playerColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Direction Indicator Dot
      let dirX = 0;
      let dirY = 0;
      if (p.facing === 'up') dirY = -12;
      if (p.facing === 'down') dirY = 12;
      if (p.facing === 'left') dirX = -12;
      if (p.facing === 'right') dirX = 12;

      ctx.beginPath();
      ctx.arc(p.x + dirX, p.y + dirY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Player Nameplate & Rank Tag
      const displayName = localChar ? localChar.username : 'Warrior';
      const rankTag = localChar ? `[${localChar.rank}]` : '[Novice]';
      const ageTag = localChar?.age ? ` · ${localChar.age}` : ' · 18';

      ctx.font = 'bold 12px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`${rankTag} ${displayName}${ageTag}`, p.x, p.y - playerSize - 10);

      // Local Player Speech Bubble (Chat)
      if (localChar?.last_chat && Date.now() - localChar.last_chat.timestamp < 6000) {
        const age = Date.now() - localChar.last_chat.timestamp;
        const alpha = Math.max(0, 1 - (age - 4500) / 1500);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 12px sans-serif';
        const textWidth = ctx.measureText(localChar.last_chat.message).width;
        const bubbleW = textWidth + 20;
        const bubbleH = 24;
        const bubbleX = p.x - bubbleW / 2;
        const bubbleY = p.y - playerSize - 40;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`💬 ${localChar.last_chat.message}`, p.x, bubbleY + 16);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [auraActive]);

  // Click on Canvas to select other player for interaction
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const p = playerStateRef.current;
    const camX = Math.max(0, Math.min(WORLD_SIZE - canvas.width, p.x - canvas.width / 2));
    const camY = Math.max(0, Math.min(WORLD_SIZE - canvas.height, p.y - canvas.height / 2));

    const worldClickX = clickX + camX;
    const worldClickY = clickY + camY;

    // Check if clicked any remote player
    for (const other of otherPlayersRef.current.values()) {
      const dx = worldClickX - other.x;
      const dy = worldClickY - other.y;
      if (Math.sqrt(dx * dx + dy * dy) < 30) {
        setSelectedPlayer(other);
        return;
      }
    }
  };

  // Touch Virtual Joystick for Mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch && touch.clientX < window.innerWidth * 0.55) {
      joystickTouchRef.current = {
        active: true,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!joystickTouchRef.current || !joystickTouchRef.current.active) return;
    const touch = e.touches[0];
    if (touch) {
      joystickTouchRef.current.currentX = touch.clientX;
      joystickTouchRef.current.currentY = touch.clientY;
    }
  };

  const handleTouchEnd = () => {
    joystickTouchRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      translate="no"
      lang="en"
      className="notranslate relative w-full h-[calc(100vh-4rem)] bg-slate-950 flex flex-col justify-between overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Character Creation Modal (if new player) */}
      {needsCharacterCreation && (
        <CharacterCreationModal
          userId={user?.id || (profile?.id ? String(profile.id) : 'guest_' + Math.random().toString(36).substring(2, 8))}
          defaultDisplayName={profile?.display_name || profile?.username || ''}
          avatarUrl={profile?.avatar_url}
          defaultAge={profile?.age || 18}
          onCharacterCreated={(newChar) => {
            setCharacter(newChar);
            playerStateRef.current.x = newChar.x;
            playerStateRef.current.y = newChar.y;
            setNeedsCharacterCreation(false);
          }}
        />
      )}

      {/* 2. Player Interaction Modal (when tapping another warrior) */}
      {selectedPlayer && character && (
        <PlayerInteractionModal
          player={selectedPlayer}
          currentUser={character}
          onClose={() => setSelectedPlayer(null)}
          onGoldTransferred={(newGold) => {
            setCharacter((prev) => (prev ? { ...prev, gold: newGold } : null));
          }}
        />
      )}

      {/* 3. Top HUD overlay */}
      {character && (
        <GameHUD
          player={character}
          currentZone={currentZone}
          onlineCount={onlineCount}
          fps={fps}
          ping={ping}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          showMinimap={showMinimap}
          onToggleMinimap={() => setShowMinimap(!showMinimap)}
          onSendChat={handleSendChat}
          onToggleAura={() => setAuraActive(!auraActive)}
          auraActive={auraActive}
        />
      )}

      {/* 4. Mini-Map Modal/Drawer */}
      {showMinimap && character && (
        <GameMiniMap
          player={character}
          otherPlayers={Array.from(otherPlayers.values())}
          houses={houses}
          territories={TERRITORIES}
          worldSize={WORLD_SIZE}
          onClose={() => setShowMinimap(false)}
        />
      )}

      {/* 5. Main 2D HTML5 Canvas World Viewport */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full block cursor-crosshair touch-none"
      />

      {/* Mobile Touch Joystick Visual Indicator */}
      <div className="absolute bottom-6 left-6 md:hidden pointer-events-none z-20">
        <div className="w-24 h-24 rounded-full border-2 border-sky-400/30 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-sky-500/40 border border-sky-300 animate-pulse" />
        </div>
      </div>

    </div>
  );
}
