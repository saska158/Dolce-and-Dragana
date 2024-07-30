import { useState, useRef, createRef } from "react"
import gsap from "gsap"
import Draggable from "react-draggable"

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

    const videoRefs = useRef([])

    if (videoRefs.current.length !== videoUrls.length) {
      videoRefs.current = Array(videoUrls.length).fill().map((_, i) => videoRefs.current[i] || createRef())
    }

    const [index, setIndex] = useState(0)

    function handleNext() {
      console.log('next', videoRefs.current)
      if (index < videoUrls.length - 1) {
        setIndex(index + 1)
        gsap.to(videoRefs.current[index + 1].current, {duration: 0.6, x: 0})
      }
    }
  
    function handlePrev() {
      if (index > 0) {
        setIndex(index - 1)
        gsap.to(videoRefs.current[index].current, {duration: 0.6, x: '-100%'})
      }
    }

    const handleDrag = (data) => {
      const { x } = data
      gsap.to(videoRefs.current[index].current, {
        duration: 0.3,
        x: x
      })
    }
  
    const handleStop = (data) => {
      const { deltaX } = data
      if (Math.abs(deltaX) > window.innerWidth / 3) {
        if (deltaX > 0) handlePrev()
        else handleNext()
      } else {
        gsap.to(videoRefs.current[index].current, {
          duration: 0.3,
          x: 0
        })
      }
    }
  


    return (
        <div className="slideshow-container">
          {videoUrls.map((url, i) => (
            <Draggable
            key={i}
            axis="x"
            onDrag={handleDrag}
            onStop={handleStop}
            bounds="parent"
          >
           <video
              key={i}
              src={`${process.env.PUBLIC_URL}/assets/homepage_videos/${url}`}
              className={`slide ${i === 0 ? 'first-slide' : ''}`}
              ref={videoRefs.current[i]}
              autoPlay
              muted
              loop
            />
          </Draggable>
          ))}
          <button className="prev" onClick={handlePrev}>&#10094;</button>
          <button className="next" onClick={handleNext}>&#10095;</button>
        </div>
    )
}

export default Homepage

