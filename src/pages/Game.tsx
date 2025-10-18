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

const LEVELS = [
  { id: 1, name: '🇦🇫 Kabul', moves: 30, goals: [{ type: 'red' as GemType, count: 10 }, { type: 'blue' as GemType, count: 10 }] },
  { id: 2, name: '🇦🇫 Kandahar', moves: 30, goals: [{ type: 'green' as GemType, count: 10 }, { type: 'yellow' as GemType, count: 10 }] },
  { id: 3, name: '🇦🇫 Herat', moves: 29, goals: [{ type: 'purple' as GemType, count: 12 }, { type: 'orange' as GemType, count: 12 }] },
  { id: 4, name: '🇪🇹 Addis Ababa', moves: 29, goals: [{ type: 'pink' as GemType, count: 12 }, { type: 'cyan' as GemType, count: 12 }] },
  { id: 5, name: '🇪🇹 Dire Dawa', moves: 28, goals: [{ type: 'lime' as GemType, count: 14 }, { type: 'magenta' as GemType, count: 14 }] },
  { id: 6, name: '🇧🇩 Dhaka', moves: 28, goals: [{ type: 'red' as GemType, count: 14 }, { type: 'blue' as GemType, count: 14 }] },
  { id: 7, name: '🇧🇩 Chittagong', moves: 28, goals: [{ type: 'green' as GemType, count: 15 }, { type: 'yellow' as GemType, count: 15 }] },
  { id: 8, name: '🇳🇵 Kathmandu', moves: 27, goals: [{ type: 'purple' as GemType, count: 15 }, { type: 'orange' as GemType, count: 15 }] },
  { id: 9, name: '🇳🇵 Pokhara', moves: 27, goals: [{ type: 'pink' as GemType, count: 16 }, { type: 'cyan' as GemType, count: 16 }] },
  { id: 10, name: '🇰🇪 Nairobi', moves: 27, goals: [{ type: 'lime' as GemType, count: 16 }, { type: 'magenta' as GemType, count: 16 }] },
  { id: 11, name: '🇰🇪 Mombasa', moves: 26, goals: [{ type: 'red' as GemType, count: 17 }, { type: 'blue' as GemType, count: 17 }] },
  { id: 12, name: '🇵🇰 Karachi', moves: 26, goals: [{ type: 'green' as GemType, count: 17 }, { type: 'yellow' as GemType, count: 17 }] },
  { id: 13, name: '🇵🇰 Lahore', moves: 26, goals: [{ type: 'purple' as GemType, count: 18 }, { type: 'orange' as GemType, count: 18 }] },
  { id: 14, name: '🇵🇰 Islamabad', moves: 25, goals: [{ type: 'pink' as GemType, count: 18 }, { type: 'cyan' as GemType, count: 18 }] },
  { id: 15, name: '🇵🇭 Manila', moves: 25, goals: [{ type: 'lime' as GemType, count: 19 }, { type: 'magenta' as GemType, count: 19 }] },
  { id: 16, name: '🇵🇭 Cebu', moves: 25, goals: [{ type: 'red' as GemType, count: 19 }, { type: 'blue' as GemType, count: 19 }] },
  { id: 17, name: '🇵🇭 Davao', moves: 25, goals: [{ type: 'green' as GemType, count: 20 }, { type: 'yellow' as GemType, count: 20 }] },
  { id: 18, name: '🇻🇳 Hanoi', moves: 24, goals: [{ type: 'purple' as GemType, count: 20 }, { type: 'orange' as GemType, count: 20 }] },
  { id: 19, name: '🇻🇳 Ho Chi Minh', moves: 24, goals: [{ type: 'pink' as GemType, count: 21 }, { type: 'cyan' as GemType, count: 21 }] },
  { id: 20, name: '🇻🇳 Da Nang', moves: 24, goals: [{ type: 'lime' as GemType, count: 21 }, { type: 'magenta' as GemType, count: 21 }] },
  { id: 21, name: '🇮🇩 Jakarta', moves: 24, goals: [{ type: 'red' as GemType, count: 22 }, { type: 'blue' as GemType, count: 22 }] },
  { id: 22, name: '🇮🇩 Surabaya', moves: 23, goals: [{ type: 'green' as GemType, count: 22 }, { type: 'yellow' as GemType, count: 22 }] },
  { id: 23, name: '🇮🇩 Bandung', moves: 23, goals: [{ type: 'purple' as GemType, count: 23 }, { type: 'orange' as GemType, count: 23 }] },
  { id: 24, name: '🇮🇩 Medan', moves: 23, goals: [{ type: 'pink' as GemType, count: 23 }, { type: 'cyan' as GemType, count: 23 }] },
  { id: 25, name: '🇪🇬 Cairo', moves: 23, goals: [{ type: 'lime' as GemType, count: 24 }, { type: 'magenta' as GemType, count: 24 }] },
  { id: 26, name: '🇪🇬 Alexandria', moves: 22, goals: [{ type: 'red' as GemType, count: 24 }, { type: 'blue' as GemType, count: 24 }] },
  { id: 27, name: '🇪🇬 Giza', moves: 22, goals: [{ type: 'green' as GemType, count: 25 }, { type: 'yellow' as GemType, count: 25 }] },
  { id: 28, name: '🇮🇳 Delhi', moves: 22, goals: [{ type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 29, name: '🇮🇳 Mumbai', moves: 22, goals: [{ type: 'pink' as GemType, count: 26 }, { type: 'cyan' as GemType, count: 26 }] },
  { id: 30, name: '🇮🇳 Bangalore', moves: 22, goals: [{ type: 'lime' as GemType, count: 26 }, { type: 'magenta' as GemType, count: 26 }] },
  { id: 31, name: '🇮🇳 Kolkata', moves: 21, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 32, name: '🇮🇳 Chennai', moves: 21, goals: [{ type: 'green' as GemType, count: 27 }, { type: 'yellow' as GemType, count: 27 }] },
  { id: 33, name: '🇹🇭 Bangkok', moves: 21, goals: [{ type: 'purple' as GemType, count: 28 }, { type: 'orange' as GemType, count: 28 }] },
  { id: 34, name: '🇹🇭 Pattaya', moves: 21, goals: [{ type: 'pink' as GemType, count: 28 }, { type: 'cyan' as GemType, count: 28 }] },
  { id: 35, name: '🇹🇭 Chiang Mai', moves: 21, goals: [{ type: 'lime' as GemType, count: 29 }, { type: 'magenta' as GemType, count: 29 }] },
  { id: 36, name: '🇧🇷 São Paulo', moves: 20, goals: [{ type: 'red' as GemType, count: 29 }, { type: 'blue' as GemType, count: 29 }] },
  { id: 37, name: '🇧🇷 Rio de Janeiro', moves: 20, goals: [{ type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 38, name: '🇧🇷 Brasília', moves: 20, goals: [{ type: 'purple' as GemType, count: 30 }, { type: 'orange' as GemType, count: 30 }] },
  { id: 39, name: '🇧🇷 Salvador', moves: 20, goals: [{ type: 'pink' as GemType, count: 31 }, { type: 'cyan' as GemType, count: 31 }] },
  { id: 40, name: '🇲🇽 Mexico City', moves: 20, goals: [{ type: 'lime' as GemType, count: 31 }, { type: 'magenta' as GemType, count: 31 }] },
  { id: 41, name: '🇲🇽 Guadalajara', moves: 20, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  { id: 42, name: '🇲🇽 Monterrey', moves: 19, goals: [{ type: 'green' as GemType, count: 32 }, { type: 'yellow' as GemType, count: 32 }] },
  { id: 43, name: '🇦🇷 Buenos Aires', moves: 19, goals: [{ type: 'purple' as GemType, count: 33 }, { type: 'orange' as GemType, count: 33 }] },
  { id: 44, name: '🇦🇷 Córdoba', moves: 19, goals: [{ type: 'pink' as GemType, count: 33 }, { type: 'cyan' as GemType, count: 33 }] },
  { id: 45, name: '🇿🇦 Johannesburg', moves: 19, goals: [{ type: 'lime' as GemType, count: 34 }, { type: 'magenta' as GemType, count: 34 }] },
  { id: 46, name: '🇿🇦 Cape Town', moves: 19, goals: [{ type: 'red' as GemType, count: 34 }, { type: 'blue' as GemType, count: 34 }] },
  { id: 47, name: '🇿🇦 Durban', moves: 19, goals: [{ type: 'green' as GemType, count: 35 }, { type: 'yellow' as GemType, count: 35 }] },
  { id: 48, name: '🇷🇺 Moscow', moves: 19, goals: [{ type: 'purple' as GemType, count: 35 }, { type: 'orange' as GemType, count: 35 }] },
  { id: 49, name: '🇷🇺 St Petersburg', moves: 18, goals: [{ type: 'pink' as GemType, count: 36 }, { type: 'cyan' as GemType, count: 36 }] },
  { id: 50, name: '🇵🇱 Warsaw', moves: 18, goals: [{ type: 'lime' as GemType, count: 36 }, { type: 'magenta' as GemType, count: 36 }] },
  { id: 51, name: '🇵🇱 Krakow', moves: 18, goals: [{ type: 'red' as GemType, count: 37 }, { type: 'blue' as GemType, count: 37 }] },
  { id: 52, name: '🇪🇸 Madrid', moves: 18, goals: [{ type: 'green' as GemType, count: 37 }, { type: 'yellow' as GemType, count: 37 }] },
  { id: 53, name: '🇪🇸 Barcelona', moves: 18, goals: [{ type: 'purple' as GemType, count: 38 }, { type: 'orange' as GemType, count: 38 }] },
  { id: 54, name: '🇪🇸 Valencia', moves: 18, goals: [{ type: 'pink' as GemType, count: 38 }, { type: 'cyan' as GemType, count: 38 }] },
  { id: 55, name: '🇪🇸 Seville', moves: 18, goals: [{ type: 'lime' as GemType, count: 39 }, { type: 'magenta' as GemType, count: 39 }] },
  { id: 56, name: '🇮🇹 Rome', moves: 18, goals: [{ type: 'red' as GemType, count: 39 }, { type: 'blue' as GemType, count: 39 }] },
  { id: 57, name: '🇮🇹 Milan', moves: 17, goals: [{ type: 'green' as GemType, count: 40 }, { type: 'yellow' as GemType, count: 40 }] },
  { id: 58, name: '🇮🇹 Naples', moves: 17, goals: [{ type: 'purple' as GemType, count: 40 }, { type: 'orange' as GemType, count: 40 }] },
  { id: 59, name: '🇮🇹 Florence', moves: 17, goals: [{ type: 'pink' as GemType, count: 41 }, { type: 'cyan' as GemType, count: 41 }] },
  { id: 60, name: '🇮🇹 Venice', moves: 17, goals: [{ type: 'lime' as GemType, count: 41 }, { type: 'magenta' as GemType, count: 41 }] },
  { id: 61, name: '🇫🇷 Paris', moves: 17, goals: [{ type: 'red' as GemType, count: 42 }, { type: 'blue' as GemType, count: 42 }] },
  { id: 62, name: '🇫🇷 Lyon', moves: 17, goals: [{ type: 'green' as GemType, count: 42 }, { type: 'yellow' as GemType, count: 42 }] },
  { id: 63, name: '🇫🇷 Marseille', moves: 17, goals: [{ type: 'purple' as GemType, count: 43 }, { type: 'orange' as GemType, count: 43 }] },
  { id: 64, name: '🇫🇷 Nice', moves: 17, goals: [{ type: 'pink' as GemType, count: 43 }, { type: 'cyan' as GemType, count: 43 }] },
  { id: 65, name: '🇬🇧 London', moves: 17, goals: [{ type: 'lime' as GemType, count: 44 }, { type: 'magenta' as GemType, count: 44 }] },
  { id: 66, name: '🇬🇧 Manchester', moves: 16, goals: [{ type: 'red' as GemType, count: 44 }, { type: 'blue' as GemType, count: 44 }] },
  { id: 67, name: '🇬🇧 Birmingham', moves: 16, goals: [{ type: 'green' as GemType, count: 45 }, { type: 'yellow' as GemType, count: 45 }] },
  { id: 68, name: '🇬🇧 Liverpool', moves: 16, goals: [{ type: 'purple' as GemType, count: 45 }, { type: 'orange' as GemType, count: 45 }] },
  { id: 69, name: '🇨🇦 Toronto', moves: 16, goals: [{ type: 'pink' as GemType, count: 46 }, { type: 'cyan' as GemType, count: 46 }] },
  { id: 70, name: '🇨🇦 Montreal', moves: 16, goals: [{ type: 'lime' as GemType, count: 46 }, { type: 'magenta' as GemType, count: 46 }] },
  { id: 71, name: '🇨🇦 Vancouver', moves: 16, goals: [{ type: 'red' as GemType, count: 47 }, { type: 'blue' as GemType, count: 47 }] },
  { id: 72, name: '🇩🇪 Berlin', moves: 16, goals: [{ type: 'green' as GemType, count: 47 }, { type: 'yellow' as GemType, count: 47 }] },
  { id: 73, name: '🇩🇪 Munich', moves: 16, goals: [{ type: 'purple' as GemType, count: 48 }, { type: 'orange' as GemType, count: 48 }] },
  { id: 74, name: '🇩🇪 Hamburg', moves: 16, goals: [{ type: 'pink' as GemType, count: 48 }, { type: 'cyan' as GemType, count: 48 }] },
  { id: 75, name: '🇩🇪 Frankfurt', moves: 16, goals: [{ type: 'lime' as GemType, count: 49 }, { type: 'magenta' as GemType, count: 49 }] },
  { id: 76, name: '🇯🇵 Tokyo', moves: 16, goals: [{ type: 'red' as GemType, count: 49 }, { type: 'blue' as GemType, count: 49 }] },
  { id: 77, name: '🇯🇵 Osaka', moves: 15, goals: [{ type: 'green' as GemType, count: 50 }, { type: 'yellow' as GemType, count: 50 }] },
  { id: 78, name: '🇯🇵 Kyoto', moves: 15, goals: [{ type: 'purple' as GemType, count: 50 }, { type: 'orange' as GemType, count: 50 }] },
  { id: 79, name: '🇯🇵 Yokohama', moves: 15, goals: [{ type: 'pink' as GemType, count: 51 }, { type: 'cyan' as GemType, count: 51 }] },
  { id: 80, name: '🇰🇷 Seoul', moves: 15, goals: [{ type: 'lime' as GemType, count: 51 }, { type: 'magenta' as GemType, count: 51 }] },
  { id: 81, name: '🇰🇷 Busan', moves: 15, goals: [{ type: 'red' as GemType, count: 52 }, { type: 'blue' as GemType, count: 52 }] },
  { id: 82, name: '🇦🇺 Sydney', moves: 15, goals: [{ type: 'green' as GemType, count: 52 }, { type: 'yellow' as GemType, count: 52 }] },
  { id: 83, name: '🇦🇺 Melbourne', moves: 15, goals: [{ type: 'purple' as GemType, count: 53 }, { type: 'orange' as GemType, count: 53 }] },
  { id: 84, name: '🇦🇺 Brisbane', moves: 15, goals: [{ type: 'pink' as GemType, count: 53 }, { type: 'cyan' as GemType, count: 53 }] },
  { id: 85, name: '🇦🇺 Perth', moves: 15, goals: [{ type: 'lime' as GemType, count: 54 }, { type: 'magenta' as GemType, count: 54 }] },
  { id: 86, name: '🇳🇿 Auckland', moves: 15, goals: [{ type: 'red' as GemType, count: 54 }, { type: 'blue' as GemType, count: 54 }] },
  { id: 87, name: '🇳🇿 Wellington', moves: 15, goals: [{ type: 'green' as GemType, count: 55 }, { type: 'yellow' as GemType, count: 55 }] },
  { id: 88, name: '🇨🇳 Beijing', moves: 15, goals: [{ type: 'purple' as GemType, count: 55 }, { type: 'orange' as GemType, count: 55 }] },
  { id: 89, name: '🇨🇳 Shanghai', moves: 15, goals: [{ type: 'pink' as GemType, count: 56 }, { type: 'cyan' as GemType, count: 56 }] },
  { id: 90, name: '🇨🇳 Guangzhou', moves: 15, goals: [{ type: 'lime' as GemType, count: 56 }, { type: 'magenta' as GemType, count: 56 }] },
  { id: 91, name: '🇨🇳 Shenzhen', moves: 15, goals: [{ type: 'red' as GemType, count: 57 }, { type: 'blue' as GemType, count: 57 }] },
  { id: 92, name: '🇨🇳 Hong Kong', moves: 15, goals: [{ type: 'green' as GemType, count: 57 }, { type: 'yellow' as GemType, count: 57 }] },
  { id: 93, name: '🇸🇬 Singapore', moves: 15, goals: [{ type: 'purple' as GemType, count: 58 }, { type: 'orange' as GemType, count: 58 }] },
  { id: 94, name: '🇲🇾 Kuala Lumpur', moves: 15, goals: [{ type: 'pink' as GemType, count: 58 }, { type: 'cyan' as GemType, count: 58 }] },
  { id: 95, name: '🇦🇪 Dubai', moves: 15, goals: [{ type: 'lime' as GemType, count: 59 }, { type: 'magenta' as GemType, count: 59 }] },
  { id: 96, name: '🇦🇪 Abu Dhabi', moves: 15, goals: [{ type: 'red' as GemType, count: 59 }, { type: 'blue' as GemType, count: 59 }] },
  { id: 97, name: '🇸🇦 Riyadh', moves: 15, goals: [{ type: 'green' as GemType, count: 60 }, { type: 'yellow' as GemType, count: 60 }] },
  { id: 98, name: '🇸🇦 Jeddah', moves: 15, goals: [{ type: 'purple' as GemType, count: 60 }, { type: 'orange' as GemType, count: 60 }] },
  { id: 99, name: '🇮🇱 Tel Aviv', moves: 15, goals: [{ type: 'pink' as GemType, count: 61 }, { type: 'cyan' as GemType, count: 61 }] },
  { id: 100, name: '🇮🇱 Jerusalem', moves: 15, goals: [{ type: 'lime' as GemType, count: 61 }, { type: 'magenta' as GemType, count: 61 }] },
  { id: 101, name: '🇱🇧 Beirut', moves: 15, goals: [{ type: 'red' as GemType, count: 62 }, { type: 'blue' as GemType, count: 62 }] },
  { id: 102, name: '🇯🇴 Amman', moves: 15, goals: [{ type: 'green' as GemType, count: 62 }, { type: 'yellow' as GemType, count: 62 }] },
  { id: 103, name: '🇶🇦 Doha', moves: 15, goals: [{ type: 'purple' as GemType, count: 63 }, { type: 'orange' as GemType, count: 63 }] },
  { id: 104, name: '🇰🇼 Kuwait City', moves: 15, goals: [{ type: 'pink' as GemType, count: 63 }, { type: 'cyan' as GemType, count: 63 }] },
  { id: 105, name: '🇺🇸 New York', moves: 15, goals: [{ type: 'lime' as GemType, count: 64 }, { type: 'magenta' as GemType, count: 64 }] },
  { id: 106, name: '🇺🇸 Los Angeles', moves: 15, goals: [{ type: 'red' as GemType, count: 64 }, { type: 'blue' as GemType, count: 64 }] },
  { id: 107, name: '🇺🇸 Chicago', moves: 15, goals: [{ type: 'green' as GemType, count: 65 }, { type: 'yellow' as GemType, count: 65 }] },
  { id: 108, name: '🇺🇸 Houston', moves: 15, goals: [{ type: 'purple' as GemType, count: 65 }, { type: 'orange' as GemType, count: 65 }] },
  { id: 109, name: '🇺🇸 Miami', moves: 15, goals: [{ type: 'pink' as GemType, count: 66 }, { type: 'cyan' as GemType, count: 66 }] },
  { id: 110, name: '🇺🇸 San Francisco', moves: 15, goals: [{ type: 'lime' as GemType, count: 66 }, { type: 'magenta' as GemType, count: 66 }] },
  { id: 111, name: '🇺🇸 Las Vegas', moves: 15, goals: [{ type: 'red' as GemType, count: 67 }, { type: 'blue' as GemType, count: 67 }] },
  { id: 112, name: '🇺🇸 Boston', moves: 15, goals: [{ type: 'green' as GemType, count: 67 }, { type: 'yellow' as GemType, count: 67 }] },
  { id: 113, name: '🇺🇸 Seattle', moves: 15, goals: [{ type: 'purple' as GemType, count: 68 }, { type: 'orange' as GemType, count: 68 }] },
  { id: 114, name: '🇺🇸 Washington DC', moves: 15, goals: [{ type: 'pink' as GemType, count: 68 }, { type: 'cyan' as GemType, count: 68 }] },
  { id: 115, name: '🇨🇭 Zurich', moves: 15, goals: [{ type: 'lime' as GemType, count: 69 }, { type: 'magenta' as GemType, count: 69 }] },
  { id: 116, name: '🇨🇭 Geneva', moves: 15, goals: [{ type: 'red' as GemType, count: 69 }, { type: 'blue' as GemType, count: 69 }] },
  { id: 117, name: '🇦🇹 Vienna', moves: 15, goals: [{ type: 'green' as GemType, count: 70 }, { type: 'yellow' as GemType, count: 70 }] },
  { id: 118, name: '🇦🇹 Salzburg', moves: 15, goals: [{ type: 'purple' as GemType, count: 70 }, { type: 'orange' as GemType, count: 70 }] },
  { id: 119, name: '🇧🇪 Brussels', moves: 15, goals: [{ type: 'pink' as GemType, count: 71 }, { type: 'cyan' as GemType, count: 71 }] },
  { id: 120, name: '🇳🇱 Amsterdam', moves: 15, goals: [{ type: 'lime' as GemType, count: 71 }, { type: 'magenta' as GemType, count: 71 }] },
  { id: 121, name: '🇳🇱 Rotterdam', moves: 15, goals: [{ type: 'red' as GemType, count: 72 }, { type: 'blue' as GemType, count: 72 }] },
  { id: 122, name: '🇩🇰 Copenhagen', moves: 15, goals: [{ type: 'green' as GemType, count: 72 }, { type: 'yellow' as GemType, count: 72 }] },
  { id: 123, name: '🇸🇪 Stockholm', moves: 15, goals: [{ type: 'purple' as GemType, count: 73 }, { type: 'orange' as GemType, count: 73 }] },
  { id: 124, name: '🇸🇪 Gothenburg', moves: 15, goals: [{ type: 'pink' as GemType, count: 73 }, { type: 'cyan' as GemType, count: 73 }] },
  { id: 125, name: '🇳🇴 Oslo', moves: 15, goals: [{ type: 'lime' as GemType, count: 74 }, { type: 'magenta' as GemType, count: 74 }] },
  { id: 126, name: '🇫🇮 Helsinki', moves: 15, goals: [{ type: 'red' as GemType, count: 74 }, { type: 'blue' as GemType, count: 74 }] },
  { id: 127, name: '🇮🇪 Dublin', moves: 15, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  { id: 128, name: '🇵🇹 Lisbon', moves: 15, goals: [{ type: 'purple' as GemType, count: 75 }, { type: 'orange' as GemType, count: 75 }] },
  { id: 129, name: '🇵🇹 Porto', moves: 15, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 130, name: '🇬🇷 Athens', moves: 15, goals: [{ type: 'lime' as GemType, count: 76 }, { type: 'magenta' as GemType, count: 76 }] },
  { id: 131, name: '🇭🇷 Zagreb', moves: 15, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 132, name: '🇭🇷 Dubrovnik', moves: 15, goals: [{ type: 'green' as GemType, count: 77 }, { type: 'yellow' as GemType, count: 77 }] },
  { id: 133, name: '🇷🇸 Belgrade', moves: 15, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 134, name: '🇧🇬 Sofia', moves: 15, goals: [{ type: 'pink' as GemType, count: 78 }, { type: 'cyan' as GemType, count: 78 }] },
  { id: 135, name: '🇷🇴 Bucharest', moves: 15, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 136, name: '🇭🇺 Budapest', moves: 15, goals: [{ type: 'red' as GemType, count: 79 }, { type: 'blue' as GemType, count: 79 }] },
  { id: 137, name: '🇨🇿 Prague', moves: 15, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 138, name: '🇺🇦 Kyiv', moves: 15, goals: [{ type: 'purple' as GemType, count: 80 }, { type: 'orange' as GemType, count: 80 }] },
  { id: 139, name: '🇺🇦 Odessa', moves: 15, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 140, name: '🇬🇪 Tbilisi', moves: 15, goals: [{ type: 'lime' as GemType, count: 81 }, { type: 'magenta' as GemType, count: 81 }] },
  { id: 141, name: '🇦🇲 Yerevan', moves: 15, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 142, name: '🇦🇿 Baku', moves: 15, goals: [{ type: 'green' as GemType, count: 82 }, { type: 'yellow' as GemType, count: 82 }] },
  { id: 143, name: '🇰🇿 Almaty', moves: 15, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 144, name: '🇺🇿 Tashkent', moves: 15, goals: [{ type: 'pink' as GemType, count: 83 }, { type: 'cyan' as GemType, count: 83 }] },
  { id: 145, name: '🇺🇿 Samarkand', moves: 15, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 146, name: '🇮🇷 Tehran', moves: 15, goals: [{ type: 'red' as GemType, count: 84 }, { type: 'blue' as GemType, count: 84 }] },
  { id: 147, name: '🇮🇷 Isfahan', moves: 15, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 148, name: '🇮🇶 Baghdad', moves: 15, goals: [{ type: 'purple' as GemType, count: 85 }, { type: 'orange' as GemType, count: 85 }] },
  { id: 149, name: '🇸🇾 Damascus', moves: 15, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 150, name: '🇨🇴 Bogotá', moves: 15, goals: [{ type: 'lime' as GemType, count: 86 }, { type: 'magenta' as GemType, count: 86 }] },
  { id: 151, name: '🇨🇴 Medellín', moves: 15, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 152, name: '🇵🇪 Lima', moves: 15, goals: [{ type: 'green' as GemType, count: 87 }, { type: 'yellow' as GemType, count: 87 }] },
  { id: 153, name: '🇵🇪 Cusco', moves: 15, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 154, name: '🇨🇱 Santiago', moves: 15, goals: [{ type: 'pink' as GemType, count: 88 }, { type: 'cyan' as GemType, count: 88 }] },
  { id: 155, name: '🇻🇪 Caracas', moves: 15, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 156, name: '🇪🇨 Quito', moves: 15, goals: [{ type: 'red' as GemType, count: 89 }, { type: 'blue' as GemType, count: 89 }] },
  { id: 157, name: '🇧🇴 La Paz', moves: 15, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 158, name: '🇳🇬 Lagos', moves: 15, goals: [{ type: 'purple' as GemType, count: 90 }, { type: 'orange' as GemType, count: 90 }] },
  { id: 159, name: '🇬🇭 Accra', moves: 15, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 160, name: '🇲🇦 Casablanca', moves: 15, goals: [{ type: 'lime' as GemType, count: 91 }, { type: 'magenta' as GemType, count: 91 }] },
  { id: 161, name: '🇲🇦 Marrakech', moves: 15, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 162, name: '🇹🇳 Tunis', moves: 15, goals: [{ type: 'green' as GemType, count: 92 }, { type: 'yellow' as GemType, count: 92 }] },
  { id: 163, name: '🇩🇿 Algiers', moves: 15, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 164, name: '🇱🇰 Colombo', moves: 15, goals: [{ type: 'pink' as GemType, count: 93 }, { type: 'cyan' as GemType, count: 93 }] },
  { id: 165, name: '🇲🇲 Yangon', moves: 15, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 166, name: '🇰🇭 Phnom Penh', moves: 15, goals: [{ type: 'red' as GemType, count: 94 }, { type: 'blue' as GemType, count: 94 }] },
  { id: 167, name: '🇱🇦 Vientiane', moves: 15, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 168, name: '🇲🇳 Ulaanbaatar', moves: 15, goals: [{ type: 'purple' as GemType, count: 95 }, { type: 'orange' as GemType, count: 95 }] },
  { id: 169, name: '🇹🇼 Taipei', moves: 15, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 170, name: '🇨🇺 Havana', moves: 15, goals: [{ type: 'lime' as GemType, count: 96 }, { type: 'magenta' as GemType, count: 96 }] },
  { id: 171, name: '🇩🇴 Santo Domingo', moves: 15, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 172, name: '🇯🇲 Kingston', moves: 15, goals: [{ type: 'green' as GemType, count: 97 }, { type: 'yellow' as GemType, count: 97 }] },
  { id: 173, name: '🇵🇦 Panama City', moves: 15, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 174, name: '🇨🇷 San José', moves: 15, goals: [{ type: 'pink' as GemType, count: 98 }, { type: 'cyan' as GemType, count: 98 }] },
  { id: 175, name: '🇬🇹 Guatemala City', moves: 15, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 176, name: '🇭🇳 Tegucigalpa', moves: 15, goals: [{ type: 'red' as GemType, count: 99 }, { type: 'blue' as GemType, count: 99 }] },
  { id: 177, name: '🇸🇻 San Salvador', moves: 15, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 178, name: '🇳🇮 Managua', moves: 15, goals: [{ type: 'purple' as GemType, count: 100 }, { type: 'orange' as GemType, count: 100 }] },
  { id: 179, name: '🇹🇷 Istanbul', moves: 15, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 180, name: '🇹🇷 Ankara', moves: 15, goals: [{ type: 'lime' as GemType, count: 101 }, { type: 'magenta' as GemType, count: 101 }] },
  { id: 181, name: '🇹🇷 Izmir', moves: 15, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 182, name: '🇹🇷 Antalya', moves: 15, goals: [{ type: 'green' as GemType, count: 102 }, { type: 'yellow' as GemType, count: 102 }] },
  { id: 183, name: '🇹🇷 Bursa', moves: 15, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 184, name: '🇹🇷 Adana', moves: 15, goals: [{ type: 'pink' as GemType, count: 103 }, { type: 'cyan' as GemType, count: 103 }] },
  { id: 185, name: '🇹🇷 Gaziantep', moves: 15, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 186, name: '🇹🇷 Konya', moves: 15, goals: [{ type: 'red' as GemType, count: 104 }, { type: 'blue' as GemType, count: 104 }] },
  { id: 187, name: '🇹🇷 Kayseri', moves: 15, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 188, name: '🇹🇷 Diyarbakır', moves: 15, goals: [{ type: 'purple' as GemType, count: 105 }, { type: 'orange' as GemType, count: 105 }] },
  { id: 189, name: '🇹🇷 Mersin', moves: 15, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 190, name: '🇹🇷 Eskişehir', moves: 15, goals: [{ type: 'lime' as GemType, count: 106 }, { type: 'magenta' as GemType, count: 106 }] },
  { id: 191, name: '🇹🇷 Samsun', moves: 15, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 192, name: '🇹🇷 Denizli', moves: 15, goals: [{ type: 'green' as GemType, count: 107 }, { type: 'yellow' as GemType, count: 107 }] },
  { id: 193, name: '🇹🇷 Trabzon', moves: 15, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 194, name: '🇹🇷 Malatya', moves: 15, goals: [{ type: 'pink' as GemType, count: 108 }, { type: 'cyan' as GemType, count: 108 }] },
  { id: 195, name: '🇹🇷 Erzurum', moves: 15, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 196, name: '🇹🇷 Van', moves: 15, goals: [{ type: 'red' as GemType, count: 109 }, { type: 'blue' as GemType, count: 109 }] },
  { id: 197, name: '🇹🇷 Şanlıurfa', moves: 15, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 198, name: '🇹🇷 Kocaeli', moves: 15, goals: [{ type: 'purple' as GemType, count: 110 }, { type: 'orange' as GemType, count: 110 }] },
  { id: 199, name: '🇹🇷 Hatay', moves: 15, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 200, name: '🇹🇷 Bodrum', moves: 15, goals: [{ type: 'lime' as GemType, count: 111 }, { type: 'magenta' as GemType, count: 111 }] },
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
