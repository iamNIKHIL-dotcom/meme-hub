import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, ArrowLeft, Download, Copy, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";

type TextBox = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
};

type CustomTemplateCreatorProps = {
  onBack: () => void;
};

const CustomTemplateCreator = ({ onBack }: CustomTemplateCreatorProps) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [customTextBoxes, setCustomTextBoxes] = useState<TextBox[]>([]);
  const [activeTextBoxId, setActiveTextBoxId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setUserImage(e.target?.result as string);
          setCustomTextBoxes([]);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (containerRef.current && imageDimensions.width > 0) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const scaleX = containerWidth / imageDimensions.width;
      const scaleY = containerHeight / imageDimensions.height;
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
      setContainerDimensions({
        width: imageDimensions.width * newScale,
        height: imageDimensions.height * newScale
      });
    }
  }, [imageDimensions]);

  const handleAddTextBox = () => {
    if (!userImage || !containerRef.current) return;
    const newTextBox = {
      id: `textbox-${Date.now()}`,
      x: (imageDimensions.width / 2 - 100) * scale,
      y: (imageDimensions.height / 2 - 40) * scale,
      width: 200 * scale,
      height: 80 * scale,
      text: "Your text here",
      fontSize: 32 * scale
    };
    setCustomTextBoxes([...customTextBoxes, newTextBox]);
    setActiveTextBoxId(newTextBox.id);
  };

  const handleDragTextBox = (id: string, info: any) => {
    setCustomTextBoxes(customTextBoxes.map(box =>
      box.id === id ? { ...box, x: box.x + info.delta.x, y: box.y + info.delta.y } : box
    ));
  };

  const handleDeleteTextBox = (id: string) => {
    setCustomTextBoxes(prev => prev.filter(box => box.id !== id));
    if (activeTextBoxId === id) setActiveTextBoxId(null);
  };

  const drawText = useCallback((ctx: CanvasRenderingContext2D, text: string, box: TextBox) => {
    if (!text) return;
    ctx.font = `bold ${box.fontSize}px Impact, Arial, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }, []);

  const handleDownload = async () => {
    if (!userImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = userImage;
    await new Promise((resolve) => (img.onload = resolve));
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    customTextBoxes.forEach(box => drawText(ctx, box.text, box));
    const link = document.createElement('a');
    link.download = 'custom-meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopy = async () => {
    if (!userImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.src = userImage;
    await new Promise((resolve) => (img.onload = resolve));
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    customTextBoxes.forEach(box => drawText(ctx, box.text, box));
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((blob) => resolve(blob), 'image/png')
      );
      if (blob) {
        const data = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([data]);
        toast.success("Meme copied to clipboard!");
      }
    } catch (err) {
      toast.error("Failed to copy meme");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Templates</span>
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 bg-[#6a7bd1] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#5a6bc1] transition-colors">
            <Upload className="w-4 h-4" />
            Upload Custom Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          {userImage && (
            <>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleCopy}
               className="flex items-center gap-2 py-2 px-4 rounded-lg bg-transparent text-black dark:text-white hover:bg-gray-300 dark:hover:bg-white/5"

              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </>
          )}
        </div>
      </div>

      {userImage ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <div
            ref={containerRef}
            className="relative flex-1 border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#0f0f0f] flex justify-center items-center min-h-[400px] max-h-[70vh]"
          >
            <div
              className="relative"
              style={{
                width: containerDimensions.width,
                height: containerDimensions.height,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              <img
                src={userImage}
                alt="Custom meme"
                style={{
                  width: containerDimensions.width,
                  height: containerDimensions.height,
                  objectFit: 'contain',
                }}
              />
              {customTextBoxes.map((box) => (
                <motion.div
                  key={box.id}
                  className={`absolute border-2 ${
                    activeTextBoxId === box.id
                      ? 'border-blue-500 dark:border-[#6a7bd1] z-10'
                      : 'border-transparent'
                  }`}
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                    cursor: 'move',
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                  drag
                  onDrag={(_, info) => handleDragTextBox(box.id, info)}
                  dragMomentum={false}
                  onClick={() => setActiveTextBoxId(box.id)}
                >
                  <div
                    className="w-full h-full flex items-center justify-center text-center p-2 select-none"
                    style={{
                      fontSize: `${box.fontSize}px`,
                      color: 'white',
                      textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
                    }}
                  >
                    {box.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full sm:w-80 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#0f0f0f] rounded-lg border border-gray-300 dark:border-gray-800 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Text Boxes</h3>
                <button
                  onClick={handleAddTextBox}
                  className="flex items-center gap-1 bg-[#6a7bd1] text-white py-1 px-3 rounded-md text-sm hover:bg-[#5a6bc1]"
                >
                  <Plus className="w-4 h-4" />
                  Add Text
                </button>
              </div>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {customTextBoxes.map((box) => (
                    <div
                      key={box.id}
                      className={`p-3 rounded-lg border ${
                        activeTextBoxId === box.id
                          ? 'border-blue-500 dark:border-[#6a7bd1] bg-gray-100 dark:bg-[#1a1a1a]'
                          : 'border-gray-300 dark:border-gray-800 bg-white dark:bg-transparent'
                      }`}
                      onClick={() => setActiveTextBoxId(box.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">Text Box {customTextBoxes.indexOf(box) + 1}</h4>
                        <button
                          onClick={() => handleDeleteTextBox(box.id)}
                          className="text-gray-500 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={box.text}
                        onChange={(e) =>
                          setCustomTextBoxes(customTextBoxes.map(b =>
                            b.id === box.id ? { ...b, text: e.target.value } : b
                          ))
                        }
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm mb-3 bg-white dark:bg-[#1a1a1a] text-black dark:text-white"
                        rows={2}
                      />
                      <div>
                        <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">
                          Font Size: {box.fontSize}px
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={box.fontSize}
                          onChange={(e) =>
                            setCustomTextBoxes(customTextBoxes.map(b =>
                              b.id === box.id ? { ...b, fontSize: parseInt(e.target.value) } : b
                            ))
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                  {customTextBoxes.length === 0 && (
                    <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                      <p>No text boxes yet</p>
                      <p className="text-sm mt-2">Click "Add Text" to create your first text box</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {activeTextBoxId && (
              <div className="bg-white dark:bg-[#0f0f0f] rounded-lg border border-gray-300 dark:border-gray-800 p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Position & Size</h3>
                <div className="grid grid-cols-2 gap-3">
                  {['x', 'y', 'width', 'height'].map((prop) => (
                    <div key={prop}>
                      <label className="block text-sm mb-1 text-gray-600 dark:text-gray-400">{prop.toUpperCase()}</label>
                      <input
                        type="number"
                        value={(customTextBoxes.find(b => b.id === activeTextBoxId) as any)?.[prop] || 0}
                        onChange={(e) =>
                          setCustomTextBoxes(customTextBoxes.map(b =>
                            b.id === activeTextBoxId ? { ...b, [prop]: parseInt(e.target.value) } : b
                          ))
                        }
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-[#1a1a1a] text-black dark:text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#0f0f0f]">
          <div className="text-center p-6">
            <Upload className="w-12 h-12 mx-auto text-gray-600 dark:text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-1">Upload an image to get started</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">Drag & drop or click to upload</p>
            <label className="inline-flex items-center gap-2 bg-[#6a7bd1] text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-[#5a6bc1] transition-colors">
              <Upload className="w-4 h-4" />
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CustomTemplateCreator;
