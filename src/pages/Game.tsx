import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GameBoard } from "@/components/game/GameBoard";
import { GameHeader } from "@/components/game/GameHeader";
import { GameOverModal } from "@/components/game/GameOverModal";
import { ComboDisplay } from "@/components/game/ComboDisplay";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { GemType } from "@/types/game";
import { toast } from "sonner";
import { soundManager } from "@/utils/soundManager";

// Rebalanced levels - all achievable with ~20% easier difficulty and bonus system
const LEVELS = [
  { id: 1, name: '🇦🇫 Kabul', moves: 30, goals: [{ type: 'red' as GemType, count: 8 }, { type: 'blue' as GemType, count: 8 }] },
  { id: 2, name: '🇦🇫 Kandahar', moves: 30, goals: [{ type: 'green' as GemType, count: 8 }, { type: 'yellow' as GemType, count: 8 }] },
  { id: 3, name: '🇦🇫 Herat', moves: 29, goals: [{ type: 'purple' as GemType, count: 9 }, { type: 'orange' as GemType, count: 9 }] },
  { id: 4, name: '🇪🇹 Addis Ababa', moves: 29, goals: [{ type: 'pink' as GemType, count: 9 }, { type: 'cyan' as GemType, count: 9 }] },
  { id: 5, name: '🇪🇹 Dire Dawa', moves: 28, goals: [{ type: 'lime' as GemType, count: 10 }, { type: 'magenta' as GemType, count: 10 }] },
  { id: 6, name: '🇧🇩 Dhaka', moves: 28, goals: [{ type: 'red' as GemType, count: 10 }, { type: 'blue' as GemType, count: 10 }] },
  { id: 7, name: '🇧🇩 Chittagong', moves: 28, goals: [{ type: 'green' as GemType, count: 11 }, { type: 'yellow' as GemType, count: 11 }] },
  { id: 8, name: '🇳🇵 Kathmandu', moves: 27, goals: [{ type: 'purple' as GemType, count: 11 }, { type: 'orange' as GemType, count: 11 }] },
  { id: 9, name: '🇳🇵 Pokhara', moves: 27, goals: [{ type: 'pink' as GemType, count: 12 }, { type: 'cyan' as GemType, count: 12 }] },
  { id: 10, name: '🇰🇪 Nairobi', moves: 27, goals: [{ type: 'lime' as GemType, count: 12 }, { type: 'magenta' as GemType, count: 12 }] },
  { id: 11, name: '🇰🇪 Mombasa', moves: 26, goals: [{ type: 'red' as GemType, count: 12 }, { type: 'blue' as GemType, count: 12 }] },
  { id: 12, name: '🇵🇰 Karachi', moves: 26, goals: [{ type: 'green' as GemType, count: 13 }, { type: 'yellow' as GemType, count: 13 }] },
  { id: 13, name: '🇵🇰 Lahore', moves: 26, goals: [{ type: 'purple' as GemType, count: 13 }, { type: 'orange' as GemType, count: 13 }] },
  { id: 14, name: '🇵🇰 Islamabad', moves: 25, goals: [{ type: 'pink' as GemType, count: 13 }, { type: 'cyan' as GemType, count: 13 }] },
  { id: 15, name: '🇵🇭 Manila', moves: 25, goals: [{ type: 'lime' as GemType, count: 14 }, { type: 'magenta' as GemType, count: 14 }] },
  { id: 16, name: '🇵🇭 Cebu', moves: 25, goals: [{ type: 'red' as GemType, count: 14 }, { type: 'blue' as GemType, count: 14 }] },
  { id: 17, name: '🇵🇭 Davao', moves: 25, goals: [{ type: 'green' as GemType, count: 14 }, { type: 'yellow' as GemType, count: 14 }] },
  { id: 18, name: '🇻🇳 Hanoi', moves: 24, goals: [{ type: 'purple' as GemType, count: 15 }, { type: 'orange' as GemType, count: 15 }] },
  { id: 19, name: '🇻🇳 Ho Chi Minh', moves: 24, goals: [{ type: 'pink' as GemType, count: 15 }, { type: 'cyan' as GemType, count: 15 }] },
  { id: 20, name: '🇻🇳 Da Nang', moves: 24, goals: [{ type: 'lime' as GemType, count: 15 }, { type: 'magenta' as GemType, count: 15 }] },
  { id: 21, name: '🇮🇩 Jakarta', moves: 24, goals: [{ type: 'red' as GemType, count: 15 }, { type: 'blue' as GemType, count: 15 }] },
  { id: 22, name: '🇮🇩 Surabaya', moves: 23, goals: [{ type: 'green' as GemType, count: 16 }, { type: 'yellow' as GemType, count: 16 }] },
  { id: 23, name: '🇮🇩 Bandung', moves: 23, goals: [{ type: 'purple' as GemType, count: 16 }, { type: 'orange' as GemType, count: 16 }] },
  { id: 24, name: '🇮🇩 Medan', moves: 23, goals: [{ type: 'pink' as GemType, count: 16 }, { type: 'cyan' as GemType, count: 16 }] },
  { id: 25, name: '🇪🇬 Cairo', moves: 23, goals: [{ type: 'lime' as GemType, count: 17 }, { type: 'magenta' as GemType, count: 17 }] },
  { id: 26, name: '🇪🇬 Alexandria', moves: 22, goals: [{ type: 'red' as GemType, count: 17 }, { type: 'blue' as GemType, count: 17 }] },
  { id: 27, name: '🇪🇬 Giza', moves: 22, goals: [{ type: 'green' as GemType, count: 17 }, { type: 'yellow' as GemType, count: 17 }] },
  { id: 28, name: '🇮🇳 Delhi', moves: 22, goals: [{ type: 'purple' as GemType, count: 17 }, { type: 'orange' as GemType, count: 17 }] },
  { id: 29, name: '🇮🇳 Mumbai', moves: 22, goals: [{ type: 'pink' as GemType, count: 18 }, { type: 'cyan' as GemType, count: 18 }] },
  { id: 30, name: '🇮🇳 Bangalore', moves: 22, goals: [{ type: 'lime' as GemType, count: 18 }, { type: 'magenta' as GemType, count: 18 }] },
  { id: 31, name: '🇮🇳 Kolkata', moves: 22, goals: [{ type: 'red' as GemType, count: 18 }, { type: 'blue' as GemType, count: 18 }] },
  { id: 32, name: '🇮🇳 Chennai', moves: 22, goals: [{ type: 'green' as GemType, count: 18 }, { type: 'yellow' as GemType, count: 18 }] },
  { id: 33, name: '🇹🇭 Bangkok', moves: 21, goals: [{ type: 'purple' as GemType, count: 18 }, { type: 'orange' as GemType, count: 18 }] },
  { id: 34, name: '🇹🇭 Pattaya', moves: 21, goals: [{ type: 'pink' as GemType, count: 19 }, { type: 'cyan' as GemType, count: 19 }] },
  { id: 35, name: '🇹🇭 Chiang Mai', moves: 21, goals: [{ type: 'lime' as GemType, count: 19 }, { type: 'magenta' as GemType, count: 19 }] },
  { id: 36, name: '🇧🇷 São Paulo', moves: 21, goals: [{ type: 'red' as GemType, count: 19 }, { type: 'blue' as GemType, count: 19 }] },
  { id: 37, name: '🇧🇷 Rio de Janeiro', moves: 21, goals: [{ type: 'green' as GemType, count: 19 }, { type: 'yellow' as GemType, count: 19 }] },
  { id: 38, name: '🇧🇷 Brasília', moves: 21, goals: [{ type: 'purple' as GemType, count: 19 }, { type: 'orange' as GemType, count: 19 }] },
  { id: 39, name: '🇧🇷 Salvador', moves: 21, goals: [{ type: 'pink' as GemType, count: 20 }, { type: 'cyan' as GemType, count: 20 }] },
  { id: 40, name: '🇲🇽 Mexico City', moves: 21, goals: [{ type: 'lime' as GemType, count: 20 }, { type: 'magenta' as GemType, count: 20 }] },
  { id: 41, name: '🇲🇽 Guadalajara', moves: 20, goals: [{ type: 'red' as GemType, count: 20 }, { type: 'blue' as GemType, count: 20 }] },
  { id: 42, name: '🇲🇽 Monterrey', moves: 20, goals: [{ type: 'green' as GemType, count: 20 }, { type: 'yellow' as GemType, count: 20 }] },
  { id: 43, name: '🇦🇷 Buenos Aires', moves: 20, goals: [{ type: 'purple' as GemType, count: 20 }, { type: 'orange' as GemType, count: 20 }] },
  { id: 44, name: '🇦🇷 Córdoba', moves: 20, goals: [{ type: 'pink' as GemType, count: 21 }, { type: 'cyan' as GemType, count: 21 }] },
  { id: 45, name: '🇿🇦 Johannesburg', moves: 20, goals: [{ type: 'lime' as GemType, count: 21 }, { type: 'magenta' as GemType, count: 21 }] },
  { id: 46, name: '🇿🇦 Cape Town', moves: 20, goals: [{ type: 'red' as GemType, count: 21 }, { type: 'blue' as GemType, count: 21 }] },
  { id: 47, name: '🇿🇦 Durban', moves: 20, goals: [{ type: 'green' as GemType, count: 21 }, { type: 'yellow' as GemType, count: 21 }] },
  { id: 48, name: '🇷🇺 Moscow', moves: 20, goals: [{ type: 'purple' as GemType, count: 21 }, { type: 'orange' as GemType, count: 21 }] },
  { id: 49, name: '🇷🇺 St Petersburg', moves: 20, goals: [{ type: 'pink' as GemType, count: 21 }, { type: 'cyan' as GemType, count: 21 }] },
  { id: 50, name: '🇵🇱 Warsaw', moves: 20, goals: [{ type: 'lime' as GemType, count: 21 }, { type: 'magenta' as GemType, count: 21 }] },
  { id: 51, name: '🇵🇱 Krakow', moves: 20, goals: [{ type: 'red' as GemType, count: 22 }, { type: 'blue' as GemType, count: 22 }] },
  { id: 52, name: '🇪🇸 Madrid', moves: 20, goals: [{ type: 'green' as GemType, count: 22 }, { type: 'yellow' as GemType, count: 22 }] },
  { id: 53, name: '🇪🇸 Barcelona', moves: 20, goals: [{ type: 'purple' as GemType, count: 22 }, { type: 'orange' as GemType, count: 22 }] },
  { id: 54, name: '🇪🇸 Valencia', moves: 20, goals: [{ type: 'pink' as GemType, count: 22 }, { type: 'cyan' as GemType, count: 22 }] },
  { id: 55, name: '🇪🇸 Seville', moves: 20, goals: [{ type: 'lime' as GemType, count: 22 }, { type: 'magenta' as GemType, count: 22 }] },
  { id: 56, name: '🇮🇹 Rome', moves: 20, goals: [{ type: 'red' as GemType, count: 22 }, { type: 'blue' as GemType, count: 22 }] },
  { id: 57, name: '🇮🇹 Milan', moves: 20, goals: [{ type: 'green' as GemType, count: 23 }, { type: 'yellow' as GemType, count: 23 }] },
  { id: 58, name: '🇮🇹 Naples', moves: 20, goals: [{ type: 'purple' as GemType, count: 23 }, { type: 'orange' as GemType, count: 23 }] },
  { id: 59, name: '🇮🇹 Florence', moves: 19, goals: [{ type: 'pink' as GemType, count: 23 }, { type: 'cyan' as GemType, count: 23 }] },
  { id: 60, name: '🇮🇹 Venice', moves: 19, goals: [{ type: 'lime' as GemType, count: 23 }, { type: 'magenta' as GemType, count: 23 }] },
  { id: 61, name: '🇫🇷 Paris', moves: 19, goals: [{ type: 'red' as GemType, count: 23 }, { type: 'blue' as GemType, count: 23 }] },
  { id: 62, name: '🇫🇷 Lyon', moves: 19, goals: [{ type: 'green' as GemType, count: 23 }, { type: 'yellow' as GemType, count: 23 }] },
  { id: 63, name: '🇫🇷 Marseille', moves: 19, goals: [{ type: 'purple' as GemType, count: 24 }, { type: 'orange' as GemType, count: 24 }] },
  { id: 64, name: '🇫🇷 Nice', moves: 19, goals: [{ type: 'pink' as GemType, count: 24 }, { type: 'cyan' as GemType, count: 24 }] },
  { id: 65, name: '🇬🇧 London', moves: 19, goals: [{ type: 'lime' as GemType, count: 24 }, { type: 'magenta' as GemType, count: 24 }] },
  { id: 66, name: '🇬🇧 Manchester', moves: 19, goals: [{ type: 'red' as GemType, count: 24 }, { type: 'blue' as GemType, count: 24 }] },
  { id: 67, name: '🇬🇧 Birmingham', moves: 19, goals: [{ type: 'green' as GemType, count: 24 }, { type: 'yellow' as GemType, count: 24 }] },
  { id: 68, name: '🇬🇧 Liverpool', moves: 19, goals: [{ type: 'purple' as GemType, count: 24 }, { type: 'orange' as GemType, count: 24 }] },
  { id: 69, name: '🇨🇦 Toronto', moves: 19, goals: [{ type: 'pink' as GemType, count: 25 }, { type: 'cyan' as GemType, count: 25 }] },
  { id: 70, name: '🇨🇦 Montreal', moves: 19, goals: [{ type: 'lime' as GemType, count: 25 }, { type: 'magenta' as GemType, count: 25 }] },
  { id: 71, name: '🇨🇦 Vancouver', moves: 19, goals: [{ type: 'red' as GemType, count: 25 }, { type: 'blue' as GemType, count: 25 }] },
  { id: 72, name: '🇩🇪 Berlin', moves: 19, goals: [{ type: 'green' as GemType, count: 25 }, { type: 'yellow' as GemType, count: 25 }] },
  { id: 73, name: '🇩🇪 Munich', moves: 19, goals: [{ type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 74, name: '🇩🇪 Hamburg', moves: 19, goals: [{ type: 'pink' as GemType, count: 25 }, { type: 'cyan' as GemType, count: 25 }] },
  { id: 75, name: '🇩🇪 Frankfurt', moves: 19, goals: [{ type: 'lime' as GemType, count: 26 }, { type: 'magenta' as GemType, count: 26 }] },
  { id: 76, name: '🇯🇵 Tokyo', moves: 19, goals: [{ type: 'red' as GemType, count: 26 }, { type: 'blue' as GemType, count: 26 }] },
  { id: 77, name: '🇯🇵 Osaka', moves: 19, goals: [{ type: 'green' as GemType, count: 26 }, { type: 'yellow' as GemType, count: 26 }] },
  { id: 78, name: '🇯🇵 Kyoto', moves: 19, goals: [{ type: 'purple' as GemType, count: 26 }, { type: 'orange' as GemType, count: 26 }] },
  { id: 79, name: '🇯🇵 Yokohama', moves: 19, goals: [{ type: 'pink' as GemType, count: 26 }, { type: 'cyan' as GemType, count: 26 }] },
  { id: 80, name: '🇰🇷 Seoul', moves: 19, goals: [{ type: 'lime' as GemType, count: 26 }, { type: 'magenta' as GemType, count: 26 }] },
  { id: 81, name: '🇰🇷 Busan', moves: 19, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 82, name: '🇦🇺 Sydney', moves: 19, goals: [{ type: 'green' as GemType, count: 27 }, { type: 'yellow' as GemType, count: 27 }] },
  { id: 83, name: '🇦🇺 Melbourne', moves: 18, goals: [{ type: 'purple' as GemType, count: 27 }, { type: 'orange' as GemType, count: 27 }] },
  { id: 84, name: '🇦🇺 Brisbane', moves: 18, goals: [{ type: 'pink' as GemType, count: 27 }, { type: 'cyan' as GemType, count: 27 }] },
  { id: 85, name: '🇦🇺 Perth', moves: 18, goals: [{ type: 'lime' as GemType, count: 27 }, { type: 'magenta' as GemType, count: 27 }] },
  { id: 86, name: '🇳🇿 Auckland', moves: 18, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 87, name: '🇳🇿 Wellington', moves: 18, goals: [{ type: 'green' as GemType, count: 28 }, { type: 'yellow' as GemType, count: 28 }] },
  { id: 88, name: '🇨🇳 Beijing', moves: 18, goals: [{ type: 'purple' as GemType, count: 28 }, { type: 'orange' as GemType, count: 28 }] },
  { id: 89, name: '🇨🇳 Shanghai', moves: 18, goals: [{ type: 'pink' as GemType, count: 28 }, { type: 'cyan' as GemType, count: 28 }] },
  { id: 90, name: '🇨🇳 Guangzhou', moves: 18, goals: [{ type: 'lime' as GemType, count: 28 }, { type: 'magenta' as GemType, count: 28 }] },
  { id: 91, name: '🇨🇳 Shenzhen', moves: 18, goals: [{ type: 'red' as GemType, count: 28 }, { type: 'blue' as GemType, count: 28 }] },
  { id: 92, name: '🇨🇳 Hong Kong', moves: 18, goals: [{ type: 'green' as GemType, count: 28 }, { type: 'yellow' as GemType, count: 28 }] },
  { id: 93, name: '🇸🇬 Singapore', moves: 18, goals: [{ type: 'purple' as GemType, count: 29 }, { type: 'orange' as GemType, count: 29 }] },
  { id: 94, name: '🇲🇾 Kuala Lumpur', moves: 18, goals: [{ type: 'pink' as GemType, count: 29 }, { type: 'cyan' as GemType, count: 29 }] },
  { id: 95, name: '🇦🇪 Dubai', moves: 18, goals: [{ type: 'lime' as GemType, count: 29 }, { type: 'magenta' as GemType, count: 29 }] },
  { id: 96, name: '🇦🇪 Abu Dhabi', moves: 18, goals: [{ type: 'red' as GemType, count: 29 }, { type: 'blue' as GemType, count: 29 }] },
  { id: 97, name: '🇸🇦 Riyadh', moves: 18, goals: [{ type: 'green' as GemType, count: 29 }, { type: 'yellow' as GemType, count: 29 }] },
  { id: 98, name: '🇸🇦 Jeddah', moves: 18, goals: [{ type: 'purple' as GemType, count: 29 }, { type: 'orange' as GemType, count: 29 }] },
  { id: 99, name: '🇮🇱 Tel Aviv', moves: 18, goals: [{ type: 'pink' as GemType, count: 30 }, { type: 'cyan' as GemType, count: 30 }] },
  { id: 100, name: '🇮🇱 Jerusalem', moves: 18, goals: [{ type: 'lime' as GemType, count: 30 }, { type: 'magenta' as GemType, count: 30 }] },
  { id: 101, name: '🇱🇧 Beirut', moves: 18, goals: [{ type: 'red' as GemType, count: 30 }, { type: 'blue' as GemType, count: 30 }] },
  { id: 102, name: '🇯🇴 Amman', moves: 18, goals: [{ type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 103, name: '🇶🇦 Doha', moves: 18, goals: [{ type: 'purple' as GemType, count: 30 }, { type: 'orange' as GemType, count: 30 }] },
  { id: 104, name: '🇰🇼 Kuwait City', moves: 18, goals: [{ type: 'pink' as GemType, count: 30 }, { type: 'cyan' as GemType, count: 30 }] },
  { id: 105, name: '🇺🇸 New York', moves: 18, goals: [{ type: 'lime' as GemType, count: 31 }, { type: 'magenta' as GemType, count: 31 }] },
  { id: 106, name: '🇺🇸 Los Angeles', moves: 18, goals: [{ type: 'red' as GemType, count: 31 }, { type: 'blue' as GemType, count: 31 }] },
  { id: 107, name: '🇺🇸 Chicago', moves: 18, goals: [{ type: 'green' as GemType, count: 31 }, { type: 'yellow' as GemType, count: 31 }] },
  { id: 108, name: '🇺🇸 Houston', moves: 18, goals: [{ type: 'purple' as GemType, count: 31 }, { type: 'orange' as GemType, count: 31 }] },
  { id: 109, name: '🇺🇸 Miami', moves: 18, goals: [{ type: 'pink' as GemType, count: 31 }, { type: 'cyan' as GemType, count: 31 }] },
  { id: 110, name: '🇺🇸 San Francisco', moves: 18, goals: [{ type: 'lime' as GemType, count: 31 }, { type: 'magenta' as GemType, count: 31 }] },
  { id: 111, name: '🇺🇸 Las Vegas', moves: 18, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  { id: 112, name: '🇺🇸 Boston', moves: 18, goals: [{ type: 'green' as GemType, count: 32 }, { type: 'yellow' as GemType, count: 32 }] },
  { id: 113, name: '🇺🇸 Seattle', moves: 18, goals: [{ type: 'purple' as GemType, count: 32 }, { type: 'orange' as GemType, count: 32 }] },
  { id: 114, name: '🇺🇸 Washington DC', moves: 18, goals: [{ type: 'pink' as GemType, count: 32 }, { type: 'cyan' as GemType, count: 32 }] },
  { id: 115, name: '🇨🇭 Zurich', moves: 18, goals: [{ type: 'lime' as GemType, count: 32 }, { type: 'magenta' as GemType, count: 32 }] },
  { id: 116, name: '🇨🇭 Geneva', moves: 18, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  { id: 117, name: '🇦🇹 Vienna', moves: 18, goals: [{ type: 'green' as GemType, count: 33 }, { type: 'yellow' as GemType, count: 33 }] },
  { id: 118, name: '🇦🇹 Salzburg', moves: 18, goals: [{ type: 'purple' as GemType, count: 33 }, { type: 'orange' as GemType, count: 33 }] },
  { id: 119, name: '🇧🇪 Brussels', moves: 18, goals: [{ type: 'pink' as GemType, count: 33 }, { type: 'cyan' as GemType, count: 33 }] },
  { id: 120, name: '🇳🇱 Amsterdam', moves: 18, goals: [{ type: 'lime' as GemType, count: 33 }, { type: 'magenta' as GemType, count: 33 }] },
  { id: 121, name: '🇳🇱 Rotterdam', moves: 18, goals: [{ type: 'red' as GemType, count: 33 }, { type: 'blue' as GemType, count: 33 }] },
  { id: 122, name: '🇩🇰 Copenhagen', moves: 18, goals: [{ type: 'green' as GemType, count: 33 }, { type: 'yellow' as GemType, count: 33 }] },
  { id: 123, name: '🇸🇪 Stockholm', moves: 18, goals: [{ type: 'purple' as GemType, count: 34 }, { type: 'orange' as GemType, count: 34 }] },
  { id: 124, name: '🇸🇪 Gothenburg', moves: 18, goals: [{ type: 'pink' as GemType, count: 34 }, { type: 'cyan' as GemType, count: 34 }] },
  { id: 125, name: '🇳🇴 Oslo', moves: 18, goals: [{ type: 'lime' as GemType, count: 34 }, { type: 'magenta' as GemType, count: 34 }] },
  { id: 126, name: '🇫🇮 Helsinki', moves: 18, goals: [{ type: 'red' as GemType, count: 34 }, { type: 'blue' as GemType, count: 34 }] },
  { id: 127, name: '🇮🇪 Dublin', moves: 18, goals: [{ type: 'green' as GemType, count: 34 }, { type: 'yellow' as GemType, count: 34 }] },
  { id: 128, name: '🇵🇹 Lisbon', moves: 18, goals: [{ type: 'purple' as GemType, count: 34 }, { type: 'orange' as GemType, count: 34 }] },
  { id: 129, name: '🇵🇹 Porto', moves: 18, goals: [{ type: 'pink' as GemType, count: 35 }, { type: 'cyan' as GemType, count: 35 }] },
  { id: 130, name: '🇬🇷 Athens', moves: 18, goals: [{ type: 'lime' as GemType, count: 35 }, { type: 'magenta' as GemType, count: 35 }] },
  { id: 131, name: '🇭🇷 Zagreb', moves: 18, goals: [{ type: 'red' as GemType, count: 35 }, { type: 'blue' as GemType, count: 35 }] },
  { id: 132, name: '🇭🇷 Dubrovnik', moves: 18, goals: [{ type: 'green' as GemType, count: 35 }, { type: 'yellow' as GemType, count: 35 }] },
  { id: 133, name: '🇷🇸 Belgrade', moves: 18, goals: [{ type: 'purple' as GemType, count: 35 }, { type: 'orange' as GemType, count: 35 }] },
  { id: 134, name: '🇧🇬 Sofia', moves: 18, goals: [{ type: 'pink' as GemType, count: 35 }, { type: 'cyan' as GemType, count: 35 }] },
  { id: 135, name: '🇷🇴 Bucharest', moves: 18, goals: [{ type: 'lime' as GemType, count: 36 }, { type: 'magenta' as GemType, count: 36 }] },
  { id: 136, name: '🇭🇺 Budapest', moves: 18, goals: [{ type: 'red' as GemType, count: 36 }, { type: 'blue' as GemType, count: 36 }] },
  { id: 137, name: '🇨🇿 Prague', moves: 18, goals: [{ type: 'green' as GemType, count: 36 }, { type: 'yellow' as GemType, count: 36 }] },
  { id: 138, name: '🇺🇦 Kyiv', moves: 18, goals: [{ type: 'purple' as GemType, count: 36 }, { type: 'orange' as GemType, count: 36 }] },
  { id: 139, name: '🇺🇦 Odessa', moves: 18, goals: [{ type: 'pink' as GemType, count: 36 }, { type: 'cyan' as GemType, count: 36 }] },
  { id: 140, name: '🇬🇪 Tbilisi', moves: 18, goals: [{ type: 'lime' as GemType, count: 36 }, { type: 'magenta' as GemType, count: 36 }] },
  { id: 141, name: '🇦🇲 Yerevan', moves: 18, goals: [{ type: 'red' as GemType, count: 37 }, { type: 'blue' as GemType, count: 37 }] },
  { id: 142, name: '🇦🇿 Baku', moves: 18, goals: [{ type: 'green' as GemType, count: 37 }, { type: 'yellow' as GemType, count: 37 }] },
  { id: 143, name: '🇰🇿 Almaty', moves: 18, goals: [{ type: 'purple' as GemType, count: 37 }, { type: 'orange' as GemType, count: 37 }] },
  { id: 144, name: '🇺🇿 Tashkent', moves: 18, goals: [{ type: 'pink' as GemType, count: 37 }, { type: 'cyan' as GemType, count: 37 }] },
  { id: 145, name: '🇺🇿 Samarkand', moves: 18, goals: [{ type: 'lime' as GemType, count: 37 }, { type: 'magenta' as GemType, count: 37 }] },
  { id: 146, name: '🇮🇷 Tehran', moves: 18, goals: [{ type: 'red' as GemType, count: 37 }, { type: 'blue' as GemType, count: 37 }] },
  { id: 147, name: '🇮🇷 Isfahan', moves: 18, goals: [{ type: 'green' as GemType, count: 38 }, { type: 'yellow' as GemType, count: 38 }] },
  { id: 148, name: '🇮🇶 Baghdad', moves: 18, goals: [{ type: 'purple' as GemType, count: 38 }, { type: 'orange' as GemType, count: 38 }] },
  { id: 149, name: '🇸🇾 Damascus', moves: 18, goals: [{ type: 'pink' as GemType, count: 38 }, { type: 'cyan' as GemType, count: 38 }] },
  { id: 150, name: '🇨🇴 Bogotá', moves: 18, goals: [{ type: 'lime' as GemType, count: 38 }, { type: 'magenta' as GemType, count: 38 }] },
  { id: 151, name: '🇨🇴 Medellín', moves: 18, goals: [{ type: 'red' as GemType, count: 38 }, { type: 'blue' as GemType, count: 38 }] },
  { id: 152, name: '🇵🇪 Lima', moves: 18, goals: [{ type: 'green' as GemType, count: 38 }, { type: 'yellow' as GemType, count: 38 }] },
  { id: 153, name: '🇵🇪 Cusco', moves: 18, goals: [{ type: 'purple' as GemType, count: 39 }, { type: 'orange' as GemType, count: 39 }] },
  { id: 154, name: '🇨🇱 Santiago', moves: 18, goals: [{ type: 'pink' as GemType, count: 39 }, { type: 'cyan' as GemType, count: 39 }] },
  { id: 155, name: '🇻🇪 Caracas', moves: 18, goals: [{ type: 'lime' as GemType, count: 39 }, { type: 'magenta' as GemType, count: 39 }] },
  { id: 156, name: '🇪🇨 Quito', moves: 18, goals: [{ type: 'red' as GemType, count: 39 }, { type: 'blue' as GemType, count: 39 }] },
  { id: 157, name: '🇧🇴 La Paz', moves: 18, goals: [{ type: 'green' as GemType, count: 39 }, { type: 'yellow' as GemType, count: 39 }] },
  { id: 158, name: '🇳🇬 Lagos', moves: 18, goals: [{ type: 'purple' as GemType, count: 39 }, { type: 'orange' as GemType, count: 39 }] },
  { id: 159, name: '🇬🇭 Accra', moves: 18, goals: [{ type: 'pink' as GemType, count: 40 }, { type: 'cyan' as GemType, count: 40 }] },
  { id: 160, name: '🇲🇦 Casablanca', moves: 18, goals: [{ type: 'lime' as GemType, count: 40 }, { type: 'magenta' as GemType, count: 40 }] },
  { id: 161, name: '🇲🇦 Marrakech', moves: 18, goals: [{ type: 'red' as GemType, count: 40 }, { type: 'blue' as GemType, count: 40 }] },
  { id: 162, name: '🇹🇳 Tunis', moves: 18, goals: [{ type: 'green' as GemType, count: 40 }, { type: 'yellow' as GemType, count: 40 }] },
  { id: 163, name: '🇩🇿 Algiers', moves: 18, goals: [{ type: 'purple' as GemType, count: 40 }, { type: 'orange' as GemType, count: 40 }] },
  { id: 164, name: '🇱🇰 Colombo', moves: 18, goals: [{ type: 'pink' as GemType, count: 40 }, { type: 'cyan' as GemType, count: 40 }] },
  { id: 165, name: '🇲🇲 Yangon', moves: 18, goals: [{ type: 'lime' as GemType, count: 41 }, { type: 'magenta' as GemType, count: 41 }] },
  { id: 166, name: '🇰🇭 Phnom Penh', moves: 18, goals: [{ type: 'red' as GemType, count: 41 }, { type: 'blue' as GemType, count: 41 }] },
  { id: 167, name: '🇱🇦 Vientiane', moves: 18, goals: [{ type: 'green' as GemType, count: 41 }, { type: 'yellow' as GemType, count: 41 }] },
  { id: 168, name: '🇲🇳 Ulaanbaatar', moves: 18, goals: [{ type: 'purple' as GemType, count: 41 }, { type: 'orange' as GemType, count: 41 }] },
  { id: 169, name: '🇹🇼 Taipei', moves: 18, goals: [{ type: 'pink' as GemType, count: 41 }, { type: 'cyan' as GemType, count: 41 }] },
  { id: 170, name: '🇨🇺 Havana', moves: 18, goals: [{ type: 'lime' as GemType, count: 41 }, { type: 'magenta' as GemType, count: 41 }] },
  { id: 171, name: '🇩🇴 Santo Domingo', moves: 18, goals: [{ type: 'red' as GemType, count: 42 }, { type: 'blue' as GemType, count: 42 }] },
  { id: 172, name: '🇯🇲 Kingston', moves: 18, goals: [{ type: 'green' as GemType, count: 42 }, { type: 'yellow' as GemType, count: 42 }] },
  { id: 173, name: '🇵🇦 Panama City', moves: 18, goals: [{ type: 'purple' as GemType, count: 42 }, { type: 'orange' as GemType, count: 42 }] },
  { id: 174, name: '🇨🇷 San José', moves: 18, goals: [{ type: 'pink' as GemType, count: 42 }, { type: 'cyan' as GemType, count: 42 }] },
  { id: 175, name: '🇬🇹 Guatemala City', moves: 18, goals: [{ type: 'lime' as GemType, count: 42 }, { type: 'magenta' as GemType, count: 42 }] },
  { id: 176, name: '🇭🇳 Tegucigalpa', moves: 18, goals: [{ type: 'red' as GemType, count: 42 }, { type: 'blue' as GemType, count: 42 }] },
  { id: 177, name: '🇸🇻 San Salvador', moves: 18, goals: [{ type: 'green' as GemType, count: 43 }, { type: 'yellow' as GemType, count: 43 }] },
  { id: 178, name: '🇳🇮 Managua', moves: 18, goals: [{ type: 'purple' as GemType, count: 43 }, { type: 'orange' as GemType, count: 43 }] },
  { id: 179, name: '🇹🇷 Istanbul', moves: 20, goals: [{ type: 'pink' as GemType, count: 23 }, { type: 'cyan' as GemType, count: 23 }] },
  { id: 180, name: '🇹🇷 Ankara', moves: 20, goals: [{ type: 'lime' as GemType, count: 24 }, { type: 'magenta' as GemType, count: 24 }] },
  { id: 181, name: '🇹🇷 Izmir', moves: 20, goals: [{ type: 'red' as GemType, count: 24 }, { type: 'blue' as GemType, count: 24 }] },
  { id: 182, name: '🇹🇷 Antalya', moves: 20, goals: [{ type: 'green' as GemType, count: 25 }, { type: 'yellow' as GemType, count: 25 }] },
  { id: 183, name: '🇹🇷 Bursa', moves: 19, goals: [{ type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 184, name: '🇹🇷 Adana', moves: 19, goals: [{ type: 'pink' as GemType, count: 26 }, { type: 'cyan' as GemType, count: 26 }] },
  { id: 185, name: '🇹🇷 Gaziantep', moves: 19, goals: [{ type: 'lime' as GemType, count: 26 }, { type: 'magenta' as GemType, count: 26 }] },
  { id: 186, name: '🇹🇷 Konya', moves: 19, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 187, name: '🇹🇷 Kayseri', moves: 19, goals: [{ type: 'green' as GemType, count: 27 }, { type: 'yellow' as GemType, count: 27 }] },
  { id: 188, name: '🇹🇷 Diyarbakır', moves: 19, goals: [{ type: 'purple' as GemType, count: 28 }, { type: 'orange' as GemType, count: 28 }] },
  { id: 189, name: '🇹🇷 Mersin', moves: 19, goals: [{ type: 'pink' as GemType, count: 28 }, { type: 'cyan' as GemType, count: 28 }] },
  { id: 190, name: '🇹🇷 Eskişehir', moves: 19, goals: [{ type: 'lime' as GemType, count: 29 }, { type: 'magenta' as GemType, count: 29 }] },
  { id: 191, name: '🇹🇷 Samsun', moves: 19, goals: [{ type: 'red' as GemType, count: 29 }, { type: 'blue' as GemType, count: 29 }] },
  { id: 192, name: '🇹🇷 Denizli', moves: 19, goals: [{ type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 193, name: '🇹🇷 Trabzon', moves: 19, goals: [{ type: 'purple' as GemType, count: 30 }, { type: 'orange' as GemType, count: 30 }] },
  { id: 194, name: '🇹🇷 Malatya', moves: 19, goals: [{ type: 'pink' as GemType, count: 31 }, { type: 'cyan' as GemType, count: 31 }] },
  { id: 195, name: '🇹🇷 Erzurum', moves: 19, goals: [{ type: 'lime' as GemType, count: 31 }, { type: 'magenta' as GemType, count: 31 }] },
  { id: 196, name: '🇹🇷 Van', moves: 19, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  { id: 197, name: '🇹🇷 Şanlıurfa', moves: 19, goals: [{ type: 'green' as GemType, count: 32 }, { type: 'yellow' as GemType, count: 32 }] },
  { id: 198, name: '🇹🇷 Kocaeli', moves: 19, goals: [{ type: 'purple' as GemType, count: 33 }, { type: 'orange' as GemType, count: 33 }] },
  { id: 199, name: '🇹🇷 Hatay', moves: 19, goals: [{ type: 'pink' as GemType, count: 33 }, { type: 'cyan' as GemType, count: 33 }] },
  { id: 200, name: '🇹🇷 Bodrum', moves: 20, goals: [{ type: 'lime' as GemType, count: 32 }, { type: 'magenta' as GemType, count: 32 }] },
];

export default function Game() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const levelId = parseInt(searchParams.get('level') || '1');
  const level = LEVELS.find(l => l.id === levelId) || LEVELS[0];

  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(level.moves);
  const [goals, setGoals] = useState(
    level.goals.map(g => ({ ...g, current: 0, target: g.count }))
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reset game state when level changes
  useEffect(() => {
    setScore(0);
    setMoves(level.moves);
    setGoals(level.goals.map(g => ({ ...g, current: 0, target: g.count })));
    setIsGameOver(false);
    setIsWon(false);
    setCombo(0);
  }, [levelId, level]);

  const handleScoreChange = (points: number) => {
    setScore(prev => prev + points);
  };

  const handleMoveUsed = () => {
    setMoves(prev => prev - 1);
  };

  const handleGemsCollected = (type: GemType, count: number) => {
    setGoals(prev =>
      prev.map(goal =>
        goal.type === type
          ? { ...goal, current: Math.min(goal.current + count, goal.target) }
          : goal
      )
    );
  };

  const handleCombo = (comboCount: number) => {
    setCombo(comboCount);
    if (comboCount > 1) {
      setTimeout(() => setCombo(0), 2000);
    }
  };

  const toggleSound = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  useEffect(() => {
    const allGoalsCompleted = goals.every(g => g.current >= g.target);
    if (allGoalsCompleted && moves >= 0 && !isGameOver) {
      setIsWon(true);
      setIsGameOver(true);
      
      // Unlock next level
      const currentUnlocked = parseInt(localStorage.getItem('unlockedLevel') || '1');
      if (levelId >= currentUnlocked && levelId < 200) {
        localStorage.setItem('unlockedLevel', String(levelId + 1));
        window.dispatchEvent(new Event('levelComplete'));
      }
      
      toast.success("Level Complete! 🎉");
    } else if (moves === 0 && !allGoalsCompleted && !isGameOver) {
      setIsGameOver(true);
      toast.error("No Moves Left! 😢");
    }
  }, [goals, moves, levelId, isGameOver]);

  const handleRestart = () => {
    setScore(0);
    setMoves(level.moves);
    setGoals(level.goals.map(g => ({ ...g, current: 0, target: g.count })));
    setIsGameOver(false);
    setIsWon(false);
    setCombo(0);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">{level.name}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSound}
            className="rounded-full"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        <GameHeader score={score} moves={moves} goals={goals} />
        
        {combo > 1 && <ComboDisplay combo={combo} />}
        
        <GameBoard
          onScoreChange={handleScoreChange}
          onMoveUsed={handleMoveUsed}
          onGemsCollected={handleGemsCollected}
          onCombo={handleCombo}
          gameOver={isGameOver}
          targetGemTypes={level.goals.map(g => g.type)}
        />
      </div>

      <GameOverModal
        isOpen={isGameOver}
        isWon={isWon}
        score={score}
        onRestart={handleRestart}
        onLevelSelect={() => navigate('/')}
        onNextLevel={isWon && levelId < 200 ? () => navigate(`/game?level=${levelId + 1}`) : undefined}
      />
    </div>
  );
}
