interface ComboDisplayProps {
  combo: number;
}

export const ComboDisplay = ({ combo }: ComboDisplayProps) => {
  if (combo <= 1) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-scale-in">
        <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,0,0.8)]">
          {combo}x COMBO!
        </div>
        <div className="text-2xl text-center mt-2 text-white drop-shadow-lg font-semibold">
          +{(combo - 1) * 20} Bonus
        </div>
      </div>
    </div>
  );
};
