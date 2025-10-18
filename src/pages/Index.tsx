import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LevelCard } from "@/components/game/LevelCard";
import { Level } from "@/types/game";

const TOTAL_LEVELS = 200;

const LEVEL_NAMES = [
  '🇦🇫 Kabul', '🇦🇫 Kandahar', '🇦🇫 Herat', '🇪🇹 Addis Ababa', '🇪🇹 Dire Dawa',
  '🇧🇩 Dhaka', '🇧🇩 Chittagong', '🇳🇵 Kathmandu', '🇳🇵 Pokhara', '🇰🇪 Nairobi',
  '🇰🇪 Mombasa', '🇵🇰 Karachi', '🇵🇰 Lahore', '🇵🇰 Islamabad', '🇵🇭 Manila',
  '🇵🇭 Cebu', '🇵🇭 Davao', '🇻🇳 Hanoi', '🇻🇳 Ho Chi Minh', '🇻🇳 Da Nang',
  '🇮🇩 Jakarta', '🇮🇩 Surabaya', '🇮🇩 Bandung', '🇮🇩 Medan', '🇪🇬 Cairo',
  '🇪🇬 Alexandria', '🇪🇬 Giza', '🇮🇳 Delhi', '🇮🇳 Mumbai', '🇮🇳 Bangalore',
  '🇮🇳 Kolkata', '🇮🇳 Chennai', '🇹🇭 Bangkok', '🇹🇭 Pattaya', '🇹🇭 Chiang Mai',
  '🇧🇷 São Paulo', '🇧🇷 Rio de Janeiro', '🇧🇷 Brasília', '🇧🇷 Salvador', '🇲🇽 Mexico City',
  '🇲🇽 Guadalajara', '🇲🇽 Monterrey', '🇦🇷 Buenos Aires', '🇦🇷 Córdoba', '🇿🇦 Johannesburg',
  '🇿🇦 Cape Town', '🇿🇦 Durban', '🇷🇺 Moscow', '🇷🇺 St Petersburg', '🇵🇱 Warsaw',
  '🇵🇱 Krakow', '🇪🇸 Madrid', '🇪🇸 Barcelona', '🇪🇸 Valencia', '🇪🇸 Seville',
  '🇮🇹 Rome', '🇮🇹 Milan', '🇮🇹 Naples', '🇮🇹 Florence', '🇮🇹 Venice',
  '🇫🇷 Paris', '🇫🇷 Lyon', '🇫🇷 Marseille', '🇫🇷 Nice', '🇬🇧 London',
  '🇬🇧 Manchester', '🇬🇧 Birmingham', '🇬🇧 Liverpool', '🇨🇦 Toronto', '🇨🇦 Montreal',
  '🇨🇦 Vancouver', '🇩🇪 Berlin', '🇩🇪 Munich', '🇩🇪 Hamburg', '🇩🇪 Frankfurt',
  '🇯🇵 Tokyo', '🇯🇵 Osaka', '🇯🇵 Kyoto', '🇯🇵 Yokohama', '🇰🇷 Seoul',
  '🇰🇷 Busan', '🇦🇺 Sydney', '🇦🇺 Melbourne', '🇦🇺 Brisbane', '🇦🇺 Perth',
  '🇳🇿 Auckland', '🇳🇿 Wellington', '🇨🇳 Beijing', '🇨🇳 Shanghai', '🇨🇳 Guangzhou',
  '🇨🇳 Shenzhen', '🇨🇳 Hong Kong', '🇸🇬 Singapore', '🇲🇾 Kuala Lumpur', '🇦🇪 Dubai',
  '🇦🇪 Abu Dhabi', '🇸🇦 Riyadh', '🇸🇦 Jeddah', '🇮🇱 Tel Aviv', '🇮🇱 Jerusalem',
  '🇱🇧 Beirut', '🇯🇴 Amman', '🇶🇦 Doha', '🇰🇼 Kuwait City', '🇺🇸 New York',
  '🇺🇸 Los Angeles', '🇺🇸 Chicago', '🇺🇸 Houston', '🇺🇸 Miami', '🇺🇸 San Francisco',
  '🇺🇸 Las Vegas', '🇺🇸 Boston', '🇺🇸 Seattle', '🇺🇸 Washington DC', '🇨🇭 Zurich',
  '🇨🇭 Geneva', '🇦🇹 Vienna', '🇦🇹 Salzburg', '🇧🇪 Brussels', '🇳🇱 Amsterdam',
  '🇳🇱 Rotterdam', '🇩🇰 Copenhagen', '🇸🇪 Stockholm', '🇸🇪 Gothenburg', '🇳🇴 Oslo',
  '🇫🇮 Helsinki', '🇮🇪 Dublin', '🇵🇹 Lisbon', '🇵🇹 Porto', '🇬🇷 Athens',
  '🇭🇷 Zagreb', '🇭🇷 Dubrovnik', '🇷🇸 Belgrade', '🇧🇬 Sofia', '🇷🇴 Bucharest',
  '🇭🇺 Budapest', '🇨🇿 Prague', '🇺🇦 Kyiv', '🇺🇦 Odessa', '🇬🇪 Tbilisi',
  '🇦🇲 Yerevan', '🇦🇿 Baku', '🇰🇿 Almaty', '🇺🇿 Tashkent', '🇺🇿 Samarkand',
  '🇮🇷 Tehran', '🇮🇷 Isfahan', '🇮🇶 Baghdad', '🇸🇾 Damascus', '🇨🇴 Bogotá',
  '🇨🇴 Medellín', '🇵🇪 Lima', '🇵🇪 Cusco', '🇨🇱 Santiago', '🇻🇪 Caracas',
  '🇪🇨 Quito', '🇧🇴 La Paz', '🇳🇬 Lagos', '🇬🇭 Accra', '🇲🇦 Casablanca',
  '🇲🇦 Marrakech', '🇹🇳 Tunis', '🇩🇿 Algiers', '🇱🇰 Colombo', '🇲🇲 Yangon',
  '🇰🇭 Phnom Penh', '🇱🇦 Vientiane', '🇲🇳 Ulaanbaatar', '🇹🇼 Taipei', '🇨🇺 Havana',
  '🇩🇴 Santo Domingo', '🇯🇲 Kingston', '🇵🇦 Panama City', '🇨🇷 San José', '🇬🇹 Guatemala City',
  '🇭🇳 Tegucigalpa', '🇸🇻 San Salvador', '🇳🇮 Managua', '🇹🇷 Istanbul', '🇹🇷 Ankara',
  '🇹🇷 Izmir', '🇹🇷 Antalya', '🇹🇷 Bursa', '🇹🇷 Adana', '🇹🇷 Gaziantep',
  '🇹🇷 Konya', '🇹🇷 Kayseri', '🇹🇷 Diyarbakır', '🇹🇷 Mersin', '🇹🇷 Eskişehir',
  '🇹🇷 Samsun', '🇹🇷 Denizli', '🇹🇷 Trabzon', '🇹🇷 Malatya', '🇹🇷 Erzurum',
  '🇹🇷 Van', '🇹🇷 Şanlıurfa', '🇹🇷 Kocaeli', '🇹🇷 Hatay', '🇹🇷 Bodrum'
];

const LEVEL_MOVES = Array(200).fill(15).map((moves, i) => {
  if (i < 5) return 30 - Math.floor(i / 2);
  if (i < 15) return 28 - Math.floor((i - 5) / 3);
  if (i < 35) return 25 - Math.floor((i - 15) / 5);
  if (i < 75) return 20 - Math.floor((i - 35) / 8);
  return 15;
});

const createInitialLevels = (): Level[] => {
  const unlockedLevel = parseInt(localStorage.getItem('unlockedLevel') || '1');
  
  return Array.from({ length: TOTAL_LEVELS }, (_, i) => ({
    id: i + 1,
    name: LEVEL_NAMES[i],
    moves: LEVEL_MOVES[i],
    goals: [],
    unlocked: i + 1 <= unlockedLevel,
  }));
};

export default function Index() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>(createInitialLevels);

  useEffect(() => {
    // Seviye tamamlandığında güncelleme için event listener
    const handleLevelComplete = () => {
      setLevels(createInitialLevels());
    };
    
    window.addEventListener('levelComplete', handleLevelComplete);
    return () => window.removeEventListener('levelComplete', handleLevelComplete);
  }, []);

  const handleLevelSelect = (levelId: number) => {
    navigate(`/game?level=${levelId}`);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block animate-bounce">
            <h1 className="text-7xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-2xl">
              💎 Gem Quest
            </h1>
          </div>
          <p className="text-2xl font-semibold text-foreground/90">
            Conquer the World, Match the Gems!
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your adventure in 200 cities around the world. Face new challenges at each level and travel the entire world to reach Turkey!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🎯</span>
              <span>Complete Goals</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">⚡</span>
              <span>Make Combos</span>
            </div>
            <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <span className="text-2xl">🏆</span>
              <span>Unlock Levels</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {levels.map((level) => (
            <LevelCard
              key={level.id}
              level={level}
              onSelect={() => handleLevelSelect(level.id)}
            />
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-primary/20 shadow-lg">
            <span className="text-3xl">✨</span>
            <span className="text-lg font-semibold text-foreground">
              Match 3 or more gems to make combos!
            </span>
            <span className="text-3xl">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
