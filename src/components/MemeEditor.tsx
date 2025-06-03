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

    };
    
     const waitForFont = async(font : string) =>{
        if (document.fonts && document.fonts.load) {
            await document.fonts.load(`bold 20px ${font}`);
            await document.fonts.ready;
        }
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

                    />  
                ))}
                </div>
            </div>
        </section>
    )
}
