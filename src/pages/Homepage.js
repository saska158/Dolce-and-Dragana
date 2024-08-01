import { useState, useRef, createRef } from "react"
import gsap from "gsap"

const Homepage = () => {
    const videoUrls = [
        'homepage_video_2.mp4',
        'homepage_video_5.mp4',
        'homepage_video_9.mp4',
        'homepage_video_11.mp4',
        'homepage_video_8.mp4'
    ]

    const videoRefs = useRef([])
    const [index, setIndex] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)

    if (videoRefs.current.length !== videoUrls.length) {
      videoRefs.current = Array(videoUrls.length).fill().map((_, i) => videoRefs.current[i] || createRef())
    }

    function handleNext() {
      if (index < videoUrls.length - 1) {
        setIndex(index + 1)
        gsap.to(videoRefs.current[index + 1].current, {duration: 1, x: 0, ease: "power4.out"})
      }
      setCurrentSlide((prevSlide) => (prevSlide === videoUrls.length - 1 ? 0 : prevSlide + 1))
    }
  
    function handlePrev() {
      if (index > 0) {
        setIndex(index - 1)
        gsap.to(videoRefs.current[index].current, {duration: 0.6, x: '-100%', ease: "power4.in"})
      }
      setCurrentSlide((prevSlide) => (prevSlide === 0 ? videoUrls.length - 1 : prevSlide - 1))
    }

    return (
        <div className="slideshow-container">
          {videoUrls.map((url, i) => (
           <video
              key={i}
              src={`${process.env.PUBLIC_URL}/assets/homepage_videos/${url}`}
              className={`slide ${i === 0 ? 'first-slide' : ''}`}
              ref={videoRefs.current[i]}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ))}
          {currentSlide !== 0 && (
            <button className="prev" onClick={handlePrev}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
          )}
          {currentSlide !== videoUrls.length - 1 && (
            <button className="next" onClick={handleNext}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
    )
}

export default Homepage

