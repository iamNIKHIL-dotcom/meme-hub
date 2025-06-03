"use client"


import { Template } from '@/types/templates';
import { MoveLeft } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

type MemeEditorProps = {
    template: Template;
    onReset: () => void;
};

export default function MemeEditor({ template, onReset }: MemeEditorProps) {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [texts,setTexts ] = useState<string[]>(Array(template.textBoxes.length).fill(""));

    
    const handleChange = (idx : number, value: string)=>{
        const arr = [...texts];
        arr[idx] = value;
        setTexts(arr);
    };

    const waitForFont = async(font : string) =>{
        if (document.fonts && document.fonts.load) {
            await document.fonts.load(`bold 20px ${font}`);
            await document.fonts.ready;
        }
    }

    const downloadMeme = () =>{

    }

    const copyMeme = async () =>{
        
    }



     const drawText = useCallback(() =>(
        ctx : CanvasRenderingContext2D,
        text :string,
        box : Template['textBoxes'][number]
     ) =>{

     },[])
     //sets image into canvas
    useEffect(() =>{
        const draw = async () =>{
            const canvas = canvasRef.current;
            if(!canvas) return;
            const ctx = canvas.getContext('2d');

            if(!ctx) return;

            await waitForFont("Impact");

            const img = new window.Image();

            img.src = template.image;

            img.onload = () =>{
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.clearRect(0,0,canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0);

                template.textBoxes.forEach((box, i) => {
                    drawText()(ctx, texts[i], box);
                });
            }

        }

        draw();
    }, [texts, template, drawText]);

    return (
        <section>
            <button>
                <MoveLeft /> &nbsp; Back
            </button>
            <div>
                <div>
                    <canvas ref = { canvasRef } className='w-[400px] '/>
                </div>
                <div>
                {texts.map((txt,i) =>(
                    <input 
                        placeholder= {`Text position ${i+1}`}
                        key = {i}
                        value = {txt}
                        onChange={ (e : ChangeEvent<HTMLInputElement>) =>{
                            handleChange(i, e.target.value)
                        }}
                        className='w-full p-2 text-sm border rounded-md bg-[#0f0f0f] border-white/20 text-white'

                    />  
                ))}
                <div>
                    {/* change to motion button */}
                    <button 
                        className="px-4 py-2 w-full bg-[#6a7bd1] hover:bg-[#6975b3] font-medium  border border-white/20 text-sm text-white rounded-md transition-colors"
                        onClick={downloadMeme}
                    >
                        Download
                    </button>
                    {/* change to motion */}
                    <button 

                        className="px-4 py-2 w-full bg-transparent text-black hover:bg-gray-100/50 dark:hover:bg-white/5 font-medium !cursor-none border border-[#6a7bd1] text-sm dark:text-white rounded-md transition-colors"
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
