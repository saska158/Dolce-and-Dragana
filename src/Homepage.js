import { useState } from "react"

const Homepage = () => {
    const videoUrls = [
        'homepage_video_9.mp4',
        'homepage_video_11.mp4',
        'homepage_video_8.mp4',
        'homepage_video_4.mp4',
        'homepage_video_5.mp4',
        'homepage_video_6.mp4',
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
}

export default Homepage