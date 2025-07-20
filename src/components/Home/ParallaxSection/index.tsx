"use client"
import { ParallaxBanner } from 'react-scroll-parallax';

const images = [
    "/home/parralax1.jpeg",
    "/home/parralax2.jpeg",
    "/home/parralax3.jpeg",

]

const ParallaxSection = ({ groupIndex }: { groupIndex: number }) => {
    return (
        <ParallaxBanner
            layers={[
                {
                    image: images[groupIndex % images.length],
                    speed: -30,
                    scale: [.5, 2],
                    opacity: [.5, 1],
                    expanded: false,
                },
            ]}
            className="relative h-[500px] w-full overflow-hidden"
        >
            <div className="relative z-10 flex flex-col items-center justify-center text-white text-center p-40 w-full h-full">
                {/* Add your content here */}
            </div>
        </ParallaxBanner>
    );
};

export default ParallaxSection; 