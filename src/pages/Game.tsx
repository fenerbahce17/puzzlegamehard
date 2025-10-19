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

// Rebalanced levels - harder but completable with bonus system
export const LEVELS = [
  // Levels 1-20: Easy start - Ethiopia
  { id: 1, name: 'Addis Ababa, Ethiopia', moves: 22, goals: [{ type: 'red' as GemType, count: 15 }, { type: 'blue' as GemType, count: 15 }] },
  { id: 2, name: 'Dire Dawa, Ethiopia', moves: 22, goals: [{ type: 'green' as GemType, count: 15 }, { type: 'yellow' as GemType, count: 15 }] },
  { id: 3, name: 'Mek\'ele, Ethiopia', moves: 21, goals: [{ type: 'purple' as GemType, count: 16 }, { type: 'orange' as GemType, count: 16 }] },
  { id: 4, name: 'Gondar, Ethiopia', moves: 21, goals: [{ type: 'pink' as GemType, count: 16 }, { type: 'cyan' as GemType, count: 16 }] },
  
  // Nepal
  { id: 5, name: 'Kathmandu, Nepal', moves: 21, goals: [{ type: 'lime' as GemType, count: 17 }, { type: 'magenta' as GemType, count: 17 }] },
  { id: 6, name: 'Pokhara, Nepal', moves: 20, goals: [{ type: 'red' as GemType, count: 17 }, { type: 'blue' as GemType, count: 17 }] },
  { id: 7, name: 'Lalitpur, Nepal', moves: 20, goals: [{ type: 'green' as GemType, count: 18 }, { type: 'yellow' as GemType, count: 18 }] },
  
  // Kenya
  { id: 8, name: 'Nairobi, Kenya', moves: 20, goals: [{ type: 'purple' as GemType, count: 18 }, { type: 'orange' as GemType, count: 18 }] },
  { id: 9, name: 'Mombasa, Kenya', moves: 19, goals: [{ type: 'pink' as GemType, count: 19 }, { type: 'cyan' as GemType, count: 19 }] },
  { id: 10, name: 'Kisumu, Kenya', moves: 19, goals: [{ type: 'lime' as GemType, count: 19 }, { type: 'magenta' as GemType, count: 19 }] },
  
  // Pakistan
  { id: 11, name: 'Karachi, Pakistan', moves: 19, goals: [{ type: 'red' as GemType, count: 20 }, { type: 'blue' as GemType, count: 20 }] },
  { id: 12, name: 'Lahore, Pakistan', moves: 18, goals: [{ type: 'green' as GemType, count: 20 }, { type: 'yellow' as GemType, count: 20 }] },
  { id: 13, name: 'Islamabad, Pakistan', moves: 18, goals: [{ type: 'purple' as GemType, count: 21 }, { type: 'orange' as GemType, count: 21 }] },
  { id: 14, name: 'Faisalabad, Pakistan', moves: 18, goals: [{ type: 'pink' as GemType, count: 21 }, { type: 'cyan' as GemType, count: 21 }] },
  
  // Philippines
  { id: 15, name: 'Manila, Philippines', moves: 17, goals: [{ type: 'lime' as GemType, count: 22 }, { type: 'magenta' as GemType, count: 22 }] },
  { id: 16, name: 'Cebu, Philippines', moves: 17, goals: [{ type: 'red' as GemType, count: 22 }, { type: 'blue' as GemType, count: 22 }] },
  { id: 17, name: 'Davao, Philippines', moves: 17, goals: [{ type: 'green' as GemType, count: 23 }, { type: 'yellow' as GemType, count: 23 }] },
  { id: 18, name: 'Quezon City, Philippines', moves: 16, goals: [{ type: 'purple' as GemType, count: 23 }, { type: 'orange' as GemType, count: 23 }] },
  
  // Vietnam
  { id: 19, name: 'Hanoi, Vietnam', moves: 16, goals: [{ type: 'pink' as GemType, count: 24 }, { type: 'cyan' as GemType, count: 24 }] },
  { id: 20, name: 'Ho Chi Minh, Vietnam', moves: 16, goals: [{ type: 'lime' as GemType, count: 24 }, { type: 'magenta' as GemType, count: 24 }] },
  
  // Levels 21-40: Gradual increase
  { id: 21, name: 'Da Nang, Vietnam', moves: 16, goals: [{ type: 'red' as GemType, count: 25 }, { type: 'blue' as GemType, count: 25 }] },
  { id: 22, name: 'Haiphong, Vietnam', moves: 15, goals: [{ type: 'green' as GemType, count: 25 }, { type: 'yellow' as GemType, count: 25 }] },
  
  // Indonesia
  { id: 23, name: 'Jakarta, Indonesia', moves: 15, goals: [{ type: 'purple' as GemType, count: 26 }, { type: 'orange' as GemType, count: 26 }] },
  { id: 24, name: 'Surabaya, Indonesia', moves: 15, goals: [{ type: 'pink' as GemType, count: 26 }, { type: 'cyan' as GemType, count: 26 }] },
  { id: 25, name: 'Bandung, Indonesia', moves: 15, goals: [{ type: 'lime' as GemType, count: 27 }, { type: 'magenta' as GemType, count: 27 }] },
  { id: 26, name: 'Medan, Indonesia', moves: 14, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 27, name: 'Semarang, Indonesia', moves: 14, goals: [{ type: 'green' as GemType, count: 28 }, { type: 'yellow' as GemType, count: 28 }] },
  
  // Thailand
  { id: 28, name: 'Bangkok, Thailand', moves: 14, goals: [{ type: 'purple' as GemType, count: 28 }, { type: 'orange' as GemType, count: 28 }] },
  { id: 29, name: 'Pattaya, Thailand', moves: 14, goals: [{ type: 'pink' as GemType, count: 29 }, { type: 'cyan' as GemType, count: 29 }] },
  { id: 30, name: 'Chiang Mai, Thailand', moves: 13, goals: [{ type: 'lime' as GemType, count: 29 }, { type: 'magenta' as GemType, count: 29 }] },
  { id: 31, name: 'Phuket, Thailand', moves: 13, goals: [{ type: 'red' as GemType, count: 30 }, { type: 'blue' as GemType, count: 30 }] },
  
  // Brazil
  { id: 32, name: 'São Paulo, Brazil', moves: 13, goals: [{ type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 33, name: 'Rio de Janeiro, Brazil', moves: 13, goals: [{ type: 'purple' as GemType, count: 31 }, { type: 'orange' as GemType, count: 31 }] },
  { id: 34, name: 'Brasília, Brazil', moves: 13, goals: [{ type: 'pink' as GemType, count: 31 }, { type: 'cyan' as GemType, count: 31 }] },
  { id: 35, name: 'Salvador, Brazil', moves: 13, goals: [{ type: 'lime' as GemType, count: 32 }, { type: 'magenta' as GemType, count: 32 }] },
  { id: 36, name: 'Fortaleza, Brazil', moves: 13, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  
  // Mexico
  { id: 37, name: 'Mexico City, Mexico', moves: 13, goals: [{ type: 'green' as GemType, count: 33 }, { type: 'yellow' as GemType, count: 33 }] },
  { id: 38, name: 'Guadalajara, Mexico', moves: 13, goals: [{ type: 'purple' as GemType, count: 33 }, { type: 'orange' as GemType, count: 33 }] },
  { id: 39, name: 'Monterrey, Mexico', moves: 13, goals: [{ type: 'pink' as GemType, count: 34 }, { type: 'cyan' as GemType, count: 34 }] },
  { id: 40, name: 'Cancún, Mexico', moves: 13, goals: [{ type: 'lime' as GemType, count: 34 }, { type: 'magenta' as GemType, count: 34 }] },
  
  // Levels 41-60: Medium difficulty
  { id: 41, name: 'Tijuana, Mexico', moves: 13, goals: [{ type: 'red' as GemType, count: 35 }, { type: 'blue' as GemType, count: 35 }] },
  
  // Argentina
  { id: 42, name: 'Buenos Aires, Argentina', moves: 13, goals: [{ type: 'green' as GemType, count: 35 }, { type: 'yellow' as GemType, count: 35 }] },
  { id: 43, name: 'Córdoba, Argentina', moves: 13, goals: [{ type: 'purple' as GemType, count: 36 }, { type: 'orange' as GemType, count: 36 }] },
  { id: 44, name: 'Rosario, Argentina', moves: 13, goals: [{ type: 'pink' as GemType, count: 36 }, { type: 'cyan' as GemType, count: 36 }] },
  
  // South Africa
  { id: 45, name: 'Johannesburg, South Africa', moves: 13, goals: [{ type: 'lime' as GemType, count: 37 }, { type: 'magenta' as GemType, count: 37 }] },
  { id: 46, name: 'Cape Town, South Africa', moves: 13, goals: [{ type: 'red' as GemType, count: 37 }, { type: 'blue' as GemType, count: 37 }] },
  { id: 47, name: 'Durban, South Africa', moves: 13, goals: [{ type: 'green' as GemType, count: 38 }, { type: 'yellow' as GemType, count: 38 }] },
  { id: 48, name: 'Pretoria, South Africa', moves: 13, goals: [{ type: 'purple' as GemType, count: 38 }, { type: 'orange' as GemType, count: 38 }] },
  
  // Russia
  { id: 49, name: 'Moscow, Russia', moves: 13, goals: [{ type: 'pink' as GemType, count: 39 }, { type: 'cyan' as GemType, count: 39 }] },
  { id: 50, name: 'St Petersburg, Russia', moves: 13, goals: [{ type: 'lime' as GemType, count: 39 }, { type: 'magenta' as GemType, count: 39 }] },
  { id: 51, name: 'Novosibirsk, Russia', moves: 13, goals: [{ type: 'red' as GemType, count: 40 }, { type: 'blue' as GemType, count: 40 }] },
  
  // Poland
  { id: 52, name: 'Warsaw, Poland', moves: 13, goals: [{ type: 'green' as GemType, count: 40 }, { type: 'yellow' as GemType, count: 40 }] },
  { id: 53, name: 'Krakow, Poland', moves: 13, goals: [{ type: 'purple' as GemType, count: 41 }, { type: 'orange' as GemType, count: 41 }] },
  { id: 54, name: 'Gdansk, Poland', moves: 13, goals: [{ type: 'pink' as GemType, count: 41 }, { type: 'cyan' as GemType, count: 41 }] },
  
  // Spain
  { id: 55, name: 'Madrid, Spain', moves: 13, goals: [{ type: 'lime' as GemType, count: 42 }, { type: 'magenta' as GemType, count: 42 }] },
  { id: 56, name: 'Barcelona, Spain', moves: 13, goals: [{ type: 'red' as GemType, count: 42 }, { type: 'blue' as GemType, count: 42 }] },
  { id: 57, name: 'Valencia, Spain', moves: 13, goals: [{ type: 'green' as GemType, count: 43 }, { type: 'yellow' as GemType, count: 43 }] },
  { id: 58, name: 'Seville, Spain', moves: 13, goals: [{ type: 'purple' as GemType, count: 43 }, { type: 'orange' as GemType, count: 43 }] },
  { id: 59, name: 'Bilbao, Spain', moves: 13, goals: [{ type: 'pink' as GemType, count: 44 }, { type: 'cyan' as GemType, count: 44 }] },
  { id: 60, name: 'Málaga, Spain', moves: 13, goals: [{ type: 'lime' as GemType, count: 44 }, { type: 'magenta' as GemType, count: 44 }] },
  
  // Levels 61-80: Getting challenging
  // Italy
  { id: 61, name: 'Rome, Italy', moves: 13, goals: [{ type: 'red' as GemType, count: 45 }, { type: 'blue' as GemType, count: 45 }] },
  { id: 62, name: 'Milan, Italy', moves: 13, goals: [{ type: 'green' as GemType, count: 45 }, { type: 'yellow' as GemType, count: 45 }] },
  { id: 63, name: 'Naples, Italy', moves: 13, goals: [{ type: 'purple' as GemType, count: 46 }, { type: 'orange' as GemType, count: 46 }] },
  { id: 64, name: 'Florence, Italy', moves: 13, goals: [{ type: 'pink' as GemType, count: 46 }, { type: 'cyan' as GemType, count: 46 }] },
  { id: 65, name: 'Venice, Italy', moves: 13, goals: [{ type: 'lime' as GemType, count: 47 }, { type: 'magenta' as GemType, count: 47 }] },
  { id: 66, name: 'Turin, Italy', moves: 12, goals: [{ type: 'red' as GemType, count: 47 }, { type: 'blue' as GemType, count: 47 }] },
  
  // France
  { id: 67, name: 'Paris, France', moves: 12, goals: [{ type: 'green' as GemType, count: 48 }, { type: 'yellow' as GemType, count: 48 }] },
  { id: 68, name: 'Lyon, France', moves: 12, goals: [{ type: 'purple' as GemType, count: 48 }, { type: 'orange' as GemType, count: 48 }] },
  { id: 69, name: 'Marseille, France', moves: 12, goals: [{ type: 'pink' as GemType, count: 49 }, { type: 'cyan' as GemType, count: 49 }] },
  { id: 70, name: 'Nice, France', moves: 12, goals: [{ type: 'lime' as GemType, count: 49 }, { type: 'magenta' as GemType, count: 49 }] },
  { id: 71, name: 'Toulouse, France', moves: 12, goals: [{ type: 'red' as GemType, count: 50 }, { type: 'blue' as GemType, count: 50 }] },
  
  // UK
  { id: 72, name: 'London, UK', moves: 12, goals: [{ type: 'green' as GemType, count: 50 }, { type: 'yellow' as GemType, count: 50 }] },
  { id: 73, name: 'Manchester, UK', moves: 12, goals: [{ type: 'purple' as GemType, count: 51 }, { type: 'orange' as GemType, count: 51 }] },
  { id: 74, name: 'Birmingham, UK', moves: 12, goals: [{ type: 'pink' as GemType, count: 51 }, { type: 'cyan' as GemType, count: 51 }] },
  { id: 75, name: 'Liverpool, UK', moves: 12, goals: [{ type: 'lime' as GemType, count: 52 }, { type: 'magenta' as GemType, count: 52 }] },
  { id: 76, name: 'Edinburgh, UK', moves: 12, goals: [{ type: 'red' as GemType, count: 52 }, { type: 'blue' as GemType, count: 52 }] },
  
  // Canada
  { id: 77, name: 'Toronto, Canada', moves: 12, goals: [{ type: 'green' as GemType, count: 53 }, { type: 'yellow' as GemType, count: 53 }] },
  { id: 78, name: 'Montreal, Canada', moves: 12, goals: [{ type: 'purple' as GemType, count: 53 }, { type: 'orange' as GemType, count: 53 }] },
  { id: 79, name: 'Vancouver, Canada', moves: 12, goals: [{ type: 'pink' as GemType, count: 54 }, { type: 'cyan' as GemType, count: 54 }] },
  { id: 80, name: 'Calgary, Canada', moves: 12, goals: [{ type: 'lime' as GemType, count: 54 }, { type: 'magenta' as GemType, count: 54 }] },
  
  // Levels 81-100: Hard
  // Germany
  { id: 81, name: 'Berlin, Germany', moves: 12, goals: [{ type: 'red' as GemType, count: 55 }, { type: 'blue' as GemType, count: 55 }] },
  { id: 82, name: 'Munich, Germany', moves: 12, goals: [{ type: 'green' as GemType, count: 55 }, { type: 'yellow' as GemType, count: 55 }] },
  { id: 83, name: 'Hamburg, Germany', moves: 12, goals: [{ type: 'purple' as GemType, count: 56 }, { type: 'orange' as GemType, count: 56 }] },
  { id: 84, name: 'Frankfurt, Germany', moves: 12, goals: [{ type: 'pink' as GemType, count: 56 }, { type: 'cyan' as GemType, count: 56 }] },
  { id: 85, name: 'Cologne, Germany', moves: 12, goals: [{ type: 'lime' as GemType, count: 57 }, { type: 'magenta' as GemType, count: 57 }] },
  
  // Japan
  { id: 86, name: 'Tokyo, Japan', moves: 12, goals: [{ type: 'red' as GemType, count: 57 }, { type: 'blue' as GemType, count: 57 }] },
  { id: 87, name: 'Osaka, Japan', moves: 12, goals: [{ type: 'green' as GemType, count: 58 }, { type: 'yellow' as GemType, count: 58 }] },
  { id: 88, name: 'Kyoto, Japan', moves: 12, goals: [{ type: 'purple' as GemType, count: 58 }, { type: 'orange' as GemType, count: 58 }] },
  { id: 89, name: 'Yokohama, Japan', moves: 11, goals: [{ type: 'pink' as GemType, count: 59 }, { type: 'cyan' as GemType, count: 59 }] },
  { id: 90, name: 'Nagoya, Japan', moves: 11, goals: [{ type: 'lime' as GemType, count: 59 }, { type: 'magenta' as GemType, count: 59 }] },
  
  // South Korea
  { id: 91, name: 'Seoul, South Korea', moves: 11, goals: [{ type: 'red' as GemType, count: 60 }, { type: 'blue' as GemType, count: 60 }] },
  { id: 92, name: 'Busan, South Korea', moves: 11, goals: [{ type: 'green' as GemType, count: 60 }, { type: 'yellow' as GemType, count: 60 }] },
  { id: 93, name: 'Incheon, South Korea', moves: 11, goals: [{ type: 'purple' as GemType, count: 61 }, { type: 'orange' as GemType, count: 61 }] },
  
  // Australia
  { id: 94, name: 'Sydney, Australia', moves: 11, goals: [{ type: 'pink' as GemType, count: 61 }, { type: 'cyan' as GemType, count: 61 }] },
  { id: 95, name: 'Melbourne, Australia', moves: 11, goals: [{ type: 'lime' as GemType, count: 62 }, { type: 'magenta' as GemType, count: 62 }] },
  { id: 96, name: 'Brisbane, Australia', moves: 11, goals: [{ type: 'red' as GemType, count: 62 }, { type: 'blue' as GemType, count: 62 }] },
  { id: 97, name: 'Perth, Australia', moves: 11, goals: [{ type: 'green' as GemType, count: 63 }, { type: 'yellow' as GemType, count: 63 }] },
  
  // New Zealand
  { id: 98, name: 'Auckland, New Zealand', moves: 11, goals: [{ type: 'purple' as GemType, count: 63 }, { type: 'orange' as GemType, count: 63 }] },
  { id: 99, name: 'Wellington, New Zealand', moves: 11, goals: [{ type: 'pink' as GemType, count: 64 }, { type: 'cyan' as GemType, count: 64 }] },
  { id: 100, name: 'Christchurch, New Zealand', moves: 11, goals: [{ type: 'lime' as GemType, count: 64 }, { type: 'magenta' as GemType, count: 64 }] },
  
  // Levels 101-120: Harder
  // China
  { id: 101, name: 'Beijing, China', moves: 11, goals: [{ type: 'red' as GemType, count: 65 }, { type: 'blue' as GemType, count: 65 }] },
  { id: 102, name: 'Shanghai, China', moves: 11, goals: [{ type: 'green' as GemType, count: 65 }, { type: 'yellow' as GemType, count: 65 }] },
  { id: 103, name: 'Guangzhou, China', moves: 11, goals: [{ type: 'purple' as GemType, count: 66 }, { type: 'orange' as GemType, count: 66 }] },
  { id: 104, name: 'Shenzhen, China', moves: 11, goals: [{ type: 'pink' as GemType, count: 66 }, { type: 'cyan' as GemType, count: 66 }] },
  { id: 105, name: 'Hong Kong, China', moves: 11, goals: [{ type: 'lime' as GemType, count: 67 }, { type: 'magenta' as GemType, count: 67 }] },
  
  // USA
  { id: 106, name: 'New York, USA', moves: 11, goals: [{ type: 'red' as GemType, count: 67 }, { type: 'blue' as GemType, count: 67 }] },
  { id: 107, name: 'Los Angeles, USA', moves: 11, goals: [{ type: 'green' as GemType, count: 68 }, { type: 'yellow' as GemType, count: 68 }] },
  { id: 108, name: 'Chicago, USA', moves: 11, goals: [{ type: 'purple' as GemType, count: 68 }, { type: 'orange' as GemType, count: 68 }] },
  { id: 109, name: 'Houston, USA', moves: 11, goals: [{ type: 'pink' as GemType, count: 69 }, { type: 'cyan' as GemType, count: 69 }] },
  { id: 110, name: 'Miami, USA', moves: 11, goals: [{ type: 'lime' as GemType, count: 69 }, { type: 'magenta' as GemType, count: 69 }] },
  { id: 111, name: 'San Francisco, USA', moves: 11, goals: [{ type: 'red' as GemType, count: 70 }, { type: 'blue' as GemType, count: 70 }] },
  { id: 112, name: 'Las Vegas, USA', moves: 11, goals: [{ type: 'green' as GemType, count: 70 }, { type: 'yellow' as GemType, count: 70 }] },
  { id: 113, name: 'Boston, USA', moves: 10, goals: [{ type: 'purple' as GemType, count: 71 }, { type: 'orange' as GemType, count: 71 }] },
  { id: 114, name: 'Seattle, USA', moves: 10, goals: [{ type: 'pink' as GemType, count: 71 }, { type: 'cyan' as GemType, count: 71 }] },
  { id: 115, name: 'Washington DC, USA', moves: 10, goals: [{ type: 'lime' as GemType, count: 72 }, { type: 'magenta' as GemType, count: 72 }] },
  
  // Switzerland
  { id: 116, name: 'Zurich, Switzerland', moves: 10, goals: [{ type: 'red' as GemType, count: 72 }, { type: 'blue' as GemType, count: 72 }] },
  { id: 117, name: 'Geneva, Switzerland', moves: 10, goals: [{ type: 'green' as GemType, count: 73 }, { type: 'yellow' as GemType, count: 73 }] },
  { id: 118, name: 'Basel, Switzerland', moves: 10, goals: [{ type: 'purple' as GemType, count: 73 }, { type: 'orange' as GemType, count: 73 }] },
  
  // Austria
  { id: 119, name: 'Vienna, Austria', moves: 10, goals: [{ type: 'pink' as GemType, count: 74 }, { type: 'cyan' as GemType, count: 74 }] },
  { id: 120, name: 'Salzburg, Austria', moves: 10, goals: [{ type: 'lime' as GemType, count: 74 }, { type: 'magenta' as GemType, count: 74 }] },
  
  // Levels 121-140: Very Hard
  // Belgium
  { id: 121, name: 'Brussels, Belgium', moves: 10, goals: [{ type: 'red' as GemType, count: 75 }, { type: 'blue' as GemType, count: 75 }] },
  { id: 122, name: 'Antwerp, Belgium', moves: 10, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  
  // Netherlands
  { id: 123, name: 'Amsterdam, Netherlands', moves: 10, goals: [{ type: 'purple' as GemType, count: 76 }, { type: 'orange' as GemType, count: 76 }] },
  { id: 124, name: 'Rotterdam, Netherlands', moves: 10, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 125, name: 'The Hague, Netherlands', moves: 10, goals: [{ type: 'lime' as GemType, count: 77 }, { type: 'magenta' as GemType, count: 77 }] },
  
  // Denmark
  { id: 126, name: 'Copenhagen, Denmark', moves: 10, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 127, name: 'Aarhus, Denmark', moves: 10, goals: [{ type: 'green' as GemType, count: 78 }, { type: 'yellow' as GemType, count: 78 }] },
  
  // Sweden
  { id: 128, name: 'Stockholm, Sweden', moves: 10, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 129, name: 'Gothenburg, Sweden', moves: 10, goals: [{ type: 'pink' as GemType, count: 79 }, { type: 'cyan' as GemType, count: 79 }] },
  
  // Norway
  { id: 130, name: 'Oslo, Norway', moves: 10, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 131, name: 'Bergen, Norway', moves: 10, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  
  // Finland
  { id: 132, name: 'Helsinki, Finland', moves: 10, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 133, name: 'Tampere, Finland', moves: 10, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  
  // Ireland
  { id: 134, name: 'Dublin, Ireland', moves: 10, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 135, name: 'Cork, Ireland', moves: 10, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  
  // Portugal
  { id: 136, name: 'Lisbon, Portugal', moves: 10, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 137, name: 'Porto, Portugal', moves: 10, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  
  // Greece
  { id: 138, name: 'Athens, Greece', moves: 10, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 139, name: 'Thessaloniki, Greece', moves: 10, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 140, name: 'Heraklion, Greece', moves: 10, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  
  // Levels 141-160: Expert
  // Romania (10 cities)
  { id: 141, name: 'Bucharest, Romania', moves: 10, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 142, name: 'Cluj-Napoca, Romania', moves: 10, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 143, name: 'Timișoara, Romania', moves: 10, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 144, name: 'Iași, Romania', moves: 10, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 145, name: 'Constanța, Romania', moves: 10, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 146, name: 'Craiova, Romania', moves: 10, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 147, name: 'Brașov, Romania', moves: 10, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 148, name: 'Galați, Romania', moves: 10, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 149, name: 'Ploiești, Romania', moves: 10, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 150, name: 'Botoșani, Romania', moves: 10, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  
  // Croatia
  { id: 151, name: 'Zagreb, Croatia', moves: 10, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 152, name: 'Dubrovnik, Croatia', moves: 10, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 153, name: 'Split, Croatia', moves: 10, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  
  // Serbia
  { id: 154, name: 'Belgrade, Serbia', moves: 10, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 155, name: 'Novi Sad, Serbia', moves: 10, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  
  // Bulgaria
  { id: 156, name: 'Sofia, Bulgaria', moves: 10, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 157, name: 'Plovdiv, Bulgaria', moves: 10, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  
  // Hungary
  { id: 158, name: 'Budapest, Hungary', moves: 10, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 159, name: 'Debrecen, Hungary', moves: 10, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 160, name: 'Szeged, Hungary', moves: 10, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  
  // Levels 161-180: Master
  // Czech Republic
  { id: 161, name: 'Prague, Czech Republic', moves: 10, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 162, name: 'Brno, Czech Republic', moves: 10, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  
  // Ukraine
  { id: 163, name: 'Kyiv, Ukraine', moves: 10, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 164, name: 'Odessa, Ukraine', moves: 10, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 165, name: 'Lviv, Ukraine', moves: 10, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  
  // Singapore & Malaysia
  { id: 166, name: 'Singapore', moves: 10, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 167, name: 'Kuala Lumpur, Malaysia', moves: 10, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 168, name: 'Penang, Malaysia', moves: 10, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  
  // Colombia
  { id: 169, name: 'Bogotá, Colombia', moves: 10, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 170, name: 'Medellín, Colombia', moves: 10, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  
  // Peru
  { id: 171, name: 'Lima, Peru', moves: 10, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 172, name: 'Cusco, Peru', moves: 10, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  
  // Chile
  { id: 173, name: 'Santiago, Chile', moves: 10, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 174, name: 'Valparaíso, Chile', moves: 10, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  
  // Ecuador
  { id: 175, name: 'Quito, Ecuador', moves: 10, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 176, name: 'Guayaquil, Ecuador', moves: 10, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  
  // Central America
  { id: 177, name: 'San José, Costa Rica', moves: 10, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 178, name: 'Panama City, Panama', moves: 10, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 179, name: 'Guatemala City, Guatemala', moves: 10, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 180, name: 'San Salvador, El Salvador', moves: 10, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  
  // Levels 181-200: Turkish Cities - Ultimate Challenge
  { id: 181, name: 'Istanbul, Turkey', moves: 10, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 182, name: 'Ankara, Turkey', moves: 10, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 183, name: 'Izmir, Turkey', moves: 10, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 184, name: 'Antalya, Turkey', moves: 10, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 185, name: 'Bursa, Turkey', moves: 10, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 186, name: 'Adana, Turkey', moves: 10, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 187, name: 'Gaziantep, Turkey', moves: 10, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 188, name: 'Konya, Turkey', moves: 10, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 189, name: 'Kayseri, Turkey', moves: 10, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 190, name: 'Diyarbakır, Turkey', moves: 10, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 191, name: 'Mersin, Turkey', moves: 10, goals: [{ type: 'red' as GemType, count: 110 }, { type: 'blue' as GemType, count: 110 }] },
  { id: 192, name: 'Burdur, Turkey', moves: 10, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 193, name: 'Eskişehir, Turkey', moves: 10, goals: [{ type: 'purple' as GemType, count: 111 }, { type: 'orange' as GemType, count: 111 }] },
  { id: 194, name: 'Samsun, Turkey', moves: 10, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 195, name: 'Trabzon, Turkey', moves: 10, goals: [{ type: 'lime' as GemType, count: 112 }, { type: 'magenta' as GemType, count: 112 }] },
  { id: 196, name: 'Malatya, Turkey', moves: 10, goals: [{ type: 'red' as GemType, count: 112 }, { type: 'blue' as GemType, count: 112 }] },
  { id: 197, name: 'Erzurum, Turkey', moves: 10, goals: [{ type: 'green' as GemType, count: 113 }, { type: 'yellow' as GemType, count: 113 }] },
  { id: 198, name: 'Van, Turkey', moves: 10, goals: [{ type: 'purple' as GemType, count: 113 }, { type: 'orange' as GemType, count: 113 }] },
  { id: 199, name: 'Bodrum, Turkey', moves: 10, goals: [{ type: 'pink' as GemType, count: 114 }, { type: 'cyan' as GemType, count: 114 }] },
  { id: 200, name: 'Denizli, Turkey', moves: 10, goals: [{ type: 'lime' as GemType, count: 114 }, { type: 'magenta' as GemType, count: 114 }] },
  
  // Levels 201-250: Even harder challenges
  // More European cities
  { id: 201, name: 'Edinburgh, UK', moves: 9, goals: [{ type: 'red' as GemType, count: 115 }, { type: 'blue' as GemType, count: 115 }] },
  { id: 202, name: 'Glasgow, UK', moves: 9, goals: [{ type: 'green' as GemType, count: 115 }, { type: 'yellow' as GemType, count: 115 }] },
  { id: 203, name: 'Leeds, UK', moves: 9, goals: [{ type: 'purple' as GemType, count: 116 }, { type: 'orange' as GemType, count: 116 }] },
  { id: 204, name: 'Bristol, UK', moves: 9, goals: [{ type: 'pink' as GemType, count: 116 }, { type: 'cyan' as GemType, count: 116 }] },
  { id: 205, name: 'Bordeaux, France', moves: 9, goals: [{ type: 'lime' as GemType, count: 117 }, { type: 'magenta' as GemType, count: 117 }] },
  { id: 206, name: 'Strasbourg, France', moves: 9, goals: [{ type: 'red' as GemType, count: 117 }, { type: 'blue' as GemType, count: 117 }] },
  { id: 207, name: 'Palermo, Italy', moves: 9, goals: [{ type: 'green' as GemType, count: 118 }, { type: 'yellow' as GemType, count: 118 }] },
  { id: 208, name: 'Genoa, Italy', moves: 9, goals: [{ type: 'purple' as GemType, count: 118 }, { type: 'orange' as GemType, count: 118 }] },
  { id: 209, name: 'Bologna, Italy', moves: 9, goals: [{ type: 'pink' as GemType, count: 119 }, { type: 'cyan' as GemType, count: 119 }] },
  { id: 210, name: 'Stuttgart, Germany', moves: 9, goals: [{ type: 'lime' as GemType, count: 119 }, { type: 'magenta' as GemType, count: 119 }] },
  { id: 211, name: 'Düsseldorf, Germany', moves: 9, goals: [{ type: 'red' as GemType, count: 120 }, { type: 'blue' as GemType, count: 120 }] },
  { id: 212, name: 'Dresden, Germany', moves: 9, goals: [{ type: 'green' as GemType, count: 120 }, { type: 'yellow' as GemType, count: 120 }] },
  { id: 213, name: 'Sapporo, Japan', moves: 9, goals: [{ type: 'purple' as GemType, count: 121 }, { type: 'orange' as GemType, count: 121 }] },
  { id: 214, name: 'Fukuoka, Japan', moves: 9, goals: [{ type: 'pink' as GemType, count: 121 }, { type: 'cyan' as GemType, count: 121 }] },
  { id: 215, name: 'Kobe, Japan', moves: 9, goals: [{ type: 'lime' as GemType, count: 122 }, { type: 'magenta' as GemType, count: 122 }] },
  { id: 216, name: 'Daegu, South Korea', moves: 9, goals: [{ type: 'red' as GemType, count: 122 }, { type: 'blue' as GemType, count: 122 }] },
  { id: 217, name: 'Daejeon, South Korea', moves: 9, goals: [{ type: 'green' as GemType, count: 123 }, { type: 'yellow' as GemType, count: 123 }] },
  { id: 218, name: 'Adelaide, Australia', moves: 9, goals: [{ type: 'purple' as GemType, count: 123 }, { type: 'orange' as GemType, count: 123 }] },
  { id: 219, name: 'Gold Coast, Australia', moves: 9, goals: [{ type: 'pink' as GemType, count: 124 }, { type: 'cyan' as GemType, count: 124 }] },
  { id: 220, name: 'Canberra, Australia', moves: 9, goals: [{ type: 'lime' as GemType, count: 124 }, { type: 'magenta' as GemType, count: 124 }] },
  { id: 221, name: 'Chengdu, China', moves: 9, goals: [{ type: 'red' as GemType, count: 125 }, { type: 'blue' as GemType, count: 125 }] },
  { id: 222, name: 'Chongqing, China', moves: 9, goals: [{ type: 'green' as GemType, count: 125 }, { type: 'yellow' as GemType, count: 125 }] },
  { id: 223, name: 'Tianjin, China', moves: 9, goals: [{ type: 'purple' as GemType, count: 126 }, { type: 'orange' as GemType, count: 126 }] },
  { id: 224, name: 'Wuhan, China', moves: 9, goals: [{ type: 'pink' as GemType, count: 126 }, { type: 'cyan' as GemType, count: 126 }] },
  { id: 225, name: 'Xian, China', moves: 9, goals: [{ type: 'lime' as GemType, count: 127 }, { type: 'magenta' as GemType, count: 127 }] },
  { id: 226, name: 'Philadelphia, USA', moves: 9, goals: [{ type: 'red' as GemType, count: 127 }, { type: 'blue' as GemType, count: 127 }] },
  { id: 227, name: 'Phoenix, USA', moves: 9, goals: [{ type: 'green' as GemType, count: 128 }, { type: 'yellow' as GemType, count: 128 }] },
  { id: 228, name: 'San Diego, USA', moves: 9, goals: [{ type: 'purple' as GemType, count: 128 }, { type: 'orange' as GemType, count: 128 }] },
  { id: 229, name: 'Dallas, USA', moves: 9, goals: [{ type: 'pink' as GemType, count: 129 }, { type: 'cyan' as GemType, count: 129 }] },
  { id: 230, name: 'Austin, USA', moves: 9, goals: [{ type: 'lime' as GemType, count: 129 }, { type: 'magenta' as GemType, count: 129 }] },
  { id: 231, name: 'Denver, USA', moves: 9, goals: [{ type: 'red' as GemType, count: 130 }, { type: 'blue' as GemType, count: 130 }] },
  { id: 232, name: 'Portland, USA', moves: 9, goals: [{ type: 'green' as GemType, count: 130 }, { type: 'yellow' as GemType, count: 130 }] },
  { id: 233, name: 'Nashville, USA', moves: 9, goals: [{ type: 'purple' as GemType, count: 131 }, { type: 'orange' as GemType, count: 131 }] },
  { id: 234, name: 'Detroit, USA', moves: 9, goals: [{ type: 'pink' as GemType, count: 131 }, { type: 'cyan' as GemType, count: 131 }] },
  { id: 235, name: 'Atlanta, USA', moves: 9, goals: [{ type: 'lime' as GemType, count: 132 }, { type: 'magenta' as GemType, count: 132 }] },
  { id: 236, name: 'Tampa, USA', moves: 9, goals: [{ type: 'red' as GemType, count: 132 }, { type: 'blue' as GemType, count: 132 }] },
  { id: 237, name: 'New Orleans, USA', moves: 9, goals: [{ type: 'green' as GemType, count: 133 }, { type: 'yellow' as GemType, count: 133 }] },
  { id: 238, name: 'Salt Lake City, USA', moves: 9, goals: [{ type: 'purple' as GemType, count: 133 }, { type: 'orange' as GemType, count: 133 }] },
  { id: 239, name: 'Ottawa, Canada', moves: 9, goals: [{ type: 'pink' as GemType, count: 134 }, { type: 'cyan' as GemType, count: 134 }] },
  { id: 240, name: 'Edmonton, Canada', moves: 9, goals: [{ type: 'lime' as GemType, count: 134 }, { type: 'magenta' as GemType, count: 134 }] },
  { id: 241, name: 'Quebec City, Canada', moves: 9, goals: [{ type: 'red' as GemType, count: 135 }, { type: 'blue' as GemType, count: 135 }] },
  { id: 242, name: 'Winnipeg, Canada', moves: 9, goals: [{ type: 'green' as GemType, count: 135 }, { type: 'yellow' as GemType, count: 135 }] },
  { id: 243, name: 'Leipzig, Germany', moves: 9, goals: [{ type: 'purple' as GemType, count: 136 }, { type: 'orange' as GemType, count: 136 }] },
  { id: 244, name: 'Vilnius, Lithuania', moves: 9, goals: [{ type: 'pink' as GemType, count: 136 }, { type: 'cyan' as GemType, count: 136 }] },
  { id: 245, name: 'Riga, Latvia', moves: 9, goals: [{ type: 'lime' as GemType, count: 137 }, { type: 'magenta' as GemType, count: 137 }] },
  { id: 246, name: 'Tallinn, Estonia', moves: 9, goals: [{ type: 'red' as GemType, count: 137 }, { type: 'blue' as GemType, count: 137 }] },
  { id: 247, name: 'Bratislava, Slovakia', moves: 9, goals: [{ type: 'green' as GemType, count: 138 }, { type: 'yellow' as GemType, count: 138 }] },
  { id: 248, name: 'Ljubljana, Slovenia', moves: 9, goals: [{ type: 'purple' as GemType, count: 138 }, { type: 'orange' as GemType, count: 138 }] },
  { id: 249, name: 'Sarajevo, Bosnia', moves: 9, goals: [{ type: 'pink' as GemType, count: 139 }, { type: 'cyan' as GemType, count: 139 }] },
  { id: 250, name: 'Skopje, North Macedonia', moves: 9, goals: [{ type: 'lime' as GemType, count: 139 }, { type: 'magenta' as GemType, count: 139 }] },
  
  // Levels 251-300: Extreme difficulty
  { id: 251, name: 'Tirana, Albania', moves: 9, goals: [{ type: 'red' as GemType, count: 140 }, { type: 'blue' as GemType, count: 140 }] },
  { id: 252, name: 'Minsk, Belarus', moves: 9, goals: [{ type: 'green' as GemType, count: 140 }, { type: 'yellow' as GemType, count: 140 }] },
  { id: 253, name: 'Chisinau, Moldova', moves: 9, goals: [{ type: 'purple' as GemType, count: 141 }, { type: 'orange' as GemType, count: 141 }] },
  { id: 254, name: 'Reykjavik, Iceland', moves: 9, goals: [{ type: 'pink' as GemType, count: 141 }, { type: 'cyan' as GemType, count: 141 }] },
  { id: 255, name: 'Luxembourg City, Luxembourg', moves: 9, goals: [{ type: 'lime' as GemType, count: 142 }, { type: 'magenta' as GemType, count: 142 }] },
  { id: 256, name: 'Monaco', moves: 9, goals: [{ type: 'red' as GemType, count: 142 }, { type: 'blue' as GemType, count: 142 }] },
  { id: 257, name: 'Valletta, Malta', moves: 9, goals: [{ type: 'green' as GemType, count: 143 }, { type: 'yellow' as GemType, count: 143 }] },
  { id: 258, name: 'Nicosia, Cyprus', moves: 9, goals: [{ type: 'purple' as GemType, count: 143 }, { type: 'orange' as GemType, count: 143 }] },
  { id: 259, name: 'San Marino', moves: 9, goals: [{ type: 'pink' as GemType, count: 144 }, { type: 'cyan' as GemType, count: 144 }] },
  { id: 260, name: 'Vatican City', moves: 9, goals: [{ type: 'lime' as GemType, count: 144 }, { type: 'magenta' as GemType, count: 144 }] },
  { id: 261, name: 'Tbilisi, Georgia', moves: 9, goals: [{ type: 'red' as GemType, count: 145 }, { type: 'blue' as GemType, count: 145 }] },
  { id: 262, name: 'Yerevan, Armenia', moves: 9, goals: [{ type: 'green' as GemType, count: 145 }, { type: 'yellow' as GemType, count: 145 }] },
  { id: 263, name: 'Baku, Azerbaijan', moves: 9, goals: [{ type: 'purple' as GemType, count: 146 }, { type: 'orange' as GemType, count: 146 }] },
  { id: 264, name: 'Almaty, Kazakhstan', moves: 9, goals: [{ type: 'pink' as GemType, count: 146 }, { type: 'cyan' as GemType, count: 146 }] },
  { id: 265, name: 'Tashkent, Uzbekistan', moves: 9, goals: [{ type: 'lime' as GemType, count: 147 }, { type: 'magenta' as GemType, count: 147 }] },
  { id: 266, name: 'Samarkand, Uzbekistan', moves: 9, goals: [{ type: 'red' as GemType, count: 147 }, { type: 'blue' as GemType, count: 147 }] },
  { id: 267, name: 'Montevideo, Uruguay', moves: 9, goals: [{ type: 'green' as GemType, count: 148 }, { type: 'yellow' as GemType, count: 148 }] },
  { id: 268, name: 'Asunción, Paraguay', moves: 9, goals: [{ type: 'purple' as GemType, count: 148 }, { type: 'orange' as GemType, count: 148 }] },
  { id: 269, name: 'La Paz, Bolivia', moves: 9, goals: [{ type: 'pink' as GemType, count: 149 }, { type: 'cyan' as GemType, count: 149 }] },
  { id: 270, name: 'Caracas, Venezuela', moves: 9, goals: [{ type: 'lime' as GemType, count: 149 }, { type: 'magenta' as GemType, count: 149 }] },
  { id: 271, name: 'Lagos, Nigeria', moves: 9, goals: [{ type: 'red' as GemType, count: 150 }, { type: 'blue' as GemType, count: 150 }] },
  { id: 272, name: 'Accra, Ghana', moves: 9, goals: [{ type: 'green' as GemType, count: 150 }, { type: 'yellow' as GemType, count: 150 }] },
  { id: 273, name: 'Casablanca, Morocco', moves: 9, goals: [{ type: 'purple' as GemType, count: 151 }, { type: 'orange' as GemType, count: 151 }] },
  { id: 274, name: 'Marrakech, Morocco', moves: 9, goals: [{ type: 'pink' as GemType, count: 151 }, { type: 'cyan' as GemType, count: 151 }] },
  { id: 275, name: 'Tunis, Tunisia', moves: 9, goals: [{ type: 'lime' as GemType, count: 152 }, { type: 'magenta' as GemType, count: 152 }] },
  { id: 276, name: 'Algiers, Algeria', moves: 9, goals: [{ type: 'red' as GemType, count: 152 }, { type: 'blue' as GemType, count: 152 }] },
  { id: 277, name: 'Colombo, Sri Lanka', moves: 9, goals: [{ type: 'green' as GemType, count: 153 }, { type: 'yellow' as GemType, count: 153 }] },
  { id: 278, name: 'Yangon, Myanmar', moves: 9, goals: [{ type: 'purple' as GemType, count: 153 }, { type: 'orange' as GemType, count: 153 }] },
  { id: 279, name: 'Phnom Penh, Cambodia', moves: 9, goals: [{ type: 'pink' as GemType, count: 154 }, { type: 'cyan' as GemType, count: 154 }] },
  { id: 280, name: 'Vientiane, Laos', moves: 9, goals: [{ type: 'lime' as GemType, count: 154 }, { type: 'magenta' as GemType, count: 154 }] },
  { id: 281, name: 'Ulaanbaatar, Mongolia', moves: 9, goals: [{ type: 'red' as GemType, count: 155 }, { type: 'blue' as GemType, count: 155 }] },
  { id: 282, name: 'Taipei, Taiwan', moves: 9, goals: [{ type: 'green' as GemType, count: 155 }, { type: 'yellow' as GemType, count: 155 }] },
  { id: 283, name: 'Havana, Cuba', moves: 9, goals: [{ type: 'purple' as GemType, count: 156 }, { type: 'orange' as GemType, count: 156 }] },
  { id: 284, name: 'Kingston, Jamaica', moves: 9, goals: [{ type: 'pink' as GemType, count: 156 }, { type: 'cyan' as GemType, count: 156 }] },
  { id: 285, name: 'Tegucigalpa, Honduras', moves: 9, goals: [{ type: 'lime' as GemType, count: 157 }, { type: 'magenta' as GemType, count: 157 }] },
  { id: 286, name: 'Managua, Nicaragua', moves: 9, goals: [{ type: 'red' as GemType, count: 157 }, { type: 'blue' as GemType, count: 157 }] },
  { id: 287, name: 'Belmopan, Belize', moves: 9, goals: [{ type: 'green' as GemType, count: 158 }, { type: 'yellow' as GemType, count: 158 }] },
  { id: 288, name: 'Dakar, Senegal', moves: 9, goals: [{ type: 'purple' as GemType, count: 158 }, { type: 'orange' as GemType, count: 158 }] },
  { id: 289, name: 'Abidjan, Ivory Coast', moves: 9, goals: [{ type: 'pink' as GemType, count: 159 }, { type: 'cyan' as GemType, count: 159 }] },
  { id: 290, name: 'Kampala, Uganda', moves: 9, goals: [{ type: 'lime' as GemType, count: 159 }, { type: 'magenta' as GemType, count: 159 }] },
  { id: 291, name: 'Kigali, Rwanda', moves: 9, goals: [{ type: 'red' as GemType, count: 160 }, { type: 'blue' as GemType, count: 160 }] },
  { id: 292, name: 'Dar es Salaam, Tanzania', moves: 9, goals: [{ type: 'green' as GemType, count: 160 }, { type: 'yellow' as GemType, count: 160 }] },
  { id: 293, name: 'Lusaka, Zambia', moves: 9, goals: [{ type: 'purple' as GemType, count: 161 }, { type: 'orange' as GemType, count: 161 }] },
  { id: 294, name: 'Harare, Zimbabwe', moves: 9, goals: [{ type: 'pink' as GemType, count: 161 }, { type: 'cyan' as GemType, count: 161 }] },
  { id: 295, name: 'Maputo, Mozambique', moves: 9, goals: [{ type: 'lime' as GemType, count: 162 }, { type: 'magenta' as GemType, count: 162 }] },
  { id: 296, name: 'Gaborone, Botswana', moves: 9, goals: [{ type: 'red' as GemType, count: 162 }, { type: 'blue' as GemType, count: 162 }] },
  { id: 297, name: 'Windhoek, Namibia', moves: 9, goals: [{ type: 'green' as GemType, count: 163 }, { type: 'yellow' as GemType, count: 163 }] },
  { id: 298, name: 'Antananarivo, Madagascar', moves: 9, goals: [{ type: 'purple' as GemType, count: 163 }, { type: 'orange' as GemType, count: 163 }] },
  { id: 299, name: 'Port Louis, Mauritius', moves: 9, goals: [{ type: 'pink' as GemType, count: 164 }, { type: 'cyan' as GemType, count: 164 }] },
  { id: 300, name: 'Luanda, Angola', moves: 9, goals: [{ type: 'lime' as GemType, count: 164 }, { type: 'magenta' as GemType, count: 164 }] },
  
  // Levels 301-350: Master difficulty
  { id: 301, name: 'Kinshasa, DR Congo', moves: 9, goals: [{ type: 'red' as GemType, count: 165 }, { type: 'blue' as GemType, count: 165 }] },
  { id: 302, name: 'Brazzaville, Congo', moves: 9, goals: [{ type: 'green' as GemType, count: 165 }, { type: 'yellow' as GemType, count: 165 }] },
  { id: 303, name: 'Libreville, Gabon', moves: 9, goals: [{ type: 'purple' as GemType, count: 166 }, { type: 'orange' as GemType, count: 166 }] },
  { id: 304, name: 'Yaoundé, Cameroon', moves: 9, goals: [{ type: 'pink' as GemType, count: 166 }, { type: 'cyan' as GemType, count: 166 }] },
  { id: 305, name: 'Abuja, Nigeria', moves: 9, goals: [{ type: 'lime' as GemType, count: 167 }, { type: 'magenta' as GemType, count: 167 }] },
  { id: 306, name: 'Kumasi, Ghana', moves: 9, goals: [{ type: 'red' as GemType, count: 167 }, { type: 'blue' as GemType, count: 167 }] },
  { id: 307, name: 'Bridgetown, Barbados', moves: 9, goals: [{ type: 'green' as GemType, count: 168 }, { type: 'yellow' as GemType, count: 168 }] },
  { id: 308, name: 'Nassau, Bahamas', moves: 9, goals: [{ type: 'purple' as GemType, count: 168 }, { type: 'orange' as GemType, count: 168 }] },
  { id: 309, name: 'Santo Domingo, Dominican Rep.', moves: 9, goals: [{ type: 'pink' as GemType, count: 169 }, { type: 'cyan' as GemType, count: 169 }] },
  { id: 310, name: 'Port of Spain, Trinidad', moves: 9, goals: [{ type: 'lime' as GemType, count: 169 }, { type: 'magenta' as GemType, count: 169 }] },
  { id: 311, name: 'Puebla, Mexico', moves: 9, goals: [{ type: 'red' as GemType, count: 170 }, { type: 'blue' as GemType, count: 170 }] },
  { id: 312, name: 'León, Mexico', moves: 9, goals: [{ type: 'green' as GemType, count: 170 }, { type: 'yellow' as GemType, count: 170 }] },
  { id: 313, name: 'Juárez, Mexico', moves: 9, goals: [{ type: 'purple' as GemType, count: 171 }, { type: 'orange' as GemType, count: 171 }] },
  { id: 314, name: 'Mérida, Mexico', moves: 9, goals: [{ type: 'pink' as GemType, count: 171 }, { type: 'cyan' as GemType, count: 171 }] },
  { id: 315, name: 'Acapulco, Mexico', moves: 9, goals: [{ type: 'lime' as GemType, count: 172 }, { type: 'magenta' as GemType, count: 172 }] },
  { id: 316, name: 'Cuernavaca, Mexico', moves: 9, goals: [{ type: 'red' as GemType, count: 172 }, { type: 'blue' as GemType, count: 172 }] },
  { id: 317, name: 'Mazatlán, Mexico', moves: 9, goals: [{ type: 'green' as GemType, count: 173 }, { type: 'yellow' as GemType, count: 173 }] },
  { id: 318, name: 'Recife, Brazil', moves: 9, goals: [{ type: 'purple' as GemType, count: 173 }, { type: 'orange' as GemType, count: 173 }] },
  { id: 319, name: 'Belo Horizonte, Brazil', moves: 9, goals: [{ type: 'pink' as GemType, count: 174 }, { type: 'cyan' as GemType, count: 174 }] },
  { id: 320, name: 'Curitiba, Brazil', moves: 9, goals: [{ type: 'lime' as GemType, count: 174 }, { type: 'magenta' as GemType, count: 174 }] },
  { id: 321, name: 'Manaus, Brazil', moves: 9, goals: [{ type: 'red' as GemType, count: 175 }, { type: 'blue' as GemType, count: 175 }] },
  { id: 322, name: 'Mendoza, Argentina', moves: 9, goals: [{ type: 'green' as GemType, count: 175 }, { type: 'yellow' as GemType, count: 175 }] },
  { id: 323, name: 'Mar del Plata, Argentina', moves: 9, goals: [{ type: 'purple' as GemType, count: 176 }, { type: 'orange' as GemType, count: 176 }] },
  { id: 324, name: 'Arequipa, Peru', moves: 9, goals: [{ type: 'pink' as GemType, count: 176 }, { type: 'cyan' as GemType, count: 176 }] },
  { id: 325, name: 'Trujillo, Peru', moves: 9, goals: [{ type: 'lime' as GemType, count: 177 }, { type: 'magenta' as GemType, count: 177 }] },
  { id: 326, name: 'Cartagena, Colombia', moves: 9, goals: [{ type: 'red' as GemType, count: 177 }, { type: 'blue' as GemType, count: 177 }] },
  { id: 327, name: 'Cali, Colombia', moves: 9, goals: [{ type: 'green' as GemType, count: 178 }, { type: 'yellow' as GemType, count: 178 }] },
  { id: 328, name: 'Barranquilla, Colombia', moves: 9, goals: [{ type: 'purple' as GemType, count: 178 }, { type: 'orange' as GemType, count: 178 }] },
  { id: 329, name: 'Viña del Mar, Chile', moves: 9, goals: [{ type: 'pink' as GemType, count: 179 }, { type: 'cyan' as GemType, count: 179 }] },
  { id: 330, name: 'Concepción, Chile', moves: 9, goals: [{ type: 'lime' as GemType, count: 179 }, { type: 'magenta' as GemType, count: 179 }] },
  { id: 331, name: 'Nanjing, China', moves: 9, goals: [{ type: 'red' as GemType, count: 180 }, { type: 'blue' as GemType, count: 180 }] },
  { id: 332, name: 'Hangzhou, China', moves: 9, goals: [{ type: 'green' as GemType, count: 180 }, { type: 'yellow' as GemType, count: 180 }] },
  { id: 333, name: 'Suzhou, China', moves: 9, goals: [{ type: 'purple' as GemType, count: 181 }, { type: 'orange' as GemType, count: 181 }] },
  { id: 334, name: 'Shenyang, China', moves: 9, goals: [{ type: 'pink' as GemType, count: 181 }, { type: 'cyan' as GemType, count: 181 }] },
  { id: 335, name: 'Qingdao, China', moves: 9, goals: [{ type: 'lime' as GemType, count: 182 }, { type: 'magenta' as GemType, count: 182 }] },
  { id: 336, name: 'Hiroshima, Japan', moves: 9, goals: [{ type: 'red' as GemType, count: 182 }, { type: 'blue' as GemType, count: 182 }] },
  { id: 337, name: 'Sendai, Japan', moves: 9, goals: [{ type: 'green' as GemType, count: 183 }, { type: 'yellow' as GemType, count: 183 }] },
  { id: 338, name: 'Kitakyushu, Japan', moves: 9, goals: [{ type: 'purple' as GemType, count: 183 }, { type: 'orange' as GemType, count: 183 }] },
  { id: 339, name: 'Busan Metro, South Korea', moves: 9, goals: [{ type: 'pink' as GemType, count: 184 }, { type: 'cyan' as GemType, count: 184 }] },
  { id: 340, name: 'Ulsan, South Korea', moves: 9, goals: [{ type: 'lime' as GemType, count: 184 }, { type: 'magenta' as GemType, count: 184 }] },
  { id: 341, name: 'Hobart, Australia', moves: 9, goals: [{ type: 'red' as GemType, count: 185 }, { type: 'blue' as GemType, count: 185 }] },
  { id: 342, name: 'Darwin, Australia', moves: 9, goals: [{ type: 'green' as GemType, count: 185 }, { type: 'yellow' as GemType, count: 185 }] },
  { id: 343, name: 'Queenstown, New Zealand', moves: 9, goals: [{ type: 'purple' as GemType, count: 186 }, { type: 'orange' as GemType, count: 186 }] },
  { id: 344, name: 'Dunedin, New Zealand', moves: 9, goals: [{ type: 'pink' as GemType, count: 186 }, { type: 'cyan' as GemType, count: 186 }] },
  { id: 345, name: 'Charlotte, USA', moves: 9, goals: [{ type: 'lime' as GemType, count: 187 }, { type: 'magenta' as GemType, count: 187 }] },
  { id: 346, name: 'Columbus, USA', moves: 9, goals: [{ type: 'red' as GemType, count: 187 }, { type: 'blue' as GemType, count: 187 }] },
  { id: 347, name: 'Indianapolis, USA', moves: 9, goals: [{ type: 'green' as GemType, count: 188 }, { type: 'yellow' as GemType, count: 188 }] },
  { id: 348, name: 'Memphis, USA', moves: 9, goals: [{ type: 'purple' as GemType, count: 188 }, { type: 'orange' as GemType, count: 188 }] },
  { id: 349, name: 'Baltimore, USA', moves: 9, goals: [{ type: 'pink' as GemType, count: 189 }, { type: 'cyan' as GemType, count: 189 }] },
  { id: 350, name: 'Milwaukee, USA', moves: 9, goals: [{ type: 'lime' as GemType, count: 189 }, { type: 'magenta' as GemType, count: 189 }] },
  
  // Levels 351-400: Ultimate challenges
  { id: 351, name: 'Louisville, USA', moves: 9, goals: [{ type: 'red' as GemType, count: 190 }, { type: 'blue' as GemType, count: 190 }] },
  { id: 352, name: 'Raleigh, USA', moves: 9, goals: [{ type: 'green' as GemType, count: 190 }, { type: 'yellow' as GemType, count: 190 }] },
  { id: 353, name: 'Omaha, USA', moves: 9, goals: [{ type: 'purple' as GemType, count: 191 }, { type: 'orange' as GemType, count: 191 }] },
  { id: 354, name: 'Anchorage, USA', moves: 9, goals: [{ type: 'pink' as GemType, count: 191 }, { type: 'cyan' as GemType, count: 191 }] },
  { id: 355, name: 'Honolulu, USA', moves: 9, goals: [{ type: 'lime' as GemType, count: 192 }, { type: 'magenta' as GemType, count: 192 }] },
  { id: 356, name: 'Victoria, Canada', moves: 9, goals: [{ type: 'red' as GemType, count: 192 }, { type: 'blue' as GemType, count: 192 }] },
  { id: 357, name: 'Halifax, Canada', moves: 9, goals: [{ type: 'green' as GemType, count: 193 }, { type: 'yellow' as GemType, count: 193 }] },
  { id: 358, name: 'Saskatoon, Canada', moves: 9, goals: [{ type: 'purple' as GemType, count: 193 }, { type: 'orange' as GemType, count: 193 }] },
  { id: 359, name: 'Regina, Canada', moves: 9, goals: [{ type: 'pink' as GemType, count: 194 }, { type: 'cyan' as GemType, count: 194 }] },
  { id: 360, name: 'Sherbrooke, Canada', moves: 9, goals: [{ type: 'lime' as GemType, count: 194 }, { type: 'magenta' as GemType, count: 194 }] },
  { id: 361, name: 'Nuremberg, Germany', moves: 9, goals: [{ type: 'red' as GemType, count: 195 }, { type: 'blue' as GemType, count: 195 }] },
  { id: 362, name: 'Hanover, Germany', moves: 9, goals: [{ type: 'green' as GemType, count: 195 }, { type: 'yellow' as GemType, count: 195 }] },
  { id: 363, name: 'Dortmund, Germany', moves: 9, goals: [{ type: 'purple' as GemType, count: 196 }, { type: 'orange' as GemType, count: 196 }] },
  { id: 364, name: 'Essen, Germany', moves: 9, goals: [{ type: 'pink' as GemType, count: 196 }, { type: 'cyan' as GemType, count: 196 }] },
  { id: 365, name: 'Toulouse, France', moves: 9, goals: [{ type: 'lime' as GemType, count: 197 }, { type: 'magenta' as GemType, count: 197 }] },
  { id: 366, name: 'Nantes, France', moves: 9, goals: [{ type: 'red' as GemType, count: 197 }, { type: 'blue' as GemType, count: 197 }] },
  { id: 367, name: 'Montpellier, France', moves: 9, goals: [{ type: 'green' as GemType, count: 198 }, { type: 'yellow' as GemType, count: 198 }] },
  { id: 368, name: 'Rennes, France', moves: 9, goals: [{ type: 'purple' as GemType, count: 198 }, { type: 'orange' as GemType, count: 198 }] },
  { id: 369, name: 'Verona, Italy', moves: 9, goals: [{ type: 'pink' as GemType, count: 199 }, { type: 'cyan' as GemType, count: 199 }] },
  { id: 370, name: 'Padua, Italy', moves: 9, goals: [{ type: 'lime' as GemType, count: 199 }, { type: 'magenta' as GemType, count: 199 }] },
  { id: 371, name: 'Trieste, Italy', moves: 9, goals: [{ type: 'red' as GemType, count: 200 }, { type: 'blue' as GemType, count: 200 }] },
  { id: 372, name: 'Bari, Italy', moves: 9, goals: [{ type: 'green' as GemType, count: 200 }, { type: 'yellow' as GemType, count: 200 }] },
  { id: 373, name: 'Málaga, Spain', moves: 9, goals: [{ type: 'purple' as GemType, count: 201 }, { type: 'orange' as GemType, count: 201 }] },
  { id: 374, name: 'Zaragoza, Spain', moves: 9, goals: [{ type: 'pink' as GemType, count: 201 }, { type: 'cyan' as GemType, count: 201 }] },
  { id: 375, name: 'Palma, Spain', moves: 9, goals: [{ type: 'lime' as GemType, count: 202 }, { type: 'magenta' as GemType, count: 202 }] },
  { id: 376, name: 'Murcia, Spain', moves: 9, goals: [{ type: 'red' as GemType, count: 202 }, { type: 'blue' as GemType, count: 202 }] },
  { id: 377, name: 'Gdynia, Poland', moves: 9, goals: [{ type: 'green' as GemType, count: 203 }, { type: 'yellow' as GemType, count: 203 }] },
  { id: 378, name: 'Wroclaw, Poland', moves: 9, goals: [{ type: 'purple' as GemType, count: 203 }, { type: 'orange' as GemType, count: 203 }] },
  { id: 379, name: 'Poznan, Poland', moves: 9, goals: [{ type: 'pink' as GemType, count: 204 }, { type: 'cyan' as GemType, count: 204 }] },
  { id: 380, name: 'Kazan, Russia', moves: 9, goals: [{ type: 'lime' as GemType, count: 204 }, { type: 'magenta' as GemType, count: 204 }] },
  { id: 381, name: 'Yekaterinburg, Russia', moves: 9, goals: [{ type: 'red' as GemType, count: 205 }, { type: 'blue' as GemType, count: 205 }] },
  { id: 382, name: 'Vladivostok, Russia', moves: 9, goals: [{ type: 'green' as GemType, count: 205 }, { type: 'yellow' as GemType, count: 205 }] },
  { id: 383, name: 'Sochi, Russia', moves: 9, goals: [{ type: 'purple' as GemType, count: 206 }, { type: 'orange' as GemType, count: 206 }] },
  { id: 384, name: 'Suva, Fiji', moves: 9, goals: [{ type: 'pink' as GemType, count: 206 }, { type: 'cyan' as GemType, count: 206 }] },
  { id: 385, name: 'Papeete, French Polynesia', moves: 9, goals: [{ type: 'lime' as GemType, count: 207 }, { type: 'magenta' as GemType, count: 207 }] },
  { id: 386, name: 'Thimphu, Bhutan', moves: 9, goals: [{ type: 'red' as GemType, count: 207 }, { type: 'blue' as GemType, count: 207 }] },
  { id: 387, name: 'Male, Maldives', moves: 9, goals: [{ type: 'green' as GemType, count: 208 }, { type: 'yellow' as GemType, count: 208 }] },
  { id: 388, name: 'Bandar Seri Begawan, Brunei', moves: 9, goals: [{ type: 'purple' as GemType, count: 208 }, { type: 'orange' as GemType, count: 208 }] },
  { id: 389, name: 'Dili, East Timor', moves: 9, goals: [{ type: 'pink' as GemType, count: 209 }, { type: 'cyan' as GemType, count: 209 }] },
  { id: 390, name: 'Port Moresby, Papua New Guinea', moves: 9, goals: [{ type: 'lime' as GemType, count: 209 }, { type: 'magenta' as GemType, count: 209 }] },
  { id: 391, name: 'Apia, Samoa', moves: 9, goals: [{ type: 'red' as GemType, count: 210 }, { type: 'blue' as GemType, count: 210 }] },
  { id: 392, name: 'Noumea, New Caledonia', moves: 9, goals: [{ type: 'green' as GemType, count: 210 }, { type: 'yellow' as GemType, count: 210 }] },
  { id: 393, name: 'Port Vila, Vanuatu', moves: 9, goals: [{ type: 'purple' as GemType, count: 211 }, { type: 'orange' as GemType, count: 211 }] },
  { id: 394, name: 'Paramaribo, Suriname', moves: 9, goals: [{ type: 'pink' as GemType, count: 211 }, { type: 'cyan' as GemType, count: 211 }] },
  { id: 395, name: 'Georgetown, Guyana', moves: 9, goals: [{ type: 'lime' as GemType, count: 212 }, { type: 'magenta' as GemType, count: 212 }] },
  { id: 396, name: 'Cayenne, French Guiana', moves: 9, goals: [{ type: 'red' as GemType, count: 212 }, { type: 'blue' as GemType, count: 212 }] },
  { id: 397, name: 'Punta Arenas, Chile', moves: 9, goals: [{ type: 'green' as GemType, count: 213 }, { type: 'yellow' as GemType, count: 213 }] },
  { id: 398, name: 'Ushuaia, Argentina', moves: 9, goals: [{ type: 'purple' as GemType, count: 213 }, { type: 'orange' as GemType, count: 213 }] },
  { id: 399, name: 'Stanley, Falkland Islands', moves: 9, goals: [{ type: 'pink' as GemType, count: 214 }, { type: 'cyan' as GemType, count: 214 }] },
  { id: 400, name: 'Longyearbyen, Svalbard', moves: 9, goals: [{ type: 'lime' as GemType, count: 214 }, { type: 'magenta' as GemType, count: 214 }] },
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
      if (levelId >= currentUnlocked && levelId < 400) {
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
        onNextLevel={isWon && levelId < 400 ? () => navigate(`/game?level=${levelId + 1}`) : undefined}
      />
    </div>
  );
}
