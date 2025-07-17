"use client"
import { ParallaxBanner } from 'react-scroll-parallax';

const ParallaxSection = () => {
    return (
        <ParallaxBanner
            layers={[
                {
                    image: "/home/image2.jpeg",
                    speed: -30,
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