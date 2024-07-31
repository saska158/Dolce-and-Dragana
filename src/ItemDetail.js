import { useState, useEffect, useContext, useRef, createRef } from "react"
import { Link, useParams } from "react-router-dom"
import { getItem } from "./api"
import { ShoppingBagContext } from "./shoppingBagContext"
import useScreenWidth from "./useScreenWidth"
import gsap from "gsap"

const ItemDetail = () => {
  const { addToShoppingBag } = useContext(ShoppingBagContext)
  const [item, setItem] = useState({})
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSelectedItem, setShowSelectedItem] = useState(false)
  const selectedItemRef = useRef(null)
  const [warning, setWarning] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { id, category } = useParams()

  const [infoHeight, setInfoHeight] = useState('28%')
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)
  const infoRef = useRef(null)
  const imgRefs = useRef([])
  const [index, setIndex] = useState(0)

  const { isSmallScreen } = useScreenWidth()

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true)
      try {
        const itemData = await getItem(category, id)
        setLoading(true)
        setItem(itemData)
      } catch(error) {
          console.error(error)
          setError(error)
      } finally {
          setLoading(false)
      }
    } 
    loadItem()
  }, [id, category])

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [isDragging])


  const handleTouchStart = (e) => {
    setIsDragging(true)
    startYRef.current = e.touches[0].clientY
    startHeightRef.current = infoRef.current.offsetHeight
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      const touchY = e.touches[0].clientY
      let newHeight = startHeightRef.current - (touchY - startYRef.current)

      const minHeight = window.innerHeight * 0.28
      if (newHeight < minHeight) {
        newHeight = minHeight
      }

      setInfoHeight(`${newHeight}px`)
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }


  const handleAddButton = (selectedSize) => {
    if(!selectedSize) {
      console.log("WARNING YOU MUST SELECT A SIZE")
      setWarning(true)
    } else {
        addToShoppingBag(item, selectedSize, category)
        setSelectedItem({...item, selectedSize}) 
        toggleSelectedItem()
      }
  }

  const toggleSelectedItem = () => {
    setShowSelectedItem(true)
    setTimeout(() => {setShowSelectedItem(false)}, 3000)
  }

  

  useEffect(() => {
    if(item && item.images) {
      if (imgRefs.current.length !== item.images.length) {
        imgRefs.current = Array(item.images.length).fill().map((_, i) => imgRefs.current[i] || createRef())
      }
    }
  }, [item])


  function handleNext() {
    if (index < item.images.length - 1) {
      setIndex(index + 1)
      gsap.to(imgRefs.current[index + 1].current, {duration: 1, x: 0, ease: "power4.out"})
    }
    setCurrentSlide((prevSlide) => (prevSlide === item.images.length - 1 ? 0 : prevSlide + 1))
  }

  function handlePrev() {
    if (index > 0) {
      setIndex(index - 1)
      gsap.to(imgRefs.current[index].current, {duration: 0.6, x: '-100%', ease: "power4.in"})
    }
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? item.images.length - 1 : prevSlide - 1))
  }

  useEffect(() => {
    if(showSelectedItem) {
      gsap.to(selectedItemRef.current, {duration: 0.7, x: 0, ease: "power4.out"})
    } else {
      gsap.to(selectedItemRef.current, {duration: 0.7, x: '100%', ease: "power4.in"})
    }
  }, [showSelectedItem])

  if(loading) {
    return (
      <div className="content-container">
        <p className="loader-and-error">Loading...</p>
      </div>
    )
  }

  if(error) {
    return (
      <div className="content-container">
        <p className="loader-and-error">{error.message}</p>
      </div>
    )
  }

  if(warning) {
    return (
      <div className="warning">
        <div className="warning-content">
          <div>
            <p style={{marginBottom: '.5em'}}>WARNING</p> 
            <p style={{fontSize: '.8rem'}}>YOU MUST SELECT A SIZE</p>
          </div>
          <button onClick={() => setWarning(false)}>CLOSE</button>
        </div>
      </div>)
  }
    

  return (
    item ? (
      <>
      <div className="content-container" style={showSelectedItem ? {opacity: '.3'} : null}>
        <div className="item-detail">
          <div className="item-detail-info item-detail-info-two">
            <div>
              <h4>COMPOSITION, CARE & ORIGIN</h4>
              <p>
                We work with monitoring programmes to ensure compliance with our social,
                environmental and health and safety standards for our products. 
                To assess compliance, we have developed a programme of 
                audits and continuous improvement plans.
              </p>
            </div>
          </div>
          <div className="item-detail-images">
              {item.images && item.images.map((image, i) => <img 
                                                         key={image} 
                                                         src={image} 
                                                         alt="item"
                                                         className={`item-detail-img ${i === 0 ? 'item-detail-img-first' : ''}`}
                                                         ref={imgRefs.current[i]}
                                                        />)
              }
              { !isSmallScreen && (
                <>
                  {currentSlide !== 0 && (
                    <button className="prev prev-small" onClick={handlePrev}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  {item.images && currentSlide !== item.images.length - 1 && (
                    <button className="next next-small" onClick={handleNext}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  )}
                </>
              )}
          </div>
          <div 
            className={`item-detail-info ${isDragging ? 'dragging' : ''}`}
            ref={ isSmallScreen ? infoRef : null}
            style={ isSmallScreen ? { height: infoHeight } : null}
            onTouchStart={ isSmallScreen ? handleTouchStart : null}
            onTouchMove={isSmallScreen ? handleTouchMove : null}
            onTouchEnd={isSmallScreen ? handleTouchEnd : null}
          >
            <div className="item-detail-basic">
              <h4>{item.name}</h4>
              <p>{item?.price?.toLocaleString()} RSD</p>
              <p>*{item.color}</p>
            </div>
            <div className="item-detail-description">
              Dress made of 100% linen. Round neckline and thin adjustable straps. 
              Front slit at the hem. Lining. Invisible side zip fastening.
            </div>
            <div className="item-detail-sizes">
              {item?.sizes?.map(size => <div 
                                          key={size} 
                                          onClick={() => setSelectedSize(size)}
                                          className={selectedSize === size ? 'black-btn' : ''}>{size}</div>)
              }
            </div>
            <button 
              onClick={() => handleAddButton(selectedSize) }
              className={`add-btn ${selectedSize ? 'black-btn' : ""}`}
            >
              ADD
            </button>
            { selectedItem && (
              <Link to='/shopping-bag'>PROCESS ORDER</Link>
              ) 
            }
          </div>
        </div>
      </div>
      {
            selectedItem && (
              <div className="selected-item-show" ref={selectedItemRef}> 
              <button 
                onClick={() => setShowSelectedItem(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
              <p>SIZE {selectedSize} ADDED TO YOUR SHOPPING BAG</p>
              <div>
                <img src={selectedItem.images[0]} alt="selected-image" />
                <p>{selectedItem.name}</p>
              </div>
                <Link to='/shopping-bag'>SEE SHOPPING BAG</Link>
              </div>
            )
          }
      </>
    ) : null
  )
}

export default ItemDetail