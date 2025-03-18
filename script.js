import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AluminiumGlassShowcasePricing() {
  const [dimensions, setDimensions] = useState({ length: 1, width: 1, height: 1, sections: 1, useWheels: false, useIronFrame: false });
  const framePricePerMeter = 35000;
  const ironFramePricePerMeter = 200000;
  const standardGlassPricePerSquareMeter = 200000;
  const increasedGlassPriceForSmallHeight = 250000;
  const increasedGlassPriceForHeight = 250000;
  const wheelPricePerPiece = 15000;
  const rubberPricePerMeter = 2000;
  const glassSizes = [
    { width: 1.22, height: 1.53 },
    { width: 1.01, height: 2.03 },
    { width: 0.9, height: 2.03 },
  ];
  
  const handleDimensionChange = (key, value) => {
    setDimensions({ ...dimensions, [key]: Number(value) });
  };

  const toggleWheels = () => {
    setDimensions({ ...dimensions, useWheels: !dimensions.useWheels });
  };

  const toggleIronFrame = () => {
    setDimensions({ ...dimensions, useIronFrame: !dimensions.useIronFrame });
  };

  const calculateFrameUsage = () => {
    const { length, width, height, sections } = dimensions;
    const outerFrame = 4 * (length + width + height);
    const sectionFrames = sections * width;
    return outerFrame + sectionFrames;
  };

  const calculateGlassUsage = () => {
    const { length, width, height, sections } = dimensions;
    const requiredArea = 2 * (length * height) + 2 * (width * height) + 2 * (length * width);
    const sectionGlassArea = sections * (length * width);
    const totalGlassArea = requiredArea + sectionGlassArea;
    
    return totalGlassArea;
  };

  const calculateRubberUsage = () => {
    return 2 * ((4 * dimensions.height) + (4 * dimensions.length) + (4 * dimensions.width));
  };

  let glassPricePerSquareMeter = standardGlassPricePerSquareMeter;
  if (dimensions.height < 0.6) {
    glassPricePerSquareMeter = increasedGlassPriceForSmallHeight;
  }
  if (dimensions.height > 1.5) {
    glassPricePerSquareMeter = increasedGlassPriceForHeight;
  }

  const materials = [
    { name: "Frame Aluminium", price: framePricePerMeter, quantity: calculateFrameUsage(), unit: "per m1" },
    { name: "Kaca", price: glassPricePerSquareMeter, quantity: calculateGlassUsage(), unit: "per m²", total: calculateGlassUsage() * glassPricePerSquareMeter },
    { name: "Karet", price: rubberPricePerMeter, quantity: calculateRubberUsage(), unit: "per m", total: calculateRubberUsage() * rubberPricePerMeter },
  ];
  
  if (dimensions.useWheels) {
    materials.push({ name: "Roda", price: wheelPricePerPiece, quantity: 4, unit: "pcs" });
  }
  
  if (dimensions.useIronFrame) {
    materials.push({ name: "Rangka Besi", price: ironFramePricePerMeter, quantity: dimensions.length, unit: "per m1" });
  }

  const totalCost = materials.reduce((sum, material) => sum + (material.total || (material.price * material.quantity)), 0);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Perhitungan Harga Etalase Kaca Aluminium</h2>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <label>Panjang (m)</label>
            <Input type="number" value={dimensions.length.toString().replace(/\.0+$/, '')} onChange={(e) => handleDimensionChange("length", e.target.value)} />
            <label>Lebar (m)</label>
            <Input type="number" value={dimensions.width.toString().replace(/\.0+$/, '')} onChange={(e) => handleDimensionChange("width", e.target.value)} />
            <label>Tinggi (m)</label>
            <Input type="number" value={dimensions.height.toString().replace(/\.0+$/, '')} onChange={(e) => handleDimensionChange("height", e.target.value)} />
            <label>Jumlah Sekat</label>
            <Input type="number" value={dimensions.sections.toString().replace(/\.0+$/, '')} onChange={(e) => handleDimensionChange("sections", e.target.value)} />
            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" checked={dimensions.useWheels} onChange={toggleWheels} />
              <label>Gunakan Roda</label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" checked={dimensions.useIronFrame} onChange={toggleIronFrame} />
              <label>Gunakan Rangka Besi</label>
            </div>
          </div>
          {materials.map((material, index) => (
            <div key={index} className="flex justify-between items-center">
              <span>{material.name} ({material.price.toLocaleString().replace(/\.00$/, '')} {material.unit})</span>
              <span>{material.quantity.toFixed(2)}</span>
            </div>
          ))}
          <div className="text-right font-bold text-lg mt-4">
            Total: {totalCost.toLocaleString().replace(/\.00$/, '')} IDR
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
