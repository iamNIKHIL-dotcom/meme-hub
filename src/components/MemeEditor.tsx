"use client"


import { Template } from '@/types/templates';
import { Calculator, MoveLeft } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type MemeEditorProps = {
    template: Template;
    onReset: () => void;
};

export default function MemeEditor({ template, onReset }: MemeEditorProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [texts, setTexts] = useState<string[]>(Array(template.textBoxes.length).fill(""));


    const handleChange = (idx: number, value: string) => {
        const arr = [...texts];
        arr[idx] = value;
        setTexts(arr);
    };

    const waitForFont = async (font: string) => {
        if (document.fonts && document.fonts.load) {
            await document.fonts.load(`bold 20px ${font}`);
            await document.fonts.ready;
        }
    }

    const downloadMeme = () => {

        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    const copyMeme = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            // Convert canvas to blob
            const blob = await new Promise<Blob>((resolve) => {
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                }, 'image/png');
            });

            const data = new ClipboardItem({
                'image/png': blob
            });

            await navigator.clipboard.write([data]);
            toast.success("meme copied to clipboard :)")
        } catch (err) {
            console.error('Failed to copy meme:', err);
        }

    }

     const MIN_FONT_SIZE = template.textBoxes[0].minFont; 

    const CalculateFontSize = (
        ctx: CanvasRenderingContext2D,
        text: string,
        box: Template['textBoxes'][number],
        maxFontSize: number
    ): { fontSize: number, lines: string[] } => {
        let fontSize = maxFontSize;
        let lines: string[] = [];

        while (fontSize > MIN_FONT_SIZE) {
            ctx.font = `${fontSize}px Impact`;
            lines = [];
            let currentLine = '';
            const words = text.split(' ');

            for (const word of words) {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > box.width) {
                    if (currentLine === '') {
                        // wrapping the lines
                        lines.push(word);
                        currentLine = '';
                    } else {
                        lines.push(currentLine);
                        currentLine = word + ' ';
                    }
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }

            const totalHeight = lines.length * (fontSize * 1.2);
            if (totalHeight <= box.height) {
                break;
            }
            fontSize -= 2;
        }

        if (fontSize < MIN_FONT_SIZE) {
            fontSize = MIN_FONT_SIZE;
            ctx.font = `${fontSize}px Impact`;
            lines = [];
            let currentLine = '';
            const words = text.split(' ');

            for (const word of words) {
                const testLine = currentLine + word + ' ';
                const metrics = ctx.measureText(testLine);

                if (metrics.width > box.width) {
                    if (currentLine === '') {
                        lines.push(word);
                        currentLine = '';
                    } else {
                        lines.push(currentLine);
                        currentLine = word + ' ';
                    }
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        }


        return { fontSize, lines }
    }

    const drawText = useCallback(() => (
        ctx: CanvasRenderingContext2D,
        text: string,
        box: Template['textBoxes'][number]
    ) => {
        if (!text) return;

        const { fontSize, lines } = CalculateFontSize(ctx, text, box, box.fontSize);
        ctx.font = `bold ${fontSize}px Impact,Arial,sans-serif`;

        const isMobile = /Andriod|webOs|iphone/i.test(navigator.userAgent)
        ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.textAlign = box.align || 'center';
        ctx.shadowColor = 'black';

        // Device-specific adjustments
        if (isMobile) {
            ctx.font = `900 ${fontSize}px Impact`;
            ctx.shadowBlur = 6
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.lineWidth = 2;
        } else {
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.lineWidth = 5;
        }

        // Unified rendering
        const lineHeight = fontSize * 1.2;
        let currentY = box.y;

        lines.forEach(line => {
            const x = box.align === 'center' ? box.x + box.width / 2 : box.x;
            ctx.strokeText(line, x, currentY); // Outline
            ctx.fillText(line, x, currentY); // Fill
            currentY += lineHeight;
        });


    }, []);

    //sets image into canvas
    useEffect(() => {
        const draw = async () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            if (!ctx) return;

            await waitForFont("Impact");

            const img = new window.Image();

            img.src = template.image;

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0);

                template.textBoxes.forEach((box, i) => {
                    drawText()(ctx, texts[i], box);
                });
            }

        }

        draw();
    }, [texts, template, drawText]);

    return (
        <section
         className='space-y-4 min-h-[65vh] max-sm:min-h-[75vh]'
         >
            <button
                className="bg-transparent flex items-center"
                onClick={onReset}
             >
                <MoveLeft /> &nbsp; Back
            </button>
            <div className="flex max-sm:flex-col max-sm:space-y-10 items-start space-x-16">
                <div className='max-sm:mx-auto'>
                    <canvas ref={canvasRef} className='border border-gray-300 dark:border-gray-700 w-[400px] h-fit' />
                </div>
                <div className="space-y-2 w-full">
                    {texts.map((txt, i) => (
                        <input
                            placeholder={`Text position ${i + 1}`}
                            key={i}
                            value={txt}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                handleChange(i, e.target.value)
                            }}
                            className='w-full p-2 text-sm border rounded-md bg-[#0f0f0f] border-white/20 text-white'

                        />
                    ))}
                    <div className='flex w-full space-x-2 mt-2'>
                        {/* change to motion button */}
                        <button
                            className="px-4 py-2 w-full bg-[#6a7bd1] hover:bg-[#6975b3] font-medium  border border-white/20 text-sm text-white rounded-md transition-colors"
                            onClick={downloadMeme}
                        >
                            Download
                        </button>
                        {/* change to motion */}
                        <button

                            className="px-4 py-2 w-full bg-transparent text-black hover:bg-gray-100/50 dark:hover:bg-white/5 font-medium  border border-[#6a7bd1] text-sm dark:text-white rounded-md transition-colors"
                            onClick={copyMeme}
                        >
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}
