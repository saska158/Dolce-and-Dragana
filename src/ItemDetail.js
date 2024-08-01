import { useState, useEffect, useContext, useRef, createRef } from "react"
import { Link, useParams } from "react-router-dom"
import { getItem } from "./api"
import { ShoppingBagContext } from "./shoppingBagContext"
import useScreenWidth from "./useScreenWidth"
import gsap from "gsap"

const ItemDetail = () => {
  const { addToShoppingBag } = useContext(ShoppingBagContext)
  const [item, setItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [mainImage, setMainImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showSelectedItem, setShowSelectedItem] = useState(false)
  const selectedItemRef = useRef(null)
  const [warning, setWarning] = useState(false)
  const { id, category } = useParams()

  const imgRefs = useRef([])

  const { isSmallScreen } = useScreenWidth()

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true)
      try {
        const itemData = await getItem(category, id)
        setLoading(true)
        setItem(itemData)
        setMainImage(itemData.images[0])
      } catch(error) {
          console.error(error)
          setError(error)
      } finally {
          setLoading(false)
      }
    } 
    loadItem()
  }, [id, category])



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
          <div className="item-detail-images-container">
          {
            !isSmallScreen && (
              <div classname="item-detail-main-img">
                <img src={mainImage} alt="main-image"/>
              </div>
            )
          }
          <div className="item-detail-images">
              {item.images && item.images.map((image, i) => <img
                                                         key={image} 
                                                         src={image} 
                                                         alt="item"
                                                         className='item-detail-img'
                                                         ref={imgRefs.current[i]}
                                                         onClick={() => setMainImage(image)}
                                                         style={image === mainImage ? {opacity: '1'} : null}
                                                        />)
              }
          </div>
          </div>
          <div className='item-detail-info'>
            <div className="item-detail-basic">
              <h4>{item.name}</h4>
              <p>{item?.price?.toLocaleString()} RSD</p>
              <p>*{item.color}</p>
            </div>
            <div className="item-detail-description">
              {item.description}
            </div>
            <div className="item-detail-sizes">
              {item?.sizes?.map(size => <button 
                                          key={size} 
                                          onClick={() => setSelectedSize(size)}
                                          className={selectedSize === size ? 'black-btn' : ''}>{size}</button>)
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