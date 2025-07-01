'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TradingViewWidgetProps {
  imageUrl: string;
}

export const TradingViewWidget = ({ imageUrl }: TradingViewWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartDrag({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  if (!imageUrl) return null;

  return (
    <>
      <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="h-10 w-16 overflow-hidden rounded border">
          <img
            src={imageUrl}
            alt="TradingView chart"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <div className="absolute right-4 top-4 z-10 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
            <div
              className="relative aspect-video w-full overflow-hidden rounded-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt="TradingView chart"
                className="h-full w-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  cursor: scale > 1 ? 'grab' : 'default',
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
