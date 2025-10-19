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

// Balanced levels - challenging but completable with bonus system
export const LEVELS = [
  // Levels 1-10: Easy start
  { id: 1, name: 'Kabul, Afghanistan', moves: 25, goals: [{ type: 'red' as GemType, count: 12 }, { type: 'blue' as GemType, count: 12 }] },
  { id: 2, name: 'Kandahar, Afghanistan', moves: 25, goals: [{ type: 'green' as GemType, count: 12 }, { type: 'yellow' as GemType, count: 12 }] },
  { id: 3, name: 'Herat, Afghanistan', moves: 24, goals: [{ type: 'purple' as GemType, count: 13 }, { type: 'orange' as GemType, count: 13 }] },
  { id: 4, name: 'Addis Ababa, Ethiopia', moves: 24, goals: [{ type: 'pink' as GemType, count: 13 }, { type: 'cyan' as GemType, count: 13 }] },
  { id: 5, name: 'Dire Dawa, Ethiopia', moves: 24, goals: [{ type: 'lime' as GemType, count: 14 }, { type: 'magenta' as GemType, count: 14 }] },
  { id: 6, name: 'Dhaka, Bangladesh', moves: 23, goals: [{ type: 'red' as GemType, count: 14 }, { type: 'blue' as GemType, count: 14 }] },
  { id: 7, name: 'Chittagong, Bangladesh', moves: 23, goals: [{ type: 'green' as GemType, count: 15 }, { type: 'yellow' as GemType, count: 15 }] },
  { id: 8, name: 'Kathmandu, Nepal', moves: 23, goals: [{ type: 'purple' as GemType, count: 15 }, { type: 'orange' as GemType, count: 15 }] },
  { id: 9, name: 'Pokhara, Nepal', moves: 22, goals: [{ type: 'pink' as GemType, count: 16 }, { type: 'cyan' as GemType, count: 16 }] },
  { id: 10, name: 'Nairobi, Kenya', moves: 22, goals: [{ type: 'lime' as GemType, count: 16 }, { type: 'magenta' as GemType, count: 16 }] },
  
  // Levels 11-30: Gradual increase
  { id: 11, name: 'Mombasa, Kenya', moves: 22, goals: [{ type: 'red' as GemType, count: 17 }, { type: 'blue' as GemType, count: 17 }] },
  { id: 12, name: 'Karachi, Pakistan', moves: 21, goals: [{ type: 'green' as GemType, count: 17 }, { type: 'yellow' as GemType, count: 17 }] },
  { id: 13, name: 'Lahore, Pakistan', moves: 21, goals: [{ type: 'purple' as GemType, count: 18 }, { type: 'orange' as GemType, count: 18 }] },
  { id: 14, name: 'Islamabad, Pakistan', moves: 21, goals: [{ type: 'pink' as GemType, count: 18 }, { type: 'cyan' as GemType, count: 18 }] },
  { id: 15, name: 'Manila, Philippines', moves: 20, goals: [{ type: 'lime' as GemType, count: 19 }, { type: 'magenta' as GemType, count: 19 }] },
  { id: 16, name: 'Cebu, Philippines', moves: 20, goals: [{ type: 'red' as GemType, count: 19 }, { type: 'blue' as GemType, count: 19 }] },
  { id: 17, name: 'Davao, Philippines', moves: 20, goals: [{ type: 'green' as GemType, count: 20 }, { type: 'yellow' as GemType, count: 20 }] },
  { id: 18, name: 'Hanoi, Vietnam', moves: 20, goals: [{ type: 'purple' as GemType, count: 20 }, { type: 'orange' as GemType, count: 20 }] },
  { id: 19, name: 'Ho Chi Minh, Vietnam', moves: 19, goals: [{ type: 'pink' as GemType, count: 21 }, { type: 'cyan' as GemType, count: 21 }] },
  { id: 20, name: 'Da Nang, Vietnam', moves: 19, goals: [{ type: 'lime' as GemType, count: 21 }, { type: 'magenta' as GemType, count: 21 }] },
  { id: 21, name: 'Jakarta, Indonesia', moves: 19, goals: [{ type: 'red' as GemType, count: 22 }, { type: 'blue' as GemType, count: 22 }] },
  { id: 22, name: 'Surabaya, Indonesia', moves: 19, goals: [{ type: 'green' as GemType, count: 22 }, { type: 'yellow' as GemType, count: 22 }] },
  { id: 23, name: 'Bandung, Indonesia', moves: 18, goals: [{ type: 'purple' as GemType, count: 23 }, { type: 'orange' as GemType, count: 23 }] },
  { id: 24, name: 'Medan, Indonesia', moves: 18, goals: [{ type: 'pink' as GemType, count: 23 }, { type: 'cyan' as GemType, count: 23 }] },
  { id: 25, name: 'Cairo, Egypt', moves: 18, goals: [{ type: 'lime' as GemType, count: 24 }, { type: 'magenta' as GemType, count: 24 }] },
  { id: 26, name: 'Alexandria, Egypt', moves: 18, goals: [{ type: 'red' as GemType, count: 24 }, { type: 'blue' as GemType, count: 24 }] },
  { id: 27, name: 'Giza, Egypt', moves: 17, goals: [{ type: 'green' as GemType, count: 25 }, { type: 'yellow' as GemType, count: 25 }] },
  { id: 28, name: 'Delhi, India', moves: 17, goals: [{ type: 'purple' as GemType, count: 25 }, { type: 'orange' as GemType, count: 25 }] },
  { id: 29, name: 'Mumbai, India', moves: 17, goals: [{ type: 'pink' as GemType, count: 26 }, { type: 'cyan' as GemType, count: 26 }] },
  { id: 30, name: 'Bangalore, India', moves: 17, goals: [{ type: 'lime' as GemType, count: 26 }, { type: 'magenta' as GemType, count: 26 }] },
  
  // Levels 31-60: Medium difficulty
  { id: 31, name: 'Kolkata, India', moves: 16, goals: [{ type: 'red' as GemType, count: 27 }, { type: 'blue' as GemType, count: 27 }] },
  { id: 32, name: 'Chennai, India', moves: 16, goals: [{ type: 'green' as GemType, count: 27 }, { type: 'yellow' as GemType, count: 27 }] },
  { id: 33, name: 'Bangkok, Thailand', moves: 16, goals: [{ type: 'purple' as GemType, count: 28 }, { type: 'orange' as GemType, count: 28 }] },
  { id: 34, name: 'Pattaya, Thailand', moves: 16, goals: [{ type: 'pink' as GemType, count: 28 }, { type: 'cyan' as GemType, count: 28 }] },
  { id: 35, name: 'Chiang Mai, Thailand', moves: 15, goals: [{ type: 'lime' as GemType, count: 29 }, { type: 'magenta' as GemType, count: 29 }] },
  { id: 36, name: 'São Paulo, Brazil', moves: 15, goals: [{ type: 'red' as GemType, count: 29 }, { type: 'blue' as GemType, count: 29 }] },
  { id: 37, name: 'Rio de Janeiro, Brazil', moves: 15, goals: [{ type: 'green' as GemType, count: 30 }, { type: 'yellow' as GemType, count: 30 }] },
  { id: 38, name: 'Brasília, Brazil', moves: 15, goals: [{ type: 'purple' as GemType, count: 30 }, { type: 'orange' as GemType, count: 30 }] },
  { id: 39, name: 'Salvador, Brazil', moves: 15, goals: [{ type: 'pink' as GemType, count: 31 }, { type: 'cyan' as GemType, count: 31 }] },
  { id: 40, name: 'Mexico City, Mexico', moves: 15, goals: [{ type: 'lime' as GemType, count: 31 }, { type: 'magenta' as GemType, count: 31 }] },
  { id: 41, name: 'Guadalajara, Mexico', moves: 15, goals: [{ type: 'red' as GemType, count: 32 }, { type: 'blue' as GemType, count: 32 }] },
  { id: 42, name: 'Monterrey, Mexico', moves: 15, goals: [{ type: 'green' as GemType, count: 32 }, { type: 'yellow' as GemType, count: 32 }] },
  { id: 43, name: 'Buenos Aires, Argentina', moves: 15, goals: [{ type: 'purple' as GemType, count: 33 }, { type: 'orange' as GemType, count: 33 }] },
  { id: 44, name: 'Córdoba, Argentina', moves: 15, goals: [{ type: 'pink' as GemType, count: 33 }, { type: 'cyan' as GemType, count: 33 }] },
  { id: 45, name: 'Johannesburg, South Africa', moves: 15, goals: [{ type: 'lime' as GemType, count: 34 }, { type: 'magenta' as GemType, count: 34 }] },
  { id: 46, name: 'Cape Town, South Africa', moves: 15, goals: [{ type: 'red' as GemType, count: 34 }, { type: 'blue' as GemType, count: 34 }] },
  { id: 47, name: 'Durban, South Africa', moves: 15, goals: [{ type: 'green' as GemType, count: 35 }, { type: 'yellow' as GemType, count: 35 }] },
  { id: 48, name: 'Moscow, Russia', moves: 15, goals: [{ type: 'purple' as GemType, count: 35 }, { type: 'orange' as GemType, count: 35 }] },
  { id: 49, name: 'St Petersburg, Russia', moves: 15, goals: [{ type: 'pink' as GemType, count: 36 }, { type: 'cyan' as GemType, count: 36 }] },
  { id: 50, name: 'Warsaw, Poland', moves: 15, goals: [{ type: 'lime' as GemType, count: 36 }, { type: 'magenta' as GemType, count: 36 }] },
  { id: 51, name: 'Krakow, Poland', moves: 15, goals: [{ type: 'red' as GemType, count: 37 }, { type: 'blue' as GemType, count: 37 }] },
  { id: 52, name: 'Madrid, Spain', moves: 15, goals: [{ type: 'green' as GemType, count: 37 }, { type: 'yellow' as GemType, count: 37 }] },
  { id: 53, name: 'Barcelona, Spain', moves: 15, goals: [{ type: 'purple' as GemType, count: 38 }, { type: 'orange' as GemType, count: 38 }] },
  { id: 54, name: 'Valencia, Spain', moves: 15, goals: [{ type: 'pink' as GemType, count: 38 }, { type: 'cyan' as GemType, count: 38 }] },
  { id: 55, name: 'Seville, Spain', moves: 15, goals: [{ type: 'lime' as GemType, count: 39 }, { type: 'magenta' as GemType, count: 39 }] },
  { id: 56, name: 'Rome, Italy', moves: 15, goals: [{ type: 'red' as GemType, count: 39 }, { type: 'blue' as GemType, count: 39 }] },
  { id: 57, name: 'Milan, Italy', moves: 15, goals: [{ type: 'green' as GemType, count: 40 }, { type: 'yellow' as GemType, count: 40 }] },
  { id: 58, name: 'Naples, Italy', moves: 15, goals: [{ type: 'purple' as GemType, count: 40 }, { type: 'orange' as GemType, count: 40 }] },
  { id: 59, name: 'Florence, Italy', moves: 15, goals: [{ type: 'pink' as GemType, count: 41 }, { type: 'cyan' as GemType, count: 41 }] },
  { id: 60, name: 'Venice, Italy', moves: 15, goals: [{ type: 'lime' as GemType, count: 41 }, { type: 'magenta' as GemType, count: 41 }] },
  
  // Levels 61-100: Getting challenging
  { id: 61, name: 'Paris, France', moves: 15, goals: [{ type: 'red' as GemType, count: 42 }, { type: 'blue' as GemType, count: 42 }] },
  { id: 62, name: 'Lyon, France', moves: 15, goals: [{ type: 'green' as GemType, count: 42 }, { type: 'yellow' as GemType, count: 42 }] },
  { id: 63, name: 'Marseille, France', moves: 15, goals: [{ type: 'purple' as GemType, count: 43 }, { type: 'orange' as GemType, count: 43 }] },
  { id: 64, name: 'Nice, France', moves: 15, goals: [{ type: 'pink' as GemType, count: 43 }, { type: 'cyan' as GemType, count: 43 }] },
  { id: 65, name: 'London, UK', moves: 15, goals: [{ type: 'lime' as GemType, count: 44 }, { type: 'magenta' as GemType, count: 44 }] },
  { id: 66, name: 'Manchester, UK', moves: 15, goals: [{ type: 'red' as GemType, count: 44 }, { type: 'blue' as GemType, count: 44 }] },
  { id: 67, name: 'Birmingham, UK', moves: 15, goals: [{ type: 'green' as GemType, count: 45 }, { type: 'yellow' as GemType, count: 45 }] },
  { id: 68, name: 'Liverpool, UK', moves: 15, goals: [{ type: 'purple' as GemType, count: 45 }, { type: 'orange' as GemType, count: 45 }] },
  { id: 69, name: 'Toronto, Canada', moves: 15, goals: [{ type: 'pink' as GemType, count: 46 }, { type: 'cyan' as GemType, count: 46 }] },
  { id: 70, name: 'Montreal, Canada', moves: 15, goals: [{ type: 'lime' as GemType, count: 46 }, { type: 'magenta' as GemType, count: 46 }] },
  { id: 71, name: 'Vancouver, Canada', moves: 14, goals: [{ type: 'red' as GemType, count: 47 }, { type: 'blue' as GemType, count: 47 }] },
  { id: 72, name: 'Berlin, Germany', moves: 14, goals: [{ type: 'green' as GemType, count: 47 }, { type: 'yellow' as GemType, count: 47 }] },
  { id: 73, name: 'Munich, Germany', moves: 14, goals: [{ type: 'purple' as GemType, count: 48 }, { type: 'orange' as GemType, count: 48 }] },
  { id: 74, name: 'Hamburg, Germany', moves: 14, goals: [{ type: 'pink' as GemType, count: 48 }, { type: 'cyan' as GemType, count: 48 }] },
  { id: 75, name: 'Frankfurt, Germany', moves: 14, goals: [{ type: 'lime' as GemType, count: 49 }, { type: 'magenta' as GemType, count: 49 }] },
  { id: 76, name: 'Tokyo, Japan', moves: 14, goals: [{ type: 'red' as GemType, count: 49 }, { type: 'blue' as GemType, count: 49 }] },
  { id: 77, name: 'Osaka, Japan', moves: 14, goals: [{ type: 'green' as GemType, count: 50 }, { type: 'yellow' as GemType, count: 50 }] },
  { id: 78, name: 'Kyoto, Japan', moves: 14, goals: [{ type: 'purple' as GemType, count: 50 }, { type: 'orange' as GemType, count: 50 }] },
  { id: 79, name: 'Yokohama, Japan', moves: 14, goals: [{ type: 'pink' as GemType, count: 51 }, { type: 'cyan' as GemType, count: 51 }] },
  { id: 80, name: 'Seoul, South Korea', moves: 14, goals: [{ type: 'lime' as GemType, count: 51 }, { type: 'magenta' as GemType, count: 51 }] },
  { id: 81, name: 'Busan, South Korea', moves: 14, goals: [{ type: 'red' as GemType, count: 52 }, { type: 'blue' as GemType, count: 52 }] },
  { id: 82, name: 'Sydney, Australia', moves: 14, goals: [{ type: 'green' as GemType, count: 52 }, { type: 'yellow' as GemType, count: 52 }] },
  { id: 83, name: 'Melbourne, Australia', moves: 14, goals: [{ type: 'purple' as GemType, count: 53 }, { type: 'orange' as GemType, count: 53 }] },
  { id: 84, name: 'Brisbane, Australia', moves: 14, goals: [{ type: 'pink' as GemType, count: 53 }, { type: 'cyan' as GemType, count: 53 }] },
  { id: 85, name: 'Perth, Australia', moves: 14, goals: [{ type: 'lime' as GemType, count: 54 }, { type: 'magenta' as GemType, count: 54 }] },
  { id: 86, name: 'Auckland, New Zealand', moves: 14, goals: [{ type: 'red' as GemType, count: 54 }, { type: 'blue' as GemType, count: 54 }] },
  { id: 87, name: 'Wellington, New Zealand', moves: 14, goals: [{ type: 'green' as GemType, count: 55 }, { type: 'yellow' as GemType, count: 55 }] },
  { id: 88, name: 'Beijing, China', moves: 14, goals: [{ type: 'purple' as GemType, count: 55 }, { type: 'orange' as GemType, count: 55 }] },
  { id: 89, name: 'Shanghai, China', moves: 14, goals: [{ type: 'pink' as GemType, count: 56 }, { type: 'cyan' as GemType, count: 56 }] },
  { id: 90, name: 'Guangzhou, China', moves: 14, goals: [{ type: 'lime' as GemType, count: 56 }, { type: 'magenta' as GemType, count: 56 }] },
  { id: 91, name: 'Shenzhen, China', moves: 14, goals: [{ type: 'red' as GemType, count: 57 }, { type: 'blue' as GemType, count: 57 }] },
  { id: 92, name: 'Hong Kong, China', moves: 14, goals: [{ type: 'green' as GemType, count: 57 }, { type: 'yellow' as GemType, count: 57 }] },
  { id: 93, name: 'Singapore', moves: 13, goals: [{ type: 'purple' as GemType, count: 58 }, { type: 'orange' as GemType, count: 58 }] },
  { id: 94, name: 'Kuala Lumpur, Malaysia', moves: 13, goals: [{ type: 'pink' as GemType, count: 58 }, { type: 'cyan' as GemType, count: 58 }] },
  { id: 95, name: 'Dubai, UAE', moves: 13, goals: [{ type: 'lime' as GemType, count: 59 }, { type: 'magenta' as GemType, count: 59 }] },
  { id: 96, name: 'Abu Dhabi, UAE', moves: 13, goals: [{ type: 'red' as GemType, count: 59 }, { type: 'blue' as GemType, count: 59 }] },
  { id: 97, name: 'Riyadh, Saudi Arabia', moves: 13, goals: [{ type: 'green' as GemType, count: 60 }, { type: 'yellow' as GemType, count: 60 }] },
  { id: 98, name: 'Jeddah, Saudi Arabia', moves: 13, goals: [{ type: 'purple' as GemType, count: 60 }, { type: 'orange' as GemType, count: 60 }] },
  { id: 99, name: 'Tel Aviv, Israel', moves: 13, goals: [{ type: 'pink' as GemType, count: 61 }, { type: 'cyan' as GemType, count: 61 }] },
  { id: 100, name: 'Jerusalem, Israel', moves: 13, goals: [{ type: 'lime' as GemType, count: 61 }, { type: 'magenta' as GemType, count: 61 }] },
  
  // Levels 101-150: Hard
  { id: 101, name: 'Beirut, Lebanon', moves: 13, goals: [{ type: 'red' as GemType, count: 62 }, { type: 'blue' as GemType, count: 62 }] },
  { id: 102, name: 'Amman, Jordan', moves: 13, goals: [{ type: 'green' as GemType, count: 62 }, { type: 'yellow' as GemType, count: 62 }] },
  { id: 103, name: 'Doha, Qatar', moves: 13, goals: [{ type: 'purple' as GemType, count: 63 }, { type: 'orange' as GemType, count: 63 }] },
  { id: 104, name: 'Kuwait City, Kuwait', moves: 13, goals: [{ type: 'pink' as GemType, count: 63 }, { type: 'cyan' as GemType, count: 63 }] },
  { id: 105, name: 'New York, USA', moves: 13, goals: [{ type: 'lime' as GemType, count: 64 }, { type: 'magenta' as GemType, count: 64 }] },
  { id: 106, name: 'Los Angeles, USA', moves: 13, goals: [{ type: 'red' as GemType, count: 64 }, { type: 'blue' as GemType, count: 64 }] },
  { id: 107, name: 'Chicago, USA', moves: 13, goals: [{ type: 'green' as GemType, count: 65 }, { type: 'yellow' as GemType, count: 65 }] },
  { id: 108, name: 'Houston, USA', moves: 13, goals: [{ type: 'purple' as GemType, count: 65 }, { type: 'orange' as GemType, count: 65 }] },
  { id: 109, name: 'Miami, USA', moves: 13, goals: [{ type: 'pink' as GemType, count: 66 }, { type: 'cyan' as GemType, count: 66 }] },
  { id: 110, name: 'San Francisco, USA', moves: 13, goals: [{ type: 'lime' as GemType, count: 66 }, { type: 'magenta' as GemType, count: 66 }] },
  { id: 111, name: 'Las Vegas, USA', moves: 12, goals: [{ type: 'red' as GemType, count: 67 }, { type: 'blue' as GemType, count: 67 }] },
  { id: 112, name: 'Boston, USA', moves: 12, goals: [{ type: 'green' as GemType, count: 67 }, { type: 'yellow' as GemType, count: 67 }] },
  { id: 113, name: 'Seattle, USA', moves: 12, goals: [{ type: 'purple' as GemType, count: 68 }, { type: 'orange' as GemType, count: 68 }] },
  { id: 114, name: 'Washington DC, USA', moves: 12, goals: [{ type: 'pink' as GemType, count: 68 }, { type: 'cyan' as GemType, count: 68 }] },
  { id: 115, name: 'Zurich, Switzerland', moves: 12, goals: [{ type: 'lime' as GemType, count: 69 }, { type: 'magenta' as GemType, count: 69 }] },
  { id: 116, name: 'Geneva, Switzerland', moves: 12, goals: [{ type: 'red' as GemType, count: 69 }, { type: 'blue' as GemType, count: 69 }] },
  { id: 117, name: 'Vienna, Austria', moves: 12, goals: [{ type: 'green' as GemType, count: 70 }, { type: 'yellow' as GemType, count: 70 }] },
  { id: 118, name: 'Salzburg, Austria', moves: 12, goals: [{ type: 'purple' as GemType, count: 70 }, { type: 'orange' as GemType, count: 70 }] },
  { id: 119, name: 'Brussels, Belgium', moves: 12, goals: [{ type: 'pink' as GemType, count: 71 }, { type: 'cyan' as GemType, count: 71 }] },
  { id: 120, name: 'Amsterdam, Netherlands', moves: 12, goals: [{ type: 'lime' as GemType, count: 71 }, { type: 'magenta' as GemType, count: 71 }] },
  { id: 121, name: 'Rotterdam, Netherlands', moves: 12, goals: [{ type: 'red' as GemType, count: 72 }, { type: 'blue' as GemType, count: 72 }] },
  { id: 122, name: 'Copenhagen, Denmark', moves: 12, goals: [{ type: 'green' as GemType, count: 72 }, { type: 'yellow' as GemType, count: 72 }] },
  { id: 123, name: 'Stockholm, Sweden', moves: 12, goals: [{ type: 'purple' as GemType, count: 73 }, { type: 'orange' as GemType, count: 73 }] },
  { id: 124, name: 'Gothenburg, Sweden', moves: 12, goals: [{ type: 'pink' as GemType, count: 73 }, { type: 'cyan' as GemType, count: 73 }] },
  { id: 125, name: 'Oslo, Norway', moves: 12, goals: [{ type: 'lime' as GemType, count: 74 }, { type: 'magenta' as GemType, count: 74 }] },
  { id: 126, name: 'Helsinki, Finland', moves: 12, goals: [{ type: 'red' as GemType, count: 74 }, { type: 'blue' as GemType, count: 74 }] },
  { id: 127, name: 'Dublin, Ireland', moves: 12, goals: [{ type: 'green' as GemType, count: 75 }, { type: 'yellow' as GemType, count: 75 }] },
  { id: 128, name: 'Lisbon, Portugal', moves: 12, goals: [{ type: 'purple' as GemType, count: 75 }, { type: 'orange' as GemType, count: 75 }] },
  { id: 129, name: 'Porto, Portugal', moves: 12, goals: [{ type: 'pink' as GemType, count: 76 }, { type: 'cyan' as GemType, count: 76 }] },
  { id: 130, name: 'Athens, Greece', moves: 12, goals: [{ type: 'lime' as GemType, count: 76 }, { type: 'magenta' as GemType, count: 76 }] },
  { id: 131, name: 'Zagreb, Croatia', moves: 12, goals: [{ type: 'red' as GemType, count: 77 }, { type: 'blue' as GemType, count: 77 }] },
  { id: 132, name: 'Dubrovnik, Croatia', moves: 12, goals: [{ type: 'green' as GemType, count: 77 }, { type: 'yellow' as GemType, count: 77 }] },
  { id: 133, name: 'Belgrade, Serbia', moves: 12, goals: [{ type: 'purple' as GemType, count: 78 }, { type: 'orange' as GemType, count: 78 }] },
  { id: 134, name: 'Sofia, Bulgaria', moves: 12, goals: [{ type: 'pink' as GemType, count: 78 }, { type: 'cyan' as GemType, count: 78 }] },
  { id: 135, name: 'Bucharest, Romania', moves: 12, goals: [{ type: 'lime' as GemType, count: 79 }, { type: 'magenta' as GemType, count: 79 }] },
  { id: 136, name: 'Iași, Romania', moves: 12, goals: [{ type: 'red' as GemType, count: 79 }, { type: 'blue' as GemType, count: 79 }] },
  { id: 137, name: 'Botoșani, Romania', moves: 12, goals: [{ type: 'green' as GemType, count: 80 }, { type: 'yellow' as GemType, count: 80 }] },
  { id: 138, name: 'Budapest, Hungary', moves: 12, goals: [{ type: 'purple' as GemType, count: 80 }, { type: 'orange' as GemType, count: 80 }] },
  { id: 139, name: 'Prague, Czech Republic', moves: 12, goals: [{ type: 'pink' as GemType, count: 81 }, { type: 'cyan' as GemType, count: 81 }] },
  { id: 140, name: 'Kyiv, Ukraine', moves: 12, goals: [{ type: 'lime' as GemType, count: 81 }, { type: 'magenta' as GemType, count: 81 }] },
  { id: 141, name: 'Odessa, Ukraine', moves: 12, goals: [{ type: 'red' as GemType, count: 82 }, { type: 'blue' as GemType, count: 82 }] },
  { id: 142, name: 'Tbilisi, Georgia', moves: 12, goals: [{ type: 'green' as GemType, count: 82 }, { type: 'yellow' as GemType, count: 82 }] },
  { id: 143, name: 'Yerevan, Armenia', moves: 12, goals: [{ type: 'purple' as GemType, count: 83 }, { type: 'orange' as GemType, count: 83 }] },
  { id: 144, name: 'Baku, Azerbaijan', moves: 12, goals: [{ type: 'pink' as GemType, count: 83 }, { type: 'cyan' as GemType, count: 83 }] },
  { id: 145, name: 'Almaty, Kazakhstan', moves: 12, goals: [{ type: 'lime' as GemType, count: 84 }, { type: 'magenta' as GemType, count: 84 }] },
  { id: 146, name: 'Tashkent, Uzbekistan', moves: 12, goals: [{ type: 'red' as GemType, count: 84 }, { type: 'blue' as GemType, count: 84 }] },
  { id: 147, name: 'Samarkand, Uzbekistan', moves: 12, goals: [{ type: 'green' as GemType, count: 85 }, { type: 'yellow' as GemType, count: 85 }] },
  { id: 148, name: 'Tehran, Iran', moves: 12, goals: [{ type: 'purple' as GemType, count: 85 }, { type: 'orange' as GemType, count: 85 }] },
  { id: 149, name: 'Isfahan, Iran', moves: 12, goals: [{ type: 'pink' as GemType, count: 86 }, { type: 'cyan' as GemType, count: 86 }] },
  { id: 150, name: 'Baghdad, Iraq', moves: 12, goals: [{ type: 'lime' as GemType, count: 86 }, { type: 'magenta' as GemType, count: 86 }] },
  
  // Levels 151-178: Very Hard
  { id: 151, name: 'Damascus, Syria', moves: 12, goals: [{ type: 'red' as GemType, count: 87 }, { type: 'blue' as GemType, count: 87 }] },
  { id: 152, name: 'Bogotá, Colombia', moves: 12, goals: [{ type: 'green' as GemType, count: 87 }, { type: 'yellow' as GemType, count: 87 }] },
  { id: 153, name: 'Medellín, Colombia', moves: 12, goals: [{ type: 'purple' as GemType, count: 88 }, { type: 'orange' as GemType, count: 88 }] },
  { id: 154, name: 'Lima, Peru', moves: 12, goals: [{ type: 'pink' as GemType, count: 88 }, { type: 'cyan' as GemType, count: 88 }] },
  { id: 155, name: 'Cusco, Peru', moves: 12, goals: [{ type: 'lime' as GemType, count: 89 }, { type: 'magenta' as GemType, count: 89 }] },
  { id: 156, name: 'Santiago, Chile', moves: 12, goals: [{ type: 'red' as GemType, count: 89 }, { type: 'blue' as GemType, count: 89 }] },
  { id: 157, name: 'Caracas, Venezuela', moves: 12, goals: [{ type: 'green' as GemType, count: 90 }, { type: 'yellow' as GemType, count: 90 }] },
  { id: 158, name: 'Quito, Ecuador', moves: 12, goals: [{ type: 'purple' as GemType, count: 90 }, { type: 'orange' as GemType, count: 90 }] },
  { id: 159, name: 'La Paz, Bolivia', moves: 12, goals: [{ type: 'pink' as GemType, count: 91 }, { type: 'cyan' as GemType, count: 91 }] },
  { id: 160, name: 'Lagos, Nigeria', moves: 12, goals: [{ type: 'lime' as GemType, count: 91 }, { type: 'magenta' as GemType, count: 91 }] },
  { id: 161, name: 'Accra, Ghana', moves: 12, goals: [{ type: 'red' as GemType, count: 92 }, { type: 'blue' as GemType, count: 92 }] },
  { id: 162, name: 'Casablanca, Morocco', moves: 12, goals: [{ type: 'green' as GemType, count: 92 }, { type: 'yellow' as GemType, count: 92 }] },
  { id: 163, name: 'Marrakech, Morocco', moves: 12, goals: [{ type: 'purple' as GemType, count: 93 }, { type: 'orange' as GemType, count: 93 }] },
  { id: 164, name: 'Tunis, Tunisia', moves: 12, goals: [{ type: 'pink' as GemType, count: 93 }, { type: 'cyan' as GemType, count: 93 }] },
  { id: 165, name: 'Algiers, Algeria', moves: 12, goals: [{ type: 'lime' as GemType, count: 94 }, { type: 'magenta' as GemType, count: 94 }] },
  { id: 166, name: 'Colombo, Sri Lanka', moves: 12, goals: [{ type: 'red' as GemType, count: 94 }, { type: 'blue' as GemType, count: 94 }] },
  { id: 167, name: 'Yangon, Myanmar', moves: 12, goals: [{ type: 'green' as GemType, count: 95 }, { type: 'yellow' as GemType, count: 95 }] },
  { id: 168, name: 'Phnom Penh, Cambodia', moves: 12, goals: [{ type: 'purple' as GemType, count: 95 }, { type: 'orange' as GemType, count: 95 }] },
  { id: 169, name: 'Vientiane, Laos', moves: 12, goals: [{ type: 'pink' as GemType, count: 96 }, { type: 'cyan' as GemType, count: 96 }] },
  { id: 170, name: 'Ulaanbaatar, Mongolia', moves: 12, goals: [{ type: 'lime' as GemType, count: 96 }, { type: 'magenta' as GemType, count: 96 }] },
  { id: 171, name: 'Taipei, Taiwan', moves: 12, goals: [{ type: 'red' as GemType, count: 97 }, { type: 'blue' as GemType, count: 97 }] },
  { id: 172, name: 'Havana, Cuba', moves: 12, goals: [{ type: 'green' as GemType, count: 97 }, { type: 'yellow' as GemType, count: 97 }] },
  { id: 173, name: 'Santo Domingo, Dominican Rep.', moves: 12, goals: [{ type: 'purple' as GemType, count: 98 }, { type: 'orange' as GemType, count: 98 }] },
  { id: 174, name: 'Kingston, Jamaica', moves: 12, goals: [{ type: 'pink' as GemType, count: 98 }, { type: 'cyan' as GemType, count: 98 }] },
  { id: 175, name: 'Panama City, Panama', moves: 12, goals: [{ type: 'lime' as GemType, count: 99 }, { type: 'magenta' as GemType, count: 99 }] },
  { id: 176, name: 'San José, Costa Rica', moves: 12, goals: [{ type: 'red' as GemType, count: 99 }, { type: 'blue' as GemType, count: 99 }] },
  { id: 177, name: 'Guatemala City, Guatemala', moves: 12, goals: [{ type: 'green' as GemType, count: 100 }, { type: 'yellow' as GemType, count: 100 }] },
  { id: 178, name: 'Tegucigalpa, Honduras', moves: 12, goals: [{ type: 'purple' as GemType, count: 100 }, { type: 'orange' as GemType, count: 100 }] },
  
  // Levels 179-200: Turkish Cities - Expert Level
  { id: 179, name: 'Istanbul, Turkey', moves: 12, goals: [{ type: 'pink' as GemType, count: 101 }, { type: 'cyan' as GemType, count: 101 }] },
  { id: 180, name: 'Ankara, Turkey', moves: 12, goals: [{ type: 'lime' as GemType, count: 101 }, { type: 'magenta' as GemType, count: 101 }] },
  { id: 181, name: 'Izmir, Turkey', moves: 12, goals: [{ type: 'red' as GemType, count: 102 }, { type: 'blue' as GemType, count: 102 }] },
  { id: 182, name: 'Antalya, Turkey', moves: 12, goals: [{ type: 'green' as GemType, count: 102 }, { type: 'yellow' as GemType, count: 102 }] },
  { id: 183, name: 'Bursa, Turkey', moves: 12, goals: [{ type: 'purple' as GemType, count: 103 }, { type: 'orange' as GemType, count: 103 }] },
  { id: 184, name: 'Adana, Turkey', moves: 12, goals: [{ type: 'pink' as GemType, count: 103 }, { type: 'cyan' as GemType, count: 103 }] },
  { id: 185, name: 'Gaziantep, Turkey', moves: 12, goals: [{ type: 'lime' as GemType, count: 104 }, { type: 'magenta' as GemType, count: 104 }] },
  { id: 186, name: 'Konya, Turkey', moves: 12, goals: [{ type: 'red' as GemType, count: 104 }, { type: 'blue' as GemType, count: 104 }] },
  { id: 187, name: 'Kayseri, Turkey', moves: 12, goals: [{ type: 'green' as GemType, count: 105 }, { type: 'yellow' as GemType, count: 105 }] },
  { id: 188, name: 'Diyarbakır, Turkey', moves: 12, goals: [{ type: 'purple' as GemType, count: 105 }, { type: 'orange' as GemType, count: 105 }] },
  { id: 189, name: 'Mersin, Turkey', moves: 12, goals: [{ type: 'pink' as GemType, count: 106 }, { type: 'cyan' as GemType, count: 106 }] },
  { id: 190, name: 'Eskişehir, Turkey', moves: 12, goals: [{ type: 'lime' as GemType, count: 106 }, { type: 'magenta' as GemType, count: 106 }] },
  { id: 191, name: 'Samsun, Turkey', moves: 12, goals: [{ type: 'red' as GemType, count: 107 }, { type: 'blue' as GemType, count: 107 }] },
  { id: 192, name: 'Denizli, Turkey', moves: 12, goals: [{ type: 'green' as GemType, count: 107 }, { type: 'yellow' as GemType, count: 107 }] },
  { id: 193, name: 'Trabzon, Turkey', moves: 12, goals: [{ type: 'purple' as GemType, count: 108 }, { type: 'orange' as GemType, count: 108 }] },
  { id: 194, name: 'Malatya, Turkey', moves: 12, goals: [{ type: 'pink' as GemType, count: 108 }, { type: 'cyan' as GemType, count: 108 }] },
  { id: 195, name: 'Erzurum, Turkey', moves: 12, goals: [{ type: 'lime' as GemType, count: 109 }, { type: 'magenta' as GemType, count: 109 }] },
  { id: 196, name: 'Burdur, Turkey', moves: 12, goals: [{ type: 'red' as GemType, count: 109 }, { type: 'blue' as GemType, count: 109 }] },
  { id: 197, name: 'Kocaeli, Turkey', moves: 12, goals: [{ type: 'green' as GemType, count: 110 }, { type: 'yellow' as GemType, count: 110 }] },
  { id: 198, name: 'Hatay, Turkey', moves: 12, goals: [{ type: 'purple' as GemType, count: 110 }, { type: 'orange' as GemType, count: 110 }] },
  { id: 199, name: 'Bodrum, Turkey', moves: 12, goals: [{ type: 'pink' as GemType, count: 111 }, { type: 'cyan' as GemType, count: 111 }] },
  { id: 200, name: 'Van, Turkey', moves: 12, goals: [{ type: 'lime' as GemType, count: 111 }, { type: 'magenta' as GemType, count: 111 }] },
  
  // Levels 201-250: Even harder challenges
  { id: 201, name: 'Edinburgh, UK', moves: 12, goals: [{ type: 'red' as GemType, count: 112 }, { type: 'blue' as GemType, count: 112 }] },
  { id: 202, name: 'Glasgow, UK', moves: 12, goals: [{ type: 'green' as GemType, count: 112 }, { type: 'yellow' as GemType, count: 112 }] },
  { id: 203, name: 'Leeds, UK', moves: 11, goals: [{ type: 'purple' as GemType, count: 113 }, { type: 'orange' as GemType, count: 113 }] },
  { id: 204, name: 'Bristol, UK', moves: 11, goals: [{ type: 'pink' as GemType, count: 113 }, { type: 'cyan' as GemType, count: 113 }] },
  { id: 205, name: 'Lyon, France', moves: 11, goals: [{ type: 'lime' as GemType, count: 114 }, { type: 'magenta' as GemType, count: 114 }] },
  { id: 206, name: 'Toulouse, France', moves: 11, goals: [{ type: 'red' as GemType, count: 114 }, { type: 'blue' as GemType, count: 114 }] },
  { id: 207, name: 'Bordeaux, France', moves: 11, goals: [{ type: 'green' as GemType, count: 115 }, { type: 'yellow' as GemType, count: 115 }] },
  { id: 208, name: 'Strasbourg, France', moves: 11, goals: [{ type: 'purple' as GemType, count: 115 }, { type: 'orange' as GemType, count: 115 }] },
  { id: 209, name: 'Turin, Italy', moves: 11, goals: [{ type: 'pink' as GemType, count: 116 }, { type: 'cyan' as GemType, count: 116 }] },
  { id: 210, name: 'Palermo, Italy', moves: 11, goals: [{ type: 'lime' as GemType, count: 116 }, { type: 'magenta' as GemType, count: 116 }] },
  { id: 211, name: 'Genoa, Italy', moves: 11, goals: [{ type: 'red' as GemType, count: 117 }, { type: 'blue' as GemType, count: 117 }] },
  { id: 212, name: 'Bologna, Italy', moves: 11, goals: [{ type: 'green' as GemType, count: 117 }, { type: 'yellow' as GemType, count: 117 }] },
  { id: 213, name: 'Stuttgart, Germany', moves: 11, goals: [{ type: 'purple' as GemType, count: 118 }, { type: 'orange' as GemType, count: 118 }] },
  { id: 214, name: 'Cologne, Germany', moves: 11, goals: [{ type: 'pink' as GemType, count: 118 }, { type: 'cyan' as GemType, count: 118 }] },
  { id: 215, name: 'Düsseldorf, Germany', moves: 11, goals: [{ type: 'lime' as GemType, count: 119 }, { type: 'magenta' as GemType, count: 119 }] },
  { id: 216, name: 'Dresden, Germany', moves: 11, goals: [{ type: 'red' as GemType, count: 119 }, { type: 'blue' as GemType, count: 119 }] },
  { id: 217, name: 'Nagoya, Japan', moves: 11, goals: [{ type: 'green' as GemType, count: 120 }, { type: 'yellow' as GemType, count: 120 }] },
  { id: 218, name: 'Sapporo, Japan', moves: 11, goals: [{ type: 'purple' as GemType, count: 120 }, { type: 'orange' as GemType, count: 120 }] },
  { id: 219, name: 'Fukuoka, Japan', moves: 11, goals: [{ type: 'pink' as GemType, count: 121 }, { type: 'cyan' as GemType, count: 121 }] },
  { id: 220, name: 'Kobe, Japan', moves: 11, goals: [{ type: 'lime' as GemType, count: 121 }, { type: 'magenta' as GemType, count: 121 }] },
  { id: 221, name: 'Incheon, South Korea', moves: 11, goals: [{ type: 'red' as GemType, count: 122 }, { type: 'blue' as GemType, count: 122 }] },
  { id: 222, name: 'Daegu, South Korea', moves: 11, goals: [{ type: 'green' as GemType, count: 122 }, { type: 'yellow' as GemType, count: 122 }] },
  { id: 223, name: 'Adelaide, Australia', moves: 11, goals: [{ type: 'purple' as GemType, count: 123 }, { type: 'orange' as GemType, count: 123 }] },
  { id: 224, name: 'Gold Coast, Australia', moves: 11, goals: [{ type: 'pink' as GemType, count: 123 }, { type: 'cyan' as GemType, count: 123 }] },
  { id: 225, name: 'Canberra, Australia', moves: 11, goals: [{ type: 'lime' as GemType, count: 124 }, { type: 'magenta' as GemType, count: 124 }] },
  { id: 226, name: 'Chengdu, China', moves: 11, goals: [{ type: 'red' as GemType, count: 124 }, { type: 'blue' as GemType, count: 124 }] },
  { id: 227, name: 'Chongqing, China', moves: 11, goals: [{ type: 'green' as GemType, count: 125 }, { type: 'yellow' as GemType, count: 125 }] },
  { id: 228, name: 'Tianjin, China', moves: 11, goals: [{ type: 'purple' as GemType, count: 125 }, { type: 'orange' as GemType, count: 125 }] },
  { id: 229, name: 'Wuhan, China', moves: 11, goals: [{ type: 'pink' as GemType, count: 126 }, { type: 'cyan' as GemType, count: 126 }] },
  { id: 230, name: 'Xian, China', moves: 11, goals: [{ type: 'lime' as GemType, count: 126 }, { type: 'magenta' as GemType, count: 126 }] },
  { id: 231, name: 'Nanjing, China', moves: 11, goals: [{ type: 'red' as GemType, count: 127 }, { type: 'blue' as GemType, count: 127 }] },
  { id: 232, name: 'Hangzhou, China', moves: 11, goals: [{ type: 'green' as GemType, count: 127 }, { type: 'yellow' as GemType, count: 127 }] },
  { id: 233, name: 'Philadelphia, USA', moves: 11, goals: [{ type: 'purple' as GemType, count: 128 }, { type: 'orange' as GemType, count: 128 }] },
  { id: 234, name: 'Phoenix, USA', moves: 11, goals: [{ type: 'pink' as GemType, count: 128 }, { type: 'cyan' as GemType, count: 128 }] },
  { id: 235, name: 'San Diego, USA', moves: 11, goals: [{ type: 'lime' as GemType, count: 129 }, { type: 'magenta' as GemType, count: 129 }] },
  { id: 236, name: 'Dallas, USA', moves: 11, goals: [{ type: 'red' as GemType, count: 129 }, { type: 'blue' as GemType, count: 129 }] },
  { id: 237, name: 'San Antonio, USA', moves: 11, goals: [{ type: 'green' as GemType, count: 130 }, { type: 'yellow' as GemType, count: 130 }] },
  { id: 238, name: 'Austin, USA', moves: 11, goals: [{ type: 'purple' as GemType, count: 130 }, { type: 'orange' as GemType, count: 130 }] },
  { id: 239, name: 'Jacksonville, USA', moves: 11, goals: [{ type: 'pink' as GemType, count: 131 }, { type: 'cyan' as GemType, count: 131 }] },
  { id: 240, name: 'Columbus, USA', moves: 11, goals: [{ type: 'lime' as GemType, count: 131 }, { type: 'magenta' as GemType, count: 131 }] },
  { id: 241, name: 'Charlotte, USA', moves: 11, goals: [{ type: 'red' as GemType, count: 132 }, { type: 'blue' as GemType, count: 132 }] },
  { id: 242, name: 'Denver, USA', moves: 11, goals: [{ type: 'green' as GemType, count: 132 }, { type: 'yellow' as GemType, count: 132 }] },
  { id: 243, name: 'Portland, USA', moves: 11, goals: [{ type: 'purple' as GemType, count: 133 }, { type: 'orange' as GemType, count: 133 }] },
  { id: 244, name: 'Nashville, USA', moves: 11, goals: [{ type: 'pink' as GemType, count: 133 }, { type: 'cyan' as GemType, count: 133 }] },
  { id: 245, name: 'Detroit, USA', moves: 11, goals: [{ type: 'lime' as GemType, count: 134 }, { type: 'magenta' as GemType, count: 134 }] },
  { id: 246, name: 'Minneapolis, USA', moves: 11, goals: [{ type: 'red' as GemType, count: 134 }, { type: 'blue' as GemType, count: 134 }] },
  { id: 247, name: 'Atlanta, USA', moves: 11, goals: [{ type: 'green' as GemType, count: 135 }, { type: 'yellow' as GemType, count: 135 }] },
  { id: 248, name: 'Tampa, USA', moves: 11, goals: [{ type: 'purple' as GemType, count: 135 }, { type: 'orange' as GemType, count: 135 }] },
  { id: 249, name: 'New Orleans, USA', moves: 11, goals: [{ type: 'pink' as GemType, count: 136 }, { type: 'cyan' as GemType, count: 136 }] },
  { id: 250, name: 'Salt Lake City, USA', moves: 11, goals: [{ type: 'lime' as GemType, count: 136 }, { type: 'magenta' as GemType, count: 136 }] },
  
  // Levels 251-300: Extreme difficulty
  { id: 251, name: 'Calgary, Canada', moves: 11, goals: [{ type: 'red' as GemType, count: 137 }, { type: 'blue' as GemType, count: 137 }] },
  { id: 252, name: 'Ottawa, Canada', moves: 11, goals: [{ type: 'green' as GemType, count: 137 }, { type: 'yellow' as GemType, count: 137 }] },
  { id: 253, name: 'Edmonton, Canada', moves: 10, goals: [{ type: 'purple' as GemType, count: 138 }, { type: 'orange' as GemType, count: 138 }] },
  { id: 254, name: 'Quebec City, Canada', moves: 10, goals: [{ type: 'pink' as GemType, count: 138 }, { type: 'cyan' as GemType, count: 138 }] },
  { id: 255, name: 'Winnipeg, Canada', moves: 10, goals: [{ type: 'lime' as GemType, count: 139 }, { type: 'magenta' as GemType, count: 139 }] },
  { id: 256, name: 'Milan, Italy', moves: 10, goals: [{ type: 'red' as GemType, count: 139 }, { type: 'blue' as GemType, count: 139 }] },
  { id: 257, name: 'Lyon, France', moves: 10, goals: [{ type: 'green' as GemType, count: 140 }, { type: 'yellow' as GemType, count: 140 }] },
  { id: 258, name: 'Leipzig, Germany', moves: 10, goals: [{ type: 'purple' as GemType, count: 140 }, { type: 'orange' as GemType, count: 140 }] },
  { id: 259, name: 'Bilbao, Spain', moves: 10, goals: [{ type: 'pink' as GemType, count: 141 }, { type: 'cyan' as GemType, count: 141 }] },
  { id: 260, name: 'Malaga, Spain', moves: 10, goals: [{ type: 'lime' as GemType, count: 141 }, { type: 'magenta' as GemType, count: 141 }] },
  { id: 261, name: 'Thessaloniki, Greece', moves: 10, goals: [{ type: 'red' as GemType, count: 142 }, { type: 'blue' as GemType, count: 142 }] },
  { id: 262, name: 'Split, Croatia', moves: 10, goals: [{ type: 'green' as GemType, count: 142 }, { type: 'yellow' as GemType, count: 142 }] },
  { id: 263, name: 'Vilnius, Lithuania', moves: 10, goals: [{ type: 'purple' as GemType, count: 143 }, { type: 'orange' as GemType, count: 143 }] },
  { id: 264, name: 'Riga, Latvia', moves: 10, goals: [{ type: 'pink' as GemType, count: 143 }, { type: 'cyan' as GemType, count: 143 }] },
  { id: 265, name: 'Tallinn, Estonia', moves: 10, goals: [{ type: 'lime' as GemType, count: 144 }, { type: 'magenta' as GemType, count: 144 }] },
  { id: 266, name: 'Bratislava, Slovakia', moves: 10, goals: [{ type: 'red' as GemType, count: 144 }, { type: 'blue' as GemType, count: 144 }] },
  { id: 267, name: 'Ljubljana, Slovenia', moves: 10, goals: [{ type: 'green' as GemType, count: 145 }, { type: 'yellow' as GemType, count: 145 }] },
  { id: 268, name: 'Sarajevo, Bosnia', moves: 10, goals: [{ type: 'purple' as GemType, count: 145 }, { type: 'orange' as GemType, count: 145 }] },
  { id: 269, name: 'Skopje, North Macedonia', moves: 10, goals: [{ type: 'pink' as GemType, count: 146 }, { type: 'cyan' as GemType, count: 146 }] },
  { id: 270, name: 'Tirana, Albania', moves: 10, goals: [{ type: 'lime' as GemType, count: 146 }, { type: 'magenta' as GemType, count: 146 }] },
  { id: 271, name: 'Minsk, Belarus', moves: 10, goals: [{ type: 'red' as GemType, count: 147 }, { type: 'blue' as GemType, count: 147 }] },
  { id: 272, name: 'Chisinau, Moldova', moves: 10, goals: [{ type: 'green' as GemType, count: 147 }, { type: 'yellow' as GemType, count: 147 }] },
  { id: 273, name: 'Reykjavik, Iceland', moves: 10, goals: [{ type: 'purple' as GemType, count: 148 }, { type: 'orange' as GemType, count: 148 }] },
  { id: 274, name: 'Luxembourg City, Luxembourg', moves: 10, goals: [{ type: 'pink' as GemType, count: 148 }, { type: 'cyan' as GemType, count: 148 }] },
  { id: 275, name: 'Monaco', moves: 10, goals: [{ type: 'lime' as GemType, count: 149 }, { type: 'magenta' as GemType, count: 149 }] },
  { id: 276, name: 'Andorra la Vella, Andorra', moves: 10, goals: [{ type: 'red' as GemType, count: 149 }, { type: 'blue' as GemType, count: 149 }] },
  { id: 277, name: 'Valletta, Malta', moves: 10, goals: [{ type: 'green' as GemType, count: 150 }, { type: 'yellow' as GemType, count: 150 }] },
  { id: 278, name: 'Nicosia, Cyprus', moves: 10, goals: [{ type: 'purple' as GemType, count: 150 }, { type: 'orange' as GemType, count: 150 }] },
  { id: 279, name: 'San Marino', moves: 10, goals: [{ type: 'pink' as GemType, count: 151 }, { type: 'cyan' as GemType, count: 151 }] },
  { id: 280, name: 'Vatican City', moves: 10, goals: [{ type: 'lime' as GemType, count: 151 }, { type: 'magenta' as GemType, count: 151 }] },
  { id: 281, name: 'Manama, Bahrain', moves: 10, goals: [{ type: 'red' as GemType, count: 152 }, { type: 'blue' as GemType, count: 152 }] },
  { id: 282, name: 'Muscat, Oman', moves: 10, goals: [{ type: 'green' as GemType, count: 152 }, { type: 'yellow' as GemType, count: 152 }] },
  { id: 283, name: 'Sana\'a, Yemen', moves: 10, goals: [{ type: 'purple' as GemType, count: 153 }, { type: 'orange' as GemType, count: 153 }] },
  { id: 284, name: 'Kabul, Afghanistan', moves: 10, goals: [{ type: 'pink' as GemType, count: 153 }, { type: 'cyan' as GemType, count: 153 }] },
  { id: 285, name: 'Islamabad, Pakistan', moves: 10, goals: [{ type: 'lime' as GemType, count: 154 }, { type: 'magenta' as GemType, count: 154 }] },
  { id: 286, name: 'Dhaka, Bangladesh', moves: 10, goals: [{ type: 'red' as GemType, count: 154 }, { type: 'blue' as GemType, count: 154 }] },
  { id: 287, name: 'Kathmandu, Nepal', moves: 10, goals: [{ type: 'green' as GemType, count: 155 }, { type: 'yellow' as GemType, count: 155 }] },
  { id: 288, name: 'Thimphu, Bhutan', moves: 10, goals: [{ type: 'purple' as GemType, count: 155 }, { type: 'orange' as GemType, count: 155 }] },
  { id: 289, name: 'Male, Maldives', moves: 10, goals: [{ type: 'pink' as GemType, count: 156 }, { type: 'cyan' as GemType, count: 156 }] },
  { id: 290, name: 'Bandar Seri Begawan, Brunei', moves: 10, goals: [{ type: 'lime' as GemType, count: 156 }, { type: 'magenta' as GemType, count: 156 }] },
  { id: 291, name: 'Dili, East Timor', moves: 10, goals: [{ type: 'red' as GemType, count: 157 }, { type: 'blue' as GemType, count: 157 }] },
  { id: 292, name: 'Port Moresby, Papua New Guinea', moves: 10, goals: [{ type: 'green' as GemType, count: 157 }, { type: 'yellow' as GemType, count: 157 }] },
  { id: 293, name: 'Suva, Fiji', moves: 10, goals: [{ type: 'purple' as GemType, count: 158 }, { type: 'orange' as GemType, count: 158 }] },
  { id: 294, name: 'Nuku\'alofa, Tonga', moves: 10, goals: [{ type: 'pink' as GemType, count: 158 }, { type: 'cyan' as GemType, count: 158 }] },
  { id: 295, name: 'Apia, Samoa', moves: 10, goals: [{ type: 'lime' as GemType, count: 159 }, { type: 'magenta' as GemType, count: 159 }] },
  { id: 296, name: 'Papeete, French Polynesia', moves: 10, goals: [{ type: 'red' as GemType, count: 159 }, { type: 'blue' as GemType, count: 159 }] },
  { id: 297, name: 'Noumea, New Caledonia', moves: 10, goals: [{ type: 'green' as GemType, count: 160 }, { type: 'yellow' as GemType, count: 160 }] },
  { id: 298, name: 'Honiara, Solomon Islands', moves: 10, goals: [{ type: 'purple' as GemType, count: 160 }, { type: 'orange' as GemType, count: 160 }] },
  { id: 299, name: 'Port Vila, Vanuatu', moves: 10, goals: [{ type: 'pink' as GemType, count: 161 }, { type: 'cyan' as GemType, count: 161 }] },
  { id: 300, name: 'Funafuti, Tuvalu', moves: 10, goals: [{ type: 'lime' as GemType, count: 161 }, { type: 'magenta' as GemType, count: 161 }] },
  
  // Levels 301-350: Master difficulty
  { id: 301, name: 'Tarawa, Kiribati', moves: 10, goals: [{ type: 'red' as GemType, count: 162 }, { type: 'blue' as GemType, count: 162 }] },
  { id: 302, name: 'Majuro, Marshall Islands', moves: 10, goals: [{ type: 'green' as GemType, count: 162 }, { type: 'yellow' as GemType, count: 162 }] },
  { id: 303, name: 'Palikir, Micronesia', moves: 10, goals: [{ type: 'purple' as GemType, count: 163 }, { type: 'orange' as GemType, count: 163 }] },
  { id: 304, name: 'Ngerulmud, Palau', moves: 10, goals: [{ type: 'pink' as GemType, count: 163 }, { type: 'cyan' as GemType, count: 163 }] },
  { id: 305, name: 'Yaren, Nauru', moves: 10, goals: [{ type: 'lime' as GemType, count: 164 }, { type: 'magenta' as GemType, count: 164 }] },
  { id: 306, name: 'Dakar, Senegal', moves: 10, goals: [{ type: 'red' as GemType, count: 164 }, { type: 'blue' as GemType, count: 164 }] },
  { id: 307, name: 'Abidjan, Ivory Coast', moves: 10, goals: [{ type: 'green' as GemType, count: 165 }, { type: 'yellow' as GemType, count: 165 }] },
  { id: 308, name: 'Bamako, Mali', moves: 10, goals: [{ type: 'purple' as GemType, count: 165 }, { type: 'orange' as GemType, count: 165 }] },
  { id: 309, name: 'Ouagadougou, Burkina Faso', moves: 10, goals: [{ type: 'pink' as GemType, count: 166 }, { type: 'cyan' as GemType, count: 166 }] },
  { id: 310, name: 'Niamey, Niger', moves: 10, goals: [{ type: 'lime' as GemType, count: 166 }, { type: 'magenta' as GemType, count: 166 }] },
  { id: 311, name: 'Conakry, Guinea', moves: 10, goals: [{ type: 'red' as GemType, count: 167 }, { type: 'blue' as GemType, count: 167 }] },
  { id: 312, name: 'Freetown, Sierra Leone', moves: 10, goals: [{ type: 'green' as GemType, count: 167 }, { type: 'yellow' as GemType, count: 167 }] },
  { id: 313, name: 'Monrovia, Liberia', moves: 10, goals: [{ type: 'purple' as GemType, count: 168 }, { type: 'orange' as GemType, count: 168 }] },
  { id: 314, name: 'Banjul, Gambia', moves: 10, goals: [{ type: 'pink' as GemType, count: 168 }, { type: 'cyan' as GemType, count: 168 }] },
  { id: 315, name: 'Bissau, Guinea-Bissau', moves: 10, goals: [{ type: 'lime' as GemType, count: 169 }, { type: 'magenta' as GemType, count: 169 }] },
  { id: 316, name: 'Praia, Cape Verde', moves: 10, goals: [{ type: 'red' as GemType, count: 169 }, { type: 'blue' as GemType, count: 169 }] },
  { id: 317, name: 'Nouakchott, Mauritania', moves: 10, goals: [{ type: 'green' as GemType, count: 170 }, { type: 'yellow' as GemType, count: 170 }] },
  { id: 318, name: 'Khartoum, Sudan', moves: 10, goals: [{ type: 'purple' as GemType, count: 170 }, { type: 'orange' as GemType, count: 170 }] },
  { id: 319, name: 'Juba, South Sudan', moves: 10, goals: [{ type: 'pink' as GemType, count: 171 }, { type: 'cyan' as GemType, count: 171 }] },
  { id: 320, name: 'Asmara, Eritrea', moves: 10, goals: [{ type: 'lime' as GemType, count: 171 }, { type: 'magenta' as GemType, count: 171 }] },
  { id: 321, name: 'Djibouti City, Djibouti', moves: 10, goals: [{ type: 'red' as GemType, count: 172 }, { type: 'blue' as GemType, count: 172 }] },
  { id: 322, name: 'Mogadishu, Somalia', moves: 10, goals: [{ type: 'green' as GemType, count: 172 }, { type: 'yellow' as GemType, count: 172 }] },
  { id: 323, name: 'Kampala, Uganda', moves: 10, goals: [{ type: 'purple' as GemType, count: 173 }, { type: 'orange' as GemType, count: 173 }] },
  { id: 324, name: 'Kigali, Rwanda', moves: 10, goals: [{ type: 'pink' as GemType, count: 173 }, { type: 'cyan' as GemType, count: 173 }] },
  { id: 325, name: 'Bujumbura, Burundi', moves: 10, goals: [{ type: 'lime' as GemType, count: 174 }, { type: 'magenta' as GemType, count: 174 }] },
  { id: 326, name: 'Dodoma, Tanzania', moves: 10, goals: [{ type: 'red' as GemType, count: 174 }, { type: 'blue' as GemType, count: 174 }] },
  { id: 327, name: 'Dar es Salaam, Tanzania', moves: 10, goals: [{ type: 'green' as GemType, count: 175 }, { type: 'yellow' as GemType, count: 175 }] },
  { id: 328, name: 'Lusaka, Zambia', moves: 10, goals: [{ type: 'purple' as GemType, count: 175 }, { type: 'orange' as GemType, count: 175 }] },
  { id: 329, name: 'Harare, Zimbabwe', moves: 10, goals: [{ type: 'pink' as GemType, count: 176 }, { type: 'cyan' as GemType, count: 176 }] },
  { id: 330, name: 'Lilongwe, Malawi', moves: 10, goals: [{ type: 'lime' as GemType, count: 176 }, { type: 'magenta' as GemType, count: 176 }] },
  { id: 331, name: 'Maputo, Mozambique', moves: 10, goals: [{ type: 'red' as GemType, count: 177 }, { type: 'blue' as GemType, count: 177 }] },
  { id: 332, name: 'Gaborone, Botswana', moves: 10, goals: [{ type: 'green' as GemType, count: 177 }, { type: 'yellow' as GemType, count: 177 }] },
  { id: 333, name: 'Windhoek, Namibia', moves: 10, goals: [{ type: 'purple' as GemType, count: 178 }, { type: 'orange' as GemType, count: 178 }] },
  { id: 334, name: 'Mbabane, Eswatini', moves: 10, goals: [{ type: 'pink' as GemType, count: 178 }, { type: 'cyan' as GemType, count: 178 }] },
  { id: 335, name: 'Maseru, Lesotho', moves: 10, goals: [{ type: 'lime' as GemType, count: 179 }, { type: 'magenta' as GemType, count: 179 }] },
  { id: 336, name: 'Antananarivo, Madagascar', moves: 10, goals: [{ type: 'red' as GemType, count: 179 }, { type: 'blue' as GemType, count: 179 }] },
  { id: 337, name: 'Port Louis, Mauritius', moves: 10, goals: [{ type: 'green' as GemType, count: 180 }, { type: 'yellow' as GemType, count: 180 }] },
  { id: 338, name: 'Victoria, Seychelles', moves: 10, goals: [{ type: 'purple' as GemType, count: 180 }, { type: 'orange' as GemType, count: 180 }] },
  { id: 339, name: 'Moroni, Comoros', moves: 10, goals: [{ type: 'pink' as GemType, count: 181 }, { type: 'cyan' as GemType, count: 181 }] },
  { id: 340, name: 'Luanda, Angola', moves: 10, goals: [{ type: 'lime' as GemType, count: 181 }, { type: 'magenta' as GemType, count: 181 }] },
  { id: 341, name: 'Kinshasa, DR Congo', moves: 10, goals: [{ type: 'red' as GemType, count: 182 }, { type: 'blue' as GemType, count: 182 }] },
  { id: 342, name: 'Brazzaville, Congo', moves: 10, goals: [{ type: 'green' as GemType, count: 182 }, { type: 'yellow' as GemType, count: 182 }] },
  { id: 343, name: 'Libreville, Gabon', moves: 10, goals: [{ type: 'purple' as GemType, count: 183 }, { type: 'orange' as GemType, count: 183 }] },
  { id: 344, name: 'Malabo, Equatorial Guinea', moves: 10, goals: [{ type: 'pink' as GemType, count: 183 }, { type: 'cyan' as GemType, count: 183 }] },
  { id: 345, name: 'São Tomé, São Tomé & Príncipe', moves: 10, goals: [{ type: 'lime' as GemType, count: 184 }, { type: 'magenta' as GemType, count: 184 }] },
  { id: 346, name: 'Yaoundé, Cameroon', moves: 10, goals: [{ type: 'red' as GemType, count: 184 }, { type: 'blue' as GemType, count: 184 }] },
  { id: 347, name: 'N\'Djamena, Chad', moves: 10, goals: [{ type: 'green' as GemType, count: 185 }, { type: 'yellow' as GemType, count: 185 }] },
  { id: 348, name: 'Bangui, Central African Rep.', moves: 10, goals: [{ type: 'purple' as GemType, count: 185 }, { type: 'orange' as GemType, count: 185 }] },
  { id: 349, name: 'Tripoli, Libya', moves: 10, goals: [{ type: 'pink' as GemType, count: 186 }, { type: 'cyan' as GemType, count: 186 }] },
  { id: 350, name: 'Rabat, Morocco', moves: 10, goals: [{ type: 'lime' as GemType, count: 186 }, { type: 'magenta' as GemType, count: 186 }] },
  
  // Levels 351-400: Ultimate challenges
  { id: 351, name: 'Abuja, Nigeria', moves: 10, goals: [{ type: 'red' as GemType, count: 187 }, { type: 'blue' as GemType, count: 187 }] },
  { id: 352, name: 'Port Harcourt, Nigeria', moves: 10, goals: [{ type: 'green' as GemType, count: 187 }, { type: 'yellow' as GemType, count: 187 }] },
  { id: 353, name: 'Kumasi, Ghana', moves: 10, goals: [{ type: 'purple' as GemType, count: 188 }, { type: 'orange' as GemType, count: 188 }] },
  { id: 354, name: 'Lomé, Togo', moves: 10, goals: [{ type: 'pink' as GemType, count: 188 }, { type: 'cyan' as GemType, count: 188 }] },
  { id: 355, name: 'Cotonou, Benin', moves: 10, goals: [{ type: 'lime' as GemType, count: 189 }, { type: 'magenta' as GemType, count: 189 }] },
  { id: 356, name: 'Porto-Novo, Benin', moves: 10, goals: [{ type: 'red' as GemType, count: 189 }, { type: 'blue' as GemType, count: 189 }] },
  { id: 357, name: 'Accra, Ghana', moves: 10, goals: [{ type: 'green' as GemType, count: 190 }, { type: 'yellow' as GemType, count: 190 }] },
  { id: 358, name: 'Montevideo, Uruguay', moves: 10, goals: [{ type: 'purple' as GemType, count: 190 }, { type: 'orange' as GemType, count: 190 }] },
  { id: 359, name: 'Asunción, Paraguay', moves: 10, goals: [{ type: 'pink' as GemType, count: 191 }, { type: 'cyan' as GemType, count: 191 }] },
  { id: 360, name: 'Paramaribo, Suriname', moves: 10, goals: [{ type: 'lime' as GemType, count: 191 }, { type: 'magenta' as GemType, count: 191 }] },
  { id: 361, name: 'Georgetown, Guyana', moves: 10, goals: [{ type: 'red' as GemType, count: 192 }, { type: 'blue' as GemType, count: 192 }] },
  { id: 362, name: 'Cayenne, French Guiana', moves: 10, goals: [{ type: 'green' as GemType, count: 192 }, { type: 'yellow' as GemType, count: 192 }] },
  { id: 363, name: 'Bridgetown, Barbados', moves: 10, goals: [{ type: 'purple' as GemType, count: 193 }, { type: 'orange' as GemType, count: 193 }] },
  { id: 364, name: 'Port of Spain, Trinidad', moves: 10, goals: [{ type: 'pink' as GemType, count: 193 }, { type: 'cyan' as GemType, count: 193 }] },
  { id: 365, name: 'Nassau, Bahamas', moves: 10, goals: [{ type: 'lime' as GemType, count: 194 }, { type: 'magenta' as GemType, count: 194 }] },
  { id: 366, name: 'Castries, Saint Lucia', moves: 10, goals: [{ type: 'red' as GemType, count: 194 }, { type: 'blue' as GemType, count: 194 }] },
  { id: 367, name: 'Saint George\'s, Grenada', moves: 10, goals: [{ type: 'green' as GemType, count: 195 }, { type: 'yellow' as GemType, count: 195 }] },
  { id: 368, name: 'Kingstown, St Vincent', moves: 10, goals: [{ type: 'purple' as GemType, count: 195 }, { type: 'orange' as GemType, count: 195 }] },
  { id: 369, name: 'Roseau, Dominica', moves: 10, goals: [{ type: 'pink' as GemType, count: 196 }, { type: 'cyan' as GemType, count: 196 }] },
  { id: 370, name: 'St. John\'s, Antigua', moves: 10, goals: [{ type: 'lime' as GemType, count: 196 }, { type: 'magenta' as GemType, count: 196 }] },
  { id: 371, name: 'Basseterre, St Kitts', moves: 10, goals: [{ type: 'red' as GemType, count: 197 }, { type: 'blue' as GemType, count: 197 }] },
  { id: 372, name: 'Belmopan, Belize', moves: 10, goals: [{ type: 'green' as GemType, count: 197 }, { type: 'yellow' as GemType, count: 197 }] },
  { id: 373, name: 'San Salvador, El Salvador', moves: 10, goals: [{ type: 'purple' as GemType, count: 198 }, { type: 'orange' as GemType, count: 198 }] },
  { id: 374, name: 'Managua, Nicaragua', moves: 10, goals: [{ type: 'pink' as GemType, count: 198 }, { type: 'cyan' as GemType, count: 198 }] },
  { id: 375, name: 'San José, Costa Rica', moves: 10, goals: [{ type: 'lime' as GemType, count: 199 }, { type: 'magenta' as GemType, count: 199 }] },
  { id: 376, name: 'Tegucigalpa, Honduras', moves: 10, goals: [{ type: 'red' as GemType, count: 199 }, { type: 'blue' as GemType, count: 199 }] },
  { id: 377, name: 'Guatemala City, Guatemala', moves: 10, goals: [{ type: 'green' as GemType, count: 200 }, { type: 'yellow' as GemType, count: 200 }] },
  { id: 378, name: 'Mexico City, Mexico', moves: 10, goals: [{ type: 'purple' as GemType, count: 200 }, { type: 'orange' as GemType, count: 200 }] },
  { id: 379, name: 'Cancun, Mexico', moves: 10, goals: [{ type: 'pink' as GemType, count: 201 }, { type: 'cyan' as GemType, count: 201 }] },
  { id: 380, name: 'Tijuana, Mexico', moves: 10, goals: [{ type: 'lime' as GemType, count: 201 }, { type: 'magenta' as GemType, count: 201 }] },
  { id: 381, name: 'Puebla, Mexico', moves: 10, goals: [{ type: 'red' as GemType, count: 202 }, { type: 'blue' as GemType, count: 202 }] },
  { id: 382, name: 'León, Mexico', moves: 10, goals: [{ type: 'green' as GemType, count: 202 }, { type: 'yellow' as GemType, count: 202 }] },
  { id: 383, name: 'Juárez, Mexico', moves: 10, goals: [{ type: 'purple' as GemType, count: 203 }, { type: 'orange' as GemType, count: 203 }] },
  { id: 384, name: 'Zapopan, Mexico', moves: 10, goals: [{ type: 'pink' as GemType, count: 203 }, { type: 'cyan' as GemType, count: 203 }] },
  { id: 385, name: 'Mérida, Mexico', moves: 10, goals: [{ type: 'lime' as GemType, count: 204 }, { type: 'magenta' as GemType, count: 204 }] },
  { id: 386, name: 'San Luis Potosí, Mexico', moves: 10, goals: [{ type: 'red' as GemType, count: 204 }, { type: 'blue' as GemType, count: 204 }] },
  { id: 387, name: 'Aguascalientes, Mexico', moves: 10, goals: [{ type: 'green' as GemType, count: 205 }, { type: 'yellow' as GemType, count: 205 }] },
  { id: 388, name: 'Hermosillo, Mexico', moves: 10, goals: [{ type: 'purple' as GemType, count: 205 }, { type: 'orange' as GemType, count: 205 }] },
  { id: 389, name: 'Saltillo, Mexico', moves: 10, goals: [{ type: 'pink' as GemType, count: 206 }, { type: 'cyan' as GemType, count: 206 }] },
  { id: 390, name: 'Mexicali, Mexico', moves: 10, goals: [{ type: 'lime' as GemType, count: 206 }, { type: 'magenta' as GemType, count: 206 }] },
  { id: 391, name: 'Culiacán, Mexico', moves: 10, goals: [{ type: 'red' as GemType, count: 207 }, { type: 'blue' as GemType, count: 207 }] },
  { id: 392, name: 'Acapulco, Mexico', moves: 10, goals: [{ type: 'green' as GemType, count: 207 }, { type: 'yellow' as GemType, count: 207 }] },
  { id: 393, name: 'Cuernavaca, Mexico', moves: 10, goals: [{ type: 'purple' as GemType, count: 208 }, { type: 'orange' as GemType, count: 208 }] },
  { id: 394, name: 'Querétaro, Mexico', moves: 10, goals: [{ type: 'pink' as GemType, count: 208 }, { type: 'cyan' as GemType, count: 208 }] },
  { id: 395, name: 'Mazatlán, Mexico', moves: 10, goals: [{ type: 'lime' as GemType, count: 209 }, { type: 'magenta' as GemType, count: 209 }] },
  { id: 396, name: 'Veracruz, Mexico', moves: 10, goals: [{ type: 'red' as GemType, count: 209 }, { type: 'blue' as GemType, count: 209 }] },
  { id: 397, name: 'Chihuahua, Mexico', moves: 10, goals: [{ type: 'green' as GemType, count: 210 }, { type: 'yellow' as GemType, count: 210 }] },
  { id: 398, name: 'Tampico, Mexico', moves: 10, goals: [{ type: 'purple' as GemType, count: 210 }, { type: 'orange' as GemType, count: 210 }] },
  { id: 399, name: 'Morelia, Mexico', moves: 10, goals: [{ type: 'pink' as GemType, count: 211 }, { type: 'cyan' as GemType, count: 211 }] },
  { id: 400, name: 'Reynosa, Mexico', moves: 10, goals: [{ type: 'lime' as GemType, count: 211 }, { type: 'magenta' as GemType, count: 211 }] },
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
