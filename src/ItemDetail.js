import { useState, useEffect, useContext, useRef } from "react"
import { Link, useParams } from "react-router-dom"
import { getItem } from "./api"
import { ClothesContext } from "./clothesContext"
import useScreenWidth from "./useScreenWidth"

export default function ItemDetail() {
  const { addToShoppingBag } = useContext(ClothesContext)
  const [data, setData] = useState({})
  const [selectedSize, setSelectedSize] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSelectedItem, setShowSelectedItem] = useState(false)
  const [warning, setWarning] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const { id, category } = useParams()

  const [infoHeight, setInfoHeight] = useState('28%')
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const startHeightRef = useRef(0)
  const infoRef = useRef(null)

  const { isSmallScreen } = useScreenWidth()

  useEffect(() => {
    if (isDragging) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }

    return () => {
      document.body.classList.remove('no-scroll')
    };
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
  };

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

    
  useEffect(() => {
    const loadItem = async () => {
      setLoading(true)
      try {
        const data = await getItem(category, id)
        setLoading(true)
        setData(data)
      } catch(error) {
          console.error(error)
          setError(error)
      } finally {
          setLoading(false)
        }
    } 
    loadItem()
  }, [id])

  const handleAddButton = (selectedSize) => {
    if(!selectedSize) {
      console.log("WARNING YOU MUST SELECT A SIZE")
      setWarning(true)
    } else {
        addToShoppingBag(data, selectedSize, category)
        setSelectedItem({...data, selectedSize}) 
        toggleSelectedItem()
      }
  }

  function toggleSelectedItem() {
    setShowSelectedItem(true)
    setTimeout(() => {setShowSelectedItem(false)}, 3000)
  }

  const handleNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % data.images.length);
  }

  const handlePrev = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + data.images.length) % data.images.length);
  }

  if(loading) {
    return (
      <div className="content-container">
        <h1>Loading...</h1>
      </div>
    )
  }

  if(error) {
    return (
      <div className="content-container">
        <h1>{error.message}</h1>
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
    data ? (
      <div className="content-container">
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
              {data.images && data.images.map((image, index) => <img 
                                                         key={image} 
                                                         src={image} 
                                                         alt="item"
                                                         className={`item-detail-img ${index === currentImage ? 'active' : ''}`}
                                                        />)
              }
              { !isSmallScreen && (
                <>
                  <button className="prev" onClick={handlePrev}>&#10094;</button>
                  <button className="next" onClick={handleNext}>&#10095;</button>
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
              <h4>{data.name}</h4>
              <p>{data?.price?.toLocaleString()} RSD</p>
              <p>*{data.color}</p>
            </div>
            <div className="item-detail-description">
              Dress made of 100% linen. Round neckline and thin adjustable straps. 
              Front slit at the hem. Lining. Invisible side zip fastening.
            </div>
            <div className="item-detail-sizes">
              {data?.sizes?.map(size => <div 
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
          {showSelectedItem && (
            <div className="selected-item-show">
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
          )}
        </div>
      </div>
    ) : null
  )
}