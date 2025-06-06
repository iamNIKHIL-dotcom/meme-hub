export const templates = {
     "distracted-boyfriend": {
        image: "/temp1.jpg",
        textBoxes: [
            { x: 80, y: 550, width: 520, height: 150, fontSize: 80, minFont: 40, align: "center" as const },
            { x: 560, y: 400, width: 400, height: 100, fontSize: 70, minFont: 40, align: "center" as const },
            { x: 800, y: 500, width: 400, height: 200, fontSize: 70, minFont: 40, align: "center" as const }
        ]
    },
    "Bad-Horse": {
        image: "/temp2.jpg",
        textBoxes: [
            { id: "topText", x: 10, y: 140, width: 180, height: 200, fontSize: 40, minFont: 14, align: "center" as const },
            { id: "handText", x: 510, y: 140, width: 180, height: 200, fontSize: 40, minFont: 14, align: "center" as const },
        ],
    },
    "Puzzle-Head": {
        image: "/temp6.png",
        textBoxes: [
            { id: "topText", x: 150, y: 400, width: 1100, height: 100, fontSize: 200, minFont: 60, align: "center" as const },
            { id: "handText", x: 910, y: 1000, width: 600, height: 100, fontSize: 200, minFont: 30, align: "center" as const },
        ],
    },

}