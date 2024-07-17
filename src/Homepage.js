import { useState } from "react"

export default function Homepage() {
    const videoUrls = [
        'homepage_video_4.mp4',
        'homepage_video_5.mp4',
        'homepage_video_6.mp4',
        'homepage_video_8.mp4',
        'homepage_video_9.mp4',
        'homepage_video_11.mp4',
        'homepage_video_13.mp4'
    ]

    const [currentSlide, setCurrentSlide] = useState(0)


    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % videoUrls.length);
    }

    const handlePrev = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + videoUrls.length) % videoUrls.length);
    }

    return (
        <div className="slideshow-container">
          {videoUrls.map((url, index) => (
            <video
              key={index}
              src={`${process.env.PUBLIC_URL}/assets/homepage_videos/${url}`}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              autoPlay
              muted
              loop
            />
          ))}
          <button className="prev" onClick={handlePrev}>&#10094;</button>
          <button className="next" onClick={handleNext}>&#10095;</button>
        </div>
    )
   /*
        const [currentSlide, setCurrentSlide] = useState(0);
        const slideRefs = useRef([]);
      
        useEffect(() => {
          gsap.set(slideRefs.current, { xPercent: 100 });
          gsap.set(slideRefs.current[currentSlide], { xPercent: 0 });
        }, [currentSlide]);
      
        const handleNext = () => {
          const nextSlide = (currentSlide + 1) % videoUrls.length;
          animateSlides(currentSlide, nextSlide, 100);
          setCurrentSlide(nextSlide);
        };
      
        const handlePrev = () => {
          const prevSlide =
            (currentSlide - 1 + videoUrls.length) % videoUrls.length;
          animateSlides(currentSlide, prevSlide, -100);
          setCurrentSlide(prevSlide);
        };
      
        const animateSlides = (from, to, direction) => {
          gsap.timeline()
            .set(slideRefs.current[to], { xPercent: direction })
            .to(slideRefs.current[from], { xPercent: -direction, duration: 1 })
            .to(slideRefs.current[to], { xPercent: 0, duration: 1 }, "-=1");
        };
      
        return (
          <div className="slideshow-container">
            {videoUrls.map((url, index) => (
              <video
                key={index}
                ref={(el) => (slideRefs.current[index] = el)}
                src={`${process.env.PUBLIC_URL}/assets/homepage_videos/${url}`}
                className={`slide ${index === currentSlide ? "active" : ""}`}
                autoPlay
                muted
                loop
              />
            ))}
            <button className="prev" onClick={handlePrev}>
              &#10094;
            </button>
            <button className="next" onClick={handleNext}>
              &#10095;
            </button>
          </div>
        )*/
}