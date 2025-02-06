import type React from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg p-6 text-white shadow-lg">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl text-black font-semibold mb-2 drop-shadow-md">
        {title}
      </h3>
      <p className="text-sm text-black drop-shadow-md">{description}</p>
    </div>
  );
};
