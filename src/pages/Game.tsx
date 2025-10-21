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
  
  // Levels 401-450: India expansion
  { id: 401, name: 'Mumbai, India', moves: 10, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 402, name: 'Delhi, India', moves: 10, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 403, name: 'Bangalore, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 404, name: 'Hyderabad, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 405, name: 'Chennai, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 406, name: 'Kolkata, India', moves: 10, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 407, name: 'Pune, India', moves: 10, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 408, name: 'Ahmedabad, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 409, name: 'Jaipur, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 410, name: 'Surat, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 411, name: 'Lucknow, India', moves: 10, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 412, name: 'Kanpur, India', moves: 10, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 413, name: 'Nagpur, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 414, name: 'Indore, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 415, name: 'Thane, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 416, name: 'Bhopal, India', moves: 10, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 417, name: 'Visakhapatnam, India', moves: 10, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 418, name: 'Patna, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 419, name: 'Vadodara, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 420, name: 'Ghaziabad, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 421, name: 'Ludhiana, India', moves: 10, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 422, name: 'Agra, India', moves: 10, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 423, name: 'Nashik, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 424, name: 'Faridabad, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 425, name: 'Meerut, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 426, name: 'Rajkot, India', moves: 10, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 427, name: 'Varanasi, India', moves: 10, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 428, name: 'Amritsar, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 429, name: 'Allahabad, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 430, name: 'Ranchi, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 431, name: 'Howrah, India', moves: 10, goals: [{ type: 'red' as GemType, count: 110 }, { type: 'blue' as GemType, count: 110 }] },
  { id: 432, name: 'Coimbatore, India', moves: 10, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 433, name: 'Vijayawada, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 111 }, { type: 'orange' as GemType, count: 111 }] },
  { id: 434, name: 'Jodhpur, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 435, name: 'Madurai, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 112 }, { type: 'magenta' as GemType, count: 112 }] },
  { id: 436, name: 'Raipur, India', moves: 10, goals: [{ type: 'red' as GemType, count: 112 }, { type: 'blue' as GemType, count: 112 }] },
  { id: 437, name: 'Kota, India', moves: 10, goals: [{ type: 'green' as GemType, count: 113 }, { type: 'yellow' as GemType, count: 113 }] },
  { id: 438, name: 'Chandigarh, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 113 }, { type: 'orange' as GemType, count: 113 }] },
  { id: 439, name: 'Guwahati, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 114 }, { type: 'cyan' as GemType, count: 114 }] },
  { id: 440, name: 'Gwalior, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 114 }, { type: 'magenta' as GemType, count: 114 }] },
  { id: 441, name: 'Mysore, India', moves: 10, goals: [{ type: 'red' as GemType, count: 115 }, { type: 'blue' as GemType, count: 115 }] },
  { id: 442, name: 'Bhubaneswar, India', moves: 10, goals: [{ type: 'green' as GemType, count: 115 }, { type: 'yellow' as GemType, count: 115 }] },
  { id: 443, name: 'Thiruvananthapuram, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 116 }, { type: 'orange' as GemType, count: 116 }] },
  { id: 444, name: 'Dehradun, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 116 }, { type: 'cyan' as GemType, count: 116 }] },
  { id: 445, name: 'Shimla, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 117 }, { type: 'magenta' as GemType, count: 117 }] },
  { id: 446, name: 'Srinagar, India', moves: 10, goals: [{ type: 'red' as GemType, count: 117 }, { type: 'blue' as GemType, count: 117 }] },
  { id: 447, name: 'Udaipur, India', moves: 10, goals: [{ type: 'green' as GemType, count: 118 }, { type: 'yellow' as GemType, count: 118 }] },
  { id: 448, name: 'Aurangabad, India', moves: 10, goals: [{ type: 'purple' as GemType, count: 118 }, { type: 'orange' as GemType, count: 118 }] },
  { id: 449, name: 'Jabalpur, India', moves: 10, goals: [{ type: 'pink' as GemType, count: 119 }, { type: 'cyan' as GemType, count: 119 }] },
  { id: 450, name: 'Mangalore, India', moves: 10, goals: [{ type: 'lime' as GemType, count: 119 }, { type: 'magenta' as GemType, count: 119 }] },

  // Levels 451-500: Turkey expansion
  { id: 451, name: 'Istanbul, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 452, name: 'Ankara, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 453, name: 'Izmir, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 454, name: 'Bursa, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 455, name: 'Antalya, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  { id: 456, name: 'Adana, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 457, name: 'Gaziantep, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 458, name: 'Konya, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 459, name: 'Kayseri, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 460, name: 'Mersin, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 461, name: 'Eskişehir, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 462, name: 'Diyarbakır, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 463, name: 'Samsun, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 464, name: 'Denizli, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 465, name: 'Şanlıurfa, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 466, name: 'Kahramanmaraş, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 467, name: 'Malatya, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 468, name: 'Erzurum, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 469, name: 'Van, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 470, name: 'Batman, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 471, name: 'Elazığ, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 472, name: 'Trabzon, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 473, name: 'Balıkesir, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 474, name: 'Edirne, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 475, name: 'Çanakkale, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 476, name: 'Bodrum, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 477, name: 'Marmaris, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 478, name: 'Fethiye, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 479, name: 'Alanya, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 480, name: 'Side, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 481, name: 'Nevşehir, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 482, name: 'Pamukkale, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 483, name: 'Ephesus, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 484, name: 'Mardin, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 485, name: 'Hatay, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 486, name: 'Safranbolu, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 487, name: 'Amasya, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 488, name: 'Sinop, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 489, name: 'Rize, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 490, name: 'Artvin, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 491, name: 'Hakkari, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 492, name: 'Kars, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 493, name: 'Ağrı, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 494, name: 'Bitlis, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 495, name: 'Muş, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 496, name: 'Bingöl, Turkey', moves: 11, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 497, name: 'Tunceli, Turkey', moves: 11, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 498, name: 'Giresun, Turkey', moves: 11, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 499, name: 'Ordu, Turkey', moves: 11, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 500, name: 'Amasra, Turkey', moves: 11, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },

  // Levels 501-550: Egypt expansion
  { id: 501, name: 'Cairo, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 502, name: 'Alexandria, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 503, name: 'Giza, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 504, name: 'Luxor, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 505, name: 'Aswan, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 506, name: 'Sharm El Sheikh, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 507, name: 'Hurghada, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 508, name: 'Port Said, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 509, name: 'Suez, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 510, name: 'Mansoura, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 511, name: 'Tanta, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 512, name: 'Asyut, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 513, name: 'Ismailia, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 514, name: 'Faiyum, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 515, name: 'Zagazig, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 516, name: 'Damietta, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 517, name: 'Minya, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 518, name: 'Sohag, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 519, name: 'Beni Suef, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 520, name: 'Qena, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 521, name: 'Shibin El Kom, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 522, name: 'Banha, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 523, name: 'Kafr El Sheikh, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 524, name: 'Arish, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 525, name: 'Mallawi, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 526, name: 'Bilbays, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 527, name: 'Marsa Alam, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 528, name: 'Dahab, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 529, name: 'Nuweiba, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 530, name: 'Siwa, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 531, name: 'Marsa Matruh, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 532, name: 'Abu Simbel, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 533, name: 'Kom Ombo, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 534, name: 'Edfu, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 535, name: 'Abydos, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 536, name: 'Dendera, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 537, name: 'Karnak, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 538, name: 'Valley of Kings, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 539, name: 'Memphis, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 540, name: 'Saqqara, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 541, name: 'Dahshur, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 542, name: 'El Alamein, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 543, name: 'Rosetta, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 544, name: 'Al Qusayr, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 545, name: 'Safaga, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 546, name: 'Soma Bay, Egypt', moves: 11, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 547, name: 'El Gouna, Egypt', moves: 11, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 548, name: 'Makadi Bay, Egypt', moves: 11, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 549, name: 'Sahl Hasheesh, Egypt', moves: 11, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 550, name: 'Ras Sudr, Egypt', moves: 11, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },

  // Levels 551-600: Afghanistan & Bangladesh expansion
  { id: 551, name: 'Kabul, Afghanistan', moves: 11, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 552, name: 'Kandahar, Afghanistan', moves: 11, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 553, name: 'Herat, Afghanistan', moves: 11, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 554, name: 'Mazar-i-Sharif, Afghanistan', moves: 11, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 555, name: 'Jalalabad, Afghanistan', moves: 11, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 556, name: 'Kunduz, Afghanistan', moves: 11, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 557, name: 'Ghazni, Afghanistan', moves: 11, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 558, name: 'Bamiyan, Afghanistan', moves: 11, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 559, name: 'Balkh, Afghanistan', moves: 11, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 560, name: 'Lashkar Gah, Afghanistan', moves: 11, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 561, name: 'Khost, Afghanistan', moves: 11, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 562, name: 'Zaranj, Afghanistan', moves: 11, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 563, name: 'Farah, Afghanistan', moves: 11, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 564, name: 'Taloqan, Afghanistan', moves: 11, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 565, name: 'Puli Khumri, Afghanistan', moves: 11, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 566, name: 'Sheberghan, Afghanistan', moves: 11, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 567, name: 'Aybak, Afghanistan', moves: 11, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 568, name: 'Gardez, Afghanistan', moves: 11, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 569, name: 'Maymana, Afghanistan', moves: 11, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 570, name: 'Asadabad, Afghanistan', moves: 11, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 571, name: 'Qalat, Afghanistan', moves: 11, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 572, name: 'Charikar, Afghanistan', moves: 11, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 573, name: 'Nili, Afghanistan', moves: 11, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 574, name: 'Mehtar Lam, Afghanistan', moves: 11, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 575, name: 'Mahmud-e-Raqi, Afghanistan', moves: 11, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 576, name: 'Dhaka, Bangladesh', moves: 11, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 577, name: 'Chittagong, Bangladesh', moves: 11, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 578, name: 'Sylhet, Bangladesh', moves: 11, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 579, name: 'Rajshahi, Bangladesh', moves: 11, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 580, name: 'Khulna, Bangladesh', moves: 11, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 581, name: 'Barisal, Bangladesh', moves: 11, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 582, name: 'Rangpur, Bangladesh', moves: 11, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 583, name: 'Mymensingh, Bangladesh', moves: 11, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 584, name: 'Comilla, Bangladesh', moves: 11, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 585, name: 'Narayanganj, Bangladesh', moves: 11, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 586, name: 'Gazipur, Bangladesh', moves: 11, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 587, name: 'Jessore, Bangladesh', moves: 11, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 588, name: 'Bogra, Bangladesh', moves: 11, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 589, name: 'Dinajpur, Bangladesh', moves: 11, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 590, name: 'Cox\'s Bazar, Bangladesh', moves: 11, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 591, name: 'Pabna, Bangladesh', moves: 11, goals: [{ type: 'red' as GemType, count: 110 }, { type: 'blue' as GemType, count: 110 }] },
  { id: 592, name: 'Kushtia, Bangladesh', moves: 11, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 593, name: 'Tangail, Bangladesh', moves: 11, goals: [{ type: 'purple' as GemType, count: 111 }, { type: 'orange' as GemType, count: 111 }] },
  { id: 594, name: 'Jamalpur, Bangladesh', moves: 11, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 595, name: 'Sirajganj, Bangladesh', moves: 11, goals: [{ type: 'lime' as GemType, count: 112 }, { type: 'magenta' as GemType, count: 112 }] },
  { id: 596, name: 'Faridpur, Bangladesh', moves: 11, goals: [{ type: 'red' as GemType, count: 112 }, { type: 'blue' as GemType, count: 112 }] },
  { id: 597, name: 'Madaripur, Bangladesh', moves: 11, goals: [{ type: 'green' as GemType, count: 113 }, { type: 'yellow' as GemType, count: 113 }] },
  { id: 598, name: 'Patuakhali, Bangladesh', moves: 11, goals: [{ type: 'purple' as GemType, count: 113 }, { type: 'orange' as GemType, count: 113 }] },
  { id: 599, name: 'Bhola, Bangladesh', moves: 11, goals: [{ type: 'pink' as GemType, count: 114 }, { type: 'cyan' as GemType, count: 114 }] },
  { id: 600, name: 'Brahmanbaria, Bangladesh', moves: 11, goals: [{ type: 'lime' as GemType, count: 114 }, { type: 'magenta' as GemType, count: 114 }] },

  // Levels 601-650: UAE & Saudi Arabia expansion
  { id: 601, name: 'Dubai, UAE', moves: 12, goals: [{ type: 'red' as GemType, count: 75 }, { type: 'blue' as GemType, count: 75 }] },
  { id: 602, name: 'Abu Dhabi, UAE', moves: 12, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  { id: 603, name: 'Sharjah, UAE', moves: 12, goals: [{ type: 'purple' as GemType, count: 76 }, { type: 'orange' as GemType, count: 76 }] },
  { id: 604, name: 'Ajman, UAE', moves: 12, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 605, name: 'Ras Al Khaimah, UAE', moves: 12, goals: [{ type: 'lime' as GemType, count: 77 }, { type: 'magenta' as GemType, count: 77 }] },
  { id: 606, name: 'Fujairah, UAE', moves: 12, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 607, name: 'Umm Al Quwain, UAE', moves: 12, goals: [{ type: 'green' as GemType, count: 78 }, { type: 'yellow' as GemType, count: 78 }] },
  { id: 608, name: 'Al Ain, UAE', moves: 12, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 609, name: 'Khor Fakkan, UAE', moves: 12, goals: [{ type: 'pink' as GemType, count: 79 }, { type: 'cyan' as GemType, count: 79 }] },
  { id: 610, name: 'Dibba Al Fujairah, UAE', moves: 12, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 611, name: 'Riyadh, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 612, name: 'Jeddah, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 613, name: 'Mecca, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 614, name: 'Medina, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 615, name: 'Dammam, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  { id: 616, name: 'Khobar, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 617, name: 'Taif, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 618, name: 'Tabuk, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 619, name: 'Buraidah, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 620, name: 'Khamis Mushait, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 621, name: 'Hail, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 622, name: 'Abha, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 623, name: 'Najran, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 624, name: 'Yanbu, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 625, name: 'Jizan, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 626, name: 'Al Jubail, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 627, name: 'Hafar Al Batin, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 628, name: 'AlUla, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 629, name: 'Sakaka, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 630, name: 'Arar, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 631, name: 'Qatif, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 632, name: 'Unaizah, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 633, name: 'Dhahran, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 634, name: 'Bisha, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 635, name: 'Al Qunfudhah, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 636, name: 'Ras Tanura, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 637, name: 'Al Kharj, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 638, name: 'Rabigh, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 639, name: 'Al Bahah, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 640, name: 'Wadi Ad-Dawasir, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 641, name: 'Al Majmaah, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 642, name: 'Turaif, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 643, name: 'Dawadmi, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 644, name: 'Al Aflaj, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 645, name: 'Al Qurayyat, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 646, name: 'Tabarjal, Saudi Arabia', moves: 12, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 647, name: 'Dumat Al Jandal, Saudi Arabia', moves: 12, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 648, name: 'Al Wajh, Saudi Arabia', moves: 12, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 649, name: 'Sabya, Saudi Arabia', moves: 12, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 650, name: 'NEOM, Saudi Arabia', moves: 12, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },

  // Levels 651-700: Qatar, Kuwait & Bahrain expansion
  { id: 651, name: 'Doha, Qatar', moves: 12, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 652, name: 'Al Wakrah, Qatar', moves: 12, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 653, name: 'Al Khor, Qatar', moves: 12, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 654, name: 'Al Rayyan, Qatar', moves: 12, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 655, name: 'Lusail, Qatar', moves: 12, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  { id: 656, name: 'Mesaieed, Qatar', moves: 12, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 657, name: 'Dukhan, Qatar', moves: 12, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 658, name: 'Al Shamal, Qatar', moves: 12, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 659, name: 'Umm Salal, Qatar', moves: 12, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 660, name: 'Al Sheehaniya, Qatar', moves: 12, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 661, name: 'Kuwait City, Kuwait', moves: 12, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 662, name: 'Hawalli, Kuwait', moves: 12, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 663, name: 'Al Ahmadi, Kuwait', moves: 12, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 664, name: 'Al Jahra, Kuwait', moves: 12, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 665, name: 'Farwaniya, Kuwait', moves: 12, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 666, name: 'Salmiya, Kuwait', moves: 12, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 667, name: 'Sabah Al Salem, Kuwait', moves: 12, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 668, name: 'Fahaheel, Kuwait', moves: 12, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 669, name: 'Mangaf, Kuwait', moves: 12, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 670, name: 'Fintas, Kuwait', moves: 12, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 671, name: 'Manama, Bahrain', moves: 12, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 672, name: 'Riffa, Bahrain', moves: 12, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 673, name: 'Muharraq, Bahrain', moves: 12, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 674, name: 'Hamad Town, Bahrain', moves: 12, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 675, name: 'Isa Town, Bahrain', moves: 12, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 676, name: 'Sitra, Bahrain', moves: 12, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 677, name: 'Budaiya, Bahrain', moves: 12, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 678, name: 'Jidhafs, Bahrain', moves: 12, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 679, name: 'Al Hidd, Bahrain', moves: 12, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 680, name: 'Amwaj Islands, Bahrain', moves: 12, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 681, name: 'Muscat, Oman', moves: 12, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 682, name: 'Salalah, Oman', moves: 12, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 683, name: 'Sohar, Oman', moves: 12, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 684, name: 'Nizwa, Oman', moves: 12, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 685, name: 'Sur, Oman', moves: 12, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 686, name: 'Ibri, Oman', moves: 12, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 687, name: 'Barka, Oman', moves: 12, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 688, name: 'Rustaq, Oman', moves: 12, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 689, name: 'Bahla, Oman', moves: 12, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 690, name: 'Khasab, Oman', moves: 12, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 691, name: 'Sanaa, Yemen', moves: 12, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 692, name: 'Aden, Yemen', moves: 12, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 693, name: 'Taiz, Yemen', moves: 12, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 694, name: 'Hodeidah, Yemen', moves: 12, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 695, name: 'Ibb, Yemen', moves: 12, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 696, name: 'Dhamar, Yemen', moves: 12, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 697, name: 'Mukalla, Yemen', moves: 12, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 698, name: 'Shibam, Yemen', moves: 12, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 699, name: 'Socotra, Yemen', moves: 12, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 700, name: 'Zabid, Yemen', moves: 12, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },

  // Levels 701-750: Jordan, Lebanon & Palestine expansion
  { id: 701, name: 'Amman, Jordan', moves: 12, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 702, name: 'Petra, Jordan', moves: 12, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 703, name: 'Aqaba, Jordan', moves: 12, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 704, name: 'Jerash, Jordan', moves: 12, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 705, name: 'Madaba, Jordan', moves: 12, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 706, name: 'Wadi Rum, Jordan', moves: 12, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 707, name: 'Dead Sea, Jordan', moves: 12, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 708, name: 'Irbid, Jordan', moves: 12, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 709, name: 'Zarqa, Jordan', moves: 12, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 710, name: 'Salt, Jordan', moves: 12, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 711, name: 'Karak, Jordan', moves: 12, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 712, name: 'Ajloun, Jordan', moves: 12, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 713, name: 'Umm Qais, Jordan', moves: 12, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 714, name: 'Azraq, Jordan', moves: 12, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 715, name: 'Pella, Jordan', moves: 12, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 716, name: 'Beirut, Lebanon', moves: 12, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 717, name: 'Tripoli, Lebanon', moves: 12, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 718, name: 'Sidon, Lebanon', moves: 12, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 719, name: 'Tyre, Lebanon', moves: 12, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 720, name: 'Byblos, Lebanon', moves: 12, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 721, name: 'Baalbek, Lebanon', moves: 12, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 722, name: 'Zahle, Lebanon', moves: 12, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 723, name: 'Jounieh, Lebanon', moves: 12, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 724, name: 'Batroun, Lebanon', moves: 12, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 725, name: 'Bsharri, Lebanon', moves: 12, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 726, name: 'Jerusalem, Palestine', moves: 12, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 727, name: 'Bethlehem, Palestine', moves: 12, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 728, name: 'Hebron, Palestine', moves: 12, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 729, name: 'Nablus, Palestine', moves: 12, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 730, name: 'Ramallah, Palestine', moves: 12, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 731, name: 'Gaza, Palestine', moves: 12, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 732, name: 'Jericho, Palestine', moves: 12, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 733, name: 'Jenin, Palestine', moves: 12, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 734, name: 'Tulkarm, Palestine', moves: 12, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 735, name: 'Qalqilya, Palestine', moves: 12, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 736, name: 'Salfit, Palestine', moves: 12, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 737, name: 'Tubas, Palestine', moves: 12, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 738, name: 'Jaffa, Palestine', moves: 12, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 739, name: 'Acre, Palestine', moves: 12, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 740, name: 'Nazareth, Palestine', moves: 12, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 741, name: 'Damascus, Syria', moves: 12, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 742, name: 'Aleppo, Syria', moves: 12, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 743, name: 'Homs, Syria', moves: 12, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 744, name: 'Latakia, Syria', moves: 12, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 745, name: 'Hama, Syria', moves: 12, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 746, name: 'Palmyra, Syria', moves: 12, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 747, name: 'Tartus, Syria', moves: 12, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 748, name: 'Deir ez-Zor, Syria', moves: 12, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 749, name: 'Raqqa, Syria', moves: 12, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 750, name: 'Qamishli, Syria', moves: 12, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },

  // Levels 751-800: Iraq expansion
  { id: 751, name: 'Baghdad, Iraq', moves: 12, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 752, name: 'Basra, Iraq', moves: 12, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 753, name: 'Mosul, Iraq', moves: 12, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 754, name: 'Erbil, Iraq', moves: 12, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 755, name: 'Najaf, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 756, name: 'Karbala, Iraq', moves: 12, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 757, name: 'Sulaymaniyah, Iraq', moves: 12, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 758, name: 'Kirkuk, Iraq', moves: 12, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 759, name: 'Samarra, Iraq', moves: 12, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 760, name: 'Tikrit, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 761, name: 'Babylon, Iraq', moves: 12, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 762, name: 'Ur, Iraq', moves: 12, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 763, name: 'Nineveh, Iraq', moves: 12, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 764, name: 'Ramadi, Iraq', moves: 12, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 765, name: 'Fallujah, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 766, name: 'Dohuk, Iraq', moves: 12, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 767, name: 'Hilla, Iraq', moves: 12, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 768, name: 'Kut, Iraq', moves: 12, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 769, name: 'Amarah, Iraq', moves: 12, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 770, name: 'Nasiriyah, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 771, name: 'Diwaniya, Iraq', moves: 12, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 772, name: 'Baqubah, Iraq', moves: 12, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 773, name: 'Zakho, Iraq', moves: 12, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 774, name: 'Halabja, Iraq', moves: 12, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 775, name: 'Sinjar, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 776, name: 'Tehran, Iran', moves: 12, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 777, name: 'Isfahan, Iran', moves: 12, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 778, name: 'Shiraz, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 779, name: 'Tabriz, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 780, name: 'Mashhad, Iran', moves: 12, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 781, name: 'Yazd, Iran', moves: 12, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 782, name: 'Kerman, Iran', moves: 12, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 783, name: 'Persepolis, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 784, name: 'Qom, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 785, name: 'Kashan, Iran', moves: 12, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 786, name: 'Rasht, Iran', moves: 12, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 787, name: 'Hamadan, Iran', moves: 12, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 788, name: 'Ardabil, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 789, name: 'Urmia, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 790, name: 'Ahvaz, Iran', moves: 12, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 791, name: 'Kish Island, Iran', moves: 12, goals: [{ type: 'red' as GemType, count: 110 }, { type: 'blue' as GemType, count: 110 }] },
  { id: 792, name: 'Bandar Abbas, Iran', moves: 12, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 793, name: 'Qazvin, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 111 }, { type: 'orange' as GemType, count: 111 }] },
  { id: 794, name: 'Zahedan, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 795, name: 'Sari, Iran', moves: 12, goals: [{ type: 'lime' as GemType, count: 112 }, { type: 'magenta' as GemType, count: 112 }] },
  { id: 796, name: 'Gorgan, Iran', moves: 12, goals: [{ type: 'red' as GemType, count: 112 }, { type: 'blue' as GemType, count: 112 }] },
  { id: 797, name: 'Kermanshah, Iran', moves: 12, goals: [{ type: 'green' as GemType, count: 113 }, { type: 'yellow' as GemType, count: 113 }] },
  { id: 798, name: 'Sanandaj, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 113 }, { type: 'orange' as GemType, count: 113 }] },
  { id: 799, name: 'Bushehr, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 114 }, { type: 'cyan' as GemType, count: 114 }] },
  { id: 800, name: 'Birjand, Iran', moves: 12, goals: [{ type: 'lime' as GemType, count: 114 }, { type: 'magenta' as GemType, count: 114 }] },

  // Levels 801-850: More Ethiopia cities
  { id: 801, name: 'Bahir Dar, Ethiopia', moves: 13, goals: [{ type: 'red' as GemType, count: 70 }, { type: 'blue' as GemType, count: 70 }] },
  { id: 802, name: 'Hawassa, Ethiopia', moves: 13, goals: [{ type: 'green' as GemType, count: 70 }, { type: 'yellow' as GemType, count: 70 }] },
  { id: 803, name: 'Dessie, Ethiopia', moves: 13, goals: [{ type: 'purple' as GemType, count: 71 }, { type: 'orange' as GemType, count: 71 }] },
  { id: 804, name: 'Jimma, Ethiopia', moves: 13, goals: [{ type: 'pink' as GemType, count: 71 }, { type: 'cyan' as GemType, count: 71 }] },
  { id: 805, name: 'Jijiga, Ethiopia', moves: 13, goals: [{ type: 'lime' as GemType, count: 72 }, { type: 'magenta' as GemType, count: 72 }] },
  { id: 806, name: 'Shashamane, Ethiopia', moves: 13, goals: [{ type: 'red' as GemType, count: 72 }, { type: 'blue' as GemType, count: 72 }] },
  { id: 807, name: 'Bishoftu, Ethiopia', moves: 13, goals: [{ type: 'green' as GemType, count: 73 }, { type: 'yellow' as GemType, count: 73 }] },
  { id: 808, name: 'Adama, Ethiopia', moves: 13, goals: [{ type: 'purple' as GemType, count: 73 }, { type: 'orange' as GemType, count: 73 }] },
  { id: 809, name: 'Harar, Ethiopia', moves: 13, goals: [{ type: 'pink' as GemType, count: 74 }, { type: 'cyan' as GemType, count: 74 }] },
  { id: 810, name: 'Arba Minch, Ethiopia', moves: 13, goals: [{ type: 'lime' as GemType, count: 74 }, { type: 'magenta' as GemType, count: 74 }] },
  { id: 811, name: 'Nekemte, Ethiopia', moves: 13, goals: [{ type: 'red' as GemType, count: 75 }, { type: 'blue' as GemType, count: 75 }] },
  { id: 812, name: 'Debre Birhan, Ethiopia', moves: 13, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  { id: 813, name: 'Asella, Ethiopia', moves: 13, goals: [{ type: 'purple' as GemType, count: 76 }, { type: 'orange' as GemType, count: 76 }] },
  { id: 814, name: 'Dila, Ethiopia', moves: 13, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 815, name: 'Debre Markos, Ethiopia', moves: 13, goals: [{ type: 'lime' as GemType, count: 77 }, { type: 'magenta' as GemType, count: 77 }] },
  { id: 816, name: 'Kombolcha, Ethiopia', moves: 13, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 817, name: 'Debre Tabor, Ethiopia', moves: 13, goals: [{ type: 'green' as GemType, count: 78 }, { type: 'yellow' as GemType, count: 78 }] },
  { id: 818, name: 'Butajira, Ethiopia', moves: 13, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 819, name: 'Hosaena, Ethiopia', moves: 13, goals: [{ type: 'pink' as GemType, count: 79 }, { type: 'cyan' as GemType, count: 79 }] },
  { id: 820, name: 'Wolaita Sodo, Ethiopia', moves: 13, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 821, name: 'Lalibela, Ethiopia', moves: 13, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 822, name: 'Axum, Ethiopia', moves: 13, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 823, name: 'Bale, Ethiopia', moves: 13, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 824, name: 'Gambela, Ethiopia', moves: 13, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 825, name: 'Semera, Ethiopia', moves: 13, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  
  // More Nepal cities
  { id: 826, name: 'Biratnagar, Nepal', moves: 13, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 827, name: 'Birgunj, Nepal', moves: 13, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 828, name: 'Bharatpur, Nepal', moves: 13, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 829, name: 'Janakpur, Nepal', moves: 13, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 830, name: 'Hetauda, Nepal', moves: 13, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 831, name: 'Butwal, Nepal', moves: 13, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 832, name: 'Dharan, Nepal', moves: 13, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 833, name: 'Itahari, Nepal', moves: 13, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 834, name: 'Nepalgunj, Nepal', moves: 13, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 835, name: 'Dhangadhi, Nepal', moves: 13, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 836, name: 'Lumbini, Nepal', moves: 13, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 837, name: 'Bhaktapur, Nepal', moves: 13, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 838, name: 'Patan, Nepal', moves: 13, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 839, name: 'Chitwan, Nepal', moves: 13, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 840, name: 'Mustang, Nepal', moves: 13, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 841, name: 'Namche Bazaar, Nepal', moves: 13, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 842, name: 'Tansen, Nepal', moves: 13, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 843, name: 'Gorkha, Nepal', moves: 13, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 844, name: 'Bandipur, Nepal', moves: 13, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 845, name: 'Nagarkot, Nepal', moves: 13, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 846, name: 'Dhampus, Nepal', moves: 13, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 847, name: 'Sarangkot, Nepal', moves: 13, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 848, name: 'Dhulikhel, Nepal', moves: 13, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 849, name: 'Annapurna, Nepal', moves: 13, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 850, name: 'Everest Base Camp, Nepal', moves: 13, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },

  // Levels 851-900: More Kenya cities
  { id: 851, name: 'Nakuru, Kenya', moves: 13, goals: [{ type: 'red' as GemType, count: 75 }, { type: 'blue' as GemType, count: 75 }] },
  { id: 852, name: 'Eldoret, Kenya', moves: 13, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  { id: 853, name: 'Thika, Kenya', moves: 13, goals: [{ type: 'purple' as GemType, count: 76 }, { type: 'orange' as GemType, count: 76 }] },
  { id: 854, name: 'Malindi, Kenya', moves: 13, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 855, name: 'Kitale, Kenya', moves: 13, goals: [{ type: 'lime' as GemType, count: 77 }, { type: 'magenta' as GemType, count: 77 }] },
  { id: 856, name: 'Garissa, Kenya', moves: 13, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 857, name: 'Kakamega, Kenya', moves: 13, goals: [{ type: 'green' as GemType, count: 78 }, { type: 'yellow' as GemType, count: 78 }] },
  { id: 858, name: 'Machakos, Kenya', moves: 13, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 859, name: 'Nyeri, Kenya', moves: 13, goals: [{ type: 'pink' as GemType, count: 79 }, { type: 'cyan' as GemType, count: 79 }] },
  { id: 860, name: 'Meru, Kenya', moves: 13, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 861, name: 'Kericho, Kenya', moves: 13, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 862, name: 'Naivasha, Kenya', moves: 13, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 863, name: 'Lamu, Kenya', moves: 13, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 864, name: 'Watamu, Kenya', moves: 13, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 865, name: 'Diani Beach, Kenya', moves: 13, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  { id: 866, name: 'Amboseli, Kenya', moves: 13, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 867, name: 'Masai Mara, Kenya', moves: 13, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 868, name: 'Tsavo, Kenya', moves: 13, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 869, name: 'Samburu, Kenya', moves: 13, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 870, name: 'Hells Gate, Kenya', moves: 13, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  
  // More Pakistan cities
  { id: 871, name: 'Rawalpindi, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 872, name: 'Multan, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 873, name: 'Peshawar, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 874, name: 'Quetta, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 875, name: 'Gujranwala, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 876, name: 'Sialkot, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 877, name: 'Bahawalpur, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 878, name: 'Sargodha, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 879, name: 'Gujrat, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 880, name: 'Jhang, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 881, name: 'Sheikhupura, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 882, name: 'Rahim Yar Khan, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 883, name: 'Mardan, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 884, name: 'Kasur, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 885, name: 'Dera Ghazi Khan, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 886, name: 'Sahiwal, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 887, name: 'Okara, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 888, name: 'Wah Cantt, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 889, name: 'Mingora, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 890, name: 'Mirpur Khas, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 891, name: 'Sukkur, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 892, name: 'Larkana, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 893, name: 'Nawabshah, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 894, name: 'Abbottabad, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 895, name: 'Murree, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 896, name: 'Gilgit, Pakistan', moves: 13, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 897, name: 'Skardu, Pakistan', moves: 13, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 898, name: 'Hunza, Pakistan', moves: 13, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 899, name: 'Naran, Pakistan', moves: 13, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 900, name: 'Swat Valley, Pakistan', moves: 13, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },

  // Levels 901-950: More Philippines cities
  { id: 901, name: 'Makati, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 80 }, { type: 'blue' as GemType, count: 80 }] },
  { id: 902, name: 'Pasig, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 903, name: 'Taguig, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 81 }, { type: 'orange' as GemType, count: 81 }] },
  { id: 904, name: 'Caloocan, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 905, name: 'Mandaluyong, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 82 }, { type: 'magenta' as GemType, count: 82 }] },
  { id: 906, name: 'Parañaque, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 907, name: 'Las Piñas, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 83 }, { type: 'yellow' as GemType, count: 83 }] },
  { id: 908, name: 'Muntinlupa, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 909, name: 'Bacolod, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 84 }, { type: 'cyan' as GemType, count: 84 }] },
  { id: 910, name: 'Iloilo, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 911, name: 'Cagayan de Oro, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 912, name: 'General Santos, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 913, name: 'Zamboanga, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 914, name: 'Baguio, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 915, name: 'Tagaytay, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 916, name: 'Boracay, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 917, name: 'Palawan, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 918, name: 'El Nido, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 919, name: 'Coron, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 920, name: 'Siargao, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 921, name: 'Dumaguete, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 922, name: 'Bohol, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 923, name: 'Panglao, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 924, name: 'Camiguin, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 925, name: 'Vigan, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 926, name: 'Sagada, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 927, name: 'Batanes, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 928, name: 'Legazpi, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 929, name: 'Tacloban, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 930, name: 'Ormoc, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 931, name: 'Puerto Princesa, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 932, name: 'Roxas, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 933, name: 'Dipolog, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 934, name: 'Butuan, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 935, name: 'Surigao, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 936, name: 'Mati, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 937, name: 'Cotabato, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 938, name: 'Marawi, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 939, name: 'Jolo, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 940, name: 'Isabela, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 941, name: 'Batangas, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 942, name: 'Lipa, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 943, name: 'Lucena, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 944, name: 'Naga, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 945, name: 'Legaspi, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 946, name: 'Sorsogon, Philippines', moves: 13, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 947, name: 'Masbate, Philippines', moves: 13, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 948, name: 'Catanduanes, Philippines', moves: 13, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 949, name: 'Marinduque, Philippines', moves: 13, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 950, name: 'Romblon, Philippines', moves: 13, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },

  // Levels 951-1000: Final Vietnam, Indonesia & Thailand cities
  { id: 951, name: 'Hue, Vietnam', moves: 13, goals: [{ type: 'red' as GemType, count: 85 }, { type: 'blue' as GemType, count: 85 }] },
  { id: 952, name: 'Nha Trang, Vietnam', moves: 13, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 953, name: 'Can Tho, Vietnam', moves: 13, goals: [{ type: 'purple' as GemType, count: 86 }, { type: 'orange' as GemType, count: 86 }] },
  { id: 954, name: 'Dalat, Vietnam', moves: 13, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 955, name: 'Vung Tau, Vietnam', moves: 13, goals: [{ type: 'lime' as GemType, count: 87 }, { type: 'magenta' as GemType, count: 87 }] },
  { id: 956, name: 'Phan Thiet, Vietnam', moves: 13, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 957, name: 'Mui Ne, Vietnam', moves: 13, goals: [{ type: 'green' as GemType, count: 88 }, { type: 'yellow' as GemType, count: 88 }] },
  { id: 958, name: 'Ha Long Bay, Vietnam', moves: 13, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 959, name: 'Sapa, Vietnam', moves: 13, goals: [{ type: 'pink' as GemType, count: 89 }, { type: 'cyan' as GemType, count: 89 }] },
  { id: 960, name: 'Phong Nha, Vietnam', moves: 13, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 961, name: 'Hoi An, Vietnam', moves: 13, goals: [{ type: 'red' as GemType, count: 90 }, { type: 'blue' as GemType, count: 90 }] },
  { id: 962, name: 'Ninh Binh, Vietnam', moves: 13, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 963, name: 'Phu Quoc, Vietnam', moves: 13, goals: [{ type: 'purple' as GemType, count: 91 }, { type: 'orange' as GemType, count: 91 }] },
  { id: 964, name: 'Cat Ba, Vietnam', moves: 13, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 965, name: 'Con Dao, Vietnam', moves: 13, goals: [{ type: 'lime' as GemType, count: 92 }, { type: 'magenta' as GemType, count: 92 }] },
  { id: 966, name: 'Yogyakarta, Indonesia', moves: 13, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 967, name: 'Bali, Indonesia', moves: 13, goals: [{ type: 'green' as GemType, count: 93 }, { type: 'yellow' as GemType, count: 93 }] },
  { id: 968, name: 'Lombok, Indonesia', moves: 13, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 969, name: 'Ubud, Indonesia', moves: 13, goals: [{ type: 'pink' as GemType, count: 94 }, { type: 'cyan' as GemType, count: 94 }] },
  { id: 970, name: 'Seminyak, Indonesia', moves: 13, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 971, name: 'Nusa Dua, Indonesia', moves: 13, goals: [{ type: 'red' as GemType, count: 95 }, { type: 'blue' as GemType, count: 95 }] },
  { id: 972, name: 'Gili Islands, Indonesia', moves: 13, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 973, name: 'Komodo, Indonesia', moves: 13, goals: [{ type: 'purple' as GemType, count: 96 }, { type: 'orange' as GemType, count: 96 }] },
  { id: 974, name: 'Borobudur, Indonesia', moves: 13, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 975, name: 'Prambanan, Indonesia', moves: 13, goals: [{ type: 'lime' as GemType, count: 97 }, { type: 'magenta' as GemType, count: 97 }] },
  { id: 976, name: 'Bromo, Indonesia', moves: 13, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 977, name: 'Krakatoa, Indonesia', moves: 13, goals: [{ type: 'green' as GemType, count: 98 }, { type: 'yellow' as GemType, count: 98 }] },
  { id: 978, name: 'Raja Ampat, Indonesia', moves: 13, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 979, name: 'Bunaken, Indonesia', moves: 13, goals: [{ type: 'pink' as GemType, count: 99 }, { type: 'cyan' as GemType, count: 99 }] },
  { id: 980, name: 'Tana Toraja, Indonesia', moves: 13, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 981, name: 'Krabi, Thailand', moves: 13, goals: [{ type: 'red' as GemType, count: 100 }, { type: 'blue' as GemType, count: 100 }] },
  { id: 982, name: 'Koh Samui, Thailand', moves: 13, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 983, name: 'Koh Phi Phi, Thailand', moves: 13, goals: [{ type: 'purple' as GemType, count: 101 }, { type: 'orange' as GemType, count: 101 }] },
  { id: 984, name: 'Koh Lanta, Thailand', moves: 13, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 985, name: 'Koh Tao, Thailand', moves: 13, goals: [{ type: 'lime' as GemType, count: 102 }, { type: 'magenta' as GemType, count: 102 }] },
  { id: 986, name: 'Hua Hin, Thailand', moves: 13, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 987, name: 'Ayutthaya, Thailand', moves: 13, goals: [{ type: 'green' as GemType, count: 103 }, { type: 'yellow' as GemType, count: 103 }] },
  { id: 988, name: 'Sukhothai, Thailand', moves: 13, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 989, name: 'Pai, Thailand', moves: 13, goals: [{ type: 'pink' as GemType, count: 104 }, { type: 'cyan' as GemType, count: 104 }] },
  { id: 990, name: 'Chiang Rai, Thailand', moves: 13, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 991, name: 'Kanchanaburi, Thailand', moves: 13, goals: [{ type: 'red' as GemType, count: 105 }, { type: 'blue' as GemType, count: 105 }] },
  { id: 992, name: 'Khao Sok, Thailand', moves: 13, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 993, name: 'Khao Lak, Thailand', moves: 13, goals: [{ type: 'purple' as GemType, count: 106 }, { type: 'orange' as GemType, count: 106 }] },
  { id: 994, name: 'Similan Islands, Thailand', moves: 13, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 995, name: 'Railay Beach, Thailand', moves: 13, goals: [{ type: 'lime' as GemType, count: 107 }, { type: 'magenta' as GemType, count: 107 }] },
  { id: 996, name: 'Koh Chang, Thailand', moves: 13, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 997, name: 'Koh Samet, Thailand', moves: 13, goals: [{ type: 'green' as GemType, count: 108 }, { type: 'yellow' as GemType, count: 108 }] },
  { id: 998, name: 'Koh Phangan, Thailand', moves: 13, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 999, name: 'Erawan Falls, Thailand', moves: 13, goals: [{ type: 'pink' as GemType, count: 109 }, { type: 'cyan' as GemType, count: 109 }] },
  { id: 1000, name: 'White Temple, Thailand', moves: 13, goals: [{ type: 'lime' as GemType, count: 110 }, { type: 'magenta' as GemType, count: 110 }] },
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
      if (levelId >= currentUnlocked && levelId < 1000) {
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
        onNextLevel={isWon && levelId < 1000 ? () => navigate(`/game?level=${levelId + 1}`) : undefined}
      />
    </div>
  );
}
